import { render, screen } from '@testing-library/react';
import StarBorder from '../StarBorder';

describe('StarBorder', () => {
  it('renders children', () => {
    render(<StarBorder>Test Content</StarBorder>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
