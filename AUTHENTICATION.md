# SwasthyaSetu Authentication & RBAC Implementation

## Overview
JWT-based authentication system with role-based access control (RBAC) for three roles:
- **PATIENT**: Access to personal appointments and medical records
- **DOCTOR**: Access to patient list and appointments
- **ADMIN**: Access to user management, hospital management, and system reports

## Authentication Flow

### 1. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "password123"
}

Response:
{
  "id": "user-001",
  "email": "patient@example.com",
  "name": "John Doe",
  "role": "patient"
}
```

The JWT token is automatically set as an HTTP-only cookie.

### 2. JWT Payload Structure
```typescript
{
  userId: string;      // Unique user identifier
  role: string;        // User role (patient, doctor, admin)
  hospitalId: string;  // Hospital affiliation
  email: string;       // User email
  iat: number;         // Issued at (auto)
  exp: number;         // Expiration (7 days)
}
```

### 3. Logout
```
POST /api/auth/logout

Response: Clears auth_token cookie
```

## Protected Routes

### Route Protection via Middleware
Middleware (`src/middleware.ts`) protects routes based on user role:

```
/dashboard          → authenticated users (all roles)
/dashboard/doctor/* → doctor role only
/dashboard/patient/* → patient role only
/dashboard/admin/*  → admin role only
```

### Route Access Control
Each role-specific page validates the user role and redirects to dashboard if unauthorized.

## Mock Users for Development

### Patient
- **Email**: patient@example.com
- **Password**: password123
- **Access**: My Appointments, Medical Records

### Doctor
- **Email**: doctor@example.com
- **Password**: password123
- **Access**: My Patients, Appointments

### Admin
- **Email**: admin@example.com
- **Password**: password123
- **Access**: Users, Hospitals, Reports

## File Structure

```
src/
├── lib/
│   ├── auth.ts              # JWT utilities (sign, verify)
│   └── mockUsers.ts         # Mock user database
├── context/
│   └── AuthContext.tsx      # Global auth state
├── middleware.ts            # Route protection
└── app/
    ├── layout.tsx           # Root with AuthProvider
    ├── api/auth/
    │   ├── login/route.ts   # Login endpoint
    │   ├── logout/route.ts  # Logout endpoint
    │   └── me/route.ts      # Current user endpoint
    └── (dashboard)/
        ├── DashboardContent.tsx  # Dashboard with navigation
        ├── doctor/
        │   ├── patients/page.tsx
        │   └── appointments/page.tsx
        ├── patient/
        │   ├── appointments/page.tsx
        │   └── records/page.tsx
        └── admin/
            ├── users/page.tsx
            ├── hospitals/page.tsx
            └── reports/page.tsx
```

## Key Features

✅ **JWT Authentication**: Sign and verify tokens with secret key
✅ **HTTP-only Cookies**: Secure token storage (XSS protection)
✅ **Route Middleware**: Automatic route protection based on role
✅ **Auth Context**: Global state management for authentication
✅ **Role-based Navigation**: Dynamic sidebar based on user role
✅ **Protected Pages**: Client-side role validation on sensitive pages
✅ **Mock Users**: Pre-configured test users for development
✅ **Logout Functionality**: Secure logout with cookie cleanup

## Security Considerations

1. **In Production**:
   - Change `JWT_SECRET` in `.env.local` to a strong, randomly generated key
   - Set `secure: true` in cookie options (requires HTTPS)
   - Implement proper password hashing (bcrypt)
   - Add rate limiting for login attempts
   - Use HTTPS only

2. **Environment Variables**:
   - Never commit `.env.local` (already in `.gitignore`)
   - Use strong JWT_SECRET (minimum 32 characters)

3. **Token Expiration**:
   - Current: 7 days
   - Adjust in `src/lib/auth.ts` if needed

## API Endpoints

### POST /api/auth/login
Login and receive JWT token in HTTP-only cookie

### POST /api/auth/logout
Logout and clear auth token

### GET /api/auth/me
Get current authenticated user details

## Frontend Usage

```typescript
// In components
import { useAuth } from "@/context/AuthContext";

export function MyComponent() {
  const { user, login, logout, isLoading, isAuthenticated } = useAuth();
  
  // Use auth state
}
```

## Testing the System

1. Navigate to `http://localhost:3000/login`
2. Use demo credentials from above
3. Each role will see different dashboard content and navigation options
4. Try accessing protected routes (e.g., `/dashboard/admin/users` with patient role)
5. Logout clears the token and redirects to home page

## Next Steps for Production

- [ ] Replace mock users with database queries
- [ ] Implement password hashing (bcrypt)
- [ ] Add refresh token rotation
- [ ] Implement 2FA for sensitive roles (Admin)
- [ ] Add audit logging for sensitive actions
- [ ] Set up proper error handling and validation
- [ ] Add rate limiting for API endpoints
- [ ] Implement role-based permissions (granular access)
