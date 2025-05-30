# Changelog

All notable changes to SizeWise Suite will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2024-05-30

### Added
- **Foundation & Toolchain**
  - React 18 + TypeScript + Vite development environment
  - Tailwind CSS with custom engineering design tokens
  - ESLint + Prettier + Husky for code quality
  - Jest + React Testing Library for testing
  - GitHub Actions CI/CD pipeline

- **Core Architecture**
  - Future-proof folder structure following project specifications
  - Environment-specific configuration system
  - Dark/light theme system with professional color palette
  - React Router setup for navigation

- **UI Components & Layout**
  - Professional header with theme toggle and settings
  - Collapsible sidebar navigation with tool status indicators
  - Responsive layout system optimized for desktop and mobile
  - WCAG 2.1 AA compliant components
  - Custom design tokens for consistent styling

- **Air Duct Sizer Tool (Phase 0.1)**
  - Real-time calculations for rectangular and circular ducts
  - Velocity and pressure loss calculations
  - Material gauge recommendations based on pressure
  - Joint and hanger spacing calculations
  - Live validation warnings for out-of-range values
  - Professional results display with engineering units

- **Testing Infrastructure**
  - Unit test setup with Jest and jsdom
  - Component testing with React Testing Library
  - Test coverage reporting
  - Automated testing in CI pipeline

- **Documentation**
  - Comprehensive README with setup instructions
  - Architecture Decision Records (ADRs)
  - Project roadmap and feature planning
  - Developer onboarding documentation

- **Developer Experience**
  - VSCode settings for consistent development environment
  - Git hooks for automated linting and formatting
  - Path aliases for clean imports
  - Hot reload development server

### Technical Details
- **Dependencies**: React 18.2.0, TypeScript 5.2.2, Vite 5.0.0, Tailwind CSS 3.3.6
- **Testing**: Jest 29.7.0, React Testing Library 13.4.0
- **Build**: Optimized production builds with source maps
- **Deployment**: GitHub Pages with automated deployment

### Architecture Decisions
- [ADR 001: Modern Frontend Stack Selection](./app/docs/architecture/001-modern-frontend-stack.md)
- [ADR 002: Future-Proof Folder Structure](./app/docs/architecture/002-folder-structure.md)

## [0.0.0] - 2024-05-30

### Added
- Initial project setup
- Planning documents and roadmap
- Folder structure design
- UI/UX design specifications
