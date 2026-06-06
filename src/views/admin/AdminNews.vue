<template>
  <div class="admin-news">
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Модерация новостей</h1>
        <p class="admin-page-sub">Проверка и публикация новостей от пользователей</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="admin-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="admin-tab"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && activeTab !== 'COMMENTS'" class="admin-loading">Загрузка...</div>

    <!-- Comments moderation tab -->
    <div v-else-if="activeTab === 'COMMENTS'">
      <div v-if="commentsLoading" class="admin-loading">Загрузка...</div>
      <div v-else-if="pendingComments.length === 0" class="empty-state">
        <div style="font-size:36px">💬</div>
        <p>Нет комментариев на модерации</p>
      </div>
      <div v-else class="comments-moderation-list">
        <div v-for="c in pendingComments" :key="c.id" class="comment-mod-card">
          <div class="comment-mod-header">
            <div class="comment-mod-author">
              <div class="author-avatar">{{ (c.author?.profile?.firstName || '?').charAt(0) }}</div>
              <div>
                <div class="author-name">{{ c.author?.profile?.firstName || c.author?.email || 'Пользователь' }}</div>
                <div class="news-date">{{ formatDate(c.createdAt) }}</div>
              </div>
            </div>
            <span class="status-badge status-pending">⏳ Ожидает</span>
          </div>
          <p class="comment-mod-text">{{ c.text }}</p>
          <div v-if="c.news" class="comment-mod-news">
            📰 {{ c.news.titleRu || 'Новость' }}
          </div>
          <div class="comment-mod-actions">
            <button class="admin-action-btn btn-approve" :disabled="moderatingId===c.id" @click="handleModerateComment(c, 'PUBLISHED')">✓ Одобрить</button>
            <button class="admin-action-btn btn-reject" :disabled="moderatingId===c.id" @click="handleModerateComment(c, 'REJECTED')">✕ Отклонить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- News list -->
    <div v-else class="news-list">
      <div v-if="filteredNews.length === 0" class="empty-state">
        <div style="font-size: 36px">📭</div>
        <p>Нет новостей в этом разделе</p>
      </div>
      <div v-else class="news-card" v-for="item in filteredNews" :key="item.id">
        <div class="news-card-top">
          <div class="news-meta">
            <div class="news-author">
              <div class="author-avatar">{{ item.author?.profile?.firstName?.charAt(0) || 'П' }}</div>
              <div>
                <div class="author-name">{{ item.author?.profile?.firstName || 'Пользователь' }}</div>
                <div class="news-date">{{ formatDate(item.createdAt) }}</div>
              </div>
            </div>
            <span class="status-badge" :class="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
          </div>
          <h3 class="news-title">{{ item.titleRu }}</h3>
          <p class="news-body">{{ item.bodyRu }}</p>
          <div v-if="item.rejectReason" class="reject-reason">
            💬 Причина отказа: {{ item.rejectReason }}
          </div>
        </div>
        <div class="news-card-actions">
          <div class="news-stats">
            <span>❤️ {{ item.likesCount || 0 }}</span>
            <span>💬 {{ item.commentsCount || 0 }}</span>
          </div>
          <div class="action-btns">
            <button
              v-if="item.status !== 'PUBLISHED'"
              class="admin-action-btn btn-approve"
              @click="setStatus(item, 'PUBLISHED')"
            >✓ Опубликовать</button>
            <button
              v-if="item.status === 'PUBLISHED'"
              class="admin-action-btn btn-unpublish"
              @click="setStatus(item, 'DRAFT')"
            >⏸ Снять</button>
            <button
              v-if="item.status !== 'REJECTED'"
              class="admin-action-btn btn-reject"
              @click="openRejectModal(item)"
            >✕ Отклонить</button>
            <button
              v-if="authStore.isAdmin"
              class="admin-action-btn btn-delete"
              @click="deleteItem(item)"
            >🗑 Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject modal -->
    <Transition name="fade">
      <div v-if="rejectModal" class="modal-overlay" @click.self="rejectModal=false">
        <div class="modal-card">
          <button class="modal-close" @click="rejectModal=false">✕</button>
          <h3>Отклонить новость</h3>
          <p class="modal-sub">«{{ rejectTarget?.titleRu }}»</p>
          <div class="form-group">
            <label class="form-label">Причина (необязательно)</label>
            <textarea
              v-model="rejectReason"
              class="form-input"
              rows="3"
              placeholder="Укажите причину отклонения..."
            ></textarea>
          </div>
          <div class="modal-actions">
            <button class="admin-action-btn btn-unpublish" @click="rejectModal=false">Отмена</button>
            <button class="admin-action-btn btn-reject" @click="confirmReject">✕ Отклонить</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { adminGetNews, adminModerateNews, adminDeleteNews } from '../../api/admin.js'
