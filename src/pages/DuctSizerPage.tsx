import React, { useState } from 'react';
import { Calculator, Info } from 'lucide-react';

interface DuctInputs {
  cfm: string;
  shape: 'rectangular' | 'circular';
  width: string;
  height: string;
  diameter: string;
  length: string;
}

interface DuctResults {
  velocity: number;
  pressureLoss: number;
  gauge: string;
  jointSpacing: number;
  hangerSpacing: number;
}

const DuctSizerPage: React.FC = () => {
  const [inputs, setInputs] = useState<DuctInputs>({
    cfm: '',
    shape: 'rectangular',
    width: '',
    height: '',
    diameter: '',
    length: '',
  });

  const [results, setResults] = useState<DuctResults | null>(null);

  const handleInputChange = (field: keyof DuctInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateResults = () => {
    const cfm = parseFloat(inputs.cfm);
    const length = parseFloat(inputs.length);
    
    if (!cfm || !length) return;

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
    const hydraulicDiameter = (4 * area) / perimeter;
    
    // Simplified pressure loss calculation (actual would use friction factor tables)
    const frictionFactor = 0.02; // Simplified
    const pressureLoss = (frictionFactor * length * Math.pow(velocity, 2)) / (2 * 4005 * hydraulicDiameter);

    // Simplified gauge selection based on pressure
    let gauge = '26';
    if (pressureLoss > 1) gauge = '24';
    if (pressureLoss > 2) gauge = '22';
    if (pressureLoss > 4) gauge = '20';

    setResults({
      velocity: Math.round(velocity),
      pressureLoss: Math.round(pressureLoss * 100) / 100,
      gauge,
      jointSpacing: velocity > 2000 ? 4 : 6, // feet
      hangerSpacing: 8, // feet (simplified)
    });
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

            <button
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Velocity</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {results.velocity} <span className="text-sm font-normal">ft/min</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pressure Loss</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {results.pressureLoss} <span className="text-sm font-normal">in. w.g.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-700 dark:text-gray-300">Recommended Gauge</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{results.gauge} ga</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-700 dark:text-gray-300">Joint Spacing</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{results.jointSpacing} ft</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 dark:text-gray-300">Hanger Spacing</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{results.hangerSpacing} ft</span>
                </div>
              </div>

              {/* Validation Warnings */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Validation Notes</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  {results.velocity > 2500 && (
                    <li>• Velocity exceeds recommended 2500 ft/min for low-pressure systems</li>
                  )}
                  {results.velocity < 800 && (
                    <li>• Velocity below 800 ft/min may cause stratification</li>
                  )}
                  {results.pressureLoss > 0.1 && (
                    <li>• High pressure loss - consider larger duct size</li>
                  )}
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
