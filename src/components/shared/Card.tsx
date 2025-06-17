import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, description, children, footer, noPadding = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
          className
        )}
        {...props}
      >
        {(title || description) && (
          <div className="border-b border-gray-200 px-6 py-5">
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
        )}
        <div className={cn(noPadding ? 'p-0' : 'p-6')}>{children}</div>
        {footer && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 py-4 border-b border-gray-200', className)} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-lg font-medium text-gray-900', className)} {...props} />
);

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-gray-500', className)} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6', className)} {...props} />
);

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('bg-gray-50 px-6 py-4 border-t border-gray-200', className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
