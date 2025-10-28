# Project Date Setup Modal

This component provides a modal interface for setting up project dates when clicking on projects with specific statuses (D75, PV90, UB, WB).

## Features

- Modal popup for projects with D75, PV90, UB, WB statuses
- Date validation (start date must be before end date)
- Automatic navigation to project details after date setup
- Clean, accessible UI with proper error handling

## Usage

### Basic Usage

```tsx
import { ProjectDateSetupModal } from './ProjectDateSetupModal';
import { useProjectDateSetup } from '../../hooks/useProjectDateSetup';

function MyComponent() {
  const {
    isModalOpen,
    selectedProject,
    openDateSetupModal,
    closeDateSetupModal,
    handleDateSetup,
  } = useProjectDateSetup();

  const handleProjectClick = (project) => {
    if (requiresDateSetup(project.status)) {
      openDateSetupModal(project.id, project.name, project.status);
    }
  };

  return (
    <>
      {/* Your project list/table components */}
      
      <ProjectDateSetupModal
        isOpen={isModalOpen}
        onClose={closeDateSetupModal}
        onSave={handleDateSetup}
        projectName={selectedProject?.name || ''}
        projectStatus={selectedProject?.status || 'D75'}
      />
    </>
  );
}
```

### Using the Higher-Order Component

```tsx
import { withProjectDateSetup } from './withProjectDateSetup';
import { ProjectListView } from './ProjectListView';

const ProjectListViewWithDateSetup = withProjectDateSetup(ProjectListView);

// Use in your component
<ProjectListViewWithDateSetup onProjectClick={handleProjectClick} />
```

### Using the Wrapper Component

```tsx
import { ProjectListWithDateSetup } from './ProjectListWithDateSetup';
import { ProjectListView } from './ProjectListView';

<ProjectListWithDateSetup onProjectClick={handleProjectClick}>
  <ProjectListView />
</ProjectListWithDateSetup>
```

## Props

### ProjectDateSetupModal

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Called when modal is closed |
| `onSave` | `(startDate: string, endDate: string) => void` | Called when dates are saved |
| `projectName` | `string` | Name of the project |
| `projectStatus` | `'D75' \| 'PV90' \| 'UB' \| 'WB'` | Status of the project |

### useProjectDateSetup Hook

Returns an object with:

- `isModalOpen`: boolean - Modal visibility state
- `selectedProject`: object - Currently selected project info
- `openDateSetupModal`: function - Opens modal with project data
- `closeDateSetupModal`: function - Closes modal
- `handleDateSetup`: function - Handles date saving and navigation

## Project Statuses

The following project statuses trigger the date setup modal:

- **D75**: 75% Complete
- **PV90**: 90% Complete  
- **UB**: Under Budget
- **WB**: Within Budget

## Integration Steps

1. Import the necessary components and hooks
2. Use `requiresDateSetup()` to check if a project needs date setup
3. Call `openDateSetupModal()` for projects that need date setup
4. Handle the modal state and date saving
5. Navigate to project details after successful date setup

## Example Integration

```tsx
// In your project list component
const handleProjectClick = (project) => {
  if (requiresDateSetup(project.status)) {
    openDateSetupModal(project.id, project.name, project.status);
  } else {
    // Navigate directly for other statuses
    navigate(`/projects/${project.id}`);
  }
};
```
