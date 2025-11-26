# Finding Your Supabase Connection String

If you can't find the connection string, here are multiple ways to locate it:

## Method 1: Settings → Database (Most Common)

1. **Look at the left sidebar** - find the **⚙️ Settings** icon (usually at the bottom)
2. Click **Settings**
3. In the Settings page, look for **"Database"** in the left menu
4. Click **"Database"**
5. Scroll down - you should see sections like:
   - Connection string
   - Connection pooling
   - Database settings
6. Look for a section labeled **"Connection string"** or **"Connection info"**
7. You might see tabs: **URI**, **JDBC**, **Connection pooling**
8. Click the **"URI"** tab
9. Copy the connection string

## Method 2: Project Settings

1. Click on your **project name** at the top of the page
2. Select **"Project Settings"** or **"Settings"**
3. Click **"Database"** in the left sidebar
4. Find the connection string section

## Method 3: API Settings

Sometimes the connection string is in the API section:

1. Go to **Settings** → **"API"**
2. Look for database connection information
3. Or check **"Database"** tab within API settings

## Method 4: Build It Manually

If you can see the connection details but not the full string:

1. Go to **Settings** → **Database**
2. Look for these values:
   - **Host:** Something like `db.xxxxx.supabase.co`
   - **Database:** Usually `postgres`
   - **Port:** Usually `5432`
   - **User:** Usually `postgres`
   - **Password:** The password you created when setting up the project

3. Build the connection string using this format:
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   ```

4. Example:
   ```
   postgresql://postgres:MyPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```

## Method 5: Check SQL Editor

1. Go to **"SQL Editor"** in the left sidebar
2. Sometimes connection info is displayed there
3. Or create a new query - connection details might be shown

## Method 6: Direct URL

Try going directly to:
```
https://supabase.com/dashboard/project/YOUR_PROJECT_REF/settings/database
```

Replace `YOUR_PROJECT_REF` with your project reference (found in your project URL).

## What the Connection String Looks Like

It should look like one of these formats:

**Standard format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**With connection pooling:**
```
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Important:** Replace `[YOUR-PASSWORD]` with the actual password you created when setting up the project!

## Still Can't Find It?

1. **Check if your project is fully created** - wait a few minutes if it's still initializing
2. **Try refreshing the page**
3. **Check different sections:**
   - Settings → Database
   - Settings → API
   - Project Settings → Database
4. **Look for these keywords:**
   - "Connection string"
   - "Connection URI"
   - "Database URL"
   - "Postgres connection"
   - "Connection info"

## Alternative: Use Connection Pooling String

If you find a "Connection pooling" section instead:
- That also works! Use the connection pooling URI
- It might look different but will still work with Prisma

## Quick Test

Once you have the connection string, you can test it locally:

1. Create a `.env` file in your project
2. Add: `DATABASE_URL="your-connection-string-here"`
3. Run: `npx prisma db push`
4. If it works, the connection string is correct!

## Need More Help?

- Supabase Docs: https://supabase.com/docs/guides/database/connecting-to-postgres
- Supabase Discord: https://discord.supabase.com
- Check Supabase status: https://status.supabase.com

