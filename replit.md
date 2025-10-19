# Home Ground Hub Tracker

## Overview
A mobile-friendly React + Vite web application for managing participants in soccer programs. Built with localStorage for data persistence, allowing coaches and administrators to create custom soccer programs, assign participants, and track weekly attendance offline.

## Purpose
- Create and manage multiple soccer programs with custom names and attendance week counts
- Manage soccer program participants with full CRUD operations
- Assign participants to specific programs
- Track weekly attendance with dynamic weeks per program
- Filter and search participants by program, age, name, email, or phone
- View statistics and analytics by program
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
Program {
  id: string (UUID)
  name: string (e.g., "Monday Soccer", "Friday Soccer", "Youth Cup 02.12")
  attendanceWeeks: number (dynamic, 1-52 weeks)
  createdAt: string (ISO date)
}

Participant {
  id: string (UUID)
  fullName: string
  parentEmail: string (validated email)
  phoneNumber: string (Australian format, +61)
  age: number (individual age, not age group)
  programId: string (references Program.id)
  attendance: boolean[] (length matches Program.attendanceWeeks)
  createdAt: string (ISO date)
}
```

### Key Features
1. **Program Management**
   - Create soccer programs with custom names
   - Define attendance weeks per program (1-52 weeks)
   - Edit and delete programs
   - View participant counts per program
   - Programs shown in dedicated "Programs" tab

2. **Participant Management**
   - Add new participants with validated forms
   - Assign participants to specific programs
   - Individual age (number) instead of age groups
   - Edit existing participant information
   - Delete participants with confirmation
   - Real-time search across name, email, phone
   - Program changes reset attendance tracking

3. **Attendance Tracking**
   - Dynamic week count based on participant's program
   - Checkbox grid per participant (adapts to program weeks)
   - Visual attendance summary (weeks attended / total)
   - Completion percentage display
   - Individual week marking
   - **Bulk attendance marking** for programs and weeks

4. **Filtering & Search**
   - Program filter badges (filter by specific program)
   - Real-time text search
   - Combined filtering (program + search)
   - Age-based display (shows individual age on cards)

5. **Analytics & Statistics**
   - Comprehensive statistics dashboard
   - Overall attendance rates and trends
   - Weekly attendance breakdown with visual progress bars
   - Program performance comparison (replaces age group stats)
   - Perfect attendance recognition system
   - Best performing week identification
   - Program-specific analytics

6. **Data Export & Printing**
   - CSV export for participant lists (includes age and program)
   - CSV export for attendance reports (dynamic weeks)
   - Printable participant rosters
   - Printable attendance sheets (landscape format, dynamic columns)

7. **Design System**
   - Soccer green primary color (#2E7D32 variants)
   - Light/Dark mode support
   - Mobile-first responsive design
   - Consistent spacing (4, 6, 8px scale)
   - Inter font family
   - Elevation system for interactions
   - Tab-based navigation (Participants / Programs / Statistics)

### File Structure
```
client/src/
├── components/
│   ├── ui/ (Shadcn components)
│   ├── ThemeProvider.tsx
│   ├── ProgramManagement.tsx (NEW - program CRUD)
│   ├── ParticipantForm.tsx (updated - program selection, age number)
│   ├── AttendanceTracker.tsx (updated - dynamic weeks)
│   ├── ParticipantCard.tsx (updated - shows age and program)
│   ├── BulkAttendanceDialog.tsx (updated - program filtering)
│   ├── StatisticsView.tsx (updated - program analytics)
│   ├── PrintView.tsx (updated - dynamic weeks, program columns)
│   └── EmptyState.tsx
├── pages/
│   ├── Home.tsx (main dashboard - 3 tabs)
│   └── not-found.tsx
├── lib/
│   ├── localStorage.ts (data service - programs + participants)
│   ├── exportUtils.ts (updated - program-aware exports)
│   └── queryClient.ts
└── App.tsx

shared/
└── schema.ts (Zod schemas & types - Program + Participant)
```

### Data Persistence
- **Programs**: Stored in localStorage under `home-ground-hub-programs`
- **Participants**: Stored in localStorage under `home-ground-hub-participants`
- Data persists across browser sessions
- Automatic save indicators
- Program deletion checks for assigned participants

### Recent Changes
- **Phase 3 - Program System** (October 19, 2025)
  - Replaced age group system with individual age (number)
  - Implemented full program management (create, edit, delete)
  - Added program assignment to participants
  - Dynamic attendance weeks per program (1-52 weeks configurable)
  - Updated all components to support program-based filtering
  - Replaced age group statistics with program statistics
  - Updated CSV exports to include age and program columns
  - Updated print views with dynamic week columns
  - Three-tab navigation: Participants / Programs / Statistics
  - Program filter badges replace age group badges
  - Attendance tracking adapts to program's week count

- **Phase 2 Features** (October 19, 2025)
  - Added bulk attendance marking for groups and multiple weeks
  - Implemented comprehensive statistics dashboard with analytics
  - Added CSV export for participants and attendance data
  - Created printable roster and attendance sheet views
  - Enhanced UI with tab navigation
  - Added perfect attendance recognition system
  - Implemented weekly performance breakdowns

- **Phase 1 - Initial MVP** (October 19, 2025)
  - Complete participant CRUD with localStorage
  - Attendance tracking system
  - Filtering and search functionality
  - Mobile-responsive card layouts
  - Dark mode support

## User Preferences
- Mobile-friendly interface required
- Clean, professional design
- Offline-first functionality (localStorage)
- Quick access to attendance tracking
- Easy program and participant management
- Australian phone number format (+61 area code)
- Individual age tracking (not date of birth)
- Custom program names (e.g., "Monday Soccer", "Youth Cup 02.12")
- Flexible attendance week counts per program
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

## Program System Details

### Creating Programs
- Navigate to "Programs" tab
- Click "Create Program" button
- Enter program name (e.g., "Monday Soccer", "Friday Soccer", "Youth Cup 02.12")
- Set attendance weeks (1-52 weeks)
- Programs can be edited or deleted (checks for assigned participants)

### Assigning Participants
- When creating/editing a participant, select their program from dropdown
- If program is changed, attendance is reset to account for different week count
- Each participant can only belong to one program at a time

### Dynamic Attendance
- Attendance grid shows exactly the number of weeks defined in the program
- A participant in an 8-week program sees 8 checkboxes
- A participant in a 12-week program sees 12 checkboxes
- Statistics and exports calculate percentages based on program-specific weeks

### Program Filtering
- Filter participants by specific program using badge filters
- Bulk attendance can filter by program
- Statistics show program-level performance
- CSV exports include program name for each participant
