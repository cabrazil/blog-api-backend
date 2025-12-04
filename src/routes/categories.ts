import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/blogs/:id/categories - Listar categorias de um blog
router.get('/blogs/:id/categories', async (req: Request, res: Response) => {
  try {
    const blogId = parseInt(req.params.id);

    if (isNaN(blogId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do blog inválido'
      } as ApiResponse);
    }

    // Buscar categorias do blog
    const categories = await prisma.category.findMany({
      where: { 
        blogId
      },
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        createdAt: true,
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

    // Remover duplicatas baseado no título, mantendo a mais recente
    const categoriesMap = new Map();
    categories.forEach(category => {
      if (!categoriesMap.has(category.title) || 
          new Date(category.createdAt) > new Date(categoriesMap.get(category.title).createdAt)) {
        categoriesMap.set(category.title, category);
      }
    });

    const uniqueCategories = Array.from(categoriesMap.values()).sort((a, b) => 
      a.title.localeCompare(b.title)
    );

    console.log(`📂 Categorias encontradas para blog ${blogId}: ${uniqueCategories.length}`);

    return res.json({
      success: true,
      data: {
        categories: uniqueCategories
      }
    } as ApiResponse);

  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

export default router;
