# YogaRishikesh / Pranayama

YogaRishikesh is a multi-role yoga marketplace for Rishikesh, India. It supports public discovery, student bookings, school-admin course management, and super-admin content and approval workflows.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + PostgreSQL
- NextAuth.js v4
- Zod

## Repo Layout

- `apps/web`: main Next.js application
- `packages/database`: Prisma schema, seed, and shared Prisma client
- `packages/ui`: shared styling assets

## Setup

1. Clone the repository.
2. Copy `.env.example` to `.env` at the repository root and fill in the required values.
3. Install dependencies:

```bash
npm install
```

4. Generate and apply the Prisma schema:

```bash
npm run db:generate
npm run db:push
```

5. Seed the database:

```bash
npm run db:seed
```

6. Start the app:

```bash
npm run dev
```

7. Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Seeded Credentials

- Super Admin: `admin@yogarishikesh.com` / `Admin@123456`
- Approved School Admin: `ganga.flow@example.com` / `School@123`
- Approved School Admin: `satva.roots@example.com` / `School@123`
- Pending School Admin: `kriya.shakti@example.com` / `School@123` (inactive until approved)
- Approved Student: `aarav.malhotra@example.com` / `Student@123`
- Approved Student: `emily.carter@example.com` / `Student@123`
- Pending Student: `noah.brooks@example.com` / `Student@123` (inactive until approved)
