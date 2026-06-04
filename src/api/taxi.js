/**
 * Taxi / Bookings API — Real backend calls
 * Base: /bookings, /drivers
 * WebSocket: WS_URL + /taxi namespace (socket.io)
 */
import { get, post, patch, del, buildQuery } from './apiClient.js'

// ─── Bookings ────────────────────────────────────────────────────────────────

export const getMyBookings = async () => {
  const res = await get('/bookings/my')
  if (Array.isArray(res)) return res
  return res.items ?? res
}

export const getBookingById = async (id) => get(`/bookings/${id}`)

/**
 * POST /bookings — create a new booking
 * Body: { fromAddress, toAddress, fromLat?, fromLon?, toLat?, toLon?,
 *         scheduledAt?, disabilityType?, note? }
 */
export const createBooking = async (payload) => post('/bookings', payload)

/**
 * PATCH /bookings/:id/cancel?reason=<reason>
 * NOTE: reason is a QUERY PARAMETER per real API spec
 */
export const cancelBooking = async (id, reason = '') => {
  const path = reason ? `/bookings/${id}/cancel?reason=${encodeURIComponent(reason)}` : `/bookings/${id}/cancel`
  return patch(path, {})
}

/** GET /bookings/estimate-price?fromLat=&fromLon=&toLat=&toLon= */
export const estimatePrice = async (params) => get(buildQuery('/bookings/estimate-price', params))

/** GET /bookings/:id/driver-location */
export const getDriverLocation = async (bookingId) => get(`/bookings/${bookingId}/driver-location`)

// ─── Chat (REST fallback) ────────────────────────────────────────────────────

/** GET /chat/bookings/:bookingId/messages */
export const getChatMessages = async (bookingId) => {
  const res = await get(`/chat/bookings/${bookingId}/messages`)
  if (Array.isArray(res)) return res
  return res.items ?? res
}

/** POST /chat/bookings/:bookingId/messages — { text } */
export const sendChatMessage = async (bookingId, text) =>
  post(`/chat/bookings/${bookingId}/messages`, { text })

/** GET /chat/unread */
export const getUnreadMessages = async () => get('/chat/unread')

// ─── Drivers ─────────────────────────────────────────────────────────────────

/** GET /drivers */
export const getDrivers = async () => {
  const res = await get('/drivers')
  if (Array.isArray(res)) return res
  return res.items ?? res
}

/** GET /drivers/:id */
export const getDriverById = async (id) => get(`/drivers/${id}`)

/** POST /drivers/bookings/:bookingId/review — { rating, comment } */
export const reviewDriver = async (bookingId, rating, comment) =>
  post(`/drivers/bookings/${bookingId}/review`, { rating, comment })

// ─── Manager panel ───────────────────────────────────────────────────────────

/** GET /manager/bookings/queue — pending bookings for dispatcher */
export const getManagerQueue = async () => {
  const res = await get('/manager/bookings/queue')
  if (Array.isArray(res)) return res
  return res.items ?? res
}

/** POST /manager/bookings/:bookingId/assign — { driverId } */
export const assignDriver = async (bookingId, driverId) =>
  post(`/manager/bookings/${bookingId}/assign`, { driverId })

/** PATCH /manager/bookings/:bookingId/complete */
export const completeBooking = async (bookingId) =>
  patch(`/manager/bookings/${bookingId}/complete`, {})

/** GET /manager/stats */
export const getManagerStats = async () => get('/manager/stats')

// ─── Recurring rides ─────────────────────────────────────────────────────────

export const getRecurringRides = async () => get('/bookings/recurring')
export const createRecurringRide = async (payload) => post('/bookings/recurring', payload)
export const pauseRecurringRide = async (id) => patch(`/bookings/recurring/${id}/pause`, {})
export const resumeRecurringRide = async (id) => patch(`/bookings/recurring/${id}/resume`, {})
export const deleteRecurringRide = async (id) => del(`/bookings/recurring/${id}`)

export const leaveDriverReview  = (bookingId, rating, comment) => reviewDriver(bookingId, rating, comment)
export const getAvailableDrivers = () => getDrivers()

/** POST /drivers — admin: add a new driver */
export const addDriver = async (payload) => post('/drivers', payload)
