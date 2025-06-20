# E2E Tests for SizeWise Suite

This directory contains end-to-end (E2E) tests for the SizeWise Suite application using Playwright.

## Overview

The E2E tests cover:
- **Navigation**: Page routing, browser back/forward, deep linking
- **Home Page**: Main interface, tool cards, theme toggle
- **Air Duct Sizer**: Form interactions, calculations, validation
- **Theme Toggle**: Light/dark mode switching and persistence
- **Error Handling**: Network errors, JavaScript errors, edge cases
- **Responsive Design**: Mobile, tablet, and desktop viewports
- **Performance**: Page load times, resource loading
- **Accessibility**: Basic WCAG compliance checks

## Test Structure

```
app/tests/e2e/
├── pages/                 # Page Object Models
│   ├── HomePage.ts
│   ├── AirDuctSizerPage.ts
│   └── ToolDashboardPage.ts
├── fixtures/              # Test data
│   └── test-data.ts
├── utils/                 # Helper functions
│   └── test-helpers.ts
├── *.spec.ts             # Test files
└── README.md
```

## Running Tests

### Prerequisites
1. Install dependencies: `npm install`
2. Install Playwright browsers: `npx playwright install`
3. Start the development server: `npm run dev`

### Test Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests step by step
npm run test:e2e:debug

# View test report
npm run test:e2e:report

# Run all tests (unit + E2E)
npm run test:all
```

### Running Specific Tests

```bash
# Run specific test file
npx playwright test navigation.spec.ts

# Run specific test by name
npx playwright test --grep "should navigate between pages"

# Run tests for specific browser
npx playwright test --project=chromium

# Run tests on mobile
npx playwright test --project="Mobile Chrome"
```

## Test Files

### `navigation.spec.ts`
Tests page navigation, routing, and browser history functionality.

### `home-page.spec.ts`
Tests the home page interface, tool cards, and basic functionality.

### `duct-sizer.spec.ts`
Tests the Air Duct Sizer tool including:
- Form interactions
- Calculations with various inputs
- Input validation
- Shape switching (rectangular/circular)
- Results display

### `theme-toggle.spec.ts`
Tests theme switching functionality:
- Light/dark mode toggle
- Theme persistence across pages
- Theme persistence across browser sessions
- System theme preference detection

### `error-handling.spec.ts`
Tests error scenarios:
- Network connectivity issues
- JavaScript errors
- Invalid form inputs
- Browser edge cases

### `comprehensive.spec.ts`
End-to-end user journeys and integration tests:
- Complete user workflows
- Cross-browser compatibility
- Performance benchmarks
- Accessibility checks

## Page Object Models

### `HomePage.ts`
Encapsulates interactions with the home page:
- Navigation elements
- Tool cards
- Theme toggle
- Page assertions

### `AirDuctSizerPage.ts`
Encapsulates interactions with the Air Duct Sizer:
- Form inputs
- Shape selection
- Calculation triggers
- Results validation

### `ToolDashboardPage.ts`
Encapsulates interactions with the tools dashboard:
- Tool grid
- Search functionality
- Filtering options

## Test Data

### `fixtures/test-data.ts`
Contains structured test data:
- Valid calculation inputs
- Invalid inputs for validation testing
- Edge cases (very large/small values)
- Responsive design breakpoints
- Performance thresholds

## Utilities

### `utils/test-helpers.ts`
Helper functions for common test operations:
- Element interaction utilities
- Screenshot capture
- Performance measurement
- Accessibility checking
- Network simulation
- Theme detection

## Configuration

The tests are configured in `playwright.config.ts` with:
- Multiple browser support (Chromium, Firefox, WebKit)
- Mobile device testing
- Automatic dev server startup
- Screenshot and video capture on failure
- Test reporting options

## Best Practices

### Writing Tests
1. Use Page Object Models for reusable interactions
2. Include meaningful assertions and error messages
3. Test both happy path and error scenarios
4. Use descriptive test names
5. Group related tests in describe blocks

### Debugging
1. Use `--headed` mode to see browser actions
2. Use `--debug` mode for step-by-step debugging
3. Add `await page.pause()` for manual inspection
4. Check screenshots and videos in test results
5. Review console logs for JavaScript errors

### Maintenance
1. Update selectors when UI changes
2. Adjust test data for new features
3. Update performance thresholds as needed
4. Review and update accessibility checks
5. Keep browser versions updated

## CI/CD Integration

For continuous integration:

```yaml
# Example GitHub Actions workflow
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in playwright.config.ts
   - Check if dev server is running
   - Verify network connectivity

2. **Element not found**
   - Check if selectors match current UI
   - Verify element is visible and enabled
   - Add wait conditions for dynamic content

3. **Flaky tests**
   - Add proper wait conditions
   - Use stable selectors (data-testid)
   - Avoid hard-coded delays

4. **Browser crashes**
   - Update Playwright browsers
   - Check system resources
   - Review console errors

### Getting Help

1. Check Playwright documentation: https://playwright.dev/
2. Review test output and screenshots
3. Use debug mode for step-by-step analysis
4. Check browser console for JavaScript errors
5. Verify application is working manually

## Contributing

When adding new tests:
1. Follow existing patterns and structure
2. Add appropriate test data to fixtures
3. Update page objects for new UI elements
4. Include both positive and negative test cases
5. Test across different viewports and browsers
6. Update this README if adding new test categories
