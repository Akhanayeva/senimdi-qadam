/**
 * Auth API — Real backend calls
 * Base: POST /auth/login, /auth/register, /auth/refresh, /auth/logout, GET /auth/me
 */
import { post, get, buildQuery } from './apiClient.js'

/** POST /auth/login → { accessToken, refreshToken, user? } */
export async function login(email, password) {
  return post('/core/auth/login', { email, password }, false)
}

/** POST /auth/register
 *  Body: { email, password, role, firstName?, lastName?, phone?, disabilityType? }
 *  Returns: { accessToken, refreshToken }
 */
export async function register(payload) {
  return post('/core/auth/register', payload, false)
}

/** POST /auth/logout */
export async function logout() {
  try { return await post('/core/auth/logout', {}) } catch { return { success: true } }
}

/** GET /auth/me → { id, email, role } */
export async function getMe() {
  return get('/core/auth/me')
}

/** POST /auth/forgot-password */
export async function forgotPassword(email) {
  return post('/core/auth/forgot-password', { email }, false)
}

/** POST /auth/reset-password */
export async function resetPassword(email, code, newPassword) {
  return post('/core/auth/reset-password', { email, code, newPassword }, false)
}

/** POST /auth/refresh — used internally by apiClient; exported for edge cases */
export async function refreshToken(token) {
  return post('/core/auth/refresh', { refreshToken: token }, false)
}

/** POST /auth/2fa/setup → { secret, qrCode } */
export async function setup2FA() {
  return post('/core/auth/2fa/setup', {})
}

/** POST /auth/2fa/verify */
export async function verify2FA(totpCode) {
  return post('/core/auth/2fa/verify', { totpCode })
}

/** POST /auth/2fa/disable */
export async function disable2FA(totpCode) {
  return post('/core/auth/2fa/disable', { totpCode })
}
