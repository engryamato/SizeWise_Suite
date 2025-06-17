// src/components/ThemeToggle.tsx
import React, { useState, useEffect } from 'react';
import { ThemeManager } from '@/core/themeManager';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(ThemeManager.getTheme());

  useEffect(() => {
    ThemeManager.initialize();
    setTheme(ThemeManager.getTheme());
  }, []);

  const handleToggle = () => {
    ThemeManager.toggleTheme();
    setTheme(ThemeManager.getTheme());
  };

  return (
    <button onClick={handleToggle} className="ml-4 px-3 py-1 border rounded">
      Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
    </button>
  );
};

export default ThemeToggle;
