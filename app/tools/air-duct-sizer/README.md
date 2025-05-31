# Air Duct Sizer - Phase 0.1

Professional HVAC duct sizing tool with SMACNA compliance and enhanced calculation engine.

## ✅ Phase 0.1 Features Implemented

### Core Functionality
- **Input Parameters**: CFM, duct shape/size, length, material, application
- **Output Results**: velocity, pressure loss, gauge, joint spacing, hanger spacing
- **SMACNA Validation**: Real-time compliance checking with warnings
- **Educational Mode**: Engineering notes and best practices
- **Snap Summary**: Quick reference output string

### Enhanced Calculations
- **Material Factors**: Galvanized steel, stainless steel, aluminum roughness
- **Application Types**: Supply, return, exhaust air with specific velocity limits
- **Pressure Loss**: Enhanced Darcy-Weisbach equation with Reynolds number
- **Gauge Selection**: SMACNA pressure class compliance
- **Spacing Calculations**: Velocity-based joint and gauge-based hanger spacing

### SMACNA Compliance Features
- **Velocity Validation**: Application-specific limits with warnings
- **Pressure Loss Limits**: Per 100 ft recommendations
- **Material Gauge**: Pressure class-based selection
- **Joint Spacing**: High-velocity requirements
- **Hanger Spacing**: Material gauge considerations

## 🏗️ File Structure

```
app/tools/air-duct-sizer/
├── index.ts              # Main exports and interfaces
├── logic.ts              # Core calculation engine
├── validators.ts         # SMACNA validation rules
├── utils.ts              # Utility functions and formatting
├── config/
│   └── defaults.json     # Tool configuration and limits
├── tests/
│   └── logic.test.ts     # Comprehensive test suite
└── README.md            # This file
```

## 🔧 Usage

### Basic Usage
```typescript
import { calculateDuctSizing } from './logic';

const inputs = {
  cfm: 1000,
  shape: 'rectangular',
  width: 12,
  height: 8,
  length: 100,
  material: 'galvanized',
  application: 'supply'
};

const results = calculateDuctSizing(inputs);
console.log(results.snapSummary);
// Output: "1000 CFM • 12"×8" • 1449 ft/min • 0.045" w.g. • 26 ga • 100' long"
```

### Validation
```typescript
import { validateSMACNA } from './validators';

const validation = validateSMACNA({
  velocity: 1449,
  pressureLoss: 0.045,
  gauge: '26',
  jointSpacing: 8,
  hangerSpacing: 8,
  application: 'supply'
});

console.log(validation.warnings);
// Array of SMACNA compliance warnings
```

## 📊 Calculation Methods

### Velocity Calculation
```
Velocity (ft/min) = CFM / Area (sq ft)
```

### Pressure Loss (Enhanced Darcy-Weisbach)
```
ΔP = f × (L/Dh) × (ρV²/2gc)
```
Where:
- f = friction factor (material and Reynolds number dependent)
- L = duct length (ft)
- Dh = hydraulic diameter (ft)
- ρ = air density
- V = velocity (ft/s)

### Material Roughness Factors
- **Galvanized Steel**: 0.0003 ft
- **Stainless Steel**: 0.00015 ft  
- **Aluminum**: 0.00015 ft

### SMACNA Velocity Limits
- **Supply Air**: 800-2500 ft/min (optimal: 1200-2000)
- **Return Air**: 600-2000 ft/min (optimal: 800-1500)
- **Exhaust Air**: 1000-3000 ft/min (optimal: 1500-2500)

## 🧪 Testing

Run the test suite:
```bash
npm test air-duct-sizer
```

### Test Coverage
- ✅ Basic rectangular and circular calculations
- ✅ Material effect validation
- ✅ SMACNA compliance checking
- ✅ Velocity and pressure loss warnings
- ✅ Input validation and error handling
- ✅ Snap summary generation

## 🎯 SMACNA Standards Compliance

### Implemented Standards
- **SMACNA HVAC Duct Construction Standards, 3rd Edition**
- **Table 1-3**: Pressure class and gauge selection
- **Table 2-1**: Velocity recommendations by application
- **Joint Spacing**: Velocity-based requirements
- **Hanger Spacing**: Material gauge requirements

### Validation Rules
- Velocity limits by application type
- Pressure loss per 100 ft limits
- Material gauge selection by pressure class
- Joint spacing for high-velocity systems
- Hanger spacing for material support

## 🔮 Future Enhancements (Phase 0.2)

### Planned Features
- **SMACNA Table Integration**: Exact friction factor tables
- **Fitting Losses**: Elbows, transitions, dampers
- **System Effect Factors**: Fan inlet/outlet conditions
- **Cost Calculations**: Material and energy costs
- **Export Functions**: PDF reports and CSV data

### Advanced Calculations
- **Multiple Duct Sections**: Series calculations
- **Optimization Algorithms**: Minimum cost sizing
- **Energy Analysis**: Annual operating costs
- **Acoustic Calculations**: Noise level predictions

## 📚 References

1. SMACNA HVAC Duct Construction Standards, 3rd Edition
2. ASHRAE Fundamentals Handbook, Chapter 21
3. ACCA Manual D - Residential Duct Systems
4. Sheet Metal and Air Conditioning Contractors' National Association

## 🤝 Contributing

When contributing to the Air Duct Sizer:

1. **Follow SMACNA Standards**: All calculations must reference published standards
2. **Add Tests**: New features require comprehensive test coverage
3. **Update Documentation**: Keep this README and API docs current
4. **Validate Results**: Test against known engineering examples

### Code Style
- Use TypeScript strict mode
- Document all public functions with JSDoc
- Include units in variable names where applicable
- Follow the established file structure

## 📄 License

Part of SizeWise Suite - Professional HVAC Engineering Tools
Licensed under MIT License
