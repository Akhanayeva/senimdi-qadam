/**
 * Profile Mock API
 * Mirrors: GET    /api/core/profile/me
 *          PATCH  /api/core/profile/me
 *          POST   /api/core/profile/me/avatar
 *          PATCH  /api/core/profile/me/location
 *          DELETE /api/core/profile/me
 *          GET    /api/core/profile/me/liked-news
 *          GET    /api/core/profile/me/liked-guides
 *          GET    /api/core/profile/:id
 */

import { getMe } from './auth.js'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// In-memory profile overrides (simulates database updates)
const profileOverrides = {}

/** GET /api/core/profile/me */
export async function getMyProfile(accessToken) {
  await delay(400)
  const base = await getMe(accessToken)
  return { ...base, ...(profileOverrides[base.id] || {}) }
}

/** PATCH /api/core/profile/me */
export async function updateMyProfile(accessToken, fields) {
  await delay(600)
  const base = await getMe(accessToken)
  const allowed = ['firstName', 'lastName', 'phone', 'bio', 'bioKaz', 'disabilityType']
  const update = {}
  for (const key of allowed) {
    if (fields[key] !== undefined) update[key] = fields[key]
  }
  profileOverrides[base.id] = { ...(profileOverrides[base.id] || {}), ...update }
  return { ...base, ...profileOverrides[base.id] }
}

/** POST /api/core/profile/me/avatar
 *  In mock mode, converts file to object URL
 */
export async function uploadAvatar(accessToken, file) {
  await delay(800)
  const base = await getMe(accessToken)
  // Mock: create a local object URL
  const avatarUrl = URL.createObjectURL(file)
  profileOverrides[base.id] = { ...(profileOverrides[base.id] || {}), avatar: avatarUrl }
  return { avatar: avatarUrl }
}

/** PATCH /api/core/profile/me/location */
export async function updateLocation(accessToken, lat, lon) {
  await delay(300)
  const base = await getMe(accessToken)
  profileOverrides[base.id] = {
    ...(profileOverrides[base.id] || {}),
    location: { lat, lon }
  }
  return { success: true }
}

/** GET /api/core/profile/me/liked-news (mock: returns sample liked news IDs) */
export async function getLikedNews(accessToken) {
  await delay(400)
  return [1, 3, 5] // mock liked news IDs
}

/** DELETE /api/core/profile/me — deactivate account */
export async function deactivateAccount(accessToken) {
  await delay(700)
  return { success: true, message: 'Аккаунт деактивирован' }
}
