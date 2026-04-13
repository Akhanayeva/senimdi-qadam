import guidesData from '../mock/guides.json'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// In-memory state
const guidesStore = guidesData.map(g => ({ ...g }))
const likedSet = new Set(['guide-001', 'guide-002']) // pre-liked for demo

// GET /api/core/guides?category=&search=&page=1&limit=10
export async function getGuides(filters = {}) {
  await delay()
  const { category, search, page = 1, limit = 20 } = filters

  let items = guidesStore.filter(g => g.isPublished)

  if (category && category !== 'all') {
    items = items.filter(g => g.category === category)
  }

  if (search) {
    const q = search.toLowerCase()
    items = items.filter(g =>
      g.titleRu?.toLowerCase().includes(q) ||
      g.titleKk?.toLowerCase().includes(q) ||
      g.bodyRu?.toLowerCase().includes(q) ||
      g.tags?.some(t => t.toLowerCase().includes(q))
    )
  }

  const total = items.length
  const start = (page - 1) * limit
  const pageItems = items.slice(start, start + limit)

  return { items: pageItems, total }
}

// GET /api/core/guides/:id
export async function getGuideById(id) {
  await delay()
  const guide = guidesStore.find(g => g.id === id)
  if (!guide) throw new Error('Guide not found')
  return { ...guide, liked: likedSet.has(id) }
}

// POST /api/core/guides/:id/like  (toggle)
export async function likeGuide(id) {
  await delay(200)
  const guide = guidesStore.find(g => g.id === id)
  if (!guide) throw new Error('Guide not found')

  if (likedSet.has(id)) {
    likedSet.delete(id)
    guide.likesCount = Math.max(0, guide.likesCount - 1)
  } else {
    likedSet.add(id)
    guide.likesCount = guide.likesCount + 1
  }
  return { liked: likedSet.has(id), likesCount: guide.likesCount }
}

// GET liked guide IDs for current user
export async function getLikedGuideIds() {
  await delay(150)
  return [...likedSet]
}

// GET distinct categories
export async function getGuideCategories() {
  await delay(100)
  const cats = [...new Set(guidesStore.map(g => g.category))]
  return cats
}
