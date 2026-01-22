# Vercel Deployment - Quick Reference

## 🚀 Fastest Path to Production (5 Minutes)

### 1. Create Database (2 min)
**Choose Supabase (recommended):**
```bash
# Go to https://supabase.com
# Create free account → New project
# Copy pooling connection string
```

### 2. Prepare Repository (1 min)
```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

### 3. Deploy (2 min)
```bash
# Go to https://vercel.com/new
# Select your GitHub repo
# Add DATABASE_URL and JWT_SECRET (see below)
# Click Deploy ✅
```

---

## 🔑 Environment Variables to Add to Vercel

```
DATABASE_URL=<paste from Supabase with ?pgbouncer=true>
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
NEXT_PUBLIC_API_URL=https://<your-vercel-domain>.vercel.app
NODE_ENV=production
```

---

## 📋 Files Reference

| Document | Use When |
|----------|----------|
| **VERCEL_DEPLOYMENT_GUIDE.md** | First time deploying, need full walkthrough |
| **VERCEL_DEPLOYMENT_CHECKLIST.md** | Following step-by-step process |
| **DEPLOYMENT_SUMMARY.md** | Want to understand what changed |
| **DEPLOYMENT_READINESS_REPORT.md** | Need overview & status |
| **This file (QUICK_REFERENCE_DEPLOY.md)** | Need commands quick |

---

## ✅ Configuration Files Created

```
✅ vercel.json                    - Deployment config
✅ .env.example                   - Env variables template
✅ VERCEL_DEPLOYMENT_GUIDE.md     - Full guide
✅ VERCEL_DEPLOYMENT_CHECKLIST.md - Step by step
✅ DEPLOYMENT_SUMMARY.md          - Technical details
✅ DEPLOYMENT_READINESS_REPORT.md - Overview
```

---

## 🔧 Configuration Files Updated

```
✅ next.config.js     - Security headers added
✅ src/middleware.ts  - Edge runtime optimized
✅ src/lib/prisma.ts  - Serverless pattern fixed
✅ prisma/schema.prisma - Pooling config added
✅ README.md          - Deployment section added
```

---

## 🎯 Key Points

### Database
- ⚠️ **CRITICAL**: Must use connection pooling
- ✅ Supabase recommended (free tier includes pooling)
- ✅ Alternative: Neon with pooling
- ⚠️ Avoid: Direct PostgreSQL connection (will fail)

### JWT Secret
Generate with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Testing After Deploy
1. Visit your Vercel URL
2. Test login with demo credentials
3. Test dashboard access
4. Check browser console for errors
5. Check Vercel logs for backend errors

---

## 🛠️ Local Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start local server (http://localhost:3000)
npm run build        # Test production build locally
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

---

## 📊 Architecture

```
Your Browser
    ↓
Vercel Edge (middleware)
    ↓
Vercel Serverless (API routes)
    ↓
PostgreSQL + Connection Pooling (Supabase/Neon)
```

---

## ⚠️ Common Issues & Fixes

### "too many connections" Error
```
Cause: No connection pooling
Fix: Use Supabase or Neon with ?pgbouncer=true
```

### Build Fails
```
Cause: Dependencies missing or build script failed
Fix: npm install locally, then npm run build
Verify: All works locally before pushing
```

### API Returns 500
```
Cause: Database not connected or query failed
Fix: Check DATABASE_URL in Vercel environment
Verify: prisma/schema.prisma is valid
```

### Stuck on "Deploying"
```
Cause: Build taking too long
Fix: Check Vercel logs for actual error
Usually: npm install optimization or TypeScript error
```

---

## 📞 Help

**For detailed instructions**: Read `VERCEL_DEPLOYMENT_GUIDE.md`  
**For step-by-step**: Read `VERCEL_DEPLOYMENT_CHECKLIST.md`  
**For technical details**: Read `DEPLOYMENT_SUMMARY.md`  
**For overview**: Read `DEPLOYMENT_READINESS_REPORT.md`

---

## ✨ Status

```
✅ All configuration complete
✅ All files updated for serverless
✅ Ready for production deployment
✅ Security optimized
✅ Performance optimized
```

**Your app is ready to deploy!** 🚀

---

*Quick Reference - Updated: January 22, 2026*
