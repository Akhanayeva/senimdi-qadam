/**
 * ИнваТакси Mock API
 * Based on taxi-svc endpoints: /api/taxi/...
 * Replace mock returns with real fetch() calls when backend is ready.
 */
import taxiData from '../mock/taxi.json'

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms))

// ─── Bookings ───────────────────────────────────────────────────────────────

/** GET /api/taxi/bookings/my */
export async function getMyBookings() {
  await delay(600)
  return [...taxiData.bookings]
}

/** GET /api/taxi/bookings/:id */
export async function getBookingById(id) {
  await delay(400)
  return taxiData.bookings.find(b => b.id === id) || null
}

/** POST /api/taxi/bookings */
export async function createBooking(payload) {
  await delay(800)
  const newBooking = {
    id: 'bk-' + Date.now(),
    userId: 'user-1',
    fromAddress: payload.fromAddress,
    toAddress: payload.toAddress,
    fromLat: payload.fromLat || null,
    fromLon: payload.fromLon || null,
    toLat: payload.toLat || null,
    toLon: payload.toLon || null,
    scheduledAt: payload.scheduledAt,
    disabilityType: payload.disabilityType,
    note: payload.note || '',
    status: 'PENDING',
    driverId: null,
    driver: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: []
  }
  taxiData.bookings.unshift(newBooking)
  return newBooking
}

/** PATCH /api/taxi/bookings/:id/cancel?reason=<reason>
 *  NOTE: In the real API `reason` is a QUERY PARAMETER, not a request body field.
 *  Real fetch: PATCH `/api/taxi/bookings/${id}/cancel?reason=${encodeURIComponent(reason)}`
 */
export async function cancelBooking(id, reason = '') {
  await delay(500)
  const booking = taxiData.bookings.find(b => b.id === id)
  if (booking) {
    booking.status = 'CANCELLED'
    booking.cancelReason = reason
    booking.updatedAt = new Date().toISOString()
  }
  return booking
}

// ─── Chat ────────────────────────────────────────────────────────────────────

/** GET /api/taxi/chat/bookings/:bookingId/messages */
export async function getChatMessages(bookingId) {
  await delay(400)
  const booking = taxiData.bookings.find(b => b.id === bookingId)
  return booking ? [...(booking.messages || [])] : []
}

/** POST /api/taxi/chat/bookings/:bookingId/messages */
export async function sendChatMessage(bookingId, text) {
  await delay(300)
  const booking = taxiData.bookings.find(b => b.id === bookingId)
  if (!booking) return null
  const msg = {
    id: 'msg-' + Date.now(),
    role: 'user',
    senderName: 'Вы',
    text,
    createdAt: new Date().toISOString()
  }
  if (!booking.messages) booking.messages = []
  booking.messages.push(msg)
  // Simulate manager auto-reply after 1.5s
  setTimeout(() => {
    booking.messages.push({
      id: 'msg-' + (Date.now() + 1),
      role: 'manager',
      senderName: 'Менеджер Алматы',
      text: 'Ваше сообщение получено. Мы свяжемся с вами в ближайшее время.',
      createdAt: new Date().toISOString()
    })
  }, 1500)
  return msg
}

// ─── Drivers ─────────────────────────────────────────────────────────────────

/** GET /api/taxi/drivers */
export async function getDrivers(status = null) {
  await delay(500)
  if (status) return taxiData.drivers.filter(d => d.status === status)
  return [...taxiData.drivers]
}

/** GET /api/taxi/drivers/:id */
export async function getDriverById(id) {
  await delay(300)
  return taxiData.drivers.find(d => d.id === id) || null
}

/** POST /api/taxi/drivers/bookings/:bookingId/review */
export async function leaveDriverReview(bookingId, rating, comment = '') {
  await delay(600)
  const booking = taxiData.bookings.find(b => b.id === bookingId)
  if (booking) {
    booking.review = { rating, comment }
  }
  return { success: true }
}

