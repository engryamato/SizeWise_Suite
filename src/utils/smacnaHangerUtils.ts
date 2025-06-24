import {
  RoundHangerTable,
  RectangularHangerTable,
  DuctShape,
  RoundHangerEntry,
  RectangularHangerEntry,
} from '@/types/smacna';
import roundHangerData from '@/data/smacna/round-hanger-spacing.json';
import rectangularHangerData from '@/data/smacna/rectangular-hanger-spacing.json';

// Type assertions for our JSON imports
const roundHangerTable = roundHangerData as unknown as RoundHangerTable;
const rectangularHangerTable = rectangularHangerData as unknown as RectangularHangerTable;

type HangerResult = {
  maxSpacingFt: number;
  minGauge: number;
  table: string;
  notes: string[];
};

/**
 * Finds the maximum hanger spacing for a duct based on its dimensions and gauge
 * @param dimensions - Object containing width and height (for rectangular) or diameter (for round)
 * @param gauge - The gauge of the duct material
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @returns The hanger result with maximum spacing, minimum gauge, and metadata
 */
export function findDuctHangerSpacing(
  dimensions: { width: number; height: number } | { diameter: number },
  gauge: number,
  shape: DuctShape = 'round'
): HangerResult {
  const table = shape === 'round' ? roundHangerTable : rectangularHangerTable;
  const size =
    'diameter' in dimensions ? dimensions.diameter : Math.max(dimensions.width, dimensions.height);

  // Find the matching entry based on size and gauge
  let matchingEntry: (RoundHangerEntry | RectangularHangerEntry) | undefined;

  if (shape === 'round') {
    const roundTable = table as RoundHangerTable;
    matchingEntry = roundTable.entries.find(
      entry =>
        size >= entry.min_diameter_in && size <= entry.max_diameter_in && gauge >= entry.min_gauge
    );
  } else {
    const rectTable = table as RectangularHangerTable;
    matchingEntry = rectTable.entries.find(
      entry => size >= entry.min_size_in && size <= entry.max_size_in && gauge >= entry.min_gauge
    );
  }

  if (!matchingEntry) {
    console.warn(
      `No hanger spacing data found for the specified size and gauge. Size: ${size}", Gauge: ${gauge}`
    );
    return {
      maxSpacingFt: 0,
      minGauge: 0,
      table: table.table,
      notes: [...table.notes, 'No matching data found for the specified size and gauge.'],
    };
  }

  return {
    maxSpacingFt: matchingEntry.max_spacing_ft,
    minGauge: matchingEntry.min_gauge,
    table: table.table,
    notes: table.notes,
  };
}

/**
 * Gets the SMACNA hanger spacing table metadata
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @returns The SMACNA table metadata
 */
export function getSmacnaHangerTableInfo(shape: DuctShape = 'round') {
  const table = shape === 'round' ? roundHangerTable : rectangularHangerTable;
  const { table: tableName, description, material, notes } = table;
  return { table: tableName, description, material, notes };
}
