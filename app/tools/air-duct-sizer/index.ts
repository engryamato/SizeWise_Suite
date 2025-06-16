/**
 * Air Duct Sizer Tool - Phase 0.1
 * Professional HVAC duct sizing with SMACNA compliance
 */

export interface AirDuctSizerConfig {
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  features: {
    smacnaValidation: boolean;
    educatedMode: boolean;
    snapSummary: boolean;
  };
}

export interface DuctInputs {
  cfm: number;
  shape: 'rectangular' | 'circular';
  width?: number; // inches (for rectangular)
  height?: number; // inches (for rectangular)
  diameter?: number; // inches (for circular)
  length: number; // feet
  material?: 'galvanized' | 'stainless' | 'aluminum';
  application?: 'supply' | 'return' | 'exhaust';
}

export interface DuctResults {
  velocity: number; // ft/min
  pressureLoss: number; // in. w.g.
  gauge: string; // metal gauge
  jointSpacing: number; // feet
  hangerSpacing: number; // feet
  hydraulicDiameter: number; // inches
  area: number; // sq ft
  perimeter: number; // feet
  warnings: string[];
  snapSummary: string;
}

export interface SMACNAValidation {
  velocityCompliant: boolean;
  pressureCompliant: boolean;
  gaugeRecommendation: string;
  jointSpacingCompliant: boolean;
  hangerSpacingCompliant: boolean;
  warnings: string[];
  educationalNotes?: string[];
}

// Tool configuration
export const airDuctSizerConfig: AirDuctSizerConfig = {
  name: 'Air Duct Sizer',
  version: '0.1.0',
  description: 'Size conditioned air ducts with SMACNA compliance',
  enabled: true,
  features: {
    smacnaValidation: true,
    educatedMode: true,
    snapSummary: true,
  },
};

// Export main calculation function
export { calculateDuctSizing } from './logic';
export { validateSMACNA } from './validators';
export { generateSnapSummary } from './utils';
