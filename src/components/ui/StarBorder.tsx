import React from 'react';
import { cn } from '@/lib/utils';

export interface StarBorderProps extends React.HTMLAttributes<HTMLDivElement> {}

const StarBorder = React.forwardRef<HTMLDivElement, StarBorderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative inline-block text-primary-600 dark:text-primary-300', className)}
        {...props}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon
            points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <div className="relative p-4">{children}</div>
      </div>
    );
  }
);

StarBorder.displayName = 'StarBorder';

export default StarBorder;
