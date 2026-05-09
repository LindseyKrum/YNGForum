# Team Dashboard

A collaborative dashboard for tracking monthly conversations, managing topics, sharing contact information, and posting team updates.

## Features

- **Monthly Conversation Tracking**: Track discussion topics with outcomes and action items
- **Parking Lot**: Manage topics for future discussion with priority levels
- **Contact Directory**: Maintain team member contact information
- **Newsfeed**: Share photos and text updates with timestamps
- **Locations**: Upload and display a map showing where team members are based
- **Password Authentication**: Single shared password for all users

## Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new free project
2. Go to **SQL Editor** and run all the SQL from `database-schema.sql`
3. Copy your **Project URL** and **Anon Key** from Settings → API

### 2. Set Environment Variables

Create/update these files:

**`backend/.env`**
```
PORT=3001
DASHBOARD_PASSWORD=your-secure-password-here
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here
```

**`frontend/.env`**
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

- Frontend runs at `http://localhost:5173`
- Backend runs at `http://localhost:3001`

## Usage

1. **Login**: Use the password you set in `DASHBOARD_PASSWORD`
2. **Add Team**: Go to Contacts and add team members (name, email, phone, company, role)
3. **Track Conversations**: Create a month, add topics with outcomes and action items
4. **Parking Lot**: Save topics for later discussion, assign and prioritize them
5. **Newsfeed**: Post text + photos that all team members see
6. **Locations**: Upload a map image showing where everyone is based

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial team dashboard setup"
git remote add origin https://github.com/yourusername/team-dashboard.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Add these environment variables in Vercel Settings:
   - `DASHBOARD_PASSWORD`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
4. Deploy!

Vercel will automatically:
- Build the frontend with Vite
- Expose the backend API
- Handle routing between them

## Tech Stack

- **Frontend**: React 18 + Vite + Axios
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Auth**: Password-based (bcryptjs)
- **File Storage**: Base64-encoded images (stored in Postgres)
- **Hosting**: Vercel (recommended)

## Troubleshooting

**"Cannot GET /api/..."** — Backend not running. Check that port 3001 is free and backend started.

**"No database connection"** — Check Supabase credentials in `.env` files.

**"Images not uploading"** — Check browser console for errors. Images are stored as base64 in the database.

**"Login always fails"** — Verify `DASHBOARD_PASSWORD` matches your `.env` file.
