import '@testing-library/jest-dom';

// Suppress ReactDOMTestUtils deprecation warnings in tests
// This is a known issue with React Testing Library and React 18
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('ReactDOMTestUtils.act is deprecated') ||
       args[0].includes('Warning: `ReactDOMTestUtils.act` is deprecated'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