import { getPendingComments, moderateComment } from '../../api/news.js'
import { useAuthStore } from '../../stores/auth.js'

const authStore = useAuthStore()
const allNews = ref([])
const loading = ref(true)
const activeTab = ref('PENDING')
const rejectModal = ref(false)
const rejectTarget = ref(null)
const rejectReason = ref('')

const tabs = computed(() => [
  { label: 'На модерации', value: 'PENDING', count: allNews.value.filter(n => n.status === 'PENDING').length || null },
  { label: 'Опубликованные', value: 'PUBLISHED', count: null },
  { label: 'Отклонённые', value: 'REJECTED', count: null },
  { label: 'Все', value: 'ALL', count: null },
  { label: 'Комментарии', value: 'COMMENTS', count: pendingComments.value.length || null },
])

const filteredNews = computed(() => {
  if (activeTab.value === 'ALL') return allNews.value
  return allNews.value.filter(n => n.status === activeTab.value)
})

const loadNews = async () => {
  loading.value = true
  try {
    const res = await adminGetNews({ limit: 200 })
    allNews.value = res.items ?? res
  } finally {
    loading.value = false
  }
}

const setStatus = async (item, status) => {
  try {
    await adminModerateNews(item.id, status)
    const idx = allNews.value.findIndex(n => n.id === item.id)
    if (idx !== -1) {
      allNews.value[idx] = { ...allNews.value[idx], status, publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null }
    }
  } catch (e) {
    alert('Ошибка: ' + (e.message || 'не удалось изменить статус'))
  }
}

const openRejectModal = (item) => {
  rejectTarget.value = item
  rejectReason.value = ''
  rejectModal.value = true
}

const confirmReject = async () => {
  if (!rejectTarget.value) return
  try {
    await adminModerateNews(rejectTarget.value.id, 'REJECTED', rejectReason.value || undefined)
    const idx = allNews.value.findIndex(n => n.id === rejectTarget.value.id)
    if (idx !== -1) allNews.value[idx] = { ...allNews.value[idx], status: 'REJECTED', rejectReason: rejectReason.value }
    rejectModal.value = false
  } catch (e) {
    alert('Ошибка: ' + (e.message || 'не удалось отклонить'))
  }
}

const deleteItem = async (item) => {
  if (!confirm(`Удалить новость "${item.titleRu}"?`)) return
  try {
    await adminDeleteNews(item.id)
    allNews.value = allNews.value.filter(n => n.id !== item.id)
  } catch (e) {
    alert('Ошибка удаления: ' + (e.message || ''))
  }
}

const statusLabel = (status) => {
  const map = { PUBLISHED: '✓ Опубликовано', PENDING: '⏳ На модерации', DRAFT: 'Черновик', REJECTED: '✕ Отклонено' }
  return map[status] || status
}
const statusClass = (status) => {
  const map = { PUBLISHED: 'status-published', PENDING: 'status-pending', DRAFT: 'status-draft', REJECTED: 'status-rejected' }
  return map[status] || ''
}
const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ── Comments moderation ───────────────────────────────────────────────────────
const pendingComments = ref([])
const commentsLoading = ref(false)
const moderatingId = ref(null)

async function loadComments() {
  commentsLoading.value = true
  try {
    const res = await getPendingComments(50, 0)
    pendingComments.value = res.items ?? res ?? []
  } catch {} finally { commentsLoading.value = false }
}

async function handleModerateComment(comment, status) {
  moderatingId.value = comment.id
  try {
    await moderateComment(comment.id, status)
    pendingComments.value = pendingComments.value.filter(c => c.id !== comment.id)
  } catch (e) {
    alert('Ошибка: ' + (e.message || ''))
  } finally { moderatingId.value = null }
}

watch(activeTab, (val) => {
  if (val === 'COMMENTS') loadComments()
})

