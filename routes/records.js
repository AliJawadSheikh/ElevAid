// This file currently handles all diagnosis-related endpoints.
// In a production HealthTech system, these could be separated into:
// - routes/diagnoses.js
// - routes/summaries.js
// - routes/notes.js
// This allows for domain-based scaling as features grow.

import express from 'express';
import { getDatabase } from '../config/database.js';

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     RecordInput:
 *       type: object
 *       required:
 *         - diagnosis
 *         - status
 *         - note
 *       properties:
 *         diagnosis:
 *           type: string
 *           description: Medical diagnosis
 *           example: "Hypertension"
 *         status:
 *           type: string
 *           description: Current status of the record
 *           example: "Active"
 *         note:
 *           type: string
 *           description: Additional notes about the record
 *           example: "Patient shows improvement"
 *     RecordResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Record created successfully"
 *         recordId:
 *           type: integer
 *           example: 1
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Validation error"
 *         message:
 *           type: string
 *           example: "All fields are required"
 */

/**
 * @swagger
 * /api/upload-record:
 *   post:
 *     summary: Upload a new medical record
 *     description: Creates a new record in the database with diagnosis, status, and note
 *     tags: [Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecordInput'
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecordResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/upload-record', (req, res) => {
  try {
    const { diagnosis, status, note } = req.body;

    // Validate all fields are present
    if (!diagnosis || !status || !note) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'All fields (diagnosis, status, note) are required'
      });
    }

    // Validate fields are not empty strings
    if (diagnosis.trim() === '' || status.trim() === '' || note.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'All fields must not be empty'
      });
    }

    // Get database instance
    const db = getDatabase();

    // Insert the record into the database
    const stmt = db.prepare(`
      INSERT INTO records (diagnosis, status, note, created_at, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(diagnosis.trim(), status.trim(), note.trim());

    // Return the inserted record ID
    res.status(201).json({
      success: true,
      message: 'Record created successfully',
      recordId: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'Failed to create record'
    });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ActiveProblem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Record ID
 *           example: 1
 *         diagnosis:
 *           type: string
 *           description: Medical diagnosis
 *           example: "Hypertension"
 *     ActiveProblemsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         problems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ActiveProblem'
 *         count:
 *           type: integer
 *           description: Number of active problems
 *           example: 2
 */

/**
 * @swagger
 * /api/problems/active:
 *   get:
 *     summary: Get all active problems
 *     description: Retrieves all records with status "active" and returns their ID and diagnosis
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: Active problems retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActiveProblemsResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/problems/active', (req, res) => {
  try {
    // Get database instance
    const db = getDatabase();

    // Query all records with status "active" (case-insensitive)
    const stmt = db.prepare(`
      SELECT id, diagnosis 
      FROM records 
      WHERE LOWER(status) = LOWER(?)
      ORDER BY id ASC
    `);

    const problems = stmt.all('active');

    // Return the array of objects with id and diagnosis
    res.json({
      success: true,
      problems: problems,
      count: problems.length
    });

  } catch (error) {
    console.error('Error fetching active problems:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'Failed to fetch active problems'
    });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ResolvedProblem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Record ID
 *           example: 2
 *         diagnosis:
 *           type: string
 *           description: Medical diagnosis
 *           example: "Common Cold"
 *     ResolvedProblemsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         problems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ResolvedProblem'
 *         count:
 *           type: integer
 *           description: Number of resolved problems
 *           example: 1
 */

/**
 * @swagger
 * /api/problems/resolved:
 *   get:
 *     summary: Get all resolved problems
 *     description: Retrieves all records with status "resolved" and returns their ID and diagnosis
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: Resolved problems retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResolvedProblemsResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/problems/resolved', (req, res) => {
  try {
    // Get database instance
    const db = getDatabase();

    // Query all records with status "resolved" (case-insensitive)
    const stmt = db.prepare(`
      SELECT id, diagnosis 
      FROM records 
      WHERE LOWER(status) = LOWER(?)
      ORDER BY id ASC
    `);

    const problems = stmt.all('resolved');

    // Return the array of objects with id and diagnosis
    res.json({
      success: true,
      problems: problems,
      count: problems.length
    });

  } catch (error) {
    console.error('Error fetching resolved problems:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'Failed to fetch resolved problems'
    });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ProblemSummary:
 *       type: object
 *       properties:
 *         original_note:
 *           type: string
 *           description: Original medical note
 *           example: "Patient shows improvement in blood pressure readings"
 *         ai_summary:
 *           type: string
 *           description: AI-generated layman summary
 *           example: "The patient's blood pressure has gotten better"
 *     ProblemSummaryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/ProblemSummary'
 */

