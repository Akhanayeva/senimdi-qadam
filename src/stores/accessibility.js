import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAccessibilityStore = defineStore('accessibility', () => {
  const highContrast = ref(localStorage.getItem('sqHighContrast') === 'true')
  const fontSize = ref(localStorage.getItem('sqFontSize') || 'medium')
  const lang = ref(localStorage.getItem('sqLang') || 'rus')

  const applySettings = () => {
    const html = document.documentElement
    html.classList.toggle('high-contrast', highContrast.value)
    html.setAttribute('data-font-size', fontSize.value)
    html.setAttribute('lang', lang.value === 'kaz' ? 'kk' : 'ru')
  }

  watch(highContrast, (v) => {
    localStorage.setItem('sqHighContrast', v)
    applySettings()
  })

  watch(fontSize, (v) => {
    localStorage.setItem('sqFontSize', v)
    applySettings()
  })

  watch(lang, (v) => {
    localStorage.setItem('sqLang', v)
    applySettings()
  })

  const toggleContrast = () => { highContrast.value = !highContrast.value }
  const setFontSize = (size) => { fontSize.value = size }
  const setLang = (l) => { lang.value = l }

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang.value === 'kaz' ? 'kk-KZ' : 'ru-RU'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }

  applySettings()

  return { highContrast, fontSize, lang, toggleContrast, setFontSize, setLang, speak, stopSpeaking }
})
