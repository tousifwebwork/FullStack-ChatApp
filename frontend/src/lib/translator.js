const langCodes = {
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Hindi: 'hi',
  Chinese: 'zh-CN',
  Japanese: 'ja',
};

/**
 * Translates text using MyMemory API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language name (e.g., 'Spanish')
 * @returns {Promise<{ translatedText: string, error: string | null }>}
 */
export const translateText = async (text, targetLanguage) => {
  const targetCode = langCodes[targetLanguage] || 'es';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetCode}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return { translatedText: '', error: 'Translation service unavailable' };
    }

    const data = await res.json();
    const translatedText = data.responseData?.translatedText;

    if (!translatedText) {
      return { translatedText: '', error: 'Translation failed' };
    }

    return { translatedText, error: null };
  } catch {
    return { translatedText: '', error: 'Network error' };
  }
};