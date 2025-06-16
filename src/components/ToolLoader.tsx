// src/components/ToolLoader.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ToolRegistry, { type ToolMetadata } from '@/core/toolRegistrar';

// Separate component for handling dynamic imports
const DynamicImportLoader: React.FC<{ loadComponent: () => Promise<{ default: React.ComponentType }> }> = ({ 
  loadComponent 
}) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const module = await loadComponent();
        setComponent(() => module.default);
        setError(null);
      } catch (err) {
        console.error('Failed to load component:', err);
        setError(err instanceof Error ? err : new Error('Failed to load component'));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [loadComponent]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">Failed to load tool component: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return Component ? <Component /> : null;
};

// Main ToolLoader component
const ToolLoader: React.FC = () => {
  const { toolId = '' } = useParams<{ toolId: string }>();
  const [tool, setTool] = useState<ToolMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTool = async () => {
      if (!toolId) {
        setError('No tool ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const registry = ToolRegistry.getInstance();
        // Always (re-)initialize registry before fetching tools
        await registry.initialize();
        const allTools = registry.getAllTools();
        const foundTool = await registry.getTool(toolId);
        
        if (!foundTool) {
          // Log all registered tool IDs for debugging
          console.error(`Tool with ID '${toolId}' not found. Registered tool IDs:`, allTools.map(t => t.id));
          setError(`Tool with ID '${toolId}' not found. Registered tool IDs: ${allTools.map(t => t.id).join(', ')}`);
          setTool(null);
          return;
        }
        
        setTool(foundTool);
        setError(null);
      } catch (err) {
        console.error('Failed to load tool:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadTool();
  }, [toolId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
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

  if (!tool) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tool selected</p>
      </div>
    );
  }

  // Handle different types of component imports
  if (typeof tool.component === 'function' && 'render' in tool.component) {
    // Handle React.lazy components
    const LazyComponent = tool.component as React.LazyExoticComponent<React.ComponentType>;
    return (
      <React.Suspense fallback={
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <LazyComponent />
      </React.Suspense>
    );
  } else if (typeof tool.component === 'function') {
    // Handle dynamic imports using the separate component
    return (
      <DynamicImportLoader 
        loadComponent={tool.component as () => Promise<{ default: React.ComponentType }>} 
      />
    );
  }

  // Handle regular components
  const ToolComponent = tool.component as React.ComponentType;
  return <ToolComponent />;
};

export default ToolLoader;
