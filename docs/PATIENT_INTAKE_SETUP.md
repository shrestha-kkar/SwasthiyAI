# Patient AI Intake - Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database running (localhost:5432)
- OpenAI API key

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create or update `.env.local`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/swasthyasetudb"

# Authentication
JWT_SECRET="your-secret-key-change-in-production"

# OpenAI (required for AI features)
OPENAI_API_KEY="sk-your-openai-api-key-here"
```

### 3. Initialize Database
```bash
npm run db:push
```

This will:
- Create `patient_intakes` table
- Add relationships to existing tables
- Initialize all indexes

### 4. Verify Setup
```bash
npx prisma validate
npx tsc --noEmit
```

### 5. Start Development Server
```bash
npm run dev
```

Access at: `http://localhost:3000`

## Test the Feature

### 1. Login as Patient
- Email: `patient@example.com`
- Password: `password123`
- Navigate to `/dashboard/patient`

### 2. Click "Start Medical Intake"
- Starts new conversation with AI assistant
- Each message adds to chat history
- AI responds with follow-up questions

### 3. Complete Intake
- Click "Complete Intake" button
- System analyzes conversation with OpenAI
- Extracts and validates structured data
- Stores in database
- Shows success message

### 4. Verify Data Stored
```bash
npx prisma studio
# Navigate to PatientIntake table
# View chatHistory and structuredData JSON
```

## File Checklist

Created files:
- ✅ `src/app/(dashboard)/patient/intake/page.tsx` - Chat UI
- ✅ `src/app/api/patient/intake/route.ts` - GET/POST endpoints
- ✅ `src/app/api/patient/intake/analyze/route.ts` - AI analysis
- ✅ `src/lib/intake-schema.ts` - JSON schema & validation
- ✅ `src/lib/intake-prompt.ts` - System prompt
- ✅ `src/types/intake.ts` - TypeScript types

Modified files:
- ✅ `prisma/schema.prisma` - Added PatientIntake model
- ✅ `src/context/AuthContext.tsx` - Added token management
- ✅ `src/app/(dashboard)/patient/page.tsx` - Added intake link
- ✅ `package.json` - Added openai and zod dependencies

## Verify Installation

Check everything is working:

```bash
# 1. TypeScript compiles
npx tsc --noEmit

# 2. Prisma schema is valid
npx prisma validate

# 3. Database is connected
npx prisma db execute --stdin < /dev/null

# 4. All dependencies installed
npm list openai zod
```

Expected output for step 4:
```
├── openai@4.52.0
└── zod@3.22.4
```

## Troubleshooting

### "OPENAI_API_KEY not set" warning
- This is normal on first run
- The UI will still work, but AI analysis will fail
- Set OPENAI_API_KEY in .env.local and restart

### Database connection error
- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Run: `npm run db:push` to sync schema

### Patient profile not found
- Ensure user is logged in as patient role
- Check patient has PatientProfile in database
- Demo patients: patient@example.com, patient2@example.com

### Chat messages not sending
- Check browser console for errors
- Verify auth token is in localStorage
- Check API endpoint in Network tab

## Next Steps

1. **Add Voice Input** - Integrate speech-to-text API
2. **Improve AI Prompts** - Fine-tune questions for better data
3. **Doctor Dashboard** - Create view for doctors to review intakes
4. **Analytics** - Track intake completion rates
5. **Mobile Responsive** - Test on various devices

## Support Commands

```bash
# View database in GUI
npm run db:studio

# Check for errors
npx tsc --noEmit

# Run dev server with logs
npm run dev

# View Prisma schema
cat prisma/schema.prisma | grep -A 20 "model PatientIntake"
```

---

Ready to go! Start the dev server with `npm run dev` and navigate to `/dashboard/patient/intake`.