onMounted(() => {
  loadNews()
  loadComments() // preload to show count in tab
})
</script>

<style scoped>
.admin-news { max-width: 900px; }
.admin-page-header { margin-bottom: 20px; }
.admin-page-title { font-size: 22px; font-weight: 800; color: #1e293b; }
.admin-page-sub { font-size: 13px; color: #64748b; margin-top: 3px; }

.admin-tabs { display: flex; gap: 4px; background: white; padding: 6px; border-radius: 11px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); width: fit-content; }
.admin-tab {
  display: flex; align-items: center; gap: 6px; padding: 8px 16px;
  border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600;
  color: #64748b; background: transparent; transition: all 0.15s;
}
.admin-tab:hover { background: #f1f5f9; color: #1e293b; }
.admin-tab.active { background: #3b82f6; color: white; }
.tab-count { background: #ef4444; color: white; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 10px; min-width: 18px; text-align: center; }
.admin-tab.active .tab-count { background: rgba(255,255,255,0.3); }

.admin-loading { padding: 40px; text-align: center; color: #64748b; }
.empty-state { text-align: center; padding: 60px; color: #94a3b8; font-size: 14px; }
.empty-state p { margin-top: 10px; }

.news-list { display: flex; flex-direction: column; gap: 14px; }
.news-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.news-card-top { padding: 18px 20px; }
.news-card-actions { padding: 12px 20px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }

.news-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.news-author { display: flex; align-items: center; gap: 10px; }
.author-avatar { width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; color: #3b82f6; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
.author-name { font-size: 13px; font-weight: 600; color: #334155; }
.news-date { font-size: 11.5px; color: #94a3b8; margin-top: 1px; }
.news-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px; line-height: 1.4; }
.news-body { font-size: 13.5px; color: #64748b; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.reject-reason { margin-top: 10px; font-size: 12.5px; color: #dc2626; background: #fef2f2; padding: 8px 12px; border-radius: 8px; }

.news-stats { display: flex; gap: 12px; font-size: 13px; color: #64748b; }
.action-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.admin-action-btn { padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer; font-size: 12.5px; font-weight: 600; transition: all 0.15s; }
.btn-approve { background: #f0fdf4; color: #16a34a; }
.btn-approve:hover { background: #dcfce7; }
.btn-unpublish { background: #fefce8; color: #ca8a04; }
.btn-unpublish:hover { background: #fef9c3; }
.btn-reject { background: #fef2f2; color: #dc2626; }
.btn-reject:hover { background: #fee2e2; }
.btn-delete { background: #f1f5f9; color: #64748b; }
.btn-delete:hover { background: #e2e8f0; }

.status-badge { font-size: 11.5px; padding: 4px 10px; border-radius: 20px; font-weight: 600; white-space: nowrap; }
.status-published { background: #f0fdf4; color: #16a34a; }
.status-pending { background: #fefce8; color: #ca8a04; }
.status-draft { background: #f1f5f9; color: #64748b; }
.status-rejected { background: #fef2f2; color: #dc2626; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal-card { background: white; border-radius: 14px; padding: 28px; max-width: 440px; width: 100%; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
.modal-close { position: absolute; top: 14px; right: 14px; color: #94a3b8; font-size: 16px; cursor: pointer; background: none; border: none; }
.modal-card h3 { font-size: 17px; font-weight: 800; margin-bottom: 4px; }
.modal-sub { font-size: 13px; color: #64748b; margin-bottom: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; }
.form-input { border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; font-size: 13.5px; outline: none; resize: vertical; }
.form-input:focus { border-color: #3b82f6; }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Comments moderation */
.comments-moderation-list { display: flex; flex-direction: column; gap: 12px; }
.comment-mod-card { background: white; border-radius: 12px; padding: 16px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.comment-mod-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.comment-mod-author { display: flex; align-items: center; gap: 10px; }
.comment-mod-text { font-size: 14px; color: #1e293b; line-height: 1.6; margin-bottom: 10px; padding: 10px 12px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #e2e8f0; }
.comment-mod-news { font-size: 12px; color: #64748b; margin-bottom: 12px; padding: 4px 8px; background: #f1f5f9; border-radius: 6px; display: inline-block; }
.comment-mod-actions { display: flex; gap: 8px; }
</style>
