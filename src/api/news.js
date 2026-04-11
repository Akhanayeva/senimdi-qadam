import mockData from '../mock/news.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getNews = async (filters = {}) => {
  await delay(500)
  let data = [...mockData]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    data = data.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.titleKaz.toLowerCase().includes(q) ||
      n.excerpt.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
    )
  }
  return data
}

export const getNewsById = async (id) => {
  await delay(300)
  return mockData.find(n => n.id === Number(id)) || null
}

export const getLatestNews = async () => {
  await delay(400)
  return mockData.slice(0, 6)
}

export const likeNews = async (id) => {
  await delay(200)
  return { success: true }
}
