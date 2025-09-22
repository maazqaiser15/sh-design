# Project Management App

A modern, responsive web application for project preparation and management built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Modules
- **Project Details** - Title, description, status, and key dates
- **Interactive Checklist** - Task management with inline editing and progress tracking
- **Team Assignment** - Searchable modal for assigning team members (12-15 members)
- **Trailer Assignment** - Equipment allocation with status tracking (6-8 trailers)
- **Logistics** - Scheduling and planning with expandable cards
- **Travel Plans** - Transportation and accommodation management
- **Documents & Notes** - File upload with drag-and-drop and inline note editing

### Design System
- **Typography**: SF Pro Display font family
- **Colors**: Custom primary (#043A65) with teal and amber accents
- **Components**: Reusable buttons, cards, modals, and status badges
- **Layout**: Minimal scrolling with collapsible sections

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Webpack 5 with esbuild-loader
- **Icons**: Lucide React
- **Testing**: Jest with jsdom environment
- **Package Manager**: NPM (Yarn 4.1.1 configured)
- **Node Version**: 22+

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── common/                 # Shared components and utilities
│   └── components/
│       ├── Button/
│       ├── Card/
│       ├── Header/
│       ├── Layout/
│       ├── Modal/
│       └── StatusBadge/
├── features/               # Feature-based modules
│   └── project/
│       ├── components/
│       │   ├── Checklist/
│       │   ├── DocumentsNotes/
│       │   ├── Logistics/
│       │   ├── ProjectDetails/
│       │   ├── TeamAssignment/
│       │   ├── TrailerAssignment/
│       │   └── Travel/
│       └── pages/
│           └── ProjectDashboard/
├── styles/                 # Global styles
├── types/                  # TypeScript type definitions
├── App.tsx
└── index.tsx
```

## 🎨 Design System

### Typography
- **Base**: 14px
- **H1**: 24px / semibold
- **H2**: 20px / semibold
- **H3**: 18px / medium
- **Body**: 14px regular
- **Caption**: 12px

### Colors
- **Primary**: #043A65
- **Secondary**: teal-500, amber-500
- **Background**: gray-50
- **Surface**: white with shadow-sm
- **Text**: gray-900 (primary), gray-600 (secondary)

### Spacing (2px grid system)
- **Page padding**: 28-32px
- **Section spacing**: 24px
- **Component gaps**: 16-20px
- **Card padding**: 16px

## 🧪 Testing

Run tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

## 🔧 Development

### Path Aliases
- `common/*` → `src/common/*`
- `src/*` → `src/*`

### Component Guidelines
- Each component in its own folder with `index.tsx` and `index.test.tsx`
- Use TypeScript interfaces with JSDoc for props
- Implement consistent error handling and loading states
- Follow accessibility best practices

### Code Quality
- ESLint for code linting
- TypeScript for type checking
- Consistent naming conventions
- Comprehensive JSDoc documentation

## 📱 Layout Structure

### Top Section
- Project details (left) + Checklist (right)
- Pinned for easy access

### Middle Section
- Team & Trailer Assignment (left)
- Logistics & Travel (right)
- Card-based layout

### Bottom Section
- Documents & Notes
- Full-width layout

## 🚀 Deployment

The app is configured for production deployment with:
- Optimized Webpack build
- Tree-shaking and code splitting
- Production-ready Tailwind CSS
- TypeScript compilation

Build command:
```bash
npm run build
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please contact the development team or create an issue in the repository.
