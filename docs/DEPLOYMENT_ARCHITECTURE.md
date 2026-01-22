# SwasthiyAI - Vercel Deployment Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER'S BROWSER / CLIENT                         │
│                     (Web Browser, Mobile App)                        │
└────────────────────────────────┬────────────────────────────────────┘
                                  │ HTTPS
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        VERCEL EDGE NETWORK                           │
│                   (Global CDN + Edge Middleware)                     │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ src/middleware.ts (Runs on Edge)                            │   │
│  │ ├─ Route Protection (Auth check)                            │   │
│  │ ├─ Token Validation                                          │   │
│  │ └─ Redirect Handling                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Static Content (Cached)                                      │   │
│  │ ├─ HTML, CSS, JavaScript                                    │   │
│  │ ├─ Images, Fonts                                            │   │
│  │ └─ Public Assets                                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────┬──────────────────────────────────┬───────────────┘
                 │                                  │
           Static Content                    Dynamic Requests
                 │                                  │
                 ↓                                  ↓
        ┌─────────────────┐           ┌────────────────────────────┐
        │ CDN Cached      │           │  VERCEL SERVERLESS         │
        │ (Fast!)         │           │  FUNCTIONS                 │
        └─────────────────┘           │                            │
                                      │  ┌─────────────────────┐   │
                                      │  │ API Routes          │   │
                                      │  ├─ /api/auth/login   │   │
                                      │  ├─ /api/auth/logout  │   │
                                      │  ├─ /api/auth/me      │   │
                                      │  ├─ /api/patient/...  │   │
                                      │  └─ Other endpoints   │   │
                                      │                        │   │
                                      │  ┌─────────────────────┐   │
                                      │  │ Prisma Client       │   │
                                      │  │ (ORM Layer)         │   │
                                      │  └─────────────────────┘   │
                                      └────────────┬────────────────┘
                                                   │
                                                   │ SQL Queries
                                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                 CONNECTION POOLING LAYER                             │
│            (PgBouncer / Supabase / Neon Pooling)                     │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Connection Pool                                               │  │
│  │ ├─ Connection 1                                               │  │
│  │ ├─ Connection 2                                               │  │
│  │ ├─ Connection 3                                               │  │
│  │ └─ ... (up to pool size)                                      │  │
│  │                                                                │  │
│  │ Manages reuse of connections                                 │  │
│  │ Prevents "too many connections" error                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬──────────────────────────────────┘
                                  │
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                                │
│                 (Managed Service - Supabase/Neon)                   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Tables                                                        │  │
│  │ ├─ users (authentication, profiles)                          │  │
│  │ ├─ hospitals (hospital information)                          │  │
│  │ ├─ doctors (doctor profiles)                                 │  │
│  │ ├─ patients (patient profiles)                               │  │
│  │ ├─ visits (appointments, consultations)                      │  │
│  │ ├─ patient_intake (patient intake forms)                     │  │
│  │ └─ other tables (relationships defined)                      │  │
│  │                                                                │  │
│  │ Indexes, constraints, and relationships managed by Prisma   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Backups & Replication (Managed by Service)                   │  │
│  │ ├─ Automatic backups                                         │  │
│  │ ├─ Point-in-time recovery                                    │  │
│  │ └─ Read replicas (optional)                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Diagram

### 1. Authentication Request Flow

```
User Login Form
    ↓
POST /api/auth/login
    ↓
Vercel Serverless Function (1024MB RAM)
    ├─ Parse request body
    ├─ Validate email/password
    └─ Query database (via Prisma + pooling)
        ↓
    Database returns user record
    ├─ Create JWT token
    ├─ Set HTTP-only cookie
    └─ Return user data
    ↓
Browser receives response + cookie
    ↓
User redirected to dashboard ✅
```

### 2. Protected Route Access Flow

```
User visits /dashboard
    ↓
Vercel Edge Middleware runs
    ├─ Check for auth_token cookie
    ├─ Cookie present? → Continue
    ├─ No cookie? → Redirect to /login
    └─ Process complete
    ↓
Route renders successfully ✅
```

### 3. API Request with Database Query

```
React Component
    ├─ useEffect or onClick handler
    └─ fetch('/api/patient/intake')
    ↓
Browser sends request with auth_token cookie
    ↓
Vercel Serverless Function
    ├─ Extract token from request
    ├─ Verify JWT signature
    ├─ Initialize Prisma client (singleton)
    └─ Execute database query
    ↓
Connection from Pool
    ├─ Reuse existing connection (if available)
    ├─ Execute SQL query
    └─ Return to function
    ↓
Serverless function
    ├─ Format response data
    └─ Send to browser
    ↓
Browser receives data
    ├─ Update UI with results
    └─ Display to user ✅
```

---

## Data Flow Overview

```
                    ┌──────────────────┐
                    │   NEXT.JS APP    │
                    │  (React + TS)    │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ↓                    ↓                    ↓
    ┌────────┐          ┌────────┐          ┌────────┐
    │ Pages  │          │ API    │          │Middleware│
    │  (UI)  │          │Routes  │          │(Routing)│
    └────┬───┘          └────┬───┘          └───┬────┘
         │                   │                  │
         └─────────────────────────────────────┐│
                                              │ │
                    ┌─────────────────────────┘ │
                    │                            │
                    ↓                            ↓
            ┌────────────────┐       ┌──────────────────┐
            │  Prisma Client │       │  Edge Functions  │
            │  (src/lib/     │       │  (Middleware)    │
            │   prisma.ts)   │       └──────────────────┘
            └────────┬───────┘
                     │
                     ↓
        ┌────────────────────────┐
        │  Connection Pool       │
        │  (PgBouncer/Supabase/  │
        │   Neon)                │
        └────────────┬───────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │  PostgreSQL Database   │
        │  (Tables, Indexes,     │
        │   Relationships)       │
        └────────────────────────┘
```

