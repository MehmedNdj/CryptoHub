# CryptoHub - Project Structure

## Root Directory
```
CryptoHub/
├── .git/                          # Git repository
├── .gitignore                     # Git ignore rules
├── README.md                      # Project documentation
├── TECHNICAL_DOCUMENTATION.md     # Technical specifications
├── DEVELOPMENT_PHASES.md          # Development guide
├── PROJECT_STRUCTURE.md           # This file
├── backend/                       # Backend application
└── frontend/                      # Frontend application
```

## Backend Structure
```
backend/
├── node_modules/                  # Dependencies (not in git)
├── dist/                          # Compiled JavaScript (not in git)
├── src/
│   ├── config/                    # Configuration files
│   │   ├── database.ts            # PostgreSQL connection
│   │   ├── redis.ts               # Redis connection
│   │   └── schema.sql             # Database schema
│   ├── routes/                    # API routes
│   │   ├── auth.routes.ts         # Authentication routes
│   │   ├── market.routes.ts       # Market data routes
│   │   ├── portfolio.routes.ts    # Portfolio routes
│   │   ├── news.routes.ts         # News routes
│   │   ├── settings.routes.ts     # Settings routes
│   │   └── watchlist.routes.ts    # Watchlist routes
│   ├── controllers/               # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── market.controller.ts
│   │   ├── portfolio.controller.ts
│   │   ├── news.controller.ts
│   │   ├── settings.controller.ts
│   │   └── watchlist.controller.ts
│   ├── services/                  # Business logic
│   │   ├── auth.service.ts
│   │   ├── market.service.ts
│   │   ├── portfolio.service.ts
│   │   ├── news.service.ts
│   │   ├── sentiment.service.ts
│   │   └── categorization.service.ts
│   ├── models/                    # Database models
│   │   ├── user.model.ts
│   │   ├── portfolio.model.ts
│   │   └── news.model.ts
│   ├── middleware/                # Express middleware
│   │   ├── auth.ts                # JWT authentication
│   │   ├── errorHandler.ts       # Error handling
│   │   └── validation.ts         # Input validation
│   ├── utils/                     # Utility functions
│   │   ├── jwt.ts                 # JWT helpers
│   │   ├── hash.ts                # Password hashing
│   │   └── logger.ts              # Logging utilities
│   ├── workers/                   # Background jobs
│   │   ├── priceFetcher.ts        # Fetch crypto prices
│   │   ├── newsFetcher.ts         # Fetch news articles
│   │   └── dataCleanup.ts         # Clean old data
│   ├── types/                     # TypeScript types
│   │   └── index.ts               # Type definitions
│   ├── app.ts                     # Express app setup
│   └── index.ts                   # Entry point
├── .env                           # Environment variables (not in git)
├── .env.example                   # Environment template
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Backend documentation
```

## Frontend Structure
```
frontend/
├── node_modules/                  # Dependencies (not in git)
├── dist/                          # Build output (not in git)
├── public/                        # Static assets
│   └── vite.svg                   # Favicon
├── src/
│   ├── components/                # React components
│   │   ├── common/                # Shared components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── Button.tsx
│   │   ├── auth/                  # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── market/                # Market components
│   │   │   ├── PriceList.tsx
│   │   │   ├── PriceCard.tsx
│   │   │   ├── PriceChart.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── portfolio/             # Portfolio components
│   │   │   ├── PortfolioOverview.tsx
│   │   │   ├── HoldingsList.tsx
│   │   │   ├── AddHoldingForm.tsx
│   │   │   ├── PortfolioChart.tsx
│   │   │   └── LendingCalculator.tsx
│   │   ├── news/                  # News components
│   │   │   ├── NewsFeed.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   ├── SentimentBadge.tsx
│   │   │   └── NewsFilter.tsx
│   │   └── settings/              # Settings components
│   │       ├── AccountSettings.tsx
│   │       ├── AppPreferences.tsx
│   │       └── ThemeToggle.tsx
│   ├── pages/                     # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── CryptoNews.tsx
│   │   ├── TradingNews.tsx
│   │   ├── Market.tsx
│   │   ├── Portfolio.tsx
│   │   └── Settings.tsx
│   ├── context/                   # React context
│   │   ├── AuthContext.tsx        # Authentication state
│   │   └── ThemeContext.tsx       # Theme state
│   ├── services/                  # API services
│   │   ├── api.ts                 # Axios instance
│   │   ├── authService.ts         # Auth API calls
│   │   ├── marketService.ts       # Market API calls
│   │   ├── portfolioService.ts    # Portfolio API calls
│   │   └── newsService.ts         # News API calls
│   ├── utils/                     # Utility functions
│   │   ├── formatters.ts          # Format numbers, dates
│   │   └── validators.ts          # Input validation
│   ├── types/                     # TypeScript types
│   │   ├── user.ts
│   │   ├── market.ts
│   │   ├── portfolio.ts
│   │   └── news.ts
│   ├── assets/                    # Images, fonts, etc.
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles (Tailwind)
├── .env                           # Environment variables (not in git)
├── .env.example                   # Environment template
├── index.html                     # HTML template
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # TailwindCSS configuration
├── postcss.config.js              # PostCSS configuration
└── README.md                      # Frontend documentation
```

## Dependencies Installed

### Backend
**Production:**
- express: Web framework
- cors: CORS middleware
- dotenv: Environment variables
- pg: PostgreSQL client
- redis: Redis client
- bcrypt: Password hashing
- jsonwebtoken: JWT authentication
- express-validator: Input validation
- express-rate-limit: Rate limiting
- helmet: Security headers
- node-cron: Background job scheduler

**Development:**
- typescript: TypeScript compiler
- @types/*: Type definitions
- ts-node-dev: Development server
- nodemon: Auto-restart server

### Frontend
**Production:**
- react: UI library
- react-dom: React DOM renderer
- react-router-dom: Routing
- axios: HTTP client
- recharts: Chart library

**Development:**
- typescript: TypeScript compiler
- vite: Build tool
- tailwindcss: Utility-first CSS
- postcss: CSS processing
- autoprefixer: CSS vendor prefixes
- @vitejs/plugin-react: React plugin for Vite

## Next Steps

1. Set up PostgreSQL database locally
2. Set up Redis locally
3. Create backend .env file from .env.example
4. Create frontend .env file from .env.example
5. Start implementing Phase 1 (Authentication)

## Development Commands

### Backend
```bash
cd backend
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Port Configuration
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173
