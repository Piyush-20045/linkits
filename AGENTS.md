# AGENTS.md

## Stack

Single-package Next.js 16 (App Router) + React 19 + TypeScript app. Tailwind CSS v4 (no `tailwind.config`; theme lives in `app/globals.css`). shadcn/ui "new-york" style — add primitives via `npx shadcn@latest add <component>` into `components/ui/`. Path alias: `@/*` → repo root.

## Commands

```sh
npm run dev      # dev server
npm run lint     # eslint 9 flat config
npx next build   # includes type checking
```

No test framework exists — verification is lint + build.

**Known broken baseline:** as of Aug 2026, `npm run lint` (4 errors / 7 warnings) and `next build` both fail on `main`. Don't chase pre-existing errors; just don't add new ones in files you touch.

## Env

Copy `.env.example` → `.env.local`. Required: `MONGODB_URI`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_LOGO_DEV_KEY`, `NEXT_PUBLIC_APP_URL`.

## Architecture notes

- **Two Mongo clients — pick the right one:** `lib/mongodb.ts` exports a module-level raw `mongodb` driver promise used by the NextAuth MongoDBAdapter and direct `users`/`collections` collection queries. Mongoose (`connectDB()` in `lib/db.ts` + `models/Tool.ts`) is used **only** for the Tool model — call `await connectDB()` before any Mongoose query.
- **`proxy.ts` is the middleware file** (Next.js 16 renamed `middleware.ts` → `proxy.ts`). It guards `/dashboard` (requires session) and redirects logged-in users away from `/login`. Don't create a `middleware.ts`.
- **Next 16 route handler params are Promises:** dynamic routes must be typed `{ params: Promise<{ collectionId: string }> }` and awaited. The current build failure comes from `app/api/collections/[collectionId]/route.ts` using the old non-Promise shape — follow the Promise convention in any new code.
- Category filtering values are centralized in `constants/categories.ts`.
- Remote images are allowed only from `img.logo.dev` (`next.config.ts`).

## Conventions

- Commits follow Conventional Commits (`feat:`, `fix:`, `refactor:`).
