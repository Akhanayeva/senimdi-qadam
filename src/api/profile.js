/**
 * Profile Mock API
 * Mirrors: GET    /api/core/profile/me
 *          PATCH  /api/core/profile/me
 *          POST   /api/core/profile/me/avatar    → { avatarUrl: "filename.jpg" }
 *          PATCH  /api/core/profile/me/location
 *          DELETE /api/core/profile/me
 *          GET    /api/core/profile/me/liked-news
 *          GET    /api/core/profile/me/liked-guides
 *          GET    /api/core/profile/:userId       (public)
 *          POST   /api/core/profile/links/request
 *          POST   /api/core/profile/links/accept/:linkId
 *          GET    /api/core/profile/links/my
 *          DELETE /api/core/profile/links/:linkId
 *
 * avatarUrl in real API is just a filename; full URL = /uploads/avatars/<avatarUrl>
 * In mock we use a blob: URL from URL.createObjectURL() which acts as a full URL.
 *
 * Replace with real fetch() when backend is ready.
 */

import { getMe, fakeUsers } from './auth.js'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// In-memory DB for profile updates (keyed by userId)
const profileOverrides = {}

// In-memory relative links store
const relativeLinks = []

// ── Profile ───────────────────────────────────────────────────────────────────

/** GET /api/core/profile/me
 *  Returns full profile (private):
 *  { id, userId, firstName, lastName, phone, birthDate, city,
 *    disabilityType, disabilityNote, avatarUrl, lat, lon, ...auth fields }
 */
export async function getMyProfile(accessToken) {
  await delay(400)
  const base = await getMe(accessToken)
  return { ...base, ...(profileOverrides[base.id] || {}) }
}

/** PATCH /api/core/profile/me
 *  Allowed fields (per API docs):
 *  firstName, lastName, phone, city, disabilityType, disabilityNote, birthDate
 *  + bio, bioKk (extra profile fields)
 */
export async function updateMyProfile(accessToken, fields) {
  await delay(600)
  const base = await getMe(accessToken)
  const allowed = ['firstName', 'lastName', 'phone', 'city', 'birthDate', 'disabilityType', 'disabilityNote', 'bio', 'bioKk']
  const update = {}
  for (const key of allowed) {
    if (fields[key] !== undefined) update[key] = fields[key]
  }
  profileOverrides[base.id] = { ...(profileOverrides[base.id] || {}), ...update }
  // Also update the fakeUsers array so getMe() returns fresh data
  const user = fakeUsers.find(u => u.id === base.id)
  if (user) Object.assign(user, update)
  return { ...base, ...profileOverrides[base.id] }
}

/** POST /api/core/profile/me/avatar
 *  Real API: multipart/form-data, returns { avatarUrl: "filename.jpg" }
 *  Mock: creates a blob URL that works as an <img> src during the session
 */
export async function uploadAvatar(accessToken, file) {
  await delay(800)
  const base = await getMe(accessToken)
  const avatarUrl = URL.createObjectURL(file)
  profileOverrides[base.id] = { ...(profileOverrides[base.id] || {}), avatarUrl }
  // Update fakeUsers too
  const user = fakeUsers.find(u => u.id === base.id)
  if (user) user.avatarUrl = avatarUrl
  return { avatarUrl }
}

/** PATCH /api/core/profile/me/location */
export async function updateLocation(accessToken, lat, lon) {
  await delay(300)
  const base = await getMe(accessToken)
  profileOverrides[base.id] = { ...(profileOverrides[base.id] || {}), lat, lon }
  return { success: true }
}

/** DELETE /api/core/profile/me — deactivate account */
export async function deactivateAccount(accessToken) {
  await delay(700)
  return { success: true, message: 'Аккаунт деактивирован' }
}

/** GET /api/core/profile/:userId — public profile (cached 5 min in real API) */
export async function getPublicProfile(userId) {
  await delay(400)
  const user = fakeUsers.find(u => u.id === userId)
  if (!user) return null
  // Return only public fields
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    city: user.city
  }
}

// ── Likes ─────────────────────────────────────────────────────────────────────

