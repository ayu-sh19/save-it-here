# Save-It-Here Project Tracker

Track the granular progress of the project here. Update the checkboxes `[x]` as tasks are completed.

## Phase 6: Finance & Wealth Tracking Completion

### Backend API
- [x] Implement `GET`, `POST`, `PUT` `/api/v1/accounts`
- [x] Implement `GET`, `PUT` `/api/v1/categories`
- [x] Implement `GET /api/v1/dashboard/financial` (Aggregations)
- [x] Implement Lending Ledger API (`GET /api/v1/lending`, `POST /repayment`)
- [x] Implement Investments API (`GET`, `POST`, entries)
- [x] Implement Savings Goals API

### Frontend UI
- [x] Connect Dashboard Budget Gauge to API
- [x] Connect Dashboard Daily Spend Trend to API
- [x] Build "Accounts & Categories" Management Page
- [x] Build "Lending Ledger" View
- [x] Build "Investments Portfolio" View

---

## Phase 7: Media Discovery & Metadata Extraction

### Backend API
- [x] Integrate `open-graph-scraper` for generic URL parsing
- [x] Integrate TMDB API (`/api/v1/discover/movies`, etc.)
- [x] Integrate Google Books API (`/api/v1/discover/books`)
- [x] Add `check-duplicate` endpoints for Wishlist and Archives

### Chrome Extension
- [x] Initialize Chrome Extension project (Manifest V3)
- [x] Build Service Worker for API communication
- [x] Build Content Scripts for Instagram/Twitter scraping
- [x] Build Popup UI (React Mini-App)

---

## Phase 8: Full-Text Search Engine (PostgreSQL `tsvector`)
- [x] Add triggers to compute `search_vector` on insert/update for `Transaction`, `Idea`, `WishlistItem`, `ArchiveItem`
- [x] Build `/api/v1/search/global` endpoint to execute raw SQL `ts_rank` queries
- [x] Build `GlobalSearch` React component (Cmd + K Modal)
- [x] Implement search highlighting in results` (typeahead)
- [x] Integrate Cloudflare R2 for Image Storage

### Frontend UI
- [x] Build Global Search Overlay (Cmd+K interface)
- [x] Implement Search Debouncing & Results Rendering
- [x] Implement Lazy Loading and BlurHashes for images

---

## Phase 9: Authentication & Security

### Backend
- [ ] Implement `/api/v1/auth/login` (PIN/Password)
- [ ] Implement JWT generation & validation middleware
- [ ] Implement `/api/v1/auth/refresh` & `/logout`
- [ ] Integrate Upstash Redis for Rate Limiting

### Frontend UI
- [ ] Build Login Screen
- [ ] Setup Axios Interceptors for Auth Headers
- [ ] Implement Protected Routes pattern
