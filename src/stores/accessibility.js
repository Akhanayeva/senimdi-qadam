import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getAccessibilitySettings, updateAccessibilitySettings } from '../api/profile.js'

// Debounce helper to avoid hammering the API on every keystroke
function debounce(fn, ms) {
  let timer
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms) }
}

export const useAccessibilityStore = defineStore('accessibility', () => {
  const highContrast = ref(localStorage.getItem('sqHighContrast') === 'true')
  const fontSize = ref(localStorage.getItem('sqFontSize') || 'medium')
  const lang = ref(localStorage.getItem('sqLang') || 'rus')

  // Flag: skip syncing to backend during initial load from server
  let _syncing = false

  const applySettings = () => {
    const html = document.documentElement
    html.classList.toggle('high-contrast', highContrast.value)
    html.setAttribute('data-font-size', fontSize.value)
    html.setAttribute('lang', lang.value === 'kaz' ? 'kk' : lang.value === 'eng' ? 'en' : 'ru')
  }

  const _pushToServer = debounce(async () => {
    if (_syncing) return
    try {
      await updateAccessibilitySettings({
        highContrast: highContrast.value,
        fontSize: fontSize.value,
        language: lang.value,
      })
    } catch { /* silently fail — local settings still work */ }
  }, 800)

  watch(highContrast, (v) => {
    localStorage.setItem('sqHighContrast', v)
    applySettings()
    _pushToServer()
  })

  watch(fontSize, (v) => {
    localStorage.setItem('sqFontSize', v)
    applySettings()
    _pushToServer()
  })

  watch(lang, (v) => {
    localStorage.setItem('sqLang', v)
    applySettings()
    _pushToServer()
  })

  const toggleContrast = () => { highContrast.value = !highContrast.value }
  const setFontSize = (size) => { fontSize.value = size }
  const setLang = (l) => { lang.value = l }

  /** Load settings from server (call after login) */
  const loadFromServer = async () => {
    _syncing = true
    try {
      const s = await getAccessibilitySettings()
      if (!s) return
      if (s.highContrast !== undefined) { highContrast.value = s.highContrast; localStorage.setItem('sqHighContrast', s.highContrast) }
      if (s.fontSize)  { fontSize.value = s.fontSize;  localStorage.setItem('sqFontSize', s.fontSize) }
      if (s.language)  { lang.value = s.language;      localStorage.setItem('sqLang', s.language) }
      applySettings()
    } catch { /* ignore — local settings still active */ }
    finally { _syncing = false }
  }

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang.value === 'kaz' ? 'kk-KZ' : lang.value === 'eng' ? 'en-US' : 'ru-RU'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }

  applySettings()

  return { highContrast, fontSize, lang, toggleContrast, setFontSize, setLang, speak, stopSpeaking, loadFromServer }
})
