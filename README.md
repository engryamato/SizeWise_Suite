# SizeWise Suite

[![CI Status](https://github.com/engryamato/SizeWise_Suite/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/engryamato/SizeWise_Suite/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/engryamato/SizeWise_Suite/branch/main/graph/badge.svg)](https://codecov.io/gh/engryamato/SizeWise_Suite)
[![GitHub stars](https://img.shields.io/github/stars/engryamato/SizeWise_Suite?style=social)](https://github.com/engryamato/SizeWise_Suite/stargazers)

**A modular, standards-driven HVAC engineering platform. SizeWise Suite enables accurate duct sizing, pressure loss analysis, and system design—fully aligned with SMACNA, NFPA, and UL requirements. Designed for professionals. Built for trust.**

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Testing & Quality](#testing--quality)
- [Roadmap](#-roadmap)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Troubleshooting](#troubleshooting)

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

- **Air Duct Sizer** [`/app/tools/duct-sizer/`] *(📦 Phase 0.1)*:  
  Calculate duct dimensions, velocity, and pressure loss (SMACNA)
- **Real-time Validation** [`/app/core/validators/`] *(📦 Phase 0.1)*:  
  Instant standards compliance and engineering warning checks
- **Dark/Light Theme** [`/src/providers/ThemeProvider.tsx`, `/src/styles/`] *(📦 Phase 0.1)*:  
  Accessible, professional UI
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

```
/
├── app/                    # Backend-independent domain modules
│   ├── config/            # Env config, constants
│   ├── core/              # Calculation logic, validators, standards logic
│   ├── tools/             # Modular tool code (e.g. duct-sizer)
│   ├── docs/              # All documentation, ADRs, architecture diagrams
├── src/                   # React UI/presentation
│   ├── components/        # Reusable UI elements
│   ├── pages/             # Top-level UI routes
│   ├── providers/         # Context/state providers (theme, settings)
│   ├── styles/            # Tailwind config, tokens, global styles
├── tests/                 # Integration/E2E/visual tests (if present)
└── ...
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
   nvm use      # ensure correct Node version
   npm install  # or yarn
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

---

## 🧪 Testing & Quality

- Minimum required test coverage: 85%
- All tool logic: `/app/tools/[tool]/__tests__/`
- Shared logic: `/src/__tests__/`
- Run tests:
```bash
npm test
```
Run with coverage:
```bash
npm test -- --coverage
```

---

## 📋 Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm test` — Run tests
- `npm run lint` — Run ESLint
- `npm run storybook` — Start Storybook (coming soon)
- `npm run lint:fix` — Auto-fix lint issues
- `npm run format` — Format code with Prettier
- `npm run test:coverage` — Run tests with coverage report

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

## ❓ Troubleshooting

Common issues and solutions:
- **Node version issues**: Ensure you're using Node.js 18+ (use `nvm use`)
- **Dependency issues**: Try deleting `node_modules` and `package-lock.json`, then run `npm install`
- **Build errors**: Check the console output for specific error messages
- **Test failures**: Run `npm test -- --coverage` to identify test coverage gaps

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.