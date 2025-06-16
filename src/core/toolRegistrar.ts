// src/core/toolRegistrar.ts
import type { ComponentType, LazyExoticComponent } from 'react';
import virtualTools from 'virtual:tools';

export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: ComponentType | LazyExoticComponent<ComponentType> | (() => Promise<{ default: ComponentType }>);
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
      path: tool.path || `/${tool.id}`
    });
  }

  async getTool(id: string): Promise<ToolMetadata | undefined> {
    const tool = this.tools.get(id);
    if (!tool) return undefined;

    // If component is a function (dynamic import), resolve it
    if (typeof tool.component === 'function' && !('render' in tool.component)) {
      const module = await (tool.component as () => Promise<{ default: ComponentType }>)();
      return { ...tool, component: module.default };
    }
    
    return tool;
  }

  getAllTools(): ToolMetadata[] {
    return Array.from(this.tools.values());
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Import the tool configuration
      const { tools } = await import('@/config/toolConfig.json') as { tools: ToolConfig[] };
      
      // Register each tool using the virtual module importer
      for (const toolConfig of tools) {
        this.register({
          ...toolConfig,
          component: async () => {
            try {
              // Use the virtual module to handle the dynamic import
              const importer = virtualTools.tools[toolConfig.id];
              if (!importer) {
                throw new Error(`No importer found for tool: ${toolConfig.id}`);
              }
              const module = await importer();
              return { default: module.default };
            } catch (error) {
              console.error(`Failed to load tool component: ${toolConfig.id}`, error);
              throw new Error(`Failed to load tool: ${toolConfig.name}`);
            }
          },
          path: `/${toolConfig.id}`
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
