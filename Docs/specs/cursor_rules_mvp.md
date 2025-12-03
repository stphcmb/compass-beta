# PROJECT RULES: Compass MVP

**Last Updated:** 2025-11-05

---

## 1. TECH STACK (REQUIRED)

- **Framework:** Next.js 14+ with App Router (`app/` directory)
- **Language:** TypeScript (all files `.ts` or `.tsx`)
- **Database:** Supabase (basic operations only, no RLS or complex security)
- **UI:** shadcn/ui components from `components/ui/`
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod validation

---

## 2. MVP PRINCIPLES

### Core Focus
- **Build features fast** - prioritize working code over perfect architecture
- **Core value proposition only** - refer to `mvp_prd.md` for what's in scope
- **No premature optimization** - add complexity only when actually needed
- **Security is OUT OF SCOPE** - basic auth only, no RLS, no complex policies

### What to Skip for MVP
- ❌ Row Level Security (RLS) policies
- ❌ Complex authentication flows (OAuth, 2FA, etc.)
- ❌ Performance optimizations
- ❌ Advanced error handling
- ❌ Extensive testing
- ❌ Accessibility beyond basics
- ❌ Dark mode
- ❌ Complex database migrations

---

## 3. PROJECT STRUCTURE

```
app/
├── (auth)/                    # Login/signup pages
├── (dashboard)/               # Main app pages
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── [feature]/             # Feature-specific components
├── lib/
│   ├── supabase.ts           # Simple Supabase client setup
│   ├── actions/              # Server Actions
│   └── utils/                # Helper functions
└── types/
    └── supabase.ts           # Generated types
```

### File Naming
- Components: `PascalCase.tsx`
- Server Actions: `kebab-case.ts`
- Utilities: `kebab-case.ts`

---

## 4. DATABASE DESIGN (MVP APPROACH)

### Keep It Simple
- Create tables as needed - don't overthink the schema
- Add columns when you need them - refactoring is fine for MVP
- Include `id`, `created_at`, `updated_at` on tables (Supabase defaults)
- Skip soft deletes, audit logs, and complex triggers for now
- **No RLS policies** - keep database operations simple

### Type Generation
- Run when schema changes: `npx supabase gen types typescript --project-id <ref> > types/supabase.ts`
- Use generated types in your code for autocompletion

---

## 5. CODE STANDARDS

### Critical Rules
1. **Always write complete code** - NO placeholders like `// ...existing code` or `// ... rest of code`
2. **Include all imports** at the top of every file
3. **Show the full file** when making changes
4. **Use TypeScript types** - avoid `any` when possible
5. **Component names in PascalCase** (e.g., `UserList.tsx`)

### Keep It Simple
- Default to Server Components (add `'use client'` only when needed)
- Use Server Actions for form submissions and data mutations
- Handle basic errors with try-catch and user-friendly messages
- Add loading states with simple "Loading..." text or shadcn/ui Skeleton

---

## 6. COMPONENTS & STYLING

### UI Components
- **Always use shadcn/ui** from `components/ui/` for buttons, forms, dialogs, etc.
- Customize with Tailwind classes via `className` prop
- Don't modify shadcn/ui component files directly

### Styling Approach
- Use Tailwind utility classes everywhere
- Mobile-first: design for small screens, add `md:` and `lg:` as needed
- Consistent spacing: use multiples of 4 (4, 8, 16, 24, 32, 48)
- Keep it simple - no custom CSS files for MVP

---

## 7. AUTHENTICATION (BASIC ONLY)

- Use Supabase Auth with email/password only
- No OAuth, no 2FA, no magic links for MVP
- Simple login/signup forms
- Store user session in cookies (Supabase default)
- Check if user is logged in before showing protected content

---

## 8. DATA FETCHING

### Simple Patterns
- Fetch data in Server Components when page loads
- Use Server Actions for creating/updating/deleting data
- No need for complex caching strategies - use Next.js defaults
- Show loading state while data fetches
- Display error if something fails

---

## 9. FORMS

### Standard Approach
- Use React Hook Form for all forms
- Validate with Zod schemas
- Display validation errors inline
- Submit via Server Actions
- Show success/error messages with basic alerts or toasts

---

## 10. WORKFLOW

### Before Building a Feature
1. **Check `mvp_prd.md`** - is this feature in scope for MVP?
2. Review what data you need - plan the database table
3. Identify reusable components

### When Building
1. Create database table in Supabase Dashboard
2. Generate TypeScript types
3. Build the UI with shadcn/ui components
4. Create Server Action for data operations
5. Connect form to Server Action
6. Test basic happy path

### MVP Checklist
- [ ] Feature works end-to-end
- [ ] Basic error handling (try-catch)
- [ ] Loading state shown
- [ ] Mobile responsive (test at 375px width)
- [ ] TypeScript types used (no `any`)

---

## 11. WHAT TO AVOID

### Don't Build These for MVP
- Complex error handling systems
- Retry logic and exponential backoff
- Advanced caching strategies
- Real-time features (unless core to product)
- Image optimization beyond Next.js Image defaults
- Comprehensive validation beyond forms
- Logging and monitoring systems
- Role-based permissions
- API rate limiting
- Extensive testing suites

### Stay Focused
- If it's not in `mvp_prd.md`, don't build it
- "Perfect" is the enemy of "shipped"
- Get features working, refine later

---

## 12. PRIMARY REFERENCE

**Always check:** `mvp_prd.md`

- This document defines what's in scope for the MVP
- If a feature isn't explicitly mentioned, ask before building it
- Follow the specifications as written
- Focus on the core value proposition

---

## CRITICAL REMINDERS FOR AI

1. ✅ Write **complete, working code** - no placeholders
2. ✅ Include **all imports**
3. ✅ Show **full file contents** when editing
4. ✅ Use **TypeScript types** (avoid `any`)
5. ✅ Use **Server Components** by default
6. ✅ Use **shadcn/ui** for all UI elements
7. ✅ Check **`mvp_prd.md`** before building features
8. ✅ Keep it **simple** - this is an MVP
9. ❌ No RLS or complex security
10. ❌ No features outside `mvp_prd.md` scope

---

## Usage

Save this as `.cursorrules` in your project root directory.

---

*End of Rules*
