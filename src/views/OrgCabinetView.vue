<template>
  <main class="page-content org-cabinet">
    <div class="container">

      <!-- Header -->
      <div class="cabinet-header">
        <div>
          <h1 class="cabinet-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
            Кабинет организации
          </h1>
          <p class="cabinet-sub" v-if="org">{{ org.nameRus || org.nameRu }}</p>
        </div>
        <div class="cabinet-tabs">
          <button
            v-for="tab in tabs" :key="tab.id"
            class="cab-tab"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >{{ tab.label }}</button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="cab-loading">
        <div class="spinner"></div>
        <span>Загружаем данные...</span>
      </div>

      <!-- No org — Registration form -->
      <div v-else-if="!org" class="reg-org-wrap">
        <div class="cab-card reg-org-card">
          <div class="reg-org-icon">🏢</div>
          <h2 class="reg-org-title">Зарегистрируйте организацию</h2>
          <p class="reg-org-sub">Заполните данные и мы проверим вашу заявку</p>

          <div v-if="regSuccess" class="reg-org-success">
            <div style="font-size:40px">✅</div>
            <h3>Заявка отправлена!</h3>
            <p>Ваша организация находится на проверке у администратора. Ожидайте подтверждения.</p>
          </div>

          <form v-else @submit.prevent="submitRegOrg" class="reg-org-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Название (рус) *</label>
                <input v-model="regForm.nameRus" class="form-input" required placeholder="ООО Пример" />
              </div>
              <div class="form-group">
                <label class="form-label">Название (каз)</label>
                <input v-model="regForm.nameKaz" class="form-input" placeholder="ЖШС Үлгі" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Категория *</label>
                <select v-model="regForm.category" class="form-input" required>
                  <option value="">— Выберите —</option>
                  <option value="EDUCATION">Образование</option>
                  <option value="HEALTH">Здравоохранение</option>
                  <option value="SOCIAL">Социальные услуги</option>
                  <option value="SPORT">Спорт и реабилитация</option>
                  <option value="CULTURE">Культура</option>
                  <option value="NGO">НКО / Фонд</option>
                  <option value="OTHER">Другое</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Город *</label>
                <input v-model="regForm.city" class="form-input" required placeholder="Алматы" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Телефон *</label>
                <input v-model="regForm.phone" class="form-input" required placeholder="+7 700 000 0000" />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input v-model="regForm.email" type="email" class="form-input" placeholder="org@example.kz" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Адрес</label>
              <input v-model="regForm.address" class="form-input" placeholder="ул. Примерная, д. 1" />
            </div>
            <div class="form-group">
              <label class="form-label">Сайт</label>
              <input v-model="regForm.website" class="form-input" placeholder="https://" />
            </div>
            <div class="form-group">
              <label class="form-label">Описание *</label>
              <textarea v-model="regForm.descriptionRus" class="form-input form-textarea" rows="4" required placeholder="Кратко опишите деятельность организации..."></textarea>
            </div>
            <div v-if="regError" class="cab-error">{{ regError }}</div>
            <button type="submit" class="btn btn-primary reg-org-btn" :disabled="regLoading">
              <span v-if="regLoading" class="spinner-sm"></span>
              {{ regLoading ? 'Отправка...' : 'Отправить заявку' }}
            </button>
          </form>
        </div>
      </div>

      <template v-else>

        <!-- ── TAB: Информация ─────────────────────────────────────────── -->
        <section v-if="activeTab === 'info'" class="cab-section">
          <div class="cab-card">
            <div class="cab-card-header">
              <h2>Информация об организации</h2>
              <button v-if="!editMode" class="btn btn-outline btn-sm" @click="startEdit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Редактировать
              </button>
            </div>

            <!-- View mode -->
            <div v-if="!editMode" class="org-info-grid">
              <div class="org-info-logo">
                <div class="logo-upload-wrap">
                  <img v-if="org.logoUrl" :src="org.logoUrl" :alt="org.nameRus" class="org-logo-img" />
                  <div v-else class="org-logo-placeholder">{{ (org.nameRus || org.nameRu || 'O')[0] }}</div>
                  <label class="logo-upload-btn" title="Загрузить логотип">
                    <svg v-if="!logoUploading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span v-else class="spinner-sm-logo"></span>
                    <input type="file" accept="image/*" class="logo-file-input" @change="handleLogoUpload" />
                  </label>
                </div>
                <div v-if="logoError" class="logo-error">{{ logoError }}</div>
                <span class="badge" :class="org.isVerified ? 'badge-success' : 'badge-secondary'">
                  {{ org.isVerified ? '✓ Верифицирована' : 'На проверке' }}
                </span>
              </div>
              <div class="org-info-fields">
                <div class="info-row"><span class="info-label">Название (рус)</span><span>{{ org.nameRus || org.nameRu || '—' }}</span></div>
                <div class="info-row"><span class="info-label">Название (каз)</span><span>{{ org.nameKaz || '—' }}</span></div>
                <div class="info-row"><span class="info-label">Категория</span><span>{{ org.category || '—' }}</span></div>
                <div class="info-row"><span class="info-label">Город</span><span>{{ org.city || '—' }}</span></div>
                <div class="info-row"><span class="info-label">Адрес</span><span>{{ org.address || '—' }}</span></div>
                <div class="info-row"><span class="info-label">Телефон</span><span>{{ org.phone || '—' }}</span></div>
                <div class="info-row"><span class="info-label">Email</span><span>{{ org.email || '—' }}</span></div>
                <div class="info-row"><span class="info-label">Сайт</span><span>{{ org.website || '—' }}</span></div>
                <div class="info-row info-row--full"><span class="info-label">Описание</span><span>{{ org.descriptionRus || org.descriptionRu || '—' }}</span></div>
              </div>
            </div>

            <!-- Edit mode -->
            <form v-else class="org-edit-form" @submit.prevent="saveOrg">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Название (рус) *</label>
                  <input v-model="editForm.nameRus" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Название (каз)</label>
                  <input v-model="editForm.nameKaz" class="form-input" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Город</label>
                  <input v-model="editForm.city" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">Телефон</label>
                  <input v-model="editForm.phone" class="form-input" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Адрес</label>
                  <input v-model="editForm.address" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input v-model="editForm.email" type="email" class="form-input" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Сайт</label>
                <input v-model="editForm.website" class="form-input" placeholder="https://" />
              </div>
              <div class="form-group">
                <label class="form-label">Описание (рус)</label>
                <textarea v-model="editForm.descriptionRus" class="form-input form-textarea" rows="4"></textarea>
              </div>
              <div class="edit-actions">
                <button type="button" class="btn btn-outline btn-sm" @click="cancelEdit">Отмена</button>
                <button type="submit" class="btn btn-primary btn-sm" :disabled="saving">
                  <span v-if="saving" class="spinner-sm"></span>
                  Сохранить
                </button>
              </div>
              <div v-if="saveError" class="cab-error">{{ saveError }}</div>
            </form>
          </div>
        </section>

        <!-- ── TAB: Услуги ─────────────────────────────────────────────── -->
        <section v-if="activeTab === 'services'" class="cab-section">
          <div class="cab-card">
            <div class="cab-card-header">
              <h2>Услуги организации</h2>
              <button class="btn btn-primary btn-sm" @click="openServiceModal()">
                + Добавить услугу
              </button>
            </div>

            <div v-if="servicesLoading" class="cab-loading-sm">
              <div class="spinner"></div>
            </div>
            <div v-else-if="services.length === 0" class="cab-empty-sm">
              <p>Услуги не добавлены. Добавьте первую услугу.</p>
            </div>
            <div v-else class="services-list">
              <div v-for="svc in services" :key="svc.id" class="service-item">
                <div class="service-info">
                  <div class="service-name">{{ svc.nameRu }}</div>
                  <div class="service-desc">{{ svc.descriptionRu || '—' }}</div>
                  <div class="service-meta">
                    <span class="service-price">{{ svc.price ? svc.price + ' ₸' : 'Бесплатно' }}</span>
                    <span class="badge" :class="svc.isActive ? 'badge-success' : 'badge-secondary'">
                      {{ svc.isActive ? 'Активна' : 'Скрыта' }}
                    </span>
                  </div>
                </div>
                <div class="service-actions">
                  <button class="btn btn-outline btn-xs" @click="openServiceModal(svc)">Изм.</button>
                  <button class="btn btn-danger btn-xs" @click="deleteService(svc.id)">Удал.</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── TAB: Аналитика ──────────────────────────────────────────── -->
        <section v-if="activeTab === 'analytics'" class="cab-section">
          <div v-if="analyticsLoading" class="cab-loading-sm"><div class="spinner"></div></div>
          <template v-else>
            <div class="analytics-grid">
              <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-value">{{ org.ratingAvg ? Number(org.ratingAvg).toFixed(1) : '—' }}</div>
                <div class="stat-label">Средний рейтинг</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">💬</div>
                <div class="stat-value">{{ org.ratingCount ?? 0 }}</div>
                <div class="stat-label">Отзывов</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🔖</div>
                <div class="stat-value">{{ analytics?.savedCount ?? '—' }}</div>
                <div class="stat-label">В избранном</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">👁️</div>
                <div class="stat-value">{{ analytics?.viewsCount ?? '—' }}</div>
                <div class="stat-label">Просмотров</div>
              </div>
            </div>

            <!-- Reviews list -->
            <div class="cab-card mt-4">
              <div class="cab-card-header"><h2>Последние отзывы</h2></div>
              <div v-if="!analytics?.recentReviews?.length" class="cab-empty-sm">
                <p>Отзывов пока нет.</p>
              </div>
              <div v-else class="reviews-list">
                <div v-for="r in analytics.recentReviews" :key="r.id" class="review-item">
                  <div class="review-stars">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5-r.rating) }}</div>
                  <div class="review-text">{{ r.comment }}</div>
                  <div class="review-meta">{{ formatDate(r.createdAt) }}</div>
                </div>
              </div>
            </div>
          </template>
        </section>

        <!-- ── TAB: Кто сохранил ───────────────────────────────────────── -->
        <section v-if="activeTab === 'saved'" class="cab-section">
          <div class="cab-card">
            <div class="cab-card-header"><h2>Пользователи, добавившие в избранное</h2></div>
            <div v-if="savedUsersLoading" class="cab-loading-sm"><div class="spinner"></div></div>
            <div v-else-if="!savedUsers.length" class="cab-empty-sm">
              <p>Ни один пользователь ещё не сохранил вашу организацию.</p>
            </div>
            <div v-else class="saved-users-list">
              <div v-for="u in savedUsers" :key="u.id" class="saved-user-item">
                <div class="saved-user-avatar">{{ (u.firstName || u.email || '?')[0] }}</div>
                <div>
                  <div class="saved-user-name">{{ u.firstName }} {{ u.lastName }}</div>
                  <div class="saved-user-email">{{ u.email }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </template>
    </div>

    <!-- Service modal -->
    <Transition name="fade">
      <div v-if="showServiceModal" class="modal-overlay" @click.self="showServiceModal=false">
        <div class="modal-card">
          <button class="modal-close" @click="showServiceModal=false">✕</button>
          <h3>{{ editingService ? 'Изменить услугу' : 'Добавить услугу' }}</h3>
          <form @submit.prevent="submitService" class="modal-form">
            <div class="form-group">
              <label class="form-label">Название *</label>
              <input v-model="serviceForm.nameRu" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Описание</label>
              <textarea v-model="serviceForm.descriptionRu" class="form-input form-textarea" rows="3"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Цена (₸, 0 = бесплатно)</label>
                <input v-model.number="serviceForm.price" type="number" min="0" class="form-input" />
              </div>
              <div class="form-group" style="justify-content:flex-end;padding-top:24px">
                <label class="toggle-label">
                  <input type="checkbox" v-model="serviceForm.isActive" />
                  Активна
                </label>
              </div>
            </div>
            <div v-if="serviceError" class="cab-error">{{ serviceError }}</div>
            <div class="edit-actions">
              <button type="button" class="btn btn-outline btn-sm" @click="showServiceModal=false">Отмена</button>
              <button type="submit" class="btn btn-primary btn-sm" :disabled="serviceLoading">
                <span v-if="serviceLoading" class="spinner-sm"></span>
                {{ editingService ? 'Сохранить' : 'Добавить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import {
  getMyOrganization, updateMyOrganization, getMyOrgAnalytics,
  getMyOrgServices, createMyOrgService, updateMyOrgService, deleteMyOrgService,
  getMyOrgSavedUsers, registerOrganization, uploadOrgLogo
} from '../api/organizations.js'

const router = useRouter()
const authStore = useAuthStore()

// Guard
if (!authStore.isOrgManager) {
  router.replace('/')
}

const tabs = [
  { id: 'info',      label: 'Информация' },
  { id: 'services',  label: 'Услуги' },
  { id: 'analytics', label: 'Аналитика' },
  { id: 'saved',     label: 'Кто сохранил' },
]
const activeTab = ref('info')

// ── Org data ──────────────────────────────────────────────────────────
const org = ref(null)
const loading = ref(true)
const editMode = ref(false)
const saving = ref(false)
const saveError = ref('')
const editForm = ref({})

onMounted(async () => {
  try {
    org.value = await getMyOrganization()
  } catch (e) {
    org.value = null
  } finally {
    loading.value = false
  }
})

function startEdit() {
  editForm.value = {
    nameRus: org.value.nameRus || org.value.nameRu || '',
    nameKaz: org.value.nameKaz || '',
    city: org.value.city || '',
    phone: org.value.phone || '',
    address: org.value.address || '',
    email: org.value.email || '',
    website: org.value.website || '',
    descriptionRus: org.value.descriptionRus || org.value.descriptionRu || '',
  }
  editMode.value = true
  saveError.value = ''
}
function cancelEdit() {
  editMode.value = false
  saveError.value = ''
}
async function saveOrg() {
  saving.value = true
  saveError.value = ''
  try {
    org.value = await updateMyOrganization(editForm.value)
    editMode.value = false
  } catch (e) {
    saveError.value = e.message || 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}

// ── Logo upload ───────────────────────────────────────────────────────
const logoUploading = ref(false)
const logoError = ref('')

async function handleLogoUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { logoError.value = 'Файл слишком большой (макс. 5 МБ)'; return }
  logoUploading.value = true
  logoError.value = ''
  try {
    const res = await uploadOrgLogo(file)
    org.value = { ...org.value, logoUrl: res.logoUrl || res.url || org.value.logoUrl }
  } catch (err) {
    logoError.value = err.message || 'Ошибка загрузки логотипа'
  } finally {
    logoUploading.value = false
    e.target.value = ''
  }
}

// ── Register org (when org=null) ──────────────────────────────────────
const regForm = ref({ nameRus: '', nameKaz: '', category: '', city: '', phone: '', email: '', address: '', website: '', descriptionRus: '' })
const regLoading = ref(false)
const regError = ref('')
const regSuccess = ref(false)

async function submitRegOrg() {
  regLoading.value = true
  regError.value = ''
  try {
    org.value = await registerOrganization(regForm.value)
    regSuccess.value = true
    setTimeout(() => { regSuccess.value = false }, 4000)
  } catch (e) {
    regError.value = e.message || 'Ошибка при отправке заявки'
  } finally {
    regLoading.value = false
  }
}

// ── Services ──────────────────────────────────────────────────────────
const services = ref([])
const servicesLoading = ref(false)
const showServiceModal = ref(false)
const editingService = ref(null)
const serviceForm = ref({ nameRu: '', descriptionRu: '', price: 0, isActive: true })
const serviceLoading = ref(false)
const serviceError = ref('')

watch(activeTab, async (tab) => {
  if (tab === 'services' && services.value.length === 0) {
    servicesLoading.value = true
    try { services.value = await getMyOrgServices() }
    catch {} finally { servicesLoading.value = false }
  }
  if (tab === 'analytics' && !analytics.value) loadAnalytics()
  if (tab === 'saved' && savedUsers.value.length === 0) loadSavedUsers()
})

function openServiceModal(svc = null) {
  editingService.value = svc
  serviceForm.value = svc
    ? { nameRu: svc.nameRu, descriptionRu: svc.descriptionRu || '', price: svc.price || 0, isActive: svc.isActive }
    : { nameRu: '', descriptionRu: '', price: 0, isActive: true }
  serviceError.value = ''
  showServiceModal.value = true
}

async function submitService() {
  serviceLoading.value = true
  serviceError.value = ''
  try {
    if (editingService.value) {
      const updated = await updateMyOrgService(editingService.value.id, serviceForm.value)
      const idx = services.value.findIndex(s => s.id === editingService.value.id)
      if (idx !== -1) services.value[idx] = updated
    } else {
      const created = await createMyOrgService(serviceForm.value)
      services.value.push(created)
    }
    showServiceModal.value = false
  } catch (e) {
    serviceError.value = e.message || 'Ошибка'
  } finally {
    serviceLoading.value = false
  }
}

async function deleteService(id) {
  if (!confirm('Удалить услугу?')) return
  try {
    await deleteMyOrgService(id)
    services.value = services.value.filter(s => s.id !== id)
  } catch (e) {
    alert(e.message || 'Ошибка удаления')
  }
}

// ── Analytics ─────────────────────────────────────────────────────────
const analytics = ref(null)
const analyticsLoading = ref(false)

async function loadAnalytics() {
  analyticsLoading.value = true
  try { analytics.value = await getMyOrgAnalytics() }
  catch {} finally { analyticsLoading.value = false }
}

// ── Saved users ───────────────────────────────────────────────────────
const savedUsers = ref([])
const savedUsersLoading = ref(false)

async function loadSavedUsers() {
  savedUsersLoading.value = true
  try {
    const res = await getMyOrgSavedUsers()
    savedUsers.value = res.items || res
  } catch {} finally { savedUsersLoading.value = false }
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.org-cabinet { padding-top: calc(var(--header-h) + var(--navbar-h) + 32px); padding-bottom: 64px; }

.cabinet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.cabinet-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--fs-2xl);
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: 4px;
}
.cabinet-sub { color: var(--gray-500); font-size: var(--fs-sm); }

.cabinet-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.cab-tab {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--gray-600);
  background: var(--gray-100);
  transition: all var(--transition);
  cursor: pointer;
}
.cab-tab:hover { background: var(--gray-200); }
.cab-tab.active { background: var(--primary); color: white; }

