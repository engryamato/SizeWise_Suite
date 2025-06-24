import React from 'react';
import clsx from 'clsx';

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * StarBorder wraps content with four animated star elements at each corner.
 * The stars are simple divs that can be styled via Tailwind animations.
 */
const StarBorder: React.FC<StarBorderProps> = ({ children, className = '' }) => {
  return (
    <div className={clsx('relative inline-block', className)}>
      {children}
      {/* Animation container */}
      <div className="pointer-events-none absolute inset-0" data-testid="star-border-container">
        <div
          data-testid="star-border-animation"
          className="absolute left-0 top-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
        />
        <div
          data-testid="star-border-animation"
          className="absolute right-0 top-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
        />
        <div
          data-testid="star-border-animation"
          className="absolute left-0 bottom-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
        />
        <div
          data-testid="star-border-animation"
          className="absolute right-0 bottom-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
        />
      </div>
    </div>
  );
};

export default StarBorder;
