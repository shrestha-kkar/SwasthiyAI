# SwasthyaSetu - Healthcare Management System

Operating System of India's Healthcare with modern Next.js 15 architecture.

## ✅ Project Status

- **Framework**: Next.js 15.1.3 with App Router
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS v4
- **Authentication**: JWT-based with HTTP-only cookies
- **Authorization**: Role-based access control (RBAC)
- **Build Status**: ✅ Successful (19 routes optimized)
- **Dev Server**: ✅ Running on http://localhost:3000

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 3. Login with Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Patient** | patient@example.com | password123 |
| **Doctor** | doctor@example.com | password123 |
| **Admin** | admin@example.com | password123 |

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Authentication routes
│   │   ├── login/page.tsx      # Login page with demo credentials
│   │   └── register/page.tsx   # Register page
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── DashboardContent.tsx # Dynamic dashboard UI
│   │   ├── doctor/             # Doctor-only routes
│   │   ├── patient/            # Patient-only routes
│   │   └── admin/              # Admin-only routes
│   └── api/auth/               # Authentication API
│       ├── login/route.ts
│       ├── logout/route.ts
│       └── me/route.ts
├── lib/
│   ├── auth.ts                 # JWT utilities
│   └── mockUsers.ts            # Mock user database
├── context/
│   └── AuthContext.tsx         # Global auth state
├── middleware.ts               # Route protection
└── types/
    └── index.ts                # Type definitions
```

## 🔐 Authentication & Authorization

### JWT Implementation
- **Token Storage**: HTTP-only cookies (XSS protected)
- **Token Expiry**: 7 days
- **Payload**: userId, role, hospitalId, email
- **Verification**: Server-side middleware validation

### Route Protection
- **Middleware Level**: `src/middleware.ts` validates all protected routes
- **Client Level**: `useAuth()` hook validates on role-specific pages
- **Auto-redirect**: Unauthenticated users → /login, Wrong role → /dashboard

### Roles & Access
```
/dashboard           → Authenticated users (all roles)
/dashboard/doctor/*  → Doctor role only
/dashboard/patient/* → Patient role only
/dashboard/admin/*   → Admin role only
```

## 📚 Key Features

### ✅ Implemented
- JWT token generation & verification
- HTTP-only cookie-based session storage
- Middleware-based route protection
- Client-side role validation
- Mock user authentication
- Role-based navigation
- Logout functionality
- Global auth context
- Loading states & error handling

### 🎯 Role-Specific Pages

**Patient Dashboard**
- My Appointments
- Medical Records

**Doctor Dashboard**
- My Patients
- Appointments

**Admin Dashboard**
- User Management
- Hospital Management
- System Reports

## 🛠️ Available Scripts

```bash
# Development
npm run dev         # Start dev server
npm run lint        # Run ESLint

# Production Build & Run
npm run build       # Build for production
npm start          # Start production server

# Database
npm run db:push    # Push schema to database
npm run db:migrate # Create migration
npm run db:seed    # Seed database with sample data
npm run db:studio  # Open Prisma Studio
```

## 🌐 Deployment

### Ready for Vercel Deployment

This project is fully configured for deployment on Vercel with Next.js, Prisma, and PostgreSQL.

**Deployment Documentation:**
- **[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[VERCEL_DEPLOYMENT_CHECKLIST.md](./VERCEL_DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist

**Quick Summary:**
1. ✅ `vercel.json` configured with proper settings
2. ✅ Environment variables template in `.env.example`
3. ✅ Prisma client optimized for serverless
4. ✅ Middleware configured for edge runtime
5. ✅ Security headers configured in Next.js config
6. ✅ Database connection pooling ready (use Supabase/Neon)

**Deploy in 3 steps:**
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com/new and import repository

# 3. Set environment variables and deploy
# (See VERCEL_DEPLOYMENT_GUIDE.md for details)
```

## 🔧 Configuration

### Environment Variables (.env.local)
```env
# Database (with connection pooling for Vercel)
DATABASE_URL=postgresql://user:password@host:port/db?schema=public

# Authentication
JWT_SECRET=your-strong-random-key-32-chars-minimum

# Environment
NODE_ENV=development

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**For Production:** See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for production environment setup.

**Important**: 
- Change `JWT_SECRET` to a strong random key for production
- Use database connection pooling (PgBouncer/Supabase) for serverless
- Never commit `.env.local` - it's in `.gitignore`

## 📖 Documentation

- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Detailed auth documentation
- **[Next.js Docs](https://nextjs.org/docs)** - Framework documentation
- **[TypeScript Guide](https://www.typescriptlang.org/docs/)** - Type safety

## 🚀 Next Steps for Production

- [ ] Replace mock users with database (Prisma + PostgreSQL)
- [ ] Implement password hashing (bcrypt)
- [ ] Add input validation (zod)
- [ ] Refresh token rotation
- [ ] 2FA for admin users
- [ ] Audit logging
- [ ] Rate limiting
- [ ] HTTPS configuration
- [ ] Error tracking (Sentry)
- [ ] API documentation (Swagger)

## 📱 Responsive Design

- Mobile-first approach using Tailwind CSS
- Flexible layouts with Tailwind grid system
- Touch-friendly UI elements
- Optimized for all screen sizes

## 🔒 Security Features

- HTTP-only cookies (XSS protection)
- JWT token validation on every request
- Role-based middleware protection
- CORS-aware cookie handling (SameSite=Lax)
- TypeScript type safety
- Input validation ready (no validation yet, for production use)

## 🎨 UI/UX

- **Design System**: Tailwind CSS v4
- **Components**: Reusable card, button, and form styles
- **Navigation**: Dynamic sidebar based on user role
- **Feedback**: Loading states, error messages, success indicators
- **Branding**: SwasthyaSetu branded layouts

## 📊 Performance

### Build Optimization
```
✓ 19 routes compiled
✓ Static pages prerendered where possible
✓ API routes optimized
✓ CSS bundled via Tailwind v4
✓ JS modules split efficiently
✓ First Load JS: 102-107 KB (shared)
```

### Route Performance
```
Home page:              161 B
Auth pages:             1.6 KB
Dashboard pages:        1.3-1.5 KB
API endpoints:          ~140 B
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Submit pull request

## 📝 License

This project is part of SwasthyaSetu healthcare initiative.

## 💡 Tips & Tricks

### Clear Build Cache
```bash
rm -rf .next
npm run build
```

### Debug Auth Issues
- Check browser DevTools → Application → Cookies for `auth_token`
- Verify JWT token in https://jwt.io
- Check Network tab for API responses

### Add New Role
1. Update `UserRole` enum in `src/types/index.ts`
2. Add mock user in `src/lib/mockUsers.ts`
3. Create route folder `src/app/(dashboard)/[role]/`
4. Update `DashboardContent.tsx` navigation
5. Update `middleware.ts` if needed

---

**Last Updated**: January 21, 2026
**Status**: ✅ Ready for Development
**Next Release**: Production-ready features coming soon
