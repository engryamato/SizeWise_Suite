import { validateSchedule } from '../validators/schedule.js';

const validData = { task: 'Install duct', hours: 8 };

describe('validateSchedule', () => {
  test('returns true for valid data', () => {
    expect(validateSchedule(validData)).toBe(true);
  });

  test('throws for invalid data', () => {
    const bad = { task: 'Install', hours: -5 };
    expect(() => validateSchedule(bad)).toThrow();
  });
});
