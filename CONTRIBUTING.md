# Contributing to SizeWise Suite

Thank you for your interest in contributing to SizeWise Suite! This document provides guidelines and information for contributors.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project follows a professional code of conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize accuracy and safety in engineering calculations
- Maintain professional standards in all communications

## Getting Started

1. **Fork the repository** and clone your fork
2. **Install dependencies**: `npm install`
3. **Create a branch** for your feature: `git checkout -b feature/your-feature-name`
4. **Read the documentation** in `/app/docs/`

### Development Setup
```bash
git clone https://github.com/your-username/SizeWise_Suite.git
cd SizeWise_Suite
npm install
npm run dev
```

## Development Process

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

### Commit Messages
Follow conventional commits format:
```
type(scope): description

feat(duct-sizer): add metric unit support
fix(calculations): correct pressure loss formula
docs(api): update component documentation
test(duct-sizer): add validation tests
```

## Coding Standards

### TypeScript
- Use strict mode TypeScript
- Define interfaces for all data structures
- Avoid `any` type - use proper typing
- Document complex types with JSDoc

```typescript
// ✅ Good
interface DuctCalculationInput {
  /** Airflow in CFM */
  cfm: number;
  /** Duct width in inches */
  width: number;
  /** Duct height in inches */
  height: number;
}

// ❌ Avoid
function calculate(data: any): any {
  // ...
}
```

### React Components
- Use functional components with hooks
- Follow React best practices
- Use proper dependency arrays in useEffect
- Implement proper error boundaries

```typescript
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Styling
- Use Tailwind CSS utility classes
- Follow the design token system
- Ensure responsive design (mobile-first)
- Maintain accessibility standards (WCAG 2.1 AA)

```typescript
// ✅ Good
<div className="card p-6 bg-white dark:bg-gray-800">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    Title
  </h2>
</div>
```

### Engineering Calculations
- Follow SMACNA, NFPA, and UL standards
- Include references to standards in comments
- Validate all inputs and outputs
- Use appropriate significant figures

```typescript
/**
 * Calculate duct velocity according to SMACNA standards
 * Reference: SMACNA HVAC Duct Construction Standards, 3rd Edition
 */
export function calculateVelocity(cfm: number, area: number): number {
  if (cfm <= 0 || area <= 0) {
    throw new Error('CFM and area must be positive values');
  }
  
  // Velocity = CFM / Area (ft²)
  const velocity = cfm / area;
  
  // Round to appropriate precision for engineering use
  return Math.round(velocity);
}
```

## Testing Requirements

### Test Coverage
- Maintain minimum 80% test coverage
- Test all calculation functions
- Test component rendering and interactions
- Test error handling and edge cases

### Test Structure
```typescript
describe('calculateVelocity', () => {
  test('calculates velocity correctly', () => {
    const result = calculateVelocity(1000, 0.69);
    expect(result).toBe(1449);
  });

  test('throws error for invalid inputs', () => {
    expect(() => calculateVelocity(-100, 0.69)).toThrow();
    expect(() => calculateVelocity(1000, 0)).toThrow();
  });
});
```

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { DuctSizer } from './DuctSizer';

test('updates calculation when inputs change', () => {
  render(<DuctSizer />);
  
  fireEvent.change(screen.getByLabelText(/cfm/i), { 
    target: { value: '1000' } 
  });
  
  expect(screen.getByText(/velocity/i)).toBeInTheDocument();
});
```

## Documentation

### Required Documentation
1. **Code Comments**: JSDoc for all public functions
2. **Component Props**: Document all props with types
3. **API Changes**: Update relevant documentation
4. **Architecture Decisions**: Create ADRs for significant changes

### Documentation Updates
- Update README.md for user-facing changes
- Update API documentation for interface changes
- Add examples for new features
- Update CHANGELOG.md

## Pull Request Process

### Before Submitting
1. **Run tests**: `npm test`
2. **Run linting**: `npm run lint`
3. **Build successfully**: `npm run build`
4. **Update documentation** as needed
5. **Add/update tests** for your changes

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Documentation
- [ ] Updated relevant documentation
- [ ] Added JSDoc comments
- [ ] Updated CHANGELOG.md

## Standards Compliance
- [ ] Follows SMACNA/NFPA standards (if applicable)
- [ ] Calculations verified against references
- [ ] Accessibility requirements met
```

### Review Process
1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Testing verification** in review environment
4. **Documentation review** for completeness
5. **Merge** after approval

## Engineering Standards

### Calculation Accuracy
- Verify calculations against published standards
- Include references to source materials
- Test with known values and expected results
- Consider significant figures and rounding

### Safety Considerations
- Validate all user inputs
- Provide appropriate warnings for out-of-range values
- Include disclaimers for professional use
- Follow industry best practices

### Professional Use
- Ensure calculations are suitable for professional engineering use
- Include appropriate units and conversions
- Provide clear error messages and guidance
- Maintain audit trail for calculations

## Getting Help

- **Documentation**: Check `/app/docs/` directory
- **Issues**: Create GitHub issue with detailed description
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: Request review from maintainers

## Recognition

Contributors will be recognized in:
- CHANGELOG.md for significant contributions
- README.md contributors section
- Release notes for major features

Thank you for contributing to SizeWise Suite!
