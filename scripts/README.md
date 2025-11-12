# Database Seeding Guide

This guide will help you populate your Supabase database with seed data.

## Step 1: Get Your Database Connection String

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `qbobesjpzawlffbgytve`
3. Click **"Project Settings"** (gear icon in the sidebar)
4. Click **"Database"** in the left menu
5. Scroll down to **"Connection string"**
6. Select **"URI"** tab
7. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db...`)
8. Click "Reset database password" if you don't have the password

## Step 2: Update .env.local

Open `.env.local` and replace `[YOUR-PASSWORD]` in the DATABASE_URL with your actual database password:

```bash
DATABASE_URL=postgresql://postgres.YOUR_ACTUAL_PASSWORD@db.qbobesjpzawlffbgytve.supabase.co:5432/postgres
```

## Step 3: Run the Seed Script

You have two seeding options:

### Option A: Basic Seed Data (5 authors, 5 camps)
```bash
npm run seed
```

### Option B: Comprehensive MVP Data (32 authors, 14 camps) - RECOMMENDED
```bash
npm run seed:mvp
```

## What the Script Does

1. ✅ Connects to your Supabase database
2. ✅ Creates all necessary tables (authors, camps, camp_authors, sources, topics, etc.)
3. ✅ Loads seed data
4. ✅ Verifies the data was inserted correctly
5. ✅ Shows you a summary of what was created

## Troubleshooting

### "relation already exists"
Tables are already created. This is fine! The script will skip table creation.

### "duplicate key"
Data already exists. To re-seed:
1. Go to Supabase Dashboard → SQL Editor
2. Run: `TRUNCATE authors, camps, camp_authors, sources, topics, source_topics, saved_searches, search_history CASCADE;`
3. Run the seed script again

### "password authentication failed"
Your database password is incorrect. Go back to Step 1 and reset your password.

## After Seeding

Once seeding is complete, start your development server:

```bash
npm run dev
```

Then visit `http://localhost:3000` to see your data in the frontend!
