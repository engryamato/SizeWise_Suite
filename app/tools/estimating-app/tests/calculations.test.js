import { laborCost } from '../calculations/labor.js';

describe('laborCost', () => {
  test('multiplies hours by rate', () => {
    expect(laborCost(2, 50)).toBe(100);
  });
});
