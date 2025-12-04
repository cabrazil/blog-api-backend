import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Testar middlewares um por vez
app.use(express.json());

// Teste 1: Apenas helmet
console.log('🔧 Testando helmet...');
app.use(helmet());

// Teste 2: Adicionar compression
console.log('🔧 Testando compression...');
app.use(compression());

// Teste 3: Adicionar CORS
console.log('🔧 Testando CORS...');
app.use(cors());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server with middleware running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server with middleware running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
