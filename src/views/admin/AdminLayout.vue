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
        <!-- Dashboard — ADMIN + MODERATOR (TAXI_MANAGER авто-редиректится на /admin/taxi) -->
        <RouterLink
          v-if="authStore.isAdmin || authStore.isModerator"
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

        <!-- Tickets — ADMIN + MODERATOR -->
        <RouterLink
          v-if="authStore.isAdmin || authStore.isModerator"
          to="/admin/tickets"
          class="admin-nav-item"
          :class="{ active: route.path.startsWith('/admin/tickets') }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Обращения
        </RouterLink>

        <!-- Complaints — ADMIN + MODERATOR -->
        <RouterLink
          v-if="authStore.isAdmin || authStore.isModerator"
          to="/admin/complaints"
          class="admin-nav-item"
          :class="{ active: route.path.startsWith('/admin/complaints') }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Жалобы
        </RouterLink>

        <!-- Taxi — ADMIN + TAXI_MANAGER -->
        <RouterLink
          v-if="authStore.isAdmin || authStore.isTaxiManager"
          to="/admin/taxi"
          class="admin-nav-item"
          :class="{ active: route.path.startsWith('/admin/taxi') }"
          @click="resetTaxiUnread"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h4l3 3v5h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          ИнваТакси
          <span v-if="taxiUnread > 0" class="nav-badge">{{ taxiUnread }}</span>
        </RouterLink>

        <!-- Guides — ADMIN + MODERATOR -->
        <RouterLink
          v-if="authStore.isAdmin || authStore.isModerator"
          to="/admin/guides"
          class="admin-nav-item"
          :class="{ active: route.path.startsWith('/admin/guides') }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Гайды
        </RouterLink>

        <!-- Audit — ADMIN only -->
        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/audit"
          class="admin-nav-item"
          :class="{ active: route.path.startsWith('/admin/audit') }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          Аудит
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useToast } from '../../stores/toast.js'
import { getManagerUnreadMessages } from '../../api/taxi.js'

const authStore = useAuthStore()
const route = useRoute()
const toast = useToast()

const taxiUnread = ref(0)
let lastUnread = -1
let pollTimer = null

function resetTaxiUnread() {
  // Ставим lastUnread = текущий счётчик, а не 0.
  // Иначе бэкенд всё ещё вернёт то же число → уведомление сработает снова.
  lastUnread = taxiUnread.value
  taxiUnread.value = 0
}

// Сбрасываем бейдж, когда пользователь уже находится на /admin/taxi
watch(() => route.path, (p) => {
  if (p.startsWith('/admin/taxi')) resetTaxiUnread()
})

onMounted(() => {
  if (!authStore.isAdmin && !authStore.isTaxiManager) return
  if (Notification && Notification.permission === 'default') Notification.requestPermission()

  pollTimer = setInterval(async () => {
    // Не опрашиваем если уже открыта страница AdminTaxi (там своя логика)
    if (route.path.startsWith('/admin/taxi')) return
    try {
      const raw = await getManagerUnreadMessages()
      const n = typeof raw === 'number' ? raw : (raw?.count ?? 0)
      taxiUnread.value = n
      if (lastUnread >= 0 && n > lastUnread) {
        // Пробуем достать инфо о заявке из ответа (если бэкенд отдаёт)
        const items = Array.isArray(raw) ? raw : (raw?.items ?? raw?.bookings ?? [])
        const booking = items[0]
        const bookingInfo = booking?.fromAddress
          ? ` — заявка: ${booking.fromAddress}`
          : booking?.bookingId ? ` — заявка #${booking.bookingId}` : ''
        const msg = `💬 Новое сообщение от клиента${bookingInfo}`
        toast.info(msg, 10000, '/admin/taxi')
        if (Notification?.permission === 'granted') {
          const notif = new Notification('SenimdiQadam — ИнваТакси Чат', { body: msg, icon: '/favicon.ico' })
          notif.onclick = () => {
            window.focus()
            window.location.href = window.location.origin + '/#/admin/taxi'
          }
        }
      }
      lastUnread = n
    } catch {}
  }, 5000)
})

onUnmounted(() => { if (pollTimer) clearInterval(pollTimer) })
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
  top: var(--header-h);
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

.nav-badge {
  margin-left: auto;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  animation: navPulse 2s ease-in-out infinite;
}
@keyframes navPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

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
  padding: calc(var(--header-h) + 32px) 32px 32px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-sidebar { width: 60px; }
  .admin-logo-title, .admin-logo-sub, .admin-user-name,
  .admin-user-role, .admin-back-btn span { display: none; }
  .admin-nav-item span { display: none; }
  .admin-logo { justify-content: center; padding: 16px 8px; }
  .admin-main { margin-left: 60px; padding: calc(var(--header-h) + 20px) 16px 20px; }
  .admin-back-btn { justify-content: center; }
  .admin-user-info { justify-content: center; }
}
</style>