---

## Deployment Process Flow

```
Step 1: Code Commit
┌────────────────────────┐
│ git push origin main   │
│ (Triggers deployment)  │
└───────────────┬────────┘
                │
Step 2: Vercel Detects
├─ Pulls from GitHub
└─ Identifies Next.js project ✓
                │
Step 3: Installation
├─ npm install
├─ postinstall: prisma generate ✓
└─ Dependencies ready ✓
                │
Step 4: Build
├─ npm run build
├─ TypeScript compilation
├─ Next.js build optimization
├─ CSS processing
└─ Bundle creation ✓
                │
Step 5: Deployment
├─ Upload to Vercel servers
├─ Configure serverless functions
├─ Set environment variables
└─ Initialize edge middleware ✓
                │
Step 6: Testing
├─ Health checks
├─ Function invocation tests
└─ Ready for traffic ✓
                │
Step 7: Live
├─ DNS routing active
├─ Requests served from edge
└─ Functions execute on demand ✓
```

---

## Environment & Configuration

### Local Development
```
Your Computer
├─ .env.local (git ignored)
├─ npm run dev
├─ Next.js on localhost:3000
└─ Local PostgreSQL connection
```

### Production (Vercel)
```
Vercel Infrastructure
├─ Environment variables (set in dashboard)
├─ Build artifacts (cached)
├─ Edge middleware (deployed)
├─ Serverless functions (ready)
└─ Connected to PostgreSQL + pooling
```

---

## Technology Stack Summary

```
┌─────────────────────────────────────────────────────┐
│ Frontend                                             │
│ ├─ React 19.0.0 (UI framework)                      │
│ ├─ Next.js 15.1.3 (Framework, SSR, API routes)      │
│ ├─ TypeScript 5.7.3 (Type safety)                   │
│ ├─ Tailwind CSS v4 (Styling)                        │
│ └─ Zod 3.22.4 (Validation)                          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Backend / Runtime                                    │
│ ├─ Node.js 20.x (Runtime)                           │
│ ├─ Vercel Serverless (Hosting)                      │
│ ├─ Vercel Edge Network (Middleware)                 │
│ └─ OpenAI 4.52.0 (AI features - patient intake)     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Database                                             │
│ ├─ PostgreSQL (Database)                            │
│ ├─ Prisma 5.13.0 (ORM)                              │
│ ├─ Connection Pooling (Supabase/Neon/PgBouncer)    │
│ └─ JWT 9.0.2 (Authentication)                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Development Tools                                    │
│ ├─ ESLint (Linting)                                 │
│ ├─ TypeScript Compiler (Type checking)              │
│ ├─ PostCSS (CSS processing)                         │
│ └─ tsx (TypeScript executor)                        │
└─────────────────────────────────────────────────────┘
```

---

## Scaling & Performance

### Horizontal Scaling (Automatic)
```
Request spike detected
    ↓
Vercel automatically spins up additional serverless functions
    ↓
Each function handles independent request
    ↓
Database connections managed by pooling layer
    ↓
Automatic scale down when load decreases ✓
```

### Connection Pooling Benefits
```
Without pooling:
├─ 100 requests = 100 new connections
├─ Quickly exceeds database limits
└─ ❌ App crashes with "too many connections"

With pooling:
├─ 100 requests = reuse 10-20 connections
├─ Efficient connection management
└─ ✅ App scales smoothly
```

### Cold Starts
```
First request to function:
├─ Initialize Node.js runtime (~1-2 seconds)
├─ Load Prisma client
├─ Connect to database
└─ Execute function

Subsequent requests:
├─ Runtime already warm
├─ Millisecond response times
└─ Better performance
```

---

## Security Layers

```
┌──────────────────────────────────────────────┐
│ Layer 1: HTTPS/TLS                           │
│ ├─ All traffic encrypted                    │
│ ├─ Automatic by Vercel                      │
│ └─ Certificate auto-renewed                 │
└──────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────┐
│ Layer 2: Edge Middleware (Vercel)            │
│ ├─ Route authentication checks               │
│ ├─ Token validation                          │
│ └─ Rate limiting (optional)                  │
└──────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────┐
│ Layer 3: HTTP-Only Cookies                   │
│ ├─ JWT tokens inaccessible to JavaScript    │
│ ├─ Automatic sent with requests             │
│ └─ Protected from XSS attacks               │
└──────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────┐
│ Layer 4: JWT Validation                      │
│ ├─ Signature verification                    │
│ ├─ Expiration checking                       │
│ └─ Role-based access control                │
└──────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────┐
│ Layer 5: Database                            │
│ ├─ SQL injection prevention (Prisma)        │
│ ├─ Row-level security (with RLS)            │
│ └─ Encrypted passwords (bcrypt ready)       │
└──────────────────────────────────────────────┘
```

---

## Monitoring & Observability

```
Vercel Dashboard
├─ Deployment history
├─ Function invocation count
├─ Average response time
├─ Error rate
├─ Edge middleware performance
├─ Build logs
└─ Error logs

Available at: vercel.com → Your Project → Analytics
```

---

*Architecture Documentation - Updated: January 22, 2026*  
*Status: Ready for Production Deployment*
