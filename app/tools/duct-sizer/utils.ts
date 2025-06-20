/**
 * Air Duct Sizer - Utility Functions
 * Snap summaries, formatting, and helper functions
 */

import { DuctInputs, DuctResults } from './index';

/**
 * Generate snap summary string for quick reference
 */
export function generateSnapSummary(inputs: DuctInputs, results: DuctResults): string {
  const shapeDesc = inputs.shape === 'rectangular' 
    ? `${inputs.width}"×${inputs.height}"` 
    : `${inputs.diameter}"⌀`;
    
  const summary = [
    `${inputs.cfm} CFM`,
    shapeDesc,
    `${results.velocity} ft/min`,
    `${results.pressureLoss}" w.g.`,
    `${results.gauge} ga`,
    `${inputs.length}' long`
  ].join(' • ');

  return summary;
}

/**
 * Format velocity with appropriate units and color coding
 */
export function formatVelocity(velocity: number, application: string = 'supply'): {
  value: string;
  unit: string;
  status: 'optimal' | 'acceptable' | 'warning' | 'error';
  color: string;
} {
  const velocityLimits = {
    supply: { min: 800, max: 2500, optimal: { min: 1200, max: 2000 } },
    return: { min: 600, max: 2000, optimal: { min: 800, max: 1500 } },
    exhaust: { min: 1000, max: 3000, optimal: { min: 1500, max: 2500 } }
  };

  const limits = velocityLimits[application as keyof typeof velocityLimits] || velocityLimits.supply;
  
  let status: 'optimal' | 'acceptable' | 'warning' | 'error';
  let color: string;

  if (velocity < limits.min || velocity > limits.max) {
    status = 'error';
    color = 'text-red-600 dark:text-red-400';
  } else if (velocity < limits.optimal.min || velocity > limits.optimal.max) {
    status = 'warning';
    color = 'text-yellow-600 dark:text-yellow-400';
  } else {
    status = 'optimal';
    color = 'text-green-600 dark:text-green-400';
  }

  return {
    value: velocity.toLocaleString(),
    unit: 'ft/min',
    status,
    color
  };
}

/**
 * Format pressure loss with appropriate precision and status
 */
export function formatPressureLoss(pressureLoss: number): {
  value: string;
  unit: string;
  status: 'good' | 'acceptable' | 'high' | 'excessive';
  color: string;
} {
  let status: 'good' | 'acceptable' | 'high' | 'excessive';
  let color: string;

  if (pressureLoss <= 0.05) {
    status = 'good';
    color = 'text-green-600 dark:text-green-400';
  } else if (pressureLoss <= 0.08) {
    status = 'acceptable';
    color = 'text-blue-600 dark:text-blue-400';
  } else if (pressureLoss <= 0.12) {
    status = 'high';
    color = 'text-yellow-600 dark:text-yellow-400';
  } else {
    status = 'excessive';
    color = 'text-red-600 dark:text-red-400';
  }

  return {
    value: pressureLoss.toFixed(3),
    unit: 'in. w.g.',
    status,
    color
  };
}

/**
 * Get material properties for calculations
 */
export function getMaterialProperties(material: string) {
  const materials = {
    galvanized: {
      name: 'Galvanized Steel',
      roughness: 0.0003, // feet
      density: 490, // lb/ft³
      cost: 1.0, // relative cost factor
      corrosionResistance: 'good'
    },
    stainless: {
      name: 'Stainless Steel',
      roughness: 0.00015,
      density: 500,
      cost: 3.5,
      corrosionResistance: 'excellent'
    },
    aluminum: {
      name: 'Aluminum',
      roughness: 0.00015,
      density: 170,
      cost: 2.0,
      corrosionResistance: 'excellent'
    }
  };

  return materials[material as keyof typeof materials] || materials.galvanized;
}

/**
 * Calculate equivalent diameter for rectangular ducts
 */
export function calculateEquivalentDiameter(width: number, height: number): number {
  // Equivalent diameter formula: De = 1.3 * (a*b)^0.625 / (a+b)^0.25
  return 1.3 * Math.pow(width * height, 0.625) / Math.pow(width + height, 0.25);
}

/**
 * Convert between different duct shapes while maintaining area
 */
