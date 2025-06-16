
import { render, screen } from '@testing-library/react';
import { StatusIndicator, getVelocityStatus, getPressureLossStatus } from '../StatusIndicator';

describe('StatusIndicator', () => {
  test('renders compliant status correctly', () => {
    render(<StatusIndicator status="compliant" showIcon showText />);
    expect(screen.getByText('Compliant')).toBeInTheDocument();
  });

  test('renders warning status correctly', () => {
    render(<StatusIndicator status="warning" showIcon showText />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  test('renders non-compliant status correctly', () => {
    render(<StatusIndicator status="noncompliant" showIcon showText />);
    expect(screen.getByText('Non-compliant')).toBeInTheDocument();
  });

  test('renders only icon when showText is false', () => {
    render(<StatusIndicator status="compliant" showIcon showText={false} />);
    expect(screen.queryByText('Compliant')).not.toBeInTheDocument();
  });

  test('renders only dot when both showIcon and showText are false', () => {
    const { container } = render(
      <StatusIndicator status="compliant" showIcon={false} showText={false} />
    );
    expect(container.firstChild).toHaveClass('w-3', 'h-3', 'rounded-full');
  });
});

describe('Status Helper Functions', () => {
  describe('getVelocityStatus', () => {
    test('returns compliant for normal supply air velocity', () => {
      expect(getVelocityStatus(1500, 'supply')).toBe('compliant');
    });

    test('returns warning for high supply air velocity', () => {
      expect(getVelocityStatus(2200, 'supply')).toBe('warning');
    });

    test('returns noncompliant for excessive supply air velocity', () => {
      expect(getVelocityStatus(3000, 'supply')).toBe('noncompliant');
    });

    test('returns noncompliant for low supply air velocity', () => {
      expect(getVelocityStatus(500, 'supply')).toBe('noncompliant');
    });

    test('handles different application types', () => {
      expect(getVelocityStatus(2800, 'exhaust')).toBe('warning');
      expect(getVelocityStatus(1800, 'return')).toBe('warning');
    });
  });

  describe('getPressureLossStatus', () => {
    test('returns compliant for low pressure loss', () => {
      expect(getPressureLossStatus(0.05)).toBe('compliant');
    });

    test('returns warning for moderate pressure loss', () => {
      expect(getPressureLossStatus(0.09)).toBe('warning');
    });

    test('returns noncompliant for high pressure loss', () => {
      expect(getPressureLossStatus(0.15)).toBe('noncompliant');
    });
  });
});
