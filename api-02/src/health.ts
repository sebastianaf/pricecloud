import express from 'express';
import config from './config';

const router = express.Router();

router.get('/health', async (_req, res) => {
  try {
    const pool = await config.pg();
    await pool.query('SELECT 1');
  } catch (err) {
    config.logger.error(`Could not connect to database: ${err}`);
    res.status(500).json({ status: 'failed' });
    return;
  }
  res.status(200).json({ status: 'success' });
});

export default router;
