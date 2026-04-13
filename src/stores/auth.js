import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe } from '../api/auth.js'
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
  const isUser = computed(() => user.value?.role === 'USER')
  const isRelative = computed(() => user.value?.role === 'RELATIVE')
  const fullName = computed(() => user.value ? `${user.value.firstName} ${user.value.lastName}`.trim() : '')
  const roleLabel = computed(() => {
    const map = {
      ADMIN: 'Администратор',
      MODERATOR: 'Модератор',
      TAXI_MANAGER: 'Менеджер ИнваТакси',
      USER: 'Пользователь',
      RELATIVE: 'Опекун / Родственник'
    }
    return map[user.value?.role] || user.value?.role || ''
  })

  // ── Persist helpers ────────────────────────────────────────────────────────
  function persistUser(u) {
    user.value = u
    localStorage.setItem('sqUser', JSON.stringify(u))
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
    // Persist tokens first so getMyProfile can read the access token
    persistTokens(data.accessToken, data.refreshToken)
    // Use full profile data if available; fall back to auth-level user from login response
    try {
      const fullProfile = await getMyProfile(data.accessToken)
      persistUser(fullProfile)
    } catch {
      persistUser(data.user)
    }
  }

  async function register(payload) {
    // Real API POST /api/core/auth/register only accepts { email, password, role }
    // Profile fields (firstName, lastName, phone, disabilityType) are sent separately
    // via PATCH /api/core/profile/me after successful registration.
    const authPayload = {
      email: payload.email,
      password: payload.password,
      role: payload.role || 'USER'
    }
    const data = await apiRegister(authPayload)
    persistTokens(data.accessToken, data.refreshToken)
    try {
      // Send profile fields after registration if provided
      const profileFields = {}
      if (payload.firstName)      profileFields.firstName      = payload.firstName
      if (payload.lastName)       profileFields.lastName       = payload.lastName
      if (payload.phone)          profileFields.phone          = payload.phone
      if (payload.disabilityType) profileFields.disabilityType = payload.disabilityType
      if (Object.keys(profileFields).length) {
        await updateMyProfile(data.accessToken, profileFields)
      }
      const fullProfile = await getMyProfile(data.accessToken)
      persistUser(fullProfile)
    } catch {
      persistUser(data.user || { id: null, email: payload.email, role: payload.role || 'USER' })
    }
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
      // getMyProfile returns full user incl. firstName, lastName, avatarUrl, etc.
      const userData = await getMyProfile(at)
      persistUser(userData)
    } catch {
      // If profile fetch fails, fall back to minimal auth data
      try {
        const minData = await getMe(at)
        persistUser(minData)
      } catch {
        persistTokens(null, null)
        throw new Error('Token validation failed')
      }
    }
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
    isAuthenticated, isAdmin, isModerator, isTaxiManager, isUser, isRelative,
    fullName, roleLabel,
    login, register, logout, updateLocalUser, loginWithTokens,
    savedOrgs, savedChats, toggleSaveOrg, isOrgSaved, saveChat
  }
})