// ─── Manager ─────────────────────────────────────────────────────────────────

/** GET /api/taxi/manager/stats */
export async function getManagerStats() {
  await delay(400)
  return { ...taxiData.managerStats }
}

/** GET /api/taxi/manager/queue */
export async function getManagerQueue() {
  await delay(500)
  return [...taxiData.managerQueue]
}

/** GET /api/taxi/manager/drivers/available */
export async function getAvailableDrivers() {
  await delay(400)
  return taxiData.drivers.filter(d => d.status === 'ACTIVE')
}

/** PATCH /api/taxi/manager/bookings/:id/assign */
export async function assignDriver(bookingId, driverId) {
  await delay(700)
  const booking = taxiData.managerQueue.find(b => b.id === bookingId)
    || taxiData.bookings.find(b => b.id === bookingId)
  const driver = taxiData.drivers.find(d => d.id === driverId)
  if (booking && driver) {
    booking.status = 'CONFIRMED'
    booking.driverId = driverId
    booking.driver = {
      id: driver.id,
      firstName: driver.firstName,
      lastName: driver.lastName,
      vehicleModel: driver.vehicleModel,
      vehicleType: driver.vehicleType,
      phone: driver.phone,
      whatsapp: driver.whatsapp,
      ratingAvg: driver.ratingAvg
    }
    // Remove from queue
    const qi = taxiData.managerQueue.findIndex(b => b.id === bookingId)
    if (qi !== -1) taxiData.managerQueue.splice(qi, 1)
    taxiData.managerStats.pending = Math.max(0, taxiData.managerStats.pending - 1)
    taxiData.managerStats.confirmed++
  }
  return booking
}

/** PATCH /api/taxi/manager/bookings/:id/status */
export async function updateBookingStatus(bookingId, status, reason = '') {
  await delay(500)
  const booking = taxiData.bookings.find(b => b.id === bookingId)
    || taxiData.managerQueue.find(b => b.id === bookingId)
  if (booking) {
    booking.status = status
    if (reason) booking.cancelReason = reason
    booking.updatedAt = new Date().toISOString()
  }
  return booking
}

/** POST /api/taxi/drivers (add driver - manager/admin) */
export async function addDriver(payload) {
  await delay(700)
  const nameParts = (payload.name || '').trim().split(' ')
  const driver = {
    id: 'drv-' + Date.now(),
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    phone: payload.phone,
    whatsapp: `https://wa.me/${payload.phone.replace(/\D/g, '')}`,
    vehicleType: payload.vehicleType || 'OTHER',
    vehicleModel: payload.vehicleModel || payload.vehicle || '',
    licensePlate: payload.licensePlate || '',
    status: 'ACTIVE',
    ratingAvg: 5.0,
    ratingCount: 0,
    totalTrips: 0,
    avatar: null,
    equipment: [],
    bio: '',
    bioKk: '',
    joinedAt: new Date().toISOString().split('T')[0]
  }
  taxiData.drivers.push(driver)
  return driver
}

/** PATCH /api/taxi/drivers/:id/status (MANAGER/ADMIN)
 *  Body: { status: "ACTIVE"|"INACTIVE"|"BUSY" }
 */
export async function updateDriverStatus(driverId, status) {
  await delay(400)
  const driver = taxiData.drivers.find(d => d.id === driverId)
  if (!driver) throw new Error('Водитель не найден')
  driver.status = status
  return { ...driver }
}

// ─── Manager Chat ────────────────────────────────────────────────────────────

/** GET /api/taxi/chat/manager/bookings/:bookingId/messages (MANAGER) */
export async function getManagerChatMessages(bookingId) {
  await delay(400)
  const booking = taxiData.bookings.find(b => b.id === bookingId)
    || taxiData.managerQueue.find(b => b.id === bookingId)
  return booking ? [...(booking.messages || [])] : []
}

