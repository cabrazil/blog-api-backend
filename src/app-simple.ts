import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware básico
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Blog API Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Rota de teste simples
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test route working'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Blog API Backend (Simple) rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

export default app;
