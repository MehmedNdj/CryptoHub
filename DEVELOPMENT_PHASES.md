# CryptoHub - Development Phases (Detailed)

## Quick Reference Guide

This document provides **extremely detailed, step-by-step instructions** for each phase of development. Follow this as your complete roadmap from zero to deployment.

**Total Timeline:** 7 weeks for full MVP
**Target:** 100 daily users on 100% free tier
**Cost:** $0-1/month

---

## **PHASE 1: Foundation & Authentication** (Week 1)

### Objective
Set up the entire project infrastructure from scratch and implement secure user authentication.

### Daily Breakdown

#### **Day 1: Project Setup & Initialization**

**Morning: Backend Setup**

1. **Create Project Root Directory:**
   ```bash
   mkdir CryptoHub
   cd CryptoHub
   git init
   ```

2. **Create .gitignore:**
   ```bash
   # Create .gitignore file
   echo "node_modules/" >> .gitignore
   echo ".env" >> .gitignore
   echo ".env.*" >> .gitignore
   echo "dist/" >> .gitignore
   echo "build/" >> .gitignore
   echo ".DS_Store" >> .gitignore
   ```

3. **Initialize Backend:**
   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

4. **Install Backend Dependencies:**
   ```bash
   npm install express cors dotenv pg redis bcrypt jsonwebtoken express-validator express-rate-limit helmet
   npm install -D typescript @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken ts-node-dev nodemon
   ```

5. **Setup TypeScript Configuration:**
   ```bash
   npx tsc --init
   ```

   Edit `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "commonjs",
       "lib": ["ES2020"],
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "resolveJsonModule": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules"]
   }
   ```

6. **Create Backend Folder Structure:**
   ```bash
   mkdir -p src/config
   mkdir -p src/routes
   mkdir -p src/controllers
   mkdir -p src/services
   mkdir -p src/models
   mkdir -p src/middleware
   mkdir -p src/utils
   mkdir -p src/workers
   mkdir -p src/types
   ```

7. **Create package.json Scripts:**
   Edit `backend/package.json`, add to "scripts":
   ```json
   "scripts": {
     "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
     "build": "tsc",
     "start": "node dist/index.js"
   }
   ```

**Afternoon: Frontend Setup**

8. **Create Frontend with Vite:**
   ```bash
   cd ..  # Back to CryptoHub root
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npm install
   ```

9. **Install Frontend Dependencies:**
   ```bash
   npm install axios react-router-dom recharts
   npm install -D tailwindcss postcss autoprefixer
   ```

10. **Setup TailwindCSS:**
    ```bash
    npx tailwindcss init -p
    ```

    Edit `tailwind.config.js`:
    ```javascript
    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

    Edit `src/index.css`:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

11. **Create Frontend Folder Structure:**
    ```bash
    mkdir -p src/components/common
    mkdir -p src/components/auth
    mkdir -p src/components/market
    mkdir -p src/components/portfolio
    mkdir -p src/components/news
    mkdir -p src/components/settings
    mkdir -p src/pages
    mkdir -p src/context
    mkdir -p src/services
    mkdir -p src/utils
    mkdir -p src/types
    ```

12. **First Git Commit:**
    ```bash
    cd ..  # Back to root
    git add .
    git commit -m "Initial project setup: backend and frontend scaffolding"
    ```

#### **Day 2: Database Setup & Configuration**

**Morning: Local PostgreSQL Setup**

1. **Install PostgreSQL:**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql@15`
   - Linux: `sudo apt-get install postgresql-15`

2. **Create Local Database:**
   ```bash
   # Start PostgreSQL service
   # Windows: Start from Services
   # Mac: brew services start postgresql@15
   # Linux: sudo systemctl start postgresql

   # Create database
   psql -U postgres
   CREATE DATABASE cryptohub;
   \q
   ```

3. **Create Database Schema:**

   Create `backend/src/config/schema.sql`:
   ```sql
   -- Users Table
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     username VARCHAR(100) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- User Settings Table
   CREATE TABLE user_settings (
     user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
     theme VARCHAR(20) DEFAULT 'light',
     currency VARCHAR(10) DEFAULT 'USD',
     notifications_enabled BOOLEAN DEFAULT true,
     email_alerts BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create indexes
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_users_username ON users(username);
   ```

