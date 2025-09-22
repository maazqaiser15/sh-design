# Breadcrumb Navigation System

A comprehensive breadcrumb navigation system for the Project Management App that provides clear navigation paths and improves user experience.

## 🧭 Features

### Core Functionality
- **Automatic Generation**: Auto-generates breadcrumbs from URL paths
- **Custom Breadcrumbs**: Support for custom breadcrumb items
- **Icon Support**: Optional icons for breadcrumb items
- **Home Integration**: Configurable home/dashboard link
- **Context Management**: Global state management for breadcrumbs
- **Responsive Design**: Mobile-friendly breadcrumb display

### Design System Compliance
- **SF Pro Display** font family
- **2px spacing grid** with consistent gaps
- **Primary color** (#043A65) for links
- **Gray color scheme** for inactive items
- **Hover effects** with smooth transitions

## 🏗️ Architecture

### Components

#### Breadcrumb Component
```tsx
<Breadcrumb 
  items={customItems}        // Optional custom items
  showHome={true}           // Show dashboard link
  className="custom-class"  // Additional styling
/>
```

#### BreadcrumbProvider Context
```tsx
<BreadcrumbProvider>
  {/* Your app components */}
</BreadcrumbProvider>
```

### Hooks

#### useSetBreadcrumbs
```tsx
const MyComponent = () => {
  useSetBreadcrumbs([
    { label: 'Projects', href: '/projects', icon: FolderOpen },
    { label: 'Project Details' }
  ], [dependency]);
  
  return <div>...</div>;
};
```

#### useBreadcrumbs
```tsx
const breadcrumbs = useBreadcrumbs(customItems);
```

## 📋 Usage Examples

### 1. Automatic Breadcrumbs
The system automatically generates breadcrumbs from the URL:

- `/projects` → Dashboard > Projects
- `/projects/preparation` → Dashboard > Preparation Projects  
- `/trailers` → Dashboard > Trailers
- `/projects/123` → Dashboard > Projects > Project 123...

### 2. Custom Breadcrumbs
For complex navigation or specific naming:

```tsx
import { useSetBreadcrumbs } from '../../../contexts/BreadcrumbContext';
import { FolderOpen } from 'lucide-react';

const ProjectDetail = ({ project }) => {
  useSetBreadcrumbs([
    { label: 'Projects', href: '/projects', icon: FolderOpen },
    { label: project.title }
  ], [project.title]);

  return <div>...</div>;
};
```

### 3. Dynamic Breadcrumbs
For navigation that changes based on state:

```tsx
const TrailerManagement = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  useSetBreadcrumbs(
    viewMode === 'detail' && selectedTrailer 
      ? [
          { label: 'Trailers', href: '/trailers', icon: Truck },
          { label: `Trailer ${selectedTrailer.number}` }
        ]
      : [{ label: 'Trailers', icon: Truck }],
    [viewMode, selectedTrailer]
  );

  return <div>...</div>;
};
```

## 🎨 Styling

### CSS Classes
The breadcrumb uses consistent styling:

```css
/* Navigation container */
.breadcrumb-nav {
  @apply flex items-center space-x-1 text-sm;
}

/* Breadcrumb links */
.breadcrumb-link {
  @apply flex items-center text-gray-600 hover:text-primary transition-colors;
}

/* Current page */
.breadcrumb-current {
  @apply flex items-center text-gray-900 font-medium;
}

/* Separators */
.breadcrumb-separator {
  @apply text-gray-400 mx-2;
}
```

### Design Tokens
- **Font Size**: 14px (text-sm)
- **Colors**: 
  - Links: gray-600 → primary on hover
  - Current: gray-900 (font-medium)
  - Separators: gray-400
- **Spacing**: 4px between items, 8px around separators
- **Icons**: 16px size with 8px right margin

## 📱 Responsive Behavior

### Mobile (< 768px)
- Breadcrumbs stack vertically if needed
- Icons remain visible for better recognition
- Touch-friendly link targets (44px minimum)

### Tablet (768px - 1024px)
- Full horizontal breadcrumb display
- Abbreviated long text with ellipsis

### Desktop (> 1024px)
- Full breadcrumb display
- Hover effects and transitions

## 🔧 Configuration

### Route Mapping
The system includes intelligent route mapping:

```typescript
const routeLabels: Record<string, string> = {
  'projects': 'Projects',
  'preparation': 'Preparation',
  'execution': 'Execution', 
  'completion': 'Completion',
  'team': 'Team',
  'trailers': 'Trailers',
  'scheduler': 'Scheduler',
  'documents': 'Documents',
  'settings': 'Settings',
};
```

### ID Recognition
Automatically detects and formats IDs:
- UUIDs: `Project abc12345...`
- Short IDs: Display as-is
- Trailer numbers: `Trailer TRL001`

## 🚀 Integration

### 1. Add to Layout
Already integrated in the main Layout component:

```tsx
<div className="bg-white border-b border-gray-200 px-8 py-3">
  <Breadcrumb items={customBreadcrumbs} />
</div>
```

### 2. Context Provider
Wrapped in App.tsx:

```tsx
<BreadcrumbProvider>
  <Routes>
    {/* Your routes */}
  </Routes>
</BreadcrumbProvider>
```

### 3. Page Implementation
Add to any page component:

```tsx
import { useSetBreadcrumbs } from '../../contexts/BreadcrumbContext';

const MyPage = () => {
  useSetBreadcrumbs([
    { label: 'Custom Path', href: '/custom', icon: MyIcon },
    { label: 'Current Page' }
  ]);

  return <div>...</div>;
};
```

## 🧪 Testing

### Unit Tests
```tsx
describe('Breadcrumb', () => {
  it('renders automatic breadcrumbs', () => {
    // Test automatic generation
  });

  it('renders custom breadcrumbs', () => {
    // Test custom items
  });

  it('handles navigation clicks', () => {
    // Test link functionality
  });
});
```

### Integration Tests
- Navigation flow testing
- Context state management
- Route change handling
- Mobile responsiveness

## 📈 Performance

### Optimizations
- Memoized breadcrumb generation
- Efficient context updates
- Minimal re-renders
- Lazy icon loading

### Bundle Impact
- ~2KB gzipped for breadcrumb system
- No external dependencies
- Tree-shakeable exports

## 🔮 Future Enhancements

### Potential Features
- Breadcrumb dropdown for long paths
- Keyboard navigation support
- Breadcrumb analytics tracking
- Custom separator options
- Theme customization
- RTL language support

### Accessibility Improvements
- ARIA landmarks
- Screen reader optimizations
- High contrast mode support
- Focus management

## 🐛 Troubleshooting

### Common Issues

1. **Breadcrumbs not updating**
   - Ensure BreadcrumbProvider wraps your app
   - Check dependency array in useSetBreadcrumbs

2. **Icons not showing**
   - Verify icon import
   - Check icon component props

3. **Styling issues**
   - Confirm Tailwind classes are available
   - Check for CSS conflicts

### Debug Mode
Enable debug logging:

```tsx
// In development
const DEBUG_BREADCRUMBS = process.env.NODE_ENV === 'development';
```

## 📄 License

Part of the Project Management App - follows the same licensing terms.
