import express from 'express';
import { sendEvent } from './events/events';
import { fetchStats } from './stats/stats';

const router = express.Router();

router.get('/stats', async (_req, res) => {
  const stats = await fetchStats();

  await sendEvent('self-hosted-cloud-pricing-api-stats-view');

  return res.json(stats);
});

export default router;
