import { laborCost } from '../calculations/labor.js';
import { materialCost } from '../calculations/material.js';
import { applyMarkup } from '../calculations/markup.js';
import { parseTakeoff } from '../components/TakeoffInput.js';

describe('materialCost', () => {
  test('calculates total material cost', () => {
    expect(materialCost(10, 5)).toBe(50);
  });
});

describe('applyMarkup', () => {
  test('adds markup percent correctly', () => {
    expect(applyMarkup(100, 10)).toBe(110);
  });
});

describe('parseTakeoff', () => {
  test('parses raw input object', () => {
    const raw = { item: 'diffuser', quantity: '4', unit: 'ea' };
    const parsed = parseTakeoff(raw);
    expect(parsed).toEqual({ item: 'diffuser', quantity: 4, unit: 'ea' });
  });
});

describe('laborCost', () => {
  test('multiplies hours by rate', () => {
    expect(laborCost(2, 50)).toBe(100);
  });
});
