<template>
  <div class="admin-complaints">
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Жалобы</h1>
        <p class="admin-page-sub">Жалобы пользователей на организации и новости</p>
      </div>
    </div>

    <div class="admin-tabs">
      <button
        v-for="tab in tabs" :key="tab.value"
        class="admin-tab" :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <div v-if="loading" class="admin-loading">Загрузка...</div>

    <div v-else-if="filtered.length === 0" class="empty-state">
      <div style="font-size:36px">🔕</div>
      <p>Нет жалоб в этом разделе</p>
    </div>

    <div v-else class="complaints-list">
      <div v-for="c in filtered" :key="c.id" class="complaint-card">
        <div class="complaint-header">
          <div class="complaint-target">
            <span class="target-badge">{{ targetLabel(c.targetType) }}</span>
            <span class="complaint-reason">{{ c.reason }}</span>
          </div>
          <span class="status-badge" :class="statusClass(c.status)">{{ statusLabel(c.status) }}</span>
        </div>
        <div v-if="c.description" class="complaint-desc">{{ c.description }}</div>
        <div class="complaint-footer">
          <div class="complaint-meta">
            <span>👤 {{ c.user?.profile?.firstName || c.user?.email || 'Пользователь' }}</span>
            <span>📅 {{ formatDate(c.createdAt) }}</span>
          </div>
          <div class="complaint-actions">
            <select
              class="status-select"
              :value="c.status"
              @change="setStatus(c, $event.target.value)"
            >
              <option value="OPEN">Открыта</option>
              <option value="UNDER_REVIEW">На рассмотрении</option>
              <option value="RESOLVED">Решена</option>
              <option value="DISMISSED">Отклонена</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminGetComplaints, adminSetComplaintStatus } from '../../api/admin.js'

const complaints = ref([])
const loading = ref(true)
const activeTab = ref('OPEN')

const tabs = computed(() => [
  { label: 'Открытые', value: 'OPEN', count: complaints.value.filter(c => c.status === 'OPEN').length || null },
  { label: 'На рассмотрении', value: 'UNDER_REVIEW', count: complaints.value.filter(c => c.status === 'UNDER_REVIEW').length || null },
  { label: 'Решённые', value: 'RESOLVED', count: null },
  { label: 'Все', value: 'ALL', count: null },
])

const filtered = computed(() => {
  const data = activeTab.value === 'ALL'
    ? [...complaints.value]
    : complaints.value.filter(c => c.status === activeTab.value)
  return data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
})

const load = async () => {
  loading.value = true
  try {
    const res = await adminGetComplaints(200)
    complaints.value = res.items ?? res
  } finally {
    loading.value = false
  }
}

const setStatus = async (complaint, status) => {
  try {
    await adminSetComplaintStatus(complaint.id, status)
    const idx = complaints.value.findIndex(c => c.id === complaint.id)
    if (idx !== -1) complaints.value[idx] = { ...complaints.value[idx], status }
  } catch (e) {
    alert('Ошибка: ' + (e.message || ''))
  }
}

const statusLabel = (s) => ({ OPEN: 'Открыта', UNDER_REVIEW: 'На рассмотрении', RESOLVED: '✓ Решена', DISMISSED: 'Отклонена' }[s] || s)
const statusClass = (s) => ({ OPEN: 'badge-open', UNDER_REVIEW: 'badge-inprogress', RESOLVED: 'badge-resolved', DISMISSED: 'badge-closed' }[s] || '')
const targetLabel = (t) => ({ Organization: '🏢 Организация', News: '📰 Новость', User: '👤 Пользователь' }[t] || t)
const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

onMounted(load)
</script>

<style scoped>
.admin-complaints { max-width: 860px; }
.admin-page-header { margin-bottom: 20px; }
.admin-page-title { font-size: 22px; font-weight: 800; color: #1e293b; }
.admin-page-sub { font-size: 13px; color: #64748b; margin-top: 3px; }

.admin-tabs { display: flex; gap: 4px; background: white; padding: 6px; border-radius: 11px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); width: fit-content; }
.admin-tab { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; color: #64748b; background: transparent; transition: all 0.15s; }
.admin-tab:hover { background: #f1f5f9; color: #1e293b; }
.admin-tab.active { background: #3b82f6; color: white; }
.tab-count { background: #ef4444; color: white; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
.admin-tab.active .tab-count { background: rgba(255,255,255,0.3); }

.admin-loading { padding: 40px; text-align: center; color: #64748b; }
.empty-state { text-align: center; padding: 60px; color: #94a3b8; font-size: 14px; background: white; border-radius: 12px; }
.empty-state p { margin-top: 10px; }

.complaints-list { display: flex; flex-direction: column; gap: 12px; }
.complaint-card { background: white; border-radius: 12px; padding: 18px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.complaint-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
.complaint-target { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.target-badge { font-size: 12px; font-weight: 700; color: #6366f1; background: #eef2ff; padding: 3px 9px; border-radius: 20px; }
.complaint-reason { font-size: 14px; font-weight: 700; color: #1e293b; }
.complaint-desc { font-size: 13.5px; color: #475569; line-height: 1.6; margin-bottom: 14px; }
.complaint-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.complaint-meta { display: flex; gap: 16px; font-size: 12.5px; color: #94a3b8; }

.status-select { padding: 6px 10px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 12.5px; font-weight: 600; outline: none; cursor: pointer; background: white; }

.status-badge { font-size: 11.5px; padding: 4px 10px; border-radius: 20px; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
.badge-open { background: #fefce8; color: #ca8a04; }
.badge-inprogress { background: #eff6ff; color: #3b82f6; }
.badge-resolved { background: #f0fdf4; color: #16a34a; }
.badge-closed { background: #f1f5f9; color: #64748b; }
</style>
