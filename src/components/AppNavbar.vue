<template>
  <nav class="app-navbar" role="navigation" aria-label="Главная навигация">
    <div class="container navbar-inner">
      <!-- Қызметтер -->
      <div class="nav-item dropdown" @mouseenter="open('services')" @mouseleave="close('services')">
        <button class="nav-link" :class="{ active: isActive(['/services']) }" :aria-expanded="active === 'services'">
          {{ t('services') }}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div v-if="active === 'services'" class="dropdown-menu nav-dropdown">
          <RouterLink to="/services/organizations" class="dropdown-item" @click="close('services')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            {{ t('orgList') }}
          </RouterLink>
          <RouterLink to="/services/ai" class="dropdown-item" @click="close('services')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M8 12h8M12 8v8"/></svg>
            {{ t('localAI') }}
          </RouterLink>
          <RouterLink to="/services/accessibility-map" class="dropdown-item" @click="close('services')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {{ t('accessMap') }}
          </RouterLink>
          <RouterLink to="/services/jobs" class="dropdown-item" @click="close('services')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            {{ t('jobs') }}
          </RouterLink>
          <RouterLink to="/services/documents" class="dropdown-item" @click="close('services')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {{ t('documents') }}
          </RouterLink>
        </div>
      </div>

      <!-- Жобалар -->
      <div class="nav-item dropdown" @mouseenter="open('projects')" @mouseleave="close('projects')">
        <button class="nav-link" :class="{ active: isActive(['/projects']) }" :aria-expanded="active === 'projects'">
          {{ t('projects') }}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div v-if="active === 'projects'" class="dropdown-menu nav-dropdown">
          <RouterLink to="/projects/forums" class="dropdown-item" @click="close('projects')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {{ t('forums') }}
          </RouterLink>
          <RouterLink to="/projects/community" class="dropdown-item" @click="close('projects')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {{ t('community') }}
          </RouterLink>
        </div>
      </div>

      <!-- ИнваТакси -->
      <div class="nav-item dropdown" @mouseenter="open('taxi')" @mouseleave="close('taxi')">
        <button class="nav-link" :class="{ active: isActive(['/inva-taxi']) }" :aria-expanded="active === 'taxi'">
          {{ t('invaTaxi') }} 🚕
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div v-if="active === 'taxi'" class="dropdown-menu nav-dropdown">
          <RouterLink to="/inva-taxi/order" class="dropdown-item" @click="close('taxi')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v4h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            Заказать поездку
          </RouterLink>
          <RouterLink to="/inva-taxi/my-rides" class="dropdown-item" @click="close('taxi')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
            Мои заявки
          </RouterLink>
          <RouterLink to="/inva-taxi/chat" class="dropdown-item" @click="close('taxi')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Чат с менеджером
          </RouterLink>
        </div>
      </div>

      <!-- Жаңалықтар -->
      <RouterLink to="/news" class="nav-link" :class="{ active: isActive(['/news']) }">
        {{ t('news') }}
      </RouterLink>

      <!-- Қосымша -->
      <RouterLink to="/info" class="nav-link" :class="{ active: isActive(['/info']) }">
        {{ t('moreInfo') }}
      </RouterLink>

      <!-- Language switch -->
      <div class="nav-lang">
        <button
          class="lang-btn"
          :class="{ active: a11y.lang === 'kaz' }"
          @click="a11y.setLang('kaz')"
        >ҚАЗ</button>
        <span class="lang-divider">|</span>
        <button
          class="lang-btn"
          :class="{ active: a11y.lang === 'rus' }"
          @click="a11y.setLang('rus')"
        >РУС</button>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu Overlay -->
  <div v-if="mobileOpen" class="mobile-menu-overlay" @click="mobileOpen = false"></div>
  <div class="mobile-menu" :class="{ open: mobileOpen }">
    <div class="mobile-menu-header">
      <span class="fw-bold">Меню</span>
      <button @click="mobileOpen = false" class="btn btn-ghost btn-icon">✕</button>
    </div>
    <nav class="mobile-nav">
      <div class="mobile-nav-section">
        <div class="mobile-nav-section-title">{{ t('services') }}</div>
        <RouterLink to="/services/organizations" class="mobile-nav-item" @click="mobileOpen=false">{{ t('orgList') }}</RouterLink>
        <RouterLink to="/services/ai" class="mobile-nav-item" @click="mobileOpen=false">{{ t('localAI') }}</RouterLink>
        <RouterLink to="/services/accessibility-map" class="mobile-nav-item" @click="mobileOpen=false">{{ t('accessMap') }}</RouterLink>
        <RouterLink to="/services/jobs" class="mobile-nav-item" @click="mobileOpen=false">{{ t('jobs') }}</RouterLink>
        <RouterLink to="/services/documents" class="mobile-nav-item" @click="mobileOpen=false">{{ t('documents') }}</RouterLink>
      </div>
      <div class="mobile-nav-section">
        <div class="mobile-nav-section-title">{{ t('projects') }}</div>
        <RouterLink to="/projects/forums" class="mobile-nav-item" @click="mobileOpen=false">{{ t('forums') }}</RouterLink>
        <RouterLink to="/projects/community" class="mobile-nav-item" @click="mobileOpen=false">{{ t('community') }}</RouterLink>
      </div>
      <div class="mobile-nav-section">
        <RouterLink to="/inva-taxi/order" class="mobile-nav-item" @click="mobileOpen=false">{{ t('invaTaxi') }} 🚕</RouterLink>
        <RouterLink to="/news" class="mobile-nav-item" @click="mobileOpen=false">{{ t('news') }}</RouterLink>
        <RouterLink to="/info" class="mobile-nav-item" @click="mobileOpen=false">{{ t('moreInfo') }}</RouterLink>
      </div>
      <div class="mobile-nav-section mobile-lang">
        <button class="lang-btn" :class="{ active: a11y.lang === 'kaz' }" @click="a11y.setLang('kaz')">ҚАЗ</button>
        <button class="lang-btn" :class="{ active: a11y.lang === 'rus' }" @click="a11y.setLang('rus')">РУС</button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'

