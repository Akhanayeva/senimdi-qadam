/**
 * Reviews API — отзывы на специалистов
 * (Отзывы на организации — в organizations.js: getOrgReviews / addOrgReview)
 * Base: /core/specialists/:id/reviews
 */
import { get, post, buildQuery } from './apiClient.js'

/** GET /specialists/:id/reviews — публичный список отзывов на специалиста */
export const getSpecialistReviews = async (specialistId, limit = 20, offset = 0) => {
  const res = await get(buildQuery(`/core/specialists/${specialistId}/reviews`, { limit, offset }))
  if (Array.isArray(res)) return { items: res, total: res.length }
  return res
}

/** POST /specialists/:id/reviews — { rating: 1-5, comment? } (auth) */
export const addSpecialistReview = async (specialistId, rating, comment) =>
  post(`/core/specialists/${specialistId}/reviews`, comment ? { rating, comment } : { rating })
