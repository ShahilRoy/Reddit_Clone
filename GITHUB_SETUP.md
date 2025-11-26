# Connect Your Project to GitHub

Your repository is not currently connected to GitHub. Follow these steps:

## Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name:** `Reddit-Clone` (or any name you prefer)
   - **Description:** "Fullstack Reddit clone built with Next.js"
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## Step 2: Connect Your Local Repository

After creating the repository, GitHub will show you commands. Use these:

### Option A: If you haven't pushed anything yet (your case)

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace:
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

### Option B: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Verify Connection

After pushing, verify with:
```bash
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (fetch)
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (push)
```

## Quick Command Reference

**Add remote:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Rename branch to main (if needed):**
```bash
git branch -M main
```

**Push to GitHub:**
```bash
git push -u origin main
```

**Check remote:**
```bash
git remote -v
```

**Remove remote (if you need to change it):**
```bash
git remote remove origin
```

## Troubleshooting

### "Repository not found"
- Make sure the repository name matches exactly
- Check your GitHub username is correct
- Verify you have access to the repository

### "Authentication failed"
- You may need to use a Personal Access Token instead of password
- Go to GitHub Settings → Developer settings → Personal access tokens
- Generate a new token with `repo` permissions
- Use the token as your password when pushing

### "Branch 'main' does not exist"
- Your current branch might be `master`
- Either rename: `git branch -M main`
- Or push master: `git push -u origin master`

## Next Steps After Connecting

Once connected, you can:
1. ✅ Deploy to Vercel (it will auto-detect your GitHub repo)
2. ✅ Set up CI/CD
3. ✅ Collaborate with others
4. ✅ Track changes and issues

