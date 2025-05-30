# ADR 002: Future-Proof Folder Structure

## Status
Accepted

## Context
SizeWise Suite needs a scalable folder structure that can accommodate:
- Multiple HVAC calculation tools
- Shared components and utilities
- Internationalization support
- Testing at multiple levels
- Clear separation of concerns
- Easy onboarding for new developers

## Decision
We adopt a hybrid structure combining feature-based organization with shared resources:

```
/
├── app/                    # Core application modules
│   ├── config/            # Environment configurations
│   ├── core/              # Shared logic and validators
│   ├── tools/             # Individual HVAC tools
│   ├── docs/              # Documentation
│   ├── i18n/              # Internationalization
│   └── ...
├── src/                   # React application source
│   ├── components/        # Shared UI components
│   ├── pages/             # Page components
│   ├── providers/         # Context providers
│   └── ...
```

### Key Principles
1. **Tool Isolation**: Each tool in `/app/tools/` is self-contained
2. **Shared Resources**: Common logic in `/app/core/` and `/src/components/`
3. **Clear Boundaries**: Separation between business logic (`/app/`) and UI (`/src/`)
4. **Scalability**: Easy to add new tools without affecting existing ones

## Consequences

### Positive
- **Modularity**: Tools can be developed and tested independently
- **Reusability**: Shared components prevent code duplication
- **Maintainability**: Clear structure makes navigation and debugging easier
- **Scalability**: New tools follow established patterns
- **Team Collaboration**: Multiple developers can work on different tools simultaneously

### Negative
- **Initial Complexity**: More folders and files than a simple flat structure
- **Import Paths**: Longer import paths for deeply nested modules
- **Overhead**: Some boilerplate for each new tool

### Mitigation Strategies
- Path aliases in TypeScript config (`@/` for src, `@/app/` for app)
- Tool templates for consistent structure
- Clear documentation and examples
- Automated scaffolding scripts for new tools

## Implementation Details

### Tool Structure
Each tool follows this pattern:
```
/app/tools/tool-name/
├── components/           # Tool-specific UI components
├── calculations/         # Calculation logic
├── config/              # Tool configuration
├── tests/               # Tool-specific tests
├── i18n/                # Tool translations
├── index.ts             # Tool entry point
└── README.md            # Tool documentation
```

### Shared Components
```
/src/components/
├── layout/              # Layout components (Header, Sidebar)
├── ui/                  # Reusable UI components
└── forms/               # Form components
```

## References
- [Updated Folder Structure (Future Proof).txt](../../Updated%20Folder%20Structure%20(Future%20Proof).txt)
- [Migration Checklist](../../migration_checklist.md)
