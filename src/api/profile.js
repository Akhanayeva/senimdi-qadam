/**
 * Profile API — Real backend calls
 * Base: /profile/me, /profile/links, /profile/:id
 */
import { get, post, patch, del, upload, buildQuery } from './apiClient.js'

// ── Profile ───────────────────────────────────────────────────────────────────

/** GET /profile/me — full private profile */
export async function getMyProfile() {
  return get('/core/profile/me')
}

/** PATCH /profile/me */
export async function updateMyProfile(_token, fields) {
  // _token ignored — apiClient uses localStorage token automatically
  return patch('/core/profile/me', fields)
}

/** POST /profile/me/avatar — multipart/form-data, field name: "file" */
export async function uploadAvatar(_token, file) {
  const form = new FormData()
  form.append('file', file)
  return upload('/core/profile/me/avatar', form)
}

/** PATCH /profile/me/location */
export async function updateLocation(_token, lat, lon) {
  return patch('/core/profile/me/location', { lat, lon })
}

/** DELETE /profile/me */
export async function deactivateAccount() {
  return del('/core/profile/me')
}

/** GET /profile/:id — public profile */
export async function getPublicProfile(userId) {
  return get(`/core/profile/${userId}`)
}

/** GET /profile/me/accessibility */
export async function getAccessibilitySettings() {
  return get('/core/profile/me/accessibility')
}

/** PATCH /profile/me/accessibility */
export async function updateAccessibilitySettings(settings) {
  return patch('/core/profile/me/accessibility', settings)
}

// ── Liked content ─────────────────────────────────────────────────────────────

/** GET /profile/me/liked-news */
export async function getLikedNews() {
  return get('/core/profile/me/liked-news')
}

/** GET /profile/me/liked-guides */
export async function getLikedGuides() {
  return get('/core/profile/me/liked-guides')
}

// ── Relative Links (опекун ↔ подопечный) ─────────────────────────────────────

/** POST /profile/links/request — { dependentId, label } */
export async function requestRelativeLink(_token, dependentIdOrEmail, label = '') {
  return post('/core/profile/links/request', { dependentId: dependentIdOrEmail, label })
}

/** POST /profile/links/accept/:linkId */
export async function acceptRelativeLink(_token, linkId) {
  return post(`/core/profile/links/accept/${linkId}`, {})
}

/** GET /profile/links/my → { asGuardian: [...], asDependent: [...] } */
export async function getMyLinks() {
  return get('/core/profile/links/my')
}

/** DELETE /profile/links/:linkId */
export async function deleteRelativeLink(_token, linkId) {
  return del(`/core/profile/links/${linkId}`)
}

// ── Saved organisations (used in auth store) ──────────────────────────────────

/** POST /core/organizations/:id/save */
export async function saveOrganization(_token, orgId) {
  return post(`/core/organizations/${orgId}/save`, {})
}

/** DELETE /core/organizations/:id/save */
export async function unsaveOrganization(_token, orgId) {
  return del(`/core/organizations/${orgId}/save`)
}
