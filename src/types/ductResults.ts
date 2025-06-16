import { DuctShape } from './smacna';

export type StatusType = 'success' | 'warning' | 'error' | 'info';

export interface DuctResults {
  // Basic duct information
  ductId: string;
  ductName: string;
  shape: DuctShape;

  // Dimensions
  dimensions: {
    width?: number; // inches or mm
    height?: number; // inches or mm
    diameter?: number; // inches or mm
  };

  // Airflow and velocity
  airflow: number; // CFM or L/s
  velocity: number; // FPM or m/s
  maxVelocity: number; // FPM or m/s

  // Pressure
  pressureDrop: number; // in. WG or Pa
  pressureClass: number; // in. WG or Pa

  // Material and construction
  materialGauge: number; // gauge number
  minRequiredGauge: number; // gauge number
  transverseJoints: string[];
  seamTypes: string[];

  // Support
  hangerSpacing: number; // ft or m
  maxHangerSpacing: number; // ft or m

  // Metadata
  timestamp: Date;
  notes?: string[];

  // Units
  units: {
    length: 'in' | 'mm';
    velocity: 'fpm' | 'm/s';
    pressure: 'in_wg' | 'pa';
    airflow: 'cfm' | 'lps';
  };
}

export interface ResultItem {
  parameter: string;
  value: string | number;
  limit?: string | number;
  status: StatusType;
  reference: string;
  description?: string;
  advice?: string;
}

export interface DuctResultsProps {
  // Basic duct information
  ductId: string;
  ductName: string;
  shape: DuctShape;

  // Dimensions
  dimensions: {
    width?: number; // inches or mm
    height?: number; // inches or mm
    diameter?: number; // inches or mm
  };

  // Airflow and velocity
  airflow: number; // CFM or L/s
  velocity: number; // FPM or m/s
  maxVelocity: number; // FPM or m/s

  // Pressure
  pressureDrop: number; // in. WG or Pa
  pressureClass: number; // in. WG or Pa

  // Material and construction
  materialGauge: number; // gauge number
  minRequiredGauge: number; // gauge number
  transverseJoints: string[];
  seamTypes: string[];

  // Support
  hangerSpacing: number; // ft or m
  maxHangerSpacing: number; // ft or m

  // Metadata
  timestamp: Date;
  notes?: string[];

  // Units
  units: {
    length: 'in' | 'mm';
    velocity: 'fpm' | 'm/s';
    pressure: 'in_wg' | 'pa';
    airflow: 'cfm' | 'lps';
  };
}

export interface ResultsSummary {
  status: StatusType;
  message: string;
  issues: string[];
  timestamp: Date;
}

export interface ResultsTableProps {
  results: ResultItem[];
  summary: ResultsSummary;
  onExport?: (format: 'pdf' | 'csv') => void;
  className?: string;
}
