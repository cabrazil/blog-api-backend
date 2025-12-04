import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log da requisição
  console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  
  // Log dos parâmetros de query (exceto dados sensíveis)
  if (Object.keys(req.query).length > 0) {
    console.log(`🔍 Query params:`, req.query);
  }
  
  // Interceptar resposta para log
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    console.log(`✅ ${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    // Log de erro se status >= 400
    if (res.statusCode >= 400) {
      console.error(`❌ Erro ${res.statusCode}:`, data);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

export default logger;
