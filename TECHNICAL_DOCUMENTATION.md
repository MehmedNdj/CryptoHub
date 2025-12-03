# CryptoHub - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Development Phases](#development-phases)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Frontend Structure](#frontend-structure)
8. [External APIs](#external-apis)
9. [Deployment Strategy](#deployment-strategy)

---

## Project Overview

**CryptoHub** is a comprehensive cryptocurrency platform that provides:
- Real-time market data and price tracking
- Categorized crypto news (long-term crypto news vs short-term trading news)
- Personal portfolio management with lending calculators
- Market sentiment analysis
- User authentication and personalized settings

**Target Users:** Crypto investors, traders, and enthusiasts who want a unified platform for news, data, and portfolio tracking.

---

## Technology Stack

### Frontend
- **Framework:** React 18+ with TypeScript
- **Styling:** TailwindCSS
- **State Management:** React Context API + Hooks
- **Charts:** Recharts or Chart.js
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Language:** TypeScript
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **CORS:** cors middleware
- **Environment Variables:** dotenv
- **Rate Limiting:** express-rate-limit
- **Security Headers:** helmet

### Database
- **Primary Database:** PostgreSQL 15+ (Neon.tech free tier)
- **Caching:** Redis 7+ (Upstash free tier)
- **Database Client:** pg library with connection pooling

### Background Jobs
- **Scheduler:** node-cron
- **Tasks (Optimized for Free Tier):**
  - Fetch crypto prices every 10 seconds (8,640 calls/day = 60% of CoinGecko)
  - Fetch detailed coin data (rotating through top 50 coins)
  - Fetch news articles every 24 minutes (60 calls/day = 60% of each API)
  - Clean old cache data daily
  - Generate portfolio snapshots for active users

### Development Tools
- **Package Manager:** npm or pnpm
- **Version Control:** Git
- **Code Quality:** ESLint + Prettier
- **API Testing:** Postman or Thunder Client

### Deployment (100% FREE)
- **Frontend:** Vercel (Free tier - 100GB bandwidth, unlimited requests)
- **Backend:** Render (Free tier - 750 hours/month, auto-sleep after 15 min)
- **Database:** Neon PostgreSQL (Free tier - 3GB storage, unlimited queries)
- **Redis:** Upstash (Free tier - 10k commands/day, 256MB storage)
- **Uptime Monitoring:** Cron-job.org (Free - prevents backend sleep)
- **Error Monitoring:** Sentry (Free tier - 5k events/month)
- **SSL:** Included free with all platforms

---

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌────────────┬────────────┬────────────┬────────────┐  │
│  │   Crypto   │  Trading   │   Market   │ Portfolio  │  │
│  │    Page    │    Page    │    Page    │    Page    │  │
│  └────────────┴────────────┴────────────┴────────────┘  │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Settings Page + Auth Pages              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────┬────────────────────────────────┘
                          │ HTTP/REST API (JWT Auth)
┌─────────────────────────▼────────────────────────────────┐
│                  BACKEND (Node.js + Express)             │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Routes: /auth, /news, /market, /portfolio       │   │
│  │  Middleware: JWT validation, Error handling      │   │
│  │  Controllers: Business logic                     │   │
│  │  Services: External API calls, DB operations     │   │
│  └──────────────────────────────────────────────────┘   │
└────┬─────────────────────────────────────────┬───────────┘
     │                                         │
┌────▼──────────────┐              ┌──────────▼───────────┐
│   PostgreSQL      │              │    Redis Cache       │
│                   │              │                      │
│ - users           │              │ - crypto_prices      │
│ - portfolio       │              │ - news_articles      │
│ - news_articles   │              │ - api_responses      │
│ - user_settings   │              │ - session_tokens     │
│ - watchlist       │              │                      │
└───────────────────┘              └──────────────────────┘
     ▲                                         ▲
     │                                         │
┌────┴─────────────────────────────────────────┴───────────┐
│           BACKGROUND WORKERS (node-cron)                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Job 1: Fetch prices every 10 seconds (top 100)     │ │
│  │ Job 2: Rotate detailed coin data (6 coins/min)     │ │
│  │ Job 3: Fetch news every 24 minutes                 │ │
│  │ Job 4: Categorize news & calculate sentiment       │ │
│  │ Job 5: Clean old data (daily at 3 AM)              │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│                   EXTERNAL APIs                          │
│  - CoinGecko API (prices, market data)                   │
│    └─ 8,640 calls/day (every 10 seconds) = 60% usage    │
│  - CryptoPanic API (crypto news)                         │
│    └─ 30 calls/day (every 24 minutes) = 30% usage       │
│  - NewsAPI (general crypto news)                         │
│    └─ 30 calls/day (every 24 minutes) = 30% usage       │
└──────────────────────────────────────────────────────────┘
```

### **Free Tier Resource Allocation (100 Daily Users)**

```
API Usage (60% of Free Limits):
├── CoinGecko: 8,640/14,400 calls per day (60%)
├── CryptoPanic: 30/100 calls per day (30%)
└── NewsAPI: 30/100 calls per day (30%)

Backend (Render Free - 512MB RAM, 0.1 CPU):
├── Memory Usage: ~181MB / 512MB (35%)
├── CPU Usage: 27% utilization
└── Bandwidth: ~920MB/day (unlimited)

Database (Neon Free - 3GB):
├── Storage: ~900MB / 3GB (30%)
├── Queries: ~10k/day (unlimited)
└── Growth: 300MB/month with cleanup

Redis (Upstash Free - 10k commands/day, 256MB):
├── Commands: ~414/day / 10k (4%) - optimized with batching
├── Storage: ~2MB / 256MB (1%)
└── TTL Strategy: 30s for prices, 1440s for news

Result: ALL FREE TIERS SUPPORTED ✅
```

---

## Development Phases

### **Phase 1: Foundation & Authentication (Week 1)**

**Goals:**
- Set up project structure
- Implement user authentication
- Database connection
- Basic frontend layout

**Tasks:**
1. Initialize backend project
   - Create Express app with TypeScript
   - Set up folder structure
   - Configure environment variables
   - Set up PostgreSQL connection
   - Set up Redis connection

2. Initialize frontend project
   - Create React app with Vite + TypeScript
   - Install TailwindCSS
   - Set up routing
   - Create basic layout components

3. Database setup
   - Create `users` table
   - Create `user_settings` table

4. Authentication system
   - Register endpoint (POST /api/auth/register)
   - Login endpoint (POST /api/auth/login)
   - JWT middleware for protected routes
   - Password hashing with bcrypt

5. Frontend auth pages
   - Login page
   - Register page
   - Protected route wrapper
   - Auth context for global state

6. Testing
   - Test registration flow
   - Test login flow
   - Test JWT validation

**Deliverable:** Working authentication system - users can register, login, and access protected routes.

---

### **Phase 2: Market Section (Week 2)**

**Goals:**
- Display real-time crypto prices
- Show basic price charts
- Implement caching strategy

**Tasks:**
1. Backend: Market data service
   - Integrate CoinGecko API
   - Create endpoint: GET /api/market/prices
   - Create endpoint: GET /api/market/coin/:id
   - Create endpoint: GET /api/market/chart/:id

2. Background worker: Price fetcher
   - Cron job to fetch top 100 coins every 1 minute
   - Store in Redis cache (TTL: 2 minutes)
   - Fallback to database if Redis fails

3. Database
   - Create `crypto_prices` table (for historical data)
   - Store daily snapshots for charts

4. Frontend: Market page
   - Price list component (table view)
   - Search/filter functionality
   - Price chart component (line chart)
   - Real-time price updates (polling every 10 seconds)

5. Styling
   - Responsive design
   - Price color indicators (green/red)
   - Loading states

**Deliverable:** Functional market page with live crypto prices and charts.

---

### **Phase 3: Portfolio Management (Week 3)**

**Goals:**
- Users can add crypto holdings
- Calculate portfolio value
- Display portfolio analytics

**Tasks:**
1. Database
   - Create `portfolio` table
   - Create `portfolio_history` table (daily snapshots)

2. Backend: Portfolio API
   - POST /api/portfolio/add (add holding)
   - GET /api/portfolio (get all holdings)
   - PUT /api/portfolio/:id (update holding)
   - DELETE /api/portfolio/:id (delete holding)
   - GET /api/portfolio/value (calculate total value)
   - GET /api/portfolio/history (historical value)

3. Portfolio calculation service
   - Fetch current prices from cache
   - Calculate: total_value = Σ(amount × current_price)
   - Calculate profit/loss if purchase price provided

4. Background worker
   - Daily cron job: Snapshot portfolio values for all users

5. Frontend: Portfolio page
   - Add holding form
   - Holdings list (editable)
   - Total portfolio value display
   - Portfolio chart (value over time)
   - Asset allocation pie chart

6. Lending calculator
   - Input: crypto, amount, APY, duration
   - Output: Projected earnings
   - Comparison with different platforms

**Deliverable:** Full portfolio tracker with value calculations and lending calculator.

---

### **Phase 4: Crypto News Section (Week 4)**

**Goals:**
- Aggregate crypto news from multiple sources
- Categorize as "crypto" news (long-term, fundamental)
- Display sentiment indicators

**Tasks:**
1. Database
   - Create `news_articles` table
   - Fields: id, title, summary, url, source, category, sentiment, published_at

2. Backend: News aggregation service
   - Integrate CryptoPanic API
   - Integrate NewsAPI
   - RSS feed parser (CoinDesk, Cointelegraph)

3. News categorization logic
   - Keyword-based categorization
   - Crypto keywords: "blockchain", "technology", "whitepaper", "development", "partnership", "roadmap"
   - Store category in database

4. Sentiment analysis
   - Simple keyword-based sentiment (positive/negative/neutral)
   - Keywords positive: "bullish", "surge", "growth", "partnership", "adoption"
   - Keywords negative: "bearish", "crash", "scam", "hack", "regulation"
   - Calculate sentiment score (-5 to +5)

5. Background worker
   - Cron job: Fetch news every 30 minutes
   - Process and categorize
   - Store in database
   - Cache recent articles in Redis

6. Backend API
   - GET /api/news/crypto (get crypto news)
   - GET /api/news/crypto/:coinId (news for specific coin)
   - Pagination support

7. Frontend: Crypto news page
   - News feed component (Twitter/X-like)
   - Article card with image, title, summary
   - Sentiment indicator badge
   - Filter by coin
   - Infinite scroll or pagination

**Deliverable:** Crypto news feed with categorized articles and sentiment.

---

### **Phase 5: Trading News Section (Week 5)**

**Goals:**
- Display trading-focused news
- Show liquidation data, M2 updates
- Sentiment for short-term trading

**Tasks:**
1. News categorization enhancement
   - Trading keywords: "liquidation", "M2", "fed", "interest rates", "volume", "breakout", "resistance"
   - Allow articles in both crypto AND trading categories

2. Backend API
   - GET /api/news/trading (get trading news)
   - Enhanced filtering

3. Special data sources
   - Liquidation data (from Coinglass API or similar)
   - M2 money supply (manual updates or macro APIs)

4. Frontend: Trading news page
   - Similar to crypto news but with trading focus
   - Special cards for liquidations
   - Market sentiment overview widget

**Deliverable:** Trading news section with short-term focused content.

---

### **Phase 6: Settings & Enhancements (Week 6)**

**Goals:**
- User settings page
- UI/UX improvements
- Additional features

**Tasks:**
1. Settings page
   - Account settings (email, password change)
   - App preferences (theme, currency)
   - Notification preferences

2. Dark mode
   - Toggle in settings
   - Persistent via localStorage
   - All pages styled for both themes

3. Watchlist feature
   - Database: `watchlist` table
   - Add/remove coins to watchlist
   - Quick access on market page

4. Price alerts (optional)
   - Database: `price_alerts` table
   - Set target price
   - Email notification when triggered

5. UI polish
   - Loading states everywhere
   - Error handling
   - Toast notifications
   - Responsive design refinement

**Deliverable:** Complete app with settings, dark mode, and watchlist.

---

### **Phase 7: Testing & Deployment (Week 7)**

**Goals:**
- Test all features
- Fix bugs
- Deploy to production

**Tasks:**
1. Testing
   - Manual testing of all flows
   - Fix bugs
   - Performance optimization

2. Documentation
   - README.md
   - API documentation
   - Setup instructions

3. Deployment
   - Deploy backend to Railway/Render
   - Deploy frontend to Vercel
   - Set up production database
   - Configure environment variables

4. Monitoring
   - Error logging (optional: Sentry)
   - Analytics (optional: Google Analytics)

**Deliverable:** Live production app!

---

## Database Schema

### **Users Table**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **User Settings Table**
```sql
CREATE TABLE user_settings (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light', -- 'light' or 'dark'
  currency VARCHAR(10) DEFAULT 'USD',
  notifications_enabled BOOLEAN DEFAULT true,
  email_alerts BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Portfolio Table**
```sql
CREATE TABLE portfolio (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  coin_id VARCHAR(50) NOT NULL, -- CoinGecko ID: 'bitcoin', 'ethereum'
  crypto_symbol VARCHAR(20) NOT NULL, -- 'BTC', 'ETH', etc.
  crypto_name VARCHAR(100),
  amount DECIMAL(20, 8) NOT NULL,
  purchase_price DECIMAL(20, 8), -- Optional
  purchase_date TIMESTAMP, -- Optional
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Allow multiple holdings of same coin (purchased at different times)
CREATE INDEX idx_portfolio_user_id ON portfolio(user_id);
CREATE INDEX idx_portfolio_coin_id ON portfolio(coin_id);
```

### **Portfolio History Table**
```sql
CREATE TABLE portfolio_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_value DECIMAL(20, 2) NOT NULL,
  snapshot_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, snapshot_date)
);
```

### **News Articles Table**
```sql
CREATE TABLE news_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  content TEXT,
  url VARCHAR(1000) UNIQUE NOT NULL,
  source VARCHAR(100), -- 'CryptoPanic', 'CoinDesk', etc.
  image_url VARCHAR(1000),
  category VARCHAR(50), -- 'crypto', 'trading', 'both'
  sentiment VARCHAR(20), -- 'positive', 'negative', 'neutral'
  sentiment_score DECIMAL(3, 2), -- -5.00 to 5.00
  related_coins TEXT[], -- Array of coin symbols ['BTC', 'ETH']
  published_at TIMESTAMP NOT NULL,
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_category ON news_articles(category);
CREATE INDEX idx_news_published ON news_articles(published_at DESC);
```

### **Crypto Prices Table** (Historical data)
```sql
CREATE TABLE crypto_prices (
  id SERIAL PRIMARY KEY,
  coin_id VARCHAR(50) NOT NULL, -- CoinGecko ID
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(100),
  price_usd DECIMAL(20, 8) NOT NULL,
  market_cap BIGINT,
  volume_24h BIGINT,
  price_change_24h DECIMAL(10, 2),
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(coin_id, timestamp)
);

CREATE INDEX idx_prices_coin_time ON crypto_prices(coin_id, timestamp DESC);
```

### **Watchlist Table**
```sql
CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  coin_id VARCHAR(50) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, coin_id)
);
```

### **Price Alerts Table** (Optional - Phase 7)
```sql
CREATE TABLE price_alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  coin_id VARCHAR(50) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  target_price DECIMAL(20, 8) NOT NULL,
  condition VARCHAR(10) NOT NULL, -- 'above' or 'below'
  triggered BOOLEAN DEFAULT false,
  triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### **Authentication Endpoints**

#### Register User
```
POST /api/auth/register
Body: {
  email: string,
  username: string,
  password: string
}
Response: {
  message: string,
  userId: number
}
```

#### Login User
```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  token: string (JWT),
  user: {
    id: number,
    email: string,
    username: string
  }
}
```

#### Verify Token
```
GET /api/auth/verify
Headers: { Authorization: "Bearer <token>" }
Response: {
  valid: boolean,
  user: { id, email, username }
}
```

---

### **Market Endpoints**

#### Get All Crypto Prices
```
GET /api/market/prices?page=1&limit=50
Response: {
  data: [
    {
      id: string,
      symbol: string,
      name: string,
      current_price: number,
      market_cap: number,
      price_change_24h: number,
      volume_24h: number
    }
  ],
  total: number,
  page: number
}
```

#### Get Single Coin Details
```
GET /api/market/coin/:coinId
Response: {
  id: string,
  symbol: string,
  name: string,
  current_price: number,
  market_cap: number,
  description: string,
  ...
}
```

#### Get Price Chart Data
```
GET /api/market/chart/:coinId?days=7
Response: {
  prices: [[timestamp, price], ...],
  market_caps: [[timestamp, market_cap], ...],
  total_volumes: [[timestamp, volume], ...]
}
```

---

### **Portfolio Endpoints** (Protected)

#### Get User Portfolio
```
GET /api/portfolio
Headers: { Authorization: "Bearer <token>" }
Response: {
  holdings: [
    {
      id: number,
      crypto_symbol: string,
      crypto_name: string,
      amount: number,
      current_price: number,
      current_value: number,
      purchase_price: number,
      profit_loss: number
    }
  ],
  total_value: number
}
```

#### Add Holding
```
POST /api/portfolio
Headers: { Authorization: "Bearer <token>" }
Body: {
  crypto_symbol: string,
  amount: number,
  purchase_price?: number,
  purchase_date?: string
}
Response: {
  message: string,
  holding: { ... }
}
```

#### Update Holding
```
PUT /api/portfolio/:id
Headers: { Authorization: "Bearer <token>" }
Body: { amount?: number, purchase_price?: number, notes?: string }
Response: {
  message: string,
  holding: { ... }
}
```

#### Delete Holding
```
DELETE /api/portfolio/:id
Headers: { Authorization: "Bearer <token>" }
Response: { message: string }
```

#### Get Portfolio History
```
GET /api/portfolio/history?days=30
Headers: { Authorization: "Bearer <token>" }
Response: {
  history: [
    { date: string, total_value: number }
  ]
}
```

---

### **News Endpoints**

#### Get Crypto News
```
GET /api/news/crypto?page=1&limit=20&coin=bitcoin
Response: {
  articles: [
    {
      id: number,
      title: string,
      summary: string,
      url: string,
      source: string,
      image_url: string,
      sentiment: string,
      published_at: string
    }
  ],
  total: number,
  page: number
}
```

#### Get Trading News
```
GET /api/news/trading?page=1&limit=20
Response: { same as crypto news }
```

#### Get News by Coin
```
GET /api/news/coin/:coinSymbol
Response: { articles: [...] }
```

---

### **Settings Endpoints** (Protected)

#### Get User Settings
```
GET /api/settings
Headers: { Authorization: "Bearer <token>" }
Response: {
  theme: string,
  currency: string,
  notifications_enabled: boolean,
  email_alerts: boolean
}
```

#### Update Settings
```
PUT /api/settings
Headers: { Authorization: "Bearer <token>" }
Body: {
  theme?: string,
  currency?: string,
  notifications_enabled?: boolean,
  email_alerts?: boolean
}
Response: { message: string, settings: { ... } }
```

---

### **Watchlist Endpoints** (Protected)

#### Get Watchlist
```
GET /api/watchlist
Headers: { Authorization: "Bearer <token>" }
Response: {
  watchlist: [
    { coin_id: string, symbol: string, added_at: string }
  ]
}
```

#### Add to Watchlist
```
POST /api/watchlist
Headers: { Authorization: "Bearer <token>" }
Body: { coin_id: string, symbol: string }
Response: { message: string }
```

#### Remove from Watchlist
```
DELETE /api/watchlist/:coinId
Headers: { Authorization: "Bearer <token>" }
Response: { message: string }
```

---

## Frontend Structure

```
cryptohub/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── ErrorMessage.tsx
│   │   │   │   └── Button.tsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── market/
│   │   │   │   ├── PriceList.tsx
│   │   │   │   ├── PriceCard.tsx
│   │   │   │   ├── PriceChart.tsx
│   │   │   │   └── SearchBar.tsx
│   │   │   ├── portfolio/
│   │   │   │   ├── PortfolioOverview.tsx
│   │   │   │   ├── HoldingsList.tsx
│   │   │   │   ├── AddHoldingForm.tsx
│   │   │   │   ├── PortfolioChart.tsx
│   │   │   │   └── LendingCalculator.tsx
│   │   │   ├── news/
│   │   │   │   ├── NewsFeed.tsx
│   │   │   │   ├── NewsCard.tsx
│   │   │   │   ├── SentimentBadge.tsx
│   │   │   │   └── NewsFilter.tsx
│   │   │   └── settings/
│   │   │       ├── AccountSettings.tsx
│   │   │       ├── AppPreferences.tsx
│   │   │       └── ThemeToggle.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── CryptoNews.tsx
│   │   │   ├── TradingNews.tsx
│   │   │   ├── Market.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   └── Settings.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── services/
│   │   │   ├── api.ts (axios instance)
│   │   │   ├── authService.ts
│   │   │   ├── marketService.ts
│   │   │   ├── portfolioService.ts
│   │   │   └── newsService.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts (format numbers, dates)
│   │   │   └── validators.ts
│   │   ├── types/
│   │   │   ├── user.ts
│   │   │   ├── market.ts
│   │   │   ├── portfolio.ts
│   │   │   └── news.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
```

---

## Backend Structure

```
cryptohub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts (PostgreSQL connection)
│   │   │   └── redis.ts (Redis connection)
│   │   ├── middleware/
│   │   │   ├── auth.ts (JWT verification)
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── market.routes.ts
│   │   │   ├── portfolio.routes.ts
│   │   │   ├── news.routes.ts
│   │   │   ├── settings.routes.ts
│   │   │   └── watchlist.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── market.controller.ts
│   │   │   ├── portfolio.controller.ts
│   │   │   ├── news.controller.ts
│   │   │   ├── settings.controller.ts
│   │   │   └── watchlist.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── market.service.ts (fetch from CoinGecko)
│   │   │   ├── portfolio.service.ts
│   │   │   ├── news.service.ts (fetch from APIs)
│   │   │   ├── sentiment.service.ts
│   │   │   └── categorization.service.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── portfolio.model.ts
│   │   │   └── news.model.ts
│   │   ├── workers/
│   │   │   ├── priceFetcher.ts (cron job)
│   │   │   ├── newsFetcher.ts (cron job)
│   │   │   └── dataCleanup.ts (cron job)
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── hash.ts
│   │   │   └── logger.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── app.ts (Express app setup)
│   ├── index.ts (entry point)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
```

---

## External APIs

### **CoinGecko API**
- **Documentation:** https://www.coingecko.com/en/api/documentation
- **Free Tier:** 10-50 calls/minute
- **Endpoints Used:**
  - `/coins/markets` - Get list of coins with prices
  - `/coins/{id}` - Get detailed coin data
  - `/coins/{id}/market_chart` - Get historical price data

### **CryptoPanic API**
- **Documentation:** https://cryptopanic.com/developers/api/
- **Free Tier:** 100 requests/day
- **Endpoints Used:**
  - `/posts/` - Get crypto news

### **NewsAPI**
- **Documentation:** https://newsapi.org/docs
- **Free Tier:** 100 requests/day
- **Endpoints Used:**
  - `/everything?q=crypto` - Search crypto news

### **Binance API** (Optional)
- **Documentation:** https://binance-docs.github.io/apidocs/
- **Free Tier:** High rate limits
- **Endpoints Used:**
  - WebSocket for real-time prices

---

## Caching Strategy (Optimized for Free Tier)

### **Redis Cache Structure - BATCH OPTIMIZED**

The key optimization for staying within free tier limits is **batched writes using Redis hashes**.

```javascript
// OPTIMIZED: Single HSET command instead of 100 individual SETs
Key: 'crypto:prices:latest'
Type: Hash
Fields: {
  'bitcoin': JSON string of price data,
  'ethereum': JSON string of price data,
  // ... all 100 coins
}
TTL: 30 seconds
Commands per update: 1 HSET + 1 EXPIRE = 2 commands
Updates per day: 8,640 fetches × 2 = ~400 commands/day ✅

// Detailed coin information
Key: 'crypto:details'
Type: Hash
Fields: {
  'bitcoin': JSON string of detailed data,
  'ethereum': JSON string of detailed data,
  // ... rotates through top 50 coins
}
TTL: 300 seconds (5 minutes)
Commands per update: 1 HSET = 1 command
Updates per day: 1,440 minutes = ~10 commands/day ✅

// News cache
Key: 'news:latest:crypto'
Type: String
Value: JSON array of recent crypto articles
TTL: 1440 seconds (24 minutes)
Commands: 1 SET per update
Updates per day: 60 updates × 2 = ~4 commands/day ✅

Key: 'news:latest:trading'
Type: String
Value: JSON array of recent trading articles
TTL: 1440 seconds (24 minutes)
Updates per day: 60 updates × 2 = ~4 commands/day ✅

// User sessions
Key: 'session:{userId}'
Type: String
Value: JWT token
TTL: 86400 seconds (24 hours)
Commands: ~200 SET/GET per day for 100 users ✅

TOTAL REDIS COMMANDS: ~414/day (well under 10k limit!)
```

### **Cache Read Strategy**

```javascript
// Read all prices (1 command instead of 100)
const allPrices = await redis.hgetall('crypto:prices:latest');

// Read single price (1 command)
const btcPrice = await redis.hget('crypto:prices:latest', 'bitcoin');

// Read news (1 command)
const news = await redis.get('news:latest:crypto');
```

### **Cache Invalidation**
- Prices: Update every 10 seconds via cron (8,640 times/day)
- Coin details: Update 6 coins every minute (1,440 times/day)
- News: Update every 24 minutes (60 times/day)
- Sessions: Auto-expire after 24 hours
- Manual invalidation: On user logout or data updates

### **Fallback Strategy**
```javascript
// Always implement fallback to database if Redis fails
try {
  const cached = await redis.hgetall('crypto:prices:latest');
  if (cached) return cached;
} catch (error) {
  console.error('Redis error, falling back to DB:', error);
}
// Fetch from database as fallback
return await fetchPricesFromDatabase();
```

---

## Security Considerations

### **1. Authentication & Authorization**
```javascript
// Use bcrypt with salt rounds >= 12 for production
const hashedPassword = await bcrypt.hash(password, 12);

// JWT with strong secret (minimum 256-bit)
const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
  expiresIn: '24h',
  algorithm: 'HS256'
});

