import express from 'express';
import { incrementCounters } from './stats/stats';
import { forwardEvent } from './events/events';

const router = express.Router();

router.post('/event', async (req, res) => {
  if (req.body.event === 'infracost-run') {
    const isCi = !!req.body?.env?.ciPlatform;
    const installId = req.body?.env?.installId;

    incrementCounters(isCi, installId);
  }

  await forwardEvent(req);

  return res.json({ status: 'ok' });
});

export default router;
