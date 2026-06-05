/**
 * News API — Real backend calls
 * Base: /core/news
 */
import { get, post, del, patch, upload, buildQuery } from './apiClient.js'

export const getNews = async (filters = {}) => {
  const res = await get(buildQuery('/core/news', {
    search: filters.search,
    sort:   filters.sort,
    limit:  filters.limit  ?? 20,
    offset: filters.offset ?? 0,
  }), false)
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

export const getNewsById = async (id) => get(`/core/news/${id}`, false)

export const getLatestNews = async () => getNews({ sort: 'latest', limit: 6 })

export const getMyNews = async () => {
  const res = await get('/core/news/my/list')
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

export const createNews = async (_token, payload) => post('/core/news', payload)

export const uploadNewsImage = async (newsId, file) => {
  const form = new FormData()
  form.append('file', file)
  return upload(`/core/news/${newsId}/image`, form)
}

export const deleteNews = async (_token, id) => del(`/core/news/${id}`)

export const likeNews = async (id) => post(`/core/news/${id}/like`, {})

export const getNewsComments = async (newsId, limit = 20, offset = 0) => {
  const res = await get(buildQuery(`/core/news/${newsId}/comments`, { limit, offset }), false)
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

export const addNewsComment = async (newsId, text) => post(`/core/news/${newsId}/comments`, { text })

export const deleteNewsComment = async (newsId, commentId) => del(`/core/news/${newsId}/comments/${commentId}`)

export const getPendingNews = async () => {
  const res = await get('/core/news/moderation/pending')
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

export const moderateNews = async (newsId, status) => patch(`/core/news/${newsId}/moderate`, { status })

/** GET /news/moderation/comments — очередь комментариев на модерацию (MODERATOR/ADMIN) */
export const getPendingComments = async (limit = 20, offset = 0) => {
  const res = await get(buildQuery('/core/news/moderation/comments', { limit, offset }))
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

/** PATCH /news/comments/:commentId/moderate — { status: 'PUBLISHED'|'REJECTED', reason? } */
export const moderateComment = async (commentId, status, reason) =>
  patch(`/core/news/comments/${commentId}/moderate`, reason ? { status, reason } : { status })
