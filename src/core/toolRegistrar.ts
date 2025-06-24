// src/core/toolRegistrar.ts
import React, { type ComponentType, type LazyExoticComponent } from 'react';

export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: LazyExoticComponent<ComponentType>;
  category: string;
  version: string;
  path: string;
}

interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  componentPath: string;
  category: string;
  version: string;
}

class ToolRegistry {
  private static instance: ToolRegistry;
  private readonly tools: Map<string, ToolMetadata> = new Map();
  private isInitialized = false;

  static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  register(tool: ToolMetadata): void {
    this.tools.set(tool.id, {
      ...tool,
      path: tool.path || `/${tool.id}`,
    });
  }

  getTool(id: string): ToolMetadata | undefined {
    return this.tools.get(id);
  }

  getAllTools(): ToolMetadata[] {
    return Array.from(this.tools.values());
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Import the tool configuration
      const { tools } = (await import('@/config/toolConfig.json')) as { tools: ToolConfig[] };

      // Register each tool using React.lazy for proper component loading
      for (const toolConfig of tools) {
        // Create a lazy component for each tool
        const LazyComponent = React.lazy(() => {
          switch (toolConfig.id) {
            case 'duct-sizer':
              return import('@/tools/duct-sizer');
            default:
              return Promise.reject(new Error(`Unknown tool: ${toolConfig.id}`));
          }
        });

        this.register({
          ...toolConfig,
          component: LazyComponent,
          path: `/${toolConfig.id}`,
        });
      }

      this.isInitialized = true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to initialize tools:', error);
      throw new Error(`Tool initialization failed: ${errorMessage}`);
    }
  }
}

export default ToolRegistry;
