# Project Management App - Codebase Index

## 📋 Project Overview

**Project Management App** is a modern React/TypeScript web application for project preparation and management, built for SafeHavenDefense with focus on team coordination, trailer management, and logistics planning.

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Build**: Webpack 5 + esbuild-loader
- **Package Manager**: Yarn 4.1.1
- **Node**: 22+
- **Icons**: Lucide React
- **Testing**: Jest + Testing Library

## 🏗️ Architecture

### Directory Structure
```
src/
├── common/components/     # Shared UI components
├── features/             # Feature modules
│   ├── project/         # Project management
│   └── trailer/         # Trailer management
├── pages/               # Main application pages
├── components/          # App-level components
├── contexts/            # React contexts
├── router/              # React Router config
├── types/               # TypeScript definitions
└── styles/              # Global styles
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

### Project Features (`/features/project/`)
- **ProjectDashboard** - Main project overview
- **ProjectPreparation** - Preparation workflow
- **Checklist** - Interactive task management
- **TeamAssignment** - Team member assignment
- **TrailerAssignment** - Equipment allocation
- **Logistics** - Planning and scheduling
- **Travel** - Travel planning
- **DocumentsNotes** - File upload + notes

### Trailer Features (`/features/trailer/`)
- **TrailerList** - Search and filtering
- **TrailerDetail** - Inventory + activity logs
- **CreateTrailerModal** - New trailer form
- **EditTrailerSidePanel** - Editing interface

### Pages (`/pages/`)
- **Dashboard** - Stats + activities + quick actions
- **Login** - Authentication + demo personas
- **ProjectList** - Grid/table view with filters
- **Team** - Team management
- **Trailers** - Trailer management
- **Scheduler** - Calendar interface

## 🔐 Authentication & Permissions

### Auth Context
- **Demo Personas**: admin, project-manager, crew-member
- **Permissions**: view, edit, manage per module
- **Modules**: dashboard, projects, team, trailers, scheduler, documents, settings

### Role-Based Access
- **Admin**: Full system access
- **Project Manager**: Project + team management
- **Crew Member**: View-only access

## 📊 Data Models

### Core Types
- **Project** - Status, stage, dates, assignments
- **TeamMember** - Availability, productivity, roles
- **Trailer** - Inventory, status, activity logs
- **ChecklistItem** - Tasks with completion status
- **Document** - File management with labels
- **Note** - Text notes with timestamps
- **TravelPlan** - Travel arrangements

### Status Types
- **ProjectStatus**: UB | WB | WIP | completed | on-hold
- **ProjectStage**: preparation | execution | completion
- **TrailerStatus**: available | low | unavailable
- **MemberStatus**: available | busy | unavailable

## 🚀 Key Features

### Project Management
- Project lifecycle (preparation → execution → completion)
- Interactive checklists with real-time updates
- Team assignment with availability tracking
- Trailer/equipment allocation with inventory
- Document management with drag-and-drop
- Travel planning and logistics
- Progress tracking and status management

### Trailer Management
- Inventory tracking for 8 fixed film types
- Status calculation based on stock levels
- Activity logging for audit trails
- Search and filtering capabilities
- CRUD operations with validation

### UI/UX Features
- Responsive design with mobile support
- Role-based navigation and permissions
- Breadcrumb navigation with auto-generation
- Modal and side panel interfaces
- Consistent design system

## 🔧 Configuration

### TypeScript
- Target: ES2020
- Strict mode enabled
- Path aliases: `common/*`, `src/*`

### Build System
- Webpack 5 with esbuild-loader
- PostCSS with Tailwind CSS
- Development server with hot reload

### Testing
- Jest with jsdom environment
- Testing Library for React components
- ESLint for code quality

## 📱 Responsive Design

### Breakpoints
- Mobile: Default
- Tablet: md (768px+)
- Desktop: lg (1024px+)
- Large: xl (1280px+)

### Layout Patterns
- Grid layouts for card interfaces
- Flexbox for alignment
- Mobile-first approach

## 🧪 Development

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run lint` - Code linting
- `npm run type-check` - Type checking

### Guidelines
- Component organization in folders
- TypeScript interfaces with JSDoc
- Consistent naming conventions
- Accessibility best practices
- Error handling and loading states

## 📦 Dependencies

### Production
- React 18, React Router DOM 6
- Lucide React, Immutable

### Development
- TypeScript 5, Webpack 5
- Tailwind CSS 3, Jest 29
- ESLint, PostCSS

---

*Comprehensive codebase index for the Project Management App - use as reference for understanding application structure and development patterns.*