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

/**
 * Simulated user DB.
 * Each user has both auth fields (id, email, role) and profile fields
 * (firstName, lastName, phone, city, birthDate, disabilityType, disabilityNote, avatarUrl).
 *
 * In the real API:
 *  - GET /api/core/auth/me  → returns id, email, role (auth-level data)
 *  - GET /api/core/profile/me → returns full profile with all fields below
 *
 * For the mock we keep them in one object for simplicity.
 *
 * disabilityType for profile: VISUAL | HEARING | MOBILITY | COGNITIVE | SPEECH | OTHER | null
 * (differs from taxi booking disabilityType: WHEELCHAIR | VISUAL | HEARING | MOBILITY | OTHER)
 */
const fakeUsers = [
  {
    id: 'usr-001',
    email: 'admin@senimdi.kz',
    password: 'admin123',
    role: 'ADMIN',
    firstName: 'Аружан',
    lastName: 'Акханаева',
    phone: '+77770010001',
    city: 'Алматы',
    birthDate: '1990-03-15',
    disabilityType: null,
    disabilityNote: null,
    avatarUrl: null,
    bio: 'Администратор платформы SenimdiQAdam',
    bioKk: 'SenimdiQAdam платформасының әкімшісі',
    createdAt: '2025-09-01T00:00:00.000Z',
    lat: 43.238,
    lon: 76.945
  },
  {
    id: 'usr-002',
    email: 'user@senimdi.kz',
    password: 'User1234',
    role: 'USER',
    firstName: 'Асель',
    lastName: 'Нурланова',
    phone: '+77770020002',
    city: 'Алматы',
    birthDate: '1995-07-22',
    disabilityType: 'MOBILITY',
    disabilityNote: 'Использую инвалидную коляску',
    avatarUrl: null,
    bio: 'Пользователь платформы',
    bioKk: 'Платформа пайдаланушысы',
    createdAt: '2025-10-15T00:00:00.000Z',
    lat: null,
    lon: null
  },
  {
    id: 'usr-003',
    email: 'mod@senimdi.kz',
    password: 'Mod12345',
    role: 'MODERATOR',
    firstName: 'Берік',
    lastName: 'Сейтқали',
    phone: '+77770030003',
    city: 'Алматы',
    birthDate: '1988-11-30',
    disabilityType: null,
    disabilityNote: null,
    avatarUrl: null,
    bio: 'Модератор платформы',
    bioKk: 'Платформа модераторы',
    createdAt: '2025-11-01T00:00:00.000Z',
    lat: null,
    lon: null
  },
  {
    id: 'usr-004',
    email: 'manager@senimdi.kz',
    password: 'Manager1',
    role: 'TAXI_MANAGER',
    firstName: 'Жанибек',
    lastName: 'Абенов',
    phone: '+77770040004',
    city: 'Алматы',
    birthDate: '1985-04-10',
    disabilityType: null,
    disabilityNote: null,
    avatarUrl: null,
    bio: 'Менеджер ИнваТакси',
    bioKk: 'ИнваТакси менеджері',
    createdAt: '2025-12-01T00:00:00.000Z',
    lat: null,
    lon: null
  },
  {
    id: 'usr-005',
    email: 'relative@senimdi.kz',
    password: 'Relat123',
    role: 'RELATIVE',
    firstName: 'Гүлнар',
    lastName: 'Нұрланова',
    phone: '+77770050005',
    city: 'Алматы',
    birthDate: '1965-09-20',
    disabilityType: null,
    disabilityNote: null,
    avatarUrl: null,
    bio: 'Опекун — мама Асель',
    bioKk: 'Қамқоршы — Асельдің анасы',
    createdAt: '2025-10-20T00:00:00.000Z',
    lat: null,
    lon: null
  }
]

// Simulate JWT (base64-encoded payload)
function makeToken(userId) {
  const payload = btoa(JSON.stringify({ sub: userId, iat: Date.now(), exp: Date.now() + 3600000 }))
  return `mock.${payload}.signature`
}

function makeRefreshToken(userId) {
  const payload = btoa(JSON.stringify({ sub: userId, type: 'refresh', exp: Date.now() + 7 * 24 * 3600000 }))
  return `refresh.${payload}.signature`
}

function safeUser(user) {
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
    user: safeUser(user)
  }
}

/** POST /api/core/auth/register
 *  Body: { email, password, role: 'USER'|'RELATIVE', firstName?, lastName?, phone?, disabilityType? }
 *  Returns: { accessToken, refreshToken, user }
 */
export async function register(payload) {
  await delay(900)
  if (fakeUsers.find(u => u.email === payload.email)) {
    throw new Error('Пользователь с таким email уже существует')
  }
  if ((payload.password || '').length < 8) throw new Error('Пароль должен содержать минимум 8 символов')
  if (!/[A-Z]/.test(payload.password)) throw new Error('Пароль должен содержать заглавную букву')
  if (!/[0-9]/.test(payload.password)) throw new Error('Пароль должен содержать цифру')

  const newUser = {
    id: 'usr-' + Date.now(),
    email: payload.email,
    password: payload.password,
    role: payload.role || 'USER',
    firstName: payload.firstName || '',
    lastName: payload.lastName || '',
    phone: payload.phone || '',
    city: payload.city || 'Алматы',
    birthDate: payload.birthDate || null,
    disabilityType: payload.role === 'USER' ? (payload.disabilityType || null) : null,
    disabilityNote: null,
    avatarUrl: null,
    bio: '',
    bioKk: '',
    createdAt: new Date().toISOString(),
    lat: null,
    lon: null
  }
  fakeUsers.push(newUser)
  return {
    accessToken: makeToken(newUser.id),
    refreshToken: makeRefreshToken(newUser.id),
    user: safeUser(newUser)
  }
}

/** POST /api/core/auth/logout */
export async function logout() {
  await delay(300)
  return { success: true }
}

/** GET /api/core/auth/me — decode token → find user */
export async function getMe(accessToken) {
  await delay(300)
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    const user = fakeUsers.find(u => u.id === payload.sub)
    if (!user) throw new Error('Unauthorized')
    return safeUser(user)
  } catch {
    throw new Error('Unauthorized')
  }
}

/** POST /api/core/auth/forgot-password */
export async function forgotPassword(email) {
  await delay(800)
  // Always respond with success (don't leak whether email exists)
  return { message: 'Если указанный email зарегистрирован, вы получите письмо с инструкциями.' }
}

/** POST /api/core/auth/reset-password
 *  Body: { email, code, newPassword }
 */
export async function resetPassword(email, code, newPassword) {
  await delay(600)
  if (!code || code.length < 4) throw new Error('Неверный код сброса')
  if ((newPassword || '').length < 8) throw new Error('Пароль должен содержать минимум 8 символов')
  // Mock: find user and update password
  const user = fakeUsers.find(u => u.email === email)
  if (user) user.password = newPassword
  return { success: true }
}

/** POST /api/core/auth/refresh
 *  Returns both new tokens (real API refreshes both)
 */
export async function refreshToken(token) {
  await delay(300)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const user = fakeUsers.find(u => u.id === payload.sub)
    if (!user) throw new Error('Invalid refresh token')
    return {
      accessToken: makeToken(user.id),
      refreshToken: makeRefreshToken(user.id)
    }
  } catch {
    throw new Error('Invalid refresh token')
  }
}

// Expose fakeUsers for profile mock (internal use only)
export { fakeUsers }
