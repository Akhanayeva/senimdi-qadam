import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth.js'
import { getMyProfile, updateMyProfile } from '../api/profile.js'
import { saveOrganization, unsaveOrganization } from '../api/organizations.js'

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const user = ref(JSON.parse(localStorage.getItem('sqUser') || 'null'))
  const accessToken = ref(localStorage.getItem('sqAccessToken') || null)
  const refreshToken = ref(localStorage.getItem('sqRefreshToken') || null)

  // ── Computed roles ─────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isModerator = computed(() => ['MODERATOR', 'ADMIN'].includes(user.value?.role))
  const isTaxiManager = computed(() => ['TAXI_MANAGER', 'ADMIN'].includes(user.value?.role))
  const isOrgManager = computed(() => user.value?.role === 'ORG_MANAGER')
  const isUser = computed(() => user.value?.role === 'USER')
  const isRelative = computed(() => user.value?.role === 'RELATIVE')
  const fullName = computed(() => user.value ? `${user.value.firstName} ${user.value.lastName}`.trim() : '')
  const roleLabel = computed(() => {
    const map = {
      ADMIN: 'Администратор',
      MODERATOR: 'Модератор',
      TAXI_MANAGER: 'Менеджер ИнваТакси',
      ORG_MANAGER: 'Менеджер организации',
      USER: 'Пользователь',
      RELATIVE: 'Опекун / Родственник'
    }
    return map[user.value?.role] || user.value?.role || ''
  })

  // ── Persist helpers ────────────────────────────────────────────────────────
  function normalizeUser(u) {
    if (!u) return null
    // Real backend may return { name, profile: { firstName, ... } } or flat { firstName }
    // Normalize everything to flat structure with firstName/lastName
    const profile = u.profile || {}
    return {
      ...u,
      firstName: u.firstName || profile.firstName || u.name?.split(' ')[0] || '',
      lastName:  u.lastName  || profile.lastName  || u.name?.split(' ').slice(1).join(' ') || '',
      email:     u.email     || profile.email     || '',
      role:      u.role      || u.userRole        || 'USER',
      avatarUrl: u.avatarUrl || profile.avatarUrl || null,
      phone:     u.phone     || profile.phone     || '',
    }
  }

  function persistUser(u) {
    const normalized = normalizeUser(u)
    user.value = normalized
    localStorage.setItem('sqUser', JSON.stringify(normalized))
  }
  function persistTokens(at, rt) {
    accessToken.value = at
    refreshToken.value = rt
    if (at) localStorage.setItem('sqAccessToken', at)
    else localStorage.removeItem('sqAccessToken')
    if (rt) localStorage.setItem('sqRefreshToken', rt)
    else localStorage.removeItem('sqRefreshToken')
  }

  // ── Auth actions ───────────────────────────────────────────────────────────
  async function login(email, password) {
    const data = await apiLogin(email, password)
    persistTokens(data.accessToken, data.refreshToken)
    try {
      // getMyProfile reads token from localStorage automatically
      const fullProfile = await getMyProfile()
      persistUser(fullProfile)
    } catch {
      // Fall back to minimal user from login response if profile fetch fails
      persistUser(data.user || null)
    }
    // Sync accessibility settings from server after login (non-blocking)
    try {
      const { useAccessibilityStore } = await import('./accessibility.js')
      const accStore = useAccessibilityStore()
      accStore.loadFromServer()
    } catch {}
  }

  async function register(payload) {
    // Real API accepts all fields in one request: { email, password, role, firstName, lastName, phone, disabilityType }
    const data = await apiRegister({
      email:          payload.email,
      password:       payload.password,
      role:           payload.role || 'USER',
      firstName:      payload.firstName      || undefined,
      lastName:       payload.lastName       || undefined,
      phone:          payload.phone          || undefined,
      disabilityType: payload.disabilityType || undefined,
    })
    persistTokens(data.accessToken, data.refreshToken)
    try {
      const fullProfile = await getMyProfile()
      persistUser(fullProfile)
    } catch {
      persistUser(data.user || { id: null, email: payload.email, role: payload.role || 'USER' })
    }
    // Return raw response so caller can read devCode (DEV email-verification mode)
    return data
  }

  async function logout() {
    try { if (accessToken.value) await apiLogout() } catch {}
    persistUser(null)
    persistTokens(null, null)
    savedOrgs.value = []
    localStorage.removeItem('sqSavedOrgs')
  }

  // Update local user data (called from ProfileView after PATCH)
  function updateLocalUser(fields) {
    if (!user.value) return
    const updated = { ...user.value, ...fields }
    persistUser(updated)
  }

  /**
   * loginWithTokens — used after OAuth callback
   * Stores the tokens then fetches the FULL user profile from GET /api/core/profile/me
   * (not /api/core/auth/me which only returns {id, email, role} in real API)
   */
  async function loginWithTokens(at, rt) {
    persistTokens(at, rt)
    try {
      const userData = await getMyProfile()
      persistUser(userData)
    } catch {
      try {
        const minData = await getMe()
        persistUser(minData)
      } catch {
        persistTokens(null, null)
        throw new Error('Token validation failed')
      }
    }
    // Sync accessibility settings from server after login (non-blocking)
    try {
      const { useAccessibilityStore } = await import('./accessibility.js')
      const accStore = useAccessibilityStore()
      accStore.loadFromServer()
    } catch {}
  }

  // ── Saved organisations ────────────────────────────────────────────────────
  const savedOrgs = ref(JSON.parse(localStorage.getItem('sqSavedOrgs') || '[]'))

  const toggleSaveOrg = async (orgId) => {
    const idx = savedOrgs.value.indexOf(orgId)
    const isSaving = idx === -1

    // Optimistic local update first
    if (isSaving) savedOrgs.value.push(orgId)
    else savedOrgs.value.splice(idx, 1)
    localStorage.setItem('sqSavedOrgs', JSON.stringify(savedOrgs.value))

    // Sync with real API (fire-and-forget; reverting on failure would confuse users)
    if (accessToken.value) {
      try {
        if (isSaving) await saveOrganization(accessToken.value, orgId)
        else await unsaveOrganization(accessToken.value, orgId)
      } catch (e) {
        console.warn('[toggleSaveOrg] API call failed:', e.message)
      }
    }
  }
  const isOrgSaved = (orgId) => savedOrgs.value.includes(orgId)

  // ── Saved chats ────────────────────────────────────────────────────────────
  const savedChats = ref(JSON.parse(localStorage.getItem('sqSavedChats') || '[]'))
  const saveChat = (chat) => {
    savedChats.value.unshift(chat)
    localStorage.setItem('sqSavedChats', JSON.stringify(savedChats.value))
  }

  return {
    user, accessToken, refreshToken,
    isAuthenticated, isAdmin, isModerator, isTaxiManager, isOrgManager, isUser, isRelative,
    fullName, roleLabel,
    login, register, logout, updateLocalUser, loginWithTokens,
    savedOrgs, savedChats, toggleSaveOrg, isOrgSaved, saveChat
  }
})
