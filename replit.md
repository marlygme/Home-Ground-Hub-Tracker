# Home Ground Hub Tracker

## Overview
A mobile-friendly React + Vite web application for managing participants in soccer programs. Built with PostgreSQL database for permanent, multi-user data storage, allowing coaches and administrators to create custom soccer programs, assign participants, and track weekly attendance with real-time data sharing across all users.

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
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query (React Query)
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
  fullName: string (required)
  parentEmail: string | null (optional, validated email if provided)
  phoneNumber: string | null (optional, Australian format +61 if provided)
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
   - **Optional email and phone fields** (can be added later)
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
│   ├── ProgramManagement.tsx (program CRUD with API)
│   ├── ParticipantForm.tsx (participant forms with API)
│   ├── AttendanceTracker.tsx (dynamic weeks)
│   ├── ParticipantCard.tsx (shows age and program)
│   ├── BulkAttendanceDialog.tsx (program filtering)
│   ├── StatisticsView.tsx (program analytics)
│   ├── PrintView.tsx (dynamic weeks, program columns)
│   └── EmptyState.tsx
├── pages/
│   ├── Home.tsx (main dashboard - 3 tabs)
│   └── not-found.tsx
├── lib/
│   ├── exportUtils.ts (CSV export utilities)
│   └── queryClient.ts (TanStack Query setup + API helpers)
└── App.tsx

server/
├── db/
│   └── index.ts (Drizzle database connection)
├── routes.ts (REST API endpoints)
├── storage.ts (database operations)
└── index.ts (Express server)

shared/
└── schema.ts (Drizzle + Zod schemas - Program + Participant)
```

### Data Persistence & Multi-User Support
- **Database**: PostgreSQL (Neon) with HTTP connection
- **Tables**: `programs` and `participants`
- **ORM**: Drizzle for type-safe database operations
- **API**: REST endpoints (GET, POST, PATCH, DELETE)
- **Multi-user**: All data shared in real-time across all users
- **Persistence**: Data permanently stored in database
- **Data fetching**: TanStack Query with automatic caching and invalidation
- Program deletion checks for assigned participants before allowing deletion

### Recent Changes
- **Phase 5 - Multi-Program Support & Bug Fixes** (October 21, 2025)
  - Implemented many-to-many relationship between participants and programs
  - Participants can now be enrolled in multiple programs simultaneously
  - Updated database schema with `participant_programs` junction table
  - Modified frontend forms to use checkbox multi-select for programs
  - Participant cards now display multiple program badges
  - Fixed Cloudflare Pages deployment issue (changed `@shared/schema` to relative import in `server/db/cloudflare.ts`)
  - Added error handling and logging to Cloudflare Functions
  - Added null-safety guards for deleted programs in storage layer
  - **Fixed critical bugs:**
    - Created Cloudflare Function for attendance endpoint: `functions/api/participants/[id]/attendance.ts`
    - Programs tab now displays accurate participant counts per program
    - Updated `updateAttendance` storage method to persist attendance in junction table
    - Fixed `handleSaveAttendance` to call API instead of just closing dialog
    - Added `updateAttendance` to IStorage interface

- **Phase 4 - PostgreSQL Multi-User Database** (October 20, 2025)
  - Migrated from localStorage to PostgreSQL database for permanent storage
  - Implemented multi-user data sharing across all users
  - Created REST API with Express.js backend
  - Added Drizzle ORM for type-safe database operations
  - Integrated TanStack Query for data fetching and caching
  - All users now see real-time updates when data changes
  - Data persists permanently even after browser closes
  - **Made email and phone optional fields** - participants can be added without contact info
  - Updated form validation to allow empty email/phone with proper format validation when provided
  - Participant cards now hide email/phone icons when not provided
  - Prepared for deployment to Replit with backend support

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
- Multi-user data sharing with permanent database storage
- Quick access to attendance tracking
- Easy program and participant management
- Australian phone number format (+61 area code)
- Individual age tracking (not date of birth)
- Custom program names (e.g., "Monday Soccer", "Youth Cup 02.12")
- Flexible attendance week counts per program
- Real-time updates visible to all users

## Deployment

### Architecture
This application now uses a full-stack architecture:
- **Frontend**: React + Vite (static files)
- **Backend**: Express.js REST API
- **Database**: PostgreSQL (Neon)

### Deployment Options

#### Option 1: Replit Deployments (Recommended)
The easiest way to deploy this app is using Replit's built-in deployment:

1. Click the "Deploy" button in Replit
2. Configure your deployment settings
3. Your app will be deployed with both frontend and backend
4. Database connection is automatically configured
5. Your app will be live at: `your-project-name.replit.app`

#### Option 2: Manual Deployment (Advanced)
For custom deployments, you'll need to deploy:
1. **Database**: PostgreSQL instance (Neon, Supabase, etc.)
2. **Backend**: Express server (Render, Railway, Fly.io)
3. **Frontend**: Static files (Cloudflare Pages, Vercel, Netlify)

**Required Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Random secret for sessions
- `NODE_ENV` - Set to `production`

**Build Commands:**
- Frontend: `npm run build` (outputs to `dist/public`)
- Backend: `tsx server/index.ts` or `npm run dev`

### Important Notes
- The app requires both frontend and backend to be running
- Database must be PostgreSQL-compatible
- All users share the same database
- Data persists permanently in the database

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
