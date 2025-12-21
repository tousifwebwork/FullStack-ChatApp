import {create} from 'zustand';
import {translateText} from '../lib/translator';

exports.useTranslatorStore = create((set)=>{
    inputText: ''
    outputText: ''
    targetLanguage: 'en'
    isLoading: false
    setinputText: (text) => set({inputText: text})
    settargetLanguage: (lang) => set({targetLanguage: lang})

    translate: async () => {
        set({isLoading: true});
        const result =  await translateText(get().inputText,get().targetLanguage);
        set({outputText: result.translateText , isLoading: false});
    }
})