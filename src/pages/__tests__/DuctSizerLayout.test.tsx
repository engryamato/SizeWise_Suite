import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../providers/ThemeProvider';
import DuctSizerPage from '../DuctSizerPage';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('DuctSizerPage Layout', () => {
  test('renders input panel on the left and results area on the right', () => {
    renderWithProviders(<DuctSizerPage />);

    // Check that input panel exists
    expect(screen.getByText('Input Parameters')).toBeInTheDocument();
    expect(screen.getByLabelText('Airflow (CFM)')).toBeInTheDocument();

    // Check that results area exists (initially empty)
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(
      screen.getByText('Enter parameters and click Calculate to see results')
    ).toBeInTheDocument();
  });

  test('displays results table after calculation', () => {
    renderWithProviders(<DuctSizerPage />);

    // Fill in form with valid data
    fireEvent.change(screen.getByLabelText('Airflow (CFM)'), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText('Width (inches)'), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText('Height (inches)'), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText('Duct Length (feet)'), { target: { value: '100' } });

    // Calculate
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    // Check that results table appears
    expect(screen.getByText('SizeWise Results: Air Duct Sizing')).toBeInTheDocument();
    expect(screen.getByText('Galvanized Steel • supply air application')).toBeInTheDocument();
  });

  test('all form labels are properly associated', () => {
    renderWithProviders(<DuctSizerPage />);

    // Check that all inputs have proper labels
    expect(screen.getByLabelText('Airflow (CFM)')).toBeInTheDocument();
    expect(screen.getByLabelText('Duct Shape')).toBeInTheDocument();
    expect(screen.getByLabelText('Width (inches)')).toBeInTheDocument();
    expect(screen.getByLabelText('Height (inches)')).toBeInTheDocument();
    expect(screen.getByLabelText('Duct Length (feet)')).toBeInTheDocument();
    expect(screen.getByLabelText('Material')).toBeInTheDocument();
    expect(screen.getByLabelText('Application')).toBeInTheDocument();
    expect(screen.getByLabelText('Pressure Class')).toBeInTheDocument();
  });

  test('switches to circular duct inputs correctly', () => {
    renderWithProviders(<DuctSizerPage />);

    // Switch to circular
    fireEvent.change(screen.getByLabelText('Duct Shape'), { target: { value: 'circular' } });

    // Should show diameter input instead of width/height
    expect(screen.getByLabelText('Diameter (inches)')).toBeInTheDocument();
    expect(screen.queryByLabelText('Width (inches)')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Height (inches)')).not.toBeInTheDocument();
  });

  test('material and application selectors work correctly', () => {
    renderWithProviders(<DuctSizerPage />);

    // Test material selector
    fireEvent.change(screen.getByLabelText('Material'), { target: { value: 'stainless' } });
    expect(screen.getByDisplayValue('Stainless Steel')).toBeInTheDocument();

    // Test application selector
    fireEvent.change(screen.getByLabelText('Application'), { target: { value: 'exhaust' } });
    expect(screen.getByDisplayValue('Exhaust Air')).toBeInTheDocument();
  });

  test('pressure class selector works correctly', () => {
    renderWithProviders(<DuctSizerPage />);

    // Test pressure class selector
    fireEvent.change(screen.getByLabelText('Pressure Class'), { target: { value: 'medium' } });
    expect(screen.getByDisplayValue('Medium Pressure (2-6" w.g.)')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Pressure Class'), { target: { value: 'high' } });
    expect(screen.getByDisplayValue('High Pressure (6-10" w.g.)')).toBeInTheDocument();
  });
});