4. **Apply Schema:**
   ```bash
   psql -U postgres -d cryptohub -f backend/src/config/schema.sql
   ```

**Afternoon: Redis & Database Connection**

5. **Install Redis:**
   - Windows: Download from https://github.com/microsoftarchive/redis/releases
   - Mac: `brew install redis`
   - Linux: `sudo apt-get install redis-server`

6. **Start Redis:**
   ```bash
   redis-server
   # Test in new terminal:
   redis-cli ping  # Should return: PONG
   ```

7. **Create Database Configuration:**

   Create `backend/src/config/database.ts`:
   ```typescript
   import { Pool } from 'pg';
   import dotenv from 'dotenv';

   dotenv.config();

   export const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: process.env.NODE_ENV === 'production' ? {
       rejectUnauthorized: false
     } : undefined,
     max: 20, // Connection pool size
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });

   pool.on('connect', () => {
     console.log('✅ Connected to PostgreSQL database');
   });

   pool.on('error', (err) => {
     console.error('❌ PostgreSQL error:', err);
     process.exit(-1);
   });

   export const testConnection = async () => {
     try {
       const result = await pool.query('SELECT NOW()');
       console.log('Database time:', result.rows[0].now);
       return true;
     } catch (error) {
       console.error('Database connection failed:', error);
       return false;
     }
   };
   ```

8. **Create Redis Configuration:**

   Create `backend/src/config/redis.ts`:
   ```typescript
   import { createClient } from 'redis';
   import dotenv from 'dotenv';

   dotenv.config();

   const redisClient = createClient({
     url: process.env.REDIS_URL || 'redis://localhost:6379',
     socket: {
       reconnectStrategy: (retries) => {
         if (retries > 10) {
           console.error('❌ Redis reconnection failed');
           return new Error('Redis reconnection limit exceeded');
         }
         return retries * 100; // Exponential backoff
       }
     }
   });

   redisClient.on('connect', () => {
     console.log('✅ Connected to Redis');
   });

   redisClient.on('error', (err) => {
     console.error('❌ Redis error:', err);
   });

   export const connectRedis = async () => {
     try {
       await redisClient.connect();
       return true;
     } catch (error) {
       console.error('Redis connection failed:', error);
       return false;
     }
   };

   export { redisClient };
   ```

