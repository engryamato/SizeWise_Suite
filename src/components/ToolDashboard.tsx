// src/components/ToolDashboard.tsx
import { useEffect, useState } from 'react';
import ToolCard from './ToolCard';
import ToolRegistry from '@/core/toolRegistrar';

const ToolDashboard: React.FC = () => {
  const [tools, setTools] = useState<Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    version: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTools = async () => {
      try {
        const registry = ToolRegistry.getInstance();
        await registry.initialize();
        const allTools = registry.getAllTools();
        
        // Map to the expected format for ToolCard
        const formattedTools = allTools.map(tool => ({
          id: tool.id,
          name: tool.name,
          description: tool.description,
          icon: tool.icon,
          category: tool.category,
          version: tool.version,
        }));
        
        setTools(formattedTools);
      } catch (err) {
        console.error('Failed to load tools:', err);
        setError('Failed to load tools. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTools();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Available Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} {...tool} />
        ))}
      </div>
      
      {tools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tools available. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default ToolDashboard;
