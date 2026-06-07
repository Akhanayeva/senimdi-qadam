/**
 * Taxi / Bookings API — Real backend calls
 * ВАЖНО: taxi-svc проксируется шлюзом через префикс /taxi
 *        (gateway: /api/taxi/* → taxi-svc /*). Поэтому ВСЕ пути начинаются с /taxi.
 * Base: /taxi/bookings, /taxi/drivers, /taxi/chat, /taxi/manager
 * WebSocket: WS_URL + /taxi namespace (socket.io)
 */
import { get, post, patch, del, buildQuery } from './apiClient.js'

// ─── Bookings ────────────────────────────────────────────────────────────────

export const getMyBookings = async () => {
  const res = await get('/taxi/bookings/my')
  if (Array.isArray(res)) return res
  return res.items ?? res
}

export const getBookingById = async (id) => get(`/taxi/bookings/${id}`)

/**
 * POST /taxi/bookings — create a new booking
 * Body: { fromAddress, toAddress, fromLat?, fromLon?, toLat?, toLon?,
 *         scheduledAt?, disabilityType?, note? }
 */
export const createBooking = async (payload) => post('/taxi/bookings', payload)

/**
 * PATCH /taxi/bookings/:id/cancel?reason=<reason>
 * NOTE: reason is a QUERY PARAMETER per real API spec
 */
export const cancelBooking = async (id, reason = '') => {
  const path = reason ? `/taxi/bookings/${id}/cancel?reason=${encodeURIComponent(reason)}` : `/taxi/bookings/${id}/cancel`
  return patch(path, {})
}

/** GET /taxi/bookings/estimate-price?fromLat=&fromLon=&toLat=&toLon= */
export const estimatePrice = async (params) => get(buildQuery('/taxi/bookings/estimate-price', params))

/** GET /taxi/bookings/:id/driver-location */
export const getDriverLocation = async (bookingId) => get(`/taxi/bookings/${bookingId}/driver-location`)

// ─── Оплата ───────────────────────────────────────────────────────────────────

/** POST /taxi/bookings/:id/payment?method=CASH|KASPI|CARD — инициировать оплату */
export const initiatePayment = async (bookingId, method = 'CASH') =>
  post(`/taxi/bookings/${bookingId}/payment?method=${encodeURIComponent(method)}`, {})

/** PATCH /taxi/bookings/:id/payment/:txId/confirm — подтвердить оплату */
export const confirmPayment = async (bookingId, txId) =>
  patch(`/taxi/bookings/${bookingId}/payment/${txId}/confirm`, {})

// ─── Chat (REST fallback) ────────────────────────────────────────────────────

/** GET /taxi/chat/bookings/:bookingId/messages */
export const getChatMessages = async (bookingId) => {
  const res = await get(`/taxi/chat/bookings/${bookingId}/messages`)
  if (Array.isArray(res)) return res
  return res.items ?? res
}

/** POST /taxi/chat/bookings/:bookingId/messages — { text } */
export const sendChatMessage = async (bookingId, text) =>
  post(`/taxi/chat/bookings/${bookingId}/messages`, { text })

/** GET /taxi/chat/unread — для пользователя */
export const getUnreadMessages = async () => get('/taxi/chat/unread')

/** GET /taxi/chat/manager/unread — для менеджера/админа */
export const getManagerUnreadMessages = async () => get('/taxi/chat/manager/unread')

// ─── Drivers ─────────────────────────────────────────────────────────────────

/** GET /taxi/drivers */
export const getDrivers = async () => {
  const res = await get('/taxi/drivers')
  if (Array.isArray(res)) return res
  return res.items ?? res
}

/** GET /taxi/drivers/:id */
export const getDriverById = async (id) => get(`/taxi/drivers/${id}`)

/** POST /taxi/drivers/bookings/:bookingId/review — { rating, comment } */
export const reviewDriver = async (bookingId, rating, comment) =>
  post(`/taxi/drivers/bookings/${bookingId}/review`, { rating, comment })

