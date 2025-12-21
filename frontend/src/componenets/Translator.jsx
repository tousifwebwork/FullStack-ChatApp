import React from 'react'
import { X } from 'lucide-react'
import { motion } from "motion/react"
import { useTranslatorStore } from '../store/useTranslatorStore'


const Translator = ({ onClose }) => {
  const {
    inputText,
    outputText,
    targetLanguage,
    isLoading,
    error,
    setInputText,
    setTargetLanguage,
    translate,
    reset,
  } = useTranslatorStore();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg w-96 relative">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>
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
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
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
          onClick={translate}
          disabled={isLoading || !inputText.trim()}
          className="p-3 w-full bg-blue-400 rounded-2xl text-xl mt-2 mb-2 cursor-pointer disabled:opacity-50">
          {isLoading ? 'Translating...' : 'TRANSLATE'}
        </motion.button>

        {error && (
          <div className="bg-error/20 p-3 rounded-lg mt-2">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {outputText && !error && (
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