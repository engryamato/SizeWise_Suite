import React, { ChangeEvent, useCallback } from 'react';
import { Units } from '../../tools/air-duct-sizer/logic';

interface LengthInputProps {
  length: string | number;
  units: Units;
  error?: string;
  onLengthChange: (value: string) => void;
  onErrorClear: () => void;
  id: string;
}

export const LengthInput: React.FC<LengthInputProps> = ({
  length,
  units,
  error,
  onLengthChange,
  onErrorClear,
  id,
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onLengthChange(value);

      if (error) {
        onErrorClear();
      }
    },
    [error, onErrorClear, onLengthChange]
  );

  // Ensure we're working with string values for the input
  const lengthValue = typeof length === 'number' ? length.toString() : length;
  const hasError = !!error;
  const errorId = hasError ? `${id}-error` : undefined;
  const unitLabel = units === 'imperial' ? 'ft' : 'm';
  const placeholder = units === 'imperial' ? 'e.g. 10' : 'e.g. 3';

  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text">Duct Length ({unitLabel})</span>
      </label>
      <input
        type="number"
        id={id}
        className={`input input-bordered w-full ${hasError ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={lengthValue}
        onChange={handleChange}
        min="0.1"
        step="0.1"
        aria-invalid={hasError ? 'true' : 'false'}
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
