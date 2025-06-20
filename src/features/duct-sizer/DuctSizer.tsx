import { useState, useCallback } from 'react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { FormField, Input } from '../../components/shared/FormField';
import { CalculatorIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

type DuctShape = 'rectangular' | 'round';
type Units = 'imperial' | 'metric';
type Material = 'galvanized' | 'stainless' | 'aluminum' | 'flexible';
type Application = 'residential' | 'commercial' | 'industrial';
type PressureClass = 'low' | 'medium' | 'high';

interface Dimensions {
  width: string;
  height: string;
  diameter: string;
}

interface DuctSizerState {
  shape: DuctShape;
  units: Units;
  flowRate: string;
  dimensions: Dimensions;
  length: string;
  material: Material;
  application: Application;
  pressureClass: PressureClass;
}

const materialOptions = [
  { value: 'galvanized', label: 'Galvanized Steel' },
  { value: 'stainless', label: 'Stainless Steel' },
  { value: 'aluminum', label: 'Aluminum' },
  { value: 'flexible', label: 'Flexible Duct' },
];

const applicationOptions = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
];

const pressureClassOptions = [
  { value: 'low', label: 'Low Pressure (0-2" w.g.)' },
  { value: 'medium', label: 'Medium Pressure (2-6" w.g.)' },
  { value: 'high', label: 'High Pressure (6-10" w.g.)' },
];

