import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API information
 *     description: Returns basic information about the API
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ElevAid API v1.0.0"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
router.get('/', (req, res) => {
  res.json({
    message: 'ElevAid API v1.0.0',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      documentation: '/api-docs'
    }
  });
});

export default router; 