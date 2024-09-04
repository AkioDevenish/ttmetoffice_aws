import { ref, provide, inject, watchEffect } from 'vue';

const ThemeSymbol = Symbol('ThemeContext');

export function useThemeProvider() {
  const theme = ref(localStorage.getItem('theme') || 'light');

  const changeCurrentTheme = (newTheme) => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  watchEffect(() => {
    document.documentElement.classList.toggle('dark', theme.value === 'dark');
  });

  provide(ThemeSymbol, {
    currentTheme: theme,
    changeCurrentTheme
  });

  return {
    currentTheme: theme,
    changeCurrentTheme
  };
}

export function useTheme() {
  const theme = inject(ThemeSymbol);
  if (!theme) {
    throw new Error('useTheme() must be used within a ThemeProvider');
  }
  return theme;
}