/**
 * Taxi realtime — Socket.IO клиент для живого отслеживания поездки.
 *
 * Бэкенд: taxi-svc, WebSocket-шлюз namespace `/taxi` (booking.gateway.ts).
 * Авторизация: JWT в handshake.auth.token.
 *
 * События сервера → клиент:
 *   - joined                 { bookingId }
 *   - driver:location        { driverId, lat, lon, bookingId }
 *   - message:received       { id, bookingId, text, role, senderName, createdAt }
 *   - booking:status_changed { bookingId, status, driverId }
 *
 * События клиент → сервер:
 *   - join:booking   bookingId
 *   - message:send   { bookingId, text }
 *
 * Используется один общий сокет на всё приложение (lazy-connect).
 * Если WebSocket недоступен — вызывающий код сам падает на REST-поллинг.
 */
import { io } from 'socket.io-client'
import { WS_URL, getAccessToken } from './apiClient.js'

let socket = null

/** Подключиться (или вернуть уже открытый сокет). */
export function connectTaxiSocket() {
  if (socket && socket.connected) return socket
  if (socket) { socket.connect(); return socket }

  socket = io(`${WS_URL}/taxi`, {
    transports: ['websocket'],
    auth: { token: getAccessToken() },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    autoConnect: true,
  })
  return socket
}

/** Текущий сокет (может быть null, если ещё не подключались). */
export function getTaxiSocket() {
  return socket
}

/** Войти в комнату поездки, чтобы получать её события. */
export function joinBookingRoom(bookingId) {
  const s = connectTaxiSocket()
  const emitJoin = () => s.emit('join:booking', bookingId)
  if (s.connected) emitJoin()
  else s.once('connect', emitJoin)
  return s
}

/** Отправить сообщение в чат поездки через сокет. */
export function sendSocketMessage(bookingId, text) {
  const s = getTaxiSocket()
  if (s && s.connected) {
    s.emit('message:send', { bookingId, text })
    return true
  }
  return false
}

/** Отписаться от событий конкретной поездки (слушатели снимает вызывающий). */
export function disconnectTaxiSocket() {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}