/* Loading / empty states */
.cab-loading { display: flex; align-items: center; gap: 12px; justify-content: center; padding: 80px 0; color: var(--gray-500); }
.cab-loading-sm { display: flex; justify-content: center; padding: 32px 0; }
.cab-empty { text-align: center; padding: 80px 0; }
.cab-empty-icon { font-size: 64px; margin-bottom: 16px; }
.cab-empty h3 { font-size: var(--fs-xl); font-weight: 700; margin-bottom: 8px; }
.cab-empty p { color: var(--gray-500); }
.cab-empty-sm { padding: 32px 0; text-align: center; color: var(--gray-500); }

/* Cards */
.cab-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
  padding: 28px;
}
.cab-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.cab-card-header h2 { font-size: var(--fs-lg); font-weight: 700; }
.mt-4 { margin-top: 16px; }

/* Org info */
.org-info-grid { display: flex; gap: 28px; }
.org-info-logo { display: flex; flex-direction: column; align-items: center; gap: 12px; min-width: 120px; }
.org-logo-img { width: 100px; height: 100px; object-fit: cover; border-radius: var(--radius-lg); }
.org-logo-placeholder {
  width: 100px; height: 100px;
  background: var(--primary-pale);
  color: var(--primary);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: 36px; font-weight: 800;
}
.org-info-fields { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.info-row { display: flex; flex-direction: column; gap: 2px; }
.info-row--full { grid-column: 1 / -1; }
.info-label { font-size: var(--fs-xs); font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.4px; }
.info-row > span:last-child { font-size: var(--fs-sm); color: var(--gray-800); }

/* Edit form */
.org-edit-form { display: flex; flex-direction: column; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: var(--fs-sm); font-weight: 600; color: var(--gray-700); }
.form-textarea { min-height: 100px; resize: vertical; }
.edit-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }
.cab-error { color: var(--danger); font-size: var(--fs-sm); margin-top: 8px; }

