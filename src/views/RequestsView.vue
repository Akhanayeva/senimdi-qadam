<template>
  <main class="page-content">
    <div class="req-page">
      <div class="req-header">
        <div class="container">
          <h1 class="page-h1">{{ t('myRequests') }}</h1>
          <p class="page-desc">{{ t('ridesHistoryDesc') }}</p>
        </div>
      </div>

      <div class="container req-content">
        <!-- Not logged in -->
        <div v-if="!authStore.isAuthenticated" class="empty-state">
          <div class="empty-state-icon">🔒</div>
          <h3>{{ t('needLoginTitle') }}</h3>
          <RouterLink to="/login" class="btn btn-primary mt-4">{{ t('login') }}</RouterLink>
        </div>

        <!-- Loading -->
        <div v-else-if="loading" class="req-list">
          <div v-for="i in 3" :key="i" class="skeleton" style="height:96px;border-radius:12px;margin-bottom:14px"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <p>{{ t('errorLoad') }}</p>
          <button class="btn btn-primary mt-4" @click="load">{{ t('retryBtn') }}</button>
        </div>

        <!-- Empty -->
        <div v-else-if="bookings.length === 0" class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>{{ t('noRequestsTitle') }}</h3>
          <p style="margin-top:8px;color:var(--gray-500)">{{ t('requestTaxiHint') }}</p>
          <RouterLink to="/inva-taxi" class="btn btn-primary mt-4">{{ t('orderTaxiBtn') }}</RouterLink>
        </div>

        <!-- List -->
        <div v-else class="req-list">
          <RouterLink
            v-for="b in bookings"
            :key="b.id"
            to="/inva-taxi"
            class="req-card"
          >
            <div class="req-card-main">
              <div class="req-route">
                <span class="req-dot req-dot-from"></span>
                <span class="req-addr">{{ b.fromAddress || '—' }}</span>
              </div>
              <div class="req-route">
                <span class="req-dot req-dot-to"></span>
                <span class="req-addr">{{ b.toAddress || '—' }}</span>
              </div>
              <div class="req-meta">
                <span class="req-date">{{ formatDate(b.scheduledAt || b.createdAt) }}</span>
                <span v-if="b.price" class="req-price">{{ b.price }} ₸</span>
              </div>
            </div>
            <div class="req-card-side">
              <span class="req-status" :class="statusClass(b.status)">{{ statusLabel(b.status) }}</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'
import { getMyBookings } from '../api/taxi.js'

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const lang = computed(() => a11y.lang)
const t = computed(() => useI18n(lang.value))

const bookings = ref([])
const loading = ref(true)
const error = ref(null)

const STATUS = {
  PENDING:     { rus: 'Ожидает',      kaz: 'Күтуде',        eng: 'Pending',      cls: 'st-pending' },
  CONFIRMED:   { rus: 'Подтверждена', kaz: 'Расталды',      eng: 'Confirmed',    cls: 'st-confirmed' },
  IN_PROGRESS: { rus: 'В пути',       kaz: 'Жолда',         eng: 'In progress',  cls: 'st-progress' },
  COMPLETED:   { rus: 'Завершена',    kaz: 'Аяқталды',      eng: 'Completed',    cls: 'st-completed' },
  CANCELLED:   { rus: 'Отменена',     kaz: 'Бас тартылды',  eng: 'Cancelled',    cls: 'st-cancelled' },
}
const statusLabel = (s) => {
  const e = STATUS[s]
  if (!e) return s || '—'
  return lang.value === 'kaz' ? e.kaz : lang.value === 'eng' ? e.eng : e.rus
}
const statusClass = (s) => STATUS[s]?.cls || 'st-pending'

const formatDate = (d) => d
  ? new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : ''

const load = async () => {
  loading.value = true; error.value = null
  try {
    const res = await getMyBookings()
    bookings.value = Array.isArray(res) ? res : (res.items ?? [])
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) { loading.value = false; return }
  load()
})
</script>

<style scoped>
.req-header { background: linear-gradient(135deg, var(--dark) 0%, var(--primary-dark) 100%); padding: 48px 0 40px; margin-bottom: 32px; }
.page-h1 { font-size: var(--fs-3xl); font-weight: 800; color: white; margin-bottom: 8px; }
.page-desc { color: rgba(255,255,255,0.7); font-size: var(--fs-md); }
.req-content { padding-bottom: 64px; max-width: 760px; }
.req-list { display: flex; flex-direction: column; gap: 14px; }
.req-card {
  display: flex; justify-content: space-between; align-items: stretch; gap: 16px;
  background: white; border-radius: var(--radius-lg); padding: 18px 20px;
  box-shadow: var(--shadow); text-decoration: none; color: inherit;
  transition: all var(--transition); border: 1.5px solid transparent;
}
.req-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); border-color: var(--gray-200); }
.req-card-main { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.req-route { display: flex; align-items: center; gap: 10px; }
.req-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.req-dot-from { background: var(--primary); }
.req-dot-to { background: #EF4444; }
.req-addr { font-size: var(--fs-sm); color: var(--black); font-weight: 600; }
.req-meta { display: flex; gap: 14px; align-items: center; margin-top: 4px; padding-left: 20px; }
.req-date { font-size: var(--fs-xs); color: var(--gray-500); }
.req-price { font-size: var(--fs-xs); font-weight: 700; color: var(--primary); }
.req-card-side { display: flex; align-items: flex-start; }
.req-status { font-size: var(--fs-xs); font-weight: 700; padding: 4px 12px; border-radius: var(--radius-full); white-space: nowrap; }
.st-pending { background: #FEF3C7; color: #92400E; }
.st-confirmed { background: #DBEAFE; color: #1D4ED8; }
.st-progress { background: #E0E7FF; color: #4338CA; }
.st-completed { background: #D1FAE5; color: #065F46; }
.st-cancelled { background: var(--gray-100); color: var(--gray-500); }
</style>
