import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe } from '../api/auth.js'

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
    persistUser(data.user)
    persistTokens(data.accessToken, data.refreshToken)
  }

  async function register(payload) {
    const data = await apiRegister(payload)
    persistUser(data.user)
    persistTokens(data.accessToken, data.refreshToken)
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
   * Stores the tokens then fetches the user profile from GET /api/core/auth/me
   * POST /api/core/auth/refresh → { accessToken, refreshToken } shape expected
   */
  async function loginWithTokens(at, rt) {
    persistTokens(at, rt)
    try {
      const userData = await getMe(at)
      persistUser(userData)
    } catch {
      // If getMe fails (e.g. expired token), clear
      persistTokens(null, null)
      throw new Error('Token validation failed')
    }
  }

  // ── Saved organisations ────────────────────────────────────────────────────
  const savedOrgs = ref(JSON.parse(localStorage.getItem('sqSavedOrgs') || '[]'))

  const toggleSaveOrg = (orgId) => {
    const idx = savedOrgs.value.indexOf(orgId)
    if (idx === -1) savedOrgs.value.push(orgId)
    else savedOrgs.value.splice(idx, 1)
    localStorage.setItem('sqSavedOrgs', JSON.stringify(savedOrgs.value))
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
