import React from 'react';
import { DuctShape } from '../../tools/air-duct-sizer/logic';

interface DuctShapeSelectorProps {
  shape: DuctShape;
  setShape: (shape: DuctShape) => void;
  shapeId: string;
}

export const DuctShapeSelector: React.FC<DuctShapeSelectorProps> = ({
  shape,
  setShape,
  shapeId,
}) => (
  <div className="form-control">
    <span id={`${shapeId}-label`} className="label">
      <span className="label-text">Duct Shape</span>
    </span>
    <div className="flex gap-4" role="radiogroup" aria-labelledby={`${shapeId}-label`}>
      <label className="label cursor-pointer">
        <input
          type="radio"
          id={`${shapeId}-rectangular`}
          name={shapeId}
          className="radio radio-primary"
          checked={shape === 'rectangular'}
          onChange={() => setShape('rectangular')}
          aria-checked={shape === 'rectangular' ? 'true' : 'false'}
        />
        <span className="label-text ml-2">Rectangular</span>
      </label>
      <label className="label cursor-pointer">
        <input
          type="radio"
          id={`${shapeId}-round`}
          name={shapeId}
          className="radio radio-primary"
          checked={shape === 'round'}
          onChange={() => setShape('round')}
          aria-checked={shape === 'round' ? 'true' : 'false'}
        />
        <span className="label-text ml-2">Round</span>
      </label>
    </div>
  </div>
);
