import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { ApiResponse, ArticleQuery } from '../types';

const router = Router();

// GET /api/blogs/:id/articles/slug/:slug - Buscar artigo por slug (DEVE VIR ANTES)
router.get('/blogs/:id/articles/slug/:slug', async (req: Request, res: Response) => {
  try {
    const blogId = parseInt(req.params.id);
    const { slug } = req.params;

    if (isNaN(blogId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do blog inválido'
      } as ApiResponse);
    }

    const article = await prisma.article.findFirst({
      where: {
        blogId,
        slug,
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            imageUrl: true,
            bio: true
          }
        },
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Artigo não encontrado'
      } as ApiResponse);
    }

    // Incrementar view count
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } }
    });

    console.log(`📖 Artigo encontrado: ${article.title} (views: ${article.viewCount + 1})`);

    return res.json({
      success: true,
      data: { article }
    } as ApiResponse);

  } catch (error) {
    console.error('❌ Erro ao buscar artigo:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// GET /api/blogs/:id/articles - Listar artigos de um blog
router.get('/blogs/:id/articles', async (req: Request, res: Response) => {
  try {
    const blogId = parseInt(req.params.id);
    const {
      page = '1',
      limit = '10',
      category,
      tag,
      search,
      featured,
      published = 'true'
    } = req.query as ArticleQuery;

    if (isNaN(blogId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do blog inválido'
      } as ApiResponse);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {
      blogId,
      published: published === 'true'
    };

    // Filtro por categoria
    if (category) {
      where.category = {
        slug: category
      };
    }

    // Filtro por tag
    if (tag) {
      where.tags = {
        some: {
          slug: tag
        }
      };
    }

    // Filtro por busca
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filtro por featured (baseado em viewCount)
    if (featured === 'true') {
      where.viewCount = {
        gte: 100 // Artigos com mais de 100 visualizações
      };
    }

    // Buscar artigos com relacionamentos
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true,
              imageUrl: true,
              bio: true
            }
          },
          category: {
            select: {
              id: true,
              title: true,
              slug: true,
              description: true
            }
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          }
        },
        orderBy: { date: 'desc' },
        take: limitNum,
        skip: offset
      }),
      prisma.article.count({ where })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    console.log(`📰 Artigos encontrados para blog ${blogId}: ${articles.length}/${total}`);

    return res.json({
      success: true,
      data: {
        articles,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages
        }
      }
    } as ApiResponse);

  } catch (error) {
    console.error('❌ Erro ao buscar artigos:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

export default router;
