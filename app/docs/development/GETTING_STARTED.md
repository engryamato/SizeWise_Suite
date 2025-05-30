# Getting Started with SizeWise Suite Development

This guide will help you set up your development environment and understand the project structure.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- VSCode (recommended)

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd SizeWise_Suite
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

3. **Run Tests**
   ```bash
   npm test
   ```

## Project Structure Overview

```
SizeWise_Suite/
├── app/                    # Core application logic
│   ├── config/            # Environment configurations
│   ├── core/              # Shared business logic
│   ├── tools/             # Individual HVAC tools
│   └── docs/              # Technical documentation
├── src/                   # React UI components
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   └── providers/         # React context providers
├── public/                # Static assets
└── tests/                 # Global test utilities
```

## Development Workflow

### 1. Creating a New Tool

Follow this structure for new tools:

```bash
app/tools/new-tool-name/
├── components/           # Tool-specific UI components
├── calculations/         # Business logic and formulas
├── config/              # Tool configuration
├── tests/               # Tool-specific tests
├── i18n/                # Translations
├── index.ts             # Tool entry point
└── README.md            # Tool documentation
```

### 2. Adding UI Components

Place reusable components in `src/components/`:
- `layout/` - Layout components (Header, Sidebar)
- `ui/` - Generic UI components (buttons, inputs)
- `forms/` - Form-specific components

### 3. Writing Tests

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **Location**: Colocate tests with the code they test

Example test structure:
```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../providers/ThemeProvider';
import MyComponent from './MyComponent';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('MyComponent', () => {
  test('renders correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Code Standards

### TypeScript
- Use strict mode
- Define interfaces for all props and data structures
- Avoid `any` type - use proper typing

### React
- Use functional components with hooks
- Follow React best practices for performance
- Use proper dependency arrays in useEffect

### Styling
- Use Tailwind CSS utility classes
- Follow the design token system
- Ensure responsive design (mobile-first)

### Testing
- Write tests for all new features
- Maintain test coverage above 80%
- Test user interactions, not implementation details

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Environment Configuration

The app uses environment-specific configurations:

- **Development**: `app/config/environment/development.json`
- **Production**: `app/config/environment/production.json`

## Debugging

### VSCode Setup
The project includes VSCode settings for optimal development:
- Auto-formatting on save
- ESLint integration
- TypeScript error highlighting
- Tailwind CSS IntelliSense

### Browser DevTools
- React Developer Tools extension
- Use the Network tab to debug API calls
- Console for debugging calculations

## Common Issues

### Import Errors
Use path aliases:
```typescript
// ✅ Good
import { Button } from '@/components/ui/Button';
import { calculatePressure } from '@/app/core/calculations';

// ❌ Avoid
import { Button } from '../../../components/ui/Button';
```

### Styling Issues
- Check Tailwind class names for typos
- Use browser DevTools to inspect applied styles
- Verify responsive breakpoints

### Test Failures
- Ensure all providers are wrapped in test renders
- Check for async operations that need `waitFor`
- Verify mock data matches expected interfaces

## Getting Help

1. Check the [Architecture Documentation](../architecture/)
2. Review existing tool implementations
3. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
4. Create an issue with detailed reproduction steps
