/**
 * Air Duct Sizer - Core Calculation Logic
 * Implements SMACNA standards for duct sizing
 */

import { DuctInputs, DuctResults } from './index';
import { validateSMACNA } from './validators';
import { generateSnapSummary } from './utils';

/**
 * Main calculation function for duct sizing
 * @param inputs - Duct parameters
 * @returns Complete duct sizing results
 */
export function calculateDuctSizing(inputs: DuctInputs): DuctResults {
  // Input validation with type checking
  const cfm = typeof inputs.cfm === 'string' ? parseFloat(inputs.cfm) : inputs.cfm;
  if (isNaN(cfm) || cfm <= 0) {
    throw new Error('CFM must be a number greater than 0');
  }
  
  const inputLength = typeof inputs.length === 'string' ? parseFloat(inputs.length) : inputs.length;
  if (isNaN(inputLength) || inputLength <= 0) {
    throw new Error('Length must be a number greater than 0');
  }

  // Helper function to parse dimension value (handles both string and number)
  const parseDimension = (value: string | number | undefined): number => {
    if (value === undefined) return 0;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 0 : num;
  };

  // Parse all dimensions
  const width = parseDimension(inputs.width);
  const height = parseDimension(inputs.height);
  const diameter = parseDimension(inputs.diameter);
  const length = parseDimension(inputs.length) || inputLength;

  // Calculate geometry with proper type safety
  const geometryInputs = {
    ...inputs,
    width,
    height,
    diameter,
    length,
    cfm,
  } as const;
  
  const { area, perimeter } = calculateGeometry(geometryInputs);
  
  // Calculate hydraulic diameter
  const hydraulicDiameter = calculateHydraulicDiameter(area, perimeter);
  
  // Calculate air velocity with parsed CFM
  const velocity = calculateVelocity(cfm, area);
  
  // Calculate pressure loss using SMACNA methods with parsed length
  const pressureLoss = calculatePressureLoss(velocity, hydraulicDiameter, length, inputs.material || 'galvanized');

  // Calculate the largest duct dimension for gauge selection
  const ductSize = inputs.shape === 'rectangular'
    ? Math.max(width, height)
    : diameter;

  // Determine material gauge based on pressure, size, and application
  const gauge = determineGauge(
    pressureLoss,
    inputs.pressureClass,
    ductSize,
    inputs.application
  );
  
  // Calculate joint and hanger spacing per SMACNA
  const jointSpacing = calculateJointSpacing(velocity, inputs.shape);
  const hangerSpacing = calculateHangerSpacing(inputs.shape, gauge);
  
  // SMACNA validation with proper application fallback
  const validation = validateSMACNA({
    velocity,
    pressureLoss,
    gauge,
    jointSpacing,
    hangerSpacing,
    application: inputs.application || 'supply' as const
  });

  const results: DuctResults = {
    velocity: Math.round(velocity),
    pressureLoss: Math.round(pressureLoss * 100) / 100,
    gauge,
    jointSpacing,
    hangerSpacing,
    hydraulicDiameter: Math.round(hydraulicDiameter * 100) / 100,
    area: Math.round(area * 1000) / 1000,
    perimeter: Math.round(perimeter * 100) / 100,
    warnings: validation.warnings,
    snapSummary: generateSnapSummary(inputs, {
      velocity: Math.round(velocity),
      pressureLoss: Math.round(pressureLoss * 100) / 100,
      gauge,
      jointSpacing,
      hangerSpacing,
      hydraulicDiameter: Math.round(hydraulicDiameter * 100) / 100,
      area: Math.round(area * 1000) / 1000,
      perimeter: Math.round(perimeter * 100) / 100,
      warnings: validation.warnings,
      snapSummary: '',
    }),
  };

  return results;
}

/**
 * Calculate duct geometry (area and perimeter)
 */
function calculateGeometry(inputs: DuctInputs): { area: number; perimeter: number } {
  if (inputs.shape === 'rectangular') {
    if (!inputs.width || !inputs.height) {
      throw new Error('Width and height required for rectangular ducts');
    }
    
    // Ensure width and height are numbers
    const width = typeof inputs.width === 'string' ? parseFloat(inputs.width) : inputs.width;
    const height = typeof inputs.height === 'string' ? parseFloat(inputs.height) : inputs.height;
    
    if (isNaN(width) || isNaN(height)) {
      throw new Error('Width and height must be valid numbers');
    }
    
    const area = (width * height) / 144; // Convert sq inches to sq feet
    const perimeter = 2 * (width + height) / 12; // Convert inches to feet
    
    return { area, perimeter };
  } else {
    if (!inputs.diameter) {
      throw new Error('Diameter required for circular ducts');
    }
    
    // Ensure diameter is a number
    const diameter = typeof inputs.diameter === 'string' ? parseFloat(inputs.diameter) : inputs.diameter;
    
    if (isNaN(diameter)) {
      throw new Error('Diameter must be a valid number');
    }
    
    const area = (Math.PI * Math.pow(diameter, 2)) / (4 * 144); // Convert sq inches to sq feet
    const perimeter = (Math.PI * diameter) / 12; // Convert inches to feet
    
    return { area, perimeter };
  }
}

