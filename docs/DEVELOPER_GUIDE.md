# SizeWise Suite Developer Guide

This guide provides detailed information for developers working on the SizeWise Suite project.

## Table of Contents
- [Project Structure](#project-structure)
- [Tool Development](#tool-development)
- [State Management](#state-management)
- [Styling](#styling)
- [Testing](#testing)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

## Project Structure

```
src/
├── components/         # Shared UI components
├── config/             # Application configuration
├── core/               # Core application logic
│   ├── schema/         # JSON Schema definitions
│   ├── theme/          # Theming system
│   ├── tooling/        # Tool registration and management
│   └── validators/     # Validation utilities
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── styles/             # Global styles
└── tools/              # Individual tools
    └── tool-name/      # Each tool follows this structure
        ├── index.tsx   # Public API (re-exports UI component)
        ├── ui.tsx      # React component
        ├── logic.ts    # Business logic
        └── rules/      # Tool-specific validation rules
```

## Tool Development

### Creating a New Tool

1. **Create Tool Directory**
   ```bash
   mkdir -p src/tools/your-tool-id
   cd src/tools/your-tool-id
   ```

2. **Create Required Files**
   - `ui.tsx` - Your React component
   - `logic.ts` - Business logic and calculations
   - `index.tsx` - Public API (re-exports the UI component)
   - `types.ts` - TypeScript type definitions (if needed)
   - `rules/` - Directory for validation rules

3. **Register the Tool**
   Add your tool to `src/config/toolConfig.json`:
   ```json
   {
     "id": "your-tool-id",
     "name": "Your Tool Name",
     "description": "Description of what your tool does",
     "icon": "icon-name",
     "componentPath": "@/tools/your-tool-id",
     "category": "Category",
     "version": "1.0.0"
   }
   ```

### Tool Component Structure

```tsx
// ui.tsx
import React from 'react';
import { useToolLogic } from './logic';

export function YourToolUI() {
  const { state, actions } = useToolLogic();
  
  return (
    <div className="your-tool">
      {/* Your UI components here */}
    </div>
  );
}

// Export as default for dynamic imports
export default YourToolUI;
```

## State Management

### Local State
- Use React's `useState` and `useReducer` for component-level state
- Keep state as local as possible to the components that need it

### Global State
- For state that needs to be shared across components, use React Context
- Create a context provider for each logical piece of global state

## Styling

### Tailwind CSS
- Use Tailwind's utility classes for styling
- Follow the mobile-first approach
- Use `@apply` in CSS for repeated utility patterns

### CSS Modules
- Use CSS Modules for complex component styles
- Follow BEM naming convention for class names

## Testing

### Unit Tests
- Place test files next to the code they test with `.test.ts` or `.test.tsx` extension
- Use React Testing Library for component testing
- Test user interactions and component behavior, not implementation details

### Integration Tests
- Test component interactions
- Mock external dependencies
- Test error states and edge cases

## Performance

### Code Splitting
- Use React.lazy and Suspense for code splitting
- Split code at the route level and for heavy components

### Memoization
- Use `React.memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for function references

## Troubleshooting

### Common Issues

#### Dynamic Imports Not Working
- Ensure the path in `toolConfig.json` is correct
- Check the browser console for 404 errors
- Verify the component has a default export

#### Styling Issues
- Check for CSS specificity issues
- Verify Tailwind classes are properly purged in production
- Use the `@apply` directive for complex styles

#### TypeScript Errors
- Ensure all props and state are properly typed
- Use TypeScript's utility types when needed
- Check for implicit `any` types

## Development Workflow

1. **Starting Development**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

2. **Making Changes**
   - Create a new branch for your feature/fix
   - Write tests for new functionality
   - Update documentation as needed
   - Run linter and tests before committing

3. **Submitting Changes**
   - Push your branch to the remote repository
   - Create a pull request
   - Request code review from a team member
   - Address any feedback and make necessary changes
   - Once approved, merge the pull request

## Code Review Guidelines

- Keep PRs small and focused
- Include tests for new features
- Update documentation when adding new features
- Follow the project's coding style
- Write clear commit messages

## Deployment

### Production Build
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Environment Variables
- Create a `.env` file in the project root
- Prefix variables with `VITE_` to make them available to the frontend
- Never commit sensitive information to version control

## Support

For additional help, please contact the development team or open an issue in the repository.
