import React from 'react';
import { Units } from '../../tools/air-duct-sizer/logic';

interface FlowRateInputProps {
  flowRate: string;
  setFlowRate: (value: string) => void;
  units: Units;
  errors: Record<string, string>;
  flowRateId: string;
  onErrorClear: (field: string) => void;
}

export const FlowRateInput: React.FC<FlowRateInputProps> = ({
  flowRate,
  setFlowRate,
  units,
  errors,
  flowRateId,
  onErrorClear,
}) => (
  <div className="form-control">
    <label htmlFor={flowRateId} className="label">
      <span className="label-text">
        Flow Rate ({units === 'imperial' ? 'CFM' : 'm³/s'})
      </span>
    </label>
    <input
      id={flowRateId}
      type="number"
      className={`input input-bordered w-full ${errors.flowRate ? 'input-error' : ''}`}
      value={flowRate}
      onChange={(e) => {
        setFlowRate(e.target.value);
        if (errors.flowRate) {
          onErrorClear('flowRate');
        }
      }}
      min="0.1"
      step="0.1"
      aria-invalid={errors.flowRate ? 'true' : 'false'}
      aria-describedby={errors.flowRate ? `${flowRateId}-error` : ''}
    />
    {errors.flowRate && (
      <label id={`${flowRateId}-error`} className="label">
        <span className="label-text-alt text-error">{errors.flowRate}</span>
      </label>
    )}
  </div>
);
