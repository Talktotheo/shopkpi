import { Router } from 'express';
import { purgeCache } from '../lib/cache';

export const adminRouter = Router();

adminRouter.post('/purge-cache', (req, res) => {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_KEY) return res.status(401).json({ ok:false });
  const { cacheKey } = (req.body || {}) as { cacheKey?: string };
  purgeCache(cacheKey);
  res.json({ ok:true });
});
