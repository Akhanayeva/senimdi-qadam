<template>
  <main class="page-content">
    <div class="fav-page">
      <div class="fav-header">
        <div class="container">
          <h1 class="page-h1">{{ t('favorites') }}</h1>
          <p class="page-desc">{{ t('favoritesDesc') }}</p>
        </div>
      </div>

      <div class="container fav-content">
        <!-- Not logged in -->
        <div v-if="!authStore.isAuthenticated" class="empty-state">
          <div class="empty-state-icon">🔒</div>
          <h3>{{ t('needLoginTitle') }}</h3>
          <p style="margin-top:8px;color:var(--gray-500)">{{ t('loginToFavs') }}</p>
          <RouterLink to="/login" class="btn btn-primary mt-4">{{ t('login') }}</RouterLink>
        </div>

        <!-- Loading -->
        <div v-else-if="loading" class="fav-grid">
          <div v-for="i in 4" :key="i" class="org-skeleton">
            <div class="skeleton" style="height:180px;border-radius:12px"></div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="savedList.length === 0" class="empty-state">
          <div class="empty-state-icon">❤️</div>
          <h3>{{ t('favsEmpty') }}</h3>
          <p style="margin-top:8px;color:var(--gray-500)">{{ t('favsHint') }}</p>
          <RouterLink to="/services/organizations" class="btn btn-primary mt-4">{{ t('browseOrgs') }}</RouterLink>
        </div>

        <!-- Grid -->
        <div v-else class="fav-grid">
          <OrganizationCard
            v-for="org in savedList"
            :key="org.id"
            :org="org"
            @open="selectedOrg = org"
          />
        </div>
      </div>
    </div>

    <OrgModal :org="selectedOrg" @close="selectedOrg = null" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'
import { getOrganizations } from '../api/organizations.js'
import OrganizationCard from '../components/OrganizationCard.vue'
import OrgModal from '../components/OrgModal.vue'

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const lang = computed(() => a11y.lang)
const t = computed(() => useI18n(lang.value))

const allOrgs = ref([])
const loading = ref(true)
const selectedOrg = ref(null)

// Saved org IDs come from the auth store (synced with backend + localStorage)
const savedList = computed(() =>
  allOrgs.value.filter(o => authStore.isOrgSaved(o.id))
)

onMounted(async () => {
  if (!authStore.isAuthenticated) { loading.value = false; return }
  try {
    const res = await getOrganizations({ limit: 200 })
    allOrgs.value = res.items ?? res
  } catch (e) {
    console.warn('[FavoritesView] load failed:', e.message)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.fav-header { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 48px 0 40px; margin-bottom: 32px; }
.page-h1 { font-size: var(--fs-3xl); font-weight: 800; color: white; margin-bottom: 8px; }
.page-desc { color: rgba(255,255,255,0.7); font-size: var(--fs-md); }
.fav-content { padding-bottom: 64px; }
.fav-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 900px) { .fav-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .fav-grid { grid-template-columns: 1fr; } }
</style>
