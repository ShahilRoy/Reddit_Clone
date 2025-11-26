# Step-by-Step Deployment Guide

Follow these steps to deploy your Reddit Clone to the internet!

## 🎯 Recommended: Vercel + Supabase (100% Free)

This is the easiest and fastest way to deploy. Both services have generous free tiers.

---

## Part 1: Set Up Database (Supabase) - 5 minutes

### Step 1: Create Supabase Account
1. Go to **[supabase.com](https://supabase.com)**
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub (easiest) or email
4. Verify your email if needed

### Step 2: Create a New Project
1. Click **"New Project"** button
2. Fill in:
   - **Name:** `reddit-clone` (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free (default)
3. Click **"Create new project"**
4. Wait 2-3 minutes for database to be created

### Step 3: Get Database Connection String

**Method 1: From Settings (Most Common)**
1. Once project is ready, look at the left sidebar
2. Click on **"Settings"** (gear icon ⚙️ at the bottom of sidebar)
3. In the Settings menu, click **"Database"** (or look for "Connection string")
4. Scroll down to find **"Connection string"** or **"Connection pooling"** section
5. Look for tabs: **"URI"**, **"JDBC"**, **"Connection pooling"**, or **"Direct connection"**
6. Click on the **"URI"** tab (or whichever shows the connection string)
7. You'll see something like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
8. **Replace `[YOUR-PASSWORD]`** with the password you created in Step 2
9. **Copy the entire string** - you'll need it in Part 2!

**Method 2: From Project Settings**
1. Click on your project name at the top
2. Go to **"Project Settings"** (or just "Settings")
3. Click **"Database"** in the left menu
4. Look for **"Connection string"** section
5. Find the **"URI"** format

**Method 3: Direct Link**
1. The connection string is also available at: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/database`
2. Replace `YOUR_PROJECT_ID` with your actual project ID (found in the URL)

**What to look for:**
- The connection string should look like:
  ```
  postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
  ```
- Or it might show:
  ```
  postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```

**If you still can't find it:**
1. Go to **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. The connection info might be shown there
4. Or check the **"API"** section in Settings - sometimes the connection string is there

**Alternative: Get connection details separately**
If you can't find the full connection string, you can build it manually:
1. Go to Settings → Database
2. Find these values:
   - **Host:** `db.xxxxx.supabase.co` (or similar)
   - **Database name:** Usually `postgres`
   - **Port:** Usually `5432`
   - **User:** Usually `postgres`
   - **Password:** The one you created in Step 2
3. Build the connection string:
   ```
   postgresql://postgres:YOUR_PASSWORD@HOST:5432/postgres
   ```

**Example:**
```
postgresql://postgres:MyPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## Part 2: Deploy to Vercel - 10 minutes

### Step 1: Create Vercel Account
1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Repository
1. After signing in, you'll see the dashboard
2. Click **"Add New..."** → **"Project"**
3. You'll see a list of your GitHub repositories
4. Find **"Reddit-Clone"** (or your repo name)
5. Click **"Import"** next to it

### Step 3: Configure Project
1. **Project Name:** Keep default or change it
2. **Framework Preset:** Should auto-detect "Next.js" ✅
3. **Root Directory:** Leave as `./` (default)
4. **Build Command:** Should be `npm run build` ✅
5. **Output Directory:** Leave as `.next` (default)
6. **Install Command:** Should be `npm install` ✅

### Step 4: Add Environment Variables
**This is important!** Click **"Environment Variables"** and add these:

1. **DATABASE_URL**
   - **Key:** `DATABASE_URL`
   - **Value:** Paste the Supabase connection string from Part 1, Step 3
   - Click **"Add"**

2. **NEXTAUTH_URL**
   - **Key:** `NEXTAUTH_URL`
   - **Value:** `https://your-project-name.vercel.app` (Vercel will show you the URL)
   - Or use: `https://reddit-clone.vercel.app` (replace with your actual project name)
   - Click **"Add"**

3. **NEXTAUTH_SECRET**
   - **Key:** `NEXTAUTH_SECRET`
   - **Value:** Generate a random secret:
     - **Windows PowerShell:**
       ```powershell
       [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
       ```
     - **Mac/Linux Terminal:**
       ```bash
       openssl rand -base64 32
       ```
     - **Or use this online generator:** https://generate-secret.vercel.app/32
   - Copy the generated string and paste as value
   - Click **"Add"**

### Step 5: Deploy!
1. Click **"Deploy"** button at the bottom
2. Wait 2-3 minutes for build to complete
3. You'll see build logs in real-time
4. When done, you'll see **"Congratulations!"** message
5. Click **"Visit"** to see your live site!

**Your site is now live!** 🎉

---

## Part 3: Set Up Database Schema - 2 minutes

Your app is deployed, but the database is empty. Let's set it up:

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link your project:**
   ```bash
   cd C:\Users\Shahil\OneDrive\Reddit-Clone
   vercel link
   ```
   - Select your project when prompted
   - Use default settings

4. **Push database schema:**
   ```bash
   npx prisma db push
   ```

5. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

### Option B: Using Supabase SQL Editor

1. Go to your Supabase project
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy the schema from `prisma/schema.prisma` and convert it to SQL, OR
5. Use Prisma Migrate (easier):
   - Run `npx prisma migrate dev --name init` locally
   - This will create migration files
   - Or just use Option A above

**Easiest:** Use Option A (Vercel CLI)

---

## Part 4: Test Your Deployment

1. **Visit your site:** `https://your-project.vercel.app`
2. **Register a new account:**
   - Go to `/register`
   - Create a test user
3. **Create a community:**
   - Go to `/create-community`
   - Create a test community (e.g., "test")
4. **Create a post:**
   - Go to `/create-post`
   - Create a test post
5. **Test voting and comments**

If everything works, you're done! ✅

---

## 🎨 Custom Domain (Optional)

Want to use your own domain?

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your domain name
4. Follow DNS instructions
5. Vercel handles SSL automatically!

---

## 🔄 Updating Your Site

Every time you push to GitHub, Vercel automatically:
1. Detects the change
2. Rebuilds your site
3. Deploys the update
4. Your site updates in 1-2 minutes!

**Just push to GitHub:**
```bash
git add .
git commit -m "Update description"
git push
```

---

## 🐛 Troubleshooting

### "Database connection failed"
- ✅ Check DATABASE_URL in Vercel environment variables
- ✅ Make sure password in connection string matches Supabase password
- ✅ Verify Supabase project is active

### "NEXTAUTH_SECRET is missing"
- ✅ Add NEXTAUTH_SECRET to Vercel environment variables
- ✅ Redeploy after adding

### "Build failed"
- ✅ Check build logs in Vercel dashboard
- ✅ Make sure all dependencies are in package.json
- ✅ Try running `npm run build` locally first

### "Can't create account / login"
- ✅ Make sure database schema is pushed (Part 3)
- ✅ Check Vercel function logs for errors

### Database schema not working
- ✅ Make sure you ran `npx prisma db push`
- ✅ Check Supabase → Database → Tables to see if tables exist

---

## 📊 Check Your Deployment Status

**Vercel Dashboard:**
- View deployments: https://vercel.com/dashboard
- See logs, analytics, and more

**Supabase Dashboard:**
- View database: https://supabase.com/dashboard
- See tables, data, and logs

---

## 🎉 You're Live!

Your Reddit Clone is now accessible to anyone on the internet!

**Share your site:**
- Send the Vercel URL to friends
- Add it to your portfolio
- Show it off! 🚀

---

## Next Steps (Optional)

1. **Add custom domain**
2. **Set up error tracking** (Sentry)
3. **Add analytics** (Vercel Analytics)
4. **Set up monitoring** (Uptime Robot)
5. **Customize styling**
6. **Add more features**

---

## Quick Reference

**Your URLs:**
- **Live Site:** `https://your-project.vercel.app`
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard

**Important Commands:**
```bash
# Deploy database changes
npx prisma db push

# View database in browser
npx prisma studio

# Check deployment logs
vercel logs
```