/* Services */
.services-list { display: flex; flex-direction: column; gap: 12px; }
.service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background: var(--gray-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-200);
}
.service-info { flex: 1; }
.service-name { font-size: var(--fs-sm); font-weight: 700; color: var(--gray-900); margin-bottom: 4px; }
.service-desc { font-size: var(--fs-xs); color: var(--gray-500); margin-bottom: 8px; }
.service-meta { display: flex; align-items: center; gap: 10px; }
.service-price { font-size: var(--fs-sm); font-weight: 600; color: var(--primary); }
.service-actions { display: flex; gap: 6px; flex-shrink: 0; }

/* Analytics */
.analytics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 0; }
.stat-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
  padding: 24px 20px;
  text-align: center;
}
.stat-icon { font-size: 32px; margin-bottom: 8px; }
.stat-value { font-size: var(--fs-3xl, 2rem); font-weight: 800; color: var(--primary); }
.stat-label { font-size: var(--fs-xs); color: var(--gray-500); font-weight: 600; margin-top: 4px; }

/* Reviews */
.reviews-list { display: flex; flex-direction: column; gap: 12px; }
.review-item { padding: 14px; background: var(--gray-50); border-radius: var(--radius-md); }
.review-stars { color: #f59e0b; font-size: var(--fs-md); margin-bottom: 6px; }
.review-text { font-size: var(--fs-sm); color: var(--gray-700); margin-bottom: 6px; }
.review-meta { font-size: var(--fs-xs); color: var(--gray-400); }

/* Saved users */
.saved-users-list { display: flex; flex-direction: column; gap: 10px; }
.saved-user-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--gray-50); border-radius: var(--radius-md); }
.saved-user-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--primary-pale); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: var(--fs-md); flex-shrink: 0;
}
.saved-user-name { font-size: var(--fs-sm); font-weight: 700; }
.saved-user-email { font-size: var(--fs-xs); color: var(--gray-500); }

