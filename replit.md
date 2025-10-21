# Home Ground Hub Tracker

## Overview
A mobile-friendly React + Vite web application for managing participants in soccer programs. It uses a PostgreSQL database for permanent, multi-user data storage, allowing coaches and administrators to create custom soccer programs, assign participants, and track weekly attendance with real-time data sharing.

**Purpose:**
- Create and manage multiple soccer programs with custom names and attendance week counts.
- Manage soccer program participants with full CRUD operations.
- Assign participants to specific programs (supports multi-program enrollment).
- Track weekly attendance with dynamic weeks per program.
- Filter and search participants by program, age, name, email, or phone.
- View statistics and analytics by program.
- Provide a mobile-responsive interface optimized for tablets and phones.

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

## System Architecture

**Technology Stack:**
- **Frontend**: React 18, TypeScript, Vite, Shadcn UI (Radix UI), Tailwind CSS, React Hook Form + Zod, TanStack Query, Wouter
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Neon) with Drizzle ORM

**Data Model:**
- **Program**: `id`, `name`, `attendanceWeeks`, `createdAt`.
- **Participant**: `id`, `fullName`, `parentEmail` (optional), `phoneNumber` (optional, Australian format), `age`, `attendance` (boolean array matching program weeks), `createdAt`.
- **Junction Table**: `participant_programs` (for many-to-many relationship between participants and programs).

**Key Features:**
1.  **Program Management:** CRUD operations for programs, custom names, definable attendance weeks (1-52), participant count display.
2.  **Participant Management:** CRUD operations for participants, assignment to specific programs (multiple programs supported), individual age tracking, optional contact fields, real-time search, program changes reset attendance.
3.  **Attendance Tracking:** Dynamic week count per program, checkbox grid, visual summary, completion percentage, individual and bulk marking (3-step process with individual participant selection).
4.  **Filtering & Search:** Program filter badges, real-time text search, combined filtering.
5.  **Analytics & Statistics:** Comprehensive dashboard, overall attendance rates, weekly breakdown, program performance comparison, perfect attendance recognition, best performing week identification, program-specific analytics.
6.  **Data Export & Printing:** CSV export for participant lists and attendance reports, printable rosters and attendance sheets.
7.  **Design System:** Soccer green primary color, Light/Dark mode, mobile-first responsive design, consistent spacing, Inter font, elevation system, tab-based navigation (Participants / Programs / Statistics), scroll-to-top button.
8.  **Data Persistence & Multi-User Support:** PostgreSQL database (Neon), Drizzle ORM, REST API, TanStack Query for data fetching/caching, real-time data sharing, permanent storage. Program deletion checks for assigned participants.

**Deployment Architecture:**
- **Frontend**: React + Vite (static files).
- **Backend**: Express.js REST API.
- **Database**: PostgreSQL (Neon).
- Supports Replit Deployments for integrated frontend and backend deployment.

## External Dependencies
- **PostgreSQL (via Neon)**: For database hosting and persistence.
- **Express.js**: Backend framework for REST API.
- **React**: Frontend library.
- **Vite**: Frontend build tool.
- **Shadcn UI (built on Radix UI primitives)**: UI component library.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Hook Form + Zod**: For form management and validation.
- **TanStack Query (React Query)**: For data fetching, caching, and state management.
- **Wouter**: For client-side routing.
- **Drizzle ORM**: For type-safe database interactions with PostgreSQL.