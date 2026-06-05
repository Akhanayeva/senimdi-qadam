/**
 * Notifications API — Real backend calls
 * Base: /core/notifications
 */
import { get, patch, buildQuery } from './apiClient.js'

/** GET /notifications/my — мои уведомления
 *  @param {{ unreadOnly?, limit?, offset? }} filters
 */
export const getMyNotifications = async (filters = {}) => {
  const res = await get(buildQuery('/core/notifications/my', {
    unreadOnly: filters.unreadOnly ? true : undefined,
    limit:  filters.limit  ?? 50,
    offset: filters.offset ?? 0,
  }))
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

/** Удобный счётчик непрочитанных */
export const getUnreadCount = async () => {
  const res = await getMyNotifications({ unreadOnly: true, limit: 100 })
  return res.total ?? (res.items?.length ?? 0)
}

/** PATCH /notifications/my/read-all — отметить все прочитанными */
export const markAllRead = async () => patch('/core/notifications/my/read-all', {})

/** PATCH /notifications/:id/read — отметить одно прочитанным */
export const markRead = async (id) => patch(`/core/notifications/${id}/read`, {})
