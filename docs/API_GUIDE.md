# SwasthyaSetu - API Usage Guide

## 🔌 Base URL
```
http://localhost:3000
```

## 📝 Authentication Endpoints

### 1. Login
**Endpoint**: `POST /api/auth/login`

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123"
  }'
```

**Success Response** (200 OK):
```json
{
  "id": "user-001",
  "email": "patient@example.com",
  "name": "John Doe",
  "role": "patient"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "message": "Invalid email or password"
}
```

**Headers Set by Server**:
```
Set-Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800
```

---

### 2. Get Current User
**Endpoint**: `GET /api/auth/me`

**Request**:
```bash
curl http://localhost:3000/api/auth/me \
  -H "Cookie: auth_token=YOUR_TOKEN_HERE"
```

**Success Response** (200 OK):
```json
{
  "id": "user-001",
  "email": "patient@example.com",
  "name": "John Doe",
  "role": "patient"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "message": "Unauthorized"
}
```

---

### 3. Logout
**Endpoint**: `POST /api/auth/logout`

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: auth_token=YOUR_TOKEN_HERE"
```

**Success Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

**Headers Set by Server** (Clears cookie):
```
Set-Cookie: auth_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0
```

---

## 🧪 Complete Login Flow Example

### Step 1: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Cookie: " \
  -c cookies.txt \
  -d '{
    "email": "doctor@example.com",
    "password": "password123"
  }'
```

### Step 2: Access Protected Route with Token
```bash
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### Step 3: Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

---

## 🔐 JWT Token Format

### Encoded Token Structure
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiJ1c2VyLTAwMSIsInJvbGUiOiJwYXRpZW50IiwiaG9zcGl0YWxJZCI6Imhvc3AtMDAxIiwiZW1haWwiOiJwYXRpZW50QGV4YW1wbGUuY29tIiwiaWF0IjoxNzM3NDY5MzAwLCJleHAiOjE3MzgwNzQxMDB9.
abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx
```

### Decoded Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Decoded Payload
```json
{
  "userId": "user-001",
  "role": "patient",
  "hospitalId": "hosp-001",
  "email": "patient@example.com",
  "iat": 1737469300,
  "exp": 1738074100
}
```

---

## 🧑‍💼 Demo Credentials

All test users have the same password: `password123`

### Patient Account
```
Email:    patient@example.com
Password: password123
Role:     patient
UserID:   user-001
Hospital: hosp-001
```

### Doctor Account
```
Email:    doctor@example.com
Password: password123
Role:     doctor
UserID:   user-002
Hospital: hosp-001
```

### Admin Account
```
Email:    admin@example.com
Password: password123
Role:     admin
UserID:   user-003
Hospital: hosp-001
```

---

## 🛣️ Protected Routes

### All Users (Authenticated)
```
GET  /dashboard              (redirects based on role)
```

### Patient Only
```
GET  /dashboard/patient/appointments
GET  /dashboard/patient/records
```

### Doctor Only
```
GET  /dashboard/doctor/patients
GET  /dashboard/doctor/appointments
```

### Admin Only
```
GET  /dashboard/admin/users
GET  /dashboard/admin/hospitals
GET  /dashboard/admin/reports
```

---

## 📋 Route Protection Rules

### What Happens When Unauthenticated
```
Request: GET /dashboard
Status:  Redirect 307 (Temporary)
Location: /login
Reason:  No auth_token cookie
```

### What Happens With Wrong Role
```
Request: GET /dashboard/admin/users (as patient)
Status:  Redirect 307 (Temporary)
Location: /dashboard
Reason:  User role is 'patient', not 'admin'
```

### What Happens With Valid Role
```
Request: GET /dashboard/patient/appointments (as patient)
Status:  200 OK
Body:    Page content rendered
```

---

## 🧑‍💻 Frontend Hook Usage

### In React Components
```typescript
import { useAuth } from "@/context/AuthContext";

