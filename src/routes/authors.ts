import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/blogs/:id/authors - Listar autores de um blog
router.get('/blogs/:id/authors', async (req: Request, res: Response) => {
  try {
    const blogId = parseInt(req.params.id);

    if (isNaN(blogId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do blog inválido'
      } as ApiResponse);
    }

    // Buscar autores do blog que têm artigos publicados
    const authors = await prisma.author.findMany({
      where: { 
        blogId,
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
        role: true,
        imageUrl: true,
        bio: true,
        website: true,
        social: true,
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

    console.log(`👥 Autores encontrados para blog ${blogId}: ${authors.length}`);

    return res.json({
      success: true,
      data: {
        authors
      }
    } as ApiResponse);

  } catch (error) {
    console.error('❌ Erro ao buscar autores:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

export default router;
