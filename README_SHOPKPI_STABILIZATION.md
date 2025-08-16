# ShopKPI Stabilization Pack

This pack wires Supabase + Stripe seats + trend charts without changing your page designs.

## What’s inside
- `.env.example` – all needed envs
- `server/` – Express routes: admin, billing (Checkout), Stripe webhook (raw body mount), plus tiny libs
- `src/` – Supabase client, ReportWork form, KpiTrend chart, react-query client
- `sql/shopkpi_schema.sql` – profiles/groups/members/licenses/work_logs + RLS + RPCs + trigger

## Apply the pack (GitHub web UI)
1. Create a new branch: **feat/stabilization-pack**.
2. Upload these files to the correct paths (keep existing code; no page redesigns).
3. Commit and open a PR.

## Supabase
- Auth → enable **Email OTP / Magic Links** and add redirect `https://shopkpi.com/*`.
- SQL Editor → run `sql/shopkpi_schema.sql`.
- Create a seed **group** row for your manager.

## Env (Replit → Secrets)
- Frontend: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Server: `SUPABASE_SERVICE_KEY`, `PUBLIC_URL`, `CACHE_TTL_SECONDS`, `ADMIN_KEY`
- Stripe: `STRIPE_SECRET_KEY`, (`STRIPE_PRICE_*` *or* `STRIPE_PRODUCT_*`), `WEBHOOK_SECRET`

## Stripe
- Dashboard → Webhooks → add endpoint `https://shopkpi.com/webhooks/stripe` (use the signing secret).
- Test Mode: run **monthly** & **yearly** Checkout; webhook updates `licenses`.

## Quick tests
- Magic-link login → Report Work form saves.
- User chart (daily/monthly/quarterly) shows data.
- Manager adds member → group chart aggregates.
- Seat limit enforced: cannot invite beyond seats.

> Important: `stripe-webhook.ts` must be mounted **before** `express.json()` and use `express.raw()`.