export function DuctSizer() {
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
    pressureClass: 'medium',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleInputChange = useCallback(
    (field: string, value: string | number | Dimensions) => {
      setState((prev) => {
        if (field === 'dimensions' && typeof value === 'object') {
          return { ...prev, dimensions: value as Dimensions };
        }
        return { ...prev, [field]: value };
      });

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validateInputs = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!state.flowRate) {
      newErrors.flowRate = 'Flow rate is required';
    } else if (isNaN(Number(state.flowRate)) || Number(state.flowRate) <= 0) {
      newErrors.flowRate = 'Please enter a valid flow rate';
    }

    if (state.shape === 'rectangular') {
      if (!state.dimensions.width) {
        newErrors['dimensions.width'] = 'Width is required';
      } else if (isNaN(Number(state.dimensions.width)) || Number(state.dimensions.width) <= 0) {
        newErrors['dimensions.width'] = 'Please enter a valid width';
      }

      if (!state.dimensions.height) {
        newErrors['dimensions.height'] = 'Height is required';
      } else if (isNaN(Number(state.dimensions.height)) || Number(state.dimensions.height) <= 0) {
        newErrors['dimensions.height'] = 'Please enter a valid height';
      }
    } else {
      if (!state.dimensions.diameter) {
        newErrors['dimensions.diameter'] = 'Diameter is required';
      } else if (isNaN(Number(state.dimensions.diameter)) || Number(state.dimensions.diameter) <= 0) {
        newErrors['dimensions.diameter'] = 'Please enter a valid diameter';
      }
    }

    if (!state.length) {
      newErrors.length = 'Length is required';
    } else if (isNaN(Number(state.length)) || Number(state.length) <= 0) {
      newErrors.length = 'Please enter a valid length';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [state]);

  const calculateResults = useCallback(() => {
    if (!validateInputs()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock calculation
      const flowRate = Number(state.flowRate);
      let area = 0;
      let perimeter = 0;
      let hydraulicDiameter = 0;

      if (state.shape === 'rectangular') {
        const width = Number(state.dimensions.width);
        const height = Number(state.dimensions.height);
        area = width * height;
        perimeter = 2 * (width + height);
        hydraulicDiameter = (4 * area) / perimeter;
      } else {
        const radius = Number(state.dimensions.diameter) / 2;
        area = Math.PI * radius * radius;
        perimeter = Math.PI * 2 * radius;
        hydraulicDiameter = Number(state.dimensions.diameter);
      }

      const velocity = (flowRate / area) * (state.units === 'imperial' ? 144 : 1); // Convert to ft/s or m/s
      const length = Number(state.length);

      // Mock results
      setResults({
        velocity: velocity.toFixed(2),
        velocityUnits: state.units === 'imperial' ? 'ft/min' : 'm/s',
        pressureDrop: (length * 0.1).toFixed(3), // Mock calculation
        pressureDropUnits: state.units === 'imperial' ? 'in w.g.' : 'Pa',
        area: area.toFixed(2),
        areaUnits: state.units === 'imperial' ? 'in²' : 'mm²',
        hydraulicDiameter: hydraulicDiameter.toFixed(2),
        hydraulicDiameterUnits: state.units === 'imperial' ? 'in' : 'mm',
      });

      setIsLoading(false);
    }, 1000);
  }, [state, validateInputs]);

  // Navigation items removed - not used in this component

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Duct Sizing Calculator</h1>
        <Button variant="secondary" leftIcon={<InformationCircleIcon className="h-5 w-5" />}>
          Help
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Duct Specifications" className="overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duct Shape */}
              <FormField
                label="Duct Shape"
                htmlFor="shape"
                error={errors.shape}
              >
                <select
                  id="shape"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  value={state.shape}
                  onChange={(e) => handleInputChange('shape', e.target.value as DuctShape)}
                >
                  <option value="rectangular">Rectangular</option>
                  <option value="round">Round</option>
                </select>
              </FormField>

              {/* Units */}
              <FormField
                label="Units"
                htmlFor="units"
                error={errors.units}
              >
                <select
                  id="units"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  value={state.units}
                  onChange={(e) => handleInputChange('units', e.target.value as Units)}
                >
                  <option value="imperial">Imperial (in, ft, CFM)</option>
                  <option value="metric">Metric (mm, m, m³/h)</option>
                </select>
              </FormField>

              {/* Flow Rate */}
              <FormField
                label={`Flow Rate (${state.units === 'imperial' ? 'CFM' : 'm³/h'})`}
                htmlFor="flowRate"
                error={errors.flowRate}
                helpText="Enter the air flow rate"
              >
                <Input
                  id="flowRate"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={state.flowRate}
                  onChange={(e) => handleInputChange('flowRate', e.target.value)}
                  placeholder={state.units === 'imperial' ? 'e.g. 1000' : 'e.g. 500'}
                />
              </FormField>

              {/* Dimensions based on shape */}
              {state.shape === 'rectangular' ? (
                <>
                  <FormField
                    label={`Width (${state.units === 'imperial' ? 'in' : 'mm'})`}
                    htmlFor="width"
                    error={errors['dimensions.width']}
                  >
                    <Input
                      id="width"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={state.dimensions.width}
                      onChange={(e) =>
                        handleInputChange('dimensions', {
                          ...state.dimensions,
                          width: e.target.value,
                        })
                      }
                      placeholder={state.units === 'imperial' ? 'e.g. 12' : 'e.g. 300'}
                    />
                  </FormField>

                  <FormField
                    label={`Height (${state.units === 'imperial' ? 'in' : 'mm'})`}
                    htmlFor="height"
                    error={errors['dimensions.height']}
                  >
                    <Input
                      id="height"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={state.dimensions.height}
                      onChange={(e) =>
                        handleInputChange('dimensions', {
                          ...state.dimensions,
                          height: e.target.value,
                        })
                      }
                      placeholder={state.units === 'imperial' ? 'e.g. 8' : 'e.g. 200'}
                    />
                  </FormField>
                </>
              ) : (
                <FormField
                  label={`Diameter (${state.units === 'imperial' ? 'in' : 'mm'})`}
                  htmlFor="diameter"
                  error={errors['dimensions.diameter']}
                >
                  <Input
                    id="diameter"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={state.dimensions.diameter}
                    onChange={(e) =>
                      handleInputChange('dimensions', {
                        ...state.dimensions,
                        diameter: e.target.value,
                      })
                    }
                    placeholder={state.units === 'imperial' ? 'e.g. 8' : 'e.g. 200'}
                  />
                </FormField>
              )}

              {/* Length */}
              <FormField
                label={`Length (${state.units === 'imperial' ? 'ft' : 'm'})`}
                htmlFor="length"
                error={errors.length}
              >
                <Input
                  id="length"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={state.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                  placeholder={state.units === 'imperial' ? 'e.g. 10' : 'e.g. 3'}
                />
              </FormField>

              {/* Material */}
              <FormField
                label="Material"
                htmlFor="material"
                error={errors.material}
              >
                <select
                  id="material"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  value={state.material}
                  onChange={(e) => handleInputChange('material', e.target.value as Material)}
                >
                  {materialOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Application */}
              <FormField
                label="Application"
                htmlFor="application"
                error={errors.application}
              >
                <select
                  id="application"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  value={state.application}
                  onChange={(e) => handleInputChange('application', e.target.value as Application)}
                >
                  {applicationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Pressure Class */}
              <FormField
                label="Pressure Class"
                htmlFor="pressureClass"
                error={errors.pressureClass}
              >
                <select
                  id="pressureClass"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  value={state.pressureClass}
                  onChange={(e) => handleInputChange('pressureClass', e.target.value as PressureClass)}
                >
                  {pressureClassOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={calculateResults}
                isLoading={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? 'Calculating...' : 'Calculate'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-6">
          <Card title="Results" className="h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : results ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">Air Velocity</h3>
                  <p className="mt-1 text-2xl font-semibold text-blue-600">
                    {results.velocity} <span className="text-sm font-normal">{results.velocityUnits}</span>
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Pressure Drop</h3>
                  <p className="mt-1 text-2xl font-semibold text-green-600">
                    {results.pressureDrop} <span className="text-sm font-normal">{results.pressureDropUnits}</span>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-800">Cross-Sectional Area</h3>
                  <p className="mt-1 text-xl font-semibold text-gray-700">
                    {results.area} <span className="text-sm font-normal">{results.areaUnits}</span>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-800">Hydraulic Diameter</h3>
                  <p className="mt-1 text-xl font-semibold text-gray-700">
                    {results.hydraulicDiameter} <span className="text-sm font-normal">{results.hydraulicDiameterUnits}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <CalculatorIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results yet</h3>
                <p className="mt-1 text-sm text-gray-500">Enter your duct specifications and click Calculate to see results.</p>
              </div>
            )}
          </Card>

          <Card title="Need Help?" className="bg-blue-50 border-blue-100">
            <p className="text-sm text-blue-700">
              Having trouble with your calculations? Check out our documentation or contact support.
            </p>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View Documentation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DuctSizer;
