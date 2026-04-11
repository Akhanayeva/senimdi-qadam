import mockData from '../mock/organizations.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getOrganizations = async (filters = {}) => {
  await delay(500)
  let data = [...mockData]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    data = data.filter(org =>
      org.name.toLowerCase().includes(q) ||
      org.nameRus.toLowerCase().includes(q) ||
      org.nameKaz.toLowerCase().includes(q) ||
      org.description.toLowerCase().includes(q) ||
      org.descriptionKaz.toLowerCase().includes(q) ||
      org.address.toLowerCase().includes(q) ||
      (org.tags || []).some(t => t.toLowerCase().includes(q))
    )
  }

  if (filters.category && filters.category !== 'all') {
    data = data.filter(org => org.category === filters.category)
  }

  if (filters.district && filters.district !== 'all') {
    data = data.filter(org => org.district === filters.district)
  }

  if (filters.verified === true) {
    data = data.filter(org => org.verified)
  }

  return data
}

export const getOrganizationById = async (id) => {
  await delay(300)
  return mockData.find(org => org.id === Number(id)) || null
}

export const getFeaturedOrganizations = async () => {
  await delay(400)
  return mockData.filter(org => org.verified).slice(0, 8)
}
