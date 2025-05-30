# Air Duct Sizer Tool Documentation

## Overview

The Air Duct Sizer is the first tool implemented in SizeWise Suite, designed to calculate duct dimensions, velocity, and pressure loss for HVAC systems following SMACNA standards.

## Features

### Current Implementation (v0.1.0)
- **Duct Types**: Rectangular and circular ducts
- **Calculations**: 
  - Air velocity (ft/min)
  - Pressure loss (in. w.g.)
  - Material gauge recommendations
  - Joint spacing recommendations
  - Hanger spacing recommendations
- **Validation**: Real-time warnings for out-of-range values
- **Units**: Imperial units (CFM, inches, feet)

### Planned Features (v0.2.0)
- SMACNA table integration for accurate friction factors
- Material selection database
- Export functionality (PDF/CSV reports)
- Metric unit support
- Advanced pressure loss calculations with fittings

## Technical Implementation

### File Structure
```
app/tools/air-duct-sizer/
├── components/           # (Future: Tool-specific components)
├── calculations/         # (Future: Separated calculation logic)
├── config/              # (Future: Tool configuration)
├── tests/               # (Future: Tool-specific tests)
└── README.md            # This file
```

### Current Location
The Air Duct Sizer is currently implemented as a page component:
- **Location**: `src/pages/DuctSizerPage.tsx`
- **Route**: `/tools/duct-sizer`
- **Tests**: `src/pages/__tests__/DuctSizerPage.test.tsx`

## Calculation Methods

### Velocity Calculation
```typescript
velocity = CFM / area
```
Where:
- `CFM` = Cubic feet per minute
- `area` = Cross-sectional area in square feet

### Area Calculations

**Rectangular Duct:**
```typescript
area = (width × height) / 144  // Convert sq inches to sq feet
```

**Circular Duct:**
```typescript
area = (π × diameter²) / (4 × 144)  // Convert sq inches to sq feet
```

### Pressure Loss Calculation
```typescript
pressureLoss = (frictionFactor × length × velocity²) / (2 × 4005 × hydraulicDiameter)
```

**Hydraulic Diameter:**
```typescript
hydraulicDiameter = (4 × area) / perimeter
```

### Material Gauge Selection
Based on pressure loss:
- ≤ 1 in. w.g.: 26 gauge
- ≤ 2 in. w.g.: 24 gauge  
- ≤ 4 in. w.g.: 22 gauge
- > 4 in. w.g.: 20 gauge

## Validation Rules

### Input Validation
- **CFM**: Must be positive number
- **Dimensions**: Must be positive numbers
- **Length**: Must be positive number

### Performance Warnings
- **High Velocity**: Warning if velocity > 2500 ft/min
- **Low Velocity**: Warning if velocity < 800 ft/min
- **High Pressure Loss**: Warning if pressure loss > 0.1 in. w.g. per 100 ft

## User Interface

### Input Panel
- **Airflow (CFM)**: Numeric input with validation
- **Duct Shape**: Dropdown (Rectangular/Circular)
- **Dimensions**: Dynamic inputs based on shape selection
- **Length**: Duct length in feet

### Results Panel
- **Velocity**: Displayed in ft/min with color coding
- **Pressure Loss**: Displayed in in. w.g.
- **Recommendations**: Gauge, joint spacing, hanger spacing
- **Validation Warnings**: Real-time feedback

## Testing

### Test Coverage
- Component rendering
- Input validation
- Calculation accuracy
- Shape switching functionality
- Results display

### Test Files
- `src/pages/__tests__/DuctSizerPage.test.tsx`

### Running Tests
```bash
npm test DuctSizerPage
```

## Future Enhancements

### Phase 0.2 (Next Release)
1. **SMACNA Integration**
   - Accurate friction factor tables
   - Material specifications
   - Joint and hanger standards

2. **Enhanced Calculations**
   - Fitting pressure losses
   - System effect factors
   - Multiple duct sections

3. **Export Features**
   - PDF calculation reports
   - CSV data export
   - Project summaries

### Phase 1.0 (Major Release)
1. **Advanced Features**
   - Duct optimization algorithms
   - Cost calculations
   - Energy analysis

2. **Integration**
   - CAD export capabilities
   - Project management features
   - Team collaboration tools

## Standards Compliance

### Current Standards
- Basic SMACNA guidelines for velocity limits
- Standard gauge selection practices
- Common hanger spacing recommendations

### Planned Standards Integration
- SMACNA HVAC Duct Construction Standards
- ASHRAE Fundamentals
- Local building codes and regulations

## API Reference

### Component Props
```typescript
interface DuctInputs {
  cfm: string;
  shape: 'rectangular' | 'circular';
  width: string;
  height: string;
  diameter: string;
  length: string;
}

interface DuctResults {
  velocity: number;
  pressureLoss: number;
  gauge: string;
  jointSpacing: number;
  hangerSpacing: number;
}
```

## Troubleshooting

### Common Issues
1. **Calculations not updating**: Check that all required inputs are filled
2. **Validation warnings**: Review input values against HVAC standards
3. **Performance issues**: Ensure calculations are optimized for real-time updates

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` to see calculation steps in browser console.

## Contributing

When contributing to the Air Duct Sizer:
1. Follow the calculation standards documented here
2. Add tests for new features
3. Update this documentation
4. Ensure SMACNA compliance for any new calculations
