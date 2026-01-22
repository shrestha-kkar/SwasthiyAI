# Vercel Deployment Guide - SwasthiyAI

## Overview
This project is optimized for deployment on Vercel with Next.js, Prisma, and PostgreSQL.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Project must be in a Git repository (GitHub, GitLab, or Bitbucket)
3. **PostgreSQL Database**: Use a managed service like:
   - Supabase (recommended - includes PgBouncer for connection pooling)
   - Railway
   - AWS RDS
   - Azure Database for PostgreSQL
   - Neon (with connection pooling)

## Database Configuration for Serverless

### Critical for Vercel Deployment

Since Vercel uses serverless functions, you **must use connection pooling**. Direct PostgreSQL connections will exhaust quickly.

#### Option 1: Supabase (Recommended)
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to Project Settings → Database → Connection String
3. Copy the connection string with `?pgbouncer=true` suffix
4. Set as `DATABASE_URL` environment variable

#### Option 2: Neon
1. Create a Neon project at [neon.tech](https://neon.tech)
2. Use the "Pooling connection string" from the connection details
3. Set as `DATABASE_URL` environment variable

#### Option 3: PgBouncer Proxy
Set up a PgBouncer instance between your database and application:
```
DATABASE_URL=postgresql://user:password@pgbouncer-host:6432/database?schema=public
```

### Environment Variables Configuration

**Required variables in Vercel:**

```
DATABASE_URL=postgresql://user:password@pooler-host:port/db?schema=public
JWT_SECRET=<strong-random-string>
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

**Optional (if using dedicated connection for migrations):**
```
DIRECT_DATABASE_URL=postgresql://user:password@host:5432/db
```

## Deployment Steps

### 1. Push Code to Git

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose your GitHub/GitLab/Bitbucket repository
4. Configure project settings (automatic for Next.js)
5. Add environment variables
6. Deploy

**Option B: Via Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel
```

### 3. Set Environment Variables

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all required variables
3. Select which environments they apply to (Production, Preview, Development)

### 4. Configure Database Migrations

The build process runs automatically:
1. Prisma client generation happens in `postinstall` script
2. Database schema is already defined in `prisma/schema.prisma`
3. For migrations after deployment:
   ```bash
   npx prisma migrate deploy
   ```
   Or via Vercel CLI:
   ```bash
   vercel env pull
   npx prisma migrate deploy
   ```

## Build Configuration

The `vercel.json` file defines:
- **Framework**: Next.js
- **Node version**: 20.x
- **Build command**: `npm run build`
- **Start command**: `npm run start`
- **Functions**: API routes configured with 1024MB memory, 30s timeout

## Post-Deployment

### 1. Test the Deployment
```bash
# Visit your Vercel URL and test:
# - Login page loads
# - Authentication works
# - API endpoints respond
# - Database queries work
```

### 2. Monitor Performance
- Use Vercel Analytics dashboard
- Check error logs in Vercel
- Monitor database connection usage

### 3. Setup Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as per Vercel instructions

### 4. Enable Security Headers
- Already configured in `next.config.js`
- Content Security Policy can be added to `next.config.js` headers

## Project Structure for Deployment

```
├── vercel.json              # Vercel deployment config
├── .env.example             # Environment variables template
├── .env.local              # Local development (gitignored)
├── .env.production         # Production variables
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seeding
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── api/          # API routes (serverless functions)
│   │   ├── (auth)/       # Authentication routes
│   │   └── (dashboard)/  # Protected routes
│   ├── lib/
│   │   ├── prisma.ts     # Prisma client singleton
│   │   ├── auth.ts       # Authentication logic
│   │   └── ...
│   ├── middleware.ts      # Edge middleware
│   └── types/            # TypeScript types
└── public/               # Static files
```

## Important Notes

### Serverless Function Limitations
- **Maximum execution time**: 30 seconds (configurable in vercel.json)
- **Memory limit**: 1024MB (configurable)
- **Cold start**: Functions may take 1-2 seconds on first execution
- **Stateless**: Cannot store state between requests

### Connection Pooling
- **Required**: Database connection pooling is mandatory
- **Why**: Serverless creates new connections for each function invocation
- **Solution**: Use PgBouncer or managed services with pooling

### Database Migrations
- **Production migrations**: Use `DIRECT_DATABASE_URL` for migrations if available
- **Schema changes**: Push changes through Vercel CLI or manually connect
- **Best practice**: Test all migrations locally before deploying

## Troubleshooting

### "Too many connections" Error
- **Cause**: Connection pooling not configured
- **Solution**: Use PgBouncer or switch to Supabase with connection pooling

### "DATABASE_URL is not set"
- **Cause**: Environment variables not configured in Vercel
- **Solution**: Add DATABASE_URL to Vercel project environment variables

### API Routes Timeout
- **Cause**: Function exceeds 30-second limit
- **Solution**: Optimize queries, increase timeout in `vercel.json`, or split into smaller functions

### Build Fails with "prisma: not found"
- **Cause**: Prisma not installed
- **Solution**: Ensure `@prisma/client` is in `dependencies` (not devDependencies)

## Performance Optimization

1. **Enable ISR (Incremental Static Regeneration)**
   - Configure `revalidate` in API routes
   - Reduces database load

2. **API Route Caching**
   - Use Vercel's `setHeader('Cache-Control', ...)`
   - Cache GET requests when appropriate

3. **Database Query Optimization**
   - Use Prisma projections (select fields, not all)
   - Index frequently queried columns
   - Monitor slow queries

4. **Bundle Size**
   - Check with: `npm run build` (shows bundle size)
   - Use dynamic imports for large libraries
   - Tree-shake unused code

## Security Best Practices

1. **JWT Secret**: Use a strong, random value in production
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **HTTPS**: Enabled by default on Vercel
3. **Secure Headers**: Configured in `next.config.js`
4. **Environment Variables**: Never commit `.env.local`
5. **Database**: Use VPC/private networks when possible

## Useful Commands

```bash
# Pull environment variables locally
vercel env pull

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# Rebuild project
vercel rebuild
```

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Supabase Documentation](https://supabase.com/docs)

## Checklist Before Going Live

- [ ] Environment variables configured in Vercel
- [ ] Database connection pooling set up
- [ ] Prisma migrations run on production database
- [ ] JWT_SECRET is strong and random
- [ ] NEXT_PUBLIC_API_URL points to correct domain
- [ ] Authentication tests pass
- [ ] API endpoints respond correctly
- [ ] Database queries optimized
- [ ] Error logging configured
- [ ] Monitoring/analytics enabled
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Backups configured for database
