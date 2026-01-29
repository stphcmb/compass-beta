# Security Rules - Compass Platform

## 🔒 Critical Security Rules (NON-NEGOTIABLE)

These rules are **mandatory** and violations are considered **security incidents**.

## 1. No Secrets Committed or Logged

**Rules**:
- All secrets in `.env.local` (gitignored)
- Never log tokens, passwords, API keys, or PII
- Never commit `.env.local` or any file containing secrets
- Use environment variables for all sensitive data
- Check `.gitignore` includes `.env.local`

**Examples**:
```typescript
// ❌ NEVER DO THIS
const apiKey = "sk-1234567890abcdef"
console.log("User token:", user.token)
console.log("Database URL:", process.env.DATABASE_URL)

// ✅ CORRECT
const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) throw new Error('GEMINI_API_KEY not configured')
// Never log sensitive data
```

**Environment variable checklist**:
```bash
# .env.local (gitignored)
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
GEMINI_API_KEY=...

# .env.example (committed, safe)
DATABASE_URL=your_database_url_here
CLERK_SECRET_KEY=your_clerk_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## 2. Authentication Required for All Mutations

**Rules**:
- Every Server Action must verify user authentication
- Every Route Handler (except webhooks) must verify auth
- Use Clerk's `currentUser()` or `auth()` helpers
- Return error if user not authenticated
- **No unauthenticated writes to database**

**Pattern** (use this in all Server Actions):
```typescript
'use server'

import { currentUser } from '@clerk/nextjs/server'

export async function createItem(data: unknown) {
  // REQUIRED: Check authentication first
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Proceed with operation
  // ...
}
```

**For Route Handlers**:
```typescript
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Proceed
}
```

## 3. Row Level Security (RLS) on All Tables

**Rules**:
- All Supabase tables must have RLS enabled
- Users can only access their own data (unless intentionally public)
- Test RLS policies before deploying
- No exceptions - every table needs RLS

**Required for all tables**:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

**Standard patterns**:
```sql
-- User-owned data (most common)
CREATE POLICY "Users view own data"
  ON user_analyses FOR SELECT
  USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users create own data"
  ON user_analyses FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users update own data"
  ON user_analyses FOR UPDATE
  USING (auth.uid()::TEXT = user_id);

-- Public read, owner write
CREATE POLICY "Public read"
  ON authors FOR SELECT
  USING (true);

CREATE POLICY "Admin write"
  ON authors FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

**Testing RLS policies**:
```sql
-- Test as specific user
SET request.jwt.claims = '{"sub": "user-id-123"}';
SELECT * FROM user_analyses; -- Should only see user's data
```

## 4. Input Validation on All User Input

**Rules**:
- Use Zod schemas for all Server Actions
- Validate all Route Handler inputs
- Sanitize any user input displayed in UI
- Never trust client-side input
- Fail fast on invalid input

**Pattern**:
```typescript
import { z } from 'zod'

// Define schema
const createAuthorSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  tier: z.enum(['tier1', 'tier2', 'tier3']),
  email: z.string().email(),
})

export async function createAuthor(input: unknown) {
  'use server'

  // Validate input (throws if invalid)
  const data = createAuthorSchema.parse(input)

  // Proceed with validated data
}
```

**For forms with FormData**:
```typescript
'use server'

export async function submitForm(formData: FormData) {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
  })

  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
  }

  const validated = schema.parse(rawData)
  // Proceed
}
```

## Additional Security Best Practices

### CORS Configuration

Only configure CORS if you have public API endpoints:
```typescript
// app/api/public/route.ts
export async function GET(request: Request) {
  const data = await getData()

  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': 'https://yourdomain.com',
      'Access-Control-Allow-Methods': 'GET, POST',
    }
  })
}
```

### Rate Limiting

For public endpoints, implement rate limiting:
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

export async function POST(request: Request) {
  // Check rate limit
  // ...
}
```

### SQL Injection Prevention

Using Supabase client prevents SQL injection, but if using raw SQL:
```typescript
// ❌ NEVER DO THIS
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ CORRECT: Use parameterized queries
const { data } = await supabase.rpc('get_user', { user_id: userId })
```

### XSS Prevention

```tsx
// ✅ React automatically escapes
<div>{userInput}</div>

// ❌ DANGEROUS: Don't use dangerouslySetInnerHTML with user input
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ If you must render HTML, sanitize first
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

## Security Checklist

Before deploying:
- [ ] All secrets in environment variables
- [ ] No secrets logged anywhere
- [ ] `.env.local` in `.gitignore`
- [ ] All Server Actions check authentication
- [ ] All tables have RLS enabled
- [ ] All user inputs validated with Zod
- [ ] No SQL injection vulnerabilities
- [ ] XSS prevention in place
- [ ] CORS configured if needed
- [ ] Rate limiting on public endpoints
