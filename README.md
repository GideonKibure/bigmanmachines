# Mkushi Metal Works

A public website and workshop dashboard for a welding and fabrication business. Customers can browse services, projects, and products, and send a quotation request without an account. The owner manages customers, quotations, orders, production, stock, and cash. Employees see only the jobs assigned to them.

The business name, phone, address, and homepage text live in Settings. The seeded name is **Mkushi Metal Works** and the currency is **TZS**. Change both before you go live. The “10+” and “120+” figures on the homepage are marketing text, not totals calculated from orders.

## Stack

React, Vite, JavaScript, Tailwind CSS, React Router, Supabase (Postgres, Auth, Storage), Lucide, Recharts, and react-hot-toast.

The app uses the Supabase **anon** key only. Do not put the service role key in `.env.local` or in frontend code.

## Run it locally

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and fill in the two public values from Supabase → Project Settings → API:

```bash
copy .env.example .env.local
```

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. In the Supabase SQL editor, run these files in order:

- `supabase/migrations/001_schema.sql`
- `supabase/migrations/002_seed.sql`
- `supabase/migrations/003_record_transaction.sql`

4. Start the site:

```bash
npm run dev
```

Without the keys, the public pages still open in preview mode. Quotes, contact messages, and the dashboard do not save until Supabase is connected.

## First administrator

Public sign-up is not part of the app. New Auth users always receive the employee role.

1. In Supabase, open Authentication → Providers → Email and turn off “Confirm email” if you want passwords to work immediately. Users added from the dashboard are already confirmed.
2. Authentication → Users → Add user. Enter an email and password.
3. Run this in the SQL editor, with that person’s email:

```sql
update profiles set role = 'admin' where email = 'you@example.com';
```

4. Sign in at `/login`.
5. Open Team and add a person, then link the login if they should also appear as an employee.

## What each role can do

**Administrator:** customers, quotations, orders, projects, inventory, finance, reports, website content, team, and settings.

**Employee:** overview of assigned projects, production stages, notes, reference images, and material usage on those jobs. Financial tables, quotation margins, and settings are blocked in the database, not only hidden in the menu.

Stock quantities and quotation totals are written by database functions. A direct edit cannot change the quantity on hand.

## Storage

The schema creates four buckets:

| Bucket | Use |
| --- | --- |
| `public-assets` | Service, product, portfolio, and homepage images. Public read. |
| `quote-uploads` | Customer reference images. Private. |
| `receipts` | Payment and expense files. Private. |
| `project-files` | Job photos. Signed in staff can read them. |

Uploads are limited to 5 MB. Images must be JPG, PNG, or WebP. Receipts may also be PDF.

## How the money works

- **Agreed price** is the quotation total copied onto the order.
- **Cash received** is the sum of income transactions.
- **Outstanding** is agreed price minus cash received.
- **Cash profit** on the dashboard is all income minus all expenses.
- **Project profit** is the job price minus materials allocated, labour, and expenses linked to that project.

There is no online payment. Record deposits and final payments by hand. The dashboard calls `record_transaction`, which checks that the caller is an admin and writes the ledger row. Direct inserts into `transactions` are not allowed.

## How a job moves

1. A visitor submits a quote request and receives a reference such as `QR-2026-0001`.
2. You create a customer from that request, then build a quotation.
3. Costs plus margin become the amount due. If every customer line has a price, that sum becomes the amount due instead.
4. Accept the quotation. That creates an order and a project with eight production stages.
5. Assign an employee, move the stages, and record material used. Stock falls and the movement is stored.
6. Record payments against the order.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Deploy on Vercel

1. Push the project to Git and import it in Vercel.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the project environment.
3. Build command: `npm run build`. Output directory: `dist`.
4. `vercel.json` already rewrites every path to `index.html` so client-side routes work.

In Supabase → Authentication → URL configuration, add the Vercel domain to the site URL and redirect allow list.

## Checks worth doing

- Submit a quote on a phone-width window and confirm the reference number.
- Sign in as admin and as an employee. The employee should not see Finance.
- Accept a quotation and confirm the order and eight stages exist.
- Allocate more material than you have in stock and confirm the movement is refused.
- Record a deposit and confirm the order balance drops.
- Print a quotation and a report.
