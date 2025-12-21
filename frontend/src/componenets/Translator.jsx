import React, { useState } from 'react'
import { X } from 'lucide-react'
import { motion } from "motion/react"
import { translateText } from '../lib/translator'


const Translator = ({ onClose }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const result = await translateText(inputText, targetLang);
      setOutputText(result.translatedText || result.text || 'Translation failed');
    } catch (err) {
      setOutputText('Error translating');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg w-96 relative">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>
          <X size={16} />
        </button>
        <h3 className="font-bold text-lg mb-4">Translator</h3>
        
        <textarea 
          className="textarea textarea-bordered w-full mb-2" 
          placeholder="Enter text to translate"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={3}
        />
        
        <select 
          className="select select-bordered w-full mb-2"
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
        >
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Hindi">Hindi</option>
          <option value="Chinese">Chinese</option>
          <option value="Japanese">Japanese</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }} 
          onClick={handleTranslate}
          disabled={isLoading}
          className="p-3 w-full bg-blue-400 rounded-2xl text-xl mt-2 mb-2 cursor-pointer disabled:opacity-50">
          {isLoading ? 'Translating...' : 'TRANSLATE'}
        </motion.button>

        {outputText && (
          <div className="bg-base-200 p-3 rounded-lg mt-2">
            <p className="text-sm text-zinc-400">Translation:</p>
            <p>{outputText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Translator