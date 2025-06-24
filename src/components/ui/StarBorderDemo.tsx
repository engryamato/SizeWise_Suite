import React from 'react';
import StarBorder from './StarBorder';

const StarBorderDemo: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-900">
      <StarBorder>Theme-aware Border</StarBorder>
    </div>
  );
};

export default StarBorderDemo;
