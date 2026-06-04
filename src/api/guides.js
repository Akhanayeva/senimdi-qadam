/**
 * Guides API — Real backend calls
 * Base: /core/guides
 */
import { get, post, patch, buildQuery } from './apiClient.js'

export const getGuides = async (filters = {}) => {
  const res = await get(buildQuery('/core/guides', {
    category: filters.category !== 'all' ? filters.category : undefined,
    search:   filters.search,
    limit:    filters.limit  ?? 50,
    offset:   filters.offset ?? 0,
  }), false)
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

export const getGuideById = async (id) => get(`/core/guides/${id}`, false)

export const likeGuide = async (id) => post(`/core/guides/${id}/like`, {})

export const createGuide = async (payload) => post('/core/guides', payload)

export const publishGuide = async (id) => patch(`/core/guides/${id}/publish`, {})

export const unpublishGuide = async (id) => patch(`/core/guides/${id}/unpublish`, {})

/** GET /core/profile/me/liked-guides — returns array of guide IDs */
export const getLikedGuideIds = async () => {
  const res = await get('/core/profile/me/liked-guides')
  return Array.isArray(res) ? res : (res.items ?? [])
}
