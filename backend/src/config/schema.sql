-- CryptoHub Database Schema
-- PostgreSQL 15+
-- Created: Phase 1, Day 2

-- Drop tables if they exist (for development only)
-- DROP TABLE IF EXISTS price_alerts CASCADE;
-- DROP TABLE IF EXISTS watchlist CASCADE;
-- DROP TABLE IF EXISTS crypto_prices CASCADE;
-- DROP TABLE IF EXISTS news_articles CASCADE;
-- DROP TABLE IF EXISTS portfolio_history CASCADE;
-- DROP TABLE IF EXISTS portfolio CASCADE;
-- DROP TABLE IF EXISTS user_settings CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light',
  currency VARCHAR(10) DEFAULT 'USD',
  notifications_enabled BOOLEAN DEFAULT true,
  email_alerts BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio Table (Phase 3)
CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  coin_id VARCHAR(50) NOT NULL,
  crypto_symbol VARCHAR(20) NOT NULL,
  crypto_name VARCHAR(100),
  amount DECIMAL(20, 8) NOT NULL,
  purchase_price DECIMAL(20, 8),
  purchase_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio History Table (Phase 3)
CREATE TABLE IF NOT EXISTS portfolio_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_value DECIMAL(20, 2) NOT NULL,
  snapshot_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, snapshot_date)
);

-- News Articles Table (Phase 4)
CREATE TABLE IF NOT EXISTS news_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  content TEXT,
  url VARCHAR(1000) UNIQUE NOT NULL,
  source VARCHAR(100),
  image_url VARCHAR(1000),
  category VARCHAR(50),
  sentiment VARCHAR(20),
  sentiment_score DECIMAL(3, 2),
  related_coins TEXT[],
  published_at TIMESTAMP NOT NULL,
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crypto Prices Table (Phase 2)
CREATE TABLE IF NOT EXISTS crypto_prices (
  id SERIAL PRIMARY KEY,
  coin_id VARCHAR(50) NOT NULL,
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

-- Watchlist Table (Phase 6)
CREATE TABLE IF NOT EXISTS watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  coin_id VARCHAR(50) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, coin_id)
);

-- Price Alerts Table (Phase 6 - Optional)
CREATE TABLE IF NOT EXISTS price_alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  coin_id VARCHAR(50) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  target_price DECIMAL(20, 8) NOT NULL,
  condition VARCHAR(10) NOT NULL,
  triggered BOOLEAN DEFAULT false,
  triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_portfolio_user_id ON portfolio(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_coin_id ON portfolio(coin_id);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_prices_coin_time ON crypto_prices(coin_id, timestamp DESC);

-- Verification Query
SELECT 'Database schema created successfully!' as status;
