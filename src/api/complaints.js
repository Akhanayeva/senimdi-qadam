import { get, post, patch, buildQuery } from './apiClient.js'

export const getMyComplaints = async () => {
  const res = await get('/core/complaints/my')
  if (Array.isArray(res)) return res
  return res.items ?? res
}

export const getComplaintById = async (id) => get(`/core/complaints/${id}`)

export const createComplaint = async (_token, payload) => post('/core/complaints', payload)

export const updateComplaintStatus = async (id, status) =>
  patch(`/core/complaints/${id}/status`, { status })

export const getAllComplaints = async (filters = {}) => {
  const res = await get(buildQuery('/core/complaints/all', filters))
  if (Array.isArray(res)) return res
  return res.items ?? res
}
