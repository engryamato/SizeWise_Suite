import React, { ChangeEvent, useCallback } from 'react';
import { Units } from '../../tools/duct-sizer/logic';

interface FlowRateInputProps {
  flowRate: string | number;
  units: Units;
  error?: string;
  onFlowRateChange: (value: string) => void;
  onErrorClear: () => void;
  id: string;
}

export const FlowRateInput: React.FC<FlowRateInputProps> = ({
  flowRate,
  units,
  error,
  onFlowRateChange,
  onErrorClear,
  id,
}) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFlowRateChange(value);
    
    if (error) {
      onErrorClear();
    }
  }, [error, onErrorClear, onFlowRateChange]);

  // Ensure we're working with string values for the input
  const flowRateValue = typeof flowRate === 'number' ? flowRate.toString() : flowRate;
  const hasError = !!error;
  const errorId = hasError ? `${id}-error` : undefined;

  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text">Flow Rate ({units === 'imperial' ? 'CFM' : 'L/s'})</span>
      </label>
      <input
        type="number"
        id={id}
        className={`input input-bordered w-full ${hasError ? 'input-error' : ''}`}
        placeholder={units === 'imperial' ? 'e.g. 1000' : 'e.g. 500'}
        value={flowRateValue}
        onChange={handleChange}
        min="0.1"
        step="0.1"
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={errorId}
      />
      {hasError && (
        <label id={errorId} className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};
