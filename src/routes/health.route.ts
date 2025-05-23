import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Simple health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: App is healthy
 */
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Healthy' });
});

export default router;
