import React from 'react';
import { DuctDimensions, DuctShape, Units } from '../../tools/air-duct-sizer/logic';

interface DimensionsInputProps {
  shape: DuctShape;
  dimensions: DuctDimensions;
  units: Units;
  errors: Record<string, string>;
  widthId: string;
  heightId: string;
  diameterId: string;
  onDimensionChange: (field: keyof DuctDimensions, value: string) => void;
  onErrorClear: (field: string) => void;
}

export const DimensionsInput: React.FC<DimensionsInputProps> = ({
  shape,
  dimensions,
  units,
  errors,
  widthId,
  heightId,
  diameterId,
  onDimensionChange,
  onErrorClear,
}) => {
  const handleChange = (field: keyof DuctDimensions, value: string) => {
    onDimensionChange(field, value);
    if (errors[field]) {
      onErrorClear(field);
    }
  };

  if (shape === 'round') {
    return (
      <div className="form-control">
        <label htmlFor={diameterId} className="label">
          <span className="label-text">
            Diameter ({units === 'imperial' ? 'in' : 'mm'})
          </span>
        </label>
        <input
          id={diameterId}
          type="number"
          className={`input input-bordered w-full ${errors.diameter ? 'input-error' : ''}`}
          value={dimensions.diameter ?? ''}
          onChange={(e) => handleChange('diameter', e.target.value)}
          min="0.1"
          step="0.1"
          aria-invalid={errors.diameter ? 'true' : 'false'}
          aria-describedby={errors.diameter ? `${diameterId}-error` : ''}
        />
        {errors.diameter && (
          <label id={`${diameterId}-error`} className="label">
            <span className="label-text-alt text-error">{errors.diameter}</span>
          </label>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="form-control">
        <label htmlFor={widthId} className="label">
          <span className="label-text">Width ({units === 'imperial' ? 'in' : 'mm'})</span>
        </label>
        <input
          id={widthId}
          type="number"
          className={`input input-bordered w-full ${errors.width ? 'input-error' : ''}`}
          value={dimensions.width ?? ''}
          onChange={(e) => handleChange('width', e.target.value)}
          min="0.1"
          step="0.1"
          aria-invalid={errors.width ? 'true' : 'false'}
          aria-describedby={errors.width ? `${widthId}-error` : ''}
        />
        {errors.width && (
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
          id={heightId}
          type="number"
          className={`input input-bordered w-full ${errors.height ? 'input-error' : ''}`}
          value={dimensions.height ?? ''}
          onChange={(e) => handleChange('height', e.target.value)}
          min="0.1"
          step="0.1"
          aria-invalid={errors.height ? 'true' : 'false'}
          aria-describedby={errors.height ? `${heightId}-error` : ''}
        />
        {errors.height && (
          <label id={`${heightId}-error`} className="label">
            <span className="label-text-alt text-error">{errors.height}</span>
          </label>
        )}
      </div>
    </>
  );
};
