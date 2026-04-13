<template>
  <main class="page-content">
    <div class="orgs-page">
      <!-- Page header -->
      <div class="orgs-page-header">
        <div class="container">
          <div class="orgs-page-top">
            <div>
              <h1 class="orgs-page-title">{{ t('allOrgs') }}</h1>
              <p class="orgs-page-subtitle">Каталог организаций, центров и фондов Алматы для людей с инвалидностью</p>
            </div>
            <button v-if="authStore.isAdmin" class="btn btn-primary" @click="showAddForm = true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Добавить организацию
            </button>
          </div>

          <!-- Search + Filters -->
          <div class="orgs-filters">
            <div class="search-wrapper orgs-search">
              <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="searchQuery"
                class="search-input"
                :placeholder="t('searchOrgs')"
                @input="applyFilters"
                aria-label="Поиск организаций"
              />
              <button v-if="searchQuery" class="search-clear" @click="searchQuery=''; applyFilters()">✕</button>
            </div>

            <div class="filter-tabs">
              <button
                v-for="cat in categories"
                :key="cat.value"
                class="filter-tab"
                :class="{ active: activeCategory === cat.value }"
                @click="activeCategory = cat.value; applyFilters()"
              >{{ cat.label }}</button>
            </div>

            <div class="filter-row">
              <select class="form-input filter-select" v-model="activeDistrict" @change="applyFilters">
                <option value="all">Все районы</option>
                <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
              </select>
              <label class="filter-verified">
                <input type="checkbox" v-model="onlyVerified" @change="applyFilters" />
                <span>Только проверенные ✓</span>
              </label>
            </div>
          </div>

          <!-- Results count -->
          <div class="orgs-count">
            <span v-if="!loading">Найдено: <strong>{{ filteredOrgs.length }}</strong> организаций</span>
            <span v-else>Загрузка...</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="container orgs-content">
        <!-- Loading skeletons -->
        <div v-if="loading" class="orgs-grid">
          <div v-for="i in 8" :key="i" class="org-skeleton">
            <div class="skeleton" style="height:180px;border-radius:12px"></div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <p>{{ t('errorLoad') }}</p>
          <button class="btn btn-primary mt-4" @click="loadOrgs">Повторить</button>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredOrgs.length === 0" class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>{{ t('noResults') }}</h3>
          <p style="margin-top:8px;color:var(--gray-500)">Попробуйте изменить поисковый запрос или сбросить фильтры</p>
          <button class="btn btn-outline mt-4" @click="resetFilters">Сбросить фильтры</button>
        </div>

        <!-- Orgs grid -->
        <div v-else class="orgs-grid">
          <OrganizationCard
            v-for="org in filteredOrgs"
            :key="org.id"
            :org="org"
            @open="selectedOrg = org"
            @edit="editOrg = org; showAddForm = true"
            @delete="confirmDelete(org)"
          />
        </div>
      </div>
    </div>

    <!-- Org modal -->
    <OrgModal :org="selectedOrg" @close="selectedOrg = null" />

    <!-- Admin add/edit form modal -->
    <Teleport to="body">
      <div v-if="showAddForm" class="modal-overlay" @click.self="showAddForm = false">
        <div class="modal-box admin-form-modal">
          <h3 class="modal-title">{{ editOrg ? 'Редактировать организацию' : 'Добавить организацию' }}</h3>
          <div class="form-group">
            <label class="form-label">Название (рус)</label>
            <input class="form-input" v-model="formData.nameRus" placeholder="Название на русском" />
          </div>
          <div class="form-group">
            <label class="form-label">Название (каз)</label>
            <input class="form-input" v-model="formData.nameKaz" placeholder="Атауы қазақша" />
          </div>
          <div class="form-group">
            <label class="form-label">Адрес</label>
            <input class="form-input" v-model="formData.address" placeholder="Алматы, ул. ..." />
          </div>
          <div class="form-group">
            <label class="form-label">Телефон</label>
            <input class="form-input" v-model="formData.phone" placeholder="+7 727 ..." />
          </div>
          <div class="form-group">
            <label class="form-label">Статус</label>
            <select class="form-input" v-model="formData.verified">
              <option :value="false">На проверке</option>
              <option :value="true">Проверено ✓</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="btn btn-outline" @click="showAddForm = false; editOrg = null">Отмена</button>
            <button class="btn btn-primary" @click="saveOrg">{{ editOrg ? 'Сохранить' : 'Добавить' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'
import { getOrganizations } from '../api/organizations.js'
import OrganizationCard from '../components/OrganizationCard.vue'
import OrgModal from '../components/OrgModal.vue'

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const t = computed(() => useI18n(a11y.lang))

const allOrgs = ref([])
const filteredOrgs = ref([])
const loading = ref(true)
const error = ref(null)
const selectedOrg = ref(null)

const searchQuery = ref('')
const activeCategory = ref('all')
const activeDistrict = ref('all')
const onlyVerified = ref(false)

const showAddForm = ref(false)
const editOrg = ref(null)
const formData = ref({ nameRus: '', nameKaz: '', address: '', phone: '', verified: false })

const categories = computed(() => [
  { value: 'all', label: t.value('filterAll') },
  { value: 'SOCIAL', label: t.value('filterState') },
  { value: 'SOCIAL', label: t.value('filterNGO') },
  { value: 'REHABILITATION', label: t.value('filterRehab') },
  { value: 'LEGAL', label: t.value('filterLegal') },
  { value: 'MEDICAL', label: t.value('filterPsych') },
])

const districts = computed(() => [...new Set(allOrgs.value.map(o => o.district).filter(Boolean))])

const loadOrgs = async () => {
  loading.value = true; error.value = null
  try {
    const res = await getOrganizations()
    allOrgs.value = res.items ?? res
    applyFilters()
  } catch (e) { error.value = e.message }
  finally { loading.value = false }
}

const applyFilters = () => {
  let data = [...allOrgs.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    data = data.filter(o =>
      (o.nameRu || '').toLowerCase().includes(q) ||
      (o.nameKk || '').toLowerCase().includes(q) ||
      (o.description || '').toLowerCase().includes(q) ||
      (o.descriptionKk || '').toLowerCase().includes(q) ||
      (o.tags || []).some(t => t.toLowerCase().includes(q))
    )
  }
  if (activeCategory.value !== 'all') data = data.filter(o => o.category === activeCategory.value)
  if (activeDistrict.value !== 'all') data = data.filter(o => o.district === activeDistrict.value)
  if (onlyVerified.value) data = data.filter(o => o.status === 'VERIFIED')
  filteredOrgs.value = data
}

const resetFilters = () => {
  searchQuery.value = ''; activeCategory.value = 'all'; activeDistrict.value = 'all'; onlyVerified.value = false
  applyFilters()
}

const saveOrg = () => {
  if (editOrg.value) {
    const idx = allOrgs.value.findIndex(o => o.id === editOrg.value.id)
    if (idx !== -1) Object.assign(allOrgs.value[idx], formData.value)
  } else {
    allOrgs.value.push({ ...formData.value, id: Date.now(), tags: [], rating: 0, district: 'Алматы' })
  }
  showAddForm.value = false; editOrg.value = null
  formData.value = { nameRus: '', nameKaz: '', address: '', phone: '', verified: false }
  applyFilters()
}

const confirmDelete = (org) => {
  if (confirm(`Удалить "${org.nameRus}"?`)) {
    allOrgs.value = allOrgs.value.filter(o => o.id !== org.id)
    applyFilters()
  }
}

onMounted(loadOrgs)
</script>

<style scoped>
.orgs-page-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  padding: 40px 0 0;
  margin-bottom: 32px;
}
.orgs-page-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}
.orgs-page-title { font-size: var(--fs-3xl); font-weight: 800; color: white; }
.orgs-page-subtitle { color: rgba(255,255,255,0.7); font-size: var(--fs-md); margin-top: 4px; }
.orgs-filters { background: white; border-radius: var(--radius-xl) var(--radius-xl) 0 0; padding: 24px 28px 20px; display: flex; flex-direction: column; gap: 16px; }
.orgs-search { max-width: 100%; }
.search-clear {
  position: absolute; right: 14px;
  color: var(--gray-400, #9CA3AF);
  font-size: var(--fs-sm);
  transition: color var(--transition);
}
.search-clear:hover { color: var(--gray-700); }
.filter-tabs { display: flex; flex-wrap: wrap; gap: 6px; }
.filter-tab {
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--gray-500);
  background: var(--gray-100);
  border: 1.5px solid transparent;
  transition: all var(--transition);
  cursor: pointer;
}
.filter-tab:hover { color: var(--primary); border-color: var(--primary-pale); }
.filter-tab.active { background: var(--primary); color: white; border-color: var(--primary); }
.filter-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.filter-select { max-width: 200px; padding: 8px 14px; font-size: var(--fs-sm); }
.filter-verified { display: flex; align-items: center; gap: 8px; font-size: var(--fs-sm); font-weight: 600; color: var(--gray-700); cursor: pointer; }
.filter-verified input { width: 16px; height: 16px; accent-color: var(--primary); }
.orgs-count { background: white; padding: 12px 28px; font-size: var(--fs-sm); color: var(--gray-500); border-top: 1px solid var(--gray-100); }
.orgs-content { padding-bottom: 64px; }
.orgs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.admin-form-modal { max-width: 500px; }
.modal-title { font-size: var(--fs-xl); font-weight: 700; margin-bottom: 24px; }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }

@media (max-width: 900px) { .orgs-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .orgs-grid { grid-template-columns: 1fr; } .orgs-page-title { font-size: var(--fs-2xl); } }
</style>
