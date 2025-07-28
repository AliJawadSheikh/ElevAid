# ElevAid Backend

A modern Express.js backend API built with ES modules, SQLite database, and comprehensive Swagger documentation.

## Features

- 🚀 **Express.js** with ES modules
- 🗄️ **SQLite** database using better-sqlite3
- 🌐 **CORS** enabled for cross-origin requests
- 📚 **Swagger/OpenAPI** documentation
- 🔧 **Body-parser** middleware for JSON and URL-encoded data
- 🛡️ **Error handling** and graceful shutdown

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

## Project Structure

```
ElevAid/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── config/
│   └── database.js        # Database configuration
├── routes/
│   └── index.js           # API routes
├── database.sqlite        # SQLite database (created on first run)
└── README.md              # This file
```

## Development

### Adding New Routes

1. Create a new route file in the `routes/` directory
2. Import and use the router in `server.js`
3. Add Swagger documentation comments to your endpoints

### Example Route Structure

```javascript
import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /api/example:
 *   get:
 *     summary: Example endpoint
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/example', (req, res) => {
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
- Graceful shutdown on SIGINT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License 