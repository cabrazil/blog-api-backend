import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/blogs/:id/settings - Buscar configurações de tema de um blog
router.get('/blogs/:id/settings', async (req: Request, res: Response) => {
  try {
    const blogId = parseInt(req.params.id);

    if (isNaN(blogId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do blog inválido'
      } as ApiResponse);
    }

    const blog = await prisma.blog.findUnique({
      where: { 
        id: blogId
      },
      select: {
        themeSettingsJson: true
      }
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog não encontrado ou sem configurações de tema'
      } as ApiResponse);
    }

    console.log(`⚙️ Configurações de tema encontradas para blog ${blogId}`);

    // O 'themeSettingsJson' já é um objeto JSON, então podemos retorná-lo diretamente.
    return res.json({
      success: true,
      data: {
        themeSettings: blog.themeSettingsJson
      }
    } as ApiResponse);

  } catch (error) {
    console.error('❌ Erro ao buscar configurações do tema:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// PUT /api/blogs/:id/settings - Atualizar configurações de tema de um blog
router.put('/blogs/:id/settings', async (req: Request, res: Response) => {
  try {
    const blogId = parseInt(req.params.id);
    const { themeSettings } = req.body;

    if (isNaN(blogId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do blog inválido'
      } as ApiResponse);
    }

    if (!themeSettings || typeof themeSettings !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Configurações de tema são obrigatórias e devem ser um objeto válido'
      } as ApiResponse);
    }

    // Verificar se o blog existe
    const existingBlog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { id: true, name: true }
    });

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        error: 'Blog não encontrado'
      } as ApiResponse);
    }

    // Atualizar as configurações de tema
    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        themeSettingsJson: themeSettings,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        themeSettingsJson: true,
        updatedAt: true
      }
    });

    console.log(`✅ Configurações de tema atualizadas para blog ${blogId}: ${existingBlog.name}`);

    return res.json({
      success: true,
      data: {
        blogId: updatedBlog.id,
        blogName: updatedBlog.name,
        themeSettings: updatedBlog.themeSettingsJson,
        updatedAt: updatedBlog.updatedAt
      },
      message: 'Configurações de tema atualizadas com sucesso'
    } as ApiResponse);

  } catch (error) {
    console.error('❌ Erro ao atualizar configurações do tema:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

export default router;
