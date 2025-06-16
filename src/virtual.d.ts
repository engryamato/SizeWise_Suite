/// <reference types="vite/client" />

declare module 'virtual:tools' {
  import { ComponentType } from 'react';
  
  type ToolImporter = () => Promise<{ default: ComponentType }>;
  
  /**
   * Map of tool IDs to their import functions
   */
  export const tools: Record<string, ToolImporter>;
  
  /**
   * Get the importer function for a specific tool
   * @param toolId The ID of the tool to import
   * @throws {Error} If the tool ID is not found
   */
  export function getToolImporter(toolId: string): ToolImporter;
}
