import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@theme/tokens';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('cfacme-theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getInitialTheme(),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    {
      name: 'cfacme-theme-store',
      // 仅持久化 theme 字段
      partialize: (state) => ({ theme: state.theme }),
      // 兼容 index.html 中直接读取的 cfacme-theme 键
      storage: {
        getItem: (_name) => {
          const theme = localStorage.getItem('cfacme-theme');
          if (theme === 'dark' || theme === 'light') {
            return { state: { theme }, version: 0 };
          }
          return null;
        },
        setItem: (_name, value) => {
          // value 是 StorageValue<{theme: ThemeMode}>
          const v = value as { state: { theme: ThemeMode } };
          localStorage.setItem('cfacme-theme', v.state.theme);
        },
        removeItem: () => localStorage.removeItem('cfacme-theme'),
      },
    },
  ),
);
