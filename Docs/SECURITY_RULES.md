# Security Rules for Compass Project

## 🔐 Critical Security Rules

### **RULE #1: NEVER Commit Secrets to Git**

**The following files/values must NEVER be committed to git:**

❌ **NEVER COMMIT:**
- `.env.local` - Contains sensitive keys
- `SUPABASE_SERVICE_ROLE_KEY` - Full database access
- Any API keys or credentials
- Database passwords
- OAuth secrets

✅ **Already Protected:**
- `.env.local` is in `.gitignore`
- Secrets are stored locally only

---

## 🛡️ Supabase Service Role Key

### **What It Is**

The `SUPABASE_SERVICE_ROLE_KEY` has **FULL, UNRESTRICTED ACCESS** to your Supabase database.

**Location:** `.env.local` (gitignored)

**Current Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (truncated for security)

### **Why It's Dangerous**

- ✅ Bypasses ALL Row Level Security (RLS) policies
- ✅ Can read/write/delete ANY data
- ✅ Can modify database structure
- ✅ Can access all tables and views

**If exposed publicly:**
- Attackers could delete your entire database
- Steal all user data
- Modify records maliciously
- Create security backdoors

### **When to Use It**

✅ **USE for:**
- Database migrations/enrichment scripts (like `execute_enrichment.mjs`)
- Admin operations requiring elevated permissions
- Seed data scripts
- Maintenance tasks

❌ **NEVER USE for:**
- Frontend/client-side code
- Public APIs
- User-facing features
- Anything that runs in the browser

**Rule:** Service role key should ONLY be used in backend/server scripts, never exposed to clients.

---

## 📋 Security Checklist

### **Before Every Commit**

- [ ] Check git status: `git status`
- [ ] Verify `.env.local` is NOT staged: `git diff --cached`
- [ ] Ensure no secrets in staged files: `git diff --cached | grep -i "key\|secret\|password"`
- [ ] Review changes carefully

### **If You Accidentally Commit a Secret**

1. **DON'T just delete it in next commit** - It's still in git history!
2. **Immediately rotate the key:**
   - Go to Supabase Dashboard → Project Settings → API
   - Click "Reset" on the service role key
   - Update `.env.local` with new key
3. **Clean git history** (if pushed to GitHub):
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   # Or delete and recreate the repository if necessary
   ```
4. **Notify your team** if this was a shared repository

---

## 🔧 Safe Practices

### **Environment Variables**

**Development (.env.local):**
```bash
# Public keys (safe for client)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (safe)

# Private keys (NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (dangerous!)
GEMINI_API_KEY=AIza... (private)
```

**Production (Vercel):**
- Set environment variables in Vercel Dashboard
- Never hardcode in source files
- Use different keys for dev vs prod

### **Code Reviews**

Before merging PRs, verify:
- [ ] No `.env.local` changes
- [ ] No hardcoded credentials
- [ ] No service role key usage in client code
- [ ] All API calls use appropriate keys

---

## 🚨 What to Do if Service Role Key is Exposed

**IMMEDIATE ACTIONS:**

1. **Rotate the key ASAP:**
   - Supabase Dashboard → Project Settings → API → Reset service role key

2. **Update `.env.local`:**
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=<new_key_here>
   ```

3. **Check for unauthorized access:**
   - Review Supabase logs
   - Check for unexpected database changes

4. **Notify stakeholders**

---

## 📚 Additional Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Managing Secrets in Git](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

## 🔍 Audit Trail

**Key Added:** 2025-12-10
**Added By:** Claude Code (via user instruction)
**Purpose:** Database enrichment operations
**Status:** ✅ Secure (in .gitignore)

---

**Last Updated:** 2025-12-10
**Maintained By:** Database Administrator
