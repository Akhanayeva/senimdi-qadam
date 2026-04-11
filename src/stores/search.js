import { defineStore } from 'pinia'
import { ref } from 'vue'
import mockOrgs from '../mock/organizations.json'
import mockNews from '../mock/news.json'

export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  const results = ref([])
  const isOpen = ref(false)

  const search = (q) => {
    query.value = q
    if (!q || q.length < 2) { results.value = []; return }
    const lower = q.toLowerCase()
    const orgs = mockOrgs.filter(o =>
      o.name.toLowerCase().includes(lower) ||
      o.nameKaz.toLowerCase().includes(lower) ||
      o.description.toLowerCase().includes(lower) ||
      (o.tags || []).some(t => t.toLowerCase().includes(lower))
    ).slice(0, 5).map(o => ({ ...o, type: 'organization' }))

    const news = mockNews.filter(n =>
      n.title.toLowerCase().includes(lower) ||
      n.titleKaz.toLowerCase().includes(lower) ||
      n.excerpt.toLowerCase().includes(lower)
    ).slice(0, 3).map(n => ({ ...n, type: 'news' }))

    results.value = [...orgs, ...news]
  }

  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false; query.value = ''; results.value = [] }

  return { query, results, isOpen, search, open, close }
})
