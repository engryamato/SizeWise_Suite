import smacnaRules from './rules/smacna.json';

type DuctShape = 'rectangular' | 'round';
type Units = 'imperial' | 'metric';

interface DuctDimensions {
  width: number;
  height?: number;
  diameter?: number;
  length: number;
}

interface DuctCalculationResult {
  velocity: number;           // fpm or m/s
  velocityStatus: 'low' | 'good' | 'high' | 'critical';
  pressureLoss: number;       // in wg/100ft or Pa/m
  pressureLossStatus: 'good' | 'high' | 'critical';
  gauge: number;              // gauge number
  hangerSpacing: number;      // feet or meters
  warnings: string[];
}

export class AirDuctSizer {
  private shape: DuctShape;
  private dimensions: DuctDimensions;
  private flowRate: number;  // CFM or m³/s
  private units: Units;

  constructor(shape: DuctShape, dimensions: DuctDimensions, flowRate: number, units: Units = 'imperial') {
    this.shape = shape;
    this.dimensions = dimensions;
    this.flowRate = flowRate;
    this.units = units;
  }

  calculate(): DuctCalculationResult {
    const area = this.calculateArea();
    const velocity = this.calculateVelocity(area);
    const pressureLoss = this.calculatePressureLoss(velocity, area);
    const gauge = this.calculateGauge();
    const hangerSpacing = this.calculateHangerSpacing();
    
    // Convert to consistent units for the result
    const result: DuctCalculationResult = {
      // Velocity is already in correct units (fpm for imperial, m/s for metric)
      velocity: velocity,
      velocityStatus: this.checkVelocityStatus(velocity),
      // Pressure loss is calculated in in wg/100ft, convert to Pa/m if metric
      pressureLoss: this.units === 'imperial' ? pressureLoss : pressureLoss * 8.2, // in wg/100ft to Pa/m
      pressureLossStatus: this.checkPressureLossStatus(pressureLoss),
      gauge,
      // Hanger spacing is calculated in feet, convert to meters if metric
      hangerSpacing: this.units === 'imperial' ? hangerSpacing : hangerSpacing * 0.3048, // ft to m
      warnings: []
    };

    this.addWarnings(result);
    return result;
  }

  private calculateArea(): number {
    if (this.shape === 'round') {
      const radius = (this.dimensions.diameter || 0) / 2;
      return Math.PI * radius * radius; // in² or m²
    } else {
      return (this.dimensions.width || 0) * (this.dimensions.height || 0); // in² or m²
    }
  }

  private calculateVelocity(area: number): number {
    // Q = V * A  =>  V = Q / A
    if (this.units === 'imperial') {
      // Convert area from in² to ft² (1 ft² = 144 in²)
      const areaFt2 = area / 144;
      // Velocity in fpm = CFM / area in ft²
      return this.flowRate / areaFt2;
    } else {
      // For metric: convert m³/s to m/s (1 m³/s = 1000 L/s)
      // Area is in m², so velocity = (m³/s) / (m²) = m/s
      return this.flowRate / area;
    }
  }

  private calculatePressureLoss(velocity: number, area: number): number {
    // Using a more realistic approach with standard duct friction loss
    const hydraulicDiameter = this.calculateHydraulicDiameter(area); // in or mm
    
    // Standard air properties at sea level
    // Air density: 0.075 lb/ft³
    // Standard pressure drop: 0.1 in wg/100ft at 4000 fpm in a 12" round duct
    
    // Convert to equivalent round diameter
    let equivalentDiameter: number;
    
    if (this.shape === 'round') {
      equivalentDiameter = hydraulicDiameter; // Already in inches
    } else {
      // For rectangular ducts, calculate equivalent diameter
      const a = this.dimensions.width || 0; // in
      const b = this.dimensions.height || 0; // in
      equivalentDiameter = 1.3 * Math.pow((a * b), 0.625) / Math.pow((a + b), 0.25);
    }
    
    // Standard air velocity for 0.1 in wg/100ft pressure drop
    const standardVelocity = 4000; // fpm
    
    // Calculate pressure drop using the square law
    // ΔP = (V / V₀)² * ΔP₀ * (D₀ / D) * (L / 100)
    // Where:
    // V = actual velocity (fpm)
    // V₀ = standard velocity (4000 fpm)
    // ΔP₀ = standard pressure drop (0.1 in wg/100ft)
    // D₀ = standard diameter (1 ft = 12 in)
    // D = actual diameter (in)
    // L = actual length (ft)
    
    const standardPressureDrop = 0.1; // in wg/100ft
    const standardDiameter = 12; // inches
    
    // Calculate pressure drop in in wg/100ft
    let pressureLoss = Math.pow(velocity / standardVelocity, 2) * 
                      standardPressureDrop * 
                      (standardDiameter / equivalentDiameter) * 
                      (this.dimensions.length / 100);
    
    // Apply reasonable bounds to the pressure drop
    // Minimum: 0.02 in wg/100ft (very low friction)
    // Maximum: 0.3 in wg/100ft (high friction, may need resizing)
    pressureLoss = Math.max(0.02, Math.min(0.3, pressureLoss));
    
    return parseFloat(pressureLoss.toFixed(4)); // Round to 4 decimal places
  }

