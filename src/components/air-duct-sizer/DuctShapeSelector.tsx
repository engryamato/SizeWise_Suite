import React, { useId } from 'react';
import { DuctShape } from '../../tools/air-duct-sizer/logic';

interface DuctShapeSelectorProps {
  selectedShape: DuctShape;
  onShapeChange: (shape: DuctShape) => void;
  labelId?: string;
}

export const DuctShapeSelector: React.FC<DuctShapeSelectorProps> = ({
  selectedShape,
  onShapeChange,
  labelId: propLabelId,
}) => {
  const isRectangular = selectedShape === 'rectangular';
  const isRound = selectedShape === 'round';

  const radioGroupId = useId();
  const labelId = propLabelId ?? `duct-shape-label-${radioGroupId}`;
  const rectangularId = `rectangular-${radioGroupId}`;
  const roundId = `round-${radioGroupId}`;

  return (
    <div className="space-y-2">
      <span id={labelId} className="block text-sm font-medium text-gray-700">
        Duct Shape
      </span>
      <div className="grid grid-cols-2 gap-3 mt-1" role="radiogroup" aria-labelledby={labelId}>
        <div>
          <input
            type="radio"
            id={rectangularId}
            name={`duct-shape-${radioGroupId}`}
            className="peer hidden"
            checked={isRectangular}
            onChange={() => onShapeChange('rectangular')}
            aria-label="Rectangular duct"
          />
          <label
            htmlFor={rectangularId}
            className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              isRectangular
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="sr-only">Rectangular duct</span>
            <div
              className={`w-6 h-6 rounded-sm mb-2 flex items-center justify-center ${
                isRectangular ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              {isRectangular && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">Rectangular</span>
          </label>
        </div>
        <div>
          <input
            type="radio"
            id={roundId}
            name={`duct-shape-${radioGroupId}`}
            className="peer hidden"
            checked={isRound}
            onChange={() => onShapeChange('round')}
            aria-label="Round duct"
          />
          <label
            htmlFor={roundId}
            className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              isRound
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="sr-only">Round duct</span>
            <div
              className={`w-6 h-6 rounded-full mb-2 flex items-center justify-center ${
                isRound ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              {isRound && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">Round</span>
          </label>
        </div>
      </div>
    </div>
  );
};
