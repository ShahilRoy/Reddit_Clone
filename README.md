# Reddit Clone

A fullstack Reddit clone built with Next.js 14, TypeScript, Prisma, PostgreSQL, and Tailwind CSS.

## Features

- 🔐 User authentication (sign up, login, logout)
- 👥 User profiles
- 🏘️ Create and join communities (subreddits)
- 📝 Create posts (text, link, or image)
- ⬆️⬇️ Vote on posts and comments
- 💬 Comment system with nested replies
- 🔍 Search communities
- 📱 Responsive design

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Reddit-Clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and NextAuth secret:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/reddit_clone?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── communities/   # Community endpoints
│   │   ├── posts/         # Post endpoints
│   │   └── comments/      # Comment endpoints
│   ├── r/                 # Community pages
│   ├── user/              # User profile pages
│   ├── create-post/       # Create post page
│   ├── create-community/  # Create community page
│   ├── login/             # Login page
│   └── register/          # Register page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Header.tsx        # Navigation header
│   ├── PostCard.tsx      # Post display component
│   └── CommentSection.tsx # Comment thread component
├── lib/                  # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Authentication helpers
│   └── utils.ts          # General utilities
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── types/                # TypeScript type definitions
```

## Database Schema

- **User**: User accounts with authentication
- **Community**: Subreddit-like communities
- **Post**: Posts within communities (text, link, or image)
- **Comment**: Comments on posts with nested replies
- **Vote**: Upvotes/downvotes on posts and comments
- **Subscription**: User subscriptions to communities

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Communities
- `GET /api/communities` - List communities (with search)
- `POST /api/communities` - Create community
- `GET /api/communities/[name]` - Get community details
- `POST /api/communities/[name]/subscribe` - Subscribe/unsubscribe

### Posts
- `GET /api/posts` - List posts (optionally filtered by community)
- `POST /api/posts` - Create post
- `GET /api/posts/[id]` - Get post details
- `POST /api/posts/[id]/vote` - Vote on post

### Comments
- `GET /api/comments?postId=...` - Get comments for a post
- `POST /api/comments` - Create comment
- `POST /api/comments/[id]/vote` - Vote on comment

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options:

**Option 1: Vercel + Supabase (Recommended - Free)**
1. Push code to GitHub
2. Deploy to [Vercel](https://vercel.com) (connects to GitHub)
3. Create free database at [Supabase](https://supabase.com)
4. Add environment variables in Vercel dashboard
5. Deploy!

**Option 2: Railway (All-in-One)**
1. Push code to GitHub
2. Create project on [Railway](https://railway.app)
3. Add PostgreSQL service
4. Deploy!

**Option 3: Docker (Self-Hosting)**
- Use the included `Dockerfile` and `docker-compose.yml`
- Deploy to any VPS (DigitalOcean, AWS, etc.)
- See DEPLOYMENT.md for detailed instructions

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your app URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET`: Secret key for NextAuth (generate with `openssl rand -base64 32`)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

