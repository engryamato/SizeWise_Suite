import React from 'react';
import { DuctCalculationResult } from '../../tools/air-duct-sizer/logic';

interface ResultsDisplayProps {
  result: DuctCalculationResult | null;
  units: 'imperial' | 'metric';
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, units }) => {
  if (!result) return null;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'high': return 'text-yellow-600';
      case 'low':
      case 'critical':
        return 'text-red-600';
      default: return '';
    }
  };

  const velocityUnit = units === 'imperial' ? 'fpm' : 'm/s';
  const pressureUnit = units === 'imperial' ? 'in wg' : 'Pa';
  const gaugeUnit = units === 'imperial' ? 'gauge' : 'mm';
  const spacingUnit = units === 'imperial' ? 'ft' : 'm';

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Calculation Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium">Velocity</h3>
          <p className={getStatusClass(result.velocity.status)}>
            {result.velocity.value.toFixed(2)} {velocityUnit} - {result.velocity.status}
          </p>
        </div>
        
        <div>
          <h3 className="font-medium">Pressure Loss</h3>
          <p className={getStatusClass(result.pressureLoss.status)}>
            {result.pressureLoss.value.toFixed(4)} {pressureUnit} - {result.pressureLoss.status}
          </p>
        </div>
        
        <div>
          <h3 className="font-medium">Gauge Thickness</h3>
          <p className="text-gray-800">
            {result.gaugeThickness.value} {gaugeUnit}
          </p>
        </div>
        
        <div>
          <h3 className="font-medium">Hanger Spacing</h3>
          <p className="text-gray-800">
            {result.hangerSpacing.value} {spacingUnit}
          </p>
        </div>
      </div>
      
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Recommendations</h3>
          <div className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <div key={`${rec.title}-${index}`} className="p-3 bg-white rounded border">
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <h4 className="font-semibold mb-2">SMACNA Guidelines</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Recommended velocity: 1,500-2,000 fpm (7.5-10 m/s) for main ducts</li>
          <li>Maximum velocity: 2,500 fpm (12.5 m/s) for low-pressure systems</li>
          <li>Recommended pressure loss: 0.08 in wg/100ft (0.66 Pa/m) or less</li>
          <li>Maximum pressure loss: 0.15 in wg/100ft (1.23 Pa/m)</li>
        </ul>
      </div>
    </div>
  );
};
