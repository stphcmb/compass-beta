# Supabase Setup Guide for Compass

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Fill in:
   - **Organization**: Choose or create one
   - **Project Name**: `compass` (or your preferred name)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait 2-3 minutes for the project to be provisioned

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL**: Copy this (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**: Copy this (starts with `eyJ...`)
3. Save these credentials - you'll need them next

## Step 3: Set Up Environment Variables

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace `your_project_url_here` and `your_anon_key_here` with your actual values
4. **Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

## Step 4: Create Database Schema

Run the SQL schema file (see `schema.sql` in this directory) in your Supabase SQL Editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy and paste the contents of `schema.sql`
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. Verify tables were created in **Table Editor**

## Step 5: Test the Connection

1. Restart your Next.js dev server:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. Open http://localhost:3000
3. Check the browser console for any errors
4. The sidebar should now be able to fetch data (though tables are empty)

## Step 6: Add Seed Data (Optional)

1. You can add test data manually via the Supabase Table Editor
2. Or use the SQL insert statements provided in `seed_data.sql`
3. Start with a few authors, camps, and sources to test the UI

## Troubleshooting

### Error: "supabaseUrl is required"
- Check that `.env.local` exists and has correct variable names
- Restart the dev server after creating/updating `.env.local`
- Verify the URL starts with `https://` and ends with `.supabase.co`

### Error: "Invalid API key"
- Double-check the anon key is correct (no extra spaces)
- Make sure you're using the `anon/public` key, not the `service_role` key

### Tables not showing
- Verify the SQL schema ran successfully
- Check the Table Editor to see if tables exist
- Look for any errors in the SQL Editor output

## Next Steps

Once connected:
1. Add seed data to test the UI
2. Implement the search logic in components
3. Add the relevance calculation logic
4. Test the full search flow

