import { Router } from 'express';
export const metricsRouter = Router();
metricsRouter.get('/', async (_req, res) => {
  res.json({ ok: true, data: { message: 'metrics placeholder' } });
});
