import React, { useState } from 'react';
import { DuctShape, Units } from './logic';

type PressureClass = 'low' | 'medium' | 'high';

interface DuctSizerState {
  shape: DuctShape;
  units: Units;
  flowRate: string;
  dimensions: {
    width: string;
    height: string;
    diameter: string;
  };
  length: string;
  material: string;
  application: string;
  pressureClass: PressureClass;
}

interface CalculationResult {
  velocity: number;
  velocityUnit: string;
  pressureLoss: number;
  pressureLossUnit: string;
  gauge: string;
  area: number;
  areaUnit: string;
  jointSpacing: string;
  hangerSpacing: string;
  warnings: string[];
  summary: string;
}

const materialOptions = [
  { value: 'galvanized', label: 'Galvanized Steel' },
  { value: 'aluminum', label: 'Aluminum' },
  { value: 'flexible', label: 'Flexible Duct' },
];

const applicationOptions = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
];

const pressureClassOptions = [
  { value: 'low', label: 'Low (≤ 2" w.g.)' },
  { value: 'medium', label: 'Medium (2-6" w.g.)' },
  { value: 'high', label: 'High (6-10" w.g.)' },
];

// Helper functions for validation
const validateField = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  if (isNaN(Number(value)) || Number(value) <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

const validateFlowRate = (flowRate: string): string | null => {
  return validateField(flowRate, 'Flow rate');
};

const validateDimensions = (
  shape: DuctShape,
  dimensions: DuctSizerState['dimensions']
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (shape === 'rectangular') {
    const widthError = validateField(dimensions.width, 'Width');
    const heightError = validateField(dimensions.height, 'Height');

    if (widthError) errors.width = widthError;
    if (heightError) errors.height = heightError;
  } else {
    const diameterError = validateField(dimensions.diameter, 'Diameter');
    if (diameterError) errors.diameter = diameterError;
  }

  return errors;
};

const validateLength = (length: string): string | null => {
  return validateField(length, 'Length');
};

const AirDuctSizerUI: React.FC = () => {
  const [state, setState] = useState<DuctSizerState>({
    shape: 'rectangular',
    units: 'imperial',
    flowRate: '',
    dimensions: {
      width: '',
      height: '',
      diameter: '',
    },
    length: '',
    material: 'galvanized',
    application: 'commercial',
    pressureClass: 'low',
  });

  const [results, setResults] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate flow rate
    const flowRateError = validateFlowRate(state.flowRate);
    if (flowRateError) newErrors.flowRate = flowRateError;

    // Validate dimensions
    const dimensionErrors = validateDimensions(state.shape, state.dimensions);
    Object.assign(newErrors, dimensionErrors);

    // Validate length
    const lengthError = validateLength(state.length);
    if (lengthError) newErrors.length = lengthError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock calculation - replace with actual calculations
      const mockResult: CalculationResult = {
        velocity: 12.5,
        velocityUnit: 'fpm',
        pressureLoss: 0.1,
        pressureLossUnit: 'in wg/100ft',
        gauge: '22',
        area:
          state.shape === 'rectangular'
            ? (Number(state.dimensions.width) * Number(state.dimensions.height)) / 144
            : (Math.PI * Math.pow(Number(state.dimensions.diameter) / 2, 2)) / 144,
        areaUnit: 'ft²',
        jointSpacing: '5 ft',
        hangerSpacing: '8 ft',
        warnings: [],
        summary: `Duct sizing complete for ${state.material} duct in ${state.application} application.`,
      };

      setResults(mockResult);
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: keyof Omit<DuctSizerState, 'dimensions'>, value: string) => {
    setState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDimensionChange = (field: keyof DuctSizerState['dimensions'], value: string) => {
    setState(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <header className="text-center mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl">
                Air Duct Sizer
              </h1>
              <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                Calculate the optimal duct size and specifications for your HVAC system
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6 p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Duct Specifications
                  </h3>
                  <div className="space-y-4">
                    {/* Duct Shape */}
                    <div>
                      <label
                        htmlFor="ductShape"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Duct Shape
                      </label>
                      <div className="relative">
                        <select
                          id="ductShape"
                          value={state.shape}
                          onChange={e => handleInputChange('shape', e.target.value as DuctShape)}
                          className="appearance-none mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2.5 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out cursor-pointer"
                        >
                          <option value="rectangular">Rectangular</option>
                          <option value="round">Round</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Units */}
                    <div>
                      <label
                        htmlFor="units"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Units
                      </label>
                      <div className="relative">
                        <select
                          id="units"
                          value={state.units}
                          onChange={e => handleInputChange('units', e.target.value as Units)}
                          className="appearance-none mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2.5 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out cursor-pointer"
                        >
                          <option value="imperial">Imperial (in, ft, CFM)</option>
                          <option value="metric">Metric (mm, m, m³/h)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Flow Rate */}
                    <div>
                      <label
                        htmlFor="flowRate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Flow Rate ({state.units === 'imperial' ? 'CFM' : 'm³/h'})
                      </label>
                      <input
                        type="number"
                        id="flowRate"
                        value={state.flowRate}
                        onChange={e => handleInputChange('flowRate', e.target.value)}
                        className={`mt-1 block w-full bg-white border ${errors.flowRate ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} rounded-md shadow-sm py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm transition duration-150 ease-in-out`}
                        placeholder={`Enter flow rate in ${state.units === 'imperial' ? 'CFM' : 'm³/h'}`}
                        min="0"
                        step="0.01"
                      />
                      {errors.flowRate && (
                        <p className="mt-1 text-sm text-red-600">{errors.flowRate}</p>
                      )}
                    </div>

                    {/* Dimensions */}
                    {state.shape === 'rectangular' ? (
                      <>
                        <div>
                          <label
                            htmlFor="width"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Width ({state.units === 'imperial' ? 'in' : 'mm'})
                          </label>
                          <input
                            type="number"
                            id="width"
                            value={state.dimensions.width}
                            onChange={e => handleDimensionChange('width', e.target.value)}
                            className={`mt-1 block w-full bg-white border ${errors.width ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} rounded-md shadow-sm py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm transition duration-150 ease-in-out`}
                            placeholder={`Enter width in ${state.units === 'imperial' ? 'inches' : 'millimeters'}`}
                            min="0"
                            step="0.01"
                          />
                          {errors.width && (
                            <p className="mt-1 text-sm text-red-600">{errors.width}</p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="height"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Height ({state.units === 'imperial' ? 'in' : 'mm'})
                          </label>
                          <input
                            type="number"
                            id="height"
                            value={state.dimensions.height}
                            onChange={e => handleDimensionChange('height', e.target.value)}
                            className={`mt-1 block w-full bg-white border ${errors.height ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} rounded-md shadow-sm py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm transition duration-150 ease-in-out`}
                            placeholder={`Enter height in ${state.units === 'imperial' ? 'inches' : 'millimeters'}`}
                            min="0"
                            step="0.01"
                          />
                          {errors.height && (
                            <p className="mt-1 text-sm text-red-600">{errors.height}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div>
                        <label
                          htmlFor="diameter"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Diameter ({state.units === 'imperial' ? 'in' : 'mm'})
                        </label>
                        <input
                          type="number"
                          id="diameter"
                          value={state.dimensions.diameter}
                          onChange={e => handleDimensionChange('diameter', e.target.value)}
                          className={`mt-1 block w-full bg-white border ${errors.diameter ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} rounded-md shadow-sm py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm transition duration-150 ease-in-out`}
                          placeholder={`Enter diameter in ${state.units === 'imperial' ? 'inches' : 'millimeters'}`}
                          min="0"
                          step="0.01"
                        />
                        {errors.diameter && (
                          <p className="mt-1 text-sm text-red-600">{errors.diameter}</p>
                        )}
                      </div>
                    )}

                    {/* Length */}
                    <div>
                      <label
                        htmlFor="length"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Length ({state.units === 'imperial' ? 'ft' : 'm'})
                      </label>
                      <input
                        type="number"
                        id="length"
                        value={state.length}
                        onChange={e => handleInputChange('length', e.target.value)}
                        className={`mt-1 block w-full bg-white border ${errors.length ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} rounded-md shadow-sm py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm transition duration-150 ease-in-out`}
                        placeholder={`Enter length in ${state.units === 'imperial' ? 'feet' : 'meters'}`}
                        min="0"
                        step="0.01"
                      />
                      {errors.length && (
                        <p className="mt-1 text-sm text-red-600">{errors.length}</p>
                      )}
                    </div>

                    {/* Material */}
                    <div>
                      <label
                        htmlFor="material"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Material
                      </label>
                      <div className="relative">
                        <select
                          id="material"
                          value={state.material}
                          onChange={e => handleInputChange('material', e.target.value)}
                          className="appearance-none mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2.5 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out cursor-pointer"
                        >
                          {materialOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Application */}
                    <div>
                      <label
                        htmlFor="application"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Application
                      </label>
                      <div className="relative">
                        <select
                          id="application"
                          value={state.application}
                          onChange={e => handleInputChange('application', e.target.value)}
                          className="appearance-none mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2.5 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out cursor-pointer"
                        >
                          {applicationOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Pressure Class */}
                    <div>
                      <label
                        htmlFor="pressureClass"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Pressure Class
                      </label>
                      <div className="relative">
                        <select
                          id="pressureClass"
                          value={state.pressureClass}
                          onChange={e =>
                            handleInputChange('pressureClass', e.target.value as PressureClass)
                          }
                          className="appearance-none mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2.5 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out cursor-pointer"
                        >
                          {pressureClassOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {isLoading ? 'Calculating...' : 'Calculate'}
                    </button>
                  </div>
                </div>

                {/* Right Column - Results */}
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-inner">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      How to Use
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li>• Enter the required dimensions based on your duct shape</li>
                      <li>• Specify the flow rate in CFM or m³/h</li>
                      <li>• Select the appropriate material and application type</li>
                      <li>• Click Calculate to see the results</li>
                    </ul>
                  </div>

                  {isLoading && (
                    <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-xl flex items-center justify-center shadow-sm">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mr-3"></div>
                      <span className="text-yellow-800">Calculating results...</span>
                    </div>
                  )}

                  {results && !isLoading && (
                    <div className="space-y-5 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Results</h3>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Flow Area:</span>
                          <span className="text-sm font-medium">
                            {results.area.toFixed(2)} {results.areaUnit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Air Velocity:</span>
                          <span className="text-sm font-medium">
                            {results.velocity} {results.velocityUnit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Pressure Loss:</span>
                          <span className="text-sm font-medium">
                            {results.pressureLoss} {results.pressureLossUnit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Recommended Gauge:</span>
                          <span className="text-sm font-medium">{results.gauge} gauge</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Joint Spacing:</span>
                          <span className="text-sm font-medium">{results.jointSpacing}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Hanger Spacing:</span>
                          <span className="text-sm font-medium">{results.hangerSpacing}</span>
                        </div>
                      </div>

                      {results.warnings && results.warnings.length > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <h4 className="text-sm font-medium text-yellow-800 mb-1">Warnings:</h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            {results.warnings.map(warning => (
                              <li key={warning}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">{results.summary}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirDuctSizerUI;
