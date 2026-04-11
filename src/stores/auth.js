import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister } from '../api/auth.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('sqUser') || 'null'))
  const token = ref(localStorage.getItem('sqToken') || null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isModerator = computed(() => user.value?.role === 'MODERATOR' || user.value?.role === 'ADMIN')

  const login = async (email, password) => {
    const data = await apiLogin(email, password)
    user.value = data.user
    token.value = data.token
    localStorage.setItem('sqUser', JSON.stringify(data.user))
    localStorage.setItem('sqToken', data.token)
  }

  const register = async (name, email, password) => {
    const data = await apiRegister(name, email, password)
    user.value = data.user
    token.value = data.token
    localStorage.setItem('sqUser', JSON.stringify(data.user))
    localStorage.setItem('sqToken', data.token)
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('sqUser')
    localStorage.removeItem('sqToken')
  }

  const savedOrgs = ref(JSON.parse(localStorage.getItem('sqSavedOrgs') || '[]'))
  const savedChats = ref(JSON.parse(localStorage.getItem('sqSavedChats') || '[]'))

  const toggleSaveOrg = (orgId) => {
    const idx = savedOrgs.value.indexOf(orgId)
    if (idx === -1) savedOrgs.value.push(orgId)
    else savedOrgs.value.splice(idx, 1)
    localStorage.setItem('sqSavedOrgs', JSON.stringify(savedOrgs.value))
  }

  const isOrgSaved = (orgId) => savedOrgs.value.includes(orgId)

  const saveChat = (chat) => {
    savedChats.value.unshift(chat)
    localStorage.setItem('sqSavedChats', JSON.stringify(savedChats.value))
  }

  return { user, token, isAuthenticated, isAdmin, isModerator, login, register, logout, savedOrgs, savedChats, toggleSaveOrg, isOrgSaved, saveChat }
})
