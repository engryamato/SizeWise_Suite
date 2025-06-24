import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
}

export const StarBorder: React.FC<StarBorderProps> = ({ children, className }) => {
  return (
    <div className={cn('relative rounded-lg border border-primary-500', className)}>
      {children}
      <Star
        className="absolute -top-2 left-1/2 w-4 h-4 -translate-x-1/2 text-primary-500 animate-star-movement-top"
        aria-hidden="true"
      />
      <Star
        className="absolute -bottom-2 left-1/2 w-4 h-4 -translate-x-1/2 text-primary-500 animate-star-movement-bottom"
        aria-hidden="true"
      />
    </div>
  );
};

export default StarBorder;