export function MyComponent() {
  const { 
    user,           // User object or null
    isLoading,      // Boolean - true while checking auth
    isAuthenticated,// Boolean - true if logged in
    login,          // Function - async login(email, password)
    logout,         // Function - void logout()
    error           // String - error message if login failed
  } = useAuth();

  // Use the auth state
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not logged in</div>;

  return (
    <div>
      Welcome, {user?.name}!
      <p>Your role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Example Login Form
```typescript
const { login } = useAuth();

async function handleLogin(email: string, password: string) {
  try {
    await login(email, password);
    // Redirect happens automatically
  } catch (error) {
    console.error("Login failed:", error);
  }
}
```

---

## 🔍 Debugging Tips

### Check Token in Browser
1. Open DevTools → Application tab
2. Click "Cookies" in left sidebar
3. Find `http://localhost:3000`
4. Look for `auth_token` cookie
5. Copy token value
6. Paste into https://jwt.io to decode

### Monitor API Calls
1. Open DevTools → Network tab
2. Make login request
3. Look for `login` request to `/api/auth/login`
4. Check request headers and response
5. Verify `Set-Cookie` header in response

### Check Auth Context State
1. Install React DevTools extension
2. Open DevTools → Components tab
3. Find component using `useAuth()`
4. Inspect props/hooks to see auth state

---

## 🚨 Common Issues

### Issue: Token Not Saved
```
Problem:  Cookie not appearing after login
Solution: 
  1. Check browser allows cookies
  2. Verify response has Set-Cookie header
  3. Clear cookies and try again
  4. Check if in incognito mode
```

### Issue: Getting 401 Everywhere
```
Problem:  All requests return Unauthorized
Solution:
  1. Login again with correct credentials
  2. Check token hasn't expired (7 day limit)
  3. Verify JWT_SECRET is correct
  4. Clear cookies and retry
```

### Issue: Wrong Role After Login
```
Problem:  User role doesn't match login creds
Solution:
  1. Verify email matches mock user exactly
  2. Check src/lib/mockUsers.ts for correct role
  3. Ensure case-sensitive email match
  4. Refresh page to re-check auth
```

### Issue: Middleware Not Working
```
Problem:  Can access protected routes without token
Solution:
  1. Rebuild: rm -rf .next && npm run build
  2. Restart dev server
  3. Check middleware.ts is in src/ folder
  4. Verify matcher pattern in middleware
```

---

## 🧪 Test Commands

### Test Login Endpoint
```bash
# Successful login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"password123"}'

# Failed login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"wrongpassword"}'
```

### Test Current User Endpoint
```bash
# Without token (should fail)
curl http://localhost:3000/api/auth/me

# With token (from login above)
curl -H "Cookie: auth_token=YOUR_TOKEN" http://localhost:3000/api/auth/me
```

### Test Protected Routes
```bash
# Without token (redirects to login)
curl -i http://localhost:3000/dashboard

# With wrong role (redirects to dashboard)
curl -i -H "Cookie: auth_token=PATIENT_TOKEN" http://localhost:3000/dashboard/admin/users

# With correct role (200 OK)
curl -i -H "Cookie: auth_token=ADMIN_TOKEN" http://localhost:3000/dashboard/admin/users
```

---

## 📊 Token Expiration

**Current Settings**:
- Expiration: 7 days
- Unit: Days (rotated daily in production)
- Time until expiry: Shown in JWT as `exp` claim

**To Check Expiration**:
```javascript
// In browser console
const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('auth_token='))
  .split('=')[1];

const decoded = JSON.parse(atob(token.split('.')[1]));
const expiryDate = new Date(decoded.exp * 1000);
console.log("Token expires at:", expiryDate);
```

---

## 🔄 Refresh Token Strategy (Future)

Currently: Single token with 7-day expiry

For production, consider:
```
1. Short-lived access token (15 min) - in memory
2. Long-lived refresh token (7 days) - in HTTP-only cookie
3. Refresh endpoint to get new access token
4. Automatic refresh when access token expires
```

---

## 📞 Support

For issues or questions about API endpoints:
1. Check this file first
2. Review AUTHENTICATION.md
3. Check browser console for errors
4. Check Network tab in DevTools
5. Review middleware.ts for route matching

---

**Last Updated**: January 21, 2026
**API Version**: v1 (Mock)
**Status**: Production-ready for demo
