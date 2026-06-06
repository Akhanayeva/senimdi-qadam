<template>
  <div id="app">
    <!-- Skip to content (для клавиатуры и скринридеров) -->
    <a href="#main-content" class="skip-link">{{ t('skipToContent') }}</a>

    <!-- Header -->
    <AppHeader
      @toggle-accessibility="a11yOpen = !a11yOpen"
      @toggle-mobile-menu="mobileMenuOpen = !mobileMenuOpen"
    />

    <!-- Navbar (desktop) — hidden on admin pages -->
    <AppNavbar v-if="!isAdminPage" />

    <!-- Accessibility Panel -->
    <AccessibilityPanel :open="a11yOpen" @close="a11yOpen = false" />

    <!-- Mobile menu -->
    <Transition name="slide-mobile">
      <div v-if="mobileMenuOpen" class="mobile-nav-overlay">
        <div class="mobile-nav-header">
          <span class="fw-bold" style="color:white;font-size:1.1rem">SenimdiQAdam</span>
          <button @click="mobileMenuOpen = false" style="color:white;font-size:20px;padding:8px;background:none;border:none;cursor:pointer">✕</button>
        </div>
        <nav class="mobile-nav-body">
          <div class="mobile-nav-group">
            <div class="mobile-nav-label">{{ t('services') }}</div>
            <RouterLink to="/services/organizations" class="mobile-nav-link" @click="mobileMenuOpen=false">🏢 {{ t('orgList') }}</RouterLink>
            <RouterLink to="/services/ai" class="mobile-nav-link" @click="mobileMenuOpen=false">🤖 {{ t('localAI') }}</RouterLink>
            <RouterLink to="/services/accessibility-map" class="mobile-nav-link" @click="mobileMenuOpen=false">🗺️ {{ t('accessMap') }}</RouterLink>
            <RouterLink to="/services/jobs" class="mobile-nav-link" @click="mobileMenuOpen=false">💼 {{ t('jobs') }}</RouterLink>
            <RouterLink to="/services/documents" class="mobile-nav-link" @click="mobileMenuOpen=false">📋 {{ t('documents') }}</RouterLink>
          </div>
          <div class="mobile-nav-group">
            <div class="mobile-nav-label">{{ t('projects') }}</div>
            <RouterLink to="/projects/forums" class="mobile-nav-link" @click="mobileMenuOpen=false">💬 {{ t('forums') }}</RouterLink>
            <RouterLink to="/projects/community" class="mobile-nav-link" @click="mobileMenuOpen=false">👥 {{ t('community') }}</RouterLink>
          </div>
          <div class="mobile-nav-group">
            <RouterLink to="/inva-taxi/order" class="mobile-nav-link" @click="mobileMenuOpen=false">🚕 {{ t('invaTaxi') }}</RouterLink>
            <RouterLink to="/news" class="mobile-nav-link" @click="mobileMenuOpen=false">📰 {{ t('news') }}</RouterLink>
            <RouterLink to="/info" class="mobile-nav-link" @click="mobileMenuOpen=false">📚 {{ t('moreInfo') }}</RouterLink>
            <RouterLink to="/help" class="mobile-nav-link" @click="mobileMenuOpen=false">❓ {{ t('helpNav') }}</RouterLink>
          </div>
          <div class="mobile-nav-group">
            <template v-if="!authStore.isAuthenticated">
              <RouterLink to="/login" class="mobile-nav-link" @click="mobileMenuOpen=false">🔑 {{ t('login') }}</RouterLink>
              <RouterLink to="/register" class="mobile-nav-link" @click="mobileMenuOpen=false">📝 {{ t('register') }}</RouterLink>
            </template>
            <template v-else>
              <RouterLink to="/profile" class="mobile-nav-link" @click="mobileMenuOpen=false">👤 {{ authStore.user?.name }}</RouterLink>
              <button class="mobile-nav-link mobile-nav-btn" @click="logout">🚪 {{ t('logoutBtn') }}</button>
            </template>
          </div>
          <div class="mobile-nav-lang">
            <button :class="{ active: a11y.lang === 'kaz' }" @click="a11y.setLang('kaz')">ҚАЗ</button>
            <button :class="{ active: a11y.lang === 'rus' }" @click="a11y.setLang('rus')">РУС</button>
            <button :class="{ active: a11y.lang === 'eng' }" @click="a11y.setLang('eng')">ENG</button>
          </div>
          <button class="mobile-a11y-btn" @click="a11yOpen = true; mobileMenuOpen = false">
            ♿ {{ t('accessPanel') }}
          </button>
        </nav>
      </div>
    </Transition>
    <div v-if="mobileMenuOpen" class="mobile-backdrop" @click="mobileMenuOpen = false"></div>

    <!-- Router View -->
    <main id="main-content" tabindex="-1">
      <RouterView />
    </main>

    <!-- Footer — hidden on admin pages -->
    <AppFooter v-if="!isAdminPage" />

    <!-- Глобальные тосты -->
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import AccessibilityPanel from './components/AccessibilityPanel.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useAuthStore } from './stores/auth.js'
import { useAccessibilityStore } from './stores/accessibility.js'
import { useI18n } from './i18n.js'

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const router = useRouter()
const route = useRoute()
const t = computed(() => useI18n(a11y.lang))

const isAdminPage = computed(() => route.path.startsWith('/admin'))

const a11yOpen = ref(false)
const mobileMenuOpen = ref(false)

const logout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}
</script>

<style>
.mobile-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 840;
}
.mobile-nav-overlay {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: min(320px, 85vw);
  background: var(--dark);
  z-index: 850;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 8px 0 32px rgba(0,0,0,0.3);
}
.mobile-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--primary);
  flex-shrink: 0;
}
.mobile-nav-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.mobile-nav-group { margin-bottom: 12px; }
.mobile-nav-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.4);
  padding: 8px 12px 4px;
}
.mobile-nav-link {
  display: block;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  font-weight: 500;
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  transition: all var(--transition);
}
.mobile-nav-btn {
  background: none; border: none; cursor: pointer;
  font-family: inherit; width: 100%; text-align: left;
}
.mobile-nav-link:hover { background: rgba(255,255,255,0.1); color: white; }
.mobile-nav-lang {
  display: flex; gap: 8px; padding: 12px; margin-top: 8px;
}
.mobile-nav-lang button {
  padding: 6px 16px;
  font-size: var(--fs-xs); font-weight: 700;
  color: rgba(255,255,255,0.6);
  border-radius: var(--radius-full);
  transition: all var(--transition);
  background: none; border: 1.5px solid transparent;
  cursor: pointer; font-family: inherit;
}
.mobile-nav-lang button.active { background: var(--primary); color: white; border-color: var(--primary); }
.mobile-nav-lang button:hover { color: white; background: rgba(255,255,255,0.1); }
.mobile-a11y-btn {
  margin: 8px 12px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.08);
  border-radius: var(--radius);
  color: rgba(255,255,255,0.8);
  font-size: var(--fs-sm); font-weight: 600;
  transition: all var(--transition);
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer; font-family: inherit;
  text-align: left; display: block; width: calc(100% - 24px);
}
.mobile-a11y-btn:hover { background: rgba(255,255,255,0.15); color: white; }
.slide-mobile-enter-from { transform: translateX(-100%); }
.slide-mobile-enter-active { transition: transform 0.3s ease; }
.slide-mobile-leave-to { transform: translateX(-100%); }
.slide-mobile-leave-active { transition: transform 0.25s ease; }
</style>
