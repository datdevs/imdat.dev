# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an Angular monorepo built with Nx workspace, focusing on an admin panel application. The project uses modern Angular features including standalone components, signals, and TypeScript strict mode.

**Key Technologies:**
- Angular 20+ with standalone components
- Nx monorepo structure
- Taiga UI component library
- NgRx for state management
- Firebase for backend services
- TypeScript with strict mode
- SCSS for styling
- Jest for unit testing
- Playwright for e2e testing

## Common Development Commands

### Building and Serving
```bash
# Serve the admin panel in development mode (port 3001)
npx nx serve admin-panel

# Build the admin panel for production
npx nx build admin-panel

# Build for development (with source maps)
npx nx build admin-panel --configuration=development

# Serve production build statically
npx nx serve-static admin-panel
```

### Testing
```bash
# Run unit tests for admin-panel
npx nx test admin-panel

# Run unit tests with coverage
npx nx test admin-panel --coverage

# Run unit tests in CI mode
npx nx test admin-panel --configuration=ci

# Run e2e tests
npx nx e2e admin-panel-e2e
```

### Linting and Code Quality
```bash
# Lint the admin-panel
npx nx lint admin-panel

# Lint all projects
npx nx run-many -t lint

# Format code with Prettier
npx prettier --write .
```

### Nx Utilities
```bash
# Show project information
npx nx show project admin-panel

# View dependency graph
npx nx graph

# Show all available projects
npx nx show projects

# Generate new Angular component
npx nx g @nx/angular:component my-component --project=admin-panel

# Generate new Angular service
npx nx g @nx/angular:service my-service --project=admin-panel
```

## Architecture Overview

### Monorepo Structure
- **apps/admin-panel/**: Main Angular application
- **apps/admin-panel-e2e/**: End-to-end tests for admin panel
- **libs/**: Shared libraries (none currently, but structure supports them)

### Admin Panel Architecture
The admin panel follows a feature-based architecture with clear separation of concerns:

**Core Structure:**
- **app.component.ts**: Root component using standalone architecture
- **app.config.ts**: Application configuration with providers
- **app.routes.ts**: Route definitions with lazy loading and auth guards

**Key Directories:**
- **components/**: Reusable UI components (loading-overlay, profile-button)
- **layouts/**: Layout components (main layout, grid layout)
- **pages/**: Feature pages (dashboard, portfolio, profile, login, not-found)
- **services/**: Business logic and API services
- **store/**: NgRx state management (user state and effects)
- **types/**: TypeScript type definitions and interfaces
- **utils/**: Utility functions and helpers

### State Management
- Uses NgRx with modern signal-based patterns
- User state management with effects for async operations
- Follows the container/presenter pattern for components

### Authentication & Security
- Firebase Authentication integration
- Route guards for protected routes
- ReCaptcha v3 integration for security
- Automatic redirects for authenticated/unauthenticated users

### UI Framework Integration
- **Taiga UI**: Primary component library with Material Design principles
- **Angular Material**: Used for specific components (icons)
- Custom SCSS styling with Material Typography
- Responsive design patterns

## Development Guidelines

### Angular Best Practices (from .cursor/rules)
- **Standalone Components**: All components use standalone architecture (no NgModules)
- **Signals**: Use Angular signals for reactive state management instead of RxJS Observables where appropriate
- **Modern Syntax**: Use `input()` and `output()` functions instead of `@Input()` and `@Output()` decorators
- **Control Flow**: Use new `@if`, `@for`, `@switch` syntax instead of structural directives
- **Change Detection**: All components use `OnPush` change detection strategy
- **Injection**: Prefer `inject()` function over constructor injection
- **Type Safety**: Strict TypeScript with no `any` types

### Component Architecture
- Components follow single responsibility principle
- Use computed signals for derived state
- Implement reactive patterns with signals and effects
- Lazy load feature modules for performance

### Styling Conventions
- SCSS with modular architecture
- Taiga UI theme integration
- Material Design principles
- Component-scoped styles
- Custom CSS properties for theming

### Testing Strategy
- Unit tests with Jest and Angular Testing Library
- E2E tests with Playwright
- Component testing for UI logic
- Service testing for business logic
- Integration testing for complex workflows

## Firebase Configuration
The app integrates with Firebase services:
- **Authentication**: User login/logout functionality
- **Firestore**: Database for application data
- **App Check**: Security with ReCaptcha v3
- Development and production configurations

## Build Configuration
- **Development**: Source maps enabled, no optimization
- **Production**: Optimized build with bundle budgets
- **Assets**: Taiga UI icons automatically included
- **Styles**: LESS theme files and SCSS application styles
- **Bundle Budgets**: 500KB warning, 1MB error for initial bundle

## Development Server
- Default port: 3001 (configured in project.json)
- Hot reload enabled
- Development configuration with source maps
- Production preview available via serve-static

## Code Generation
Use Nx generators for consistent code structure:
```bash
# Generate new page component
npx nx g @nx/angular:component pages/my-page --project=admin-panel --change-detection=OnPush

# Generate new service
npx nx g @nx/angular:service services/my-service --project=admin-panel

# Generate new guard
npx nx g @nx/angular:guard guards/my-guard --project=admin-panel
```

## Important Notes
- All components use standalone architecture - never add NgModule imports
- Follow the existing folder structure for consistency
- Use Taiga UI components over custom implementations when available
- Implement proper error handling and loading states
- Follow the established naming conventions (kebab-case for files, PascalCase for classes)
- Use TypeScript strict mode - no `any` types allowed
- Implement proper accessibility features
- Follow the security best practices with Firebase integration