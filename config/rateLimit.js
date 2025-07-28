import rateLimit from 'express-rate-limit';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter limiter for upload operations
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 upload requests per windowMs
  message: {
    success: false,
    error: 'Upload rate limit exceeded',
    message: 'Too many upload requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Search rate limiter
export const searchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // Limit each IP to 30 search requests per windowMs
  message: {
    success: false,
    error: 'Search rate limit exceeded',
    message: 'Too many search requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI summary rate limiter (more restrictive due to potential costs)
export const aiSummaryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 AI summary requests per windowMs
  message: {
    success: false,
    error: 'AI summary rate limit exceeded',
    message: 'Too many AI summary requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 