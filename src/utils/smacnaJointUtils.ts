import { RoundJointTable, RectangularJointTable, DuctShape } from '@/types/smacna';
import roundJointData from '@/data/smacna/round-transverse-joint-selection.json';
import rectangularJointData from '@/data/smacna/rectangular-transverse-joint-selection.json';

// Type assertions for our JSON imports
const roundJointTable = roundJointData as unknown as RoundJointTable;
const rectangularJointTable = rectangularJointData as unknown as RectangularJointTable;

type JointResult = {
  jointTypes: string[];
  table: string;
  notes: string[];
};

/**
 * Finds the appropriate joint types for a duct based on its dimensions and pressure class
 * @param dimensions - Object containing width and height (for rectangular) or diameter (for round)
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @param pressureClassInWg - Pressure class in inches of water gauge (default: 2" WG)
 * @returns The joint result with joint types, table reference, and notes
 */
export function findDuctJointTypes(
  dimensions: { width: number; height: number } | { diameter: number },
  shape: DuctShape,
  pressureClassInWg: number = 2
): JointResult {
  const table = shape === 'round' ? roundJointTable : rectangularJointTable;

  // Find the matching pressure class
  const pressureClass = table.pressure_classes.find(
    pc => pc.pressure_class_in_wg === pressureClassInWg
  );

  if (!pressureClass) {
    console.warn(`No joint data found for pressure class: ${pressureClassInWg}" WG`);
    return { jointTypes: [], table: table.table, notes: table.notes };
  }

  // For round ducts, use diameter. For rectangular, use the larger dimension
  const size =
    'diameter' in dimensions ? dimensions.diameter : Math.max(dimensions.width, dimensions.height);

  // Find the matching joint entry
  const jointEntry = pressureClass.entries.find(
    entry => size >= entry.min_size_in && size <= entry.max_size_in
  );

  return {
    jointTypes: jointEntry ? jointEntry.joint_types : [],
    table: table.table,
    notes: table.notes,
  };
}

/**
 * Gets all available pressure classes for joint selection
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @returns Array of pressure class values in WG
 */
export function getAvailableJointPressureClasses(shape: DuctShape = 'round'): number[] {
  const table = shape === 'round' ? roundJointTable : rectangularJointTable;
  return table.pressure_classes.map(pc => pc.pressure_class_in_wg);
}

/**
 * Gets the SMACNA joint table metadata
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @returns The SMACNA table metadata
 */
export function getSmacnaJointTableInfo(shape: DuctShape = 'round') {
  const table = shape === 'round' ? roundJointTable : rectangularJointTable;
  const { table: tableName, description, material, notes } = table;
  return { table: tableName, description, material, notes };
}
