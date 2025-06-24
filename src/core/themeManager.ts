// src/core/themeManager.ts
type Theme = 'light' | 'dark' | 'system';

export class ThemeManager {
  private static STORAGE_KEY = 'sizeWise_theme';
  private static currentTheme: Theme = 'system';

  static initialize(): void {
    const savedTheme = localStorage.getItem(ThemeManager.STORAGE_KEY) as Theme | null;
    if (savedTheme) {
      ThemeManager.setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      ThemeManager.setTheme('dark');
    } else {
      ThemeManager.setTheme('light');
    }
  }

  static setTheme(theme: Theme): void {
    ThemeManager.currentTheme = theme;
    localStorage.setItem(ThemeManager.STORAGE_KEY, theme);
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  static getTheme(): Theme {
    return ThemeManager.currentTheme;
  }

  static toggleTheme(): void {
    ThemeManager.setTheme(ThemeManager.currentTheme === 'dark' ? 'light' : 'dark');
  }
}