/* Badges */
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: var(--radius-full); font-size: var(--fs-xs); font-weight: 700; }
.badge-success { background: #dcfce7; color: #166534; }
.badge-secondary { background: var(--gray-100); color: var(--gray-600); }

/* Buttons */
.btn-xs { padding: 4px 10px; font-size: var(--fs-xs); }
.btn-danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
.btn-danger:hover { background: #fecaca; }

/* Toggle */
.toggle-label { display: flex; align-items: center; gap: 8px; font-size: var(--fs-sm); font-weight: 600; cursor: pointer; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal-card { background: white; border-radius: var(--radius-xl); padding: 32px; max-width: 480px; width: 100%; box-shadow: var(--shadow-lg); position: relative; }
.modal-close { position: absolute; top: 14px; right: 14px; color: var(--gray-400); font-size: 18px; cursor: pointer; }
.modal-card h3 { font-size: var(--fs-lg); font-weight: 800; margin-bottom: 20px; }
.modal-form { display: flex; flex-direction: column; gap: 14px; }

/* Logo upload */
.logo-upload-wrap { position: relative; display: inline-block; }
.logo-upload-btn {
  position: absolute; bottom: -4px; right: -4px;
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--primary); color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: background 0.15s;
}
.logo-upload-btn:hover { background: var(--primary-dark, #2563eb); }
.logo-file-input { display: none; }
.logo-error { font-size: var(--fs-xs); color: var(--danger); margin-top: 4px; max-width: 120px; text-align: center; }
.spinner-sm-logo { width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }

/* Register org */
.reg-org-wrap { display: flex; justify-content: center; padding: 24px 0; }
.reg-org-card { max-width: 640px; width: 100%; text-align: center; }
.reg-org-icon { font-size: 52px; margin-bottom: 12px; }
.reg-org-title { font-size: var(--fs-xl); font-weight: 800; color: var(--gray-900); margin-bottom: 6px; }
.reg-org-sub { font-size: var(--fs-sm); color: var(--gray-500); margin-bottom: 24px; }
.reg-org-form { text-align: left; }
.reg-org-btn { width: 100%; margin-top: 8px; padding: 13px; font-size: var(--fs-md); }
.reg-org-success { padding: 20px 0; }
.reg-org-success h3 { font-size: var(--fs-lg); font-weight: 800; margin: 12px 0 8px; }
.reg-org-success p { font-size: var(--fs-sm); color: var(--gray-500); }

/* Spinner */
.spinner { width: 32px; height: 32px; border: 3px solid var(--gray-200); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 768px) {
  .org-info-grid { flex-direction: column; }
  .org-info-fields { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .analytics-grid { grid-template-columns: 1fr 1fr; }
  .cabinet-header { flex-direction: column; }
}
@media (max-width: 480px) {
  .analytics-grid { grid-template-columns: 1fr; }
}
</style>
