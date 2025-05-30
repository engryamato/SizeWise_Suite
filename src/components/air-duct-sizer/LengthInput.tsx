import React from 'react';
import { Units } from '../../tools/air-duct-sizer/logic';

interface LengthInputProps {
  length: number;
  units: Units;
  errors: Record<string, string>;
  lengthId: string;
  onLengthChange: (value: string) => void;
  onErrorClear: (field: string) => void;
}

export const LengthInput: React.FC<LengthInputProps> = ({
  length,
  units,
  errors,
  lengthId,
  onLengthChange,
  onErrorClear,
}) => (
  <div className="form-control">
    <label htmlFor={lengthId} className="label">
      <span className="label-text">Length ({units === 'imperial' ? 'ft' : 'm'})</span>
    </label>
    <input
      id={lengthId}
      type="number"
      className={`input input-bordered w-full ${errors.length ? 'input-error' : ''}`}
      value={length ?? ''}
      onChange={(e) => {
        onLengthChange(e.target.value);
        if (errors.length) {
          onErrorClear('length');
        }
      }}
      min="0.1"
      step="0.1"
      aria-invalid={errors.length ? 'true' : 'false'}
      aria-describedby={errors.length ? `${lengthId}-error` : ''}
    />
    {errors.length && (
      <label id={`${lengthId}-error`} className="label">
        <span className="label-text-alt text-error">{errors.length}</span>
      </label>
    )}
  </div>
);
