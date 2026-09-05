# Government Directory

A mobile-first Progressive Web App: a centralized, sector-wise and
department-wise directory for the Government of Madhya Pradesh.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM + PostgreSQL (Neon / Vercel Postgres free tier)
- Hardcoded-but-changeable login (2 roles: Data Entry, General) via signed
  cookie sessions — no external auth provider needed
- Installable PWA (manifest + service worker)

## Local setup

1. Create a free Supabase project (see deployment guide) and copy `.env.example`
   to `.env`, filling in:
   - `DATABASE_URL` — the Supabase **Transaction pooler** connection string
     (port 6543)
   - `DIRECT_URL` — the Supabase **Direct connection** string (port 5432,
     used only for migrations)
   - `SESSION_SECRET` — any long random string
2. Install dependencies and set up the database:

   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   ```

3. Run the app:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 and sign in with one of the seeded accounts:
   - `admin` / `admin123` — Data Entry User (can add/edit/deactivate records)
   - `user` / `user123` — General User (read-only)

   Change these immediately from **Account → Change Password** after first
   login.

## Data model

```
Sector
  └── Department (parentId = null)      "Parent Department"
        └── Department (parentId = id)  "Sub Department / Board / Corporation / Institution"
              └── ContactPerson (many)
```

Both parent departments and sub-departments share the same `Department`
table/detail page, so the hierarchy is fully data-driven — no code changes
are needed to add new sectors, departments or organisations.

## Deployment

See the step-by-step deployment guide provided alongside this project for
deploying to Vercel's free tier with a free Neon Postgres database.
