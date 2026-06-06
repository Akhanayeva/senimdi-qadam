<template>
  <main class="page-content">
    <div class="orgs-page">
      <!-- Page header -->
      <div class="orgs-page-header">
        <div class="container">
          <h1 class="orgs-page-title">{{ t('allOrgs') }}</h1>
          <p class="orgs-page-subtitle">Каталог организаций, центров и фондов Алматы для людей с инвалидностью</p>
        </div>
      </div>

      <!-- Filters bar -->
      <div class="orgs-filters-bar">
        <div class="container">
          <!-- Search -->
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

          <!-- Category chips -->
          <div class="filter-tabs">
            <button
              v-for="cat in categories"
              :key="cat.value + cat.label"
              class="filter-tab"
              :class="{ active: activeCategory === cat.value }"
              @click="activeCategory = cat.value; applyFilters()"
            >{{ cat.label }}</button>
          </div>

          <!-- Second row: district + verified + count -->
          <div class="filter-row">
            <select class="form-input filter-select" v-model="activeDistrict" @change="applyFilters">
              <option value="all">Все районы</option>
              <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
            </select>
            <label class="filter-verified">
              <input type="checkbox" v-model="onlyVerified" @change="applyFilters" />
              <span>Только проверенные ✓</span>
            </label>
            <span class="orgs-count-inline" v-if="!loading">
              Найдено: <strong>{{ filteredOrgs.length }}</strong>
            </span>
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
          />
        </div>
      </div>
    </div>

    <!-- Org modal -->
    <OrgModal :org="selectedOrg" @close="selectedOrg = null" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'
import { getOrganizations } from '../api/organizations.js'
import OrganizationCard from '../components/OrganizationCard.vue'
import OrgModal from '../components/OrgModal.vue'

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

const categories = computed(() => [
  { value: 'all', label: t.value('filterAll') },
  { value: 'SOCIAL', label: t.value('filterState') },
  { value: 'NGO', label: t.value('filterNGO') },
  { value: 'REHABILITATION', label: t.value('filterRehab') },
  { value: 'LEGAL', label: t.value('filterLegal') },
  { value: 'MEDICAL', label: t.value('filterPsych') },
])

const districts = computed(() => [...new Set(allOrgs.value.map(o => o.district).filter(Boolean))])

const loadOrgs = async () => {
  loading.value = true; error.value = null
  try {
    // limit:200 ensures real API returns enough orgs for client-side filtering.
    // Client-side filtering (applyFilters) gives instant UX without extra round trips.
    const res = await getOrganizations({ limit: 200 })
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
      (o.name || '').toLowerCase().includes(q) ||
      (o.nameRu || '').toLowerCase().includes(q) ||
      (o.nameKk || '').toLowerCase().includes(q) ||
      (o.description || '').toLowerCase().includes(q) ||
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

onMounted(loadOrgs)
</script>

<style scoped>
/* ── Hero header ── */
.orgs-page-header {
  width: 100%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  padding: 48px 0 40px;
}
.orgs-page-title { font-size: var(--fs-3xl); font-weight: 800; color: white; line-height: 1.2; }
.orgs-page-subtitle { color: rgba(255,255,255,0.75); font-size: var(--fs-md); margin-top: 8px; }

/* ── Filters bar ── */
.orgs-filters-bar {
  width: 100%;
  background: white;
  border-bottom: 1px solid var(--gray-200);
  padding: 20px 0;
  position: sticky;
  top: calc(var(--header-h) + var(--navbar-h));
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.orgs-filters-bar .container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.orgs-search { max-width: 100%; }
.search-clear {
  position: absolute; right: 14px;
  color: var(--gray-400);
  font-size: var(--fs-sm);
  transition: color var(--transition);
}
.search-clear:hover { color: var(--gray-700); }

/* ── Filter chips ── */
.filter-tabs { display: flex; flex-wrap: wrap; gap: 6px; }
.filter-tab {
  padding: 5px 14px;
  border-radius: var(--radius-full);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--gray-500);
  background: var(--gray-100);
  border: 1.5px solid transparent;
  transition: all 0.15s;
  cursor: pointer;
  white-space: nowrap;
}
.filter-tab:hover { color: var(--primary); background: var(--primary-pale); }
.filter-tab.active { background: var(--primary); color: white; border-color: var(--primary); }

/* ── Filter row ── */
.filter-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.filter-select { max-width: 200px; padding: 7px 12px; font-size: var(--fs-sm); border-radius: var(--radius-sm); }
.filter-verified { display: flex; align-items: center; gap: 8px; font-size: var(--fs-sm); font-weight: 600; color: var(--gray-700); cursor: pointer; user-select: none; }
.filter-verified input { width: 16px; height: 16px; accent-color: var(--primary); cursor: pointer; }
.orgs-count-inline { margin-left: auto; font-size: var(--fs-sm); color: var(--gray-500); }
.orgs-count-inline strong { color: var(--primary); }

/* ── Content ── */
.orgs-content { padding: 32px 0 64px; }
.orgs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.admin-form-modal { max-width: 500px; }
.modal-title { font-size: var(--fs-xl); font-weight: 700; margin-bottom: 24px; }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }

@media (max-width: 960px) { .orgs-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) {
  .orgs-grid { grid-template-columns: 1fr; }
  .orgs-page-title { font-size: var(--fs-2xl); }
  .orgs-count-inline { margin-left: 0; }
}
</style>
