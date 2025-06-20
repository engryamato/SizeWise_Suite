export type DuctShape = 'round' | 'rectangular';

export interface BaseEntry {
  min_size_in: number;
  max_size_in: number;
}

export interface BaseRoundEntry {
  min_diameter_in: number;
  max_diameter_in: number;
}

export interface BaseGaugeEntry extends BaseEntry {
  min_gauge: number;
  max_gauge?: number;
}

export interface BaseHangerEntry {
  min_gauge: number;
  max_spacing_ft: number;
}

export interface RectangularHangerEntry extends BaseEntry, BaseHangerEntry {}

export interface RoundHangerEntry {
  min_diameter_in: number;
  max_diameter_in: number;
  min_gauge: number;
  max_spacing_ft: number;
}

export interface BaseJointEntry extends BaseEntry {
  joint_types: string[];
}

export interface BaseSeamEntry extends BaseEntry {
  seam_types: string[];
}

export interface RoundGaugeEntry extends BaseGaugeEntry {
  min_diameter_in: number;
  max_diameter_in: number;
  gauge: number; // Add the gauge property that exists in the JSON data
}

export interface RectangularGaugeEntry extends BaseGaugeEntry {
  min_size_in: number;
  max_size_in: number;
  gauge: number; // Add the gauge property that exists in the JSON data
}

export interface RoundJointEntry extends BaseJointEntry {
  min_diameter_in: number;
  max_diameter_in: number;
}

export interface RectangularJointEntry extends BaseJointEntry {
  min_size_in: number;
  max_size_in: number;
}

export interface RoundSeamEntry extends BaseSeamEntry {
  min_diameter_in: number;
  max_diameter_in: number;
}

export interface RectangularSeamEntry extends BaseSeamEntry {
  min_size_in: number;
  max_size_in: number;
}

export type GaugeEntry = RoundGaugeEntry | RectangularGaugeEntry;
export type JointEntry = RoundJointEntry | RectangularJointEntry;
export type SeamEntry = RoundSeamEntry | RectangularSeamEntry;

export interface PressureClass<T> {
  pressure_class_in_wg: number;
  entries: T[];
}

export interface SmacnaTable<T> {
  table: string;
  description: string;
  shape: DuctShape;
  unit: 'inches' | 'millimeters';
  material: string;
  pressure_classes: PressureClass<T>[];
  notes: string[];
}

// Specific table types for better type safety
type SmacnaGaugeTable<T extends GaugeEntry> = SmacnaTable<T>;
type SmacnaJointTable<T extends JointEntry> = SmacnaTable<T>;
type SmacnaSeamTable<T extends SeamEntry> = SmacnaTable<T>;

export type RoundGaugeTable = SmacnaGaugeTable<RoundGaugeEntry>;
export type RectangularGaugeTable = SmacnaGaugeTable<RectangularGaugeEntry>;
export type RoundJointTable = SmacnaJointTable<RoundJointEntry>;
export type RectangularJointTable = SmacnaJointTable<RectangularJointEntry>;

export type RoundSeamTable = SmacnaSeamTable<RoundSeamEntry>;
export type RectangularSeamTable = SmacnaSeamTable<RectangularSeamEntry>;
// Union types for when we don't care about the specific shape
export type AnyGaugeTable = RoundGaugeTable | RectangularGaugeTable;
export type AnyJointTable = RoundJointTable | RectangularJointTable;
export type AnySeamTable = RoundSeamTable | RectangularSeamTable;
export type HangerTable<T> = {
  table: string;
  description: string;
  shape: DuctShape;
  unit: string;
  material: string;
  entries: T[];
  notes: string[];
};

export type RectangularHangerTable = HangerTable<RectangularHangerEntry>;
export type RoundHangerTable = HangerTable<RoundHangerEntry>;
export type AnyHangerTable = RectangularHangerTable | RoundHangerTable;

// Velocity Types
export interface VelocityEntry {
  application: string;
  max_velocity_fpm: number;
}

export interface VelocityTable {
  table: string;
  description: string;
  shape: DuctShape;
  unit: string;
  application_types: VelocityEntry[];
  notes: string[];
}

export type AnySmacnaTable = AnyGaugeTable | AnyJointTable | AnySeamTable | AnyHangerTable | VelocityTable;
