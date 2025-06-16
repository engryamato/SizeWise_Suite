import { DuctResults, ResultItem, ResultsSummary } from '@/types/ductResults';

export function processDuctResults(data: DuctResults): {
  results: ResultItem[];
  summary: ResultsSummary;
} {
  const results: ResultItem[] = [];
  const issues: string[] = [];

  // Add basic duct information
  results.push({
    parameter: 'Duct Size',
    value:
      data.shape === 'round'
        ? `${data.dimensions.diameter} ${data.units.length} (Round)`
        : `${data.dimensions.width} × ${data.dimensions.height} ${data.units.length}`,
    status: 'info',
    reference: 'User Input',
  });

  // Add airflow
  results.push({
    parameter: 'Airflow',
    value: `${data.airflow} ${data.units.airflow.toUpperCase()}`,
    status: 'info',
    reference: 'User Input',
  });

  // Add velocity
  const velocityStatus: 'success' | 'warning' | 'error' =
    data.velocity <= data.maxVelocity * 0.9
      ? 'success'
      : data.velocity <= data.maxVelocity
        ? 'warning'
        : 'error';

  if (velocityStatus !== 'success') {
    issues.push(
      `Velocity (${data.velocity} ${data.units.velocity}) exceeds recommended maximum (${data.maxVelocity} ${data.units.velocity})`
    );
  }

  results.push({
    parameter: 'Velocity',
    value: data.velocity,
    limit: data.maxVelocity,
    status: velocityStatus,
    reference: 'SMACNA Table 1-3',
    advice:
      velocityStatus !== 'success'
        ? 'Consider increasing duct size or reducing airflow to lower velocity.'
        : undefined,
  });

  // Add pressure drop
  results.push({
    parameter: 'Pressure Drop',
    value: `${data.pressureDrop} ${data.units.pressure}`,
    status: 'info',
    reference: 'Calculation',
  });

  // Add pressure class
  results.push({
    parameter: 'Pressure Class',
    value: `${data.pressureClass} in. WG`,
    status: 'info',
    reference: 'Selection',
  });

  // Add gauge information
  const gaugeStatus = data.materialGauge <= data.minRequiredGauge ? 'success' : 'error';
  if (gaugeStatus === 'error') {
    issues.push(
      `Material gauge (${data.materialGauge}) is thicker than required (${data.minRequiredGauge})`
    );
  }

  results.push({
    parameter: 'Gauge',
    value: data.materialGauge,
    limit: `min ${data.minRequiredGauge}`,
    status: gaugeStatus,
    reference: data.shape === 'round' ? 'SMACNA Table 6-1' : 'SMACNA Table 5-1',
    advice:
      gaugeStatus === 'error'
        ? 'Consider using a thinner gauge to save material costs.'
        : undefined,
  });

  // Add transverse joints
  const joints = data.transverseJoints.join(', ');
  results.push({
    parameter: 'Transverse Joints',
    value: joints || 'N/A',
    status: joints ? 'success' : 'error',
    reference: 'SMACNA Table 2-1',
    advice: !joints ? 'No valid joint types found for the given parameters.' : undefined,
  });

  // Add seam types
  const seams = data.seamTypes.join(', ');
  results.push({
    parameter: 'Seam Types',
    value: seams || 'N/A',
    status: seams ? 'success' : 'error',
    reference: 'SMACNA Table 2-2',
    advice: !seams ? 'No valid seam types found for the given parameters.' : undefined,
  });

  // Add hanger spacing
  const hangerStatus = data.hangerSpacing <= data.maxHangerSpacing ? 'success' : 'error';
  if (hangerStatus === 'error') {
    issues.push(
      `Hanger spacing (${data.hangerSpacing} ft) exceeds maximum allowed (${data.maxHangerSpacing} ft)`
    );
  }

  results.push({
    parameter: 'Hanger Spacing',
    value: `${data.hangerSpacing} ft`,
    limit: `max ${data.maxHangerSpacing} ft`,
    status: hangerStatus,
    reference: 'SMACNA Table 2-3',
    advice: hangerStatus === 'error' ? 'Add more supports to meet SMACNA requirements.' : undefined,
  });

  // Create summary
  const summary: ResultsSummary = {
    status: issues.length === 0 ? 'success' : issues.length > 2 ? 'error' : 'warning',
    message:
      issues.length === 0
        ? 'All parameters comply with SMACNA standards.'
        : issues.length === 1
          ? `1 issue: ${issues[0]}`
          : `${issues.length} issues found.`,
    issues,
    timestamp: new Date(),
  };

  return { results, summary };
}

export function exportToCsv(results: ResultItem[]): string {
  const headers = ['Parameter', 'Value', 'Limit', 'Status', 'Reference', 'Advice'];
  const rows = results.map(item => [
    `"${item.parameter}"`,
    `"${item.value}"`,
    `"${item.limit || ''}"`,
    `"${item.status}"`,
    `"${item.reference}"`,
    `"${item.advice || ''}"`,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'success':
      return '✓';
    case 'warning':
      return '⚠️';
    case 'error':
      return '✗';
    default:
      return 'ℹ️';
  }
}
