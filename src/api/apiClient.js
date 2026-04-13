/**
 * ─────────────────────────────────────────────────────────────────────────────
 * API Client — Central HTTP Layer
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * When backend is ready, enable real API calls by:
 * 1. Setting USE_MOCK = false  (or use env var VITE_USE_MOCK=false)
 * 2. Each api/*.js file will import { get, post, patch, del } from './apiClient.js'
 *    and replace mock implementations with real calls.
 *
 * Gateway API (единая точка входа): http://localhost:3000/api/
 *   /api/core/* → core-svc  :3001  (auth, profile, orgs, news, guides, tickets)
 *   /api/taxi/* → taxi-svc  :3002  (bookings, drivers, manager, chat)
 *   /api/ai/*   → ai-svc    :8000  (chat, sessions, STT, TTS)
 *
 * Static files (avatars, news images) served directly from core-svc:
 *   http://localhost:3001/uploads/avatars/<filename>
 *   http://localhost:3001/uploads/news/<filename>
 *
 * Auth:
 *   - accessToken lives 15 min, refreshToken lives 7 days
 *   - On 401 → POST /api/core/auth/refresh → new tokens → retry original request
 *   - Tokens stored in localStorage (key: 'sqAccessToken', 'sqRefreshToken')
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Configuration ──────────────────────────────────────────────────────────────

export const GATEWAY_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
export const STATIC_URL  = import.meta.env.VITE_STATIC_URL || 'http://localhost:3001'

/** Build full URL for a static uploaded file */
export function avatarUrl(filename) {
  if (!filename) return null
  if (filename.startsWith('blob:') || filename.startsWith('http')) return filename
  return `${STATIC_URL}/uploads/avatars/${filename}`
}

export function newsImageUrl(filename) {
  if (!filename) return null
  if (filename.startsWith('blob:') || filename.startsWith('http')) return filename
  return `${STATIC_URL}/uploads/news/${filename}`
}

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getAccessToken() {
  return localStorage.getItem('sqAccessToken')
}

export function getRefreshToken() {
  return localStorage.getItem('sqRefreshToken')
}

export function saveTokens(accessToken, refreshToken) {
  if (accessToken)  localStorage.setItem('sqAccessToken', accessToken)
  if (refreshToken) localStorage.setItem('sqRefreshToken', refreshToken)
}

export function clearTokens() {
  localStorage.removeItem('sqAccessToken')
  localStorage.removeItem('sqRefreshToken')
}

// ── Core request function ─────────────────────────────────────────────────────

let isRefreshing = false
let refreshQueue = []           // callbacks waiting for new token

async function doRefresh() {
  const rt = getRefreshToken()
  if (!rt) throw new Error('No refresh token')
  const res = await fetch(`${GATEWAY_URL}/core/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: rt })
  })
  if (!res.ok) { clearTokens(); throw new Error('Refresh failed') }
  const data = await res.json()
  saveTokens(data.accessToken, data.refreshToken)
  return data.accessToken
}

/**
 * Core request. Used by get/post/patch/del helpers.
 *
 * @param {string} path         — e.g. '/core/news' (without /api prefix)
 * @param {'GET'|'POST'|'PATCH'|'DELETE'} method
 * @param {object|FormData|null} body
 * @param {boolean} auth        — include Authorization header
 * @param {boolean} isRetry     — internal: true when retrying after refresh
 */
export async function request(path, method = 'GET', body = null, auth = true, isRetry = false) {
  const url = `${GATEWAY_URL}${path}`
  const headers = {}

  if (auth) {
    const token = getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const init = {
    method,
    headers,
    body: body instanceof FormData
      ? body
      : body ? JSON.stringify(body) : undefined
  }

  const res = await fetch(url, init)

  // Auto-refresh on 401
  if (res.status === 401 && !isRetry) {
    if (!isRefreshing) {
      isRefreshing = true
      try {
        const newToken = await doRefresh()
        isRefreshing = false
        refreshQueue.forEach(cb => cb(newToken))
        refreshQueue = []
        // Retry original request
        return request(path, method, body, auth, true)
      } catch (err) {
        isRefreshing = false
        refreshQueue.forEach(cb => cb(null))
        refreshQueue = []
        clearTokens()
        window.location.hash = '/login'
        throw err
      }
    } else {
      // Queue this request until refresh completes
      return new Promise((resolve, reject) => {
        refreshQueue.push((newToken) => {
          if (!newToken) { reject(new Error('Unauthorized')); return }
          resolve(request(path, method, body, auth, true))
        })
      })
    }
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try { const err = await res.json(); msg = err.message || err.error || msg } catch {}
    throw new Error(msg)
  }

  // Handle empty responses (204 No Content, DELETE etc.)
  const ct = res.headers.get('content-type') || ''
  if (res.status === 204 || !ct.includes('application/json')) {
    return { success: true }
  }

  return res.json()
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

/** GET /api{path} */
export const get = (path, auth = true) => request(path, 'GET', null, auth)

/** POST /api{path} with JSON body */
export const post = (path, body = {}, auth = true) => request(path, 'POST', body, auth)

/** PATCH /api{path} with JSON body */
export const patch = (path, body = {}, auth = true) => request(path, 'PATCH', body, auth)

/** DELETE /api{path} */
export const del = (path, auth = true) => request(path, 'DELETE', null, auth)

/** POST multipart/form-data (for file uploads) */
export const upload = (path, formData, auth = true) => request(path, 'POST', formData, auth)

// ── Query string builder ──────────────────────────────────────────────────────

/** Build URL with query params. Omits null/undefined values.
 *  e.g. buildQuery('/core/news', { limit: 20, offset: 0, sort: 'latest' })
 *  → '/core/news?limit=20&offset=0&sort=latest'
 */
export function buildQuery(path, params = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  return qs ? `${path}?${qs}` : path
}
