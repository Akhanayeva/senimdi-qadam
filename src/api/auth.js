const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const fakeUsers = [
  { id: 1, name: 'Аружан', email: 'admin@senimdi.kz', password: 'admin123', role: 'ADMIN', avatar: null },
  { id: 2, name: 'Асель', email: 'user@senimdi.kz', password: 'user123', role: 'USER', avatar: null },
  { id: 3, name: 'Модератор', email: 'mod@senimdi.kz', password: 'mod123', role: 'MODERATOR', avatar: null },
]

export const login = async (email, password) => {
  await delay(600)
  const user = fakeUsers.find(u => u.email === email && u.password === password)
  if (!user) throw new Error('Неверный email или пароль')
  const { password: _, ...safeUser } = user
  return { user: safeUser, token: `fake-jwt-token-${user.id}` }
}

export const register = async (name, email, password) => {
  await delay(800)
  const exists = fakeUsers.find(u => u.email === email)
  if (exists) throw new Error('Пользователь с таким email уже существует')
  const newUser = { id: Date.now(), name, email, role: 'USER', avatar: null }
  return { user: newUser, token: `fake-jwt-token-${newUser.id}` }
}

export const getProfile = async () => {
  await delay(300)
  return fakeUsers[0]
}
