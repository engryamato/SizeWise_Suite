import { render, screen } from '@testing-library/react';
import StarBorder from '../StarBorder';

describe('StarBorder', () => {
  test('renders children and animation divs', () => {
    render(
      <StarBorder>
        <span>Inner Content</span>
      </StarBorder>
    );

    expect(screen.getByText('Inner Content')).toBeInTheDocument();
    const animDivs = screen.getAllByTestId('star-border-animation');
    expect(animDivs).toHaveLength(4);
  });
});