const props = defineProps({ mobileOpen: Boolean })
const emit = defineEmits(['update:mobileOpen'])

const a11y = useAccessibilityStore()
const route = useRoute()
const t = computed(() => useI18n(a11y.lang))
const active = ref(null)
const mobileOpen = ref(false)

const open = (name) => { active.value = name }
const close = (name) => { if (active.value === name) active.value = null }
const isActive = (paths) => paths.some(p => route.path.startsWith(p))
</script>

<style scoped>
.app-navbar {
  position: fixed;
  top: var(--header-h);
  left: 0;
  right: 0;
  height: var(--navbar-h);
  background: var(--dark);
  z-index: 800;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.navbar-inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
}
.nav-item { position: relative; }
.nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: rgba(255,255,255,0.8);
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
}
.nav-link:hover, .nav-link.active { color: white; background: rgba(255,255,255,0.1); }
.nav-link.active { color: white; }
.nav-dropdown { top: calc(100% + 4px); min-width: 240px; }
.nav-lang { margin-left: auto; display: flex; align-items: center; gap: 2px; }
.lang-btn {
  padding: 4px 10px;
  font-size: var(--fs-xs);
  font-weight: 700;
  color: rgba(255,255,255,0.6);
  border-radius: 6px;
  transition: all var(--transition);
  letter-spacing: 0.5px;
}
.lang-btn:hover { color: white; background: rgba(255,255,255,0.1); }
.lang-btn.active { color: white; background: var(--primary); }
.lang-divider { color: rgba(255,255,255,0.2); font-size: var(--fs-xs); }

/* Mobile menu */
.mobile-menu-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 850;
}
.mobile-menu {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 300px;
  background: var(--white);
  z-index: 900;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
}
.mobile-menu.open { transform: none; }
.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--primary);
  color: white;
}
.mobile-nav { padding: 16px; }
.mobile-nav-section { margin-bottom: 20px; }
.mobile-nav-section-title {
  font-size: var(--fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--gray-500);
  padding: 8px 12px;
  margin-bottom: 4px;
}
.mobile-nav-item {
  display: block;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  color: var(--gray-700);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition);
}
.mobile-nav-item:hover { background: var(--gray-100); color: var(--primary); }
.mobile-lang { display: flex; gap: 8px; padding: 8px 12px; }
.mobile-lang .lang-btn { background: var(--gray-100); color: var(--gray-700); padding: 6px 16px; border-radius: var(--radius-full); }
.mobile-lang .lang-btn.active { background: var(--primary); color: white; }

@media (max-width: 768px) {
  .app-navbar { display: none; }
}
</style>
