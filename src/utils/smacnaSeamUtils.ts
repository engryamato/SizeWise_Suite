import { 
  RoundSeamTable, 
  RectangularSeamTable,
  DuctShape
} from '@/types/smacna';
import roundSeamData from '@/data/smacna/round-longitudinal-seam-selection.json';
import rectangularSeamData from '@/data/smacna/rectangular-longitudinal-seam-selection.json';

// Type assertions for our JSON imports
const roundSeamTable = roundSeamData as unknown as RoundSeamTable;
const rectangularSeamTable = rectangularSeamData as unknown as RectangularSeamTable;

type SeamResult = {
  seamTypes: string[];
  table: string;
  notes: string[];
};

/**
 * Finds the appropriate seam types for a duct based on its dimensions and pressure class
 * @param dimensions - Object containing width and height (for rectangular) or diameter (for round)
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @param pressureClassInWg - Pressure class in inches of water gauge (default: 2" WG)
 * @returns The seam result with seam types, table reference, and notes
 */
export function findDuctSeamTypes(
  dimensions: { width: number; height: number } | { diameter: number },
  shape: DuctShape,
  pressureClassInWg: number = 2
): SeamResult {
  const table = shape === 'round' ? roundSeamTable : rectangularSeamTable;
  
  // Find the matching pressure class
  const pressureClass = table.pressure_classes.find(
    pc => pc.pressure_class_in_wg === pressureClassInWg
  );

  if (!pressureClass) {
    console.warn(`No seam data found for pressure class: ${pressureClassInWg}" WG`);
    return { seamTypes: [], table: table.table, notes: table.notes };
  }

  // For round ducts, use diameter. For rectangular, use the larger dimension
  const size = 'diameter' in dimensions 
    ? dimensions.diameter 
    : Math.max(dimensions.width, dimensions.height);

  // Find the matching seam entry
  const sizeKey = 'diameter' in dimensions ? 'min_diameter_in' : 'min_size_in';
  const seamEntry = pressureClass.entries.find(entry => {
    const min = entry[sizeKey as keyof typeof entry];
    const max = entry[sizeKey.replace('min_', 'max_') as keyof typeof entry];
    return typeof min === 'number' && typeof max === 'number' && typeof size === 'number' && size >= min && size <= max;
  });

  return {
    seamTypes: seamEntry ? seamEntry.seam_types : [],
    table: table.table,
    notes: table.notes
  };
}

/**
 * Gets all available pressure classes for seam selection
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @returns Array of pressure class values in WG
 */
export function getAvailableSeamPressureClasses(shape: DuctShape = 'round'): number[] {
  const table = shape === 'round' ? roundSeamTable : rectangularSeamTable;
  return table.pressure_classes.map(pc => pc.pressure_class_in_wg);
}

/**
 * Gets the SMACNA seam table metadata
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @returns The SMACNA table metadata
 */
export function getSmacnaSeamTableInfo(shape: DuctShape = 'round') {
  const table = shape === 'round' ? roundSeamTable : rectangularSeamTable;
  const { table: tableName, description, material, notes } = table;
  return { table: tableName, description, material, notes };
}
