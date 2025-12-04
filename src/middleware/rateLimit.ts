import rateLimit from 'express-rate-limit';

// Rate limiting para APIs públicas
export const publicApiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // máximo 100 requisições por IP
  message: {
    success: false,
    error: 'Muitas requisições. Tente novamente em alguns minutos.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Muitas requisições. Tente novamente em alguns minutos.',
      retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
    });
  }
});

// Rate limiting mais restritivo para endpoints específicos
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 requisições por IP
  message: {
    success: false,
    error: 'Muitas requisições. Tente novamente em 15 minutos.',
    retryAfter: 900
  }
});

export default publicApiLimiter;
