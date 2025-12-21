
const langCodes = {
  'Spanish': 'es',
  'French': 'fr',
  'German': 'de',
  'Hindi': 'hi',
  'Chinese': 'zh-CN',
  'Japanese': 'ja'
};

export const translateText = async (text, targetLanguage) => {
  const targetCode = langCodes[targetLanguage] || 'es';
  
  console.log('Translating:', text, 'to', targetLanguage, '(', targetCode, ')');
  
  // Using MyMemory API - FREE, no key needed
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetCode}`;
  
  const res = await fetch(url);
  const data = await res.json();
  
  console.log('API Response:', data);
  
  const translatedText = data.responseData?.translatedText || 'Translation failed';
  return { translatedText };
};