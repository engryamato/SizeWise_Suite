interface ImportMetaEnv {
  [key: string]: any;
  glob: (pattern: string) => Record<string, () => Promise<{ default: any }>>;
}

// Extend the global ImportMeta interface
declare const import_meta: ImportMetaEnv;

/**
 * Utility function to handle dynamic imports with Vite
 * This ensures proper module resolution in both development and production
 */
export async function dynamicImport<T>(path: string): Promise<{ default: T }> {
  try {
    // Remove the @ alias to match the filesystem path
    const normalizedPath = path.replace('@', '/src');
    
    // Use a direct dynamic import with the resolved path
    // Vite will handle the transformation at build time
    const module = await import(/* @vite-ignore */ normalizedPath);
    
    if (!module || !module.default) {
      throw new Error(`Module '${path}' has no default export`);
    }
    
    return { default: module.default };
  } catch (error) {
    console.error(`Failed to dynamically import module: ${path}`, error);
    throw error;
  }
}
