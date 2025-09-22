# Scheduler Module

A comprehensive project timeline scheduler with Day, Week, and Month views, designed specifically for project management with visual project bars and interactive features.

## Features

### Views
- **Day View**: Shows all projects starting/ending on a specific day in vertical order
- **Week View**: Projects appear as horizontal bars spanning their start → end dates within the week grid
- **Month View**: Projects displayed as horizontal bars across multiple days (Google Calendar style)

### Project Management
- **Project Duration**: Minimum 4 days, maximum 15-20 days
- **Status Badges**: UB, WB, WIP, Completed, On-Hold with color coding
- **Project Information**: Title, VIN code, location, description, team assignments
- **Visual Indicators**: Color-coded project bars based on status

### Navigation
- **View Switching**: Toggle between Day, Week, and Month tabs
- **Date Navigation**: Forward/backward navigation for dates/weeks/months
- **Today Button**: Quick navigation to current date

### Interactions
- **Project Click**: Opens detailed Project Details Panel
- **Hover Tooltips**: Quick info tooltip showing project name, location, status, duration
- **Responsive Design**: Handles horizontal & vertical scrolling gracefully
- **Sticky Headers**: Keep headers (days, weeks, months) sticky while scrolling

## Components

### Core Components
- `Scheduler`: Main scheduler component
- `SchedulerHeader`: Navigation and view controls
- `DayView`: Day-specific project display
- `WeekView`: Week grid with horizontal project bars
- `MonthView`: Month grid with multi-day project bars

### Interactive Components
- `ProjectBar`: Individual project bar with click/hover interactions
- `ProjectTooltip`: Hover tooltip with project details
- `ProjectDetailsPanel`: Detailed project information panel

## Usage

```tsx
import { Scheduler } from './features/scheduler';

// Basic usage
<Scheduler />

// With custom projects
<Scheduler 
  projects={customProjects}
  onProjectClick={(project) => console.log('Project clicked:', project)}
/>
```

## Project Data Structure

```typescript
interface SchedulerProject extends Project {
  vinCode: string;
  duration: number; // in days
  color?: string;
}
```

## Styling

The scheduler uses Tailwind CSS classes and follows the design system:
- Status colors are defined in `PROJECT_STATUS_COLORS`
- Responsive grid layouts for different view types
- Hover states and transitions for interactive elements
- Sticky positioning for headers during scrolling

## Utilities

The module includes utility functions for:
- Date calculations and formatting
- Project positioning and sizing
- Duration validation
- Range filtering
- Color generation

## Responsive Design

- Mobile-friendly layouts
- Horizontal scrolling for week/month views
- Vertical scrolling for day view
- Sticky headers for better navigation
- Touch-friendly interactions
