# Home Ground Hub Tracker

## Overview
A mobile-friendly React + Vite web application for managing participants in soccer programs. Built with localStorage for data persistence, allowing coaches and administrators to track participant information and weekly attendance offline.

## Purpose
- Manage soccer program participants with full CRUD operations
- Track weekly attendance (10 weeks) for each participant
- Filter participants by age group (5-7, 8-10, 11-13, 14-16, 17+)
- Search participants by name, email, or phone
- Mobile-responsive interface optimized for tablets and phones

## Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form + Zod validation
- **Data Persistence**: Browser localStorage
- **State Management**: React useState/useEffect
- **Routing**: Wouter

## Project Architecture

### Data Model (`shared/schema.ts`)
```typescript
Participant {
  id: string (UUID)
  fullName: string
  parentEmail: string (validated email)
  phoneNumber: string
  ageGroup: "5-7" | "8-10" | "11-13" | "14-16" | "17+"
  attendance: boolean[] (length 10)
  createdAt: string (ISO date)
}
```

### Key Features
1. **Participant Management**
   - Add new participants with validated forms
   - Edit existing participant information
   - Delete participants with confirmation
   - Real-time search across name, email, phone

2. **Attendance Tracking**
   - 10-week checkbox grid per participant
   - Visual attendance summary (weeks attended / total)
   - Completion percentage display
   - Individual week marking
   - **Bulk attendance marking** for groups and weeks

3. **Filtering & Search**
   - Age group filter badges
   - Real-time text search
   - Combined filtering (age group + search)

4. **Analytics & Statistics**
   - Comprehensive statistics dashboard
   - Overall attendance rates and trends
   - Weekly attendance breakdown with visual progress bars
   - Age group performance comparison
   - Perfect attendance recognition system
   - Best performing week identification

5. **Data Export & Printing**
   - CSV export for participant lists
   - CSV export for attendance reports
   - Printable participant rosters
   - Printable attendance sheets (landscape format)

6. **Design System**
   - Soccer green primary color (#2E7D32 variants)
   - Light/Dark mode support
   - Mobile-first responsive design
   - Consistent spacing (4, 6, 8px scale)
   - Inter font family
   - Elevation system for interactions
   - Tab-based navigation (Participants / Statistics)

### File Structure
```
client/src/
├── components/
│   ├── ui/ (Shadcn components)
│   ├── ThemeProvider.tsx
│   ├── ParticipantForm.tsx
│   ├── AttendanceTracker.tsx
│   ├── ParticipantCard.tsx
│   └── EmptyState.tsx
├── pages/
│   ├── Home.tsx (main dashboard)
│   └── not-found.tsx
├── lib/
│   ├── localStorage.ts (data service)
│   └── queryClient.ts
└── App.tsx

shared/
└── schema.ts (Zod schemas & types)
```

### Data Persistence
All participant data is stored in browser localStorage under the key `home-ground-hub-participants`. Data persists across browser sessions and includes automatic save indicators.

### Recent Changes
- **Phase 2 Features** (October 19, 2025)
  - Added bulk attendance marking for groups and multiple weeks
  - Implemented comprehensive statistics dashboard with analytics
  - Added CSV export for participants and attendance data
  - Created printable roster and attendance sheet views
  - Enhanced UI with tab navigation (Participants / Statistics)
  - Added perfect attendance recognition system
  - Implemented weekly and age group performance breakdowns

- **Phase 1 - Initial MVP** (October 19, 2025)
  - Complete participant CRUD with localStorage
  - Attendance tracking system with 10-week grid
  - Age group filtering and search functionality
  - Mobile-responsive card layouts
  - Dark mode support

## User Preferences
- Mobile-friendly interface required
- Clean, professional design
- Offline-first functionality (localStorage)
- Quick access to attendance tracking
- Easy participant management
- Australian phone number format (+61 area code)
- Cloudflare Pages deployment ready

## Deployment to Cloudflare Pages

### Step-by-Step Deployment Instructions

**IMPORTANT:** This is a static frontend-only app (no Node.js server needed). All data is stored in browser localStorage.

1. **Push Your Code to GitHub/GitLab**
   - Commit all your changes
   - Push to your repository

2. **Create New Project in Cloudflare Pages**
   - Go to https://dash.cloudflare.com/
   - Navigate to "Workers & Pages" → "Create" → "Pages" → "Connect to Git"
   - Select your repository

3. **Configure Build Settings** (VERY IMPORTANT - Enter Exactly as Shown):
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: dist/public
   ```

4. **Environment Variables** (Optional)
   - None required - app uses localStorage only

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete (usually 1-2 minutes)
   - Your app will be live at: `your-project-name.pages.dev`

### Troubleshooting

**Problem: Blank page on Cloudflare Pages preview**
- Solution: Make sure "Build output directory" is exactly `dist/public` (not `dist`)
- The build creates two folders: `dist/index.js` (backend - ignore this) and `dist/public/` (frontend - use this)

**Problem: 404 errors when refreshing the page**
- This shouldn't happen - the `_redirects` file handles this
- Verify the file exists: Check `dist/public/_redirects` contains `/* /index.html 200`
- Contact Cloudflare support if issue persists

**Problem: Build fails**
- Check that Node.js version is set to 18 or higher in Cloudflare settings
- Verify all dependencies are in `package.json`

### SPA Routing Configuration

- The `client/public/_redirects` file ensures proper client-side routing
- Contains: `/* /index.html 200`
- Automatically included in build output at `dist/public/_redirects`
- This file tells Cloudflare Pages to serve `index.html` for all routes, allowing React Router (wouter) to handle navigation

## Phone Number Format

- Validates Australian phone numbers (mobile and landline)
- Accepts formats: `+61 412 345 678`, `0412 345 678`, `02 9876 5432`
- Automatically formats numbers for display
- Mobile: 04XX XXX XXX or +61 4XX XXX XXX
- Landline: 0X XXXX XXXX (where X is 2, 3, 7, or 8)
