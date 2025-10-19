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
