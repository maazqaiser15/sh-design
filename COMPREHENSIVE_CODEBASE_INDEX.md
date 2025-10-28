# Project Management App - Comprehensive Codebase Index

## 📋 Project Overview

**SafeHavenDefense Project Management App** is a modern React/TypeScript web application for project preparation and management, specifically designed for security film installation projects. The application features comprehensive project lifecycle management, team coordination, trailer management, and logistics planning.

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Build**: Webpack 5 + esbuild-loader
- **Package Manager**: Yarn 4.1.1
- **Node**: 22+
- **Icons**: Lucide React
- **Testing**: Jest + Testing Library
- **Routing**: React Router DOM 6

## 🏗️ Architecture

### Directory Structure
```
src/
├── common/components/     # Shared UI components
│   ├── Breadcrumb/       # Navigation breadcrumbs
│   ├── Button/           # Reusable button component
│   ├── Card/             # Container components
│   ├── CollapsibleSidePanel/ # Expandable side panels
│   ├── Header/           # Page headers
│   ├── Layout/           # Main layout wrapper
│   ├── Logo/             # SafeHavenDefense branding
│   ├── Modal/            # Modal dialogs
│   ├── NotificationsOverlay/ # Toast notifications
│   ├── Sidebar/          # Main navigation
│   ├── SidePanel/        # Sliding panels
│   ├── StatusBadge/      # Status indicators
│   ├── Toast/            # Notification toasts
│   └── TopBar/           # Top navigation bar
├── features/             # Feature modules
│   ├── project/          # Project management
│   │   ├── components/   # Project-specific components
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Project pages
│   │   ├── types/        # TypeScript definitions
│   │   └── utils/        # Utility functions
│   ├── teamGantt/        # Team Gantt chart
│   └── trailer/          # Trailer management
├── pages/                # Main application pages
│   ├── Dashboard/        # Main dashboard
│   ├── Login/            # Authentication
│   ├── Projects/         # Project listing
│   ├── Team/             # Team management
│   ├── Trailers/         # Trailer management
│   └── TeamGanttChart/   # Gantt chart view
├── components/           # App-level components
│   ├── Calendar/         # Calendar components
│   ├── ErrorBoundary/    # Error handling
│   ├── ProtectedLayout/  # Protected route layout
│   └── ProtectedRoute/   # Route protection
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   ├── BreadcrumbContext.tsx # Breadcrumb state
│   ├── SidebarContext.tsx # Sidebar state
│   └── ToastContext.tsx  # Toast notifications
├── router/               # React Router config
├── types/                # TypeScript definitions
└── styles/               # Global styles
```

## 🎨 Design System

