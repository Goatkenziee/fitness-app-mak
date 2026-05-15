# Fitness App MAK — Build Plan

## Goal
Build a detailed fitness tracking app with user authentication, dashboard, calorie tracker, workout logging, progress charts, and meal database.

## Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS 3
- **State Management:** Zustand (lightweight, persisted)
- **Authentication:** NextAuth.js with local DB (SQLite via better-sqlite3)
- **Database:** Prisma ORM + SQLite (local, no external dependencies)
- **Charts:** Recharts (visual progress tracking)
- **Deployment:** Vercel

## File Tree
- `app/layout.tsx` — root layout with auth wrapper
- `app/page.tsx` — landing/login page
- `app/dashboard/page.tsx` — main dashboard (charts, stats, quick actions)
- `app/tracker/page.tsx` — daily calorie/meal tracker interface
- `app/workouts/page.tsx` — workout logging & history
- `app/profile/page.tsx` — user settings, goals, preferences
- `app/api/auth/[...nextauth]/route.ts` — NextAuth setup
- `app/api/meals/route.ts` — meal CRUD + search
- `app/api/workouts/route.ts` — workout logging
- `app/api/stats/route.ts` — aggregated user stats
- `lib/auth.ts` — auth utilities
- `lib/db.ts` — Prisma client
- `lib/store.ts` — Zustand stores (user, meals, workouts)
- `components/Navbar.tsx` — navigation bar
- `components/Chart.tsx` — reusable chart component
- `components/MealCard.tsx` — meal display card
- `components/WorkoutCard.tsx` — workout display card
- `prisma/schema.prisma` — DB schema
- `package.json` — dependencies (NextAuth, Prisma, Recharts, bcrypt)
- `tsconfig.json` — TypeScript config
- `tailwind.config.ts` — Tailwind config
- `postcss.config.js` — PostCSS config
- `next.config.mjs` — Next.js config

## Data / API
- **Local SQLite DB** — users, meals, workouts, daily_logs
- **NextAuth** — JWT sessions (no external OAuth required)
- **Meal Database** — pre-seeded common foods + calorie values
- **Workout Types** — cardio, strength, flexibility, sports

## Open Questions (Defaults Picked)
- **Sign-up:** Email + password (bcrypt hashed). Defaults to open registration.
- **Calorie Goal:** Default 2000/day, user-editable in profile.
- **Meal Database:** 100+ common foods pre-loaded; users can add custom meals.
- **Workouts:** Support manual entry (exercise type, duration, intensity).
- **Progress Tracking:** Last 30 days of calorie intake + weight (optional weight logging).
- **UI Theme:** Dark mode default with light mode toggle in navbar.
