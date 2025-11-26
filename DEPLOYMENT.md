# Deployment Guide

This guide covers various hosting options for your Reddit Clone application.

## 🚀 Recommended: Vercel (Easiest for Next.js)

**Best for:** Quick deployment, automatic CI/CD, free tier available

### Steps:

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Set up database (choose one):**
   
   **Option A: Supabase (Recommended - Free)**
   - Go to [supabase.com](https://supabase.com)
   - Create a free account and new project
   - Copy the connection string from Settings > Database
   
   **Option B: Railway (Easy PostgreSQL)**
   - Go to [railway.app](https://railway.app)
   - Create PostgreSQL database
   - Copy the connection string

   **Option C: Neon (Serverless PostgreSQL)**
   - Go to [neon.tech](https://neon.tech)
   - Create a free database
   - Copy the connection string

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables:
     ```
     DATABASE_URL=your_postgres_connection_string
     NEXTAUTH_URL=https://your-app.vercel.app
     NEXTAUTH_SECRET=generate-a-random-secret-here
     ```
   - Click "Deploy"

4. **Run database migrations:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Link your project
   vercel link
   
   # Push database schema
   npx prisma db push
   ```

**Pros:**
- ✅ Free tier available
- ✅ Automatic deployments on git push
- ✅ Built-in CDN
- ✅ Easy to use
- ✅ Great Next.js integration

**Cons:**
- ❌ Serverless functions have execution time limits
- ❌ Database needs to be hosted separately

---

## 🚂 Railway (All-in-One Solution)

**Best for:** Full-stack apps with database included

### Steps:

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Create a new project**
4. **Add PostgreSQL service:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically creates the database
5. **Add your app:**
   - Click "New" → "GitHub Repo"
   - Select your repository
6. **Set environment variables:**
   - Railway automatically provides `DATABASE_URL`
   - Add:
     ```
     NEXTAUTH_URL=https://your-app.railway.app
     NEXTAUTH_SECRET=your-secret-key
     ```
7. **Add build command:**
   - In settings, set build command: `npm run build`
8. **Deploy:**
   - Railway auto-deploys on push

**Pros:**
- ✅ Database included
- ✅ Simple setup
- ✅ Free tier ($5 credit/month)
- ✅ Automatic HTTPS

**Cons:**
- ❌ Free tier limited
- ❌ Can get expensive with traffic

---

## 🎨 Render

**Best for:** Simple deployments with database

### Steps:

1. **Go to [render.com](https://render.com)**
2. **Create account**
3. **Create PostgreSQL database:**
   - New → PostgreSQL
   - Copy the connection string
4. **Create Web Service:**
   - New → Web Service
   - Connect your GitHub repo
   - Settings:
     - Build Command: `npm install && npx prisma generate && npm run build`
     - Start Command: `npm start`
   - Add environment variables:
     ```
     DATABASE_URL=your_postgres_connection_string
     NEXTAUTH_URL=https://your-app.onrender.com
     NEXTAUTH_SECRET=your-secret-key
     ```
5. **Deploy**

**Pros:**
- ✅ Free tier available
- ✅ PostgreSQL included
- ✅ Automatic deployments

**Cons:**
- ❌ Free tier spins down after inactivity
- ❌ Slower cold starts

---

## 🐳 Docker Deployment (Self-Hosting)

**Best for:** Full control, VPS hosting

### Using Docker Compose:

1. **Get a VPS:**
   - DigitalOcean Droplet ($6/month)
   - AWS EC2
   - Linode
   - Hetzner

2. **SSH into your server:**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Docker:**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   apt-get install docker-compose -y
   ```

4. **Clone your repository:**
   ```bash
   git clone <your-repo-url>
   cd Reddit-Clone
   ```

5. **Set up environment:**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your values
   ```

6. **Update docker-compose.yml:**
   - Set `NEXTAUTH_URL` to your domain
   - Update database credentials

7. **Build and start:**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

8. **Set up reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Set up SSL (Let's Encrypt):**
   ```bash
   apt-get install certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com
   ```

**Pros:**
- ✅ Full control
- ✅ Can be cheaper at scale
- ✅ No vendor lock-in

**Cons:**
- ❌ Requires server management
- ❌ Need to handle updates manually
- ❌ Security maintenance

---

## ☁️ Cloud Platforms

### AWS (Amazon Web Services)

**Services needed:**
- **EC2** or **ECS** for the app
- **RDS PostgreSQL** for database
- **Route 53** for DNS
- **CloudFront** for CDN (optional)

**Cost:** ~$20-50/month minimum

### Google Cloud Platform

**Services needed:**
- **Cloud Run** for the app
- **Cloud SQL PostgreSQL** for database

**Cost:** ~$20-40/month minimum

### Azure

**Services needed:**
- **App Service** for the app
- **Azure Database for PostgreSQL**

**Cost:** ~$25-50/month minimum

---

## 📊 Comparison Table

| Platform | Ease | Cost | Database | Best For |
|----------|------|------|----------|----------|
| **Vercel** | ⭐⭐⭐⭐⭐ | Free-$20/mo | External | Quick deployment |
| **Railway** | ⭐⭐⭐⭐ | $5-20/mo | Included | All-in-one |
| **Render** | ⭐⭐⭐⭐ | Free-$25/mo | Included | Simple setup |
| **DigitalOcean** | ⭐⭐⭐ | $6-12/mo | Self-managed | Learning/Control |
| **AWS/GCP/Azure** | ⭐⭐ | $20-50/mo | Managed | Enterprise |

---

## 🔧 Post-Deployment Checklist

After deploying, make sure to:

1. ✅ **Set up database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

2. ✅ **Update NEXTAUTH_URL** in environment variables

3. ✅ **Generate secure NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. ✅ **Test all features:**
   - User registration
   - Creating communities
   - Creating posts
   - Voting
   - Comments

5. ✅ **Set up custom domain** (optional)

6. ✅ **Enable HTTPS** (most platforms do this automatically)

7. ✅ **Set up monitoring** (optional):
   - Sentry for error tracking
   - Vercel Analytics
   - Uptime monitoring

---

## 🎯 Recommended Setup for Beginners

**Best combination:**
1. **Vercel** for hosting the app (free tier)
2. **Supabase** for PostgreSQL database (free tier)
3. **Total cost: $0/month**

This gives you:
- ✅ Professional hosting
- ✅ Automatic deployments
- ✅ Free tier that's generous
- ✅ Easy to scale later

---

## 📝 Environment Variables for Production

Make sure these are set in your hosting platform:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-very-secure-random-secret
NODE_ENV=production
```

**Important:** Never commit `.env` files to git! Always use your platform's environment variable settings.

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Render Docs:** https://render.com/docs
- **Prisma Deployment:** https://www.prisma.io/docs/guides/deployment

