/**
 * Organizations API — Real backend calls
 * Base: /organizations
 */
import { get, post, patch, del, upload, buildQuery } from './apiClient.js'

/**
 * GET /organizations — list with filters
 * @param {{ q?, category?, city?, verified?, limit?, offset? }} filters
 * @returns {{ items: Array, total: number }}
 */
export const getOrganizations = async (filters = {}) => {
  return get(buildQuery('/core/organizations', {
    q:        filters.q || filters.search,
    category: filters.category !== 'all' ? filters.category : undefined,
    city:     filters.city !== 'all'     ? filters.city     : undefined,
    verified: filters.verified           ? true             : undefined,
    limit:    filters.limit  ?? 200,
    offset:   filters.offset ?? 0,
  }))
}

/** GET /organizations/nearby?lat=&lon=&radius= */
export const getNearbyOrganizations = async (lat, lon, radius = 5000) => {
  return get(buildQuery('/core/organizations/nearby', { lat, lon, radius }))
}

/** GET /organizations/search?q= */
export const searchOrganizations = async (q) => {
  return get(buildQuery('/core/organizations/search', { q }))
}

/** GET /organizations/:id */
export const getOrganizationById = async (id) => {
  return get(`/core/organizations/${id}`)
}

/** POST /organizations/:id/save */
export const saveOrganization = async (_token, id) => {
  return post(`/core/organizations/${id}/save`, {})
}

/** DELETE /organizations/:id/save */
export const unsaveOrganization = async (_token, id) => {
  return del(`/core/organizations/${id}/save`)
}

/** GET /organizations/:id/reviews */
export const getOrgReviews = async (orgId) => {
  const res = await get(`/core/organizations/${orgId}/reviews`)
  // Normalise: real API may return array or { items, total }
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

/** POST /organizations/:id/reviews — { rating: 1-5, comment: string } */
export const addOrgReview = async (orgId, rating, comment) => {
  return post(`/core/organizations/${orgId}/reviews`, { rating, comment })
}

/** GET /organizations/mine — org owner's own organisation */
export const getMyOrganization = async () => {
  return get('/core/organizations/mine')
}

/** PATCH /organizations/mine */
export const updateMyOrganization = async (fields) => {
  return patch('/core/organizations/mine', fields)
}

/** GET /organizations/mine/analytics */
export const getMyOrgAnalytics = async () => {
  return get('/core/organizations/mine/analytics')
}

/** POST /organizations/register — register a new organisation */
export const registerOrganization = async (data) => {
  return post('/core/organizations/register', data)
}

// Alias used in HomeView
export const getFeaturedOrganizations = async (limit = 6) => {
  const res = await getOrganizations({ limit, verified: true })
  return res.items ? res.items.slice(0, limit) : res.slice(0, limit)
}

/** GET /profile/me/saved-orgs (or use savedOrgs from auth store) */
export const getSavedOrganizations = async () => {
  const res = await get('/core/profile/me')
  return res.savedOrganizations ?? []
}

// ── Кабинет организации: услуги (только роль ORG_MANAGER) ─────────────────────

/** GET /organizations/mine/saved-users — кто сохранил мою организацию */
export const getMyOrgSavedUsers = async (limit = 20, offset = 0) => {
  const res = await get(buildQuery('/core/organizations/mine/saved-users', { limit, offset }))
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

/** GET /organizations/mine/services — список услуг моей организации */
export const getMyOrgServices = async () => {
  const res = await get('/core/organizations/mine/services')
  if (Array.isArray(res)) return res
  return res.items ?? res
}

/** POST /organizations/mine/services
 *  Body: { nameRu, nameKk?, descriptionRu?, price?, isActive? }
 */
export const createMyOrgService = async (service) =>
  post('/core/organizations/mine/services', service)

/** PATCH /organizations/mine/services/:serviceId */
export const updateMyOrgService = async (serviceId, fields) =>
  patch(`/core/organizations/mine/services/${serviceId}`, fields)

/** DELETE /organizations/mine/services/:serviceId */
export const deleteMyOrgService = async (serviceId) =>
  del(`/core/organizations/mine/services/${serviceId}`)
