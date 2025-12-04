import cors from 'cors';

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Permitir requisições sem origin (como mobile apps ou Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:5174', // VibesFilm Blog (porta atual)
      'http://localhost:5175', // VibesFilm Blog (porta alternativa)
      'http://localhost:5173', // Outros blogs
      'http://localhost:3000', // Admin Platform
      'http://localhost:3001', // API Backend
      'http://localhost:3002'  // CicloePonto Blog
    ];
    
    console.log(`🔍 Verificando CORS para origin: ${origin}`);
    console.log(`📋 Origens permitidas:`, allowedOrigins);
    
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS permitido para: ${origin}`);
      callback(null, true);
    } else {
      console.log(`🚫 CORS bloqueado para origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

export const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
