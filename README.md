# ImdatDev

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A modern monorepo workspace built with [Nx](https://nx.dev), containing multiple web applications for portfolio management, wedding websites, and landing pages.

## Overview

This repository is an Nx monorepo that houses three main applications:

- **admin-panel**: Angular 21 admin interface for managing portfolios and content
- **wedding**: Next.js 16 wedding website with internationalization support
- **landing-page**: Next.js 16 landing page application

All applications are built with modern web technologies and follow best practices for performance, maintainability, and developer experience.

## Project Structure

### Applications

#### admin-panel

- **Framework**: Angular 21 with standalone components
- **Port**: 3001
- **Purpose**: Admin interface for portfolio and content management
- **Features**:
  - Firebase Authentication with ReCaptcha v3
  - NgRx state management with signals
  - Taiga UI component library
  - Dashboard, Portfolio, and User management pages
  - Protected routes with authentication guards

#### wedding

- **Framework**: Next.js 16 with React 19
- **Port**: 3002
- **Purpose**: Wedding website with multi-language support
- **Features**:
  - Internationalization (i18n) - English and Vietnamese
  - Gallery with image filtering
  - Countdown timer
  - Event details and venue information
  - Responsive design with Tailwind CSS
  - Deployed to Cloudflare

#### landing-page

- **Framework**: Next.js 16 with React 19
- **Purpose**: Landing page application
- **Features**:
  - Modern React components
  - Tailwind CSS styling
  - Deployed to Cloudflare

### Test Projects

Each application has an associated e2e test project:

- `admin-panel-e2e`: Playwright tests for admin panel
- `landing-page-e2e`: Playwright tests for landing page

## Technology Stack

### Frontend Frameworks

- **Angular**: 21.1.2 (standalone components, signals, zoneless change detection)
- **Next.js**: 16.1.6 (App Router, Server Components)
- **React**: 19.2.4

### State Management

- **NgRx**: 21.0.1 (Store, Effects, Signals, Component Store)
- **RxJS**: 7.8.2

### UI Libraries

- **Taiga UI**: 4.68.0 (Angular component library)
- **Tailwind CSS**: 4.1.18
- **Lucide React**: 0.561.0 (Icons)

### Backend & Services

- **Firebase**: 12.8.0
  - Authentication
  - Firestore Database
  - Storage
  - App Check (ReCaptcha v3)

### Build Tools & Development

- **Nx**: 22.4.3 (Monorepo tooling)
- **TypeScript**: 5.9.3 (strict mode)
- **Angular Build**: 21.1.2
- **OpenNext Cloudflare**: 1.16.1 (Next.js deployment)

### Testing

- **Jest**: 30.2.0 (Unit testing)
- **Playwright**: 1.58.0 (E2E testing)
- **Testing Library**: React and DOM testing utilities

### Code Quality

- **ESLint**: 9.39.2 (with Angular, React, Next.js plugins)
- **Prettier**: 3.8.1 (Code formatting)
- **Stylelint**: 17.0.0 (SCSS/CSS linting)

## Getting Started

### Prerequisites

- **Node.js**: 22.x (as specified in CI configuration)
- **npm**: Comes with Node.js
- **Firebase CLI**: For Firebase emulator (optional, for local development)

### Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd imdat.dev
   ```

2. Install dependencies:

   ```sh
   npm ci --legacy-peer-deps
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` (if needed)
   - Configure Firebase credentials (see Firebase Configuration below)

### Firebase Configuration

The admin-panel application requires Firebase configuration. Set up your Firebase project and configure the following environment variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_RECAPTCHA_V3_SITE_KEY`

See `.env.example` for the complete list of required variables.

### Firebase Emulator (Development)

To run Firebase emulators locally:

```sh
npm run emulate
```

This starts Firebase emulators for Auth and Firestore, which the admin-panel connects to automatically in development mode.

## Development Commands

### Running Applications

#### Admin Panel (Angular)

```sh
# Development server (port 3001)
npx nx serve admin-panel

# Production build
npx nx build admin-panel
```

#### Wedding (Next.js)

```sh
# Development server (port 3002)
npx nx dev wedding

# Production build
npx nx build wedding

# Deploy to Cloudflare
npx nx deploy wedding
```

#### Landing Page (Next.js)

```sh
# Development server
npx nx dev landing-page

# Production build
npx nx build landing-page

# Deploy to Cloudflare
npx nx deploy landing-page
```

### Testing

```sh
# Run unit tests for a specific project
npx nx test admin-panel
npx nx test wedding
npx nx test landing-page

# Run tests with coverage
npx nx test admin-panel --coverage

# Run e2e tests
npx nx e2e admin-panel-e2e
npx nx e2e landing-page-e2e

# Run all tests
npx nx run-many -t test
```

### Linting and Code Quality

```sh
# Lint a specific project
npx nx lint admin-panel
npx nx lint wedding
npx nx lint landing-page

# Lint all projects
npx nx run-many -t lint

# Format code with Prettier
npx prettier --write .

# Check code formatting
npx prettier --check .
```

### Nx Utilities

```sh
# Show project information
npx nx show project admin-panel

# View dependency graph
npx nx graph

# Show all available projects
npx nx show projects

# List available generators
npx nx list

# Generate new Angular component
npx nx g @nx/angular:component my-component --project=admin-panel

# Generate new Next.js page
npx nx g @nx/next:page my-page --project=wedding
```

## Architecture Overview

### Monorepo Structure

```
apps/
  ├── admin-panel/          # Angular application
  ├── admin-panel-e2e/       # E2E tests for admin panel
  ├── wedding/               # Next.js wedding website
  ├── landing-page/          # Next.js landing page
  └── landing-page-e2e/      # E2E tests for landing page
```

### Admin Panel Architecture

The admin-panel follows a feature-based architecture with clear separation of concerns:

- **Standalone Components**: All components use Angular's standalone architecture (no NgModules)
- **Signals**: Modern reactive state management with Angular signals
- **NgRx**: State management with Store, Effects, and Component Store
- **Feature-based Structure**:
  - `components/`: Reusable UI components
  - `layouts/`: Layout components (main layout, grid layout)
  - `pages/`: Feature pages (dashboard, portfolio, login, etc.)
  - `services/`: Business logic and API services
  - `store/`: NgRx state management
  - `types/`: TypeScript type definitions

For detailed Angular architecture guidelines, see [WARP.md](WARP.md).

### Next.js Applications Architecture

Both `wedding` and `landing-page` follow Next.js App Router conventions:

- **App Router**: Using the `app/` directory structure
- **Server Components**: Default React Server Components
- **Internationalization**: Wedding app supports multiple languages (en, vi)
- **API Routes**: Server-side API endpoints
- **Static Generation**: Pre-rendered pages where applicable

### State Management

- **Admin Panel**: NgRx with signal-based patterns for reactive state
- **Next.js Apps**: React Server Components and client-side state as needed

### Authentication & Security

- **Firebase Authentication**: User authentication for admin panel
- **Route Guards**: Protected routes with authentication checks
- **ReCaptcha v3**: Bot protection and security
- **App Check**: Firebase App Check integration

## CI/CD

### GitHub Actions

The repository uses GitHub Actions for continuous integration:

- **Workflow**: `.github/workflows/ci.yml`
- **Trigger**: Pushes to `master` branch
- **Builds**: Affected projects (excluding e2e, landing-page, and wedding from main build)
- **Nx Cloud**: Integrated for build caching and task distribution

### Deployment

- **Next.js Apps**: Deployed to Cloudflare using OpenNext Cloudflare adapter
- **Admin Panel**: Build artifacts generated for deployment to hosting platform

### Nx Cloud

This workspace is connected to [Nx Cloud](https://cloud.nx.app) for:

- Distributed task execution
- Build caching
- Task analytics

[Connect to Nx Cloud](https://cloud.nx.app/connect/r1m0mO77tD)

## Code Generation

Use Nx generators for consistent code structure:

### Angular Components

```sh
npx nx g @nx/angular:component my-component --project=admin-panel --change-detection=OnPush
```

### Angular Services

```sh
npx nx g @nx/angular:service services/my-service --project=admin-panel
```

### Next.js Pages

```sh
npx nx g @nx/next:page my-page --project=wedding
```

### Next.js Components

```sh
npx nx g @nx/next:component my-component --project=wedding
```

## Development Guidelines

### Angular Best Practices

- **Standalone Components**: All components use standalone architecture
- **Signals**: Use Angular signals for reactive state management
- **Modern Syntax**: Use `input()` and `output()` functions instead of decorators
- **Control Flow**: Use new `@if`, `@for`, `@switch` syntax
- **Change Detection**: All components use `OnPush` strategy
- **Injection**: Prefer `inject()` function over constructor injection
- **Type Safety**: Strict TypeScript with no `any` types

See [WARP.md](WARP.md) for detailed Angular development guidelines.

### Code Style

- **Formatting**: Prettier with Tailwind CSS plugin
- **Linting**: ESLint with project-specific configurations
- **Style Linting**: Stylelint for SCSS/CSS
- **TypeScript**: Strict mode enabled

## Useful Links

### Nx Documentation

- [Nx Documentation](https://nx.dev)
- [Nx Tutorials](https://nx.dev/getting-started/tutorials)
- [Nx Plugins](https://nx.dev/concepts/nx-plugins)
- [Nx on CI](https://nx.dev/ci/intro/ci-with-nx)
- [Nx Release](https://nx.dev/features/manage-releases)

### Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE.

[Install Nx Console](https://nx.dev/getting-started/editor-setup)

### Community

- [Discord](https://go.nx.dev/community)
- [Follow on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [YouTube Channel](https://www.youtube.com/@nxdevtools)
- [Blog](https://nx.dev/blog)

## License

MIT
