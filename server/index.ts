import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { envCheck } from './lib/env-check';
import { metricsRouter } from './routes/metrics'; // optional placeholder if you have a metrics route
import { adminRouter } from './routes/admin';
import { billingRouter } from './routes/billing';
import { stripeWebhookRouter } from './routes/stripe-webhook';

const app = express();
app.use(cors());
app.use(morgan('tiny'));

envCheck();

// IMPORTANT: mount Stripe webhook (raw body) BEFORE express.json()
app.use('/webhooks/stripe', stripeWebhookRouter);

// Regular JSON parsing for the rest
app.use(express.json());

app.get('/healthz', (req, res) => res.json({ ok: true, ts: Date.now() }));

// Mount only if implemented in your repo
if (metricsRouter) app.use('/api/metrics', metricsRouter as any);
app.use('/api/admin', adminRouter);
app.use('/api/billing', billingRouter);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`[server] listening on :${port}`));
