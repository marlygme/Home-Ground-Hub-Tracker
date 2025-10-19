# Home Ground Hub Tracker - Design Guidelines

## Design Approach: Utility-Focused Data Management System

**Selected Approach:** Design System (Material Design + Linear-inspired aesthetics)
**Rationale:** This is a productivity/management tool where efficiency, data clarity, and mobile usability are paramount. Drawing inspiration from Linear's clean data presentation and Material Design's robust form patterns.

**Core Design Principles:**
- Information hierarchy through typography and spacing, not color
- Mobile-first responsive design optimized for tablets and phones
- Immediate access to key actions (Add Participant, Search, Filter)
- Clear visual separation between participant list and attendance tracker

---

## Color Palette

**Light Mode:**
- Background: 0 0% 98% (off-white)
- Surface: 0 0% 100% (white cards)
- Border: 0 0% 90%
- Text Primary: 0 0% 13%
- Text Secondary: 0 0% 45%
- Primary Action: 142 76% 36% (soccer field green)
- Primary Hover: 142 76% 30%
- Danger: 0 84% 60% (for delete actions)
- Success: 142 69% 58% (attendance checked)

**Dark Mode:**
- Background: 0 0% 7%
- Surface: 0 0% 10%
- Border: 0 0% 20%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 65%
- Primary Action: 142 69% 45%
- Primary Hover: 142 69% 50%

---

## Typography

**Font Family:** Inter (Google Fonts) - primary font for entire application
**Secondary:** JetBrains Mono (for participant IDs/codes if needed)

**Hierarchy:**
- Page Title: font-semibold text-2xl (Home Ground Hub Tracker)
- Section Headers: font-semibold text-lg 
- Participant Names: font-medium text-base
- Labels/Metadata: font-normal text-sm text-secondary
- Form Labels: font-medium text-sm
- Table Headers: font-semibold text-xs uppercase tracking-wide

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, py-8)
- Component padding: p-4 or p-6
- Section spacing: space-y-6 or space-y-8
- Card spacing: p-6
- Form field gaps: space-y-4
- Grid gaps: gap-4

**Container Strategy:**
- Max width: max-w-7xl mx-auto px-4
- Mobile: Full-width cards with px-4 container padding
- Tablet+: Standard cards with breathing room

**Grid Layouts:**
- Participant cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Form fields: 2-column on desktop (md:grid-cols-2), single column on mobile
- Attendance grid: Horizontal scroll on mobile, full table on desktop

---

## Component Library

### A. Navigation Header
- Sticky top bar with app title on left
- Add Participant button (primary green) on right
- Mobile: Hamburger menu for filters/settings
- Shadow on scroll for depth

### B. Search & Filter Bar
- Search input with icon (left-aligned)
- Age group filter chips (horizontal scroll on mobile)
- Active filter: filled background, inactive: outline
- Clear filters button when active

### C. Participant Cards (Mobile) / Table (Desktop)
**Mobile Cards:**
- White/dark surface with rounded-lg border
- Participant name as card header (font-medium text-lg)
- Email and phone as secondary text below
- Age group badge (small, colored by group)
- Action buttons: Edit (ghost), Delete (ghost danger) in card footer
- Tap card to expand attendance view

**Desktop Table:**
- Clean table with hover states
- Columns: Name | Email | Phone | Age Group | Actions | Attendance Preview
- Sticky header when scrolling
- Row actions: Edit icon, Delete icon
- Click row to expand full attendance tracker

### D. Attendance Tracker
**Expanded View:**
- Modal or slide-up panel (mobile) / inline expansion (desktop)
- Week labels (Week 1-10) as column headers
- Checkbox grid with clear touch targets (min 44px mobile)
- Visual: Checked = green checkmark, Unchecked = empty border
- Save/Close actions at bottom
- Week summary: "7/10 weeks attended"

### E. Forms (Add/Edit Participant)
**Modal/Drawer Pattern:**
- Overlay background (backdrop-blur-sm bg-black/20)
- Form container: max-w-md centered (desktop) / slide-up drawer (mobile)
- Fields:
  - Full Name (text input, required)
  - Parent/Guardian Email (email input, required, validated)
  - Phone Number (tel input, required, formatted)
  - Age Group (select dropdown with groups)
- Buttons: Save (primary green), Cancel (ghost)
- Form validation: red border + error text below field

### F. Action Buttons
- Primary: bg-primary text-white rounded-lg px-4 py-2 font-medium
- Secondary/Ghost: border border-border hover:bg-surface
- Danger: text-danger hover:bg-red-50
- Icon buttons: p-2 rounded-md hover:bg-surface

### G. Empty States
- When no participants: Center message with illustration/icon
- "No participants yet. Add your first participant to get started."
- Large Add Participant button below

### H. Data Persistence Indicator
- Subtle "Last saved" timestamp in footer
- Auto-save indicator (checkmark icon) when data persists

---

## Mobile Optimization

**Key Patterns:**
- Bottom sheet for forms and attendance (easier thumb reach)
- Horizontal scroll for age group filter chips
- Large touch targets (min 44px) for checkboxes
- Swipe actions on participant cards (swipe left for delete)
- Floating Action Button (FAB) for Add Participant on mobile

**Breakpoints:**
- Mobile: < 640px (single column, cards, bottom sheets)
- Tablet: 640-1024px (2-column cards, slide-over panels)
- Desktop: > 1024px (3-column cards or table view, modals)

---

## Animations

**Minimal, Purposeful Motion:**
- Modal/drawer entrance: slide-up with fade (200ms ease-out)
- Checkbox toggle: scale animation (150ms)
- Card hover: subtle lift (shadow transition)
- Filter chip activation: background color transition (150ms)
- NO scroll-driven animations or complex page transitions

---

## Images

**No hero image required.** This is a utility application focused on data management. Visual interest comes from clean typography, organized data presentation, and functional design patterns rather than decorative imagery.