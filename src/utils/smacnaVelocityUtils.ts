import { VelocityTable, DuctShape } from '@/types/smacna';
import roundVelocityData from '@/data/smacna/round-velocity-limits.json';
import rectangularVelocityData from '@/data/smacna/rectangular-velocity-limits.json';

// Type assertions for our JSON imports
const roundVelocityTable = roundVelocityData as unknown as VelocityTable;
const rectangularVelocityTable = rectangularVelocityData as unknown as VelocityTable;

type VelocityResult = {
  maxVelocityFpm: number;
  application: string;
  table: string;
  notes: string[];
};

/**
 * Gets the maximum recommended air velocity for a specific application and duct shape
 * @param applicationType - The type of application (e.g., 'Main Supply Duct', 'Branch Return Duct')
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @returns The velocity result with maximum velocity and metadata
 */
export function getMaxVelocity(
  applicationType: string,
  shape: DuctShape = 'round'
): VelocityResult {
  const table = shape === 'round' ? roundVelocityTable : rectangularVelocityTable;
  
  // Find the matching application type (case-insensitive)
  const appType = applicationType.toLowerCase();
  const velocityEntry = table.application_types.find(
    entry => entry.application.toLowerCase() === appType
  );

  if (!velocityEntry) {
    console.warn(`No velocity data found for application type: ${applicationType}`);
    return { 
      maxVelocityFpm: 0, 
      application: applicationType,
      table: table.table, 
      notes: [...table.notes, 'No matching data found for the specified application type.'] 
    };
  }

  return {
    maxVelocityFpm: velocityEntry.max_velocity_fpm,
    application: velocityEntry.application,
    table: table.table,
    notes: table.notes
  };
}

/**
 * Gets all available application types for a given duct shape
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @returns Array of application types with their max velocities
 */
export function getApplicationTypes(shape: DuctShape = 'round'): Array<{application: string, maxVelocityFpm: number}> {
  const table = shape === 'round' ? roundVelocityTable : rectangularVelocityTable;
  return table.application_types.map(({ application, max_velocity_fpm }) => ({
    application,
    maxVelocityFpm: max_velocity_fpm
  }));
}

/**
 * Gets the SMACNA velocity table metadata
 * @param shape - The shape of the duct ('round' or 'rectangular')
 * @returns The SMACNA table metadata
 */
export function getSmacnaVelocityTableInfo(shape: DuctShape = 'round') {
  const table = shape === 'round' ? roundVelocityTable : rectangularVelocityTable;
  const { table: tableName, description, unit, notes } = table;
  return { table: tableName, description, unit, notes };
}
