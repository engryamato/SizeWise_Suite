import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../providers/ThemeProvider';
import DuctSizerPage from '../DuctSizerPage';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('DuctSizerPage', () => {
  test('renders duct sizer form', () => {
    renderWithProviders(<DuctSizerPage />);
    
    expect(screen.getByText('Air Duct Sizer')).toBeInTheDocument();
    expect(screen.getByLabelText(/airflow \(cfm\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duct shape/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
  });

  test('calculates results for rectangular duct', () => {
    renderWithProviders(<DuctSizerPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/airflow \(cfm\)/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/width \(inches\)/i), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText(/height \(inches\)/i), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText(/duct length \(feet\)/i), { target: { value: '100' } });
    
    // Calculate
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));
    
    // Check results appear
    expect(screen.getByText(/velocity/i)).toBeInTheDocument();
    expect(screen.getByText(/pressure loss/i)).toBeInTheDocument();
    expect(screen.getByText(/ft\/min/)).toBeInTheDocument();
  });

  test('switches to circular duct inputs', () => {
    renderWithProviders(<DuctSizerPage />);
    
    // Switch to circular
    fireEvent.change(screen.getByLabelText(/duct shape/i), { target: { value: 'circular' } });
    
    // Should show diameter input instead of width/height
    expect(screen.getByLabelText(/diameter \(inches\)/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/width \(inches\)/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/height \(inches\)/i)).not.toBeInTheDocument();
  });
});
