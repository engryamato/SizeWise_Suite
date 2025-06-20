/**
 * SMACNA Validation Rules for Air Duct Sizing
 * Based on SMACNA HVAC Duct Construction Standards, 3rd Edition
 */

import { SMACNAValidation } from './index';

interface ValidationInputs {
  velocity: number;
  pressureLoss: number;
  gauge: string;
  jointSpacing: number;
  hangerSpacing: number;
  application: string;
}

/**
 * Validate duct sizing against SMACNA standards
 */
export function validateSMACNA(inputs: ValidationInputs): SMACNAValidation {
  const warnings: string[] = [];
  const educationalNotes: string[] = [];
  
  // Velocity validation per SMACNA Table 2-1
  const velocityValidation = validateVelocity(inputs.velocity, inputs.application);
  warnings.push(...velocityValidation.warnings);
  educationalNotes.push(...velocityValidation.educationalNotes);
  
  // Pressure loss validation
  const pressureValidation = validatePressureLoss(inputs.pressureLoss);
  warnings.push(...pressureValidation.warnings);
  educationalNotes.push(...pressureValidation.educationalNotes);
  
  // Gauge validation
  const gaugeValidation = validateGauge(inputs.gauge, inputs.pressureLoss);
  warnings.push(...gaugeValidation.warnings);
  educationalNotes.push(...gaugeValidation.educationalNotes);
  
  // Joint spacing validation
  const jointValidation = validateJointSpacing(inputs.jointSpacing, inputs.velocity);
  warnings.push(...jointValidation.warnings);
  educationalNotes.push(...jointValidation.educationalNotes);
  
  // Hanger spacing validation
  const hangerValidation = validateHangerSpacing(inputs.hangerSpacing, inputs.gauge);
  warnings.push(...hangerValidation.warnings);
  educationalNotes.push(...hangerValidation.educationalNotes);

  return {
    velocityCompliant: velocityValidation.compliant,
    pressureCompliant: pressureValidation.compliant,
    gaugeRecommendation: inputs.gauge,
    jointSpacingCompliant: jointValidation.compliant,
    hangerSpacingCompliant: hangerValidation.compliant,
    warnings: warnings.filter(w => w.length > 0),
    educationalNotes: educationalNotes.filter(n => n.length > 0)
  };
}

/**
 * Validate air velocity per SMACNA recommendations
 */
function validateVelocity(velocity: number, application: string) {
  const warnings: string[] = [];
  const educationalNotes: string[] = [];
  let compliant = true;

  // SMACNA velocity recommendations by application
  const velocityLimits = {
    supply: { min: 800, max: 2500, optimal: { min: 1200, max: 2000 } },
    return: { min: 600, max: 2000, optimal: { min: 800, max: 1500 } },
    exhaust: { min: 1000, max: 3000, optimal: { min: 1500, max: 2500 } }
  };

  const limits = velocityLimits[application as keyof typeof velocityLimits] || velocityLimits.supply;

  if (velocity < limits.min) {
    warnings.push(`Velocity ${velocity} ft/min is below SMACNA minimum of ${limits.min} ft/min for ${application} air`);
    educationalNotes.push('Low velocities may cause air stratification and poor mixing');
    compliant = false;
  } else if (velocity > limits.max) {
    warnings.push(`Velocity ${velocity} ft/min exceeds SMACNA maximum of ${limits.max} ft/min for ${application} air`);
    educationalNotes.push('High velocities increase noise levels and pressure losses');
    compliant = false;
  } else if (velocity < limits.optimal.min || velocity > limits.optimal.max) {
    educationalNotes.push(`Consider optimizing velocity to ${limits.optimal.min}-${limits.optimal.max} ft/min range for best performance`);
  }

  return { compliant, warnings, educationalNotes };
}

/**
 * Validate pressure loss per SMACNA guidelines
 */
