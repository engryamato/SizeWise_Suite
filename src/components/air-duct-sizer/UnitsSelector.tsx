import React from 'react';
import { Units } from '../../tools/air-duct-sizer/logic';

interface UnitsSelectorProps {
  units: Units;
  setUnits: (units: Units) => void;
  unitsId: string;
}

export const UnitsSelector: React.FC<UnitsSelectorProps> = ({
  units,
  setUnits,
  unitsId,
}) => (
  <div className="form-control">
    <span id={`${unitsId}-label`} className="label">
      <span className="label-text">Units</span>
    </span>
    <div className="flex gap-4" role="radiogroup" aria-labelledby={`${unitsId}-label`}>
      <label className="label cursor-pointer">
        <input
          type="radio"
          id={`${unitsId}-imperial`}
          name={unitsId}
          className="radio radio-primary"
          checked={units === 'imperial'}
          onChange={() => setUnits('imperial')}
          aria-checked={units === 'imperial' ? 'true' : 'false'}
        />
        <span className="label-text ml-2">Imperial (CFM, in, ft)</span>
      </label>
      <label className="label cursor-pointer">
        <input
          type="radio"
          id={`${unitsId}-metric`}
          name={unitsId}
          className="radio radio-primary"
          checked={units === 'metric'}
          onChange={() => setUnits('metric')}
          aria-checked={units === 'metric' ? 'true' : 'false'}
        />
        <span className="label-text ml-2">Metric (m³/s, mm, m)</span>
      </label>
    </div>
  </div>
);
