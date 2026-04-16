# YogaRishikesh.com — Premium Yoga Booking Platform

Build for the Yoga Capital of the world, Rishikesh, India. Better and faster than BookRetreats.com and BookYogaRetreat.com.

## Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **UI Components**: Radix UI + Lucide React

## Project Structure
- `apps/web`: The Next.js application
- `packages/database`: Prisma schema and database client
- `packages/ui`: Shared design system and Tailwind configuration

## Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database

### 2. Installation
```bash
npm install
```

### 3. Database Setup
Create a `.env` file in `packages/database` with your `DATABASE_URL`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/yogarishikesh"
```
Then sync the schema:
```bash
npm run db:push
```

### 4. Run Development Server
```bash
npm run dev
```

## Deployment
Recommended: **Vercel** for frontend and **Neon/Railway** for PostgreSQL.
