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
    
    // Convert to metric if needed
    const result: DuctCalculationResult = {
      velocity: this.units === 'imperial' ? velocity : velocity * 0.00508, // fpm to m/s
      velocityStatus: this.checkVelocityStatus(velocity),
      pressureLoss: this.units === 'imperial' ? pressureLoss : pressureLoss * 8.2, // in wg/100ft to Pa/m
      pressureLossStatus: this.checkPressureLossStatus(pressureLoss),
      gauge,
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
      return this.flowRate / area; // fpm (CFM/in² * 144 in²/ft² = ft/min)
    } else {
      return (this.flowRate * 2119) / area; // m³/s to CFM, then to fpm
    }
  }

  private calculatePressureLoss(velocity: number, area: number): number {
    // Simplified calculation - in a real app, use SMACNA tables or more complex formulas
    const hydraulicDiameter = this.calculateHydraulicDiameter(area);
    const frictionFactor = 0.02; // Approximate for smooth ducts
    const density = 0.075; // lb/ft³ at standard conditions
    
    // Darcy-Weisbach equation (simplified)
    const pressureLoss = (frictionFactor * (this.dimensions.length / 100) * density * Math.pow(velocity / 4005, 2)) / (2 * (hydraulicDiameter / 12));
    
    return pressureLoss; // in wg/100ft
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
