# Admin Dashboard - Quick Reference Guide

## Getting Started

### Login

1. Navigate to `/login`
2. Enter admin credentials:
   ```
   Email: admin@hospital.com
   Password: (As configured)
   ```
3. You'll be redirected to your role-specific dashboard

### Access Admin Dashboard

- URL: `http://localhost:3000/dashboard/admin`
- Requires: Admin role
- Access: Full read-only analytics

---

## Dashboard Sections

### 1. Header Section

**Controls:**
- **Title**: "Admin Dashboard" with subtitle "Hospital Management & Analytics"
- **Refresh Button**: Click to reload all data from APIs
- **Last Updated**: Timestamp of last data refresh

**Usage:**
```
👉 Click "Refresh Data" to get the latest statistics
⏰ Check "Last updated" time to see data freshness
```

---

### 2. Today's Statistics

Displays 5 key metrics for the current day:

| Card | What It Shows | Color |
|------|--------------|-------|
| **Total Visits** | All visits scheduled for today | Blue |
| **Total Patients** | Unique patients with visits today | Purple |
| **Scheduled** | Upcoming visits (not yet done) | Yellow |
| **Completed** | Finished visits | Green |
| **No Shows** | Missed appointments | Red |

**How to Read:**
```
Example Today's Stats:
├─ Total Visits: 15      ← 15 appointment slots today
├─ Total Patients: 12    ← 12 different people (some may have 2+ visits)
├─ Scheduled: 5          ← 5 visits haven't happened yet
├─ Completed: 8          ← 8 visits already finished
└─ No Shows: 2           ← 2 people didn't show up
```

**Use Case:**
- Morning standup: "How many patients today?"
- Mid-day check: "How many visits completed?"
- End of day: "Track no-shows for follow-up"

---

### 3. Hospital Overview

Broader statistics across entire hospital:

| Card | What It Shows | Color |
|------|--------------|-------|
| **Total Doctors** | Number of doctors in hospital | Purple |
| **Total Patients** | All unique patients (all-time) | Green |
| **Total Visits** | All visits ever recorded | Blue |
| **Avg. Patients/Doctor** | Average workload per doctor | Yellow |

**How to Read:**
```
Example Hospital Stats:
├─ Total Doctors: 10        ← 10 doctors on staff
├─ Total Patients: 250      ← 250 registered patients (lifetime)
├─ Total Visits: 1050       ← 1050 total appointments (lifetime)
└─ Avg Patients/Doctor: 25  ← Each doctor manages ~25 patients
```

**Use Case:**
- Capacity planning: "Do we need more doctors?"
- Resource allocation: "Which doctors have heaviest load?"
- Performance: "Average visits per doctor is trending up/down"

---

### 4. Doctor-Wise Patient Distribution Table

Detailed breakdown by individual doctor:

**Column Headers:**
| Header | Meaning | Example |
|--------|---------|---------|
| Doctor Name | Full name of doctor | Dr. John Smith |
| Specialization | Medical specialty | Cardiology |
| Total Patients | Unique patients assigned | 45 |
| Scheduled | Upcoming appointments | 8 |
| Completed | Finished appointments | 120 |
| No Show | Missed appointments | 3 |

**How to Read a Row:**
```
Dr. Sarah Johnson | Pediatrics | 38 | 5 | 95 | 2

Meaning:
- Dr. Sarah Johnson specializes in Pediatrics
- Has 38 unique patients total
- Has 5 upcoming appointments
- Completed 95 appointments (historically)
- Has 2 no-shows (historically)
```

**Color-Coded Badges:**
- 🔵 Specialization → Blue badge
- 🟡 Scheduled → Yellow badge  
- 🟢 Completed → Green badge
- 🔴 No Show → Red badge

---

## Common Tasks

### Task 1: Check Today's Capacity

```
1. Go to /dashboard/admin
2. Look at "Today's Statistics" section
3. Read "Total Patients" and "Scheduled" values

Example: "12 patients total, 5 still scheduled"
→ Hospital is 58% through the day's volume
```

### Task 2: Identify Doctor with Most Patients

