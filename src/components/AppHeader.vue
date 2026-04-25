<template>
  <header class="app-header" role="banner">
    <div class="container header-inner">
      <!-- Logo -->
      <RouterLink to="/" class="header-logo" aria-label="SenimdiQAdam — Главная">
        <div class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#fff" fill-opacity="0.2"/>
            <path d="M14 4L6 9v6c0 4.42 3.44 8.56 8 9.56 4.56-1 8-5.14 8-9.56V9L14 4z" fill="#fff" fill-opacity="0.9"/>
            <path d="M11 14l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="logo-text">
          <span class="logo-name">SenimdiQAdam</span>
          <span class="logo-sub">{{ t('verified') }} ✓</span>
        </div>
      </RouterLink>

      <!-- Global Search -->
      <div class="header-search" ref="searchRef">
        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            class="search-input"
            :placeholder="t('search')"
            @input="onSearchInput"
            @focus="searchStore.open()"
            @keydown.escape="searchStore.close()"
            aria-label="Глобальный поиск"
            autocomplete="off"
          />
        </div>
        <!-- Search results dropdown -->
        <div v-if="searchStore.isOpen && searchStore.results.length > 0" class="search-dropdown" role="listbox">
          <template v-for="result in searchStore.results" :key="result.id + result.type">
            <RouterLink
              v-if="result.type === 'organization'"
              :to="`/services/organizations`"
              class="search-result-item"
              @click="searchStore.close()"
              role="option"
            >
              <span class="search-result-icon">🏢</span>
              <div>
                <div class="search-result-name">{{ lang === 'kaz' ? result.nameKaz : result.nameRus }}</div>
                <div class="search-result-type">{{ t('orgList') }}</div>
              </div>
              <span v-if="result.verified" class="badge badge-verified" style="margin-left:auto;font-size:0.65rem">✓</span>
            </RouterLink>
            <RouterLink
              v-else-if="result.type === 'news'"
              :to="`/news/${result.id}`"
              class="search-result-item"
              @click="searchStore.close()"
              role="option"
            >
              <span class="search-result-icon">📰</span>
              <div>
                <div class="search-result-name">{{ lang === 'kaz' ? result.titleKaz : result.title }}</div>
                <div class="search-result-type">{{ t('news') }}</div>
              </div>
            </RouterLink>
          </template>
        </div>
        <div v-else-if="searchStore.isOpen && searchQuery.length >= 2 && searchStore.results.length === 0" class="search-dropdown">
          <div class="search-no-results">{{ t('noResults') }}</div>
        </div>
      </div>

      <!-- Right actions -->
      <div class="header-actions">
        <!-- Help link -->
        <RouterLink to="/help" class="header-help-btn" :title="t('helpNav')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span class="header-help-label">{{ t('helpNav') }}</span>
        </RouterLink>

        <!-- Accessibility toggle -->
        <button
          class="header-a11y-btn"
          :class="{ 'a11y-active': a11yStore.highContrast }"
          @click="$emit('toggle-accessibility')"
          :title="t('accessPanel')"
          aria-label="Настройки доступности"
        >
          <!-- Open eye = normal mode -->
          <svg v-if="!a11yStore.highContrast" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <!-- Closed eye = high contrast active -->
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        </button>

        <!-- Auth / Profile -->
        <div v-if="!authStore.isAuthenticated" class="header-auth">
          <RouterLink to="/login" class="btn btn-outline btn-sm">{{ t('login') }}</RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn-sm">{{ t('register') }}</RouterLink>
        </div>
        <div v-else class="dropdown" ref="profileRef">
          <button class="profile-btn" @click="profileOpen = !profileOpen" :aria-expanded="profileOpen">
            <div class="avatar">{{ authStore.user?.firstName?.charAt(0) || authStore.user?.email?.charAt(0) || 'U' }}</div>
            <span class="profile-name">{{ authStore.fullName || authStore.user?.email }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div v-if="profileOpen" class="dropdown-menu profile-menu" role="menu">
            <div class="profile-menu-header">
              <div class="avatar avatar-lg">{{ authStore.user?.firstName?.charAt(0) || authStore.user?.email?.charAt(0) || 'U' }}</div>
              <div>
                <div class="fw-bold">{{ authStore.fullName || authStore.user?.email }}</div>
                <div class="text-sm text-gray">{{ authStore.user?.email }}</div>
                <span class="badge badge-primary mt-4" style="margin-top:4px">{{ authStore.roleLabel }}</span>
              </div>
            </div>
            <div class="profile-menu-divider"></div>
            <!-- Admin panel link — only for ADMIN / MODERATOR / TAXI_MANAGER -->
            <RouterLink
              v-if="authStore.isAdmin || authStore.isModerator || authStore.isTaxiManager"
              to="/admin"
              class="dropdown-item dropdown-item--admin"
              @click="profileOpen=false"
              role="menuitem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Панель управления
            </RouterLink>
            <RouterLink to="/profile" class="dropdown-item" @click="profileOpen=false" role="menuitem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {{ t('myProfile') }}
            </RouterLink>
            <RouterLink to="/favorites" class="dropdown-item" @click="profileOpen=false" role="menuitem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {{ t('favorites') }}
            </RouterLink>
            <RouterLink to="/requests" class="dropdown-item" @click="profileOpen=false" role="menuitem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/></svg>
              {{ t('myRequests') }}
            </RouterLink>
            <div class="profile-menu-divider"></div>
            <button class="dropdown-item text-danger" @click="handleLogout" role="menuitem" style="color:var(--danger)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {{ t('logoutBtn') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile burger -->
      <button class="burger-btn" @click="$emit('toggle-mobile-menu')" aria-label="Открыть меню">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useSearchStore } from '../stores/search.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'

