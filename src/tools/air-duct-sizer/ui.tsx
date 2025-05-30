import React, { useState, useCallback } from 'react';
import { AirDuctSizer, DuctShape, Units, DuctDimensions, DuctCalculationResult } from './logic';

// Helper function to generate unique IDs for form controls
const useUniqueId = (prefix: string): string => {
  const [id] = useState(() => `${prefix}-${Math.random().toString(36).substring(2, 11)}`);
  return id;
};

  const [shape, setShape] = useState<DuctShape>('rectangular');
  const [units, setUnits] = useState<Units>('imperial');
  const [flowRate, setFlowRate] = useState<string>('');
  const [dimensions, setDimensions] = useState<DuctDimensions>({
    width: '',
    height: '',
    diameter: '',
  });
  const [length, setLength] = useState<string>('');
  const [result, setResult] = useState<DuctCalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate unique IDs for form controls
  const shapeId = React.useId();
  const unitsId = React.useId();
  const flowRateId = React.useId();
  const widthId = React.useId();
  const heightId = React.useId();
  const diameterId = React.useId();
  const lengthId = React.useId();

  const handleDimensionChange = useCallback((field: keyof DuctDimensions, value: string) => {
    setDimensions(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleErrorClear = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const validateInputs = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    // Validate flow rate
    const flowRateValue = parseFloat(flowRate);
    if (isNaN(flowRateValue) || flowRateValue <= 0) {
      newErrors.flowRate = 'Please enter a valid flow rate';
    }
    
    // Validate dimensions based on shape
    if (shape === 'rectangular') {
      const width = parseFloat(dimensions.width || '0');
      const height = parseFloat(dimensions.height || '0');
      
      if (isNaN(width) || width <= 0) {
        newErrors.width = 'Please enter a valid width';
      }
      
      if (isNaN(height) || height <= 0) {
        newErrors.height = 'Please enter a valid height';
      }
    } else {
      const diameter = parseFloat(dimensions.diameter || '0');
      if (isNaN(diameter) || diameter <= 0) {
        newErrors.diameter = 'Please enter a valid diameter';
      }
    }
    
    // Validate length
    const lengthValue = parseFloat(length);
    if (isNaN(lengthValue) || lengthValue <= 0) {
      newErrors.length = 'Please enter a valid length';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [flowRate, dimensions, shape, length]);

  const handleCalculate = useCallback(() => {
    if (!validateInputs()) return;
    
    const calculator = new AirDuctSizer({
      shape,
      units,
      flowRate: parseFloat(flowRate),
      dimensions: {
        width: dimensions.width ? parseFloat(dimensions.width) : undefined,
        height: dimensions.height ? parseFloat(dimensions.height) : undefined,
        diameter: dimensions.diameter ? parseFloat(dimensions.diameter) : undefined,
      },
      length: parseFloat(length),
    });
    
    const result = calculator.calculate();
    setResult(result);
  }, [shape, units, flowRate, dimensions, length, validateInputs]);

  const handleClear = useCallback(() => {
    setFlowRate('');
    setDimensions({ width: '', height: '', diameter: '' });
    setLength('');
    setResult(null);
    setErrors({});
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Air Duct Sizer</h1>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DuctShapeSelector 
            shape={shape}
            setShape={setShape}
            shapeId={shapeId}
          />
          
          <UnitsSelector 
            units={units}
            setUnits={setUnits}
            unitsId={unitsId}
          />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 mx-2 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-bold">Warnings</h3>
                      <div className="text-xs">
                        {result.warnings.map((warning, index) => (
                          <div key={index}>• {warning}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Enter your duct parameters and click Calculate to see results</p>
            </div>
          )}

          {/* Educational Content */}
          <div className="mt-8 text-sm text-gray-600">
            <h4 className="font-semibold mb-2">SMACNA Guidelines</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li key="velocity-guideline">Recommended velocity: 1,500-2,000 fpm (7.5-10 m/s) for main ducts</li>
              <li key="max-velocity-guideline">Maximum velocity: 2,500 fpm (12.5 m/s) for low-pressure systems</li>
              <li key="pressure-loss-guideline">Recommended pressure loss: 0.08 in wg/100ft (0.66 Pa/m) or less</li>
              <li key="max-pressure-loss-guideline">Maximum pressure loss: 0.15 in wg/100ft (1.23 Pa/m)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirDuctSizerUI;
