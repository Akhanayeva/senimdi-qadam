import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  const results = ref([])
  const isOpen = ref(false)
  let debounceTimer = null

  const search = async (q) => {
    query.value = q
    if (!q || q.length < 2) { results.value = []; return }

    // Debounce — wait 300ms before hitting API
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
      try {
        const { GATEWAY_URL, getAccessToken } = await import('../api/apiClient.js')
        const headers = { 'Accept-Language': localStorage.getItem('sqLang') === 'kaz' ? 'kk' : 'ru' }
        const token = getAccessToken()
        if (token) headers['Authorization'] = `Bearer ${token}`

        const lower = q.toLowerCase()

        // Search organizations
        const orgRes = await fetch(
          `${GATEWAY_URL}/core/organizations/search?q=${encodeURIComponent(q)}&limit=5`,
          { headers }
        ).then(r => r.ok ? r.json() : { items: [] }).catch(() => ({ items: [] }))

        const orgItems = (Array.isArray(orgRes) ? orgRes : orgRes.items ?? [])
          .slice(0, 5)
          .map(o => ({
            ...o,
            type: 'organization',
            // Normalise name fields — backend returns localised 'name' or both nameRu/nameKk
            nameRus: o.name || o.nameRu || o.nameRus || '',
            nameKaz: o.nameKk || o.nameKaz || o.name || '',
          }))

        // Search news
        const newsRes = await fetch(
          `${GATEWAY_URL}/core/news?search=${encodeURIComponent(q)}&limit=3`,
          { headers }
        ).then(r => r.ok ? r.json() : { items: [] }).catch(() => ({ items: [] }))

        const newsItems = (Array.isArray(newsRes) ? newsRes : newsRes.items ?? [])
          .slice(0, 3)
          .map(n => ({
            ...n,
            type: 'news',
            // Normalise title fields
            title:    n.title    || n.titleRu || n.titleRus || '',
            titleKaz: n.titleKk  || n.titleKaz || n.title || '',
          }))

        results.value = [...orgItems, ...newsItems]
      } catch (e) {
        console.warn('[search] API error:', e.message)
        results.value = []
      }
    }, 300)
  }

  const open  = () => { isOpen.value = true }
  const close = () => { isOpen.value = false; query.value = ''; results.value = []; clearTimeout(debounceTimer) }

  return { query, results, isOpen, search, open, close }
})
