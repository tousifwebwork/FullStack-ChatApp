import { create } from 'zustand';
import { translateText } from '../lib/translator';

export const useTranslatorStore = create((set, get) => ({
  inputText: '',
  outputText: '',
  targetLanguage: 'Spanish',
  isLoading: false,
  error: null,

  setInputText: (text) => set({ inputText: text }),
  setTargetLanguage: (lang) => set({ targetLanguage: lang }),
  setOutputText: (text) => set({ outputText: text }),
  clearError: () => set({ error: null }),

  translate: async () => {
    const { inputText, targetLanguage } = get();
    if (!inputText.trim()) return;

    set({ isLoading: true, error: null });

    const result = await translateText(inputText, targetLanguage);

    if (result.error) {
      set({ outputText: '', error: result.error, isLoading: false });
    } else {
      set({ outputText: result.translatedText, error: null, isLoading: false });
    }
  },

  reset: () => set({ inputText: '', outputText: '', error: null }),
}))