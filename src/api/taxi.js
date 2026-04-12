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

/** PATCH /api/taxi/bookings/:id/cancel */
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
      name: driver.name,
      vehicle: driver.vehicle,
      phone: driver.phone,
      whatsappLink: driver.whatsappLink,
      rating: driver.rating
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
  const driver = {
    id: 'drv-' + Date.now(),
    name: payload.name,
    phone: payload.phone,
    whatsappLink: `https://wa.me/${payload.phone.replace(/\D/g, '')}`,
    vehicle: payload.vehicle,
    licensePlate: payload.licensePlate,
    status: 'ACTIVE',
    rating: 5.0,
    totalRides: 0,
    avatar: null,
    disabilityEquipment: [],
    bio: '',
    bioKaz: '',
    joinedAt: new Date().toISOString().split('T')[0]
  }
  taxiData.drivers.push(driver)
  return driver
}
