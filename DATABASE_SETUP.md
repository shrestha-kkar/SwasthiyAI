# PostgreSQL Database Setup Instructions

Follow these steps to set up the PostgreSQL database for SwasthyaSetu.

## Prerequisites

- PostgreSQL 12+ installed locally or access to PostgreSQL service
- Node.js 18+ (already installed)
- npm (already installed)

## Setup Steps

### Step 1: Install PostgreSQL (if not already installed)

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer with default settings
3. Note the password set for `postgres` superuser
4. Add PostgreSQL to PATH if prompted

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database and User

Open PostgreSQL interactive terminal:

**Windows (PowerShell):**
```powershell
psql -U postgres
```

**macOS/Linux:**
```bash
psql -U postgres
```

Then run these SQL commands:

```sql
-- Create database
CREATE DATABASE swasthyasetudb;

-- Create user (optional, for security)
CREATE USER swasthyauser WITH ENCRYPTED PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE swasthyasetudb TO swasthyauser;

-- Connect to new database
\c swasthyasetudb

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO swasthyauser;

-- Verify
\du
\l

-- Exit
\q
```

### Step 3: Configure Environment Variables

Update `.env.local` in project root:

```env
# Database URL format: postgresql://user:password@host:port/database
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/swasthyasetudb"

# Alternative if using created user:
# DATABASE_URL="postgresql://swasthyauser:your_secure_password@localhost:5432/swasthyasetudb"
```

**For Development (Quick Setup):**
```env
# Using default postgres user
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/swasthyasetudb"
```

### Step 4: Install Prisma Dependencies

```bash
npm install
```

This installs:
- `@prisma/client` - Prisma database client
- `prisma` - Prisma CLI tools

### Step 5: Initialize Database Schema

Push the schema to your database:

```bash
npx prisma db push
```

**Expected Output:**
```
✓ Database created
✓ Mapped field "role" enum
✓ Mapped field "status" enum
✓ Mapped field "type" enum
✓ Prisma Client has been generated
✓ 6 tables created
```

**If you get connection errors:**
- Verify PostgreSQL is running: `pg_isready -h localhost`
- Check DATABASE_URL is correct
- Ensure database exists: `psql -l`

### Step 6: Seed Database with Sample Data

```bash
npm run db:seed
```

**Expected Output:**
```
🌱 Starting database seeding...
✓ Created 2 hospitals
✓ Created 5 users (1 admin, 1 doctor, 2 patients, 1 staff)
✓ Created 2 doctor profiles
✓ Created 3 visits
✓ Created 2 doctor notes

✅ Database seeding completed successfully!

📊 Created Data Summary:
   - Hospitals: 2
   - Users: 5 (1 Admin, 1 Doctor, 2 Patients, 1 Staff)
   - Doctor Profiles: 1
   - Patient Profiles: 2
   - Visits: 3 (2 Completed, 1 Scheduled)
   - Doctor Notes: 2

🔐 Demo Credentials:
   Admin:   admin@example.com / password123
   Doctor:  doctor@example.com / password123
   Patient: patient@example.com / password123
```

## Verification

### Verify Database Connection

```bash
# Test connection
npx prisma studio
```

This opens an interactive database browser at `http://localhost:5555`. You should see all tables with sample data.

### Verify Tables and Data

In PostgreSQL terminal:

```sql
-- Connect to database
\c swasthyasetudb

-- List all tables
\dt

-- Count records
SELECT COUNT(*) FROM "users";
SELECT COUNT(*) FROM "visits";
SELECT COUNT(*) FROM "doctor_notes";

-- View sample data
SELECT id, email, role FROM "users" LIMIT 5;
SELECT * FROM "hospitals";
```

## Useful Commands

```bash
# View database in browser UI (Prisma Studio)
npm run db:studio

# Push schema changes
npx prisma db push

# Create migration (if using migrations)
npx prisma migrate dev --name migration_name

# Reset database (⚠️ Deletes all data)
npx prisma migrate reset

# Generate updated Prisma Client
npx prisma generate

# Check schema validation
npx prisma validate
```

## Troubleshooting

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Ensure PostgreSQL service is running
```bash
# Windows (PowerShell)
Restart-Service PostgreSQL

# macOS
brew services restart postgresql@15

# Linux
sudo systemctl restart postgresql
```

### Authentication Failed
```
Error: role "postgres" does not exist
```
**Solution:** Check PostgreSQL installation and create superuser
```bash
psql -U postgres  # or createuser postgres
```

### Database Does Not Exist
```
Error: database "swasthyasetudb" does not exist
```
**Solution:** Create database using SQL from Step 2 above

### Permission Denied
```
Error: permission denied for schema public
```
**Solution:** Grant privileges
```sql
GRANT ALL ON SCHEMA public TO your_user;
GRANT CREATE ON SCHEMA public TO your_user;
```

## Database Backups

### Create Backup
```bash
# Windows PowerShell
pg_dump -U postgres -h localhost swasthyasetudb > backup.sql

# macOS/Linux
pg_dump -U postgres -h localhost swasthyasetudb > backup.sql
```

### Restore from Backup
```bash
# Windows PowerShell
psql -U postgres -h localhost swasthyasetudb < backup.sql

# macOS/Linux
psql -U postgres -h localhost swasthyasetudb < backup.sql
```

## Resetting for Development

To start fresh (⚠️ **Deletes all data**):

```bash
# Option 1: Using Prisma (recommended)
npx prisma migrate reset

# Option 2: Manual
# 1. Delete database
psql -U postgres -c "DROP DATABASE IF EXISTS swasthyasetudb;"

# 2. Recreate database
psql -U postgres -c "CREATE DATABASE swasthyasetudb;"

# 3. Push schema
npx prisma db push

# 4. Reseed
npm run db:seed
```

## Production Considerations

⚠️ **Before deploying to production:**

1. **Password Hashing**: Update seed script to use `bcrypt` instead of base64
   ```typescript
   import bcrypt from 'bcrypt';
   const passwordHash = await bcrypt.hash('password', 10);
   ```

2. **Environment Variables**: Use strong, unique passwords
   ```env
   DATABASE_URL="postgresql://secure_user:strong_password@production-host:5432/swasthyasetudb"
   ```

3. **Database Backups**: Set up automated backups
4. **SSL Connections**: Enable SSL for remote PostgreSQL
5. **Migrations**: Use `prisma migrate deploy` in CI/CD
6. **Secrets**: Never commit `.env.local` to git

## Next Steps

After setup, update authentication code to use database queries:
- Replace mock users in `src/lib/mockUsers.ts` with Prisma queries
- Update API routes to query `users` table
- Add password hashing with bcrypt
- Implement rate limiting on auth endpoints

See `DATABASE_SCHEMA.md` for complete schema documentation and query examples.
