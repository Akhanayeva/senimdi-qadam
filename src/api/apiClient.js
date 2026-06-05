/**
 * ─────────────────────────────────────────────────────────────────────────────
 * API Client — Central HTTP Layer
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Real backend: http://49.12.34.124:3000/api
 * All endpoints are relative to GATEWAY_URL.
 *
 * Auth:
 *   - accessToken short-lived, refreshToken long-lived
 *   - On 401 → POST /auth/refresh → new tokens → retry original request
 *   - Tokens stored in localStorage: 'sqAccessToken', 'sqRefreshToken'
 *
 * Localisation:
 *   - Backend reads Accept-Language header (ru / kk)
 *   - Returns already-localised fields (title, description — not titleRu/titleKk)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Configuration ──────────────────────────────────────────────────────────────

export const GATEWAY_URL = import.meta.env.VITE_API_URL || 'http://49.12.34.124:3000/api'
export const STATIC_URL  = import.meta.env.VITE_STATIC_URL || 'http://49.12.34.124:3000'
export const WS_URL      = import.meta.env.VITE_WS_URL || 'http://49.12.34.124:3000'

/** Get current language for Accept-Language header */
function getLang() {
  const lang = localStorage.getItem('sqLang') || 'rus'
  return lang === 'kaz' ? 'kk' : 'ru'
}

/** Build full URL for a static uploaded file.
 *  Real API returns full URLs from MinIO — pass through as-is.
 *  If only a filename is returned, build the URL manually.
 */
export function avatarUrl(url) {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('blob:')) return url
  return `${STATIC_URL}/uploads/avatars/${url}`
}

export function newsImageUrl(url) {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('blob:')) return url
  return `${STATIC_URL}/uploads/news/${url}`
}

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getAccessToken()  { return localStorage.getItem('sqAccessToken') }
export function getRefreshToken() { return localStorage.getItem('sqRefreshToken') }

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
let refreshQueue = []

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
 * Core request.
 *
 * @param {string} path         — e.g. '/news' (without /api prefix)
 * @param {'GET'|'POST'|'PATCH'|'PUT'|'DELETE'} method
 * @param {object|FormData|null} body
 * @param {boolean} auth        — include Authorization header
 * @param {boolean} isRetry     — internal: true when retrying after refresh
 */
export async function request(path, method = 'GET', body = null, auth = true, isRetry = false) {
  const url = `${GATEWAY_URL}${path}`
  const headers = {
    'Accept-Language': getLang()
  }

  if (auth) {
    const token = getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body instanceof FormData
      ? body
      : body ? JSON.stringify(body) : undefined
  })

  // Auto-refresh on 401
  if (res.status === 401 && !isRetry) {
    if (!isRefreshing) {
      isRefreshing = true
      try {
        const newToken = await doRefresh()
        isRefreshing = false
        refreshQueue.forEach(cb => cb(newToken))
        refreshQueue = []
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
    try {
      const err = await res.json()
      // NestJS returns { message: string | string[], error: string, statusCode: number }
      msg = Array.isArray(err.message) ? err.message.join('; ') : (err.message || err.error || msg)
    } catch {}
    throw new Error(msg)
  }

  const ct = res.headers.get('content-type') || ''
  if (res.status === 204 || !ct.includes('application/json')) {
    return { success: true }
  }

  return res.json()
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

export const get    = (path, auth = true)              => request(path, 'GET',    null, auth)
export const post   = (path, body = {}, auth = true)   => request(path, 'POST',   body, auth)
export const patch  = (path, body = {}, auth = true)   => request(path, 'PATCH',  body, auth)
export const put    = (path, body = {}, auth = true)   => request(path, 'PUT',    body, auth)
export const del    = (path, body = null, auth = true) => request(path, 'DELETE', body, auth)
export const upload = (path, formData, auth = true)    => request(path, 'POST',   formData, auth)

// ── Query string builder ──────────────────────────────────────────────────────

/** buildQuery('/news', { limit: 20, offset: 0 }) → '/news?limit=20&offset=0' */
export function buildQuery(path, params = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  return qs ? `${path}?${qs}` : path
}
