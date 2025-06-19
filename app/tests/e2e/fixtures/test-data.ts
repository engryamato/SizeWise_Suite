/**
 * Test data fixtures for E2E tests
 */

export const ductSizerTestData = {
  rectangular: {
    valid: [
      {
        flowRate: '1000',
        width: '12',
        height: '8',
        length: '100',
        expectedVelocity: { min: 800, max: 1200 }, // CFM range
        expectedPressureLoss: { min: 0.1, max: 0.5 }, // inches w.c.
      },
      {
        flowRate: '2000',
        width: '16',
        height: '12',
        length: '150',
        expectedVelocity: { min: 800, max: 1200 },
        expectedPressureLoss: { min: 0.1, max: 0.8 },
      },
      {
        flowRate: '500',
        width: '8',
        height: '6',
        length: '50',
        expectedVelocity: { min: 600, max: 1000 },
        expectedPressureLoss: { min: 0.05, max: 0.3 },
      },
    ],
    invalid: [
      {
        flowRate: '0',
        width: '12',
        height: '8',
        length: '100',
        expectedError: 'Flow rate must be greater than 0',
      },
      {
        flowRate: '1000',
        width: '0',
        height: '8',
        length: '100',
        expectedError: 'Width must be greater than 0',
      },
      {
        flowRate: '1000',
        width: '12',
        height: '0',
        length: '100',
        expectedError: 'Height must be greater than 0',
      },
      {
        flowRate: '-100',
        width: '12',
        height: '8',
        length: '100',
        expectedError: 'Flow rate cannot be negative',
      },
    ],
  },
  circular: {
    valid: [
      {
        flowRate: '1000',
        diameter: '10',
        length: '100',
        expectedVelocity: { min: 800, max: 1400 },
        expectedPressureLoss: { min: 0.1, max: 0.6 },
      },
      {
        flowRate: '1500',
        diameter: '12',
        length: '120',
        expectedVelocity: { min: 800, max: 1300 },
        expectedPressureLoss: { min: 0.1, max: 0.7 },
      },
      {
        flowRate: '750',
        diameter: '8',
        length: '80',
        expectedVelocity: { min: 700, max: 1200 },
        expectedPressureLoss: { min: 0.08, max: 0.4 },
      },
    ],
    invalid: [
      {
        flowRate: '1000',
        diameter: '0',
        length: '100',
        expectedError: 'Diameter must be greater than 0',
      },
      {
        flowRate: '1000',
        diameter: '-5',
        length: '100',
        expectedError: 'Diameter cannot be negative',
      },
    ],
  },
  edgeCases: {
    veryLarge: {
      flowRate: '50000',
      width: '48',
      height: '36',
      length: '500',
    },
    verySmall: {
      flowRate: '50',
      width: '4',
      height: '3',
      length: '10',
    },
    decimal: {
      flowRate: '1250.5',
      width: '12.5',
      height: '8.25',
      length: '100.75',
    },
  },
};

export const navigationTestData = {
  routes: [
    { path: '/', name: 'Home', expectedTitle: 'SizeWise Suite' },
    { path: '/tools', name: 'Tools Dashboard', expectedTitle: 'Tools' },
    { path: '/air-duct-sizer', name: 'Air Duct Sizer', expectedTitle: 'Air Duct Sizer' },
  ],
  invalidRoutes: [
    '/nonexistent',
    '/tools/invalid',
    '/air-duct-sizer/invalid',
    '/admin',
    '/api',
  ],
};

export const themeTestData = {
  themes: ['light', 'dark'],
  storageKey: 'theme-preference', // Adjust based on your implementation
  cssClasses: {
    light: ['light', ''],
    dark: ['dark'],
  },
  dataAttributes: {
    light: ['light', ''],
    dark: ['dark'],
  },
};

export const responsiveTestData = {
  viewports: [
    { name: 'Mobile Portrait', width: 375, height: 667 },
    { name: 'Mobile Landscape', width: 667, height: 375 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'Tablet Landscape', width: 1024, height: 768 },
    { name: 'Desktop Small', width: 1280, height: 720 },
    { name: 'Desktop Large', width: 1920, height: 1080 },
    { name: 'Ultra Wide', width: 2560, height: 1440 },
  ],
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
};

export const performanceTestData = {
  thresholds: {
    pageLoadTime: 3000, // 3 seconds
    firstContentfulPaint: 1500, // 1.5 seconds
    largestContentfulPaint: 2500, // 2.5 seconds
    cumulativeLayoutShift: 0.1,
    firstInputDelay: 100, // 100ms
  },
  networkConditions: {
    fast3G: {
      downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
      uploadThroughput: 750 * 1024 / 8, // 750 Kbps
      latency: 40, // 40ms
    },
    slow3G: {
      downloadThroughput: 500 * 1024 / 8, // 500 Kbps
      uploadThroughput: 500 * 1024 / 8, // 500 Kbps
      latency: 400, // 400ms
    },
  },
};

export const accessibilityTestData = {
  requiredElements: [
    { selector: 'h1', description: 'Main heading' },
    { selector: 'nav', description: 'Navigation' },
    { selector: 'main', description: 'Main content' },
  ],
  colorContrast: {
    minimumRatio: 4.5, // WCAG AA standard
    largeTextRatio: 3, // WCAG AA for large text
  },
  keyboardNavigation: {
    focusableElements: [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ],
  },
};

export const errorTestData = {
  networkErrors: [
    { type: 'offline', description: 'Network offline' },
    { type: 'timeout', description: 'Request timeout' },
    { type: 'server-error', description: '500 server error' },
    { type: 'not-found', description: '404 not found' },
  ],
  jsErrors: [
    'TypeError: Cannot read property',
    'ReferenceError: undefined variable',
    'SyntaxError: Unexpected token',
  ],
  validationErrors: {
    required: 'This field is required',
    number: 'Please enter a valid number',
    positive: 'Value must be positive',
    range: 'Value is out of range',
  },
};
