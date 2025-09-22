# Trailer Management Module

A comprehensive trailer management system built with React, TypeScript, and TailwindCSS following the project's design system.

## 🚛 Features

### Core Functionality
- **CRUD Operations**: Create, read, update, and delete trailers
- **Inventory Management**: Track 8 fixed film types with current stock and thresholds
- **Status Calculation**: Auto-calculated status based on inventory levels
- **Activity Logging**: System-generated and user-input activity logs
- **Search & Filter**: Filter by status, location, and search terms
- **Multiple Views**: Card view and table view for trailer listing

### Status Logic
- **Available**: All inventory items above threshold
- **Low**: One or more items at or below threshold
- **Unavailable**: One or more items with zero stock

### Film Types (Fixed)
1. Protective Film A
2. Protective Film B
3. Adhesive Film X
4. Adhesive Film Y
5. Transparent Film
6. Matte Film
7. Specialty Film 1
8. Specialty Film 2

## 🏗️ Architecture

### Components

#### TrailerList
- **Location**: `components/TrailerList/index.tsx`
- **Purpose**: Main listing component with card and table views
- **Features**: 
  - Search and filtering
  - Sorting capabilities
  - View mode toggle
  - Responsive design

#### TrailerDetail
- **Location**: `components/TrailerDetail/index.tsx`
- **Purpose**: Detailed view of a single trailer
- **Features**:
  - Basic information display
  - Inventory overview with statistics
  - Detailed inventory table with progress bars
  - Activity log timeline

#### CreateTrailerModal
- **Location**: `components/CreateTrailerModal/index.tsx`
- **Purpose**: Modal for creating new trailers
- **Features**:
  - Two-section form (Basic Info + Inventory)
  - Form validation
  - Duplicate trailer number checking
  - 520px max width with 24px padding

#### EditTrailerSidePanel
- **Location**: `components/EditTrailerSidePanel/index.tsx`
- **Purpose**: Side panel for editing trailer information
- **Features**:
  - Collapsible sections
  - Real-time status preview
  - Current stock and threshold editing
  - Full height with 24px padding

#### DeleteConfirmationModal
- **Location**: `components/DeleteConfirmationModal/index.tsx`
- **Purpose**: Confirmation modal for trailer deletion
- **Features**:
  - Warning display
  - Trailer details summary
  - Safety warnings

### Utils

#### trailerUtils.ts
- **Location**: `utils/trailerUtils.ts`
- **Purpose**: Core business logic and utilities
- **Functions**:
  - Status calculations
  - Form validation
  - Activity log creation
  - Filtering and sorting
  - Data transformations

### Types
All trailer-related types are defined in `src/types/index.ts`:
- `Trailer`: Main trailer interface
- `FilmInventoryItem`: Individual inventory item
- `ActivityLog`: Activity log entry
- `TrailerStatus`: Status enumeration
- `FilmType`: Film type enumeration
- `FilmStockStatus`: Stock status enumeration

## 🎨 Design System Compliance

### Typography
- **SF Pro Display** font family
- Consistent text sizes: H1 (24px), H2 (20px), H3 (18px), Body (14px)
- Font weights: semibold for headers, medium for subheaders

### Spacing
- **2px grid system** throughout
- Page padding: 28-32px
- Section spacing: 24px
- Component gaps: 16-20px
- Card padding: 16px

### Colors
- **Primary**: #043A65
- **Status Colors**: 
  - Green: Available/Good stock
  - Amber: Low stock
  - Red: Unavailable/Critical
- **Pastel badges**: 100-level background colors with 800-level text

### Components
- **Buttons**: 8px vertical / 16px horizontal padding, 6px corner radius
- **Cards**: 16px padding, shadow-sm, rounded-lg
- **Modals**: Clean headers, 24px inner padding
- **Tables**: 12px vertical / 16px horizontal padding, 1px gray-200 borders

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Single column layouts
- **Tablet**: 2-column card grids
- **Desktop**: 3-column card grids, full table views

### Mobile Optimizations
- Touch-friendly button sizes
- Scrollable tables
- Collapsible sections in side panels
- Full-width modals on small screens

## 🔧 Usage

### Basic Implementation
```tsx
import { Trailers } from './pages/Trailers';

// In your router
<Route path="/trailers" element={<Trailers />} />
```

### Individual Components
```tsx
import { 
  TrailerList, 
  TrailerDetail, 
  CreateTrailerModal 
} from './features/trailer';

// Use components individually
<TrailerList
  trailers={trailers}
  onCreateTrailer={handleCreate}
  onViewTrailer={handleView}
  onEditTrailer={handleEdit}
  onDeleteTrailer={handleDelete}
/>
```

### Utility Functions
```tsx
import { 
  calculateTrailerStatus,
  validateTrailerForm,
  filterTrailers 
} from './features/trailer/utils/trailerUtils';

// Calculate status
const status = calculateTrailerStatus(inventory);

// Validate form
const { isValid, errors } = validateTrailerForm(formData);

// Filter trailers
const filtered = filterTrailers(trailers, { status: 'available' });
```

## 📊 Data Flow

### State Management
- Local state management using React hooks
- Optimistic updates for better UX
- Form validation with real-time feedback

### Activity Logging
- System-generated logs for status changes
- User-generated logs for manual updates
- Timestamp tracking for all activities

### Status Calculation
- Real-time status calculation based on inventory
- Automatic updates when thresholds change
- Visual indicators for stock levels

## 🧪 Testing Considerations

### Component Testing
- Form validation scenarios
- Status calculation logic
- User interaction flows
- Responsive behavior

### Integration Testing
- CRUD operations
- Modal and panel interactions
- Search and filter functionality

### Data Testing
- Status calculation accuracy
- Form validation coverage
- Activity log generation

## 🚀 Performance

### Optimizations
- Memoized calculations
- Efficient filtering and sorting
- Lazy loading for large lists
- Debounced search inputs

### Bundle Size
- Tree-shakeable exports
- Minimal dependencies
- Optimized component structure

## 🔮 Future Enhancements

### Potential Features
- Bulk operations (import/export)
- Advanced reporting and analytics
- Integration with project assignments
- Real-time inventory tracking
- Mobile app support
- Barcode scanning
- Automated reordering alerts

### Technical Improvements
- API integration
- Offline support
- Real-time updates via WebSocket
- Advanced caching strategies
- Performance monitoring

## 📄 License

This module is part of the Project Management App and follows the same licensing terms.
