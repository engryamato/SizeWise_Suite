import React, { useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import { SMACNAResultsTable, createDuctSizerResults } from '../components/ui/SMACNAResultsTable';

// Add JSX namespace for React
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface LocalDuctInputs {
  cfm: string;
  shape: 'rectangular' | 'circular';
  width: string;
  height: string;
  diameter: string;
  length: string;
  material: 'galvanized' | 'stainless' | 'aluminum';
  application: 'supply' | 'return' | 'exhaust';
  pressureClass: 'low' | 'medium' | 'high';
}

interface LocalDuctResults {
  velocity: number;
  pressureLoss: number;
  gauge: string;
  jointSpacing: number;
  hangerSpacing: number;
  hydraulicDiameter: number;
  area: number;
  perimeter: number;
  warnings: string[];
  snapSummary: string;
}

const DuctSizerPage: React.FC = () => {
  const [inputs, setInputs] = useState<LocalDuctInputs>({
    cfm: '1000',
    shape: 'rectangular',
    width: '12',
    height: '8',
    diameter: '',
    length: '100',
    material: 'galvanized',
    application: 'supply',
    pressureClass: 'low',
  });

  const [results, setResults] = useState<LocalDuctResults | null>(null);

  const handleInputChange = (field: keyof LocalDuctInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }) as LocalDuctInputs);
  };

  // Helper function to calculate duct geometry
  const calculateGeometry = (inputs: LocalDuctInputs) => {
    if (inputs.shape === 'rectangular') {
      const width = parseFloat(inputs.width);
      const height = parseFloat(inputs.height);
      if (!width || !height) return null;

      const area = (width * height) / 144; // Convert to sq ft
      const perimeter = (2 * (width + height)) / 12; // Convert to ft
      return { area, perimeter };
    } else {
      const diameter = parseFloat(inputs.diameter);
      if (!diameter) return null;

      const area = (Math.PI * Math.pow(diameter, 2)) / (4 * 144); // Convert to sq ft
      const perimeter = (Math.PI * diameter) / 12; // Convert to ft
      return { area, perimeter };
    }
  };

  // Helper function to determine material gauge based on multiple factors
  const determineGauge = (
    pressureLoss: number,
    pressureClass: string,
    ductSize: number,
    application: string
  ): string => {
    // Start with pressure loss based gauge
    let gaugeFromPressure = '26';
    if (pressureLoss > 0.5) gaugeFromPressure = '18';
    else if (pressureLoss > 0.3) gaugeFromPressure = '20';
    else if (pressureLoss > 0.15) gaugeFromPressure = '22';
    else if (pressureLoss > 0.08) gaugeFromPressure = '24';

    // Minimum gauge based on pressure class
    let minGaugeForPressureClass = '26';
    if (pressureClass === 'high') minGaugeForPressureClass = '20';
    else if (pressureClass === 'medium') minGaugeForPressureClass = '22';

    // Minimum gauge based on duct size (larger ducts need thicker material)
    let minGaugeForSize = '26';
    if (ductSize > 30)
      minGaugeForSize = '20'; // Large ducts (>30" dimension)
    else if (ductSize > 20)
      minGaugeForSize = '22'; // Medium ducts (20-30")
    else if (ductSize > 12) minGaugeForSize = '24'; // Small-medium ducts (12-20")

    // Minimum gauge based on application
    let minGaugeForApplication = '26';
    if (application === 'exhaust') minGaugeForApplication = '24'; // Exhaust systems need stronger material

    // Select the thickest (lowest number) gauge from all requirements
    const allGauges = [
      parseInt(gaugeFromPressure),
      parseInt(minGaugeForPressureClass),
      parseInt(minGaugeForSize),
      parseInt(minGaugeForApplication),
    ];

    const selectedGauge = Math.min(...allGauges);
    return selectedGauge.toString();
  };

  // Helper function to get pressure class limits
  const getPressureClassLimits = (pressureClass: string) => {
    switch (pressureClass) {
      case 'low':
        return { maxVelocity: 2500, minVelocity: 800, maxPressureLoss: 0.1 };
      case 'medium':
        return { maxVelocity: 3500, minVelocity: 1000, maxPressureLoss: 0.25 };
      case 'high':
        return { maxVelocity: 4500, minVelocity: 1200, maxPressureLoss: 0.5 };
      default:
        return { maxVelocity: 2500, minVelocity: 800, maxPressureLoss: 0.1 };
    }
  };

  // Helper function to calculate joint spacing based on pressure class
  const calculateJointSpacing = (velocity: number, pressureClass: string): number => {
    if (pressureClass === 'high') {
      if (velocity > 4000) return 3;
      if (velocity > 3000) return 4;
      return 5;
    } else if (pressureClass === 'medium') {
      if (velocity > 3000) return 4;
      if (velocity > 2500) return 5;
      return 6;
    } else {
      if (velocity > 2500) return 4;
      if (velocity > 2000) return 6;
      return 8;
    }
  };

  // Helper function to calculate hanger spacing based on gauge and pressure class
  const calculateHangerSpacing = (gauge: string, pressureClass: string): number => {
    const gaugeNum = parseInt(gauge);
    let baseSpacing = 12;

    if (gaugeNum >= 24) baseSpacing = 8;
    else if (gaugeNum >= 20) baseSpacing = 10;

    // Reduce spacing for higher pressure classes
    if (pressureClass === 'high') {
      return Math.max(baseSpacing - 2, 4);
    } else if (pressureClass === 'medium') {
      return Math.max(baseSpacing - 1, 6);
    }
    return baseSpacing;
  };

  // Helper function to generate warnings based on pressure class
  const generateWarnings = (
    velocity: number,
    pressureLoss: number,
    pressureClass: string
  ): string[] => {
    const warnings: string[] = [];
    const limits = getPressureClassLimits(pressureClass);

    if (velocity > limits.maxVelocity) {
      warnings.push(
        `Velocity exceeds recommended ${limits.maxVelocity} ft/min for ${pressureClass}-pressure systems`
      );
    }
    if (velocity < limits.minVelocity) {
      warnings.push(
        `Velocity below ${limits.minVelocity} ft/min may cause stratification in ${pressureClass}-pressure systems`
      );
    }
    if (pressureLoss > limits.maxPressureLoss) {
      warnings.push(
        `Pressure loss exceeds ${limits.maxPressureLoss}" w.g. limit for ${pressureClass}-pressure systems`
      );
    }

    return warnings;
  };

  // Helper function to generate snap summary
  const generateSnapSummary = (
    inputs: LocalDuctInputs,
    cfm: number,
    velocity: number,
    pressureLoss: number,
    gauge: string,
    length: number
  ): string => {
    const shapeDesc =
      inputs.shape === 'rectangular'
        ? `${inputs.width}"×${inputs.height}"`
        : `${inputs.diameter}"⌀`;
    return `${cfm} CFM • ${shapeDesc} • ${Math.round(velocity)} ft/min • ${pressureLoss.toFixed(3)}" w.g. • ${gauge} ga • ${length}' long`;
  };

  // Helper function to get material name
  const getMaterialName = (material: string): string => {
    switch (material) {
      case 'galvanized':
        return 'Galvanized Steel';
      case 'stainless':
        return 'Stainless Steel';
      case 'aluminum':
        return 'Aluminum';
      default:
        return 'Galvanized Steel';
    }
  };

  const calculateResults = () => {
    try {
      const cfm = parseFloat(inputs.cfm);
      const length = parseFloat(inputs.length);

      if (!cfm || !length) return;

      // Use helper function to calculate geometry
      const geometry = calculateGeometry(inputs);
      if (!geometry) return;

      const { area, perimeter } = geometry;

      const velocity = cfm / area; // ft/min
      const hydraulicDiameter = ((4 * area) / perimeter) * 12; // Convert back to inches

      // Simplified pressure loss calculation with material factors
      const materialFactors = {
        galvanized: 0.02,
        stainless: 0.015,
        aluminum: 0.015,
      };

      const frictionFactor = materialFactors[inputs.material];
      /**
       * Calculate the pressure loss using the friction factor, length, velocity, and hydraulic diameter.
       * This uses the Darcy-Weisbach equation, considering friction and duct dimensions.
       *
       * @param frictionFactor - Coefficient based on duct material and surface roughness
       * @param length - Length of the duct in feet
       * @param velocity - Air velocity in feet per minute
       * @param hydraulicDiameter - Effective duct diameter in inches
       * @returns Pressure loss in inches of water gauge (in. w.g.)
       */
      const pressureLoss =
        frictionFactor !== undefined &&
        length !== undefined &&
        velocity !== undefined &&
        hydraulicDiameter !== undefined
          ? (frictionFactor * length * Math.pow(velocity, 2)) /
            (2 * 4005 * (hydraulicDiameter / 12))
          : 0;

      // Calculate the largest duct dimension for gauge selection
      const ductSize =
        inputs.shape === 'rectangular'
          ? Math.max(parseFloat(inputs.width), parseFloat(inputs.height))
          : parseFloat(inputs.diameter);

      // Use helper functions for calculations
      const gauge = determineGauge(
        pressureLoss,
        inputs.pressureClass,
        ductSize,
        inputs.application
      );
      const jointSpacing = calculateJointSpacing(velocity, inputs.pressureClass);
      const hangerSpacing = calculateHangerSpacing(gauge, inputs.pressureClass);
      const warnings = generateWarnings(velocity, pressureLoss, inputs.pressureClass);
      const snapSummary = generateSnapSummary(inputs, cfm, velocity, pressureLoss, gauge, length);

      setResults({
        velocity: Math.round(velocity),
        pressureLoss: Math.round(pressureLoss * 1000) / 1000,
        gauge,
        jointSpacing,
        hangerSpacing,
        hydraulicDiameter: Math.round(hydraulicDiameter * 100) / 100,
        area: Math.round(area * 1000) / 1000,
        perimeter: Math.round(perimeter * 100) / 100,
        warnings,
        snapSummary,
      });
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Air Duct Sizer</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Calculate duct dimensions, velocity, and pressure loss for HVAC systems
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Input Parameters
          </h2>

          <div className="space-y-6">
            {/* Airflow */}
            <div>
              <label
                htmlFor="cfm-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Airflow (CFM)
              </label>
              <input
                id="cfm-input"
                type="number"
                value={inputs.cfm}
                onChange={e => handleInputChange('cfm', e.target.value)}
                className="input-field"
                placeholder="Enter CFM"
              />
            </div>

            {/* Duct Shape */}
            <div>
              <label
                htmlFor="shape-select"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Duct Shape
              </label>
              <select
                id="shape-select"
                value={inputs.shape}
                onChange={e =>
                  handleInputChange('shape', e.target.value as 'rectangular' | 'circular')
                }
                className="input-field"
              >
                <option value="rectangular">Rectangular</option>
                <option value="circular">Circular</option>
              </select>
            </div>

            {/* Dimensions */}
            {inputs.shape === 'rectangular' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="width-input"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Width (inches)
                  </label>
                  <input
                    id="width-input"
                    type="number"
                    value={inputs.width}
                    onChange={e => handleInputChange('width', e.target.value)}
                    className="input-field"
                    placeholder="Width"
                  />
                </div>
                <div>
                  <label
                    htmlFor="height-input"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Height (inches)
                  </label>
                  <input
                    id="height-input"
                    type="number"
                    value={inputs.height}
                    onChange={e => handleInputChange('height', e.target.value)}
                    className="input-field"
                    placeholder="Height"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="diameter-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Diameter (inches)
                </label>
                <input
                  id="diameter-input"
                  type="number"
                  value={inputs.diameter}
                  onChange={e => handleInputChange('diameter', e.target.value)}
                  className="input-field"
                  placeholder="Diameter"
                />
              </div>
            )}

            {/* Length */}
            <div>
              <label
                htmlFor="length-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Duct Length (feet)
              </label>
              <input
                id="length-input"
                type="number"
                value={inputs.length}
                onChange={e => handleInputChange('length', e.target.value)}
                className="input-field"
                placeholder="Length"
              />
            </div>

            {/* Material */}
            <div>
              <label
                htmlFor="material-select"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Material
              </label>
              <select
                id="material-select"
                value={inputs.material}
                onChange={e =>
                  handleInputChange(
                    'material',
                    e.target.value as 'galvanized' | 'stainless' | 'aluminum'
                  )
                }
                className="input-field"
              >
                <option value="galvanized">Galvanized Steel</option>
                <option value="stainless">Stainless Steel</option>
                <option value="aluminum">Aluminum</option>
              </select>
            </div>

            {/* Application */}
            <div>
              <label
                htmlFor="application-select"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Application
              </label>
              <select
                id="application-select"
                value={inputs.application}
                onChange={e =>
                  handleInputChange(
                    'application',
                    e.target.value as 'supply' | 'return' | 'exhaust'
                  )
                }
                className="input-field"
              >
                <option value="supply">Supply Air</option>
                <option value="return">Return Air</option>
                <option value="exhaust">Exhaust Air</option>
              </select>
            </div>

            {/* Pressure Class */}
            <div>
              <label
                htmlFor="pressure-class-select"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Pressure Class
              </label>
              <select
                id="pressure-class-select"
                value={inputs.pressureClass}
                onChange={e =>
                  handleInputChange('pressureClass', e.target.value as 'low' | 'medium' | 'high')
                }
                className="input-field"
              >
                <option value="low">Low Pressure (≤ 2" w.g.)</option>
                <option value="medium">Medium Pressure (2-6" w.g.)</option>
                <option value="high">High Pressure (6-10" w.g.)</option>
              </select>
            </div>

            <button type="button" onClick={calculateResults} className="btn-primary w-full">
              Calculate
            </button>
          </div>
        </div>

        {/* Modern Results Table */}
        {results ? (
          <SMACNAResultsTable
            title="SizeWise Results: Air Duct Sizing"
            subtitle={`${getMaterialName(inputs.material)} • ${inputs.application} air application`}
            results={createDuctSizerResults(
              {
                cfm: parseFloat(inputs.cfm),
                shape: inputs.shape,
                width: inputs.shape === 'rectangular' ? parseFloat(inputs.width) : undefined,
                height: inputs.shape === 'rectangular' ? parseFloat(inputs.height) : undefined,
                diameter: inputs.shape === 'circular' ? parseFloat(inputs.diameter) : undefined,
                length: parseFloat(inputs.length),
                material: inputs.material,
                application: inputs.application,
                pressureClass: inputs.pressureClass,
              },
              {
                velocity: results.velocity,
                pressureLoss: results.pressureLoss,
                gauge: results.gauge,
                jointSpacing: results.jointSpacing,
                hangerSpacing: results.hangerSpacing,
                hydraulicDiameter: results.hydraulicDiameter,
                area: results.area,
              }
            )}
            snapSummary={results.snapSummary}
          />
        ) : (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Results
            </h2>
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              Enter parameters and click Calculate to see results
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuctSizerPage;
