# Changelog

All notable changes to SizeWise Suite will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [0.2.0] - 2024-06-01 - Phase 0.0 Estimating Core Setup
### Added
- Estimating App scaffolding with schemas and tests
- Engine Exhaust Sizer directory
- Documentation updates for new structure


### Added - Modern Field-Friendly Results Display

- **Professional Results Table**: Modern, field-friendly SMACNA compliance table
- **Accessible Color Coding**: High-contrast status indicators (Green/Yellow/Red) with clear legend
- **Status Indicators**: Reusable component system for compliance visualization
- **Enhanced Color Palette**: Professional engineering colors with dark mode support
- **No Redundant Code**: Consolidated color coding logic into reusable components

### Enhanced Features

- **At-a-Glance Status**: Color-coded compliance without cluttering text
- **WCAG 2.1 AA Compliant**: High contrast colors for accessibility
- **Field-Ready Design**: Optimized for tablets and mobile use
- **Professional Presentation**: Clean table format suitable for client reports
- **Tooltip Support**: Hover details for status explanations

### Code Quality Improvements

- **Reduced Cognitive Complexity**: Refactored calculation logic into focused helper functions
- **Accessibility Compliance**: All form labels properly associated with controls
- **Eliminated Nested Ternaries**: Improved code readability and maintainability
- **SonarLint Clean**: Resolved all code quality issues and technical debt
- **Modular Architecture**: Separated concerns for better testability and maintenance

## [0.1.0] - 2024-05-30 - Phase 0.1 Complete

### Added - Enhanced Air Duct Sizer (Phase 0.1)

- **SMACNA-Based Validation**: Real-time compliance checking with SMACNA HVAC Duct Construction Standards
- **Enhanced Calculation Engine**:
  - Material roughness factors (galvanized, stainless, aluminum)
  - Application-specific velocity limits (supply, return, exhaust)
  - Enhanced Darcy-Weisbach pressure loss calculations
  - Reynolds number-based friction factors
- **Educational Mode**: Engineering notes and best practices
- **Snap Summary Output**: Quick reference calculation strings
- **Advanced Material Selection**: Three material types with different properties
- **Comprehensive Validation**:
  - Velocity warnings for out-of-range values
  - Pressure loss optimization suggestions
  - SMACNA gauge selection compliance
  - Joint and hanger spacing validation

### UI Enhancements

- **Professional UI**: Color-coded results with status indicators
- **Detailed Results Display**:
  - Hydraulic diameter calculations
  - Cross-sectional area and perimeter
  - Material-specific engineering notes
  - SMACNA compliance warnings
- **Comprehensive Testing**: Full test suite for calculation accuracy
- **Tool Documentation**: Complete README with usage examples and standards references

### Technical Implementation

- **Modular Architecture**: Separated logic, validation, and utilities
- **TypeScript Interfaces**: Strongly typed calculation inputs and outputs
- **Configuration System**: JSON-based tool configuration and limits
- **Standards Compliance**: References to SMACNA tables and requirements

## [0.0.0] - 2024-05-30 - Phase 0.0 Complete

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
