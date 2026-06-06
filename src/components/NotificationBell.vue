<template>
  <div class="notif" ref="rootRef">
    <button
      class="notif-btn"
      @click="toggle"
      :aria-expanded="open"
      :aria-label="`${t('notifications')}${unread ? ', ' + unread + ' ' + t('unread') : ''}`"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span v-if="unread > 0" class="notif-badge" aria-hidden="true">{{ unread > 99 ? '99+' : unread }}</span>
    </button>

    <div v-if="open" class="notif-menu" role="menu">
      <div class="notif-head">
        <span class="notif-title">{{ t('notifications') }}</span>
        <button v-if="unread > 0" class="notif-readall" @click="readAll">{{ t('markAllRead') }}</button>
      </div>

      <div class="notif-body">
        <div v-if="loading" class="notif-empty">{{ t('loading') }}…</div>
        <div v-else-if="items.length === 0" class="notif-empty">{{ t('noNotifications') }}</div>
        <button
          v-for="n in items"
          :key="n.id"
          class="notif-item"
          :class="{ 'notif-item--unread': !n.isRead && !n.read }"
          @click="onItem(n)"
          role="menuitem"
        >
          <span class="notif-dot" :class="{ on: !n.isRead && !n.read }" aria-hidden="true"></span>
          <span class="notif-text">
            <span class="notif-item-title">{{ n.title || n.type || t('notification') }}</span>
            <span class="notif-item-body" v-if="n.body || n.message">{{ n.body || n.message }}</span>
            <span class="notif-time">{{ formatTime(n.createdAt) }}</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useToast } from '../stores/toast.js'
import { useI18n } from '../i18n.js'
import { getMyNotifications, markAllRead, markRead } from '../api/notifications.js'

const auth = useAuthStore()
const a11y = useAccessibilityStore()
const toast = useToast()
const router = useRouter()
const t = computed(() => useI18n(a11y.lang))

const open = ref(false)
const loading = ref(false)
const items = ref([])
const rootRef = ref(null)
let poll = null

const unread = computed(() =>
  items.value.filter(n => !n.isRead && !n.read).length
)

const load = async () => {
  if (!auth.isAuthenticated) { items.value = []; return }
  loading.value = true
  try {
    const res = await getMyNotifications({ limit: 20 })
    items.value = res.items ?? res ?? []
  } catch (e) {
    /* тихо: колокольчик не должен ломать шапку */
  } finally {
    loading.value = false
  }
}

const toggle = () => {
  open.value = !open.value
  if (open.value) load()
}

const readAll = async () => {
  try {
    await markAllRead()
    items.value = items.value.map(n => ({ ...n, isRead: true, read: true }))
    toast.success(t.value('allRead'))
  } catch (e) {
    toast.error(t.value('errorGeneric'))
  }
}

const onItem = async (n) => {
  if (!n.isRead && !n.read) {
    try { await markRead(n.id); n.isRead = true } catch {}
  }
  if (n.link || n.url) { open.value = false; router.push(n.link || n.url) }
}

const formatTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'только что'
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

const onOutside = (e) => {
  if (rootRef.value && !rootRef.value.contains(e.target)) open.value = false
}

onMounted(() => {
  document.addEventListener('click', onOutside)
  load()
  poll = setInterval(load, 60000) // обновлять счётчик раз в минуту
})
onUnmounted(() => {
  document.removeEventListener('click', onOutside)
  if (poll) clearInterval(poll)
})
</script>

<style scoped>
.notif { position: relative; }
.notif-btn {
  position: relative;
  color: rgba(255,255,255,0.85);
  padding: 8px;
  border-radius: var(--radius-sm);
  background: none; border: none; cursor: pointer;
  transition: all var(--transition);
}
.notif-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
.notif-badge {
  position: absolute;
  top: 2px; right: 2px;
  min-width: 17px; height: 17px;
  padding: 0 4px;
  background: var(--danger);
  color: #fff;
  font-size: 10px; font-weight: 800;
  line-height: 17px;
  border-radius: 9px;
  text-align: center;
}
.notif-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: min(340px, 90vw);
  background: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  z-index: 700;
  overflow: hidden;
}
.notif-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--gray-200);
}
.notif-title { font-weight: 800; color: var(--gray-900); font-size: var(--fs-sm); }
.notif-readall {
  background: none; border: none; cursor: pointer;
  color: var(--primary); font-size: var(--fs-xs); font-weight: 700;
}
.notif-readall:hover { text-decoration: underline; }
.notif-body { max-height: 380px; overflow-y: auto; }
.notif-empty { padding: 28px 16px; text-align: center; color: var(--gray-500); font-size: var(--fs-sm); }
.notif-item {
  display: flex; gap: 10px; align-items: flex-start;
  width: 100%; text-align: left;
  padding: 12px 16px;
  background: none; border: none; cursor: pointer;
  border-bottom: 1px solid var(--gray-100);
  transition: background var(--transition);
}
.notif-item:hover { background: var(--gray-50); }
.notif-item--unread { background: var(--primary-pale); }
.notif-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: transparent; margin-top: 6px; flex-shrink: 0;
}
.notif-dot.on { background: var(--primary); }
.notif-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.notif-item-title { font-weight: 700; font-size: var(--fs-sm); color: var(--gray-900); }
.notif-item-body { font-size: var(--fs-xs); color: var(--gray-700); line-height: 1.35; }
.notif-time { font-size: 11px; color: var(--gray-500); margin-top: 2px; }
</style>
