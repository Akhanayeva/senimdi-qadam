/**
 * Auth Mock API
 * Mirrors: POST /api/core/auth/register
 *          POST /api/core/auth/login
 *          POST /api/core/auth/refresh
 *          POST /api/core/auth/logout
 *          GET  /api/core/auth/me
 *          POST /api/core/auth/forgot-password
 *          POST /api/core/auth/reset-password
 *
 * Replace mock implementations with real fetch() calls when backend is ready.
 */

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms))

// Simulated user DB
const fakeUsers = [
  {
    id: 'usr-001',
    email: 'admin@senimdi.kz',
    password: 'admin123',
    firstName: 'Аружан',
    lastName: 'Акханаева',
    phone: '+7 777 001 0001',
    role: 'ADMIN',
    disabilityType: null,
    avatar: null,
    bio: 'Администратор платформы SenimdiQAdam',
    bioKaz: 'SenimdiQAdam платформасының әкімшісі',
    createdAt: '2025-09-01T00:00:00Z',
    location: { lat: 43.238, lon: 76.945 }
  },
  {
    id: 'usr-002',
    email: 'user@senimdi.kz',
    password: 'user123',
    firstName: 'Асель',
    lastName: 'Нурланова',
    phone: '+7 777 002 0002',
    role: 'USER',
    disabilityType: 'WHEELCHAIR',
    avatar: null,
    bio: 'Пользователь платформы',
    bioKaz: 'Платформа пайдаланушысы',
    createdAt: '2025-10-15T00:00:00Z',
    location: null
  },
  {
    id: 'usr-003',
    email: 'mod@senimdi.kz',
    password: 'mod123',
    firstName: 'Берік',
    lastName: 'Сейтқали',
    phone: '+7 777 003 0003',
    role: 'MODERATOR',
    disabilityType: null,
    avatar: null,
    bio: 'Модератор',
    bioKaz: 'Модератор',
    createdAt: '2025-11-01T00:00:00Z',
    location: null
  },
  {
    id: 'usr-004',
    email: 'manager@senimdi.kz',
    password: 'manager123',
    firstName: 'Жанибек',
    lastName: 'Абенов',
    phone: '+7 777 004 0004',
    role: 'TAXI_MANAGER',
    disabilityType: null,
    avatar: null,
    bio: 'Менеджер ИнваТакси',
    bioKaz: 'ИнваТакси менеджері',
    createdAt: '2025-12-01T00:00:00Z',
    location: null
  }
]

// Simulate JWT payload encode (base64 of JSON)
function makeToken(userId) {
  const payload = btoa(JSON.stringify({ sub: userId, iat: Date.now(), exp: Date.now() + 3600000 }))
  return `mock.${payload}.signature`
}

function makeRefreshToken(userId) {
  const payload = btoa(JSON.stringify({ sub: userId, type: 'refresh', exp: Date.now() + 7 * 24 * 3600000 }))
  return `refresh.${payload}.signature`
}

function userWithoutPassword(user) {
  const { password, ...safe } = user
  return safe
}

/** POST /api/core/auth/login */
export async function login(email, password) {
  await delay(700)
  const user = fakeUsers.find(u => u.email === email && u.password === password)
  if (!user) throw new Error('Неверный email или пароль')
  return {
    accessToken: makeToken(user.id),
    refreshToken: makeRefreshToken(user.id),
    user: userWithoutPassword(user)
  }
}

/** POST /api/core/auth/register */
export async function register(payload) {
  await delay(900)
  if (fakeUsers.find(u => u.email === payload.email)) {
    throw new Error('Пользователь с таким email уже существует')
  }
  // Validate password
  if (payload.password.length < 8) throw new Error('Пароль должен содержать минимум 8 символов')
  if (!/[A-Z]/.test(payload.password)) throw new Error('Пароль должен содержать заглавную букву')
  if (!/[0-9]/.test(payload.password)) throw new Error('Пароль должен содержать цифру')

  const newUser = {
    id: 'usr-' + Date.now(),
    email: payload.email,
    password: payload.password,
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone || '',
    role: payload.role || 'USER',
    disabilityType: payload.role === 'USER' ? (payload.disabilityType || null) : null,
    avatar: null,
    bio: '',
    bioKaz: '',
    createdAt: new Date().toISOString(),
    location: null
  }
  fakeUsers.push(newUser)
  return {
    accessToken: makeToken(newUser.id),
    refreshToken: makeRefreshToken(newUser.id),
    user: userWithoutPassword(newUser)
  }
}

/** POST /api/core/auth/logout */
export async function logout() {
  await delay(300)
  return { success: true }
}

/** GET /api/core/auth/me — decode token and return user */
export async function getMe(accessToken) {
  await delay(300)
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    const user = fakeUsers.find(u => u.id === payload.sub)
    if (!user) throw new Error('Unauthorized')
    return userWithoutPassword(user)
  } catch {
    throw new Error('Unauthorized')
  }
}

/** POST /api/core/auth/forgot-password */
export async function forgotPassword(email) {
  await delay(800)
  const exists = fakeUsers.find(u => u.email === email)
  // Always return success (don't leak whether email exists)
  return { message: 'Если указанный email зарегистрирован, вы получите письмо с инструкциями.' }
}

/** POST /api/core/auth/reset-password */
export async function resetPassword(code, newPassword) {
  await delay(600)
  // Mock: accept any 6-digit code
  if (!code || code.length < 4) throw new Error('Неверный код сброса')
  return { success: true }
}

/** POST /api/core/auth/refresh */
export async function refreshToken(token) {
  await delay(300)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const user = fakeUsers.find(u => u.id === payload.sub)
    if (!user) throw new Error('Invalid refresh token')
    return { accessToken: makeToken(user.id) }
  } catch {
    throw new Error('Invalid refresh token')
  }
}
