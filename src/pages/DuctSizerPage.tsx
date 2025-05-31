import React, { useState } from 'react';
import { Calculator, Info } from 'lucide-react';

interface LocalDuctInputs {
  cfm: string;
  shape: 'rectangular' | 'circular';
  width: string;
  height: string;
  diameter: string;
  length: string;
  material: 'galvanized' | 'stainless' | 'aluminum';
  application: 'supply' | 'return' | 'exhaust';
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
    cfm: '',
    shape: 'rectangular',
    width: '',
    height: '',
    diameter: '',
    length: '',
    material: 'galvanized',
    application: 'supply',
  });

  const [results, setResults] = useState<LocalDuctResults | null>(null);

  const handleInputChange = (field: keyof LocalDuctInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateResults = () => {
    try {
      const cfm = parseFloat(inputs.cfm);
      const length = parseFloat(inputs.length);

      if (!cfm || !length) return;

      // TODO: Implement enhanced calculation logic here using the inputs
      // For now, using simplified calculation
      let area: number;
      let perimeter: number;

      if (inputs.shape === 'rectangular') {
        const width = parseFloat(inputs.width);
        const height = parseFloat(inputs.height);
        if (!width || !height) return;

        area = (width * height) / 144; // Convert to sq ft
        perimeter = 2 * (width + height) / 12; // Convert to ft
      } else {
        const diameter = parseFloat(inputs.diameter);
        if (!diameter) return;

        area = (Math.PI * Math.pow(diameter, 2)) / (4 * 144); // Convert to sq ft
        perimeter = (Math.PI * diameter) / 12; // Convert to ft
      }

      const velocity = cfm / area; // ft/min
      const hydraulicDiameter = (4 * area) / perimeter * 12; // Convert back to inches

      // Simplified pressure loss calculation with material factors
      const materialFactors = {
        galvanized: 0.02,
        stainless: 0.015,
        aluminum: 0.015
      };

      const frictionFactor = materialFactors[inputs.material];
      const pressureLoss = (frictionFactor * length * Math.pow(velocity, 2)) / (2 * 4005 * (hydraulicDiameter / 12));

      // Enhanced gauge selection
      let gauge = '26';
      if (pressureLoss > 1) gauge = '24';
      if (pressureLoss > 2) gauge = '22';
      if (pressureLoss > 4) gauge = '20';
      if (pressureLoss > 6) gauge = '18';

      // Enhanced spacing calculations
      const jointSpacing = velocity > 2500 ? 4 : velocity > 2000 ? 6 : 8;
      const hangerSpacing = parseInt(gauge) >= 24 ? 8 : parseInt(gauge) >= 20 ? 10 : 12;

      // Generate warnings
      const warnings: string[] = [];
      if (velocity > 2500) warnings.push('Velocity exceeds recommended 2500 ft/min for low-pressure systems');
      if (velocity < 800) warnings.push('Velocity below 800 ft/min may cause stratification');
      if (pressureLoss > 0.1) warnings.push('High pressure loss - consider larger duct size');

      // Generate snap summary
      const shapeDesc = inputs.shape === 'rectangular'
        ? `${inputs.width}"×${inputs.height}"`
        : `${inputs.diameter}"⌀`;
      const snapSummary = `${cfm} CFM • ${shapeDesc} • ${Math.round(velocity)} ft/min • ${pressureLoss.toFixed(3)}" w.g. • ${gauge} ga • ${length}' long`;

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
        snapSummary
      });
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Air Duct Sizer
        </h1>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Airflow (CFM)
              </label>
              <input
                type="number"
                value={inputs.cfm}
                onChange={(e) => handleInputChange('cfm', e.target.value)}
                className="input-field"
                placeholder="Enter CFM"
              />
            </div>

            {/* Duct Shape */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duct Shape
              </label>
              <select
                aria-label="Select duct shape"
                value={inputs.shape}
                onChange={(e) => handleInputChange('shape', e.target.value as 'rectangular' | 'circular')}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Width (inches)
                  </label>
                  <input
                    type="number"
                    value={inputs.width}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    className="input-field"
                    placeholder="Width"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (inches)
                  </label>
                  <input
                    type="number"
                    value={inputs.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="input-field"
                    placeholder="Height"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Diameter (inches)
                </label>
                <input
                  type="number"
                  value={inputs.diameter}
                  onChange={(e) => handleInputChange('diameter', e.target.value)}
                  className="input-field"
                  placeholder="Diameter"
                />
              </div>
            )}

            {/* Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duct Length (feet)
              </label>
              <input
                type="number"
                value={inputs.length}
                onChange={(e) => handleInputChange('length', e.target.value)}
                className="input-field"
                placeholder="Length"
              />
            </div>

            {/* Material */}
            <div>
              <label htmlFor="material-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Material
              </label>
              <select
                id="material-select"
                value={inputs.material}
                onChange={(e) => handleInputChange('material', e.target.value)}
                className="input-field"
              >
                <option value="galvanized">Galvanized Steel</option>
                <option value="stainless">Stainless Steel</option>
                <option value="aluminum">Aluminum</option>
              </select>
            </div>

            {/* Application */}
            <div>
              <label htmlFor="application-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Application
              </label>
              <select
                id="application-select"
                value={inputs.application}
                onChange={(e) => handleInputChange('application', e.target.value)}
                className="input-field"
              >
                <option value="supply">Supply Air</option>
                <option value="return">Return Air</option>
                <option value="exhaust">Exhaust Air</option>
              </select>
            </div>

            <button
              type="button"
              onClick={calculateResults}
              className="btn-primary w-full"
            >
              Calculate
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Results
          </h2>

          {results ? (
            <div className="space-y-6">
              {/* Snap Summary */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Quick Summary</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-mono">
                  {results.snapSummary}
                </p>
              </div>

              {/* Primary Results */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Velocity</div>
                  <div className={`text-2xl font-bold ${
                    results.velocity > 2500 || results.velocity < 800
                      ? 'text-red-600 dark:text-red-400'
                      : results.velocity > 2000 || results.velocity < 1000
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {results.velocity.toLocaleString()} <span className="text-sm font-normal">ft/min</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pressure Loss</div>
                  <div className={`text-2xl font-bold ${
                    results.pressureLoss > 0.1
                      ? 'text-red-600 dark:text-red-400'
                      : results.pressureLoss > 0.08
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {results.pressureLoss} <span className="text-sm font-normal">in. w.g.</span>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-700 dark:text-gray-300">Recommended Gauge</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{results.gauge} ga</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-700 dark:text-gray-300">Joint Spacing</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{results.jointSpacing} ft</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-700 dark:text-gray-300">Hanger Spacing</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{results.hangerSpacing} ft</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-700 dark:text-gray-300">Hydraulic Diameter</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{results.hydraulicDiameter}" </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-700 dark:text-gray-300">Cross-sectional Area</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{results.area} sq ft</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 dark:text-gray-300">Perimeter</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{results.perimeter} ft</span>
                </div>
              </div>

              {/* SMACNA Validation Warnings */}
              {results.warnings.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    SMACNA Validation Notes
                  </h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    {results.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Educational Content */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Engineering Notes</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Material: {inputs.material === 'galvanized' ? 'Galvanized Steel' : inputs.material === 'stainless' ? 'Stainless Steel' : 'Aluminum'} selected for {inputs.application} air application</li>
                  <li>• Calculations follow SMACNA HVAC Duct Construction Standards</li>
                  <li>• Pressure loss includes material roughness factors</li>
                  {results.velocity > 2000 && <li>• High velocity system - consider acoustic treatment</li>}
                  {results.pressureLoss > 0.08 && <li>• Consider larger duct size to reduce energy costs</li>}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              Enter parameters and click Calculate to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuctSizerPage;