  private calculateHydraulicDiameter(area: number): number {
    if (this.shape === 'round') {
      return this.dimensions.diameter || 0;
    } else {
      const perimeter = 2 * ((this.dimensions.width || 0) + (this.dimensions.height || 0));
      return (4 * area) / perimeter; // in or mm
    }
  }

  private calculateGauge(): number {
    const gaugeRules = smacnaRules.gaugeThickness[this.shape];
    const dimension = this.shape === 'round' 
      ? (this.dimensions.diameter ?? 0)
      : Math.max(this.dimensions.width ?? 0, this.dimensions.height ?? 0);
    
    // Find the first rule where dimension is less than or equal to maxDimension/maxDiameter
    const rule = gaugeRules.find(r => {
      const maxDim = 'maxDimension' in r ? r.maxDimension : r.maxDiameter;
      return dimension <= maxDim;
    }) || gaugeRules[gaugeRules.length - 1];
    
    return rule.gauge;
  }

  private calculateHangerSpacing(): number {
    const spacingRules = smacnaRules.hangerSpacing[this.shape];
    const dimension = this.shape === 'round' 
      ? (this.dimensions.diameter ?? 0)
      : Math.max(this.dimensions.width ?? 0, this.dimensions.height ?? 0);
    
    // Find the first rule where dimension is less than or equal to maxDimension/maxDiameter
    const rule = spacingRules.find(r => {
      const maxDim = 'maxDimension' in r ? r.maxDimension : r.maxDiameter;
      return dimension <= maxDim;
    }) || spacingRules[spacingRules.length - 1];
    
    return rule.spacing; // feet
  }

  private checkVelocityStatus(velocity: number): 'low' | 'good' | 'high' | 'critical' {
    if (velocity < smacnaRules.velocityLimits.low) return 'low';
    if (velocity > smacnaRules.velocityLimits.high) return 'critical';
    if (velocity > smacnaRules.velocityLimits.recommended) return 'high';
    return 'good';
  }

  private checkPressureLossStatus(pressureLoss: number): 'good' | 'high' | 'critical' {
    if (pressureLoss > smacnaRules.pressureLossLimits.absoluteMax) return 'critical';
    if (pressureLoss > smacnaRules.pressureLossLimits.recommendedMax) return 'high';
    return 'good';
  }

  private addWarnings(result: DuctCalculationResult): void {
    if (result.velocityStatus === 'low') {
      result.warnings.push('Velocity is too low. Risk of dust settling in the duct.');
    } else if (result.velocityStatus === 'high') {
      result.warnings.push('Velocity is higher than recommended. Consider increasing duct size.');
    } else if (result.velocityStatus === 'critical') {
      result.warnings.push('Velocity is critically high! Increase duct size immediately.');
    }

    if (result.pressureLossStatus === 'high') {
      result.warnings.push('Pressure loss is higher than recommended. Consider increasing duct size.');
    } else if (result.pressureLossStatus === 'critical') {
      result.warnings.push('Pressure loss is critically high! Redesign the duct system.');
    }
  }
}

// Helper function to create a new AirDuctSizer instance
export function createAirDuctSizer(
  shape: DuctShape,
  dimensions: DuctDimensions,
  flowRate: number,
  units: Units = 'imperial'
): AirDuctSizer {
  return new AirDuctSizer(shape, dimensions, flowRate, units);
}

// Type exports
export type { DuctShape, Units, DuctDimensions, DuctCalculationResult };
