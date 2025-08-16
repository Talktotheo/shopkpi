import Stripe from 'stripe';
import { Router } from 'express';
export const billingRouter = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

async function resolvePriceId(interval: 'monthly'|'yearly') {
  // Prefer explicit price envs
  const priceEnv = interval === 'yearly' ? process.env.STRIPE_PRICE_YEARLY : process.env.STRIPE_PRICE_MONTHLY;
  if (priceEnv) return priceEnv;

  // Fall back to product envs and look up the active recurring price
  const productId = interval === 'yearly' ? process.env.STRIPE_PRODUCT_YEARLY : process.env.STRIPE_PRODUCT_MONTHLY;
  if (!productId) throw new Error(`Missing Stripe price or product for ${interval}`);

  // Try default_price first
  const product = await stripe.products.retrieve(productId);
  const def = product.default_price as string | null;
  if (def) return def;

  // Otherwise list prices for this product and interval
  const prices = await stripe.prices.list({ product: productId, active: true, limit: 10 });
  const match = prices.data.find(p => p.recurring?.interval === (interval === 'yearly' ? 'year' : 'month'));
  if (!match) throw new Error(`No active ${interval} price found for product ${productId}`);
  return match.id;
}

billingRouter.post('/checkout', async (req, res) => {
  try {
    const { groupId, seats = 5, interval = 'monthly' } = req.body as { groupId: string; seats?: number; interval?: 'monthly'|'yearly' };
    if (!groupId) return res.status(400).json({ ok:false, error:'groupId required' });

    const priceId = await resolvePriceId(interval);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: seats }],
      success_url: `${process.env.PUBLIC_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_URL}/billing/cancel`,
      metadata: { groupId, interval }
    });
    res.json({ ok: true, url: session.url });
  } catch (e: any) {
    res.status(500).json({ ok:false, error: e.message });
  }
});