/** POST /api/taxi/chat/manager/bookings/:bookingId/messages (MANAGER) */
export async function sendManagerChatMessage(bookingId, text) {
  await delay(300)
  const booking = taxiData.bookings.find(b => b.id === bookingId)
    || taxiData.managerQueue.find(b => b.id === bookingId)
  if (!booking) return null
  const msg = {
    id: 'msg-' + Date.now(),
    role: 'manager',
    senderName: 'Менеджер',
    text,
    createdAt: new Date().toISOString()
  }
  if (!booking.messages) booking.messages = []
  booking.messages.push(msg)
  return msg
}

/** GET /api/taxi/chat/unread — unread message count for current user
 *  Response: { count: N }
 */
export async function getUnreadChatCount() {
  await delay(200)
  // Mock: random 0-3 unread
  return { count: Math.floor(Math.random() * 3) }
}

/** GET /api/taxi/chat/manager/unread — unread count for manager
 *  Response: { count: N }
 */
export async function getManagerUnreadChatCount() {
  await delay(200)
  return { count: Math.floor(Math.random() * 5) }
}

// ─── Manager Bookings ────────────────────────────────────────────────────────

/** GET /api/taxi/manager/bookings — all bookings with optional status filter
 *  Query: { status?: string, limit?: number, offset?: number }
 *  Response: { items: [...], total: N }
 */
export async function getManagerBookings(status = null, limit = 20, offset = 0) {
  await delay(500)
  let items = [...taxiData.bookings]
  if (status) items = items.filter(b => b.status === status)
  const total = items.length
  return { items: items.slice(offset, offset + limit), total }
}

/** GET /api/taxi/manager/bookings/:id — booking detail with messages (MANAGER)
 *  Response: booking object with messages array
 */
export async function getManagerBookingById(id) {
  await delay(300)
  const booking = taxiData.bookings.find(b => b.id === id)
    || taxiData.managerQueue.find(b => b.id === id)
  if (!booking) throw new Error('Заявка не найдена')
  return { ...booking, messages: booking.messages || [] }
}

// ─── Manager Auth ─────────────────────────────────────────────────────────────

// In-memory manager store
const managerAccounts = []

/** POST /api/taxi/manager-auth/register — register with invite code
 *  Body: { inviteCode: string, firstName: string, lastName: string, email: string, password: string, phone: string }
 *  Response: { accessToken, refreshToken, manager: {...} }
 */
export async function registerManager({ inviteCode, firstName, lastName, email, password, phone }) {
  await delay(800)
  // Mock: accept any 8-char invite code starting with 'INV-'
  if (!inviteCode || !inviteCode.startsWith('INV-')) {
    throw new Error('Недействительный код приглашения')
  }
  if (managerAccounts.find(m => m.email === email)) {
    throw new Error('Email уже зарегистрирован')
  }
  const manager = {
    id: 'mgr-' + Date.now(),
    firstName,
    lastName,
    email,
    phone,
    role: 'TAXI_MANAGER',
    createdAt: new Date().toISOString()
  }
  managerAccounts.push(manager)
  const fakeToken = 'mock.manager.' + btoa(JSON.stringify({ sub: manager.id, role: 'TAXI_MANAGER' }))
  return {
    accessToken: fakeToken,
    refreshToken: fakeToken + '.refresh',
    manager
  }
}

/** GET /api/taxi/manager-auth/me — current manager profile
 *  Response: manager object
 */
export async function getManagerMe(accessToken) {
  await delay(300)
  // Mock: return first manager or a default one
  return managerAccounts[0] || {
    id: 'mgr-001',
    firstName: 'Сейткали',
    lastName: 'Ахметов',
    email: 'manager@senimdi.kz',
    phone: '+7 700 555 0011',
    role: 'TAXI_MANAGER',
    createdAt: '2025-01-10T00:00:00.000Z'
  }
}
