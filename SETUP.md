# Local Development Setup Guide

Follow these steps to run the Reddit Clone on your local machine.

## Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **PostgreSQL** - Choose one:
   - [Download PostgreSQL](https://www.postgresql.org/download/) (local installation)
   - Use Docker (recommended for easy setup)
   - Use a cloud service like [Supabase](https://supabase.com) (free tier available)

## Quick Start (Using Docker for PostgreSQL)

### Option 1: Docker Compose (Easiest)

1. **Start PostgreSQL with Docker:**
   ```bash
   docker-compose up -d postgres
   ```
   This will start PostgreSQL on port 5432.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the DATABASE_URL:
   ```env
   DATABASE_URL="postgresql://reddit_user:reddit_password@localhost:5432/reddit_clone?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-this"
   ```
   
   **Generate a secure NEXTAUTH_SECRET:**
   ```bash
   # On Windows PowerShell:
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   
   # On Mac/Linux:
   openssl rand -base64 32
   ```

4. **Set up the database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Option 2: Local PostgreSQL Installation

1. **Install and start PostgreSQL** on your machine

2. **Create a database:**
   ```sql
   CREATE DATABASE reddit_clone;
   CREATE USER reddit_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE reddit_clone TO reddit_user;
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://reddit_user:your_password@localhost:5432/reddit_clone?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

5. **Set up the database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

## Option 3: Using Supabase (Cloud PostgreSQL - Free)

1. **Create a free account** at [supabase.com](https://supabase.com)

2. **Create a new project** and get your database URL from Settings > Database

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

5. **Set up the database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

## First Steps After Starting

1. **Register a new account** at [http://localhost:3000/register](http://localhost:3000/register)
2. **Create a community** at [http://localhost:3000/create-community](http://localhost:3000/create-community)
3. **Create a post** at [http://localhost:3000/create-post](http://localhost:3000/create-post)

## Troubleshooting

### Database Connection Issues

- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env` matches your database credentials
- Verify the database exists

### Port Already in Use

If port 3000 is already in use:
```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change the port in package.json scripts
```

### Prisma Issues

If you get Prisma errors:
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Useful Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma studio` - Open database GUI (very useful!)
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma Client

## Viewing Your Database

Use Prisma Studio to view and edit your database:
```bash
npx prisma studio
```
This opens a web interface at [http://localhost:5555](http://localhost:5555)

