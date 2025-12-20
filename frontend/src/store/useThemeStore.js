import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  // Get theme from localStorage or use default
  theme: localStorage.getItem('chat-theme') || 'coffee',

  // Update theme and persist to localStorage
  setTheme: (theme) => {
    localStorage.setItem('chat-theme', theme);
    set({ theme });
  },
}));