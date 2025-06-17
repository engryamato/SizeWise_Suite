import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export type StatusType = 'compliant' | 'warning' | 'noncompliant' | 'info';

interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

const statusConfig = {
  compliant: {
    icon: CheckCircle,
    text: 'Compliant',
    bgColor: 'bg-status-compliant-100 dark:bg-status-compliant-900/20',
    textColor: 'text-status-compliant-800 dark:text-status-compliant-200',
    borderColor: 'border-status-compliant-200 dark:border-status-compliant-800',
    iconColor: 'text-status-compliant-600 dark:text-status-compliant-400',
  },
  warning: {
    icon: AlertTriangle,
    text: 'Warning',
    bgColor: 'bg-status-warning-100 dark:bg-status-warning-900/20',
    textColor: 'text-status-warning-800 dark:text-status-warning-200',
    borderColor: 'border-status-warning-200 dark:border-status-warning-800',
    iconColor: 'text-status-warning-600 dark:text-status-warning-400',
  },
  noncompliant: {
    icon: XCircle,
    text: 'Non-compliant',
    bgColor: 'bg-status-noncompliant-100 dark:bg-status-noncompliant-900/20',
    textColor: 'text-status-noncompliant-800 dark:text-status-noncompliant-200',
    borderColor: 'border-status-noncompliant-200 dark:border-status-noncompliant-800',
    iconColor: 'text-status-noncompliant-600 dark:text-status-noncompliant-400',
  },
  info: {
    icon: Info,
    text: 'Info',
    bgColor: 'bg-primary-100 dark:bg-primary-900/20',
    textColor: 'text-primary-800 dark:text-primary-200',
    borderColor: 'border-primary-200 dark:border-primary-800',
    iconColor: 'text-primary-600 dark:text-primary-400',
  },
};

const sizeConfig = {
  sm: {
    iconSize: 'w-3 h-3',
    textSize: 'text-xs',
    padding: 'px-2 py-1',
  },
  md: {
    iconSize: 'w-4 h-4',
    textSize: 'text-sm',
    padding: 'px-2.5 py-1.5',
  },
  lg: {
    iconSize: 'w-5 h-5',
    textSize: 'text-base',
    padding: 'px-3 py-2',
  },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showIcon = true,
  showText = false,
  className = '',
}) => {
  const config = statusConfig[status];
  const sizeConf = sizeConfig[size];
  const Icon = config.icon;

  if (!showIcon && !showText) {
    // Just return a colored dot
    return (
      <div
        className={`inline-block w-3 h-3 rounded-full ${config.iconColor} ${className}`}
        aria-label={config.text}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center ${sizeConf.padding} rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeConf.textSize} font-medium ${className}`}
      aria-label={config.text}
    >
      {showIcon && <Icon className={`${sizeConf.iconSize} ${showText ? 'mr-1.5' : ''}`} />}
      {showText && config.text}
    </span>
  );
};

/**
 * Get status type based on SMACNA compliance rules
 */
export function getComplianceStatus(
  value: number,
  limits: { min?: number; max?: number; warning?: number }
): StatusType {
  if (limits.min !== undefined && value < limits.min) return 'noncompliant';
  if (limits.max !== undefined && value > limits.max) return 'noncompliant';
  if (limits.warning !== undefined && value > limits.warning) return 'warning';
  return 'compliant';
}

/**
 * Get velocity status based on application type and pressure class
 */
export function getVelocityStatus(
  velocity: number,
  application: string,
  pressureClass?: string
): StatusType {
  // Base limits by application
  const baseLimits = {
    supply: { min: 800, max: 2500, warning: 2000 },
    return: { min: 600, max: 2000, warning: 1500 },
    exhaust: { min: 1000, max: 3000, warning: 2500 },
  };

  let appLimits = baseLimits[application as keyof typeof baseLimits] || baseLimits.supply;

  // Adjust limits based on pressure class
  if (pressureClass === 'medium') {
    appLimits = { ...appLimits, max: appLimits.max + 1000, warning: appLimits.warning + 500 };
  } else if (pressureClass === 'high') {
    appLimits = { ...appLimits, max: appLimits.max + 2000, warning: appLimits.warning + 1000 };
  }

  return getComplianceStatus(velocity, appLimits);
}

/**
 * Get pressure loss status based on pressure class
 */
export function getPressureLossStatus(pressureLoss: number, pressureClass?: string): StatusType {
  let limits = { max: 0.1, warning: 0.08 };

  // Adjust limits based on pressure class
  if (pressureClass === 'medium') {
    limits = { max: 0.25, warning: 0.2 };
  } else if (pressureClass === 'high') {
    limits = { max: 0.5, warning: 0.4 };
  }

  return getComplianceStatus(pressureLoss, limits);
}

export default StatusIndicator;
