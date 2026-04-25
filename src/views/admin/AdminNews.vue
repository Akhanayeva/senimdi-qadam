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
    <div v-if="loading" class="admin-loading">Загрузка...</div>

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
              @click="setStatus(item, 'REJECTED')"
            >✕ Отклонить</button>
            <button class="admin-action-btn btn-delete" @click="deleteItem(item)">🗑 Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getNews } from '../../api/news.js'

const allNews = ref([])
const loading = ref(true)
const activeTab = ref('PENDING')

const tabs = computed(() => [
  { label: 'На модерации', value: 'PENDING', count: allNews.value.filter(n => n.status === 'PENDING').length || null },
  { label: 'Опубликованные', value: 'PUBLISHED', count: null },
  { label: 'Отклонённые', value: 'REJECTED', count: null },
  { label: 'Все', value: 'ALL', count: null },
])

const filteredNews = computed(() => {
  if (activeTab.value === 'ALL') return allNews.value
  return allNews.value.filter(n => n.status === activeTab.value)
})

const loadNews = async () => {
  loading.value = true
  try {
    const res = await getNews({ limit: 200 })
    allNews.value = res.items ?? res
  } finally {
    loading.value = false
  }
}

const setStatus = (item, status) => {
  const idx = allNews.value.findIndex(n => n.id === item.id)
  if (idx !== -1) {
    allNews.value[idx] = { ...allNews.value[idx], status, publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null }
  }
}

const deleteItem = (item) => {
  if (confirm(`Удалить новость "${item.titleRu}"?`)) {
    allNews.value = allNews.value.filter(n => n.id !== item.id)
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

onMounted(loadNews)
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
.tab-count {
  background: #ef4444; color: white; font-size: 11px; font-weight: 700;
  padding: 1px 6px; border-radius: 10px; min-width: 18px; text-align: center;
}
.admin-tab.active .tab-count { background: rgba(255,255,255,0.3); }

.admin-loading { padding: 40px; text-align: center; color: #64748b; }
.empty-state { text-align: center; padding: 60px; color: #94a3b8; font-size: 14px; }
.empty-state p { margin-top: 10px; }

.news-list { display: flex; flex-direction: column; gap: 14px; }
.news-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.news-card-top { padding: 18px 20px; }
.news-card-actions {
  padding: 12px 20px; border-top: 1px solid #f1f5f9;
  display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;
}

.news-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.news-author { display: flex; align-items: center; gap: 10px; }
.author-avatar {
  width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; color: #3b82f6;
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;
}
.author-name { font-size: 13px; font-weight: 600; color: #334155; }
.news-date { font-size: 11.5px; color: #94a3b8; margin-top: 1px; }
.news-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px; line-height: 1.4; }
.news-body {
  font-size: 13.5px; color: #64748b; line-height: 1.6;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}

.news-stats { display: flex; gap: 12px; font-size: 13px; color: #64748b; }
.action-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.admin-action-btn {
  padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer;
  font-size: 12.5px; font-weight: 600; transition: all 0.15s;
}
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
</style>
