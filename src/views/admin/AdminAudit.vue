<template>
  <div class="admin-audit">
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Журнал действий</h1>
        <p class="admin-page-sub">История всех действий администраторов и модераторов</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="audit-filters">
      <select v-model="filters.targetType" class="filter-select" @change="load">
        <option value="">Все типы</option>
        <option value="User">Пользователи</option>
        <option value="Organization">Организации</option>
        <option value="News">Новости</option>
        <option value="Ticket">Тикеты</option>
        <option value="Complaint">Жалобы</option>
      </select>
      <select v-model="filters.action" class="filter-select" @change="load">
        <option value="">Все действия</option>
        <option value="CREATE">Создание</option>
        <option value="UPDATE">Изменение</option>
        <option value="DELETE">Удаление</option>
        <option value="BAN">Блокировка</option>
        <option value="VERIFY">Верификация</option>
        <option value="MODERATE">Модерация</option>
      </select>
      <button class="btn-refresh" @click="load">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Обновить
      </button>
    </div>

    <div v-if="loading" class="admin-loading">Загрузка...</div>

    <div v-else-if="logs.length === 0" class="empty-state">
      <div style="font-size:36px">📋</div>
      <p>Нет записей в журнале</p>
    </div>

    <div v-else class="audit-list">
      <div v-for="log in logs" :key="log.id" class="audit-card">
        <div class="audit-card-left">
          <div class="audit-action-badge" :class="actionClass(log.action)">{{ actionLabel(log.action) }}</div>
        </div>
        <div class="audit-card-body">
          <div class="audit-main">
            <span class="audit-actor">{{ log.actor?.profile?.firstName || log.actor?.email || 'Неизвестно' }}</span>
            <span class="audit-sep">→</span>
            <span class="audit-target-type">{{ log.targetType }}</span>
            <span v-if="log.targetId" class="audit-target-id">{{ log.targetId.slice(0, 8) }}…</span>
          </div>
          <div v-if="log.note" class="audit-note">{{ log.note }}</div>
          <div class="audit-meta">
            <span>📅 {{ formatDate(log.createdAt) }}</span>
            <span v-if="log.actor?.role" class="audit-role">{{ log.actor.role }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Load more -->
    <div v-if="logs.length > 0 && !loading" class="audit-load-more">
      <button class="btn-load-more" :disabled="loadingMore" @click="loadMore">
        <span v-if="loadingMore" class="spinner-sm-dark"></span>
        {{ loadingMore ? 'Загрузка...' : 'Загрузить ещё' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuditLogs } from '../../api/admin.js'

const logs = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const cursor = ref(null)
const filters = ref({ targetType: '', action: '' })

const load = async () => {
  loading.value = true
  cursor.value = null
  try {
    const res = await getAuditLogs({ ...filters.value, limit: 30 })
    logs.value = res.items ?? res ?? []
    cursor.value = res.nextCursor ?? null
  } finally { loading.value = false }
}

const loadMore = async () => {
  if (!cursor.value) return
  loadingMore.value = true
  try {
    const res = await getAuditLogs({ ...filters.value, limit: 30, cursor: cursor.value })
    logs.value = [...logs.value, ...(res.items ?? res ?? [])]
    cursor.value = res.nextCursor ?? null
  } finally { loadingMore.value = false }
}

const actionLabel = (a) => ({
  CREATE: 'Создание', UPDATE: 'Изменение', DELETE: 'Удаление',
  BAN: 'Блокировка', VERIFY: 'Верификация', MODERATE: 'Модерация',
}[a] || a)

const actionClass = (a) => ({
  CREATE: 'action-create', UPDATE: 'action-update', DELETE: 'action-delete',
  BAN: 'action-ban', VERIFY: 'action-verify', MODERATE: 'action-moderate',
}[a] || '')

const formatDate = (iso) => iso
  ? new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—'

onMounted(load)
</script>

<style scoped>
.admin-audit { max-width: 860px; }
.admin-page-header { margin-bottom: 20px; }
.admin-page-title { font-size: 22px; font-weight: 800; color: #1e293b; }
.admin-page-sub { font-size: 13px; color: #64748b; margin-top: 3px; }

.audit-filters { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
.filter-select { padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-weight: 600; outline: none; background: white; cursor: pointer; }
.btn-refresh { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; font-size: 13px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.15s; }
.btn-refresh:hover { background: #f1f5f9; color: #1e293b; }

.admin-loading { padding: 40px; text-align: center; color: #64748b; }
.empty-state { text-align: center; padding: 60px; color: #94a3b8; font-size: 14px; background: white; border-radius: 12px; }
.empty-state p { margin-top: 10px; }

.audit-list { display: flex; flex-direction: column; gap: 8px; }
.audit-card { display: flex; gap: 14px; background: white; border-radius: 10px; padding: 14px 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); align-items: flex-start; }
.audit-card-left { flex-shrink: 0; }
.audit-action-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }
.action-create  { background: #f0fdf4; color: #16a34a; }
.action-update  { background: #eff6ff; color: #2563eb; }
.action-delete  { background: #fee2e2; color: #dc2626; }
.action-ban     { background: #fef2f2; color: #991b1b; }
.action-verify  { background: #f0fdf4; color: #065f46; }
.action-moderate{ background: #fefce8; color: #ca8a04; }

.audit-card-body { flex: 1; min-width: 0; }
.audit-main { display: flex; align-items: center; gap: 6px; font-size: 13.5px; flex-wrap: wrap; margin-bottom: 4px; }
.audit-actor { font-weight: 700; color: #1e293b; }
.audit-sep { color: #94a3b8; }
.audit-target-type { font-weight: 600; color: #3b82f6; }
.audit-target-id { font-family: monospace; font-size: 12px; color: #94a3b8; }
.audit-note { font-size: 12.5px; color: #475569; line-height: 1.5; margin-bottom: 6px; }
.audit-meta { display: flex; gap: 12px; font-size: 12px; color: #94a3b8; }
.audit-role { background: #f1f5f9; color: #475569; padding: 1px 6px; border-radius: 20px; font-weight: 600; }

.audit-load-more { text-align: center; margin-top: 20px; }
.btn-load-more { padding: 10px 28px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: white; font-size: 13px; font-weight: 700; color: #3b82f6; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 8px; }
.btn-load-more:hover { background: #eff6ff; }
.btn-load-more:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner-sm-dark { width: 13px; height: 13px; border: 2px solid #dbeafe; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
