import React, { ChangeEvent, useCallback } from 'react';
import { DuctShape } from '../../tools/air-duct-sizer/logic';

interface DimensionsInputProps {
  shape: DuctShape;
  width: string | number;
  height: string | number;
  diameter: string | number;
  units: 'imperial' | 'metric';
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onDiameterChange: (value: string) => void;
  errors: {
    width?: string;
    height?: string;
    diameter?: string;
  };
  onErrorClear: (field: 'width' | 'height' | 'diameter') => void;
  widthId: string;
  heightId: string;
  diameterId: string;
}



export const DimensionsInput: React.FC<DimensionsInputProps> = ({
  shape,
  width,
  height,
  diameter,
  units,
  onWidthChange,
  onHeightChange,
  onDiameterChange,
  errors,
  onErrorClear,
  widthId,
  heightId,
  diameterId,
}) => {
  const getStringValue = (value: string | number | undefined): string => {
    if (value === undefined) return '';
    return typeof value === 'string' ? value : value.toString();
  };

  const handleWidthChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onWidthChange(value);
    if (errors.width) {
      onErrorClear('width');
    }
  }, [errors.width, onErrorClear, onWidthChange]);

  const handleHeightChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onHeightChange(value);
    if (errors.height) {
      onErrorClear('height');
    }
  }, [errors.height, onErrorClear, onHeightChange]);

  const handleDiameterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onDiameterChange(value);
    if (errors.diameter) {
      onErrorClear('diameter');
    }
  }, [errors.diameter, onErrorClear, onDiameterChange]);

  // Ensure we're working with string values for inputs
  const widthValue = getStringValue(width);
  const heightValue = getStringValue(height);
  const diameterValue = getStringValue(diameter);

  const hasWidthError = !!errors.width;
  const hasHeightError = !!errors.height;
  const hasDiameterError = !!errors.diameter;

  if (shape === 'rectangular') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label htmlFor={widthId} className="label">
            <span className="label-text">Width ({units === 'imperial' ? 'in' : 'mm'})</span>
          </label>
          <input
            type="number"
            id={widthId}
            className={`input input-bordered w-full ${hasWidthError ? 'input-error' : ''}`}
            placeholder={units === 'imperial' ? 'e.g. 12' : 'e.g. 300'}
            value={widthValue}
            onChange={handleWidthChange}
            min="0.1"
            step="0.1"
            aria-invalid={hasWidthError ? "true" : "false"}
            aria-describedby={hasWidthError ? `${widthId}-error` : undefined}
          />
          {hasWidthError && (
            <label id={`${widthId}-error`} className="label">
              <span className="label-text-alt text-error">{errors.width}</span>
            </label>
          )}
        </div>
        <div className="form-control">
          <label htmlFor={heightId} className="label">
            <span className="label-text">Height ({units === 'imperial' ? 'in' : 'mm'})</span>
          </label>
          <input
            type="number"
            id={heightId}
            className={`input input-bordered w-full ${hasHeightError ? 'input-error' : ''}`}
            placeholder={units === 'imperial' ? 'e.g. 8' : 'e.g. 200'}
            value={heightValue}
            onChange={handleHeightChange}
            min="0.1"
            step="0.1"
            aria-invalid={hasHeightError ? "true" : "false"}
            aria-describedby={hasHeightError ? `${heightId}-error` : undefined}
          />
          {hasHeightError && (
            <label id={`${heightId}-error`} className="label">
              <span className="label-text-alt text-error">{errors.height}</span>
            </label>
          )}
        </div>
      </div>
    );
  }

  // Round duct input
  return (
    <div className="form-control">
      <label htmlFor={diameterId} className="label">
        <span className="label-text">Diameter ({units === 'imperial' ? 'in' : 'mm'})</span>
      </label>
      <input
        type="number"
        id={diameterId}
        className={`input input-bordered w-full ${hasDiameterError ? 'input-error' : ''}`}
        placeholder={units === 'imperial' ? 'e.g. 10' : 'e.g. 250'}
        value={diameterValue}
        onChange={handleDiameterChange}
        min="0.1"
        step="0.1"
        aria-invalid={hasDiameterError ? "true" : "false"}
        aria-describedby={hasDiameterError ? `${diameterId}-error` : undefined}
      />
      {hasDiameterError && (
        <label id={`${diameterId}-error`} className="label">
          <span className="label-text-alt text-error">{errors.diameter}</span>
        </label>
      )}
    </div>
  );
};
