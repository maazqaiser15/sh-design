# Safe Haven Defense Project Module

A comprehensive project management module specifically designed for Safe Haven Defense security film installation projects.

## Project Stages

The module uses a 5-stage project lifecycle:

- **PV90** → Pre-validation (initial stage before UB)
- **UB** → Upcoming / Backlog (approved but not yet started)
- **WB** → Work-Bound (ready to start, planned)
- **WIP** → Work In Progress (execution ongoing)
- **Completed** → Project finished

## Structure

```
src/features/project/
├── components/
│   ├── ProjectListView.tsx           # Card layout for projects
│   ├── ProjectTableView.tsx          # Data grid table view
│   ├── ProjectFilters.tsx            # Global filters and search
│   └── ProjectDetailsPlaceholder.tsx # Project details panel
├── pages/
│   └── ProjectListPage.tsx           # Main project list page
├── types.ts                          # TypeScript definitions
├── utils.ts                          # Utility functions
├── index.ts                          # Module exports
└── README.md                         # This file
```

## Features

### Project Management
- **Safe Haven Defense specific project types** with VIN codes, crew assignments, and trailer tracking
- **Dual view modes**: Card layout and data grid table
- **Advanced filtering**: By status, location, crew, trailer, and search query
- **Sorting**: By any field with ascending/descending options
- **Project details**: Placeholder panel for future detailed project management

### Project Cards (List View)
Each project card displays:
- Project name and VIN code (grey chip)
- Status badge with pastel colors
- Location information
- Crew avatars (up to 3 + overflow indicator)
- Assigned trailer or "Not Assigned"
- Stage indicator instead of progress bar
- Timeline information

### Data Grid (Table View)
Columns include:
- Project Name with description
- VIN code
- Status with color coding
- Location with icon
- Crew count with avatars
- Assigned trailer
- Start and end dates
- Sortable headers

### Layout & Navigation
- **Compact Header**: Page title and count on left, controls on right
- **Single Row Controls**: Search bar, status filter, view toggle (icons only), and New Project button
- **Responsive Design**: 24px desktop padding, 16px mobile, centered max-width container
- **Clean Typography**: Consistent text sizing and spacing

### Project Cards (Compact Design)
- **Grid Layout**: 3 columns desktop, 2 tablet, 1 mobile with equal card heights
- **Card Structure**: 
  - Top: Project title + VIN badge + status badge (right-aligned)
  - Location: Muted text with icon
  - Crew & Trailer: Horizontal layout with avatars and trailer name
  - Bottom: Project duration only
- **Visual Design**: Rounded corners (rounded-xl), subtle borders, hover effects

### Status Colors
- **UB**: Blue (bg-blue-100 text-blue-700)
- **WB**: Yellow (bg-yellow-100 text-yellow-700)  
- **WIP**: Green (bg-green-100 text-green-700)
- **Completed**: Gray (bg-gray-100 text-gray-700)
- **PV90**: Purple (bg-purple-100 text-purple-700)

### Filtering & Search
- **Global search**: Search across project names, descriptions, locations, VIN codes, crew names
- **Status filter**: Dropdown to filter by project stage (PV90, UB, WB, WIP, Completed)
- **View toggle**: Icons-only switch between List and Table views

## Types

### Core Types
- `SafeHavenProject`: Main project interface with Safe Haven Defense specific fields
- `ProjectCrewMember`: Crew member with avatar and role information
- `ProjectListItem`: Extended project type for list views with calculated properties
- `ProjectFilters`: Simplified filtering options (status only)
- `ProjectSortOptions`: Sorting configuration
- `ProjectViewMode`: View mode (list/table)

### Status System
- `ProjectStage`: The 5-stage lifecycle
- `ProjectStatus`: Same as stages for this implementation
- `PROJECT_STATUS_COLORS`: Updated color mapping for compact badges
- `PROJECT_STATUS_DESCRIPTIONS`: Status abbreviations

## Usage

### Basic Implementation
```typescript
import { ProjectListPage } from './features/project';

// Use the complete project list page
<ProjectListPage />
```

### Individual Components
```typescript
import { 
  ProjectListView, 
  ProjectTableView, 
  ProjectFiltersComponent,
  ProjectDetailsPlaceholder 
} from './features/project';

// Use individual components
<ProjectListView 
  projects={projects} 
  onProjectClick={handleProjectClick} 
/>
```

### Utilities
```typescript
import { 
  projectToListItem, 
  filterProjects, 
  sortProjects,
  getProjectStatusColor,
  formatProjectDuration 
} from './features/project';

// Convert project to list item
const listItem = projectToListItem(project);

// Filter projects
const filtered = filterProjects(projects, {
  status: ['WIP', 'UB'],
  location: ['Seattle, WA'],
  searchQuery: 'security'
});

// Sort projects
const sorted = sortProjects(projects, 'startDate', 'asc');

// Get status colors
const colorClass = getProjectStatusColor('WIP'); // 'bg-green-100 text-green-800'

// Format duration
const duration = formatProjectDuration('2024-01-01', '2024-01-15'); // '2 weeks'
```

## Mock Data

The module includes comprehensive mock data for Safe Haven Defense projects:
- 5 sample projects across different stages
- Realistic crew assignments with roles
- Trailer assignments
- Various locations in Washington state
- Different project types (office, residential, government, retail, school)

## Integration

This module integrates with:
- **Router**: Accessible via `/projects` route
- **Breadcrumb Context**: Automatic breadcrumb management
- **Common Components**: Uses shared Button, Card, and other UI components
- **Global Types**: Extends base Project type with Safe Haven Defense specific fields

## Future Enhancements

The module is designed for easy extension:
- **Project Details**: Full project management interface
- **Crew Management**: Add/edit crew assignments
- **Trailer Management**: Assign and track trailers
- **Timeline Management**: Gantt charts and scheduling
- **Reporting**: Project analytics and reporting
- **API Integration**: Connect to backend services

## Design Principles

- **Safe Haven Defense Focused**: Tailored specifically for security film installation projects
- **Clean Architecture**: Modular, maintainable code structure
- **User Experience**: Intuitive filtering, sorting, and navigation
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Efficient filtering and rendering