### Typography & Colors
- **Font**: SF Pro Display
- **Primary**: #043A65 (dark blue)
- **Secondary**: Teal (#14b8a6), Amber (#f59e0b)
- **Spacing**: 2px grid system

### Component Hierarchy
- **Layout**: Sidebar + TopBar + Breadcrumb + Content
- **Navigation**: Role-based with permissions
- **Modals**: Size variants (sm, md, lg, xl)
- **Cards**: Consistent styling with hover effects

## 📁 Key Components

### Common Components (`/common/components/`)
- **Button** - Variants: primary, secondary, ghost
- **Card** - Container with consistent styling
- **Modal** - Overlay with escape key handling
- **StatusBadge** - Color-coded status indicators
- **SidePanel** - Sliding panel for details
- **Breadcrumb** - Auto-generation + custom support
- **Sidebar** - Main navigation with role-based access
- **Layout** - Main app structure wrapper
- **TopBar** - Global search, notifications, user profile
- **Toast** - Notification system
- **Logo** - SafeHavenDefense branding

### Project Features (`/features/project/`)
- **ProjectDashboard** - Main project overview
- **ProjectPreparation** - Preparation workflow
- **Checklist** - Interactive task management
- **TeamAssignment** - Team member assignment
- **TrailerAssignment** - Equipment allocation
- **Logistics** - Planning and scheduling
- **Travel** - Travel planning
- **DocumentsNotes** - File upload + notes
- **ProjectCard** - Project summary cards
- **ProjectHeader** - Project information display
- **ProjectGanttView** - Gantt chart visualization
- **ProjectDateSetup** - Date configuration
- **AssignedTeamCard** - Team assignment interface
- **TravelAccommodationCard** - Travel planning
- **ProjectOverviewCard** - Project summary

### Trailer Features (`/features/trailer/`)
- **TrailerList** - Search and filtering
- **TrailerDetail** - Inventory + activity logs
- **CreateTrailerModal** - New trailer form
- **EditTrailerSidePanel** - Editing interface

### Team Gantt Features (`/features/teamGantt/`)
- **TeamGantt** - Main Gantt chart component
- **TeamGanttWithViews** - View management
- **ProjectBar** - Project timeline bars
- **ProjectRow** - Project row display
- **TeamRow** - Team member rows
- **TrailerRow** - Trailer assignment rows
- **TimelineHeader** - Timeline navigation

### Pages (`/pages/`)
- **Dashboard** - Stats + activities + quick actions
- **Login** - Authentication + demo personas
- **ProjectList** - Grid/table view with filters
- **Team** - Team management
- **Trailers** - Trailer management
- **TeamGanttChart** - Gantt chart interface
- **ProjectDateSetupDemo** - Date setup demonstration

## 🔐 Authentication & Permissions

### Auth Context
- **Demo Personas**: admin, project-manager, crew-member
- **Permissions**: view, edit, manage per module
- **Modules**: dashboard, projects, team, trailers, scheduler, documents, settings

### Role-Based Access
- **Admin**: Full system access
- **Project Manager**: Project + team management
- **Crew Member**: View-only access

### Authentication Features
- **Login Screen**: SafeHavenDefense branding
- **Email/Password**: Standard authentication
- **Demo Login**: Pre-configured personas
- **Remember Me**: Persistent sessions
- **Protected Routes**: Role-based access control
- **Session Management**: Secure token handling

## 📊 Data Models

### Core Types
- **Project** - Status, stage, dates, assignments
- **TeamMember** - Availability, productivity, roles
- **Trailer** - Inventory, status, activity logs
- **ChecklistItem** - Tasks with completion status
- **Document** - File management with labels
- **Note** - Text notes with timestamps
- **TravelPlan** - Travel arrangements
- **CalendarEvent** - Scheduling events
- **User** - User account information
- **UserRole** - Role definitions

### Status Types
- **ProjectStatus**: D75 | PV90 | UB | WB | WIP | QF | Completed | on-hold
- **ProjectStage**: preparation | execution | completion
- **TrailerStatus**: available | low | unavailable
- **MemberStatus**: available | busy | unavailable

### Project-Specific Types
- **SafeHavenProject** - Extended project with VIN codes
- **ProjectCrewMember** - Team member assignments
- **AssignedTrailer** - Trailer assignments
- **PreparationChecklistItem** - Task management
- **TravelPlanDetails** - Travel arrangements
- **Window** - Window installation tracking
- **LayerInstallation** - Film layer management

## 🚀 Key Features

### Project Management
- **Project Lifecycle**: D75 → PV90 → UB → WB → WIP → QF → Completed
- **Interactive Checklists**: Real-time task management
- **Team Assignment**: Availability tracking and productivity metrics
- **Trailer/Equipment Allocation**: Inventory management
- **Document Management**: Drag-and-drop file handling
- **Travel Planning**: Transportation and accommodation
- **Progress Tracking**: Visual status indicators
- **Date Setup**: Project timeline configuration
- **Gantt Charts**: Visual project scheduling

### Trailer Management
- **Inventory Tracking**: 8 fixed film types
- **Status Calculation**: Based on stock levels
- **Activity Logging**: Audit trails
- **Search and Filtering**: Advanced query capabilities
- **CRUD Operations**: Full trailer lifecycle management
- **Stock Alerts**: Low inventory notifications

### Team Management
- **Gantt Visualization**: Team workload and availability
- **Productivity Tracking**: Performance metrics
- **Assignment Management**: Project team allocation
- **Availability Status**: Real-time team status
- **Role-Based Access**: Permission management

### UI/UX Features
- **Responsive Design**: Mobile-first approach
- **Role-Based Navigation**: Dynamic menu generation
- **Breadcrumb Navigation**: Auto-generation with custom support
- **Modal and Side Panel**: Flexible interface patterns
- **Consistent Design System**: Unified visual language
- **Toast Notifications**: User feedback system
- **Loading States**: Smooth user experience
- **Error Handling**: Graceful error management

## 🔧 Configuration

### TypeScript
- **Target**: ES2020
- **Strict Mode**: Enabled
- **Path Aliases**: `common/*`, `src/*`
- **Type Checking**: Comprehensive interface definitions

### Build System
- **Webpack 5**: With esbuild-loader for fast builds
- **PostCSS**: With Tailwind CSS integration
- **Development Server**: Hot reload with webpack-dev-server
- **Production Build**: Optimized bundle with tree-shaking

### Testing
- **Jest**: With jsdom environment
- **Testing Library**: React component testing
- **ESLint**: Code quality enforcement
- **Type Checking**: TypeScript compilation

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Default (320px+)
- **Tablet**: md (768px+)
- **Desktop**: lg (1024px+)
- **Large**: xl (1280px+)

### Layout Patterns
- **Grid Layouts**: For card interfaces
- **Flexbox**: For alignment and spacing
- **Mobile-First**: Progressive enhancement approach
- **Collapsible Sections**: Space-efficient design

## 🧪 Development

### Scripts
- `npm run dev` - Development server (port 3000)
- `npm run start` - Alternative dev server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run test:watch` - Watch mode testing
- `npm run lint` - Code linting
- `npm run type-check` - Type checking

### Guidelines
- **Component Organization**: Folder-based structure
- **TypeScript Interfaces**: Comprehensive JSDoc documentation
- **Naming Conventions**: Consistent camelCase/PascalCase
- **Accessibility**: ARIA labels and keyboard navigation
- **Error Handling**: Graceful degradation
- **Loading States**: User feedback during operations

## 📦 Dependencies

### Production
- **React 18**: Core framework
- **React Router DOM 6**: Client-side routing
- **Lucide React**: Icon library
- **Immutable**: Immutable data structures

### Development
- **TypeScript 5**: Type system
- **Webpack 5**: Build tooling
- **Tailwind CSS 3**: Styling framework
- **Jest 29**: Testing framework
- **ESLint**: Code linting
- **PostCSS**: CSS processing

## 🌐 Application Structure

### Main Routes
- `/` - Dashboard (protected)
- `/login` - Authentication
- `/projects` - Project listing
- `/projects/:id` - Project details
- `/team` - Team management
- `/trailers` - Trailer management
- `/team-gantt` - Gantt chart view
- `/project-date-setup-demo` - Date setup demo

### Navigation Structure
- **Sidebar**: Module-based navigation
- **TopBar**: Global actions and user menu
- **Breadcrumbs**: Contextual navigation
- **Quick Actions**: Prominent action buttons

## 🎯 Business Logic

### Project Workflow
1. **D75/PV90**: Pre-validation stages
2. **UB**: Upcoming/Backlog (approved, not started)
3. **WB**: Work-Bound (ready to start, planned)
4. **WIP**: Work In Progress (execution ongoing)
5. **QF**: Quality Finalization
6. **Completed**: Project finished

### Team Assignment Logic
- **Availability Checking**: Real-time status
- **Productivity Metrics**: Performance tracking
- **Location-Based**: Geographic assignment
- **Skill Matching**: Role-based assignment

### Trailer Management Logic
- **Stock Calculation**: Real-time inventory
- **Status Determination**: Available/Low/Unavailable
- **Assignment Tracking**: Project allocation
- **Maintenance Scheduling**: Service management

## 🔍 Search and Filtering

### Project Filtering
- **Status**: Multi-select status filtering
- **Location**: Geographic filtering
- **Team**: Team member assignment
- **Trailer**: Equipment assignment
- **Date Range**: Timeline filtering
- **Search**: Full-text search

### Trailer Filtering
- **Status**: Availability filtering
- **Type**: Equipment type filtering
- **Location**: Geographic filtering
- **Stock Level**: Inventory filtering

## 📈 Performance Optimizations

### Build Optimizations
- **Code Splitting**: Route-based splitting
- **Tree Shaking**: Dead code elimination
- **Bundle Analysis**: Size monitoring
- **Lazy Loading**: Component-level lazy loading

### Runtime Optimizations
- **Memoization**: React.memo usage
- **Context Optimization**: Selective context updates
- **Virtual Scrolling**: Large list handling
- **Image Optimization**: Lazy loading images

---

*Comprehensive codebase index for the SafeHavenDefense Project Management App - complete reference for understanding application structure, features, and development patterns.*

