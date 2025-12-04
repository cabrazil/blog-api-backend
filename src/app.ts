// Carregar variáveis de ambiente primeiro
import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import corsMiddleware from './middleware/cors';
import { publicApiLimiter } from './middleware/rateLimit';
import logger from './middleware/logger';

// Importar rotas
import articlesRouter from './routes/articles';
import categoriesRouter from './routes/categories';
import tagsRouter from './routes/tags';
import authorsRouter from './routes/authors';
import blogSettingsRouter from './routes/blogSettings';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança e performance
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use(corsMiddleware);

// Rate limiting
app.use('/api/', publicApiLimiter);

// Logging
app.use(logger);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Blog API Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api', articlesRouter);
app.use('/api', categoriesRouter);
app.use('/api', tagsRouter);
app.use('/api', authorsRouter);
app.use('/api', blogSettingsRouter);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API routes commented for debugging'
  });
});

// Rota de debug para blog settings
app.get('/api/debug/blog/:id/settings', async (req, res) => {
  try {
    const blogId = parseInt(req.params.id);
    const { prisma } = await import('./services/prisma');
    
    console.log(`🔍 Buscando blog ID: ${blogId}`);
    
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        name: true,
        themeSettingsJson: true
      }
    });
    
    console.log(`📋 Blog encontrado:`, blog);
    
    if (!blog) {
      return res.json({
        success: false,
        error: `Blog ID ${blogId} não encontrado`
      });
    }
    
    return res.json({
      success: true,
      data: {
        blog,
        themeSettings: blog.themeSettingsJson
      }
    });
  } catch (error) {
    console.error('❌ Erro no debug settings:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});


// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado',
    path: req.originalUrl
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Erro não tratado:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Blog API Backend rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? '✅ Configurado' : '❌ Não configurado'}`);
});

export default app;