// Store sessions in Redis for quick invalidation
await redis.set(`session:${userId}`, token, 'EX', 86400);
```

### **2. Input Validation & Sanitization**
```javascript
// Use express-validator for all inputs
import { body, validationResult } from 'express-validator';

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').trim().isLength({ min: 3, max: 30 }).escape(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors });
  // ...
});

// Always use parameterized queries to prevent SQL injection
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

### **3. Rate Limiting**
```javascript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: 'Too many requests from this IP'
});
app.use('/api/', apiLimiter);

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
});
app.use('/api/auth/login', authLimiter);
```

### **4. Security Headers (Helmet)**
```javascript
import helmet from 'helmet';

app.use(helmet()); // Sets multiple security headers
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
  }
}));
```

### **5. CORS Configuration**
```javascript
import cors from 'cors';

const corsOptions = {
  origin: process.env.FRONTEND_URL, // Only allow your frontend
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### **6. Environment Variables**
```bash
# NEVER commit .env to Git!
# Add to .gitignore immediately

# Use strong, random secrets
JWT_SECRET=$(openssl rand -base64 32)

# Use environment-specific URLs
FRONTEND_URL=http://localhost:5173  # dev
FRONTEND_URL=https://your-app.vercel.app  # prod
```

### **7. Additional Security Measures**
- ✅ HTTPS only in production (enforced by Vercel/Render)
- ✅ HTTP-only cookies for sensitive data
- ✅ CSRF protection for state-changing operations
- ✅ XSS protection via input sanitization
- ✅ SQL injection prevention via parameterized queries
- ✅ NoSQL injection prevention (not applicable, using PostgreSQL)
- ✅ Secure password storage (bcrypt with high salt rounds)

---

## Environment Variables

### Backend `.env` (Development)
```bash
# Server
PORT=5000
NODE_ENV=development

