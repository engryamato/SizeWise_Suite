import { Link } from 'react-router-dom';

type ToolCardProps = {
  title: string;
  description: string;
  path: string;
  phase: string;
  icon: string;
};

const ToolCard = ({ title, description, path, phase, icon }: ToolCardProps) => (
  <Link
    to={path}
    className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center mb-4">
      <span className="text-2xl mr-3">{icon}</span>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <span className="ml-auto px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        {phase}
      </span>
    </div>
    <p className="text-gray-700">{description}</p>
  </Link>
);

const Home = () => {
  const tools: ToolCardProps[] = [
    {
      title: 'Air Duct Sizer',
      description: 'Calculate duct dimensions, velocity, and pressure loss based on SMACNA standards.',
      path: '/duct-sizer',
      phase: 'Phase 0.1',
      icon: '🌬️',
    },
    // Add more tools as they're developed
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to SizeWise Suite</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your professional HVAC engineering toolkit for accurate duct sizing, pressure loss analysis, and system design.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Available Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.path} {...tool} />
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-xl font-semibold mb-3 text-blue-800">Getting Started</h2>
        <p className="text-blue-700 mb-4">
          Select a tool from above to begin your calculations. Each tool is designed to help you with specific HVAC engineering tasks.
        </p>
        <p className="text-sm text-blue-600">Need help? Check out our documentation or contact support.</p>
      </div>
    </div>
  );
};

export default Home;