const emit = defineEmits(['toggle-accessibility', 'toggle-mobile-menu'])

const authStore = useAuthStore()
const searchStore = useSearchStore()
const a11y = useAccessibilityStore()
const a11yStore = a11y
const router = useRouter()

const lang = computed(() => a11y.lang)
const t = computed(() => useI18n(lang.value))

const searchQuery = ref('')
const profileOpen = ref(false)
const searchRef = ref(null)
const profileRef = ref(null)

const onSearchInput = () => { searchStore.search(searchQuery.value) }

const handleLogout = () => {
  authStore.logout()
  profileOpen.value = false
  router.push('/')
}

const handleClickOutside = (e) => {
  if (searchRef.value && !searchRef.value.contains(e.target)) searchStore.close()
  if (profileRef.value && !profileRef.value.contains(e.target)) profileOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-h);
  background: var(--primary);
  z-index: 900;
  box-shadow: 0 2px 16px rgba(27,63,216,0.3);
}
.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
}

/* Logo */
.header-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; flex-shrink: 0; }
.logo-icon {
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-text { display: flex; flex-direction: column; }
.logo-name { font-size: var(--fs-md); font-weight: 800; color: var(--white); letter-spacing: -0.5px; }
.logo-sub { font-size: 10px; color: rgba(255,255,255,0.7); font-weight: 500; }

/* Search */
.header-search { flex: 1; max-width: 440px; position: relative; }
.header-search .search-input {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.2);
  color: white;
}
.header-search .search-input::placeholder { color: rgba(255,255,255,0.6); }
.header-search .search-input:focus { background: white; color: var(--gray-900); border-color: white; }
.header-search .search-icon { color: rgba(255,255,255,0.7); }
.header-search .search-input:focus ~ .search-icon { color: var(--gray-400); }

.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  z-index: 600;
  overflow: hidden;
  max-height: 360px;
  overflow-y: auto;
}
.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background var(--transition);
  text-decoration: none;
  color: var(--gray-900);
}
.search-result-item:hover { background: var(--gray-50); }
.search-result-icon { font-size: 18px; flex-shrink: 0; }
.search-result-name { font-size: var(--fs-sm); font-weight: 600; }
.search-result-type { font-size: var(--fs-xs); color: var(--gray-500); }
.search-no-results { padding: 16px; text-align: center; color: var(--gray-500); font-size: var(--fs-sm); }

/* Actions */
.header-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; margin-left: auto; }

.header-help-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.85);
  font-size: var(--fs-sm);
  font-weight: 500;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  transition: all var(--transition);
}
.header-help-btn:hover { background: rgba(255,255,255,0.15); color: white; }
.header-help-label { white-space: nowrap; }

.header-a11y-btn {
  color: rgba(255,255,255,0.85);
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  position: relative;
}
.header-a11y-btn:hover { background: rgba(255,255,255,0.15); color: white; }
.header-a11y-btn.a11y-active {
  background: rgba(255,255,255,0.2);
  color: white;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.5);
}

.header-auth { display: flex; gap: 8px; }
.header-auth .btn-outline { color: white; border-color: rgba(255,255,255,0.5); }
.header-auth .btn-outline:hover { background: rgba(255,255,255,0.1); }
.header-auth .btn-primary { background: white; color: var(--primary); }
.header-auth .btn-primary:hover { background: var(--gray-50); }

/* Profile */
.profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 6px;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.15);
  color: white;
  font-size: var(--fs-sm);
  font-weight: 600;
  transition: all var(--transition);
}
.profile-btn:hover { background: rgba(255,255,255,0.25); }
.avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: white;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--fs-sm);
  flex-shrink: 0;
}
.avatar-lg { width: 40px; height: 40px; font-size: var(--fs-md); }
.profile-name { max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.profile-menu { min-width: 240px; right: 0; left: auto; }
.profile-menu-header { display: flex; gap: 12px; padding: 16px; align-items: center; }
.profile-menu-divider { height: 1px; background: var(--gray-200); }

/* Admin panel menu item */
.dropdown-item--admin {
  color: #3b82f6 !important;
  font-weight: 700;
}
.dropdown-item--admin:hover { background: #eff6ff; }

/* Burger */
.burger-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  margin-left: auto;
}
.burger-btn span { display: block; width: 22px; height: 2px; background: white; border-radius: 2px; transition: all var(--transition); }

@media (max-width: 900px) {
  .header-help-label { display: none; }
  .header-auth .btn-outline { display: none; }
}
@media (max-width: 640px) {
  .header-search { display: none; }
  .header-help-btn { display: none; }
  .header-actions { display: none; }
  .burger-btn { display: flex; }
}
</style>
