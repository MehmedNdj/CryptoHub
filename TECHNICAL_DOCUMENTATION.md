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
- **State Management:** React Context API + Hooks (or Redux if needed)
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

### Database
- **Primary Database:** PostgreSQL 15+
- **Caching:** Redis 7+
- **ORM:** Prisma (or raw SQL with pg library)

### Background Jobs
- **Scheduler:** node-cron
- **Tasks:**
  - Fetch crypto prices every 1-5 minutes
  - Fetch news articles every 30 minutes
  - Clean old cache data daily
  - Generate portfolio snapshots

### Development Tools
- **Package Manager:** npm or pnpm
- **Version Control:** Git
- **Code Quality:** ESLint + Prettier
- **API Testing:** Postman or Thunder Client

### Deployment (Future)
- **Frontend:** Vercel or Netlify
- **Backend:** Railway, Render, or DigitalOcean
- **Database:** Railway PostgreSQL or AWS RDS
- **Redis:** Railway Redis or Upstash

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
│  │ Job 1: Fetch prices every 1 minute (top 100)       │ │
│  │ Job 2: Fetch news every 30 minutes                 │ │
│  │ Job 3: Categorize news (crypto vs trading)         │ │
│  │ Job 4: Calculate sentiment scores                  │ │
│  │ Job 5: Clean old data (daily)                      │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│                   EXTERNAL APIs                          │
│  - CoinGecko API (prices, market data)                   │
│  - CryptoPanic API (crypto news)                         │
│  - NewsAPI (general crypto news)                         │
│  - Binance API (real-time prices - optional)             │
└──────────────────────────────────────────────────────────┘
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
  crypto_symbol VARCHAR(20) NOT NULL, -- 'BTC', 'ETH', etc.
  crypto_name VARCHAR(100),
  amount DECIMAL(20, 8) NOT NULL,
  purchase_price DECIMAL(20, 8), -- Optional
  purchase_date TIMESTAMP, -- Optional
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, crypto_symbol)
);
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

## Caching Strategy

### **Redis Cache Structure**

```
Key Pattern: crypto:price:{coinId}
Value: JSON { price, market_cap, volume, timestamp }
TTL: 120 seconds

Key Pattern: news:crypto
Value: JSON array of recent articles
TTL: 1800 seconds (30 minutes)

Key Pattern: news:trading
Value: JSON array of recent articles
TTL: 1800 seconds

Key Pattern: market:top100
Value: JSON array of top 100 coins
TTL: 60 seconds
```

### **Cache Invalidation**
- Prices: Update every 60 seconds via cron
- News: Update every 30 minutes via cron
- Manual invalidation on data updates

---

## Security Considerations

1. **Authentication:**
   - Use bcrypt with salt rounds >= 10
   - JWT with strong secret (256-bit)
   - Token expiration: 24 hours
   - Refresh token mechanism (future)

2. **Input Validation:**
   - Validate all user inputs
   - Sanitize data before DB queries
   - Use parameterized queries (prevent SQL injection)

3. **Rate Limiting:**
   - Limit API requests per user/IP
   - Prevent brute force attacks on login

4. **CORS:**
   - Whitelist frontend domain only

5. **Environment Variables:**
   - Never commit secrets to Git
   - Use .env files (add to .gitignore)

---

## Environment Variables

### Backend `.env`
```
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cryptohub
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# External APIs
COINGECKO_API_KEY=optional
CRYPTOPANIC_API_KEY=your-key
NEWSAPI_KEY=your-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## Deployment Strategy

### **Phase 1: Development**
- Run locally (localhost)
- PostgreSQL on local machine
- Redis on local machine

### **Phase 2: Staging**
- Deploy to free tiers for testing
- Frontend: Vercel (free)
- Backend: Railway/Render (free tier)
- Database: Railway PostgreSQL (free)

### **Phase 3: Production**
- Same as staging but with custom domain
- Upgrade database if needed
- Add monitoring (Sentry, LogRocket)

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