9. **Create .env File:**

   Create `backend/.env`:
   ```bash
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   DATABASE_URL=postgresql://postgres:password@localhost:5432/cryptohub

   # Redis
   REDIS_URL=redis://localhost:6379

   # JWT
   JWT_SECRET=your-super-secret-key-change-this-in-production-use-openssl-rand-base64-32
   JWT_EXPIRES_IN=24h

   # External APIs
   COINGECKO_API_KEY=
   CRYPTOPANIC_API_KEY=
   NEWSAPI_KEY=

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

10. **Create .env.example:**
    ```bash
    cp backend/.env backend/.env.example
    # Edit .env.example to remove actual values
    ```

11. **Commit Progress:**
    ```bash
    git add .
    git commit -m "Add database and Redis configuration"
    ```

#### **Day 3: Authentication Backend**

**Morning: Utility Functions**

1. **Create JWT Utilities:**

   Create `backend/src/utils/jwt.ts`:
   ```typescript
   import jwt from 'jsonwebtoken';

   const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
   const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

   interface TokenPayload {
     userId: number;
     email: string;
   }

   export const generateToken = (payload: TokenPayload): string => {
     return jwt.sign(payload, JWT_SECRET, {
       expiresIn: JWT_EXPIRES_IN,
       algorithm: 'HS256'
     });
   };

   export const verifyToken = (token: string): TokenPayload | null => {
     try {
       const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
       return decoded;
     } catch (error) {
       console.error('JWT verification failed:', error);
       return null;
     }
   };
   ```

2. **Create Hash Utilities:**

   Create `backend/src/utils/hash.ts`:
   ```typescript
   import bcrypt from 'bcrypt';

   const SALT_ROUNDS = 12; // Higher for production

   export const hashPassword = async (password: string): Promise<string> => {
     return await bcrypt.hash(password, SALT_ROUNDS);
   };

   export const comparePassword = async (
     password: string,
     hashedPassword: string
   ): Promise<boolean> => {
     return await bcrypt.compare(password, hashedPassword);
   };
   ```

3. **Create Type Definitions:**

   Create `backend/src/types/index.ts`:
   ```typescript
   import { Request } from 'express';

   export interface AuthRequest extends Request {
     userId?: number;
     email?: string;
   }

   export interface User {
     id: number;
     email: string;
     username: string;
     password_hash: string;
     created_at: Date;
     updated_at: Date;
   }

   export interface RegisterInput {
     email: string;
     username: string;
     password: string;
   }

   export interface LoginInput {
     email: string;
     password: string;
   }
   ```

**Afternoon: Authentication Service & Controller**

4. **Create Auth Service:**

   Create `backend/src/services/auth.service.ts`:
   ```typescript
   import { pool } from '../config/database';
   import { hashPassword, comparePassword } from '../utils/hash';
   import { generateToken } from '../utils/jwt';
   import { RegisterInput, LoginInput, User } from '../types';

   export class AuthService {
     async register(input: RegisterInput) {
       const { email, username, password } = input;

       // Check if user exists
       const existingUser = await pool.query(
         'SELECT id FROM users WHERE email = $1 OR username = $2',
         [email, username]
       );

       if (existingUser.rows.length > 0) {
         throw new Error('User already exists');
       }

       // Hash password
       const password_hash = await hashPassword(password);

       // Create user
       const result = await pool.query(
         'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, created_at',
         [email, username, password_hash]
       );

       const user = result.rows[0];

       // Create default settings
       await pool.query(
         'INSERT INTO user_settings (user_id) VALUES ($1)',
         [user.id]
       );

       return {
         userId: user.id,
         email: user.email,
         username: user.username
       };
     }

     async login(input: LoginInput) {
       const { email, password } = input;

       // Find user
       const result = await pool.query(
         'SELECT id, email, username, password_hash FROM users WHERE email = $1',
         [email]
       );

       if (result.rows.length === 0) {
         throw new Error('Invalid credentials');
       }

       const user: User = result.rows[0];

       // Verify password
       const isValid = await comparePassword(password, user.password_hash);
       if (!isValid) {
         throw new Error('Invalid credentials');
       }

       // Generate token
       const token = generateToken({
         userId: user.id,
         email: user.email
       });

       return {
         token,
         user: {
           id: user.id,
           email: user.email,
           username: user.username
         }
       };
     }

     async verifyUser(userId: number) {
       const result = await pool.query(
         'SELECT id, email, username FROM users WHERE id = $1',
         [userId]
       );

       if (result.rows.length === 0) {
         return null;
       }

       return result.rows[0];
     }
   }
   ```

5. **Create Auth Controller:**

   Create `backend/src/controllers/auth.controller.ts`:
   ```typescript
   import { Request, Response } from 'express';
   import { validationResult } from 'express-validator';
   import { AuthService } from '../services/auth.service';
   import { AuthRequest } from '../types';

   const authService = new AuthService();

   export class AuthController {
     async register(req: Request, res: Response) {
       try {
         // Validate inputs
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
         }

         const result = await authService.register(req.body);

         res.status(201).json({
           message: 'User registered successfully',
           user: result
         });
       } catch (error: any) {
         console.error('Registration error:', error);
         res.status(400).json({
           message: error.message || 'Registration failed'
         });
       }
     }

     async login(req: Request, res: Response) {
       try {
         // Validate inputs
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
         }

         const result = await authService.login(req.body);

         res.json({
           message: 'Login successful',
           token: result.token,
           user: result.user
         });
       } catch (error: any) {
         console.error('Login error:', error);
         res.status(401).json({
           message: error.message || 'Login failed'
         });
       }
     }

     async verify(req: AuthRequest, res: Response) {
       try {
         const userId = req.userId;
         if (!userId) {
           return res.status(401).json({ message: 'Unauthorized' });
         }

         const user = await authService.verifyUser(userId);
         if (!user) {
           return res.status(401).json({ message: 'User not found' });
         }

         res.json({
           valid: true,
           user
         });
       } catch (error: any) {
         console.error('Verification error:', error);
         res.status(500).json({
           message: 'Verification failed'
         });
       }
     }
   }
   ```

6. **Create Auth Middleware:**

   Create `backend/src/middleware/auth.ts`:
   ```typescript
   import { Response, NextFunction } from 'express';
   import { verifyToken } from '../utils/jwt';
   import { AuthRequest } from '../types';

   export const authenticateToken = (
     req: AuthRequest,
     res: Response,
     next: NextFunction
   ) => {
     const authHeader = req.headers['authorization'];
     const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

     if (!token) {
       return res.status(401).json({ message: 'No token provided' });
     }

     const decoded = verifyToken(token);
     if (!decoded) {
       return res.status(403).json({ message: 'Invalid or expired token' });
     }

     req.userId = decoded.userId;
     req.email = decoded.email;
     next();
   };
   ```

7. **Create Error Handler Middleware:**

   Create `backend/src/middleware/errorHandler.ts`:
   ```typescript
   import { Request, Response, NextFunction } from 'express';

   export const errorHandler = (
     err: Error,
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     console.error('Error:', err);

     res.status(500).json({
       message: 'Internal server error',
       error: process.env.NODE_ENV === 'development' ? err.message : undefined
     });
   };
   ```

8. **Create Auth Routes:**

   Create `backend/src/routes/auth.routes.ts`:
   ```typescript
   import { Router } from 'express';
   import { body } from 'express-validator';
   import { AuthController } from '../controllers/auth.controller';
   import { authenticateToken } from '../middleware/auth';

   const router = Router();
   const authController = new AuthController();

   // Register
   router.post(
     '/register',
     [
       body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
       body('username')
         .trim()
         .isLength({ min: 3, max: 30 })
         .matches(/^[a-zA-Z0-9_]+$/)
         .withMessage('Username must be 3-30 characters, alphanumeric and underscores only'),
       body('password')
         .isLength({ min: 8 })
         .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
         .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number'),
     ],
     authController.register.bind(authController)
   );

   // Login
   router.post(
     '/login',
     [
       body('email').isEmail().normalizeEmail(),
       body('password').notEmpty(),
     ],
     authController.login.bind(authController)
   );

   // Verify token
   router.get('/verify', authenticateToken, authController.verify.bind(authController));

   export default router;
   ```

9. **Create Express App:**

   Create `backend/src/app.ts`:
   ```typescript
   import express from 'express';
   import cors from 'cors';
   import helmet from 'helmet';
   import rateLimit from 'express-rate-limit';
   import dotenv from 'dotenv';
   import authRoutes from './routes/auth.routes';
   import { errorHandler } from './middleware/errorHandler';

   dotenv.config();

   const app = express();

   // Security middleware
   app.use(helmet());
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     credentials: true
   }));

   // Rate limiting
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // 100 requests per IP
   });
   app.use('/api/', limiter);

   // Body parsers
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));

   // Health check endpoint
   app.get('/api/health', (req, res) => {
     res.json({
       status: 'ok',
       timestamp: new Date().toISOString(),
       uptime: process.uptime()
     });
   });

   // Routes
   app.use('/api/auth', authRoutes);

   // Error handler (must be last)
   app.use(errorHandler);

   export default app;
   ```

10. **Create Server Entry Point:**

    Create `backend/src/index.ts`:
    ```typescript
    import app from './app';
    import { testConnection } from './config/database';
    import { connectRedis } from './config/redis';

    const PORT = process.env.PORT || 5000;

    const startServer = async () => {
      try {
        // Test database connection
        const dbConnected = await testConnection();
        if (!dbConnected) {
          console.error('Failed to connect to database');
          process.exit(1);
        }

        // Connect to Redis
        const redisConnected = await connectRedis();
        if (!redisConnected) {
          console.error('Failed to connect to Redis');
          process.exit(1);
        }

        // Start server
        app.listen(PORT, () => {
          console.log(`🚀 Server running on http://localhost:${PORT}`);
          console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
        });
      } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
      }
    };

    startServer();
    ```

11. **Test Backend:**
    ```bash
    cd backend
    npm run dev
    # Should see:
    # ✅ Connected to PostgreSQL database
    # ✅ Connected to Redis
    # 🚀 Server running on http://localhost:5000
    ```

12. **Commit Progress:**
    ```bash
    git add .
    git commit -m "Implement authentication backend: register, login, verify"
    ```

#### **Day 4: Authentication Frontend**

**Morning: Services & Context**

1. **Create API Service:**

   Create `frontend/src/services/api.ts`:
   ```typescript
   import axios from 'axios';

   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
     timeout: 30000, // 30 seconds (for cold starts)
     headers: {
       'Content-Type': 'application/json'
     }
   });

   // Add auth token to requests
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   // Handle errors
   api.interceptors.response.use(
     (response) => response,
     (error) => {
       if (error.response?.status === 401) {
         localStorage.removeItem('token');
         window.location.href = '/login';
       }
       return Promise.reject(error);
     }
   );

   export default api;
   ```

2. **Create Auth Service:**

   Create `frontend/src/services/authService.ts`:
   ```typescript
   import api from './api';

   export interface RegisterData {
     email: string;
     username: string;
     password: string;
   }

   export interface LoginData {
     email: string;
     password: string;
   }

   export interface User {
     id: number;
     email: string;
     username: string;
   }

   export const authService = {
     async register(data: RegisterData) {
       const response = await api.post('/auth/register', data);
       return response.data;
     },

     async login(data: LoginData) {
       const response = await api.post('/auth/login', data);
       if (response.data.token) {
         localStorage.setItem('token', response.data.token);
       }
       return response.data;
     },

     async verify() {
       const response = await api.get('/auth/verify');
       return response.data;
     },

     logout() {
       localStorage.removeItem('token');
       window.location.href = '/login';
     },

     getToken() {
       return localStorage.getItem('token');
     },

     isAuthenticated() {
       return !!this.getToken();
     }
   };
   ```

3. **Create Type Definitions:**

   Create `frontend/src/types/user.ts`:
   ```typescript
   export interface User {
     id: number;
     email: string;
     username: string;
   }

   export interface AuthContextType {
     user: User | null;
     loading: boolean;
     login: (email: string, password: string) => Promise<void>;
     register: (email: string, username: string, password: string) => Promise<void>;
     logout: () => void;
   }
   ```

4. **Create Auth Context:**

   Create `frontend/src/context/AuthContext.tsx`:
   ```typescript
   import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
   import { authService } from '../services/authService';
   import { User, AuthContextType } from '../types/user';

   const AuthContext = createContext<AuthContextType | undefined>(undefined);

   export const AuthProvider = ({ children }: { children: ReactNode }) => {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       // Check if user is authenticated on mount
       const checkAuth = async () => {
         if (authService.isAuthenticated()) {
           try {
             const data = await authService.verify();
             setUser(data.user);
           } catch (error) {
             console.error('Auth verification failed:', error);
             authService.logout();
           }
         }
         setLoading(false);
       };

       checkAuth();
     }, []);

     const login = async (email: string, password: string) => {
       const data = await authService.login({ email, password });
       setUser(data.user);
     };

     const register = async (email: string, username: string, password: string) => {
       await authService.register({ email, username, password });
       // Auto-login after registration
       await login(email, password);
     };

     const logout = () => {
       authService.logout();
       setUser(null);
     };

     return (
       <AuthContext.Provider value={{ user, loading, login, register, logout }}>
         {children}
       </AuthContext.Provider>
     );
   };

   export const useAuth = () => {
     const context = useContext(AuthContext);
     if (context === undefined) {
       throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
   };
   ```

**Afternoon: Auth Components & Pages**

5. **Create Protected Route:**

   Create `frontend/src/components/auth/ProtectedRoute.tsx`:
   ```typescript
   import { Navigate } from 'react-router-dom';
   import { useAuth } from '../../context/AuthContext';

   interface ProtectedRouteProps {
     children: React.ReactNode;
   }

   export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
     const { user, loading } = useAuth();

     if (loading) {
       return (
         <div className="flex items-center justify-center min-h-screen">
           <div className="text-xl">Loading...</div>
         </div>
       );
     }

     if (!user) {
       return <Navigate to="/login" replace />;
     }

     return <>{children}</>;
   };
   ```

6. **Create Login Form:**

   Create `frontend/src/components/auth/LoginForm.tsx`:
   ```typescript
   import { useState } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { useAuth } from '../../context/AuthContext';

   export const LoginForm = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);
     const { login } = useAuth();
     const navigate = useNavigate();

     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       setError('');
       setLoading(true);

       try {
         await login(email, password);
         navigate('/market');
       } catch (err: any) {
         setError(err.response?.data?.message || 'Login failed');
       } finally {
         setLoading(false);
       }
     };

     return (
       <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
         <div>
           <label className="block text-sm font-medium mb-2">Email</label>
           <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
             placeholder="your@email.com"
           />
         </div>

         <div>
           <label className="block text-sm font-medium mb-2">Password</label>
           <input
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
             placeholder="••••••••"
           />
         </div>

         {error && (
           <div className="text-red-500 text-sm">{error}</div>
         )}

         <button
           type="submit"
           disabled={loading}
           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
         >
           {loading ? 'Logging in...' : 'Login'}
         </button>
       </form>
     );
   };
   ```

7. **Create Register Form:**

   Create `frontend/src/components/auth/RegisterForm.tsx`:
   ```typescript
   import { useState } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { useAuth } from '../../context/AuthContext';

   export const RegisterForm = () => {
     const [email, setEmail] = useState('');
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);
     const { register } = useAuth();
     const navigate = useNavigate();

     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       setError('');

       // Validation
       if (password !== confirmPassword) {
         setError('Passwords do not match');
         return;
       }

       if (password.length < 8) {
         setError('Password must be at least 8 characters');
         return;
       }

       setLoading(true);

       try {
         await register(email, username, password);
         navigate('/market');
       } catch (err: any) {
         setError(err.response?.data?.message || 'Registration failed');
       } finally {
         setLoading(false);
       }
     };

     return (
       <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
         <div>
           <label className="block text-sm font-medium mb-2">Email</label>
           <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
             placeholder="your@email.com"
           />
         </div>

         <div>
           <label className="block text-sm font-medium mb-2">Username</label>
           <input
             type="text"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             required
             minLength={3}
             maxLength={30}
             pattern="[a-zA-Z0-9_]+"
             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
             placeholder="username"
           />
         </div>

         <div>
           <label className="block text-sm font-medium mb-2">Password</label>
           <input
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             minLength={8}
             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
             placeholder="••••••••"
           />
           <p className="text-xs text-gray-500 mt-1">
             At least 8 characters with uppercase, lowercase, and number
           </p>
         </div>

         <div>
           <label className="block text-sm font-medium mb-2">Confirm Password</label>
           <input
             type="password"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
             required
             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
             placeholder="••••••••"
           />
         </div>

         {error && (
           <div className="text-red-500 text-sm">{error}</div>
         )}

         <button
           type="submit"
           disabled={loading}
           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
         >
           {loading ? 'Creating account...' : 'Register'}
         </button>
       </form>
     );
   };
   ```

8. **Create Common Components:**

   Create `frontend/src/components/common/Navbar.tsx`:
   ```typescript
   import { Link } from 'react-router-dom';
   import { useAuth } from '../../context/AuthContext';

   export const Navbar = () => {
     const { user, logout } = useAuth();

     return (
       <nav className="bg-white shadow-md">
         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
           <Link to="/" className="text-2xl font-bold text-blue-600">
             CryptoHub
           </Link>

           {user ? (
             <div className="flex items-center gap-4">
               <Link to="/market" className="hover:text-blue-600">Market</Link>
               <Link to="/portfolio" className="hover:text-blue-600">Portfolio</Link>
               <Link to="/crypto-news" className="hover:text-blue-600">News</Link>
               <Link to="/settings" className="hover:text-blue-600">Settings</Link>
               <button
                 onClick={logout}
                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
               >
                 Logout
               </button>
             </div>
           ) : (
             <div className="flex gap-4">
               <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
               <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                 Register
               </Link>
             </div>
           )}
         </div>
       </nav>
     );
   };
   ```

   Create `frontend/src/components/common/LoadingSpinner.tsx`:
   ```typescript
   export const LoadingSpinner = () => {
     return (
       <div className="flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
       </div>
     );
   };
   ```

9. **Create Pages:**

   Create `frontend/src/pages/Login.tsx`:
   ```typescript
   import { Link } from 'react-router-dom';
   import { LoginForm } from '../components/auth/LoginForm';

   export const Login = () => {
     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
           <div>
             <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
             <p className="mt-2 text-center text-gray-600">
               Login to your CryptoHub account
             </p>
           </div>
           <LoginForm />
           <p className="text-center text-sm">
             Don't have an account?{' '}
             <Link to="/register" className="text-blue-600 hover:underline">
               Register here
             </Link>
           </p>
         </div>
       </div>
     );
   };
   ```

   Create `frontend/src/pages/Register.tsx`:
   ```typescript
   import { Link } from 'react-router-dom';
   import { RegisterForm } from '../components/auth/RegisterForm';

   export const Register = () => {
     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
           <div>
             <h2 className="text-3xl font-bold text-center">Create Account</h2>
             <p className="mt-2 text-center text-gray-600">
               Join CryptoHub today
             </p>
           </div>
           <RegisterForm />
           <p className="text-center text-sm">
             Already have an account?{' '}
             <Link to="/login" className="text-blue-600 hover:underline">
               Login here
             </Link>
           </p>
         </div>
       </div>
     );
   };
   ```

   Create `frontend/src/pages/Market.tsx` (placeholder):
   ```typescript
   export const Market = () => {
     return (
       <div className="container mx-auto p-8">
         <h1 className="text-3xl font-bold">Market</h1>
         <p className="mt-4">Coming in Phase 2...</p>
       </div>
     );
   };
   ```

10. **Create Frontend .env:**

    Create `frontend/.env`:
    ```bash
    VITE_API_URL=http://localhost:5000/api
    ```

11. **Update App.tsx:**

    Edit `frontend/src/App.tsx`:
    ```typescript
    import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
    import { AuthProvider } from './context/AuthContext';
    import { ProtectedRoute } from './components/auth/ProtectedRoute';
    import { Navbar } from './components/common/Navbar';
    import { Login } from './pages/Login';
    import { Register } from './pages/Register';
    import { Market } from './pages/Market';

    function App() {
      return (
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Navigate to="/market" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/market"
                  element={
                    <ProtectedRoute>
                      <Market />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </AuthProvider>
        </BrowserRouter>
      );
    }

    export default App;
    ```

12. **Test Frontend:**
    ```bash
    cd frontend
    npm run dev
    # Visit http://localhost:5173
    # Test registration and login flows
    ```

#### **Day 5: Testing & Polish**

1. **Test Complete Authentication Flow:**
   - Register new user
   - Login with credentials
   - Verify JWT token in localStorage
   - Access protected route
   - Logout
   - Verify redirect to login

2. **Test Error Cases:**
   - Invalid email format
   - Weak password
   - Duplicate registration
   - Wrong credentials
   - Expired token

3. **Add Loading States:**
   - Backend health check shows status
   - Frontend shows loading spinner during auth
   - Proper error messages

4. **Commit Final Phase 1:**
   ```bash
   git add .
   git commit -m "Phase 1 Complete: Authentication system with frontend and backend"
   git push origin main
   ```

### **Phase 1 Deliverable ✅**
- ✅ Backend API with Express + TypeScript
- ✅ PostgreSQL database connected
- ✅ Redis cache connected
- ✅ User registration endpoint
- ✅ User login endpoint with JWT
- ✅ Token verification middleware
- ✅ Frontend React app with TypeScript
- ✅ TailwindCSS styling
- ✅ Auth context for global state
- ✅ Login and Register pages
- ✅ Protected routes
- ✅ Error handling
- ✅ Input validation

---

## **PHASE 2-7 Summary**

Due to length constraints, the remaining phases follow the same detailed pattern:

### **Phase 2: Market Section** - See separate detailed guide
- CoinGecko API integration
- Optimized Redis caching (HSET batching)
- Price fetcher worker (every 10 seconds)
- Market page with real-time prices
- Price charts

### **Phase 3: Portfolio Management** - See separate detailed guide
- Portfolio database tables
- CRUD operations for holdings
- Portfolio value calculations
- Lending calculator
- Historical tracking

### **Phase 4: Crypto News** - See separate detailed guide
- News aggregation APIs
- Categorization service
- Sentiment analysis
- News fetcher worker (every 24 minutes)
- News feed UI

### **Phase 5: Trading News** - See separate detailed guide
- Enhanced categorization
- Trading-specific features
- Liquidation data
- Market sentiment

### **Phase 6: Settings & Enhancements** - See separate detailed guide
- User settings CRUD
- Dark mode implementation
- Watchlist feature
- UI/UX polish

### **Phase 7: Deployment** - See separate detailed guide
- Neon PostgreSQL setup
- Upstash Redis setup
- Render backend deployment
- Vercel frontend deployment
- Cron-job.org keepalive
- Production testing

---

**End of Development Phases Documentation**

This detailed guide ensures every step is clear and actionable. Follow day by day for best results!
