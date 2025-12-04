import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/blogs/:id/tags - Listar tags de um blog
router.get('/blogs/:id/tags', async (req: Request, res: Response) => {
  try {
    const blogId = parseInt(req.params.id);

    if (isNaN(blogId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do blog inválido'
      } as ApiResponse);
    }

    // Buscar tags do blog
    const tags = await prisma.tag.findMany({
      where: { 
        blogId,
        // Apenas tags que têm artigos publicados
        articles: {
          some: {
            published: true
          }
        }
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        _count: {
          select: {
            articles: {
              where: {
                published: true
              }
            }
          }
        }
      }
    });

    console.log(`🏷️ Tags encontradas para blog ${blogId}: ${tags.length}`);

    return res.json({
      success: true,
      data: {
        tags
      }
    } as ApiResponse);

  } catch (error) {
    console.error('❌ Erro ao buscar tags:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

export default router;
