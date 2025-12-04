import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Minimal TypeScript server running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Minimal TypeScript server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
