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
  // Input validation
  if (inputs.cfm <= 0) {
    throw new Error('CFM must be greater than 0');
  }
  if (inputs.length <= 0) {
    throw new Error('Length must be greater than 0');
  }

  // Calculate cross-sectional area and perimeter
  const { area, perimeter } = calculateGeometry(inputs);
  
  // Calculate hydraulic diameter
  const hydraulicDiameter = calculateHydraulicDiameter(area, perimeter);
  
  // Calculate velocity
  const velocity = calculateVelocity(inputs.cfm, area);
  
  // Calculate pressure loss using SMACNA methods
  const pressureLoss = calculatePressureLoss(velocity, hydraulicDiameter, inputs.length, inputs.material);
  
  // Determine material gauge based on pressure and application
  const gauge = determineGauge(pressureLoss, inputs.application);
  
  // Calculate joint and hanger spacing per SMACNA
  const jointSpacing = calculateJointSpacing(velocity, inputs.shape);
  const hangerSpacing = calculateHangerSpacing(inputs.shape, gauge);
  
  // SMACNA validation
  const validation = validateSMACNA({
    velocity,
    pressureLoss,
    gauge,
    jointSpacing,
    hangerSpacing,
    application: inputs.application || 'supply'
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
      snapSummary: ''
    })
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
    
    const area = (inputs.width * inputs.height) / 144; // Convert sq inches to sq feet
    const perimeter = 2 * (inputs.width + inputs.height) / 12; // Convert inches to feet
    
    return { area, perimeter };
  } else {
    if (!inputs.diameter) {
      throw new Error('Diameter required for circular ducts');
    }
    
    const area = (Math.PI * Math.pow(inputs.diameter, 2)) / (4 * 144); // Convert sq inches to sq feet
    const perimeter = (Math.PI * inputs.diameter) / 12; // Convert inches to feet
    
    return { area, perimeter };
  }
}

/**
 * Calculate hydraulic diameter
 * Dh = 4 * Area / Perimeter
 */
function calculateHydraulicDiameter(area: number, perimeter: number): number {
  return (4 * area) / perimeter * 12; // Convert back to inches
}

/**
 * Calculate air velocity
 * V = CFM / Area
 */
function calculateVelocity(cfm: number, area: number): number {
  return cfm / area; // ft/min
}

/**
 * Calculate pressure loss using SMACNA friction factor method
 * Enhanced with material roughness factors
 */
function calculatePressureLoss(
  velocity: number, 
  hydraulicDiameter: number, 
  length: number, 
  material: string = 'galvanized'
): number {
  // Material roughness factors (SMACNA Table 2-1)
  const roughnessFactors = {
    galvanized: 0.0003, // feet
    stainless: 0.00015,
    aluminum: 0.00015
  };
  
  const roughness = roughnessFactors[material as keyof typeof roughnessFactors] || roughnessFactors.galvanized;
  
  // Reynolds number calculation
  const kinematicViscosity = 1.6e-4; // ft²/s for air at standard conditions
  const velocityFps = velocity / 60; // Convert ft/min to ft/s
  const hydraulicDiameterFt = hydraulicDiameter / 12; // Convert inches to feet
  
  const reynolds = (velocityFps * hydraulicDiameterFt) / kinematicViscosity;
  
  // Friction factor calculation (Colebrook-White equation approximation)
  let frictionFactor: number;
  if (reynolds < 2300) {
    // Laminar flow
    frictionFactor = 64 / reynolds;
  } else {
    // Turbulent flow - simplified approximation
    const relativeRoughness = roughness / hydraulicDiameterFt;
    frictionFactor = 0.02 * (1 + (relativeRoughness * 1000 + 100000 / reynolds) ** 0.333);
  }
  
  // Pressure loss calculation (Darcy-Weisbach based, converted to in. w.g.)
  // Use a simplified constant (0.109) for unit conversion as recommended in
  // SMACNA examples: ΔP = 0.109 * f * (L/D) * (V/1000)^2
  const pressureLoss = 0.109 * frictionFactor * (length / hydraulicDiameterFt) * Math.pow(velocity / 1000, 2);
  
  return pressureLoss; // in. w.g.
}

/**
 * Determine material gauge based on pressure and application
 * Per SMACNA Table 1-3
 */
function determineGauge(pressureLoss: number, application: string = 'supply'): string {
  // Pressure classes per SMACNA
  if (pressureLoss <= 1) {
    return application === 'supply' ? '26' : '24';
  } else if (pressureLoss <= 2) {
    return '24';
  } else if (pressureLoss <= 4) {
    return '22';
  } else if (pressureLoss <= 6) {
    return '20';
  } else {
    return '18';
  }
}

/**
 * Calculate joint spacing per SMACNA standards
 */
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
function calculateHangerSpacing(shape: string, gauge: string): number {
  const gaugeNum = parseInt(gauge);
  
  if (shape === 'rectangular') {
    if (gaugeNum >= 24) return 8; // feet
    if (gaugeNum >= 20) return 10;
    return 12;
  } else {
    // Circular ducts
    if (gaugeNum >= 24) return 8;
    if (gaugeNum >= 20) return 10;
    return 12;
  }
}
