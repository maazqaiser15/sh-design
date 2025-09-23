# Project Management Components

This directory contains all the components for the project management workflow, designed for SafeHavenDefense security film installation projects. These components are used in both the Project List and Project Details pages.

## Components Overview

### ProjectSummaryCard
**Location**: `ProjectSummaryCard/index.tsx`
**Purpose**: Sticky top card showing project overview
**Features**:
- Project name and VIN code display
- Status badge with color coding (UB, WB, WIP, Completed)
- Location information
- Crew progress with avatars and hover tooltip
- Trailer assignment status or CTA button

### ChecklistSection
**Location**: `ChecklistSection/index.tsx`
**Purpose**: Shows required preparation tasks with checkboxes
**Features**:
- Interactive checklist items
- Progress tracking with visual indicator
- Required vs optional task distinction
- Real-time completion status updates

### AssignTeamCard
**Location**: `AssignTeamCard/index.tsx`
**Purpose**: Card with CTA to assign team members
**Features**:
- Modal with searchable team member table
- Columns: Name, Designation, Status, Location, Phone, Productivity
- Filter options: Recommended (nearby + efficient) / All Members
- Multi-select functionality
- Productivity badges and status indicators

### TrailerInventoryCard
**Location**: `TrailerInventoryCard/index.tsx`
**Purpose**: Card with CTA to assign trailer and manage project inventory
**Features**:
- Modal with trailer list showing inventory
- Search and filter functionality
- Status handling (Available, Unavailable, Low Stock)
- Project film requirements comparison
- House manager notifications for low stock

### TravelCard
**Location**: `TravelCard/index.tsx`
**Purpose**: Card with checkboxes and conditional fields for travel planning
**Features**:
- Hotel booking checkbox with manager notification
- Travel requirement checkbox with conditional fields
- Travel method selection (Air/Road)
- Number of people selection
- Toast notifications for manager notifications
- Status summary display

### DocumentsNotesCard
**Location**: `DocumentsNotesCard/index.tsx`
**Purpose**: Card for uploading documents and managing notes
**Features**:
- Drag-and-drop file upload
- Document label selection (Site Map, Contract, Excel Sheet, etc.)
- File type validation and size display
- Notes with timestamped history
- Tabbed interface for documents and notes
- File and note deletion functionality

## Usage

### Basic Implementation
```tsx
import { ProjectDetailsPage } from '../pages/ProjectDetailsPage';

// Use in routing
<Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
```

### Individual Components
```tsx
import { ProjectSummaryCard } from './ProjectSummaryCard';
import { ChecklistSection } from './ChecklistSection';
// ... other imports

// Use individual components as needed
<ProjectSummaryCard 
  data={preparationData} 
  onAssignTrailer={handleAssignTrailer} 
/>
```

## Data Flow

1. **ProjectDetailsPage** manages the overall state for individual projects
2. **ProjectSummaryCard** displays project overview and handles trailer assignment
3. **ChecklistSection** tracks preparation task completion (for preparation stage projects)
4. **Action Cards** (Team, Trailer, Travel, Documents) handle specific preparation tasks
5. All components update the central state through callback functions
6. **TrailerInventoryCard** handles trailer assignment and inventory management

## Styling

All components use Tailwind CSS classes and follow the established design system:
- Consistent spacing using the 2px grid system
- Color-coded status indicators
- Hover states and transitions
- Responsive design for different screen sizes
- Accessibility features (focus management, keyboard navigation)

## Testing

Each component includes comprehensive tests covering:
- Rendering with different data states
- User interactions (clicks, form submissions)
- Callback function execution
- Error handling
- Accessibility features

Run tests with:
```bash
npm test -- --testPathPattern="ProjectPreparation"
```

## Mock Data

The components use mock data defined in `types/preparation.ts` for development and testing. In production, this would be replaced with real API calls.

## Future Enhancements

- Real-time collaboration features
- Advanced filtering and search
- Bulk operations
- Export functionality
- Integration with external systems
- Mobile-optimized interface
