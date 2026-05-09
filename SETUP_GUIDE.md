# Team Dashboard Setup Guide

Complete setup takes about 15 minutes. Follow each step in order.

---

## Step 1: Create Supabase Project (5 minutes)

### 1.1 Create Account

1. Go to [supabase.com](https://supabase.com)
2. Click **Sign Up** (or **Sign In** if you have an account)
3. Create account with email/GitHub/Google

### 1.2 Create New Project

1. Click **+ New Project**
2. Choose your organization (or create new one)
3. Enter **Project name**: `team-dashboard`
4. Choose **Region**: Pick closest to your location
5. Set **Database password**: Store this safely (you'll need it later)
6. Click **Create new project** (takes ~2 minutes)

### 1.3 Set Up Database Schema

1. Wait for project to initialize (you'll see "Database is running")
2. Click **SQL Editor** in left sidebar
3. Click **+ New Query**
4. Copy everything from `database-schema.sql` (in this repo)
5. Paste into the SQL editor
6. Click **Run** button (top right)
7. You should see green checkmarks ✓

### 1.4 Get Your Credentials

1. Click **Settings** (bottom left)
2. Click **API**
3. Copy and save these:
   - **Project URL** (under "Project API keys")
   - **Anon Key** (public key, safe to share)
   - **Service Role Key** (secret, keep private!)

---

## Step 2: Set Up Environment Variables (3 minutes)

### 2.1 Backend Configuration

1. Open `backend/.env` in any text editor
2. Replace the placeholders:

```env
PORT=3001
DASHBOARD_PASSWORD=YourSecurePasswordHere
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.2 Frontend Configuration

1. Open `frontend/.env`
2. Replace the placeholders:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** The Anon Key (in frontend) is public, but the Service Key (in backend) is private!

---

## Step 3: Install Dependencies (3 minutes)

In Terminal, navigate to this folder and run:

```bash
cd ~/Desktop/lowi-claude-setup
npm install
```

This installs Node packages for both frontend and backend.

---

## Step 4: Start Development Server (2 minutes)

In Terminal:

```bash
npm run dev
```

You'll see:
```
> team-dashboard dev
> npm run dev --workspace=frontend & npm run dev --workspace=backend

> team-dashboard-frontend dev
> vite
Vite v4.x.x ready in xx ms
➜  local:   http://localhost:5173/
```

---

## Step 5: Open Dashboard

1. Open your browser to **http://localhost:5173**
2. You should see the **Team Dashboard** login screen
3. Enter the password you set in `DASHBOARD_PASSWORD` (backend/.env)
4. Click **Login**

---

## Step 6: Add Your First Contact

1. Click **Contacts** tab
2. Click **+ Add Contact**
3. Fill in your info (or a test contact):
   - Name: "Lindsey Krummell"
   - Email: "lindsey@example.com"
   - Phone: "555-1234"
   - Company: "LOWI"
   - Role: "President & COO"
4. Click **Save Contact**

---

## Step 7: Test All Features

### Conversations
1. Click **Conversations** tab
2. Click **Add Month** and enter `2026-05`
3. Add a topic (e.g., "Strategic planning")
4. Enter outcome and action items
5. Click **Add Topic**

### Parking Lot
1. Click **Parking Lot** tab
2. Add a topic you'll discuss later
3. Set priority and assign to someone
4. Click **Add Item**

### Newsfeed
1. Click **Newsfeed** tab
2. Select your name from dropdown
3. Write an update
4. (Optional) Add photos
5. Click **Post Update**

### Locations
1. Click **Locations** tab
2. Click **Upload Map**
3. Select an image or screenshot of a world map
4. You can update it anytime

---

## Deployment to Vercel (5 minutes after testing)

### Option A: Command Line

```bash
npm install -g vercel
vercel
```

### Option B: Web Interface

1. Push to GitHub (see instructions below)
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Add these env vars:
   - `DASHBOARD_PASSWORD`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
5. Click **Deploy**

### Push to GitHub

```bash
git remote add origin https://github.com/yourusername/team-dashboard.git
git branch -M main
git push -u origin main
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot GET /api/auth/login" | Backend not running. Check Terminal shows "listening on port 3001" |
| "Cannot find module" | Run `npm install` again |
| "Invalid password" | Check `DASHBOARD_PASSWORD` in `backend/.env` matches what you entered |
| "No database connection" | Check Supabase URL and keys are correct in `.env` files |
| Images not uploading | Check browser console (F12) for errors. Large images may need optimization. |
| "Port 5173 already in use" | Change port in `frontend/vite.config.js` or kill other process |

---

## What's Included

✅ Full React + Node.js dashboard  
✅ Password authentication  
✅ Supabase database with 5 tables  
✅ Conversation tracking with outcomes  
✅ Parking lot for later topics  
✅ Contact directory  
✅ Newsfeed with photo support  
✅ Static location map  
✅ Ready to deploy to Vercel  

---

## Next Steps

1. **Customize**: Edit component colors in CSS files
2. **Deploy**: Follow deployment steps above
3. **Share**: Send dashboard URL to your team
4. **Use**: Start tracking conversations!

---

## Need Help?

- Check the main `TEAM_DASHBOARD_README.md` for overview
- Look at error messages in Terminal/Browser console
- Check Supabase Status page if database seems down
