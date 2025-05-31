/**
 * Air Duct Sizer - Logic Tests
 * Test the enhanced calculation engine for Phase 0.1
 */

import { calculateDuctSizing } from '../logic';
import { DuctInputs } from '../index';

describe('Air Duct Sizer Logic - Phase 0.1', () => {
  describe('Rectangular Duct Calculations', () => {
    test('calculates basic rectangular duct correctly', () => {
      const inputs: DuctInputs = {
        cfm: 1000,
        shape: 'rectangular',
        width: 12,
        height: 8,
        length: 100,
        material: 'galvanized',
        application: 'supply'
      };

      const results = calculateDuctSizing(inputs);

      expect(results.velocity).toBeGreaterThan(0);
      expect(results.pressureLoss).toBeGreaterThan(0);
      expect(results.gauge).toBeDefined();
      expect(results.jointSpacing).toBeGreaterThan(0);
      expect(results.hangerSpacing).toBeGreaterThan(0);
      expect(results.snapSummary).toContain('1000 CFM');
    });

    test('validates high velocity warnings', () => {
      const inputs: DuctInputs = {
        cfm: 5000,
        shape: 'rectangular',
        width: 8,
        height: 6,
        length: 100,
        material: 'galvanized',
        application: 'supply'
      };

      const results = calculateDuctSizing(inputs);

      expect(results.velocity).toBeGreaterThan(2500);
      expect(results.warnings).toContain(
        expect.stringContaining('Velocity exceeds recommended 2500 ft/min')
      );
    });

    test('validates low velocity warnings', () => {
      const inputs: DuctInputs = {
        cfm: 200,
        shape: 'rectangular',
        width: 20,
        height: 16,
        length: 100,
        material: 'galvanized',
        application: 'supply'
      };

      const results = calculateDuctSizing(inputs);

      expect(results.velocity).toBeLessThan(800);
      expect(results.warnings).toContain(
        expect.stringContaining('Velocity below 800 ft/min may cause stratification')
      );
    });
  });

  describe('Circular Duct Calculations', () => {
    test('calculates basic circular duct correctly', () => {
      const inputs: DuctInputs = {
        cfm: 1000,
        shape: 'circular',
        diameter: 12,
        length: 100,
        material: 'galvanized',
        application: 'supply'
      };

      const results = calculateDuctSizing(inputs);

      expect(results.velocity).toBeGreaterThan(0);
      expect(results.pressureLoss).toBeGreaterThan(0);
      expect(results.gauge).toBeDefined();
      expect(results.snapSummary).toContain('12"⌀');
    });

    test('circular ducts have lower pressure loss than rectangular', () => {
      const baseInputs = {
        cfm: 1000,
        length: 100,
        material: 'galvanized' as const,
        application: 'supply' as const
      };

      const rectangularInputs: DuctInputs = {
        ...baseInputs,
        shape: 'rectangular',
        width: 12,
        height: 8
      };

      const circularInputs: DuctInputs = {
        ...baseInputs,
        shape: 'circular',
        diameter: 12
      };

      const rectResults = calculateDuctSizing(rectangularInputs);
      const circResults = calculateDuctSizing(circularInputs);

      // Circular ducts should have lower pressure loss for similar area
      expect(circResults.pressureLoss).toBeLessThan(rectResults.pressureLoss);
    });
  });

  describe('Material Effects', () => {
    test('stainless steel has lower pressure loss than galvanized', () => {
      const baseInputs: DuctInputs = {
        cfm: 1000,
        shape: 'rectangular',
        width: 12,
        height: 8,
        length: 100,
        application: 'supply'
      };

      const galvanizedResults = calculateDuctSizing({
        ...baseInputs,
        material: 'galvanized'
      });

      const stainlessResults = calculateDuctSizing({
        ...baseInputs,
        material: 'stainless'
      });

      expect(stainlessResults.pressureLoss).toBeLessThan(galvanizedResults.pressureLoss);
    });

    test('aluminum has lower pressure loss than galvanized', () => {
      const baseInputs: DuctInputs = {
        cfm: 1000,
        shape: 'rectangular',
        width: 12,
        height: 8,
        length: 100,
        application: 'supply'
      };

      const galvanizedResults = calculateDuctSizing({
        ...baseInputs,
        material: 'galvanized'
      });

      const aluminumResults = calculateDuctSizing({
        ...baseInputs,
        material: 'aluminum'
      });

      expect(aluminumResults.pressureLoss).toBeLessThan(galvanizedResults.pressureLoss);
    });
  });

  describe('SMACNA Compliance', () => {
    test('gauge selection follows SMACNA pressure classes', () => {
      const lowPressureInputs: DuctInputs = {
        cfm: 500,
        shape: 'rectangular',
        width: 16,
        height: 12,
        length: 50,
        material: 'galvanized',
        application: 'supply'
      };

      const highPressureInputs: DuctInputs = {
        cfm: 3000,
        shape: 'rectangular',
        width: 8,
        height: 6,
        length: 200,
        material: 'galvanized',
        application: 'supply'
      };

      const lowPressureResults = calculateDuctSizing(lowPressureInputs);
      const highPressureResults = calculateDuctSizing(highPressureInputs);

      // Higher pressure should require heavier gauge
      expect(parseInt(highPressureResults.gauge)).toBeLessThan(parseInt(lowPressureResults.gauge));
    });

    test('joint spacing decreases with higher velocity', () => {
      const lowVelocityInputs: DuctInputs = {
        cfm: 800,
        shape: 'rectangular',
        width: 20,
        height: 16,
        length: 100,
        material: 'galvanized',
        application: 'supply'
      };

      const highVelocityInputs: DuctInputs = {
        cfm: 3000,
        shape: 'rectangular',
        width: 8,
        height: 6,
        length: 100,
        material: 'galvanized',
        application: 'supply'
      };

      const lowVelocityResults = calculateDuctSizing(lowVelocityInputs);
      const highVelocityResults = calculateDuctSizing(highVelocityInputs);

      expect(highVelocityResults.jointSpacing).toBeLessThanOrEqual(lowVelocityResults.jointSpacing);
    });
  });

  describe('Input Validation', () => {
    test('throws error for invalid CFM', () => {
      const inputs: DuctInputs = {
        cfm: 0,
        shape: 'rectangular',
        width: 12,
        height: 8,
        length: 100,
        material: 'galvanized',
        application: 'supply'
      };

      expect(() => calculateDuctSizing(inputs)).toThrow('CFM must be greater than 0');
    });

    test('throws error for invalid length', () => {
      const inputs: DuctInputs = {
        cfm: 1000,
        shape: 'rectangular',
        width: 12,
        height: 8,
        length: 0,
        material: 'galvanized',
        application: 'supply'
      };

      expect(() => calculateDuctSizing(inputs)).toThrow('Length must be greater than 0');
    });

    test('throws error for missing rectangular dimensions', () => {
      const inputs: DuctInputs = {
        cfm: 1000,
        shape: 'rectangular',
        length: 100,
        material: 'galvanized',
        application: 'supply'
      };

      expect(() => calculateDuctSizing(inputs)).toThrow('Width and height required for rectangular ducts');
    });

    test('throws error for missing circular diameter', () => {
      const inputs: DuctInputs = {
        cfm: 1000,
        shape: 'circular',
        length: 100,
        material: 'galvanized',
        application: 'supply'
      };

      expect(() => calculateDuctSizing(inputs)).toThrow('Diameter required for circular ducts');
    });
  });

  describe('Snap Summary Generation', () => {
    test('generates correct snap summary for rectangular duct', () => {
      const inputs: DuctInputs = {
        cfm: 1000,
        shape: 'rectangular',
        width: 12,
        height: 8,
        length: 100,
        material: 'galvanized',
        application: 'supply'
      };

      const results = calculateDuctSizing(inputs);

      expect(results.snapSummary).toContain('1000 CFM');
      expect(results.snapSummary).toContain('12"×8"');
      expect(results.snapSummary).toContain('ft/min');
      expect(results.snapSummary).toContain('" w.g.');
      expect(results.snapSummary).toContain('ga');
      expect(results.snapSummary).toContain('100\' long');
    });

    test('generates correct snap summary for circular duct', () => {
      const inputs: DuctInputs = {
        cfm: 1000,
        shape: 'circular',
        diameter: 12,
        length: 100,
        material: 'galvanized',
        application: 'supply'
      };

      const results = calculateDuctSizing(inputs);

      expect(results.snapSummary).toContain('1000 CFM');
      expect(results.snapSummary).toContain('12"⌀');
      expect(results.snapSummary).toContain('100\' long');
    });
  });
});
