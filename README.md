# SizeWise Suite

[![CI Status](https://github.com/engryamato/SizeWise_Suite/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/engryamato/SizeWise_Suite/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/engryamato/SizeWise_Suite/branch/main/graph/badge.svg)](https://codecov.io/gh/engryamato/SizeWise_Suite)
[![GitHub stars](https://img.shields.io/github/stars/engryamato/SizeWise_Suite?style=social)](https://github.com/engryamato/SizeWise_Suite/stargazers)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**A modular, standards-driven HVAC engineering platform. SizeWise Suite enables accurate duct sizing, pressure loss analysis, and system design—fully aligned with SMACNA, NFPA, and UL requirements. Built with React, TypeScript, and Vite for a modern developer experience.**

---

## Table of Contents

- [🚀 Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [Testing & Quality](#testing--quality)
- [🎯 Roadmap](#-roadmap)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)

---

## 🖥️ System Requirements

- **Node.js:** 18.x or newer ([nvm recommended](https://github.com/nvm-sh/nvm))
- **npm:** 8.x+ or **yarn** 1.22+
- **OS:** Windows 10+, macOS, or Ubuntu 22.04+
- **Browser:** Latest Chrome, Firefox, Edge, or Safari

---

## 🖼️ Demo / Screenshots

<!-- Add screenshots or GIF demos of the main dashboard/tools here -->

---

## 🚀 Features

- **Modular Tool Architecture** - Dynamic tool loading with Vite's module system
- **Air Duct Sizer** - Calculate duct dimensions, velocity, and pressure loss (SMACNA)
- **Real-time Validation** - Instant standards compliance and engineering warning checks
- **Theme System** - Built-in light/dark mode with persistent user preference
- **Type-Safe** - Full TypeScript support throughout the codebase
- **Developer Experience** - Fast refresh, linting, and testing setup

## 🏗️ Project Architecture

### Core Components

- **Tool System** - Dynamic tool loading and registration
  - `src/core/toolRegistrar.ts` - Central tool registry
  - `src/plugins/virtual-tools.ts` - Vite plugin for dynamic imports
  - `src/config/toolConfig.json` - Tool metadata and configuration

- **Validation** - Schema-based validation system
  - `src/core/validators/` - Engineering validators
  - `src/core/schema/` - JSON Schema definitions

- **UI Components** - Reusable UI elements
  - `src/components/` - Shared components
  - `src/pages/` - Page-level components

### Tool Development

Each tool follows this structure:
```
src/tools/
  <tool-id>/
    index.tsx     # Public API (re-exports UI component)
    ui.tsx        # React component
    logic.ts      # Business logic
    rules/        # Tool-specific validation rules
    types.ts      # TypeScript types
```

### Adding a New Tool

1. Create a new directory under `src/tools/`
2. Implement the UI component in `ui.tsx`
3. Add tool metadata to `src/config/toolConfig.json`
4. The tool will be automatically discovered and loaded at runtime

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/engryamato/SizeWise_Suite.git
   cd SizeWise_Suite
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at http://localhost:3000

4. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

### Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build locally
- `test` - Run tests
- `lint` - Run ESLint
- `type-check` - Run TypeScript type checking

## 📚 Documentation

### Tool Registration

Tools are registered in `src/config/toolConfig.json`:

```json
{
  "tools": [
    {
      "id": "air-duct-sizer",
      "name": "Air Duct Sizer",
      "description": "Calculate duct dimensions and pressure drops",
      "icon": "duct-icon",
      "componentPath": "@/tools/air-duct-sizer",
      "category": "HVAC",
      "version": "1.0.0"
    }
  ]
}
```

### Theming

The app uses CSS variables for theming. The theme can be toggled between light and dark modes.

```css
:root {
  /* Light theme */
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  /* ... */
}

[data-theme="dark"] {
  /* Dark theme */
  --color-bg: #1a1a1a;
  --color-text: #ffffff;
  /* ... */
}
```

### Testing

Tests are written with Jest and React Testing Library:

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://react.dev/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

- **Offline Ready** [`/vite.config.ts`] *(📦 Phase 0.2)*:  
  Field-ready—works without an internet connection

- **Mobile Responsive** [`/src/components/`] *(📦 Phase 0.1)*:  
  Optimized for use on any device, anywhere

---

## 🛠️ Tech Stack

- **Frontend:** React 18.2, TypeScript 5, Vite 4
- **Styling:** Tailwind CSS 3 (`/src/styles/`), custom design tokens (`/src/styles/tokens/`)
- **Testing:** Jest 29, React Testing Library 14 (`/src/__tests__/`, `/app/tools/**/__tests__/`)
- **Linting:** ESLint 8, Prettier 2 (`.eslintrc.js`, `.prettierrc`)
- **CI/CD:** GitHub Actions (`/.github/workflows/ci-cd.yml`)

---

## 📁 Project Structure

```text
/
├── app/                    # Backend-independent domain modules
│   ├── config/            # Env config, constants
│   ├── core/              # Calculation logic, validators, standards logic
│   ├── tools/             # Modular tool code (e.g. duct-sizer)
│   └── docs/              # All documentation, ADRs, architecture diagrams
├── src/                   # React UI/presentation
│   ├── components/        # Reusable UI elements
│   ├── pages/             # Top-level UI routes
│   ├── providers/         # Context/state providers (theme, settings)
│   └── styles/            # Tailwind config, tokens, global styles
└── tests/                 # Integration/E2E/visual tests (if present)
```

Each folder contains a README or index with rules, dependencies, and doc links.  
See `/app/docs/architecture/` for diagrams and `/app/docs/` for full docs.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (use `nvm use`)
- npm 8+ or yarn 1.22+
- macOS, Windows 10+, or Ubuntu 22.04+

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/engryamato/SizeWise_Suite.git
   cd SizeWise_Suite
   ```

2. Install dependencies:

   ```bash
   nvm use
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. For production build:

   ```bash
   npm run build
   npm run preview
   ```

### ⚠️ Current Development Status

**Pipeline Status (Last Updated: 2025-06-16)**

| Component | Status | Action Required |
|-----------|--------|-----------------|
| **Tests** | ✅ **PASSING** | None - All 31 tests pass |
| **Dependencies** | ✅ **RESOLVED** | None - All packages installed |
| **Linting** | ⚠️ **7 issues** | See [Development Issues](#development-issues) |
| **Build** | ❌ **TypeScript errors** | **PRIORITY: Fix type errors** |
| **CI/CD** | ✅ **CONFIGURED** | Ready for use once build fixes complete |

**Before starting development, please see [Development Issues](#development-issues) section below.**

---

## Testing & Quality

### Minimum Required Test Coverage

- 85%
- All tool logic: `/app/tools/[tool]/__tests__/`
- Shared logic: `/src/__tests__/`

### Running Tests

```bash
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

---

## 📋 Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production ⚠️ *Currently failing - see [Development Issues](#development-issues)*
- `npm run preview` — Preview production build
- `npm test` — Run tests ✅ *All tests passing*
- `npm run lint` — Run ESLint ⚠️ *7 issues remaining*
- `npm run lint:fix` — Auto-fix lint issues
- `npm run format` — Format code with Prettier
- `npm run type-check` — TypeScript type checking ❌ *Currently failing*
- `npm run test:coverage` — Run tests with coverage report
- `npm run storybook` — Start Storybook (coming soon)

---

## 🎯 Roadmap

### 📦 Phase 0.1 – Foundation ✅

- Project setup, core UI, Duct Sizer MVP

### 📦 Phase 0.2 – Enhanced Duct Sizer

- SMACNA integration, material/gauge selection, export

### 📦 Phase 0.3 – Additional Tools

- Grease Duct Sizer (NFPA 96), Boiler Vent Sizer, Engine Exhaust Sizer

### 📦 Phase 1.0 – Advanced Features

- Simulation canvas, multi-language, cloud sync, advanced reporting

*(See `/app/docs/architecture/` for roadmap details.)*

---

## 📚 Documentation

- [Getting Started Guide](./app/docs/development/GETTING_STARTED.md)
- [Architecture Decisions/Diagrams](./app/docs/architecture/)
- [API Documentation](./app/docs/api/)
- [Tool Documentation](./app/docs/tools/)
- [Contributing Guide](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

---

## 🤝 Contributing

We welcome all contributions!

**Workflow:**

- Branch from `main` using naming like `feature/<desc>`, `fix/<desc>`, `docs/<desc>`
- Use [Conventional Commits](https://www.conventionalcommits.org/)
- Run `npm run lint` and `npm test` before PRs
- Ensure 85%+ coverage and update docs
- At least one CODEOWNER or reviewer must approve

See the [Contributing Guide](./CONTRIBUTING.md) for full details.

---

## ⚖️ Legal & Compliance

- SMACNA, NFPA, UL specs are referenced for validation logic.
- This app does **not** replace official documents; always verify against the real code!
- Provided "as is"—see [LICENSE](LICENSE) for details.

---

## ♿ Accessibility

- UI and code meet WCAG 2.1 AA standards (contrast, navigation, screen readers).
- See [Accessibility Statement](./app/docs/development/ACCESSIBILITY.md).

---

## 👥 Maintainers

- Johnrey Razonable – Project Owner ([your@email])
- Alice – Frontend Lead
- Sophia – Engineering/Logic Consultant

## 🚨 Development Issues

**IMPORTANT: Please address these issues before starting development work.**

### Priority 1: TypeScript Build Errors ❌

The build currently fails with ~15 TypeScript errors. **Fix these first:**

```bash
# Check current TypeScript errors
npm run type-check

# Common errors to fix:
# 1. src/hooks/useDuctResults.ts - null vs undefined type mismatches
# 2. src/components/ui/SMACNAResultsTable.tsx - missing 'title' prop
# 3. src/tools/air-duct-sizer/ui.tsx - ResultItem type inconsistencies
# 4. src/utils/smacnaUtils.ts - missing 'gauge' property
```

**Action Required:**
- Fix null/undefined type mismatches in hooks
- Add missing component prop types
- Align ResultItem type usage across components
- Update SMACNA utility type definitions

### Priority 2: Linting Issues ⚠️

7 linting issues remain (2 errors, 5 warnings):

```bash
# Check current linting issues
npm run lint

# Auto-fix what's possible
npm run lint:fix
```

**Remaining Issues:**
- Unused `application` parameter in SMACNAResultsTable.tsx
- React refresh warnings for component exports
- One remaining `any` type in events.ts

### Priority 3: Pipeline Verification ✅

Once the above are fixed, verify the full pipeline:

```bash
# Full pipeline check
npm run lint && npm run type-check && npm test && npm run build
```

## ❓ Troubleshooting

### Current Known Issues

1. **Build Failures (TypeScript)**
   - **Issue**: `npm run build` fails with type errors
   - **Status**: ❌ **BLOCKING** - Must fix before development
   - **Solution**: See [Development Issues](#development-issues) above

2. **Linting Warnings**
   - **Issue**: ESLint reports 7 issues
   - **Status**: ⚠️ **Non-blocking** but should be addressed
   - **Solution**: Run `npm run lint:fix` and manually fix remaining

### General Troubleshooting

1. **Node.js Version Mismatch**
   - **Issue**: Build errors related to Node.js version
   - **Solution**: Ensure you're using Node.js 18+

2. **Dependency Installation Issues**
   - **Issue**: Errors during `npm install`
   - **Solution**:
     1. Delete `node_modules` and `package-lock.json`
     2. Run `npm cache clean --force`
     3. Run `npm install`

3. **Jest Configuration Warnings**
   - **Issue**: ✅ **RESOLVED** - Jest moduleNameMapping fixed
   - **Status**: No action needed

4. **Missing ESLint Plugin**
   - **Issue**: ✅ **RESOLVED** - eslint-plugin-react installed
   - **Status**: No action needed

For additional help, please [open an issue](https://github.com/engryamato/SizeWise_Suite/issues).

---

## ✨ Built With

- [React](https://reactjs.org/) - Frontend library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Build tooling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Jest](https://jestjs.io/) - Testing framework

## 🙏 Acknowledgments

- Built following SMACNA, NFPA, and UL standards
- Designed for professional HVAC engineers and estimators
- Inspired by the need for accurate, field-ready calculation tools

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
