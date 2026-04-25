<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-logo">
        <div class="admin-logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div class="admin-logo-title">Панель управления</div>
          <div class="admin-logo-sub">SenimdiQadam</div>
        </div>
      </div>

      <nav class="admin-nav">
        <!-- Dashboard — ADMIN only -->
        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin"
          class="admin-nav-item"
          :class="{ active: route.path === '/admin' }"
          exact
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          Дашборд
        </RouterLink>

        <!-- Organisations — ADMIN + MODERATOR -->
        <RouterLink
          v-if="authStore.isAdmin || authStore.isModerator"
          to="/admin/orgs"
          class="admin-nav-item"
          :class="{ active: route.path.startsWith('/admin/orgs') }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Организации
        </RouterLink>

        <!-- News — ADMIN + MODERATOR -->
        <RouterLink
          v-if="authStore.isAdmin || authStore.isModerator"
          to="/admin/news"
          class="admin-nav-item"
          :class="{ active: route.path.startsWith('/admin/news') }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
            <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z"/>
          </svg>
          Новости
        </RouterLink>

        <!-- Users — ADMIN only -->
        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/users"
          class="admin-nav-item"
          :class="{ active: route.path.startsWith('/admin/users') }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Пользователи
        </RouterLink>

        <!-- Taxi — ADMIN + TAXI_MANAGER -->
        <RouterLink
          v-if="authStore.isAdmin || authStore.isTaxiManager"
          to="/admin/taxi"
          class="admin-nav-item"
          :class="{ active: route.path.startsWith('/admin/taxi') }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h4l3 3v5h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          ИнваТакси
        </RouterLink>
      </nav>

      <div class="admin-sidebar-footer">
        <div class="admin-user-info">
          <div class="admin-avatar">{{ authStore.user?.firstName?.charAt(0) || 'A' }}</div>
          <div>
            <div class="admin-user-name">{{ authStore.fullName || authStore.user?.email }}</div>
            <div class="admin-user-role">{{ authStore.roleLabel }}</div>
          </div>
        </div>
        <RouterLink to="/" class="admin-back-btn" title="На главный сайт">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          На сайт
        </RouterLink>
      </div>
    </aside>

    <!-- Main content -->
    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'

const authStore = useAuthStore()
const route = useRoute()
</script>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
}

/* Sidebar */
.admin-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #1e293b;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.admin-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.admin-logo-icon {
  width: 38px; height: 38px;
  background: #3b82f6;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: white;
  flex-shrink: 0;
}
.admin-logo-title { font-size: 13px; font-weight: 700; color: white; line-height: 1.2; }
.admin-logo-sub { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 1px; }

.admin-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: rgba(255,255,255,0.6);
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s;
}
.admin-nav-item:hover { background: rgba(255,255,255,0.07); color: white; }
.admin-nav-item.active { background: #3b82f6; color: white; }
.admin-nav-item svg { flex-shrink: 0; opacity: 0.8; }
.admin-nav-item.active svg { opacity: 1; }

.admin-sidebar-footer {
  padding: 14px 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.admin-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.admin-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}
.admin-user-name { font-size: 12.5px; font-weight: 600; color: white; line-height: 1.3; }
.admin-user-role { font-size: 11px; color: rgba(255,255,255,0.45); }

.admin-back-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.6);
  font-size: 12.5px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s;
  width: 100%;
}
.admin-back-btn:hover { background: rgba(255,255,255,0.13); color: white; }

/* Main */
.admin-main {
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  padding: 32px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-sidebar { width: 60px; }
  .admin-logo-title, .admin-logo-sub, .admin-user-name,
  .admin-user-role, .admin-back-btn span { display: none; }
  .admin-nav-item span { display: none; }
  .admin-logo { justify-content: center; padding: 16px 8px; }
  .admin-main { margin-left: 60px; padding: 20px 16px; }
  .admin-back-btn { justify-content: center; }
  .admin-user-info { justify-content: center; }
}
</style>