```
1. Look at "Doctor-Wise Patient Distribution" table
2. Doctor at TOP = highest patient count (sorted automatically)
3. Check "Total Patients" column

Example: Dr. John Smith (45 patients) at top
→ John has most patient relationships
→ May need to balance workload
```

### Task 3: Identify Doctor with Most Completions

```
1. Look at "Doctor-Wise Patient Distribution" table
2. Scan "Completed" column for highest number
3. May not be same as "Total Patients"

Example: 
- Dr. A: 45 patients, 120 completions
- Dr. B: 38 patients, 95 completions
→ Dr. A is more productive/efficient
```

### Task 4: Track No-Shows

```
1. Go to "Today's Statistics" → "No Shows" card
2. Note the number for today
3. Use "Refresh Data" to update throughout day

Morning: 0 no-shows
Afternoon: 1 no-show
Evening: 2 no-shows
→ Track trends for follow-up calls
```

### Task 5: Compare Doctor Workloads

```
1. View "Hospital Overview" → "Avg Patients/Doctor"
2. Compare individual doctors to average
3. Doctors above average may need support
4. Doctors below average could take more

Example:
Average: 25 patients/doctor
- Dr. A: 45 patients (180% of average) ← Overloaded?
- Dr. B: 12 patients (48% of average) ← Underutilized?
```

---

## Field Reference

### Status Definitions

**For Visits:**
- **SCHEDULED**: Appointment is confirmed but hasn't happened yet
- **COMPLETED**: Doctor finished the appointment and added notes
- **CANCELLED**: Patient or doctor cancelled the appointment
- **NO_SHOW**: Appointment time passed but patient didn't appear

**For Patient Counts:**
- **Total Patients**: Count of unique individuals (no duplicates)
- **Total Visits**: Sum of all appointments (patients can have multiple)

### Specialization Examples