# Database (Local Development)
DATABASE_URL=postgresql://postgres:password@localhost:5432/cryptohub

# Redis (Local Development)
REDIS_URL=redis://localhost:6379

# JWT (Generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-key-minimum-256-bits-change-this
JWT_EXPIRES_IN=24h

# External APIs (Free Tiers)
COINGECKO_API_KEY=  # Optional, leave empty for free tier
CRYPTOPANIC_API_KEY=your-key-from-cryptopanic.com
NEWSAPI_KEY=your-key-from-newsapi.org

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Backend `.env` (Production - Render)
```bash
# Server
PORT=5000
NODE_ENV=production

# Database (Neon PostgreSQL - Free Tier)
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/cryptohub?sslmode=require

# Redis (Upstash - Free Tier with TLS)
REDIS_URL=rediss://default:xxx@gusc1-amazing-shark-12345.upstash.io:6379

# JWT (CRITICAL: Use strong random secret in production!)
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRES_IN=24h

# External APIs
COINGECKO_API_KEY=  # Optional
CRYPTOPANIC_API_KEY=<your-production-key>
NEWSAPI_KEY=<your-production-key>

# Frontend URL (Vercel)
FRONTEND_URL=https://your-app.vercel.app

# Error Monitoring (Optional - Sentry Free Tier)
SENTRY_DSN=<your-sentry-dsn>
```

