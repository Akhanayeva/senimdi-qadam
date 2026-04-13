/**
 * Жалобы — Mock API
 * Mirrors:
 *   POST /api/core/complaints           — создать жалобу
 *   GET  /api/core/complaints/my        — мои жалобы
 *   GET  /api/core/complaints/:id       — одна жалоба
 *   GET  /api/core/complaints/all       — все жалобы (ADMIN/MODERATOR)
 *   PATCH /api/core/complaints/:id/status — изменить статус
 *
 * targetType: "news" | "comment" | "user" | "org"
 * Статусы: OPEN | UNDER_REVIEW | RESOLVED | DISMISSED
 *
 * Replace mock implementations with real fetch() when backend is ready.
 */

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// In-memory complaints store
const complaintsStore = [
  {
    id: 'cmp-001',
    userId: 'usr-002',
    targetType: 'news',
    targetId: 'news-004',
    reason: 'Недостоверная информация',
    description: 'В статье указаны неверные данные об организации.',
    status: 'RESOLVED',
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-01-22T14:00:00.000Z'
  }
]

/**
 * POST /api/core/complaints
 * Body: { targetType, targetId, reason, description }
 * Response: complaint object
 */
export async function createComplaint(accessToken, { targetType, targetId, reason, description = '' }) {
  await delay(600)
  const complaint = {
    id: 'cmp-' + Date.now(),
    userId: 'usr-current',
    targetType,
    targetId,
    reason,
    description,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  complaintsStore.unshift(complaint)
  return complaint
}

/**
 * GET /api/core/complaints/my
 */
export async function getMyComplaints(accessToken) {
  await delay(500)
  return [...complaintsStore]
}

/**
 * GET /api/core/complaints/:id
 */
export async function getComplaintById(accessToken, id) {
  await delay(300)
  const item = complaintsStore.find(c => c.id === id)
  if (!item) throw new Error('Жалоба не найдена')
  return { ...item }
}

/**
 * GET /api/core/complaints/all  (ADMIN/MODERATOR)
 */
export async function getAllComplaints(accessToken) {
  await delay(500)
  return { items: [...complaintsStore], total: complaintsStore.length }
}

/**
 * PATCH /api/core/complaints/:id/status  (ADMIN/MODERATOR)
 * Body: { status: "UNDER_REVIEW"|"RESOLVED"|"DISMISSED" }
 */
export async function updateComplaintStatus(accessToken, id, status) {
  await delay(400)
  const item = complaintsStore.find(c => c.id === id)
  if (!item) throw new Error('Жалоба не найдена')
  item.status = status
  item.updatedAt = new Date().toISOString()
  return { ...item }
}