/** GET /api/core/profile/me/liked-news
 *  Returns array of liked news IDs
 */
export async function getLikedNews(accessToken) {
  await delay(400)
  // Mock: pretend user liked news-001, news-003, news-005
  return ['news-001', 'news-003', 'news-005']
}

/** GET /api/core/profile/me/liked-guides */
export async function getLikedGuides(accessToken) {
  await delay(400)
  // Mock: pretend user liked first 2 guides
  return ['guide-001', 'guide-002']
}

// ── Relative Links ────────────────────────────────────────────────────────────

/**
 * POST /api/core/profile/links/request
 * Real API body: { dependentId: "uuid", label: "Мама" }
 * Mock: also accepts email string as dependentId for convenience
 * (ProfileView sends an email; mock resolves it to userId)
 */
export async function requestRelativeLink(accessToken, dependentIdOrEmail, label = '') {
  await delay(500)
  const guardian = await getMe(accessToken)

  // Resolve email → userId if needed
  let dependentId = dependentIdOrEmail
  if (dependentIdOrEmail && dependentIdOrEmail.includes('@')) {
    const found = fakeUsers.find(u => u.email === dependentIdOrEmail)
    if (!found) throw new Error('Пользователь с таким email не найден')
    dependentId = found.id
  }

  // Prevent duplicate links
  const exists = relativeLinks.find(
    l => l.guardianId === guardian.id && l.dependentId === dependentId
  )
  if (exists) throw new Error('Связь с этим пользователем уже существует')

  const link = {
    id: 'lnk-' + Date.now(),
    guardianId: guardian.id,
    dependentId,
    label,
    status: 'PENDING',         // PENDING | ACCEPTED | REJECTED
    direction: 'outgoing',     // from current user's perspective
    isAccepted: false,
    createdAt: new Date().toISOString()
  }
  relativeLinks.push(link)
  return link
}

/**
 * POST /api/core/profile/links/accept/:linkId
 * USER accepts the guardianship request
 */
export async function acceptRelativeLink(accessToken, linkId) {
  await delay(400)
  const link = relativeLinks.find(l => l.id === linkId)
  if (link) {
    link.isAccepted = true
    link.status = 'ACCEPTED'
  }
  return link
}

/**
 * GET /api/core/profile/links/my
 * Real API response shape:
 * {
 *   asGuardian: [{ id, label, isAccepted, dependent: { id, firstName, lastName, avatarUrl, city, email, role } }],
 *   asDependent: [{ id, label, guardian: {...} }]
 * }
 */
export async function getMyLinks(accessToken) {
  await delay(400)
  const me = await getMe(accessToken)

  function enrichUser(u) {
    if (!u) return null
    return { id: u.id, firstName: u.firstName, lastName: u.lastName, avatarUrl: u.avatarUrl, city: u.city, email: u.email, role: u.role }
  }

  const asGuardian = relativeLinks
    .filter(l => l.guardianId === me.id)
    .map(l => {
      const dep = fakeUsers.find(u => u.id === l.dependentId)
      return {
        id: l.id, label: l.label || '', status: l.status || 'PENDING',
        isAccepted: l.isAccepted, direction: 'outgoing',
        createdAt: l.createdAt, dependent: enrichUser(dep),
        // Also expose as relatedUser for ProfileView tab compatibility
        relatedUser: enrichUser(dep)
      }
    })

  const asDependent = relativeLinks
    .filter(l => l.dependentId === me.id)
    .map(l => {
      const grd = fakeUsers.find(u => u.id === l.guardianId)
      return {
        id: l.id, label: l.label || '', status: l.status || 'PENDING',
        isAccepted: l.isAccepted, direction: 'incoming',
        createdAt: l.createdAt, guardian: enrichUser(grd),
        relatedUser: enrichUser(grd)
      }
    })

  return { asGuardian, asDependent }
}

/**
 * DELETE /api/core/profile/links/:linkId
 */
export async function deleteRelativeLink(accessToken, linkId) {
  await delay(400)
  const idx = relativeLinks.findIndex(l => l.id === linkId)
  if (idx !== -1) relativeLinks.splice(idx, 1)
  return { success: true }
}
