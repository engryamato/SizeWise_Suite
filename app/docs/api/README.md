# SizeWise Suite API Documentation

This directory contains API documentation for SizeWise Suite components, utilities, and calculation engines.

## Structure

```
api/
├── components/           # Component API documentation
├── calculations/         # Calculation engine APIs
├── utilities/           # Utility function APIs
└── types/               # TypeScript type definitions
```

## Documentation Standards

### Component Documentation
Each component should document:
- **Props interface** with types and descriptions
- **Usage examples** with code snippets
- **Accessibility features** and ARIA attributes
- **Styling customization** options

### Calculation Documentation
Each calculation module should document:
- **Input parameters** with valid ranges
- **Output format** and units
- **Calculation methodology** and standards
- **Error handling** and validation

### Utility Documentation
Each utility should document:
- **Function signature** with TypeScript types
- **Purpose and use cases**
- **Examples** with input/output
- **Dependencies** and requirements

## Auto-Generated Documentation

We use TypeScript interfaces and JSDoc comments to generate API documentation:

```typescript
/**
 * Calculates air velocity in a duct
 * @param cfm - Airflow in cubic feet per minute
 * @param area - Cross-sectional area in square feet
 * @returns Velocity in feet per minute
 * @throws {Error} When CFM or area is not positive
 * @example
 * ```typescript
 * const velocity = calculateVelocity(1000, 0.69);
 * console.log(velocity); // 1449 ft/min
 * ```
 */
export function calculateVelocity(cfm: number, area: number): number {
  if (cfm <= 0 || area <= 0) {
    throw new Error('CFM and area must be positive numbers');
  }
  return cfm / area;
}
```

## Component API Template

```typescript
/**
 * Professional input field component for engineering applications
 * 
 * @component
 * @example
 * ```tsx
 * <InputField
 *   label="Airflow (CFM)"
 *   value={cfm}
 *   onChange={setCfm}
 *   type="number"
 *   required
 * />
 * ```
 */
export interface InputFieldProps {
  /** Field label text */
  label: string;
  /** Current input value */
  value: string | number;
  /** Change handler function */
  onChange: (value: string) => void;
  /** Input type (text, number, email, etc.) */
  type?: 'text' | 'number' | 'email';
  /** Whether field is required */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Error message to display */
  error?: string;
  /** Additional CSS classes */
  className?: string;
}
```

## Calculation API Template

```typescript
/**
 * HVAC calculation result interface
 */
export interface CalculationResult {
  /** Calculated value */
  value: number;
  /** Unit of measurement */
  unit: string;
  /** Validation status */
  isValid: boolean;
  /** Warning messages if any */
  warnings?: string[];
  /** Calculation metadata */
  metadata?: {
    method: string;
    standard: string;
    timestamp: Date;
  };
}

/**
 * Base interface for all HVAC calculations
 */
export interface HVACCalculation {
  /** Calculate and return result */
  calculate(): CalculationResult;
  /** Validate input parameters */
  validate(): boolean;
  /** Get calculation metadata */
  getMetadata(): object;
}
```

## Tools for Documentation

### TypeDoc
Generate API documentation from TypeScript:
```bash
npm install -D typedoc
npx typedoc src/
```

### Storybook
Document React components interactively:
```bash
npm run storybook
```

### JSDoc
Document JavaScript functions:
```bash
npm install -D jsdoc
npx jsdoc src/
```

## Maintenance

- Update API docs when interfaces change
- Include examples for all public APIs
- Document breaking changes in CHANGELOG.md
- Review docs during code reviews
- Keep examples up-to-date with current API
