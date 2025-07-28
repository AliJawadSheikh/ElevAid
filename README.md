# ElevAid Backend

A modern Express.js backend API built with ES modules, SQLite database, and comprehensive Swagger documentation.

## Features

- 🚀 **Express.js** with ES modules
- 🗄️ **SQLite** database using better-sqlite3
- 🌐 **CORS** enabled for cross-origin requests
- 📚 **Swagger/OpenAPI** documentation
- 🔧 **Body-parser** middleware for JSON and URL-encoded data
- 🛡️ **Error handling** and graceful shutdown
- 🔐 **API Token Authentication** for secure access
- ⚡ **Rate Limiting** to prevent abuse
- 🛡️ **Security Headers** with Helmet

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ElevAid
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Authentication

All API endpoints require authentication using an API token.

### API Token
- **Token**: `elevaid-secure-token-2025`
- **Header**: `Authorization: Bearer elevaid-secure-token-2025`

### Example Usage
```bash
curl -H "Authorization: Bearer elevaid-secure-token-2025" \
     http://localhost:3000/api/problems/active
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per 15 minutes
- **Upload operations**: 10 requests per 15 minutes
- **Search operations**: 30 requests per 5 minutes
- **AI Summary**: 5 requests per 10 minutes

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload
- `npm test` - Run tests (not configured yet)

## API Endpoints

### Base URL
- **Development**: `http://localhost:3000`

### Available Endpoints

- `GET /` - Welcome message and API information
- `GET /health` - Health check endpoint
- `GET /api` - API version and endpoint information
- `GET /api-docs` - Swagger documentation UI

### Protected Endpoints (Require Authentication)
- `POST /api/upload-record` - Create new medical record
- `GET /api/problems/active` - Get active problems
- `GET /api/problems/resolved` - Get resolved problems
- `GET /api/problem-summary/:id` - Get AI summary of a problem
- `GET /api/problems/search` - Search problems by diagnosis or note

## Database

The application uses SQLite with the `better-sqlite3` library. The database file (`database.sqlite`) will be created automatically when the server starts.

### Database Configuration

- **File**: `config/database.js`
- **Database file**: `database.sqlite` (created in project root)
- **Foreign keys**: Enabled by default

## API Documentation

Swagger documentation is available at `/api-docs` when the server is running. This provides:

- Interactive API documentation
- Request/response examples
- Schema definitions
- Try-it-out functionality
- Authentication configuration

## Security Features

- **API Token Authentication**: All endpoints require valid API token
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Security Headers**: Helmet.js for additional security
- **Input Validation**: Comprehensive validation for all inputs
- **Error Handling**: Secure error responses without sensitive data

## Project Structure

```
ElevAid/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── config/
│   ├── database.js        # Database configuration
│   ├── auth.js            # Authentication configuration
│   └── rateLimit.js       # Rate limiting configuration
├── routes/
│   ├── index.js           # Basic API routes
│   └── records.js         # Records management routes
├── database.sqlite        # SQLite database (created on first run)
├── README.md              # This file
├── prompts.md             # Development prompt history
└── api-diagrams.md        # API sequence diagrams
```

## Development

### Adding New Routes

1. Create a new route file in the `routes/` directory
2. Import and use the router in `server.js`
3. Add Swagger documentation comments to your endpoints
4. Apply appropriate rate limiting middleware

### Example Route Structure

```javascript
import express from 'express';
import { validateToken } from '../config/auth.js';
import { generalLimiter } from '../config/rateLimit.js';

const router = express.Router();

/**
 * @swagger
 * /api/example:
 *   get:
 *     summary: Example endpoint
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/example', generalLimiter, (req, res) => {
  res.json({ message: 'Example response' });
});

export default router;
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## Error Handling

The application includes comprehensive error handling:

- 404 errors for non-existent routes
- 500 errors for server errors
- 401 errors for missing authentication
- 403 errors for invalid tokens
- 429 errors for rate limit exceeded
- Graceful shutdown on SIGINT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License 