/**
 * Calculate hydraulic diameter
 * Dh = 4 * Area / Perimeter
 */
function calculateHydraulicDiameter(area: number, perimeter: number): number {
  return ((4 * area) / perimeter) * 12; // Convert back to inches
}

/**
 * Calculate air velocity
 * V = CFM / Area
 */
function calculateVelocity(cfm: number, area: number): number {
  return cfm / area; // ft/min
}

// Standard air properties at 70°F (21.1°C)
const STANDARD_AIR_DENSITY = 0.075; // lb/ft³
const STANDARD_KINEMATIC_VISCOSITY = 1.62e-4; // ft²/s
const GRAVITY = 32.2; // ft/s²
const INCHES_OF_WATER_PER_PSI = 27.68; // 1 psi = 27.68 in. w.g.

/**
 * Calculate pressure loss using Darcy-Weisbach equation with improved accuracy
 * Implements SMACNA standards with Colebrook-White friction factor
 */
function calculatePressureLoss(
  velocity: number, // ft/min
  hydraulicDiameter: number, // inches
  length: number, // feet
  material: 'galvanized' | 'stainless' | 'aluminum' = 'galvanized'
): number {
  // Material roughness factors (SMACNA Table 2-1) in feet
  const ROUGHNESS_FACTORS = {
    galvanized: 0.0003, // ft
    stainless: 0.00015, // ft
    aluminum: 0.00015  // ft
  } as const;

  // Input validation
  if (!(material in ROUGHNESS_FACTORS)) {
    throw new Error(`Invalid material: ${material}. Must be one of: ${Object.keys(ROUGHNESS_FACTORS).join(', ')}`);
  }
  
  const roughness = ROUGHNESS_FACTORS[material];
  
  // Convert units
  const velocityFps = velocity / 60; // ft/s
  const hydraulicDiameterFt = hydraulicDiameter / 12; // Convert inches to feet
  
  // Reynolds number (dimensionless)
  const reynolds = (velocityFps * hydraulicDiameterFt) / STANDARD_KINEMATIC_VISCOSITY;
  
  // Friction factor calculation using Swamee-Jain approximation
  // Valid for 5000 < Re < 10^8 and 10^-6 < ε/D < 10^-2
  let frictionFactor: number;
  
  if (reynolds < 2300) {
    // Laminar flow (Hagen-Poiseuille equation)
    frictionFactor = 64 / Math.max(reynolds, 1); // Prevent division by zero
  } else {
    // Turbulent flow (Swamee-Jain equation)
    const relativeRoughness = roughness / hydraulicDiameterFt;
    const term1 = relativeRoughness / 3.7;
    const term2 = 5.74 / Math.pow(reynolds, 0.9);
    
    frictionFactor = 0.25 / Math.pow(Math.log10(term1 + term2), 2);
  }
  
  // Darcy-Weisbach equation: ΔP = (f * L/D) * (ρ * V²) / (2 * g_c)
  // Where:
  // ΔP = pressure drop (lb/ft²)
  // f = Darcy friction factor (dimensionless)
  // L = length of pipe (ft)
  // D = hydraulic diameter (ft)
  // ρ = fluid density (lb/ft³)
  // V = velocity (ft/s)
  // g_c = gravitational constant (32.2 lbm·ft/lbf·s²)
  
  // Convert to inches of water column (1 lb/ft² = 0.1922 in. w.g.)
  const pressureDropPsi = (frictionFactor * (length / hydraulicDiameterFt) * 
    (STANDARD_AIR_DENSITY * velocityFps * velocityFps)) / (2 * GRAVITY);
  
  const pressureLossInWC = pressureDropPsi * INCHES_OF_WATER_PER_PSI;

  return Math.max(0, pressureLossInWC); // Ensure non-negative value
}

// SMACNA Gauge Table (Table 5-1 from SMACNA HVAC Duct Construction Standards)
// Defines minimum gauge based on duct dimension and pressure class
const SMACNA_GAUGE_TABLE = {
  // Low Pressure (0-2" w.g.)
  low: [
    { maxDimension: 6, gauge: 26 },
    { maxDimension: 12, gauge: 24 },
    { maxDimension: 18, gauge: 22 },
    { maxDimension: 30, gauge: 20 },
    { maxDimension: 42, gauge: 18 },
    { maxDimension: 60, gauge: 16 },
    { maxDimension: 84, gauge: 14 },
    { maxDimension: 120, gauge: 12 },
    { maxDimension: Infinity, gauge: 10 }
  ],
  // Medium Pressure (2-6" w.g.)
  medium: [
    { maxDimension: 6, gauge: 24 },
    { maxDimension: 12, gauge: 22 },
    { maxDimension: 18, gauge: 20 },
    { maxDimension: 30, gauge: 18 },
    { maxDimension: 42, gauge: 16 },
    { maxDimension: 60, gauge: 14 },
    { maxDimension: 84, gauge: 12 },
    { maxDimension: 120, gauge: 10 },
    { maxDimension: Infinity, gauge: 8 }
  ],
  // High Pressure (6-10" w.g.)
  high: [
    { maxDimension: 6, gauge: 22 },
    { maxDimension: 12, gauge: 20 },
    { maxDimension: 18, gauge: 18 },
    { maxDimension: 30, gauge: 16 },
    { maxDimension: 42, gauge: 14 },
    { maxDimension: 60, gauge: 12 },
    { maxDimension: 84, gauge: 10 },
    { maxDimension: 120, gauge: 8 },
    { maxDimension: Infinity, gauge: 6 }
  ]
} as const;

