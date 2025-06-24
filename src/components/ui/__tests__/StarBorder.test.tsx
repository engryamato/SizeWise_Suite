import { render, screen } from '@testing-library/react';
import { StarBorder } from '../StarBorder';

describe('StarBorder', () => {
  test('renders children inside styled container', () => {
    render(<StarBorder>Content</StarBorder>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
