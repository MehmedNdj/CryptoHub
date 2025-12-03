# Database Installation Guide

## Prerequisites Installation for CryptoHub Development

You need to install PostgreSQL and Redis before running the backend server.

---

## Step 1: Install PostgreSQL 15+

### For Windows:

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Download the latest PostgreSQL 15 or 16 installer
   - Run the installer

2. **During Installation:**
   - Remember the password you set for the `postgres` user
   - Default port: 5432 (keep it)
   - Locale: Default locale

3. **Add PostgreSQL to PATH:**
   - The installer usually adds it automatically
   - If not, add: `C:\Program Files\PostgreSQL\15\bin` to your PATH

4. **Verify Installation:**
   ```bash
   psql --version
   # Should show: psql (PostgreSQL) 15.x
   ```

### For Mac:

```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify
psql --version
```

### For Linux (Ubuntu/Debian):

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
psql --version
```

---

## Step 2: Create CryptoHub Database

### Option A: Using psql Command Line (All Platforms)

```bash
# Connect to PostgreSQL (Windows)
psql -U postgres

# On Mac/Linux, you might need:
# sudo -u postgres psql

# Create the database
CREATE DATABASE cryptohub;

# Verify database was created
\l

# Connect to the database
\c cryptohub

# Exit psql
\q
```

### Option B: Using pgAdmin (Windows GUI)

1. Open pgAdmin (installed with PostgreSQL)
2. Connect to local server (password you set during installation)
3. Right-click "Databases" → Create → Database
4. Name: `cryptohub`
5. Click Save

---

## Step 3: Apply Database Schema

Once the database is created, apply the schema:

```bash
# Navigate to backend directory
cd C:\Users\mehme\Desktop\Repositories\CryptoHub\backend

# Apply schema
psql -U postgres -d cryptohub -f src/config/schema.sql

# You should see: "Database schema created successfully!"
```

**Note:** Update your password in `backend/.env` file:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/cryptohub
```

---

## Step 4: Install Redis 7+

### For Windows:

**Option A: Using WSL2 (Recommended)**
```bash
# In WSL2 terminal
sudo apt update
sudo apt install redis-server

# Start Redis
sudo service redis-server start

# Test
redis-cli ping
# Should return: PONG
```

**Option B: Using Windows Binary (Legacy)**
1. Download from: https://github.com/microsoftarchive/redis/releases
2. Download Redis-x64-x.x.xxx.zip
3. Extract to `C:\Redis`
4. Run `redis-server.exe`
5. In another terminal, test with `redis-cli.exe ping`

**Option C: Using Docker (Easiest)**
```bash
# Install Docker Desktop for Windows
# Then run:
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Test
docker exec -it redis redis-cli ping
```

### For Mac:

```bash
# Using Homebrew
brew install redis

# Start Redis service
brew services start redis

# Test
redis-cli ping
# Should return: PONG
```

### For Linux (Ubuntu/Debian):

```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Start service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test
redis-cli ping
# Should return: PONG
```

---

## Step 5: Verify Everything is Running

### Check PostgreSQL:
```bash
# Test connection
psql -U postgres -d cryptohub -c "SELECT NOW();"

# Should show current timestamp
```

### Check Redis:
```bash
# Test connection
redis-cli ping

# Should return: PONG

# Check Redis is running
redis-cli INFO server
```

---

## Step 6: Update Backend .env File

Edit `backend/.env` with your actual credentials:

```bash
# If your PostgreSQL password is different
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/cryptohub

# Redis URL (usually default works)
REDIS_URL=redis://localhost:6379
```

---

## Step 7: Test Backend Connection

```bash
# Navigate to backend directory
cd backend

# Start development server
npm run dev
```

**You should see:**
```
✅ Connected to PostgreSQL database
📊 Database time: [current timestamp]
📊 PostgreSQL version: PostgreSQL 15.x
🔗 Connecting to Redis...
✅ Redis client ready
🏓 Redis PING: PONG
📊 Redis version: 7.x.x
🚀 Server running on http://localhost:5000
📊 Health check: http://localhost:5000/api/health
```

---

## Common Issues & Solutions

### PostgreSQL Issues:

**Issue:** `psql: command not found`
- **Solution:** PostgreSQL not in PATH. Add `C:\Program Files\PostgreSQL\15\bin` to PATH

**Issue:** `FATAL: password authentication failed`
- **Solution:** Wrong password in DATABASE_URL. Check your .env file

**Issue:** `FATAL: database "cryptohub" does not exist`
- **Solution:** Run `CREATE DATABASE cryptohub;` in psql

### Redis Issues:

**Issue:** `redis-cli: command not found`
- **Solution:** Redis not installed or not in PATH

**Issue:** `Could not connect to Redis at 127.0.0.1:6379`
- **Solution:** Redis server not running. Start with `redis-server` or `brew services start redis`

**Issue:** Connection refused
- **Solution:** Check if Redis is running: `redis-cli ping`

---

## Quick Commands Reference

### PostgreSQL:
```bash
# Connect to database
psql -U postgres -d cryptohub

# List databases
\l

# List tables
\dt

# Describe table
\d users

# Run SQL file
psql -U postgres -d cryptohub -f schema.sql

# Exit
\q
```

### Redis:
```bash
# Test connection
redis-cli ping

# Connect to Redis CLI
redis-cli

# Get all keys
KEYS *

# Get server info
INFO

# Clear all data (careful!)
FLUSHALL

# Exit
exit
```

---

## Next Steps

Once both PostgreSQL and Redis are running:

1. ✅ PostgreSQL installed and running
2. ✅ Database `cryptohub` created
3. ✅ Schema applied successfully
4. ✅ Redis installed and running
5. ✅ Backend .env updated with correct credentials
6. ✅ Test: `cd backend && npm run dev`

**You're ready to continue with Phase 1, Day 3 (Authentication Backend)!**
