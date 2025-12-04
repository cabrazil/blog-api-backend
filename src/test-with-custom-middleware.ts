import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = 3001;

// Middlewares básicos
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

// Teste 1: Rate limiting
console.log('🔧 Testando rate limiting...');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: {
    success: false,
    error: 'Muitas requisições. Tente novamente em alguns minutos.'
  }
});
app.use(limiter);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server with custom middleware running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server with custom middleware running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