/**
 * @swagger
 * /api/problem-summary/{id}:
 *   get:
 *     summary: Get AI summary of a problem
 *     description: Retrieves a record by ID and generates an AI summary of the note in layman terms
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Record ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Problem summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemSummaryResponse'
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/problem-summary/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Valid record ID is required'
      });
    }

    // Get database instance
    const db = getDatabase();

    // Retrieve the record with the given ID
    const stmt = db.prepare(`
      SELECT id, note 
      FROM records 
      WHERE id = ?
    `);

    const record = stmt.get(parseInt(id));

    // Check if record exists
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: `Record with ID ${id} not found`
      });
    }

    // Generate AI summary using Cursor prompt
    const aiSummary = await generateAISummary(record.note);

    // Return the original note and AI summary
    res.json({
      success: true,
      data: {
        original_note: record.note,
        ai_summary: aiSummary
      }
    });

  } catch (error) {
    console.error('Error generating problem summary:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'Failed to generate problem summary'
    });
  }
});

// AI summary generation function
async function generateAISummary(note) {
  try {
    // This is a placeholder for the AI integration
    // In a real implementation, you would call an AI service here
    // For now, we'll create a simple summary transformation
    
    const summary = note
      .toLowerCase()
      .replace(/patient shows improvement/gi, 'the patient is getting better')
      .replace(/blood pressure/gi, 'blood pressure')
      .replace(/readings/gi, 'measurements')
      .replace(/symptoms/gi, 'signs of illness')
      .replace(/diagnosis/gi, 'medical condition')
      .replace(/treatment/gi, 'care plan')
      .replace(/medication/gi, 'medicine')
      .replace(/prescribed/gi, 'given')
      .replace(/administered/gi, 'given')
      .replace(/monitoring/gi, 'watching')
      .replace(/follow-up/gi, 'next visit')
      .replace(/appointment/gi, 'visit')
      .replace(/consultation/gi, 'doctor visit');

    return summary.charAt(0).toUpperCase() + summary.slice(1);
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return 'Unable to generate summary at this time.';
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SearchResult:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Record ID
 *           example: 1
 *         diagnosis:
 *           type: string
 *           description: Medical diagnosis
 *           example: "Hypertension"
 *         status:
 *           type: string
 *           description: Record status
 *           example: "Active"
 *         note:
 *           type: string
 *           description: Medical note
 *           example: "Patient shows improvement"
 *     SearchResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SearchResult'
 *         count:
 *           type: integer
 *           description: Number of search results
 *           example: 2
 *         query:
 *           type: string
 *           description: Search query used
 *           example: "hypertension"
 */

/**
 * @swagger
 * /api/problems/search:
 *   get:
 *     summary: Search problems by diagnosis or note
 *     description: Searches all records for the given query term in diagnosis or note fields (case-insensitive)
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query term
 *         example: "hypertension"
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       400:
 *         description: Missing search query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/problems/search', (req, res) => {
  try {
    const { q } = req.query;

    // Validate search query parameter
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Search query parameter "q" is required'
      });
    }

    // Get database instance
    const db = getDatabase();

    // Search records where diagnosis or note contains the search term (case-insensitive)
    const stmt = db.prepare(`
      SELECT id, diagnosis, status, note
      FROM records 
      WHERE LOWER(diagnosis) LIKE LOWER(?) 
         OR LOWER(note) LIKE LOWER(?)
      ORDER BY id ASC
    `);

    const searchTerm = `%${q.trim()}%`;
    const results = stmt.all(searchTerm, searchTerm);

    // Return the search results
    res.json({
      success: true,
      results: results,
      count: results.length,
      query: q.trim()
    });

  } catch (error) {
    console.error('Error searching problems:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'Failed to search problems'
    });
  }
});

export default router; 