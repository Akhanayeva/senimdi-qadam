<template>
  <div class="admin-orgs">
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Организации</h1>
        <p class="admin-page-sub">Управление каталогом организаций</p>
      </div>
      <button class="admin-btn-primary" @click="openAddForm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Добавить организацию
      </button>
    </div>

    <!-- Filters -->
    <div class="admin-filters">
      <input
        class="admin-search"
        v-model="searchQuery"
        placeholder="Поиск по названию..."
        @input="applyFilters"
      />
      <select class="admin-select" v-model="filterStatus" @change="applyFilters">
        <option value="all">Все статусы</option>
        <option value="VERIFIED">Проверено</option>
        <option value="PENDING">На проверке</option>
      </select>
      <select class="admin-select" v-model="filterCategory" @change="applyFilters">
        <option value="all">Все категории</option>
        <option v-for="(label, val) in CATEGORY_LABELS" :key="val" :value="val">{{ label.rus }}</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="admin-loading">Загрузка...</div>

    <!-- Table -->
    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Организация</th>
            <th>Категория</th>
            <th>Район</th>
            <th>Рейтинг</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="org in filteredOrgs" :key="org.id">
            <td>
              <div class="org-cell">
                <div class="org-cell-avatar">{{ (org.nameRu || '').charAt(0) }}</div>
                <div>
                  <div class="org-cell-name">{{ org.nameRu }}</div>
                  <div class="org-cell-address">{{ org.address }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge-cat">{{ CATEGORY_LABELS[org.category]?.rus || org.category || '—' }}</span>
            </td>
            <td class="text-sm text-gray">{{ org.district || '—' }}</td>
            <td>
              <span class="rating-cell">⭐ {{ org.ratingAvg || '—' }}</span>
            </td>
            <td>
              <span class="status-badge" :class="org.status === 'VERIFIED' ? 'status-verified' : 'status-pending'">
                {{ org.status === 'VERIFIED' ? '✓ Проверено' : '⏳ Ожидает' }}
              </span>
            </td>
            <td>
              <div class="action-btns">
                <button class="action-btn action-btn-verify" v-if="org.status !== 'VERIFIED'" @click="verifyOrg(org)" title="Верифицировать">✓</button>
                <button class="action-btn action-btn-edit" @click="openEditForm(org)" title="Редактировать">✏️</button>
                <button class="action-btn action-btn-delete" @click="confirmDelete(org)" title="Удалить">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredOrgs.length === 0">
            <td colspan="6" class="empty-row">Организации не найдены</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add / Edit modal -->
    <Teleport to="body">
      <div v-if="showForm" class="admin-modal-overlay" @click.self="closeForm">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h3>{{ editTarget ? 'Редактировать организацию' : 'Добавить организацию' }}</h3>
            <button class="admin-modal-close" @click="closeForm">✕</button>
          </div>
          <div class="admin-modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Название (рус)</label>
                <input class="admin-input" v-model="form.nameRu" placeholder="Название на русском" />
              </div>
              <div class="form-group">
                <label>Название (каз)</label>
                <input class="admin-input" v-model="form.nameKk" placeholder="Атауы қазақша" />
              </div>
            </div>
            <div class="form-group">
              <label>Адрес</label>
              <input class="admin-input" v-model="form.address" placeholder="Алматы, ул. ..." />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Телефон</label>
                <input class="admin-input" v-model="form.phone" placeholder="+7 727 ..." />
              </div>
              <div class="form-group">
                <label>Район</label>
                <input class="admin-input" v-model="form.district" placeholder="Бостандыкский" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Категория</label>
                <select class="admin-input" v-model="form.category">
                  <option value="">Выберите...</option>
                  <option v-for="(label, val) in CATEGORY_LABELS" :key="val" :value="val">{{ label.rus }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Статус</label>
                <select class="admin-input" v-model="form.status">
                  <option value="PENDING">На проверке</option>
                  <option value="VERIFIED">Проверено ✓</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Описание (рус)</label>
              <textarea class="admin-input" v-model="form.description" rows="3" placeholder="Краткое описание организации"></textarea>
            </div>
            <div class="form-group">
              <label>Часы работы</label>
              <input class="admin-input" v-model="form.workingHours" placeholder="Пн–Пт 9:00–18:00" />
            </div>
          </div>
          <div class="admin-modal-footer">
            <button class="admin-btn-secondary" @click="closeForm">Отмена</button>
            <button class="admin-btn-primary" @click="saveOrg">{{ editTarget ? 'Сохранить' : 'Добавить' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrganizations } from '../../api/organizations.js'

const CATEGORY_LABELS = {
  MEDICAL:        { rus: 'Медицина' },
  LEGAL:          { rus: 'Юридическая помощь' },
  SOCIAL:         { rus: 'Социальная поддержка' },
  REHABILITATION: { rus: 'Реабилитация' },
  EDUCATION:      { rus: 'Образование' },
  EMPLOYMENT:     { rus: 'Трудоустройство' },
  SPORT:          { rus: 'Спорт' },
  CULTURE:        { rus: 'Культура' },
  PSYCHOLOGICAL:  { rus: 'Психологическая' },
  OTHER:          { rus: 'Прочее' },
}

const allOrgs = ref([])
const filteredOrgs = ref([])
const loading = ref(true)

const searchQuery = ref('')
const filterStatus = ref('all')
const filterCategory = ref('all')

const showForm = ref(false)
const editTarget = ref(null)
const form = ref(emptyForm())

function emptyForm() {
  return { nameRu: '', nameKk: '', address: '', phone: '', district: '', category: '', status: 'PENDING', description: '', workingHours: '' }
}

const loadOrgs = async () => {
  loading.value = true
  try {
    const res = await getOrganizations({ limit: 500 })
    allOrgs.value = res.items ?? res
    applyFilters()
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  let data = [...allOrgs.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    data = data.filter(o =>
      (o.nameRu || '').toLowerCase().includes(q) ||
      (o.nameKk || '').toLowerCase().includes(q) ||
      (o.address || '').toLowerCase().includes(q)
    )
  }
  if (filterStatus.value !== 'all') data = data.filter(o => o.status === filterStatus.value)
  if (filterCategory.value !== 'all') data = data.filter(o => o.category === filterCategory.value)
  filteredOrgs.value = data
}

const openAddForm = () => {
  editTarget.value = null
  form.value = emptyForm()
  showForm.value = true
}

const openEditForm = (org) => {
  editTarget.value = org
  form.value = {
    nameRu: org.nameRu || '',
    nameKk: org.nameKk || '',
    address: org.address || '',
    phone: org.phone || '',
    district: org.district || '',
    category: org.category || '',
    status: org.status || 'PENDING',
    description: org.description || '',
    workingHours: org.workingHours || '',
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editTarget.value = null
}

const saveOrg = () => {
  if (editTarget.value) {
    const idx = allOrgs.value.findIndex(o => o.id === editTarget.value.id)
    if (idx !== -1) Object.assign(allOrgs.value[idx], form.value)
  } else {
    allOrgs.value.unshift({ ...form.value, id: Date.now(), ratingAvg: 0, tags: [] })
  }
  closeForm()
  applyFilters()
}

const verifyOrg = (org) => {
  const idx = allOrgs.value.findIndex(o => o.id === org.id)
  if (idx !== -1) allOrgs.value[idx].status = 'VERIFIED'
  applyFilters()
}

const confirmDelete = (org) => {
  if (confirm(`Удалить "${org.nameRu}"?`)) {
    allOrgs.value = allOrgs.value.filter(o => o.id !== org.id)
    applyFilters()
  }
}

onMounted(loadOrgs)
</script>

<style scoped>
.admin-orgs { max-width: 1100px; }

.admin-page-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 24px; gap: 16px; flex-wrap: wrap;
}
.admin-page-title { font-size: 22px; font-weight: 800; color: #1e293b; }
.admin-page-sub { font-size: 13px; color: #64748b; margin-top: 3px; }

.admin-btn-primary {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 18px; background: #3b82f6; color: white;
  border-radius: 9px; font-size: 13.5px; font-weight: 600;
  transition: background 0.15s; cursor: pointer; border: none;
}
.admin-btn-primary:hover { background: #2563eb; }
.admin-btn-secondary {
  padding: 9px 18px; background: #f1f5f9; color: #475569;
  border-radius: 9px; font-size: 13.5px; font-weight: 600;
  transition: background 0.15s; cursor: pointer; border: none;
}
.admin-btn-secondary:hover { background: #e2e8f0; }

.admin-filters {
  display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;
}
.admin-search {
  flex: 1; min-width: 200px; padding: 9px 14px;
  border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-size: 13.5px; outline: none; background: white;
}
.admin-search:focus { border-color: #3b82f6; }
.admin-select {
  padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-size: 13.5px; outline: none; background: white; cursor: pointer;
}
.admin-select:focus { border-color: #3b82f6; }

.admin-loading { padding: 40px; text-align: center; color: #64748b; }

.admin-table-wrap { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th {
  padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700;
  color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;
  background: #f8fafc; border-bottom: 1px solid #e2e8f0;
}
.admin-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13.5px; color: #334155; }
.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: #f8fafc; }

.org-cell { display: flex; align-items: center; gap: 10px; }
.org-cell-avatar {
  width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #3b82f6;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 15px; flex-shrink: 0;
}
.org-cell-name { font-weight: 600; color: #1e293b; font-size: 13px; }
.org-cell-address { font-size: 11.5px; color: #94a3b8; margin-top: 1px; }

.badge-cat {
  font-size: 11px; padding: 3px 8px; border-radius: 20px;
  background: #f1f5f9; color: #475569; font-weight: 600; white-space: nowrap;
}
.text-sm { font-size: 13px; }
.text-gray { color: #64748b; }
.rating-cell { font-size: 13px; color: #475569; }

.status-badge {
  font-size: 11.5px; padding: 4px 10px; border-radius: 20px; font-weight: 600; white-space: nowrap;
}
.status-verified { background: #f0fdf4; color: #16a34a; }
.status-pending { background: #fefce8; color: #ca8a04; }

.action-btns { display: flex; gap: 6px; }
.action-btn {
  width: 30px; height: 30px; border-radius: 7px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; font-size: 14px;
  transition: background 0.15s;
}
.action-btn-verify { background: #f0fdf4; }
.action-btn-verify:hover { background: #dcfce7; }
.action-btn-edit { background: #eff6ff; }
.action-btn-edit:hover { background: #dbeafe; }
.action-btn-delete { background: #fef2f2; }
.action-btn-delete:hover { background: #fee2e2; }

.empty-row { text-align: center; padding: 40px !important; color: #94a3b8; }

/* Modal */
.admin-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 16px;
}
.admin-modal {
  background: white; border-radius: 14px; width: 100%; max-width: 580px;
  max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.admin-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid #e2e8f0;
}
.admin-modal-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.admin-modal-close {
  width: 30px; height: 30px; border-radius: 7px; border: none;
  background: #f1f5f9; color: #64748b; cursor: pointer; font-size: 14px;
}
.admin-modal-close:hover { background: #e2e8f0; }
.admin-modal-body { padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
.admin-modal-footer {
  padding: 16px 24px; border-top: 1px solid #e2e8f0;
  display: flex; justify-content: flex-end; gap: 10px;
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label { font-size: 12.5px; font-weight: 600; color: #475569; }
.admin-input {
  padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 13.5px; outline: none; resize: vertical; font-family: inherit;
  background: white;
}
.admin-input:focus { border-color: #3b82f6; }

@media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
</style>
