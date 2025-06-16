// src/components/ToolCard.tsx
import { Link } from 'react-router-dom';

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  version: string;
}

const ToolCard: React.FC<ToolCardProps> = ({
  id,
  name,
  description,
  icon,
  category,
  version,
}) => {
  return (
    <Link
      to={`/${id}`}
      className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 mr-4 bg-blue-100 rounded-lg">
          <span className="text-blue-600 text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <span className="text-sm text-gray-500">v{version}</span>
        </div>
      </div>
      <p className="text-gray-700 mb-3">{description}</p>
      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        {category}
      </span>
    </Link>
  );
};

export default ToolCard;
