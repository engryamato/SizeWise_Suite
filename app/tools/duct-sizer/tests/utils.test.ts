import {
  formatVelocity,
  formatPressureLoss,
  calculateEquivalentDiameter,
  convertDuctShape,
} from '../utils';

describe('formatVelocity', () => {
  test('returns optimal status for supply air', () => {
    const res = formatVelocity(1500, 'supply');
    expect(res.status).toBe('optimal');
    expect(res.unit).toBe('ft/min');
  });

  test('returns error status for very high velocity', () => {
    const res = formatVelocity(3000, 'supply');
    expect(res.status).toBe('error');
  });
});

describe('formatPressureLoss', () => {
  test('categorizes pressure loss', () => {
    expect(formatPressureLoss(0.04).status).toBe('good');
    expect(formatPressureLoss(0.09).status).toBe('high');
  });
});

describe('calculateEquivalentDiameter', () => {
  test('calculates based on width and height', () => {
    const val = calculateEquivalentDiameter(10, 8);
    expect(val).toBeGreaterThan(0);
  });
});

describe('convertDuctShape', () => {
  test('rectangular to circular conversion', () => {
    const res = convertDuctShape('rectangular', 'circular', { width: 12, height: 8 });
    expect(res.diameter).toBeDefined();
  });
});
