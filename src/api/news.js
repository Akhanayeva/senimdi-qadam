/**
 * News Mock API
 * Mirrors: GET  /api/core/news
 *          GET  /api/core/news/:id
 *          GET  /api/core/news/my/list
 *          POST /api/core/news/:id/like   (toggle)
 *          GET  /api/core/news/:id/comments
 *          POST /api/core/news/:id/comments
 *
 * Field names match real API:
 *   id, authorId, author{profile{firstName,avatarUrl}},
 *   titleRu, titleKk, bodyRu, bodyKk, imageUrl,
 *   status (PUBLISHED|PENDING|DRAFT|REJECTED),
 *   publishedAt, likesCount, commentsCount, createdAt
 *
 * Replace with real fetch() calls when backend is ready.
 */

import mockData from '../mock/news.json'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// In-memory liked set — simulates per-user like state
const likedSet = new Set()

/** GET /api/core/news — public feed
 *  @param {{ search?: string, sort?: 'latest'|'popular', limit?: number, offset?: number }} filters
 *  @returns {{ items: Array, total: number }}
 */
export const getNews = async (filters = {}) => {
  await delay(500)
  let data = [...mockData]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    data = data.filter(n =>
      (n.titleRu || '').toLowerCase().includes(q) ||
      (n.titleKk || '').toLowerCase().includes(q) ||
      (n.bodyRu  || '').toLowerCase().includes(q)
    )
  }

  if (filters.sort === 'popular') {
    data = [...data].sort((a, b) => b.likesCount - a.likesCount)
  }

  return { items: data, total: data.length }
}

/** GET /api/core/news/:id */
export const getNewsById = async (id) => {
  await delay(300)
  // Support UUID strings (news-001) and short numeric IDs from old routes
  const item = mockData.find(n =>
    n.id === id ||
    n.id === `news-00${id}` ||
    String(n.id) === String(id)
  )
  if (!item) return null
  return { ...item, liked: likedSet.has(item.id) }
}

/** 6 latest for the homepage widget */
export const getLatestNews = async () => {
  await delay(300)
  return mockData.filter(n => n.status === 'PUBLISHED').slice(0, 6)
}

/** POST /api/core/news/:id/like  — toggle; returns { liked, likesCount } */
export const likeNews = async (id) => {
  await delay(200)
  const item = mockData.find(n => n.id === id || String(n.id) === String(id))
  if (!item) return { liked: false, likesCount: 0 }
  if (likedSet.has(item.id)) {
    likedSet.delete(item.id)
    item.likesCount = Math.max(0, item.likesCount - 1)
  } else {
    likedSet.add(item.id)
    item.likesCount++
  }
  return { liked: likedSet.has(item.id), likesCount: item.likesCount }
}

// In-memory comments store: { [newsId]: Comment[] }
const commentsStore = {
  'news-001': [
    {
      id: 'cmt-001',
      newsId: 'news-001',
      author: { profile: { firstName: 'Асель', avatarUrl: null } },
      text: 'Очень важная новость, спасибо!',
      status: 'PUBLISHED',
      createdAt: '2025-11-21T10:00:00.000Z'
    }
  ]
}

/** GET /api/core/news/:id/comments?limit=20&offset=0
 *  Returns array of PUBLISHED comments (real API paginates; mock returns array directly)
 */
export const getNewsComments = async (newsId, limit = 20, offset = 0) => {
  await delay(400)
  const all = (commentsStore[newsId] || []).filter(c => c.status === 'PUBLISHED')
  return all.slice(offset, offset + limit)
}

/** DELETE /api/core/news/:id/comments/:commentId */
export const deleteNewsComment = async (newsId, commentId) => {
  await delay(300)
  if (commentsStore[newsId]) {
    commentsStore[newsId] = commentsStore[newsId].filter(c => c.id !== commentId)
  }
  return { success: true }
}

/** POST /api/core/news/:id/comments — new comments start as PENDING until moderated */
export const addNewsComment = async (newsId, text, authorFirstName = 'Вы') => {
  await delay(400)
  const comment = {
    id: 'cmt-' + Date.now(),
    newsId,
    author: { profile: { firstName: authorFirstName, avatarUrl: null } },
    text,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  }
  if (!commentsStore[newsId]) commentsStore[newsId] = []
  commentsStore[newsId].push(comment)
  return comment
}

/** POST /api/core/news — create news (status = PENDING)
 *  Body: { titleRu, titleKk, bodyRu, bodyKk }
 */
export const createNews = async (accessToken, payload) => {
  await delay(600)
  const newItem = {
    id: 'news-' + Date.now(),
    authorId: 'usr-current',
    author: { profile: { firstName: 'Вы', avatarUrl: null } },
    titleRu: payload.titleRu || '',
    titleKk: payload.titleKk || '',
    bodyRu: payload.bodyRu || '',
    bodyKk: payload.bodyKk || '',
    imageUrl: null,
    status: 'PENDING',
    publishedAt: null,
    likesCount: 0,
    commentsCount: 0,
    createdAt: new Date().toISOString()
  }
  mockData.unshift(newItem)
  return newItem
}

/** DELETE /api/core/news/:id */
export const deleteNews = async (accessToken, id) => {
  await delay(400)
  const idx = mockData.findIndex(n => n.id === id || String(n.id) === String(id))
  if (idx !== -1) mockData.splice(idx, 1)
  return { success: true }
}

/** GET /api/core/news/my/list — own articles (all statuses) */
export const getMyNews = async () => {
  await delay(500)
  return {
    items: mockData.slice(0, 2).map(n => ({ ...n })),
    total: 2
  }
}