export function convertDuctShape(
  fromShape: 'rectangular' | 'circular',
  toShape: 'rectangular' | 'circular',
  dimensions: { width?: number; height?: number; diameter?: number }
): { width?: number; height?: number; diameter?: number } {
  if (fromShape === toShape) return dimensions;

  if (fromShape === 'rectangular' && toShape === 'circular') {
    if (!dimensions.width || !dimensions.height) {
      throw new Error('Width and height required for rectangular to circular conversion');
    }
    
    const area = dimensions.width * dimensions.height;
    const diameter = Math.sqrt(4 * area / Math.PI);
    
    return { diameter: Math.round(diameter * 100) / 100 };
  } else if (fromShape === 'circular' && toShape === 'rectangular') {
    if (!dimensions.diameter) {
      throw new Error('Diameter required for circular to rectangular conversion');
    }
    
    const area = Math.PI * Math.pow(dimensions.diameter, 2) / 4;
    
    // Use common aspect ratios for rectangular ducts
    const aspectRatio = 1.5; // width:height ratio
    const height = Math.sqrt(area / aspectRatio);
    const width = area / height;
    
    return {
      width: Math.round(width * 100) / 100,
      height: Math.round(height * 100) / 100
    };
  }

  return dimensions;
}

/**
 * Generate educational content based on calculation results
 */
export function generateEducationalContent(inputs: DuctInputs, results: DuctResults): string[] {
  const content: string[] = [];

  // Velocity education
  if (results.velocity > 2000) {
    content.push('High velocity systems provide compact ductwork but may increase noise levels. Consider acoustic treatment.');
  } else if (results.velocity < 1000) {
    content.push('Low velocity systems are quieter but require larger ductwork. Ensure adequate air mixing.');
  }

  // Pressure loss education
  if (results.pressureLoss > 0.1) {
    content.push('High pressure losses increase fan energy consumption. Consider larger duct sizes to reduce operating costs.');
  }

  // Material education
  const material = inputs.material || 'galvanized';
  if (material === 'stainless') {
    content.push('Stainless steel provides excellent corrosion resistance for harsh environments but increases material costs.');
  } else if (material === 'aluminum') {
    content.push('Aluminum offers good corrosion resistance and lighter weight, ideal for rooftop installations.');
  }

  // Shape education
  if (inputs.shape === 'circular') {
    content.push('Circular ducts provide the lowest pressure loss per unit area but may be more expensive to fabricate.');
  } else {
    content.push('Rectangular ducts are easier to fabricate and install in tight spaces but have higher pressure losses.');
  }

  return content;
}

/**
 * Validate input ranges and provide helpful feedback
 */
export function validateInputRanges(inputs: Partial<DuctInputs>): {
  valid: boolean;
  errors: string[];
  suggestions: string[];
} {
  const errors: string[] = [];
  const suggestions: string[] = [];

  // CFM validation
  if (inputs.cfm !== undefined) {
    if (inputs.cfm <= 0) {
      errors.push('CFM must be greater than 0');
    } else if (inputs.cfm > 100000) {
      suggestions.push('Very high CFM values may require special consideration for duct design');
    } else if (inputs.cfm < 50) {
      suggestions.push('Very low CFM values may not provide adequate air circulation');
    }
  }

  // Dimension validation
  if (inputs.shape === 'rectangular') {
    if (inputs.width && inputs.width > 120) {
      suggestions.push('Duct widths over 120" may require special reinforcement');
    }
    if (inputs.height && inputs.height > 120) {
      suggestions.push('Duct heights over 120" may require special reinforcement');
    }
    if (inputs.width && inputs.height && inputs.width / inputs.height > 8) {
      suggestions.push('High aspect ratios (>8:1) may cause uneven air distribution');
    }
  } else if (inputs.shape === 'circular') {
    if (inputs.diameter && inputs.diameter > 120) {
      suggestions.push('Large diameter ducts may require special fabrication techniques');
    }
  }

  // Length validation
  if (inputs.length !== undefined) {
    if (inputs.length <= 0) {
      errors.push('Length must be greater than 0');
    } else if (inputs.length > 1000) {
      suggestions.push('Very long duct runs may require intermediate supports and expansion joints');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    suggestions
  };
}
