import { get, post, patch, buildQuery } from './apiClient.js'

export const getMyTickets = async () => {
  const res = await get('/core/tickets/my')
  if (Array.isArray(res)) return res
  return res.items ?? res
}

export const getTicketById = async (id) => get(`/core/tickets/${id}`)

export const createTicket = async (_token, payload) => post('/core/tickets', payload)

export const updateTicketStatus = async (id, status, response) =>
  patch(`/core/tickets/${id}/status`, { status, response })

export const getAllTickets = async (filters = {}) => {
  const res = await get(buildQuery('/core/tickets/all', filters))
  if (Array.isArray(res)) return res
  return res.items ?? res
}
