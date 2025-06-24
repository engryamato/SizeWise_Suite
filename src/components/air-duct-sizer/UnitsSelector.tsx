import React, { useId } from 'react';
import { Units } from '../../tools/duct-sizer/logic';

interface UnitsSelectorProps {
  selectedUnits: Units;
  onUnitsChange: (units: Units) => void;
  labelId?: string;
}

export const UnitsSelector: React.FC<UnitsSelectorProps> = ({
  selectedUnits,
  onUnitsChange,
  labelId: propLabelId,
}) => {
  const radioGroupId = useId();
  const labelId = propLabelId ?? `units-label-${radioGroupId}`;
  const imperialId = `imperial-${radioGroupId}`;
  const metricId = `metric-${radioGroupId}`;

  return (
    <div className="space-y-2">
      <span id={labelId} className="block text-sm font-medium text-gray-700">
        Units
      </span>
      <div className="grid grid-cols-2 gap-3 mt-1" role="radiogroup" aria-labelledby={labelId}>
        <div>
          <input
            type="radio"
            id={imperialId}
            name={`units-${radioGroupId}`}
            className="peer hidden"
            checked={selectedUnits === 'imperial'}
            onChange={() => onUnitsChange('imperial')}
            aria-label="Imperial units (inches, feet, °F)"
          />
          <label
            htmlFor={imperialId}
            className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedUnits === 'imperial'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="sr-only">Imperial units (inches, feet, °F)</span>
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 ${
                  selectedUnits === 'imperial' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                }`}
              >
                {selectedUnits === 'imperial' && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Imperial</div>
                <div className="text-xs text-gray-500">in, ft, °F</div>
              </div>
            </div>
          </label>
        </div>
        <div>
          <input
            type="radio"
            id={metricId}
            name={`units-${radioGroupId}`}
            className="peer hidden"
            checked={selectedUnits === 'metric'}
            onChange={() => onUnitsChange('metric')}
            aria-label="Metric units (millimeters, meters, °C)"
          />
          <label
            htmlFor={metricId}
            className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedUnits === 'metric'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="sr-only">Metric units (millimeters, meters, °C)</span>
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 ${
                  selectedUnits === 'metric' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                }`}
              >
                {selectedUnits === 'metric' && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Metric</div>
                <div className="text-xs text-gray-500">mm, m, °C</div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
