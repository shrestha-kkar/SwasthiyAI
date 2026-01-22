# Database Integration Guide

This guide explains how to integrate the Prisma database with the existing authentication system.

## Overview of Changes

The authentication system currently uses mock users in memory. With the database schema, you'll replace these with persistent PostgreSQL queries while maintaining the same API and JWT structure.

## Current State vs. New State

### Current Flow (Mock Users)
```
Login Request
    ↓
/api/auth/login
    ↓
findUserByEmail() → Mock array search
    ↓
Generate JWT
    ↓
Set HTTP-only cookie
    ↓
Response (success/error)
```

### New Flow (Database)
```
Login Request
    ↓
/api/auth/login
    ↓
Prisma query: users table
    ↓
Compare password hash (bcrypt)
    ↓
Generate JWT
    ↓
Set HTTP-only cookie
    ↓
Response (success/error)
```

## Step 1: Update Dependencies

Add password hashing library:

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

## Step 2: Update Auth Utilities

Create a new utility for password hashing:

**File: `src/lib/hash.ts`** (New)

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a password with its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

## Step 3: Update Login API Route

**File: `src/app/api/auth/login/route.ts`** (Updated)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createAuthToken } from '@/lib/auth';
import { verifyPassword } from '@/lib/hash';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        doctorProfile: true,
        patientProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      );
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, user.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = createAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      hospitalId: user.hospitalId,
    });

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hospitalId: user.hospitalId,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
```

## Step 4: Update Me (Current User) API Route

**File: `src/app/api/auth/me/route.ts`** (Updated)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch current user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        hospitalId: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
```

## Step 5: Create User Registration Endpoint (Optional)

**File: `src/app/api/auth/register/route.ts`** (New)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '@/lib/hash';
import { createAuthToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, hospitalId } = await request.json();

    // Validation
    if (!email || !password || !name || !hospitalId) {
      return NextResponse.json(
        { error: 'Email, password, name, and hospitalId are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Check if hospital exists
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: 'Hospital not found' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user (default role: PATIENT)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: UserRole.PATIENT,
        hospitalId,
      },
    });

    // Create patient profile
    await prisma.patientProfile.create({
      data: {
        userId: user.id,
        hospitalId,
        dateOfBirth: new Date(),
        gender: 'Other',
      },
    });

    // Create JWT token
    const token = createAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      hospitalId: user.hospitalId,
    });

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
```

## Step 6: Update AuthContext for Database

**File: `src/context/AuthContext.tsx`** (Key Changes)

The useEffect that checks auth on mount needs to be updated:

```typescript
// In the AuthProvider useEffect:
useEffect(() => {
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const { user } = await response.json();
        setUser(user);
      } else {
        // Token invalid or expired
        setUser(null);
        // Router will redirect to login
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  checkAuth();
}, []); // No changes needed, already correct!
```

## Step 7: Create Admin User Management Endpoint (Optional)

**File: `src/app/api/admin/users/route.ts`** (New)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { hashPassword } from '@/lib/hash';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const payload = verifyToken(token);

    if (!payload || payload.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get all users in admin's hospital
    const users = await prisma.user.findMany({
      where: { hospitalId: payload.hospitalId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const payload = verifyToken(token);

    if (!payload || payload.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { email, name, role, password } = await request.json();

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        hospitalId: payload.hospitalId,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
```

## Step 8: Handling Prisma Client

For better Prisma Client management (singleton pattern):

**File: `src/lib/prisma.ts`** (New)

```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

Then use it in API routes:

```typescript
import { prisma } from '@/lib/prisma';

// No need to disconnect in finally block
const user = await prisma.user.findUnique({...});
```

## Step 9: Seed Database with Hashed Passwords

**File: `prisma/seed.ts`** (Update)

Replace the password hashing section:

```typescript
import bcrypt from 'bcrypt';

// In main() function, replace the password hashing
const passwordHash = await bcrypt.hash('password123', 10);

const adminUser = await prisma.user.create({
  data: {
    email: 'admin@example.com',
    name: 'Admin User',
    passwordHash, // Use bcrypt hash instead of base64
    role: UserRole.ADMIN,
    hospitalId: hospital1.id,
  },
});
```

## Step 10: Update Environment

Ensure `.env.local` is properly configured:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/swasthyasetudb"
NODE_ENV="development"
```

## Migration Checklist

- [ ] Install @prisma/client and prisma
- [ ] Create Prisma schema (already done)
- [ ] Configure DATABASE_URL in .env.local
- [ ] Run `npx prisma db push`
- [ ] Run `npm run db:seed`
- [ ] Install bcrypt
- [ ] Create `src/lib/hash.ts` with password utilities
- [ ] Create `src/lib/prisma.ts` for singleton
- [ ] Update `/api/auth/login/route.ts`
- [ ] Update `/api/auth/me/route.ts`
- [ ] Create `/api/auth/register/route.ts` (optional)
- [ ] Create admin endpoints (optional)
- [ ] Test login with seeded users
- [ ] Test registration flow
- [ ] Remove or disable `src/lib/mockUsers.ts`

## Testing After Integration

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"password123"}'
```

### Test Me Endpoint
```bash
curl http://localhost:3000/api/auth/me \
  -b "auth_token=<token_from_login>"
```

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newpatient@example.com",
    "password":"newpassword123",
    "name":"New Patient",
    "hospitalId":"hosp-001"
  }'
```

## Security Considerations

1. **Password Hashing**: Always use bcrypt (never store plaintext)
2. **Hospital Isolation**: Always filter queries by `hospitalId`
3. **Token Validation**: Verify token validity before database queries
4. **Error Messages**: Don't reveal if email exists (use generic error)
5. **Rate Limiting**: Add rate limiting to login endpoint
6. **HTTPS**: Use secure cookies in production

## Common Issues & Solutions

### Issue: "Prisma Client not found"
```bash
# Solution: Install Prisma Client
npm install @prisma/client
```

### Issue: Database connection timeout
```env
# Add connection pool timeout to DATABASE_URL
DATABASE_URL="postgresql://user:pass@host/db?connect_timeout=10"
```

### Issue: Password hashing too slow
```typescript
// Use bcrypt with lower salt rounds for testing
const hash = await bcrypt.hash(password, 5); // Fast, only for dev
```

### Issue: Prisma queries in middleware
```typescript
// Middleware can't use Prisma (Edge Runtime limitation)
// Solution: Move auth logic to API routes (already done)
```
