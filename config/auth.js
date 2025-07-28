// Authentication configuration
export const API_TOKEN = 'elevaid-secure-token-2025';

// Token validation middleware
export const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'API token is required in Authorization header'
    });
  }

  // Check for Bearer token format
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : authHeader;

  if (token !== API_TOKEN) {
    return res.status(403).json({
      success: false,
      error: 'Invalid token',
      message: 'Invalid or expired API token'
    });
  }

  next();
};

// Optional: Add token to Swagger documentation
export const swaggerAuthConfig = {
  securityDefinitions: {
    ApiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'API token for authentication'
    }
  },
  security: [
    {
      ApiKeyAuth: []
    }
  ]
}; 