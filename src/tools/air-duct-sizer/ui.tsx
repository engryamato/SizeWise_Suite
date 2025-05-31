import React, { useState, useCallback } from 'react';
import { DuctShape, Units } from './logic';
import { DuctShapeSelector } from '../../components/air-duct-sizer/DuctShapeSelector';
import { UnitsSelector } from '../../components/air-duct-sizer/UnitsSelector';
import { useDuctResults } from '../../hooks/useDuctResults';
import ResultsTable from '../../components/duct/ResultsTable';

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
}

interface CalculationResult {
  velocity: number;
  velocityUnit: string;
  pressureLoss: number;
  pressureLossUnit: string;
  gauge: string;
  area: number;
  areaUnit: string;
}

const AirDuctSizerUI: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<CalculationResult | null>(null);
  const { 
    calculateResults, 
    data: ductResults = [], 
    summary = '', 
    loading = false, 
    error = null, 
    resetResults 
  } = useDuctResults();

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
  });

  // Update state helper function
  const updateState = useCallback((updates: Partial<DuctSizerState>) => {
    setState(prev => ({
      ...prev,
      ...updates,
      dimensions: {
        ...prev.dimensions,
        ...(updates.dimensions || {}),
      },
    }));
  }, []);

  // Input validation function
  const validateInputs = useCallback((): boolean => {
    const validationErrors: Record<string, string> = {};
    const { shape, dimensions, flowRate, length } = state;
    
    if (!flowRate.trim()) {
      validationErrors.flowRate = 'Flow rate is required';
    } else if (isNaN(parseFloat(flowRate)) || parseFloat(flowRate) <= 0) {
      validationErrors.flowRate = 'Flow rate must be a positive number';
    }
    
    if (!length.trim()) {
      validationErrors.length = 'Duct length is required';
    } else if (isNaN(parseFloat(length)) || parseFloat(length) <= 0) {
      validationErrors.length = 'Length must be a positive number';
    }
    
    if (shape === 'rectangular') {
      if (!dimensions.width.trim()) {
        validationErrors.width = 'Width is required';
      } else if (isNaN(parseFloat(dimensions.width)) || parseFloat(dimensions.width) <= 0) {
        validationErrors.width = 'Width must be a positive number';
      }
      
      if (!dimensions.height.trim()) {
        validationErrors.height = 'Height is required';
      } else if (isNaN(parseFloat(dimensions.height)) || parseFloat(dimensions.height) <= 0) {
        validationErrors.height = 'Height must be a positive number';
      }
    } else {
      // Handle round duct validation
      const diameterValue = dimensions.diameter.trim();
      if (!diameterValue) {
        validationErrors.diameter = 'Diameter is required';
      } else if (isNaN(parseFloat(diameterValue)) || parseFloat(diameterValue) <= 0) {
        validationErrors.diameter = 'Diameter must be a positive number';
      }
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [state]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!validateInputs()) {
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    try {
      // Clear previous results
      resetResults();
      
      // Prepare duct data
      const { shape, dimensions, flowRate, length } = state;
      const flowRateNum = parseFloat(flowRate);
      const lengthNum = parseFloat(length);
      
      let width = 0;
      let height = 0;
      let diameter = 0;
      let area = 0;
      let hydraulicDiameter = 0;
      
      if (shape === 'rectangular') {
        width = parseFloat(dimensions.width);
        height = parseFloat(dimensions.height);
        const widthFt = width / 12; // Convert to feet
        const heightFt = height / 12; // Convert to feet
        area = widthFt * heightFt; // sq.ft
        const perimeter = 2 * (widthFt + heightFt); // ft
        hydraulicDiameter = (4 * area) / perimeter; // ft
      } else {
        diameter = parseFloat(dimensions.diameter);
        const diameterFt = diameter / 12; // Convert to feet
        const radius = diameterFt / 2;
        area = Math.PI * Math.pow(radius, 2); // sq.ft
        hydraulicDiameter = diameterFt; // ft
      }
      
      // Calculate velocity and pressure drop
      const velocity = flowRateNum / area;
      const pressureDrop = (0.03 * lengthNum * Math.pow(velocity / 4005, 2)) / (hydraulicDiameter * 2);
      
      // Create complete duct data object
      const ductData = {
        ductId: `duct-${Date.now()}`,
        ductName: `Duct ${new Date().toLocaleString()}`,
        shape,
        dimensions: shape === 'rectangular' 
          ? { width, height }
          : { diameter },
        airflow: flowRateNum,
        velocity,
        maxVelocity: shape === 'rectangular' ? 2000 : 2500,
        pressureDrop,
        pressureClass: 2,
        materialGauge: 0,
        minRequiredGauge: 0,
        transverseJoints: [],
        seamTypes: [],
        hangerSpacing: 10,
        maxHangerSpacing: 0,
        timestamp: new Date(),
        units: {
          length: 'in' as const,
          velocity: 'fpm' as const,
          pressure: 'in_wg' as const,
          airflow: 'cfm' as const,
        },
      };
      
      // Calculate results using the hook
      await calculateResults(ductData);
      
      // Set basic results for the legacy display
      setResults({
        velocity: Math.round(velocity * 10) / 10,
        velocityUnit: 'ft/min',
        pressureLoss: Math.round(pressureDrop * 1000) / 1000,
        pressureLossUnit: 'in wg',
        gauge: 'TBD',
        area: Math.round(area * 144 * 10) / 10,
        areaUnit: 'in²'
      });
      
    } catch (err) {
      console.error('Error calculating duct properties:', err);
      setErrors({
        submit: 'An error occurred while calculating duct properties. Please try again.'
      });
    }
  };

  // Helper function to render input field with error message
  const renderInputField = (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    error?: string,
    type = 'text',
    placeholder = '',
    disabled = false
  ) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
          error ? 'border-red-300 text-red-900 placeholder-red-300' : ''
        } ${disabled ? 'bg-gray-100' : ''}`}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  // Helper function to render radio button group
  const renderRadioGroup = (
    label: string,
    name: string,
    value: string,
    options: Array<{ value: string; label: string }>,
    onChange: (value: string) => void,
    error?: string
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="ml-2 block text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  // Helper function to render section header
  const renderSectionHeader = (title: string, description?: string) => (
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  );

  // Render function
  // State management
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<CalculationResult | null>(null);
  const { 
    calculateResults, 
    data: ductResults, 
    summary, 
    loading, 
    error, 
    resetResults 
  } = useDuctResults();

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
  });

  // Update state helper function
  const updateState = useCallback((updates: Partial<DuctSizerState>) => {
    setState(prev => ({
      ...prev,
      ...updates,
      dimensions: {
        ...prev.dimensions,
        ...(updates.dimensions ?? {}),
      },
    }));
  }, []);

  // Input validation function
  const validateInputs = useCallback(() => {
    const validationErrors: Record<string, string> = {};
    const { shape, dimensions, flowRate, length } = state;
    
    if (!flowRate.trim()) {
      validationErrors.flowRate = 'Flow rate is required';
    } else if (isNaN(parseFloat(flowRate)) || parseFloat(flowRate) <= 0) {
      validationErrors.flowRate = 'Flow rate must be a positive number';
    }
    
    if (!length.trim()) {
      validationErrors.length = 'Duct length is required';
    } else if (isNaN(parseFloat(length)) || parseFloat(length) <= 0) {
      validationErrors.length = 'Length must be a positive number';
    }
    
    if (shape === 'rectangular') {
      if (!dimensions.width.trim()) {
        validationErrors.width = 'Width is required';
      } else if (isNaN(parseFloat(dimensions.width)) || parseFloat(dimensions.width) <= 0) {
        validationErrors.width = 'Width must be a positive number';
      }
      
      if (!dimensions.height.trim()) {
        validationErrors.height = 'Height is required';
      } else if (isNaN(parseFloat(dimensions.height)) || parseFloat(dimensions.height) <= 0) {
        validationErrors.height = 'Height must be a positive number';
      }
    } else {
      // Handle round duct validation
      const diameterValue = dimensions.diameter.trim();
      if (!diameterValue) {
        validationErrors.diameter = 'Diameter is required';
      } else if (isNaN(parseFloat(diameterValue)) || parseFloat(diameterValue) <= 0) {
        validationErrors.diameter = 'Diameter must be a positive number';
      }
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [state]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!validateInputs()) {
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    try {
      // Clear previous results
      resetResults();
      
      // Prepare duct data
      const { shape, dimensions, flowRate, length } = state;
      const flowRateNum = parseFloat(flowRate);
      const lengthNum = parseFloat(length);
      
      let width = 0;
      let height = 0;
      let diameter = 0;
      let area = 0;
      let hydraulicDiameter = 0;
      
      if (shape === 'rectangular') {
        width = parseFloat(dimensions.width);
        height = parseFloat(dimensions.height);
        const widthFt = width / 12; // Convert to feet
        const heightFt = height / 12; // Convert to feet
        area = widthFt * heightFt; // sq.ft
        const perimeter = 2 * (widthFt + heightFt); // ft
        hydraulicDiameter = (4 * area) / perimeter; // ft
      } else {
        diameter = parseFloat(dimensions.diameter);
        const diameterFt = diameter / 12; // Convert to feet
        const radius = diameterFt / 2;
        area = Math.PI * Math.pow(radius, 2); // sq.ft
        hydraulicDiameter = diameterFt; // ft
      }
      
      // Calculate velocity and pressure drop
      const velocity = flowRateNum / area;
      const pressureDrop = (0.03 * lengthNum * Math.pow(velocity / 4005, 2)) / (hydraulicDiameter * 2);
      
      // Create complete duct data object
      const ductData = {
        ductId: `duct-${Date.now()}`,
        ductName: `Duct ${new Date().toLocaleString()}`,
        shape,
        dimensions: shape === 'rectangular' 
          ? { width, height }
          : { diameter },
        airflow: flowRateNum,
        velocity,
        maxVelocity: shape === 'rectangular' ? 2000 : 2500,
        pressureDrop,
        pressureClass: 2,
        materialGauge: 0,
        minRequiredGauge: 0,
        transverseJoints: [],
        seamTypes: [],
        hangerSpacing: 10,
        maxHangerSpacing: 0,
        timestamp: new Date(),
        units: {
          length: 'in' as const,
          velocity: 'fpm' as const,
          pressure: 'in_wg' as const,
          airflow: 'cfm' as const,
        },
      };
      
      // Calculate results using the hook
      await calculateResults(ductData);
      
      // Set basic results for the legacy display
      setResults({
        velocity: Math.round(velocity * 10) / 10,
        velocityUnit: 'ft/min',
        pressureLoss: Math.round(pressureDrop * 1000) / 1000,
        pressureLossUnit: 'in wg',
        gauge: 'TBD',
        area: Math.round(area * 144 * 10) / 10,
        areaUnit: 'in²'
      });
      
    } catch (error) {
      console.error('Error calculating duct properties:', error);
    }
  };

  // Helper function to render input field with error message
  const renderInputField = (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    error?: string,
    type = 'text',
    placeholder = ''
  ) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500'
          }`}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
                    </div>

  // Render function
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Air Duct Sizer</h1>
              <p className="mt-2 text-sm text-gray-600">Calculate the optimal duct size for your HVAC system</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="space-y-4">
                    <DuctShapeSelector
                      selectedShape={state.shape}
                      onShapeChange={(shape) => updateState({ shape })}
                    />
                    <UnitsSelector
                      selectedUnits={state.units}
                      onUnitsChange={(units) => updateState({ units })}
                    />
                  </div>

                  {renderInputField(
                    'flow-rate',
                    'Flow Rate (CFM)',
                    state.flowRate,
                    (value) => updateState({ flowRate: value }),
                    errors.flowRate,
                    'number',
                    'Enter flow rate in CFM'
                  )}

                  {state.shape === 'rectangular' ? (
                    <>
                      {renderInputField(
                        'width',
                        'Width (in)',
                        state.dimensions.width,
                        (value) => updateState({ dimensions: { ...state.dimensions, width: value } }),
                        errors.width,
                        'number',
                        'Enter width in inches'
                      )}
                      {renderInputField(
                        'height',
                        'Height (in)',
                        state.dimensions.height,
                        (value) => updateState({ dimensions: { ...state.dimensions, height: value } }),
                        errors.height,
                        'number',
                        'Enter height in inches'
                      )}
                    </>
                  ) : (
                    renderInputField(
                      'diameter',
                      'Diameter (in)',
                      state.dimensions.diameter,
                      (value) => updateState({ dimensions: { ...state.dimensions, diameter: value } }),
                      errors.diameter,
                      'number',
                      'Enter diameter in inches'
                    )
                  )}

                  {renderInputField(
                    'length',
                    'Duct Length (ft)',
                    state.length,
                    (value) => updateState({ length: value }),
                    errors.length,
                    'number',
                    'Enter duct length in feet'
                  )}

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      {loading ? 'Calculating...' : 'Calculate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateState({
                          flowRate: '',
                          dimensions: { width: '', height: '', diameter: '' },
                          length: ''
                        });
                        resetResults();
                      }}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      SMACNA Guidelines
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li key="velocity-guideline" className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Recommended velocity: <span className="font-medium">1,500-2,000 fpm</span> (7.5-10 m/s) for main ducts</span>
                      </li>
                      <li key="max-velocity-guideline" className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Maximum velocity: <span className="font-medium">2,500 fpm</span> (12.5 m/s) for low-pressure systems</span>
                      </li>
                      <li key="pressure-loss-guideline" className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Recommended pressure loss: <span className="font-medium">0.08 in wg/100ft</span> (0.66 Pa/m) or less</span>
                      </li>
                      <li key="max-pressure-loss-guideline" className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Maximum pressure loss: <span className="font-medium">0.15 in wg/100ft</span> (1.23 Pa/m)</span>
                  </div>
                </div>
              </div>
            </form>

            {/* Results Section */}
            {(results || (ductResults && ductResults.length > 0)) && (
              <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>

                {loading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2 text-gray-600">Calculating results...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {!loading && !error && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Velocity</h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {results?.velocity?.toFixed(2) || (ductResults?.[0]?.velocity?.toFixed(2) ?? 'N/A')}{' '}
                          <span className="text-sm text-gray-500 ml-1">fpm</span>
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Pressure Loss</h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {results?.pressureLoss?.toFixed(4) || (ductResults?.[0]?.pressureDrop?.toFixed(4) ?? 'N/A')}
                          <span className="text-sm text-gray-500 ml-1">in wg/100ft</span>
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Duct Gauge</h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {ductResults?.find((r: any) => r.parameter === 'Gauge')?.value ?? 'N/A'}{' '}
                          <span className="text-sm text-gray-500 ml-1">GA</span>
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Duct Area</h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {results?.area?.toFixed(2) || (ductResults?.[0]?.area?.toFixed(2) ?? 'N/A')}
                          <span className="text-sm text-gray-500 ml-1">in²</span>
                        </p>
                      </div>
                    </div>

                    {summary && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Summary</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">{summary}</p>
                        </div>
                      </div>
                    )}

                    {ductResults && ductResults.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Detailed Results</h3>
                        <ResultsTable results={ductResults[0]} summary={summary} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

{(results || (ductResults && ductResults.length > 0)) && (
      <section aria-labelledby="results-heading" className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 id="results-heading" className="sr-only">Results</h2>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Results</h2>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Table - Display when results are available */}
        {!loading && !error && ductResults && ductResults.length > 0 && (
          <div className="mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Duct Sizing Results</h2>
              <ResultsTable 
                results={ductResults} 
                summary={summary} 
                onExport={(format) => {
                  if (format === 'pdf') {
                    // Handle PDF export
                    console.log('Exporting to PDF');
                  }
                }} 
              />
            </div>
          </div>
        )}

        {/* Results message - Display when basic results are available but no detailed results */}
        {!loading && !error && results && (!ductResults || ductResults.length === 0) && (
          <div className="mb-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Results calculated. View the summary below.</p>
            </div>
          </div>
        )}

        {/* Initial state - No results available */}
        {!loading && !error && !results && (!ductResults || ductResults.length === 0) && (
          <div className="mb-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Fill in the form and calculate to see detailed results</p>
            </div>
          </div>
        )}

        {/* Legacy Results Summary (temporary) */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Velocity</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {results?.velocity} <span className="text-sm text-gray-500">{results?.velocityUnit}</span>
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Pressure Loss</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {results?.pressureLoss} <span className="text-sm text-gray-500">{results?.pressureLossUnit}</span>
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Duct Gauge</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {ductResults?.find((r: any) => r.parameter === 'Gauge')?.value ?? 'N/A'} GA
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Cross-Sectional Area</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {results?.area} <span className="text-sm text-gray-500">{results?.areaUnit}</span>
              </p>
            </div>
          </div>
        )}
      </section>
    )}
  </div>
</div>
);
};

export default AirDuctSizerUI;