### Frontend `.env` (Development)
```bash
VITE_API_URL=http://localhost:5000/api
```

### Frontend `.env.production` (Vercel)
```bash
VITE_API_URL=https://your-backend.onrender.com/api
```

### Important Notes:
1. **Never commit `.env` files to Git!**
2. Add `.env*` to `.gitignore` immediately
3. Create `.env.example` files with placeholder values
4. Use strong, unique secrets for production
5. Rotate secrets periodically
6. Use environment-specific URLs

---

## Deployment Strategy (100% Free Tier)

### **Phase 1: Local Development**
1. **Install Dependencies:**
   ```bash
   # PostgreSQL 15+
   # Download from: https://www.postgresql.org/download/

   # Redis 7+
   # Windows: https://github.com/microsoftarchive/redis/releases
   # Mac: brew install redis
   # Linux: sudo apt-get install redis-server
   ```

2. **Setup Local Environment:**
   ```bash
   # Create local database
   psql -U postgres
   CREATE DATABASE cryptohub;
   \q

   # Start Redis
   redis-server

   # Verify connections
   psql -U postgres -d cryptohub -c "SELECT version();"
   redis-cli ping  # Should return: PONG
   ```

3. **Run Applications:**
   ```bash
   # Backend
   cd backend
   npm install
   npm run dev

   # Frontend (in new terminal)
   cd frontend
   npm install
   npm run dev
   ```