- Cardiology (heart diseases)
- Pediatrics (children's medicine)
- Orthopedics (bones/joints)
- Neurology (nervous system)
- Dermatology (skin conditions)
- Etc.

---

## Troubleshooting

### Problem: "Forbidden: Admin access required"

**What it means:** You're logged in but not as an admin

**Solution:**
1. Check if you're logged in with correct account
2. Ask hospital IT to verify your role is "admin"
3. Log out and log back in
4. If still failing, try different browser/incognito mode

---

### Problem: Dashboard shows "Loading..." for a long time

**What it means:** API calls are taking too long or network is slow

**Solution:**
1. Wait 5-10 seconds for page to load
2. Check internet connection
3. Try clicking "Refresh Data" again
4. If still stuck, reload the page (F5)
5. Contact IT if problem persists

---

### Problem: Numbers seem incorrect or outdated

**What it means:** Data hasn't been refreshed yet

**Solution:**
1. Click "Refresh Data" button
2. Check "Last updated" timestamp
3. Wait for new numbers to appear
4. Data should update within 5-10 seconds

---

### Problem: Can't access /dashboard/admin URL

**What it means:** Route doesn't exist or permission denied

**Solution:**
1. Verify you're logged in as admin (check top-right corner)
2. Type correct URL: `localhost:3000/dashboard/admin`
3. If redirected to `/dashboard`, you don't have admin role
4. Contact IT for permission update

---

### Problem: Doctor table is empty

**What it means:** No doctors in system or database connection issue

**Solution:**
1. Verify doctors exist in hospital system
2. Ask IT to check database has doctor records
3. Try refreshing page
4. Check browser console (F12) for errors

---

## Data Interpretation Tips

### Identifying Trends

**Metric:** No-shows increasing
- **Cause:** May indicate scheduling conflicts, transportation issues, or patient dissatisfaction
- **Action:** Consider patient outreach, reminder system, or appointment timing adjustment

**Metric:** One doctor has many more patients than others
- **Cause:** Popular doctor, unbalanced scheduling, or specialty demand
- **Action:** Consider load balancing, hiring, or wait-time analysis

**Metric:** Large gap between scheduled and completed visits
- **Cause:** Peak time delay, complexity in cases, or administrative overhead
- **Action:** Analyze visit duration, patient complexity, or staffing needs

---

## Best Practices

### Daily Check

```
⏰ Morning:
  1. View Today's Statistics
  2. Note number of scheduled visits
  3. Identify peak hours if possible
  4. Brief staff on expected volume

☀️ Mid-day:
  1. Click Refresh Data
  2. Check completed vs. scheduled
  3. Identify any bottlenecks
  4. Adjust staffing if needed

🌙 Evening:
  1. Final Refresh Data
  2. Review no-shows for day
  3. Plan follow-up calls
  4. Prepare next day's brief
```

### Weekly Analysis

```
1. Review "Doctor-Wise Patient Distribution"
2. Identify doctors needing support
3. Plan load balancing
4. Discuss with department heads
5. Adjust schedules as needed
```

### Monthly Review

```
1. Analyze trends over the month
2. Compare to previous months (manual review)
3. Identify seasonal patterns
4. Plan hiring or resource allocation
5. Update hospital plans
```

---

## FAQ

**Q: Why is my patient count different from records office?**
A: Dashboard counts only patients with visits. Records office may count all registered patients.

**Q: Can I see details about a specific patient?**
A: No, this dashboard shows aggregated stats only. Use patient management system for details.

**Q: Can I edit or delete data from this dashboard?**
A: No, it's read-only. This prevents accidental data loss.

**Q: How often does data refresh?**
A: On-demand when you click "Refresh Data". Timestamp shows last update.

**Q: Why does "Total Patients" differ from sum of doctor patients?**
A: One patient may see multiple doctors. Dashboard deduplicates correctly.

**Q: Can I export this data?**
A: Not yet. Contact IT if you need CSV/PDF export feature.

**Q: What timezone is "Today"?**
A: Server timezone (typically UTC or hospital timezone). Contact IT to verify.

**Q: Are upcoming visits included in "Completed"?**
A: No, only finished visits appear in "Completed" count.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| F5 | Reload entire dashboard |
| F12 | Open browser developer tools (for IT support) |
| Ctrl+R | Refresh page |
| Ctrl+Shift+Delete | Clear browser cache (if data seems stale) |

---

## Contact & Support

**Technical Issues:**
- Contact: Hospital IT Department
- Dashboard URL: `/dashboard/admin`
- Required: Admin role in system

**Data Accuracy Questions:**
- Contact: Hospital Records/Finance
- Verify: Doctor/Patient registration
- Timeline: Immediate review

**Feature Requests:**
- Contact: Development Team
- Examples: Export, filters, advanced analytics
- Timeline: Feature backlog review

---

## Key Takeaways

✅ **Do:**
- Check dashboard daily for operational insights
- Use "Refresh Data" when you need fresh numbers
- Compare doctors to identify workload issues
- Track today's volume and no-shows
- Use data for staffing and scheduling decisions

❌ **Don't:**
- Edit data directly in dashboard (it's read-only)
- Share raw numbers without context
- Make major decisions from one day's data
- Assume patient count = doctor productivity
- Expect real-time WebSocket updates (on-demand refresh only)

---

## Example Workflow

```
Monday Morning @ 8:00 AM
├─ Open /dashboard/admin
├─ Read Today's Statistics
│  └─ 18 visits scheduled, 15 unique patients
├─ Check Doctor-Wise Distribution
│  └─ Dr. A: 45 patients, Dr. B: 38 patients, Dr. C: 32 patients
├─ Brief team on expected volume (18 visits)
├─ Pre-position staff for Dr. A (busiest)
└─ Refresh throughout day for updates

Monday 12:00 PM (Mid-day)
├─ Click "Refresh Data"
├─ Check progress
│  └─ 8 completed, 7 scheduled, 3 pending (realistic timeline)
├─ No unusual no-shows
└─ Continue operations normally

Monday 5:00 PM (End of day)
├─ Final Refresh Data
├─ Review totals
│  └─ 15 completed, 2 no-shows (11% no-show rate)
├─ Plan follow-up calls for no-shows
└─ Prepare tomorrow's brief
```

---

**Version:** 1.0  
**Last Updated:** January 22, 2026  
**For:** Hospital Administrators  
**Status:** Production Ready
