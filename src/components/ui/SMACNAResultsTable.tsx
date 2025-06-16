import React from 'react';
import {
  StatusIndicator,
  StatusType,
  getVelocityStatus,
  getPressureLossStatus,
} from './StatusIndicator';

interface ResultRow {
  parameter: string;
  value: string;
  limit?: string;
  status: StatusType;
  reference?: string;
  tooltip?: string;
}

interface SMACNAResultsTableProps {
  title: string;
  subtitle?: string;
  results: ResultRow[];
  snapSummary?: string;
  className?: string;
}

export const SMACNAResultsTable: React.FC<SMACNAResultsTableProps> = ({
  title,
  subtitle,
  results,
  snapSummary,
  className = '',
}) => {
  // Count status types for summary
  const statusCounts = results.reduce(
    (acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    },
    {} as Record<StatusType, number>
  );

  const hasNonCompliant = statusCounts.noncompliant > 0;
  const hasWarnings = statusCounts.warning > 0;
  const overallStatus: StatusType = hasNonCompliant
    ? 'noncompliant'
    : hasWarnings
      ? 'warning'
      : 'compliant';

  const summaryMessage = hasNonCompliant
    ? 'Parameters require attention for SMACNA compliance'
    : hasWarnings
      ? 'All parameters within limits, some approaching thresholds'
      : 'All parameters comply with SMACNA standards';

  return (
    <div className={`card ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          <StatusIndicator status={overallStatus} showIcon showText />
        </div>

        {/* Snap Summary */}
        {snapSummary && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{snapSummary}</p>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Parameter
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Value
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Limit
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {results.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {row.parameter}
                  </div>
                  {row.reference && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">{row.reference}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white font-mono">{row.value}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {row.limit || '—'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <StatusIndicator
                    status={row.status}
                    showIcon
                    size="sm"
                    className={row.tooltip ? 'cursor-help' : ''}
                    title={row.tooltip}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">{summaryMessage}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            {statusCounts.compliant > 0 && (
              <span className="flex items-center">
                <StatusIndicator status="compliant" size="sm" className="mr-1" />
                {statusCounts.compliant} Compliant
              </span>
            )}
            {statusCounts.warning > 0 && (
              <span className="flex items-center">
                <StatusIndicator status="warning" size="sm" className="mr-1" />
                {statusCounts.warning} Warning
              </span>
            )}
            {statusCounts.noncompliant > 0 && (
              <span className="flex items-center">
                <StatusIndicator status="noncompliant" size="sm" className="mr-1" />
                {statusCounts.noncompliant} Non-compliant
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-25 dark:bg-gray-850">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <StatusIndicator status="compliant" size="sm" className="mr-1" />
            Compliant
          </span>
          <span className="flex items-center">
            <StatusIndicator status="warning" size="sm" className="mr-1" />
            Warning
          </span>
          <span className="flex items-center">
            <StatusIndicator status="noncompliant" size="sm" className="mr-1" />
            Non-compliant
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper function to create results from duct calculation data
 */
export function createDuctSizerResults(
  inputs: {
    cfm: number;
    shape: string;
    width?: number;
    height?: number;
    diameter?: number;
    length: number;
    material: string;
    application: string;
  },
  results: {
    velocity: number;
    pressureLoss: number;
    gauge: string;
    jointSpacing: number;
    hangerSpacing: number;
    hydraulicDiameter: number;
    area: number;
  }
): ResultRow[] {
  const velocityStatus = getVelocityStatus(results.velocity, inputs.application);
  const pressureStatus = getPressureLossStatus(results.pressureLoss);

  // Determine gauge status based on pressure
  const gaugeNum = parseInt(results.gauge);
  let gaugeStatus: StatusType = 'compliant';
  if (results.pressureLoss > 4 && gaugeNum > 20) gaugeStatus = 'noncompliant';
  else if (results.pressureLoss > 2 && gaugeNum > 22) gaugeStatus = 'noncompliant';
  else if (results.pressureLoss > 1 && gaugeNum > 24) gaugeStatus = 'warning';

  const shapeDesc =
    inputs.shape === 'rectangular'
      ? `${inputs.width}" × ${inputs.height}"`
      : `${inputs.diameter}"⌀`;

  return [
    {
      parameter: 'Duct Size',
      value: shapeDesc,
      status: 'info' as StatusType,
      reference: `${inputs.shape} duct`,
    },
    {
      parameter: 'Airflow',
      value: `${inputs.cfm.toLocaleString()} CFM`,
      status: 'info' as StatusType,
      reference: 'Design requirement',
    },
    {
      parameter: 'Velocity',
      value: `${results.velocity.toLocaleString()} ft/min`,
      limit: getVelocityLimit(inputs.application),
      status: velocityStatus,
      reference: 'SMACNA Table 2-1',
      tooltip: getVelocityTooltip(results.velocity, inputs.application),
    },
    {
      parameter: 'Pressure Loss',
      value: `${results.pressureLoss.toFixed(3)} in. w.g.`,
      limit: '≤ 0.100 in. w.g.',
      status: pressureStatus,
      reference: 'SMACNA recommended',
      tooltip: getPressureTooltip(results.pressureLoss),
    },
    {
      parameter: 'Material Gauge',
      value: `${results.gauge} gauge`,
      limit: getGaugeLimit(results.pressureLoss),
      status: gaugeStatus,
      reference: 'SMACNA Table 1-3',
      tooltip: getGaugeTooltip(results.gauge, results.pressureLoss),
    },
    {
      parameter: 'Joint Spacing',
      value: `${results.jointSpacing} ft`,
      limit: getJointSpacingLimit(results.velocity),
      status: 'compliant' as StatusType,
      reference: 'SMACNA standards',
    },
    {
      parameter: 'Hanger Spacing',
      value: `${results.hangerSpacing} ft`,
      limit: getHangerSpacingLimit(results.gauge),
      status: 'compliant' as StatusType,
      reference: 'SMACNA standards',
    },
  ];
}

// Helper functions for limits and tooltips
function getVelocityLimit(application: string): string {
  const limits = {
    supply: '800-2500 ft/min',
    return: '600-2000 ft/min',
    exhaust: '1000-3000 ft/min',
  };
  return limits[application as keyof typeof limits] || limits.supply;
}

function getVelocityTooltip(velocity: number, application: string): string {
  if (velocity > 2500) return 'High velocity may increase noise levels';
  if (velocity < 800) return 'Low velocity may cause poor air mixing';
  return 'Velocity within recommended range';
}

function getPressureTooltip(pressureLoss: number): string {
  if (pressureLoss > 0.1) return 'High pressure loss increases energy costs';
  if (pressureLoss > 0.08) return 'Approaching maximum recommended pressure loss';
  return 'Pressure loss within acceptable range';
}

function getGaugeLimit(pressureLoss: number): string {
  if (pressureLoss > 4) return '≤ 20 gauge';
  if (pressureLoss > 2) return '≤ 22 gauge';
  if (pressureLoss > 1) return '≤ 24 gauge';
  return '≤ 26 gauge';
}

function getGaugeTooltip(gauge: string, pressureLoss: number): string {
  const gaugeNum = parseInt(gauge);
  if (pressureLoss > 2 && gaugeNum > 22) return 'Heavier gauge recommended for high pressure';
  return 'Material gauge appropriate for pressure class';
}

function getJointSpacingLimit(velocity: number): string {
  if (velocity > 2500) return '≤ 4 ft';
  if (velocity > 2000) return '≤ 6 ft';
  return '≤ 8 ft';
}

function getHangerSpacingLimit(gauge: string): string {
  const gaugeNum = parseInt(gauge);
  if (gaugeNum >= 24) return '≤ 8 ft';
  if (gaugeNum >= 20) return '≤ 10 ft';
  return '≤ 12 ft';
}

export default SMACNAResultsTable;
