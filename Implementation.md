# Save-It-Here Implementation Plan

This document outlines the step-by-step implementation phases for the Save-It-Here project based on the Technical Design Document (TDD).

## Phase 1: Foundation & Infrastructure (✅ Completed)
- Initialize Monorepo (Turborepo).
- Setup `apps/web` (React 19 + Vite + Tailwind CSS v4).
- Setup `apps/api` (Node.js + Hono + TypeScript).
- Setup `packages/shared` (Zod schemas, types).
- Define Neo-Brutalist design tokens.

## Phase 2: Data Layer & Core Entities (✅ Completed)
- Provision PostgreSQL Database.
- Setup Prisma ORM and define core `schema.prisma`.
- Generate Prisma Client.
- Implement base CRUD for `Transaction` and `Idea` models.

## Phase 3: Core Dashboards UI (✅ Completed)
- Build Global Dashboard Layout (Sidebar, TopBar).
- Implement Finance Dashboard Widgets (Marquee Ticker, Summary Block, Budget Gauge, Ledger).
- Integrate React Query (`@tanstack/react-query`).
- Wire Finance UI to initial `transactions` endpoints.

## Phase 4: Discovery & Second Brain UI (✅ Completed)
- Implement Ideas Kanban Board with `@hello-pangea/dnd` for drag-and-drop.
- Implement Social Archives using `react-masonry-css` for staggered grids.
- Implement Universal Wishlist Grid.

## Phase 5: Secondary Backend APIs (✅ Completed)
- Implement Wishlist API (`GET`, `POST`, `PATCH`, `DELETE`).
- Implement Archives API (`GET`, `POST`, `DELETE`).
- Wire UI modules to fetch real data from these endpoints.

---

## Phase 6: Finance & Wealth Tracking Completion
1. **Accounts & Categories API**: Implement CRUD for `Account` and `Category`.
2. **Advanced Transactions**: Implement transaction splits, refunds, and group expenses.
3. **Dashboard Aggregations API**: Implement `/api/v1/dashboard/financial` to compute accurate budget gauges and daily trends.
4. **Lending Ledger**: Implement API and UI for Lending/Borrowing and Repayments.
5. **Investments & Goals**: Implement API and UI for Investment tracking and Savings Goals.

## Phase 7: Media Discovery & Metadata Extraction
1. **OpenGraph Parser**: Implement URL parsing fallback (`open-graph-scraper`).
2. **TMDB & Google Books APIs**: Integrate external APIs for rich media discovery.
3. **Chrome Extension (v1)**: Build Manifest V3 extension to capture Instagram/Twitter DOM data directly and send to the API.

## Phase 8: Search & Optimization
1. **PostgreSQL Full-Text Search**: Implement `Generated Columns` with `GIN` indexes for instant search.
2. **Search API**: Implement `/api/v1/search` across all modules.
3. **Media Storage**: Implement Cloudflare R2 upload for images/assets to prevent link rot.

## Phase 9: Authentication & Security
1. **JWT Auth**: Implement single-user PIN/Password login.
2. **Rate Limiting**: Implement Upstash Redis rate limiting.
3. **Deployment Prep**: Configure Vercel (Web + API) and Supabase (DB) production environments.
