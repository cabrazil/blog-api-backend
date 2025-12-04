const express = require('express');

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Simple test server running',
    timestamp: new Date().toISOString()
  });
});

app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test route working'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple test server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
