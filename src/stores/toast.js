import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Глобальные тосты (всплывающие уведомления).
 * Использование из любого компонента:
 *   import { useToast } from '../stores/toast.js'
 *   const toast = useToast()
 *   toast.success('Сохранено')
 *   toast.error('Что-то пошло не так')
 */
export const useToast = defineStore('toast', () => {
  const items = ref([])
  let seq = 0

  const dismiss = (id) => {
    items.value = items.value.filter(t => t.id !== id)
  }

  const show = (message, type = 'info', timeout = 4000) => {
    const id = ++seq
    items.value.push({ id, message, type })
    if (timeout > 0) setTimeout(() => dismiss(id), timeout)
    return id
  }

  const success = (msg, timeout) => show(msg, 'success', timeout)
  const error   = (msg, timeout) => show(msg, 'error', timeout ?? 6000)
  const info    = (msg, timeout) => show(msg, 'info', timeout)
  const warning = (msg, timeout) => show(msg, 'warning', timeout)

  return { items, show, success, error, info, warning, dismiss }
})
