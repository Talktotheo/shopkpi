import Stripe from 'stripe';
import express from 'express';
export const stripeWebhookRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

stripeWebhookRouter.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.WEBHOOK_SECRET!);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as any).message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as Stripe.Checkout.Session;
    const groupId = (s.metadata as any)?.groupId as string | undefined;
    const subsId = s.subscription as string;
    const custId = s.customer as string;
    // TODO: upsert licenses for groupId with stripe ids
    // update licenses set stripe_customer_id=custId, stripe_subscription_id=subsId where group_id=groupId
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const sub = event.data.object as Stripe.Subscription;
    const item = sub.items.data[0];
    const quantity = item?.quantity || 1;
    const price = item?.price;
    const plan = price?.recurring?.interval === 'year' ? 'yearly' : 'monthly';
    // TODO: update licenses set max_seats = quantity, plan=plan where stripe_subscription_id=sub.id
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    // TODO: disable or zero out seats for that group: set max_seats=0 where stripe_subscription_id=sub.id
  }

  res.json({ received: true });
});