### **Phase 2: Free Tier Production Deployment**

#### **Step 1: Database Setup (Neon - FREE)**
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create new project: `cryptohub-prod`
3. Copy connection string (format: `postgresql://...neon.tech/...`)
4. Save for later use in Render environment variables
5. Create tables using the SQL schema from this doc

**Neon Free Tier:**
- 3GB storage (sufficient for 100+ users)
- Unlimited queries
- Auto-suspend after inactivity (wakes instantly)
- 1 project, 10 branches

#### **Step 2: Redis Setup (Upstash - FREE)**
1. Go to [upstash.com](https://upstash.com) and sign up
2. Create Redis database:
   - Name: `cryptohub-cache`
   - Region: Choose closest to your backend region
   - Type: Regional (free)
   - TLS: Enabled
3. Copy connection string (format: `rediss://...upstash.io:6379`)
4. Save for Render environment variables

**Upstash Free Tier:**
- 10,000 commands/day (our optimized usage: ~414/day)
- 256MB storage
- TLS encryption included

#### **Step 3: Backend Deployment (Render - FREE)**
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub repository
3. Create new **Web Service**:
   - Name: `cryptohub-backend`
   - Region: Choose closest to your users
   - Branch: `main`
   - Root Directory: `backend` (if monorepo)
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Free**

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your-neon-connection-string>
   REDIS_URL=<your-upstash-connection-string>
   JWT_SECRET=<generate-with-openssl>
   JWT_EXPIRES_IN=24h
   CRYPTOPANIC_API_KEY=<your-key>
   NEWSAPI_KEY=<your-key>
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. Deploy and note the URL: `https://cryptohub-backend.onrender.com`

**Render Free Tier:**
- 750 hours/month (enough for 1 service 24/7)
- 512MB RAM
- Auto-sleep after 15 min inactivity
- Wakes on request (<60 seconds)
- Free SSL certificate

#### **Step 4: Keep Backend Alive (Cron-job.org - FREE)**
1. Go to [cron-job.org](https://cron-job.org) and sign up
2. Create new cron job:
   - Title: `Keep CryptoHub Alive`
   - URL: `https://cryptohub-backend.onrender.com/api/health`
   - Schedule: Every 10 minutes
   - This prevents the backend from sleeping!

#### **Step 5: Frontend Deployment (Vercel - FREE)**
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Import Project"
3. Connect GitHub repository
4. Configure:
   - Framework Preset: `Vite`
   - Root Directory: `frontend` (if monorepo)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://cryptohub-backend.onrender.com/api
   ```

6. Deploy! Your app will be at: `https://your-app.vercel.app`

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited requests
- Automatic SSL
- Global CDN
- Instant rollbacks

#### **Step 6: Error Monitoring (Sentry - FREE)**
1. Go to [sentry.io](https://sentry.io) and sign up
2. Create new project: Select Node.js for backend
3. Copy DSN
4. Add to Render environment variables:
   ```
   SENTRY_DSN=<your-sentry-dsn>
   ```
5. Install in backend:
   ```bash
   npm install @sentry/node
   ```

**Sentry Free Tier:**
- 5,000 errors/month
- 1 user
- 30-day retention

### **Phase 3: Custom Domain (Optional - $12/year)**
1. Buy domain from Namecheap/Google Domains
2. In Vercel: Settings → Domains → Add your domain
3. Update DNS records as instructed
4. SSL automatically provisioned

### **Monthly Cost Breakdown**
```
Frontend (Vercel):        $0
Backend (Render):         $0
Database (Neon):          $0
Redis (Upstash):          $0
Cron Monitoring:          $0
Error Tracking (Sentry):  $0
SSL Certificates:         $0
Custom Domain:            $1/month ($12/year) - Optional

TOTAL: $0-1/month for 100 daily users! 🎉
```

---

## Performance Optimization

1. **Database:**
   - Create indexes on frequently queried columns
   - Use connection pooling
   - Optimize queries (avoid N+1)

2. **Caching:**
   - Cache all external API responses
   - Use Redis for session management
   - Cache computed values (portfolio totals)

3. **Frontend:**
   - Code splitting (lazy loading)
   - Image optimization
   - Minimize bundle size

4. **API:**
   - Pagination for all list endpoints
   - Compression middleware (gzip)
   - CDN for static assets (future)

---

## Testing Strategy

### **Backend Testing:**
- Unit tests for services
- Integration tests for API endpoints
- Test database queries

### **Frontend Testing:**
- Component tests (React Testing Library)
- E2E tests (Playwright - optional)

### **Manual Testing Checklist:**
- [ ] User registration works
- [ ] User login works
- [ ] JWT authentication works
- [ ] Market prices display correctly
- [ ] Portfolio CRUD operations work
- [ ] News fetching and categorization works
- [ ] Dark mode toggle works
- [ ] All pages are responsive

---

## Future Enhancements (Post-MVP)

1. **Advanced Features:**
   - Price alerts with email/push notifications
   - Multiple portfolio support
   - Tax reporting (capital gains)
   - Social features (share portfolios)

2. **Technical Improvements:**
   - GraphQL API (replace REST)
   - Real-time updates via WebSockets
   - Advanced caching (CDN)
   - Microservices architecture

3. **Mobile:**
   - React Native app
   - Or Progressive Web App (PWA)

4. **Monetization:**
   - Premium tier (advanced features)
   - Ads (Google AdSense)
   - Affiliate links to exchanges

---

## Project Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1 | Week 1 | Authentication system |
| Phase 2 | Week 2 | Market data page |
| Phase 3 | Week 3 | Portfolio tracker |
| Phase 4 | Week 4 | Crypto news feed |
| Phase 5 | Week 5 | Trading news feed |
| Phase 6 | Week 6 | Settings & polish |
| Phase 7 | Week 7 | Deployment |

**Total: ~7 weeks for full MVP**

---

## Getting Started

Once we start development, here's the order of operations:

1. Initialize Git repository
2. Create backend folder and initialize Node.js project
3. Create frontend folder and initialize React project
4. Set up PostgreSQL database
5. Set up Redis
6. Start with Phase 1 (Authentication)

---

**End of Technical Documentation**

This document will be updated as the project evolves. Use it as the single source of truth for all technical decisions and implementation details.
