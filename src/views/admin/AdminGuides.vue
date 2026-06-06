<template>
  <div class="admin-guides">
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Гайды</h1>
        <p class="admin-page-sub">Управление обучающими материалами и руководствами</p>
      </div>
      <button class="btn-create" @click="openCreate">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Создать гайд
      </button>
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

    <div v-if="loading" class="admin-loading">Загрузка...</div>

    <div v-else-if="filteredGuides.length === 0" class="empty-state">
      <div style="font-size:36px">📚</div>
      <p>Нет гайдов в этом разделе</p>
    </div>

    <div v-else class="guides-list">
      <div v-for="guide in filteredGuides" :key="guide.id" class="guide-card">
        <div class="guide-card-top">
          <div class="guide-meta">
            <span class="guide-category">{{ guide.category || 'Без категории' }}</span>
            <span class="status-badge" :class="guide.publishedAt ? 'status-published' : 'status-draft'">
              {{ guide.publishedAt ? '✓ Опубликован' : 'Черновик' }}
            </span>
          </div>
          <h3 class="guide-title">{{ guide.titleRu || guide.titleKaz || 'Без названия' }}</h3>
          <p class="guide-body">{{ guide.contentRu || guide.contentKaz || '' }}</p>
          <div class="guide-footer-meta">
            <span>📅 {{ formatDate(guide.createdAt) }}</span>
            <span v-if="guide.author?.profile?.firstName">
              👤 {{ guide.author.profile.firstName }}
            </span>
          </div>
        </div>
        <div class="guide-card-actions">
          <button
            v-if="!guide.publishedAt"
            class="admin-action-btn btn-approve"
            :disabled="processingId === guide.id"
            @click="togglePublish(guide)"
          >✓ Опубликовать</button>
          <button
            v-else
            class="admin-action-btn btn-unpublish"
            :disabled="processingId === guide.id"
            @click="togglePublish(guide)"
          >⏸ Снять с публикации</button>
        </div>
      </div>
    </div>

    <!-- Create modal -->
    <Transition name="fade">
      <div v-if="createModal" class="modal-overlay" @click.self="createModal=false">
        <div class="modal-card">
          <button class="modal-close" @click="createModal=false">✕</button>
          <h3>Новый гайд</h3>
          <p class="modal-sub">Заполните основные поля</p>

          <div class="form-group">
            <label class="form-label">Заголовок (RU) *</label>
            <input v-model="form.titleRu" class="form-input" placeholder="Название гайда..." />
          </div>
          <div class="form-group">
            <label class="form-label">Заголовок (KZ)</label>
            <input v-model="form.titleKaz" class="form-input" placeholder="Атауы..." />
          </div>
          <div class="form-group">
            <label class="form-label">Категория</label>
            <select v-model="form.category" class="form-input">
              <option value="">— Выберите —</option>
              <option value="HEALTH">Здоровье</option>
              <option value="EDUCATION">Образование</option>
              <option value="RIGHTS">Права</option>
              <option value="TECH">Технологии</option>
              <option value="OTHER">Другое</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Содержание (RU) *</label>
            <textarea v-model="form.contentRu" class="form-input" rows="5" placeholder="Текст гайда..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Содержание (KZ)</label>
            <textarea v-model="form.contentKaz" class="form-input" rows="3" placeholder="Мәтін..."></textarea>
          </div>

          <div v-if="createError" class="form-error">{{ createError }}</div>

          <div class="modal-actions">
            <button class="admin-action-btn btn-unpublish" @click="createModal=false">Отмена</button>
            <button class="admin-action-btn btn-approve" :disabled="createLoading" @click="submitCreate">
              <span v-if="createLoading" class="spinner-sm"></span>
              {{ createLoading ? 'Сохранение...' : '✓ Создать' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getGuides, createGuide, publishGuide, unpublishGuide } from '../../api/guides.js'

const allGuides = ref([])
const loading = ref(true)
const processingId = ref(null)
const activeTab = ref('DRAFT')

const createModal = ref(false)
const createLoading = ref(false)
const createError = ref('')
const form = ref({ titleRu: '', titleKaz: '', contentRu: '', contentKaz: '', category: '' })

const tabs = computed(() => [
  { label: 'Черновики', value: 'DRAFT', count: allGuides.value.filter(g => !g.publishedAt).length || null },
  { label: 'Опубликованные', value: 'PUBLISHED', count: null },
  { label: 'Все', value: 'ALL', count: null },
])

const filteredGuides = computed(() => {
  if (activeTab.value === 'ALL') return allGuides.value
  if (activeTab.value === 'PUBLISHED') return allGuides.value.filter(g => !!g.publishedAt)
  return allGuides.value.filter(g => !g.publishedAt)
})

const load = async () => {
  loading.value = true
  try {
    const res = await getGuides({ limit: 200 })
    allGuides.value = res.items ?? res ?? []
  } finally {
    loading.value = false
  }
}

const togglePublish = async (guide) => {
  processingId.value = guide.id
  try {
    if (guide.publishedAt) {
      await unpublishGuide(guide.id)
      const idx = allGuides.value.findIndex(g => g.id === guide.id)
      if (idx !== -1) allGuides.value[idx] = { ...allGuides.value[idx], publishedAt: null }
    } else {
      const updated = await publishGuide(guide.id)
      const idx = allGuides.value.findIndex(g => g.id === guide.id)
      if (idx !== -1) allGuides.value[idx] = { ...allGuides.value[idx], publishedAt: updated?.publishedAt || new Date().toISOString() }
    }
  } catch (e) {
    alert('Ошибка: ' + (e.message || 'не удалось изменить статус'))
  } finally {
    processingId.value = null
  }
}

const openCreate = () => {
  form.value = { titleRu: '', titleKaz: '', contentRu: '', contentKaz: '', category: '' }
  createError.value = ''
  createModal.value = true
}

const submitCreate = async () => {
  if (!form.value.titleRu.trim()) { createError.value = 'Укажите заголовок'; return }
  if (!form.value.contentRu.trim()) { createError.value = 'Укажите содержание'; return }
  createLoading.value = true
  createError.value = ''
  try {
    const newGuide = await createGuide({
      titleRu: form.value.titleRu.trim(),
      titleKaz: form.value.titleKaz.trim() || undefined,
      contentRu: form.value.contentRu.trim(),
      contentKaz: form.value.contentKaz.trim() || undefined,
      category: form.value.category || undefined,
    })
    allGuides.value.unshift(newGuide)
    createModal.value = false
  } catch (e) {
    createError.value = e.message || 'Ошибка при создании'
  } finally {
    createLoading.value = false
  }
}

const formatDate = (iso) => iso
  ? new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
  : '—'

onMounted(load)
</script>

<style scoped>
.admin-guides { max-width: 900px; }
.admin-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 12px; }
.admin-page-title { font-size: 22px; font-weight: 800; color: #1e293b; }
.admin-page-sub { font-size: 13px; color: #64748b; margin-top: 3px; }

.btn-create { display: flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 9px; border: none; background: #3b82f6; color: white; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
.btn-create:hover { background: #2563eb; }

.admin-tabs { display: flex; gap: 4px; background: white; padding: 6px; border-radius: 11px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); width: fit-content; }
.admin-tab { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; color: #64748b; background: transparent; transition: all 0.15s; }
.admin-tab:hover { background: #f1f5f9; color: #1e293b; }
.admin-tab.active { background: #3b82f6; color: white; }
.tab-count { background: #ef4444; color: white; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 10px; min-width: 18px; text-align: center; }
.admin-tab.active .tab-count { background: rgba(255,255,255,0.3); }

.admin-loading { padding: 40px; text-align: center; color: #64748b; }
.empty-state { text-align: center; padding: 60px; color: #94a3b8; font-size: 14px; background: white; border-radius: 12px; }
.empty-state p { margin-top: 10px; }

.guides-list { display: flex; flex-direction: column; gap: 14px; }
.guide-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.guide-card-top { padding: 18px 20px; }
.guide-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.guide-category { font-size: 11.5px; font-weight: 700; color: #7c3aed; background: #f5f3ff; padding: 3px 9px; border-radius: 20px; }
.guide-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px; line-height: 1.4; }
.guide-body { font-size: 13.5px; color: #64748b; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px; }
.guide-footer-meta { display: flex; gap: 14px; font-size: 12px; color: #94a3b8; }
.guide-card-actions { padding: 12px 20px; border-top: 1px solid #f1f5f9; display: flex; gap: 8px; justify-content: flex-end; }

.status-badge { font-size: 11.5px; padding: 4px 10px; border-radius: 20px; font-weight: 600; white-space: nowrap; }
.status-published { background: #f0fdf4; color: #16a34a; }
.status-draft { background: #f1f5f9; color: #64748b; }

.admin-action-btn { padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer; font-size: 12.5px; font-weight: 600; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; }
.admin-action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-approve { background: #f0fdf4; color: #16a34a; }
.btn-approve:hover:not(:disabled) { background: #dcfce7; }
.btn-unpublish { background: #fefce8; color: #ca8a04; }
.btn-unpublish:hover:not(:disabled) { background: #fef9c3; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal-card { background: white; border-radius: 14px; padding: 28px; max-width: 520px; width: 100%; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; }
.modal-close { position: absolute; top: 14px; right: 14px; color: #94a3b8; font-size: 16px; cursor: pointer; background: none; border: none; }
.modal-card h3 { font-size: 17px; font-weight: 800; margin-bottom: 4px; }
.modal-sub { font-size: 13px; color: #64748b; margin-bottom: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.form-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; }
.form-input { border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; font-size: 13.5px; outline: none; resize: vertical; width: 100%; box-sizing: border-box; }
.form-input:focus { border-color: #3b82f6; }
.form-error { color: #dc2626; font-size: 13px; margin-bottom: 12px; }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }

.spinner-sm { width: 12px; height: 12px; border: 2px solid #d1fae5; border-top-color: #16a34a; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
