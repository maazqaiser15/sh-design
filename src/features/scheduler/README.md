# Team Scheduler

A Gantt chart-like timeline view for managing team member project assignments and schedules.

## Features

### Layout & Structure
- **Left Column**: Team members list with avatars, names, and roles
- **Right Side**: Timeline allocation with weekly calendar dates
- **Project Bars**: Color-coded bars showing project assignments across time

### Team Member Information
- Avatar display (with fallback to initials)
- Name and role badges
- Role color coding:
  - Lead: Red
  - Supervisor: Purple  
  - Crew Leader: Blue
  - Project Coordinator: Green
  - Installer: Gray

### Timeline Features
- **Weekly View**: Default 7-day timeline
- **Project Bars**: Extend from start to end date
- **Color Coding**: By project status (PV90, UB, WB, WIP, QF, Completed)
- **Stacking**: Overlapping projects stack vertically
- **Tooltips**: Hover shows project name, dates, duration, and role

### Interaction
- **Hover**: Shows detailed project information
- **Click**: Future navigation to project details
- **Navigation**: Week forward/backward controls
- **Unassigned State**: Shows "Unassigned" for team members without projects

## Components

### TeamSchedulerView
Main container component that orchestrates the entire team scheduler interface.

### TeamMemberRow
Individual row component for each team member, containing:
- Member info (left column)
- Timeline bars (right column)
- Project stacking logic

### TimelineBar
Individual project bar component with:
- Color coding by project status
- Hover tooltips
- Click handlers
- Responsive positioning

## Data Structure

### TeamMemberAssignment
```typescript
interface TeamMemberAssignment {
  id: string;
  name: string;
  role: 'Lead' | 'Supervisor' | 'Crew Leader' | 'Installer' | 'Project Coordinator';
  avatar?: string;
  projects: TeamMemberProject[];
}
```

### TeamMemberProject
```typescript
interface TeamMemberProject {
  id: string;
  name: string;
  stage: ProjectStage;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  role: string; // Role in this specific project
  color: string; // Color for the bar
}
```

## Usage

The Team Scheduler is accessible through the main Scheduler page by switching to "Team" mode using the mode toggle in the header.

## Future Enhancements

- Day View: Single-day allocation view
- Month View: Full month timeline view
- Drag & Drop: Reassign projects by dragging bars
- Conflict Detection: Visual indicators for scheduling conflicts
- Resource Utilization: Charts showing team member workload
- Export: PDF/Excel export of schedules