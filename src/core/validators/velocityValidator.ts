// src/core/validators/velocityValidator.ts
export interface VelocityLimits {
  min: number;
  max: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface ValidationResult {
  isValid: boolean;
  status: 'low' | 'good' | 'high' | 'critical';
  message?: string;
}

export class VelocityValidator {
  static validate(velocity: number, limits: VelocityLimits): ValidationResult {
    if (velocity < limits.min) {
      return { isValid: false, status: 'low', message: 'Velocity is below minimum recommended' };
    }
    if (velocity > limits.criticalThreshold) {
      return { isValid: false, status: 'critical', message: 'Velocity exceeds critical threshold' };
    }
    if (velocity > limits.warningThreshold) {
      return { isValid: true, status: 'high', message: 'Velocity is above recommended maximum' };
    }
    if (velocity > limits.max) {
      return { isValid: true, status: 'high', message: 'Velocity is above recommended maximum' };
    }
    return { isValid: true, status: 'good' };
  }
}