// ─── Manager panel (роль TAXI_MANAGER) ───────────────────────────────────────

/** GET /taxi/manager/stats — сводка для диспетчера */
export const getManagerStats = async () => get('/taxi/manager/stats')

/** GET /taxi/manager/queue — заявки в статусе PENDING (ждут назначения) */
export const getManagerQueue = async () => {
  const res = await get('/taxi/manager/queue')
  if (Array.isArray(res)) return res
  return res.items ?? res
}

/** GET /taxi/manager/drivers/available — свободные водители */
export const getManagerAvailableDrivers = async () => {
  const res = await get('/taxi/manager/drivers/available')
  if (Array.isArray(res)) return res
  return res.items ?? res
}

/** GET /taxi/manager/bookings — все заявки диспетчера (с фильтрами) */
export const getManagerBookings = async (filters = {}) => {
  const res = await get(buildQuery('/taxi/manager/bookings', filters))
  if (Array.isArray(res)) return res
  return res.items ?? res
}

/** GET /taxi/manager/bookings/:id — одна заявка */
export const getManagerBooking = async (id) => get(`/taxi/manager/bookings/${id}`)

/** PATCH /taxi/manager/bookings/:id/assign — { driverId } → статус CONFIRMED */
export const assignDriver = async (bookingId, driverId) =>
  patch(`/taxi/manager/bookings/${bookingId}/assign`, { driverId })

/** PATCH /taxi/manager/bookings/:id/status — { status, reason? }
 *  status: IN_PROGRESS | COMPLETED | CANCELLED
 */
export const setManagerBookingStatus = async (bookingId, status, reason) =>
  patch(`/taxi/manager/bookings/${bookingId}/status`, reason ? { status, reason } : { status })

/** Завершить поездку (shortcut → status COMPLETED) */
export const completeBooking = async (bookingId) =>
  setManagerBookingStatus(bookingId, 'COMPLETED')

// ─── Manager auth (регистрация диспетчера по инвайт-коду) ─────────────────────

/** POST /taxi/manager-auth/invite — ADMIN: создать инвайт-код */
export const createManagerInvite = async () => post('/taxi/manager-auth/invite', {})

/** GET /taxi/manager-auth/invites — ADMIN: список инвайтов */
export const getManagerInvites = async () => get('/taxi/manager-auth/invites')

/** POST /taxi/manager-auth/register — { inviteCode, firstName, lastName, phone } */
export const registerManager = async (payload) => post('/taxi/manager-auth/register', payload)

/** GET /taxi/manager-auth/me — мой профиль менеджера */
export const getManagerProfile = async () => get('/taxi/manager-auth/me')

/** PATCH /taxi/drivers/:id/status?status=ACTIVE|INACTIVE|SUSPENDED */
export const setDriverStatus = async (driverId, status) =>
  patch(`/taxi/drivers/${driverId}/status?status=${encodeURIComponent(status)}`, {})

// ─── Recurring rides ─────────────────────────────────────────────────────────

export const getRecurringRides = async () => get('/taxi/bookings/recurring')
export const createRecurringRide = async (payload) => post('/taxi/bookings/recurring', payload)
export const pauseRecurringRide = async (id) => patch(`/taxi/bookings/recurring/${id}/pause`, {})
export const resumeRecurringRide = async (id) => patch(`/taxi/bookings/recurring/${id}/resume`, {})
export const deleteRecurringRide = async (id) => del(`/taxi/bookings/recurring/${id}`)

export const leaveDriverReview  = (bookingId, rating, comment) => reviewDriver(bookingId, rating, comment)
export const getAvailableDrivers = () => getManagerAvailableDrivers()

/** POST /taxi/drivers — admin: add a new driver */
export const addDriver = async (payload) => post('/taxi/drivers', payload)