function validatePressureLoss(pressureLoss: number) {
  const warnings: string[] = [];
  const educationalNotes: string[] = [];
  let compliant = true;

  // SMACNA pressure loss recommendations (per 100 ft)
  const pressureLossLimit = 0.1; // in. w.g. per 100 ft

  if (pressureLoss > pressureLossLimit) {
    warnings.push(`Pressure loss ${pressureLoss} in. w.g. exceeds recommended ${pressureLossLimit} in. w.g. per 100 ft`);
    educationalNotes.push('High pressure losses increase fan energy consumption and operating costs');
    compliant = false;
  } else if (pressureLoss > pressureLossLimit * 0.8) {
    educationalNotes.push('Pressure loss is approaching maximum recommended values');
  }

  if (pressureLoss < 0.02) {
    educationalNotes.push('Very low pressure loss - verify duct sizing is not oversized');
  }

  return { compliant, warnings, educationalNotes };
}

/**
 * Validate material gauge selection
 */
function validateGauge(gauge: string, pressureLoss: number) {
  const warnings: string[] = [];
  const educationalNotes: string[] = [];
  let compliant = true;

  const gaugeNum = parseInt(gauge);
  
  // SMACNA gauge requirements based on pressure class
  if (pressureLoss <= 1 && gaugeNum < 26) {
    educationalNotes.push('Lighter gauge material may be suitable for low-pressure applications');
  } else if (pressureLoss > 1 && pressureLoss <= 2 && gaugeNum > 24) {
    warnings.push('Heavier gauge material recommended for medium-pressure applications');
    compliant = false;
  } else if (pressureLoss > 2 && pressureLoss <= 4 && gaugeNum > 22) {
    warnings.push('Heavier gauge material required for high-pressure applications');
    compliant = false;
  } else if (pressureLoss > 4 && gaugeNum > 20) {
    warnings.push('Heavy gauge material required for very high-pressure applications');
    compliant = false;
  }

  educationalNotes.push(`${gauge} gauge material selected based on ${pressureLoss} in. w.g. pressure loss`);

  return { compliant, warnings, educationalNotes };
}

/**
 * Validate joint spacing per SMACNA standards
 */
function validateJointSpacing(spacing: number, velocity: number) {
  const warnings: string[] = [];
  const educationalNotes: string[] = [];
  let compliant = true;

  // SMACNA joint spacing requirements
  let maxSpacing: number;
  if (velocity > 2500) {
    maxSpacing = 4;
  } else if (velocity > 2000) {
    maxSpacing = 6;
  } else {
    maxSpacing = 8;
  }

  if (spacing > maxSpacing) {
    warnings.push(`Joint spacing ${spacing} ft exceeds SMACNA maximum of ${maxSpacing} ft for ${velocity} ft/min velocity`);
    educationalNotes.push('Closer joint spacing required for high-velocity applications to prevent duct separation');
    compliant = false;
  }

  educationalNotes.push(`Joint spacing of ${spacing} ft recommended for ${velocity} ft/min velocity`);

  return { compliant, warnings, educationalNotes };
}

/**
 * Validate hanger spacing per SMACNA standards
 */
function validateHangerSpacing(spacing: number, gauge: string) {
  const warnings: string[] = [];
  const educationalNotes: string[] = [];
  let compliant = true;

  const gaugeNum = parseInt(gauge);
  
  // SMACNA hanger spacing requirements based on gauge
  let maxSpacing: number;
  if (gaugeNum >= 24) {
    maxSpacing = 8;
  } else if (gaugeNum >= 20) {
    maxSpacing = 10;
  } else {
    maxSpacing = 12;
  }

  if (spacing > maxSpacing) {
    warnings.push(`Hanger spacing ${spacing} ft exceeds SMACNA maximum of ${maxSpacing} ft for ${gauge} gauge material`);
    educationalNotes.push('Closer hanger spacing required for lighter gauge materials to prevent sagging');
    compliant = false;
  }

  educationalNotes.push(`Hanger spacing of ${spacing} ft appropriate for ${gauge} gauge material`);

  return { compliant, warnings, educationalNotes };
}
