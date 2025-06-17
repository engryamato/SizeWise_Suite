// src/core/errors.ts
export class ValidationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class CalculationError extends Error {
  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message);
    this.name = 'CalculationError';
  }
}

export class ConfigError extends Error {
  constructor(message: string, public readonly configPath?: string) {
    super(message);
    this.name = 'ConfigError';
  }
}
