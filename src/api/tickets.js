/**
 * Тикеты поддержки — Mock API
 * Mirrors:
 *   POST /api/core/tickets           — создать обращение
 *   GET  /api/core/tickets/my        — мои обращения
 *   GET  /api/core/tickets/:id       — одно обращение
 *   GET  /api/core/tickets/all       — все тикеты (ADMIN/MODERATOR)
 *   PATCH /api/core/tickets/:id/status — изменить статус (ADMIN/MODERATOR)
 *
 * Статусы: OPEN | IN_PROGRESS | RESOLVED | CLOSED
 *
 * Replace mock implementations with real fetch() when backend is ready.
 */

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// In-memory tickets store
const ticketsStore = [
  {
    id: 'tck-001',
    userId: 'usr-002',
    subject: 'Не могу загрузить аватар',
    body: 'При попытке загрузить фото профиля появляется ошибка.',
    status: 'RESOLVED',
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-12T14:00:00.000Z'
  },
  {
    id: 'tck-002',
    userId: 'usr-002',
    subject: 'Вопрос по заявке ИнваТакси',
    body: 'Хотелось бы узнать, когда будет назначен водитель на мою заявку BK-2025-001.',
    status: 'IN_PROGRESS',
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-03-01T11:00:00.000Z'
  }
]

/**
 * POST /api/core/tickets
 * Body: { subject: string, body: string }
 * Response: ticket object
 */
export async function createTicket(accessToken, subject, body) {
  await delay(600)
  const ticket = {
    id: 'tck-' + Date.now(),
    userId: 'usr-current',
    subject,
    body,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  ticketsStore.unshift(ticket)
  return ticket
}

/**
 * GET /api/core/tickets/my
 * Response: array of user's tickets (real API may paginate)
 */
export async function getMyTickets(accessToken) {
  await delay(500)
  // Mock: return all (in real API filtered by userId from JWT)
  return [...ticketsStore]
}

/**
 * GET /api/core/tickets/:id
 */
export async function getTicketById(accessToken, id) {
  await delay(300)
  const ticket = ticketsStore.find(t => t.id === id)
  if (!ticket) throw new Error('Тикет не найден')
  return { ...ticket }
}

/**
 * GET /api/core/tickets/all  (ADMIN/MODERATOR)
 */
export async function getAllTickets(accessToken) {
  await delay(500)
  return { items: [...ticketsStore], total: ticketsStore.length }
}

/**
 * PATCH /api/core/tickets/:id/status  (ADMIN/MODERATOR)
 * Body: { status: "IN_PROGRESS"|"RESOLVED"|"CLOSED" }
 */
export async function updateTicketStatus(accessToken, id, status) {
  await delay(400)
  const ticket = ticketsStore.find(t => t.id === id)
  if (!ticket) throw new Error('Тикет не найден')
  ticket.status = status
  ticket.updatedAt = new Date().toISOString()
  return { ...ticket }
}
