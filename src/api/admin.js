/**
 * Admin API — Real backend calls (роли ADMIN / MODERATOR)
 * Base: /core/admin/...
 */
import { get, post, patch, del, buildQuery } from './apiClient.js'

// ── Пользователи ──────────────────────────────────────────────────────────────

/** GET /admin/users — список пользователей (фильтры: q, role, limit, offset) */
export const getUsers = async (filters = {}) => {
  const res = await get(buildQuery('/core/admin/users', {
    q:      filters.q || filters.search,
    role:   filters.role !== 'all' ? filters.role : undefined,
    limit:  filters.limit  ?? 50,
    offset: filters.offset ?? 0,
  }))
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

/** GET /admin/users/:id */
export const getUserById = async (id) => get(`/core/admin/users/${id}`)

/** PATCH /admin/users/:id/role — { role } */
export const updateUserRole = async (id, role) =>
  patch(`/core/admin/users/${id}/role`, { role })

/** PATCH /admin/users/:id/ban — переключить блокировку */
export const toggleUserBan = async (id) => patch(`/core/admin/users/${id}/ban`, {})

// ── Организации ───────────────────────────────────────────────────────────────

/** GET /admin/organizations */
export const adminGetOrganizations = async (filters = {}) => {
  const res = await get(buildQuery('/core/admin/organizations', filters))
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

/** GET /admin/organizations/:id */
export const adminGetOrganization = async (id) => get(`/core/admin/organizations/${id}`)

/** POST /admin/organizations — создать организацию */
export const adminCreateOrganization = async (data) => post('/core/admin/organizations', data)

/** PATCH /admin/organizations/:id — редактировать */
export const adminUpdateOrganization = async (id, fields) =>
  patch(`/core/admin/organizations/${id}`, fields)

/** PATCH /admin/organizations/:id/verify — { isVerified, note? } */
export const verifyOrganization = async (id, isVerified, note) =>
  patch(`/core/admin/organizations/${id}/verify`, note ? { isVerified, note } : { isVerified })

/** DELETE /admin/organizations/:id (только ADMIN) */
export const adminDeleteOrganization = async (id) => del(`/core/admin/organizations/${id}`)

/** GET /admin/organizations/:id/logs — журнал верификации */
export const getOrganizationLogs = async (id) => get(`/core/admin/organizations/${id}/logs`)

// ── Новости (модерация) ───────────────────────────────────────────────────────

/** GET /admin/news — все новости включая DRAFT/PENDING/REJECTED */
export const adminGetNews = async (filters = {}) => {
  const res = await get(buildQuery('/core/admin/news', {
    status: filters.status !== 'all' ? filters.status : undefined,
    q:      filters.q || filters.search,
    limit:  filters.limit  ?? 50,
    offset: filters.offset ?? 0,
  }))
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

/** GET /admin/news/stats — счётчики по статусам */
export const getNewsStats = async () => get('/core/admin/news/stats')

/** PATCH /admin/news/:id/moderate — { status: 'PUBLISHED'|'REJECTED', reason? } */
export const adminModerateNews = async (id, status, reason) =>
  patch(`/core/admin/news/${id}/moderate`, reason ? { status, reason } : { status })

/** DELETE /admin/news/:id (только ADMIN) */
export const adminDeleteNews = async (id) => del(`/core/admin/news/${id}`)

// ── Обращения (tickets) ───────────────────────────────────────────────────────

/** GET /admin/tickets */
export const adminGetTickets = async (limit = 100, offset = 0) => {
  const res = await get(buildQuery('/core/admin/tickets', { limit, offset }))
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

/** PATCH /admin/tickets/:id — { status } */
export const adminSetTicketStatus = async (id, status) =>
  patch(`/core/admin/tickets/${id}`, { status })

// ── Жалобы (complaints) ───────────────────────────────────────────────────────

/** GET /admin/complaints */
export const adminGetComplaints = async (limit = 100, offset = 0) => {
  const res = await get(buildQuery('/core/admin/complaints', { limit, offset }))
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

/** PATCH /admin/complaints/:id — { status } */
export const adminSetComplaintStatus = async (id, status) =>
  patch(`/core/admin/complaints/${id}`, { status })

// ── Журнал действий админов ───────────────────────────────────────────────────

/** GET /admin/audit — история действий (cursor-based) */
export const getAuditLogs = async (filters = {}) =>
  get(buildQuery('/core/admin/audit', {
    actorId:    filters.actorId,
    targetType: filters.targetType,
    action:     filters.action,
    limit:      filters.limit ?? 50,
    cursor:     filters.cursor,
  }))
