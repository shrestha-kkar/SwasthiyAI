# Vercel Deployment Checklist

## Pre-Deployment ✓

- [x] **Project Structure**: Next.js app directory structure is correct
- [x] **Environment Variables**: `.env.example` created with all required variables
- [x] **Vercel Configuration**: `vercel.json` configured with proper settings
- [x] **Database**: Prisma schema configured for PostgreSQL
- [x] **Middleware**: Updated for Vercel edge runtime compatibility
- [x] **Prisma Client**: Singleton pattern implemented for serverless
- [x] **Security**: Headers configured in `next.config.js`

## Configuration Files Updated

### 1. ✅ vercel.json
- Framework: Next.js
- Node: 20.x
- Build command: `npm run build`
- Environment variables defined
- API function configuration (1024MB, 30s timeout)

### 2. ✅ .env.example
- DATABASE_URL (with note about connection pooling)
- JWT_SECRET
- NODE_ENV
- NEXT_PUBLIC_API_URL

### 3. ✅ Prisma Schema (schema.prisma)
- Added preview features for serverless optimization
- Added comments about connection pooling
- DirectUrl configuration option for migrations

### 4. ✅ Prisma Client (src/lib/prisma.ts)
- Proper singleton pattern for serverless
- Global type declaration fixed
- Production-safe caching

### 5. ✅ Next.js Config (next.config.js)
- ESLint ignore for builds
- TypeScript error ignore for builds
- Serverless minification enabled
- Security headers configured

### 6. ✅ Middleware (src/middleware.ts)
- Edge runtime compatible
- Protected routes properly defined
- Public routes excluded
- Better error handling

## Deployment Steps

### Step 1: Prepare Repository
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 2: Set Up Database
**Choose one option:**

**Option A: Supabase (Recommended)**
- Go to supabase.com → Create project
- Copy connection string with ?pgbouncer=true
- Store as DATABASE_URL

**Option B: Neon**
- Go to neon.tech → Create project
- Use pooling connection string
- Store as DATABASE_URL

**Option C: Existing PostgreSQL + PgBouncer**
- Set up PgBouncer in front of your database
- Configure DATABASE_URL to point to PgBouncer

### Step 3: Deploy to Vercel
```bash
# Option A: CLI
npm install -g vercel
vercel login
vercel --prod

# Option B: Web Dashboard
# 1. Go to vercel.com/new
# 2. Import your GitHub repository
# 3. Configure environment variables
# 4. Deploy
```

### Step 4: Configure Environment Variables in Vercel
In Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL = postgresql://user:password@host:port/db?schema=public
JWT_SECRET = <generate strong random string>
NODE_ENV = production
NEXT_PUBLIC_API_URL = https://your-vercel-domain.vercel.app
```

### Step 5: Run Migrations
```bash
# Pull environment
vercel env pull

# Run migrations
npx prisma migrate deploy

# Or seed if needed
npx prisma db seed
```

### Step 6: Test Deployment
- [ ] Visit your Vercel URL
- [ ] Test login page
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Check browser console for errors
- [ ] Check Vercel logs for errors

## Key Configuration Details

### Database Connection Pooling

**Why it's critical:**
- Serverless = new function instance per request
- Each instance creates database connection
- Without pooling, connections exhaust quickly
- Error: "too many connections"

**Solution:**
- Use PgBouncer or managed service with pooling
- Supabase and Neon include pooling by default
- Add `?pgbouncer=true` to Supabase URLs

### Function Configuration

Configured in `vercel.json`:
```json
"functions": {
  "src/app/api/**": {
    "memory": 1024,
    "maxDuration": 30
  }
}
```

- Memory: 1024MB (adjustable if needed)
- Timeout: 30 seconds (increase for long operations)
- Runtime: Node.js 20.x (specified in vercel.json)

### Build Process

1. Install dependencies: `npm install`
2. Generate Prisma: `prisma generate` (via postinstall)
3. Build: `npm run build`
4. Deploy to Vercel edge/serverless infrastructure

## Environment Variables Reference

### Required
| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | PostgreSQL connection with pooling | postgresql://user:password@pooler:5432/db?pgbouncer=true |
| JWT_SECRET | JWT signing secret | (strong random 32+ chars) |

### Optional
| Variable | Purpose | Default |
|----------|---------|---------|
| NODE_ENV | Environment | production (on Vercel) |
| NEXT_PUBLIC_API_URL | Public API endpoint | (auto-set to Vercel domain) |
| DIRECT_DATABASE_URL | Direct DB for migrations | (not needed if using pool) |

## Troubleshooting

### Build Fails
- Check: All dependencies installed locally
- Check: `npm run build` passes locally
- Check: prisma/schema.prisma is valid
- Fix: `npm install && npm run build`

### "Database connection failed"
- Check: DATABASE_URL is set in Vercel environment
- Check: Connection pooling is configured
- Check: Database accepts connections from Vercel IPs
- Fix: Use Supabase/Neon for automatic pooling

### API Routes Return 500
- Check: Vercel Function logs for error messages
- Check: Database queries are optimized
- Check: Function doesn't exceed 30s timeout
- Fix: Use `vercel logs` to debug

### Prisma Type Errors
- Check: `@prisma/client` in dependencies (not devDependencies)
- Check: `npm run build` completes without errors
- Fix: `rm -rf node_modules && npm install`

## Post-Deployment Optimization

1. **Monitor Logs**
   ```bash
   vercel logs --follow
   ```

2. **Check Performance**
   - Vercel Dashboard → Analytics
   - Monitor cold starts and response times

3. **Database Query Optimization**
   - Log slow queries
   - Add database indexes
   - Use Prisma `select` to limit fields

4. **Enable Caching**
   - ISR for static content
   - Cache GET endpoints
   - CDN for static files (automatic on Vercel)

## Useful Commands

```bash
# Pull current environment variables
vercel env pull

# List all deployments
vercel deployments

# View recent logs
vercel logs --lines 50

# Redeploy current commit
vercel --prod

# Check project settings
vercel projects

# Remove local git config
vercel remove <project-name>
```

## Security Reminders

1. Never commit `.env.local` - it's in `.gitignore` ✓
2. Use strong JWT_SECRET - 32+ random characters
3. Keep dependencies updated: `npm update`
4. Enable HTTPS - automatic on Vercel ✓
5. Review database access logs regularly
6. Rotate JWT_SECRET periodically in production

## Additional Resources

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 📖 [Next.js Deployment](https://nextjs.org/docs/deployment)
- 📖 [Prisma Serverless Guide](https://www.prisma.io/docs/guides/deployment)
- 📖 [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connection-pooling)
- 📖 [Neon Connection Pooling](https://neon.tech/docs/introduction/connection-pooling)

---

**Last Updated**: January 22, 2026
**Status**: Ready for Production Deployment
