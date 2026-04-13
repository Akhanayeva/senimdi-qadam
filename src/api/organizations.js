/**
 * Organizations Mock API
 * Mirrors: GET    /api/core/organizations
 *          GET    /api/core/organizations/:id
 *          GET    /api/core/organizations/nearby
 *          POST   /api/core/organizations/:id/save
 *          DELETE /api/core/organizations/:id/save
 *          GET    /api/core/organizations/:id/reviews
 *          POST   /api/core/organizations/:id/reviews
 * Replace mock implementations with real fetch() when backend is ready.
 */

import mockData from '../mock/organizations.json'

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms))

// in-memory reviews store: { orgId: [{ id, rating, comment, author, createdAt }, ...] }
const reviewsStore = {}

// Initialize reviews store with empty arrays for each org
mockData.forEach(org => {
  if (!reviewsStore[org.id]) {
    reviewsStore[org.id] = []
  }
})

/**
 * Get organizations with optional filters
 * @param {Object} filters - { q, category, city, verified, limit, offset }
 * @returns {{ items: Array, total: number }}
 */
export const getOrganizations = async (filters = {}) => {
  await delay(400)

  let data = [...mockData]

  // Search by query (nameRu, nameKk, description, etc.)
  if (filters.q) {
    const q = filters.q.toLowerCase()
    data = data.filter(org =>
      (org.nameRu || '').toLowerCase().includes(q) ||
      (org.nameKk || '').toLowerCase().includes(q) ||
      (org.description || '').toLowerCase().includes(q) ||
      (org.descriptionKk || '').toLowerCase().includes(q) ||
      (org.address || '').toLowerCase().includes(q) ||
      (org.tags || []).some(t => t.toLowerCase().includes(q))
    )
  }

  // Filter by uppercase category enum
  if (filters.category && filters.category !== 'all') {
    data = data.filter(org => org.category === filters.category)
  }

  // Filter by city
  if (filters.city && filters.city !== 'all') {
    data = data.filter(org => org.city === filters.city)
  }

  // Filter by verification status
  if (filters.verified === true) {
    data = data.filter(org => org.status === 'VERIFIED')
  }

  const total = data.length

  // Apply pagination
  const limit = filters.limit || 20
  const offset = filters.offset || 0
  data = data.slice(offset, offset + limit)

  return { items: data, total }
}

/**
 * Get single organization by ID
 * Supports both string IDs (org-001) and numeric IDs (1) for backward compat
 */
export const getOrganizationById = async (id) => {
  await delay(300)

  // Try string ID first (org-001 format)
  let org = mockData.find(o => o.id === String(id))

  // Fallback to numeric comparison for backward compat
  if (!org && typeof id === 'number') {
    org = mockData.find(o => o.id === id)
  } else if (!org) {
    // Try converting string to number
    const numId = Number(id)
    if (!isNaN(numId)) {
      org = mockData.find(o => o.id === numId)
    }
  }

  return org || null
}

/**
 * Get nearby organizations within radius (km)
 * @param {number} lat - user latitude
 * @param {number} lon - user longitude
 * @param {number} radius - search radius in km (default 5)
 * @param {boolean} verified - filter by verification status (null = all)
 * @returns {{ items: Array, total: number }}
 */
export const getNearbyOrganizations = async (lat, lon, radius = 5, verified = null) => {
  await delay(500)

  let data = [...mockData]

  // Simple distance calculation (Haversine approximation)
  const toRad = deg => (deg * Math.PI) / 180
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth radius in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Filter by distance
  data = data.filter(org => {
    if (!org.lat || !org.lon) return false
    const distance = getDistance(lat, lon, org.lat, org.lon)
    return distance <= radius
  })

  // Filter by verification status
  if (verified === true) {
    data = data.filter(org => org.status === 'VERIFIED')
  } else if (verified === false) {
    data = data.filter(org => org.status === 'UNVERIFIED')
  }

  // Sort by distance
  data.sort((a, b) => {
    const distA = getDistance(lat, lon, a.lat, a.lon)
    const distB = getDistance(lat, lon, b.lat, b.lon)
    return distA - distB
  })

  return { items: data, total: data.length }
}

/**
 * Save (bookmark) an organization
 * @param {string} accessToken - user auth token
 * @param {string|number} orgId - organization ID
 * @returns {{ success: boolean }}
 */
export const saveOrganization = async (accessToken, orgId) => {
  await delay(300)
  // Mock: just return success
  // In real API, this would POST to /api/core/organizations/:id/save
  return { success: true }
}

/**
 * Unsave (unbookmark) an organization
 * @param {string} accessToken - user auth token
 * @param {string|number} orgId - organization ID
 * @returns {{ success: boolean }}
 */
export const unsaveOrganization = async (accessToken, orgId) => {
  await delay(300)
  // Mock: just return success
  // In real API, this would DELETE /api/core/organizations/:id/save
  return { success: true }
}

/**
 * Get reviews for an organization
 * @param {string|number} orgId - organization ID
 * @param {number} limit - max reviews to return (default 20)
 * @param {number} offset - pagination offset (default 0)
 * @returns {{ items: Array, total: number }}
 */
export const getOrgReviews = async (orgId, limit = 20, offset = 0) => {
  await delay(300)

  const orgIdStr = String(orgId)
  const reviews = reviewsStore[orgIdStr] || []
  const total = reviews.length

  // Return paginated reviews
  const items = reviews.slice(offset, offset + limit)

  return { items, total }
}

/**
 * Add a review for an organization
 * @param {string} accessToken - user auth token
 * @param {string|number} orgId - organization ID
 * @param {number} rating - rating 1-5
 * @param {string} comment - review text
 * @returns {{ id: string, rating, comment, author, createdAt, orgId }}
 */
export const addOrgReview = async (accessToken, orgId, rating, comment) => {
  await delay(400)

  const orgIdStr = String(orgId)

  // Initialize reviews array if not exists
  if (!reviewsStore[orgIdStr]) {
    reviewsStore[orgIdStr] = []
  }

  // Create review object
  const review = {
    id: `review-${Date.now()}`,
    rating: Math.min(5, Math.max(1, rating)),
    comment: comment || '',
    author: 'Anonymous User', // In real API, would use authenticated user name
    createdAt: new Date().toISOString(),
    orgId: orgIdStr
  }

  // Add to store
  reviewsStore[orgIdStr].push(review)

  return review
}

/**
 * Get featured organizations (top verified ones for homepage)
 * @returns {Array}
 */
export const getFeaturedOrganizations = async () => {
  await delay(400)

  return mockData
    .filter(org => org.status === 'VERIFIED')
    .sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0))
    .slice(0, 8)
}
