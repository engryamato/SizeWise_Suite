import { RoundGaugeTable, RectangularGaugeTable, DuctShape } from '@/types/smacna';
import roundGaugeData from '@/data/smacna/round-gauge-selection.json';
import rectangularGaugeData from '@/data/smacna/rectangular-gauge-selection.json';

// Type assertions for our JSON imports
const roundGaugeTable = roundGaugeData as unknown as RoundGaugeTable;
const rectangularGaugeTable = rectangularGaugeData as unknown as RectangularGaugeTable;

type GaugeResult = {
  gauge: number | null;
  table: string;
  notes: string[];
};

/**
 * Finds the appropriate gauge for a duct based on its dimensions and pressure class
 * @param dimensions - Object containing width and height in inches (for rectangular) or diameter (for round)
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @param pressureClassInWg - Pressure class in inches of water gauge (default: 2" WG)
 * @returns The gauge result with gauge number, table reference, and notes
 */
export function findDuctGauge(
  dimensions: { width: number; height: number } | { diameter: number },
  shape: DuctShape,
  pressureClassInWg: number = 2
): GaugeResult {
  const table = shape === 'round' ? roundGaugeTable : rectangularGaugeTable;

  // Find the matching pressure class
  const pressureClass = table.pressure_classes.find(
    pc => pc.pressure_class_in_wg === pressureClassInWg
  );

  if (!pressureClass) {
    console.warn(`No gauge data found for pressure class: ${pressureClassInWg}" WG`);
    return { gauge: null, table: table.table, notes: table.notes };
  }

  // For round ducts, use diameter. For rectangular, use the larger dimension
  const size =
    'diameter' in dimensions ? dimensions.diameter : Math.max(dimensions.width, dimensions.height);

  // Find the matching gauge entry
  const gaugeEntry = pressureClass.entries.find(
    entry => size >= entry.min_size_in && size <= entry.max_size_in
  );

  return {
    gauge: gaugeEntry ? (shape === 'rectangular' ? gaugeEntry.min_gauge : gaugeEntry.gauge) : null,
    table: table.table,
    notes: table.notes,
  };
}

/**
 * Gets all available pressure classes from the SMACNA data
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @returns Array of pressure class values in WG
 */
export function getAvailablePressureClasses(shape: DuctShape = 'round'): number[] {
  const table = shape === 'round' ? roundGaugeTable : rectangularGaugeTable;
  return table.pressure_classes.map(pc => pc.pressure_class_in_wg);
}

/**
 * Gets the SMACNA table metadata
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @returns The SMACNA table metadata
 */
export function getSmacnaTableInfo(shape: DuctShape = 'round') {
  const table = shape === 'round' ? roundGaugeTable : rectangularGaugeTable;
  const { table: tableName, description, material, notes } = table;
  return { table: tableName, description, material, notes };
}

// For backward compatibility
export function findRoundDuctGauge(
  diameterIn: number,
  pressureClassInWg: number = 2
): number | null {
  const result = findDuctGauge({ diameter: diameterIn }, 'round', pressureClassInWg);
  return result.gauge;
}
