import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, Flame, Zap, Wrench, ArrowRight } from 'lucide-react';

const tools = [
  {
    name: 'Air Duct Sizer',
    description: 'Size conditioned air ducts with SMACNA compliance',
    href: '/tools/duct-sizer',
    icon: Wind,
    color: 'bg-blue-500',
    available: true,
  },
  {
    name: 'Grease Duct Sizer',
    description: 'Design grease-laden exhaust ducts per NFPA 96',
    href: '/tools/grease-sizer',
    icon: Flame,
    color: 'bg-green-500',
    available: false,
  },
  {
    name: 'Boiler Vent Sizer',
    description: 'Calculate boiler venting requirements',
    href: '/tools/boiler-vent',
    icon: Zap,
    color: 'bg-yellow-500',
    available: false,
  },
  {
    name: 'Engine Exhaust Sizer',
    description: 'Size generator exhaust systems',
    href: '/tools/engine-exhaust',
    icon: Wrench,
    color: 'bg-red-500',
    available: false,
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Professional HVAC Engineering Tools
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Accurate, standards-compliant calculations for duct sizing, pressure loss analysis, 
          and HVAC system design. Built by engineers, for engineers.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.name}
              className={`card p-6 ${!tool.available ? 'opacity-60' : 'hover:shadow-xl'} transition-all duration-200`}
            >
              <div className="flex items-start space-x-4">
                <div className={`${tool.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {tool.description}
                  </p>
                  {tool.available ? (
                    <Link
                      to={tool.href}
                      className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      Open Tool
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center text-gray-400 dark:text-gray-500 font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Why SizeWise Suite?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Standards Compliant
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              All calculations follow SMACNA, NFPA, and UL standards for professional accuracy.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Validation
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Instant feedback and validation as you input data, preventing errors before they happen.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Offline Ready
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Works seamlessly offline for field use, with optional cloud sync for team collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