type PressureClass = keyof typeof SMACNA_GAUGE_TABLE;

/**
 * Get SMACNA-compliant gauge based on duct dimension and pressure class
 * @param dimension - Largest dimension of the duct (inches)
 * @param pressureClass - Pressure class ('low', 'medium', or 'high')
 * @returns Recommended gauge as a number (e.g., 26, 24, 22, etc.)
 */
function getSmacnaGauge(dimension: number, pressureClass: PressureClass = 'low'): number {
  const classTable = SMACNA_GAUGE_TABLE[pressureClass] || SMACNA_GAUGE_TABLE.low;
  const entry = classTable.find(entry => dimension <= entry.maxDimension);
  return entry ? entry.gauge : 26; // Fallback to 26 gauge
}

/**
 * Get gauge adjustment based on application type
 * @param application - Application type (e.g., 'supply', 'exhaust', 'kitchen')
 * @returns Gauge adjustment (0 = no adjustment, positive = thicker gauge)
 */
function getApplicationGaugeAdjustment(application: string): number {
  switch (application?.toLowerCase()) {
    case 'exhaust':
    case 'kitchen':
    case 'bathroom':
      return 2; // Thicker gauge for harsh environments
    case 'commercial':
      return 1; // Slightly thicker for commercial
    default:
      return 0; // No adjustment for standard applications
  }
}

/**
 * Determine the appropriate gauge based on SMACNA standards and application requirements
 * @param _pressureLoss - Pressure loss in in. w.g. (not used in current implementation but kept for backward compatibility)
 * @param pressureClass - Pressure class ('low', 'medium', or 'high')
 * @param ductSize - Largest dimension of the duct (inches)
 * @param application - Application type (e.g., 'supply', 'exhaust')
 * @returns Recommended gauge as a string (e.g., '26', '24', '22')
 * @throws {Error} If required parameters are missing or invalid
 */
function determineGauge(
  _pressureLoss: number,
  pressureClass: string,
  ductSize: number | string,
  application: string
): string {
  // Validate required parameters
  if (pressureClass === undefined || pressureClass === null) {
    throw new Error('Pressure class is required');
  }
  if (ductSize === undefined || ductSize === null) {
    throw new Error('Duct size is required');
  }
  if (application === undefined || application === null) {
    throw new Error('Application type is required');
  }
  // Convert to number if needed
  const dimension = typeof ductSize === 'string' 
    ? parseFloat(ductSize) || 0 
    : ductSize;
  
  // Normalize pressure class
  let normalizedPressureClass: PressureClass = 'low';
  if (pressureClass === 'medium') {
    normalizedPressureClass = 'medium';
  } else if (pressureClass === 'high') {
    normalizedPressureClass = 'high';
  }

  // Get base gauge from SMACNA table
  const baseGauge = getSmacnaGauge(dimension, normalizedPressureClass);
  
  // Apply application-specific adjustments
  const adjustment = getApplicationGaugeAdjustment(application);
  const adjustedGauge = Math.min(26, Math.max(18, baseGauge - adjustment));
  
  return adjustedGauge.toString();
}

// Calculate joint spacing per SMACNA standards
function calculateJointSpacing(velocity: number, shape: string): number {
  // SMACNA joint spacing recommendations
  if (velocity > 2500) {
    return shape === 'rectangular' ? 4 : 6; // feet
  } else if (velocity > 2000) {
    return shape === 'rectangular' ? 6 : 8;
  } else {
    return shape === 'rectangular' ? 8 : 10;
  }
}

/**
 * Calculate hanger spacing per SMACNA standards
 */
/**
 * Calculate recommended hanger spacing based on duct gauge
 * @param gauge - The gauge of the duct material (e.g., '18', '20', '22')
 * @returns Recommended hanger spacing in feet
 */
function calculateHangerSpacing(_shape: string, gauge: string): number {
  const gaugeNum = parseInt(gauge);
  
  // Hanger spacing is the same for both rectangular and circular ducts
  // based on the gauge of the material
  if (gaugeNum >= 24) return 8; // feet
  if (gaugeNum >= 20) return 10;
  return 12;
}
