<template>
  <main class="page-content">
    <!-- Redirect if not logged in -->
    <div v-if="!authStore.isAuthenticated" class="not-auth-screen">
      <div class="not-auth-card">
        <div class="not-auth-icon">🔐</div>
        <h2>{{ lang==='kaz' ? 'Кіру қажет' : 'Требуется авторизация' }}</h2>
        <p>{{ lang==='kaz' ? 'Профильді көру үшін жүйеге кіріңіз' : 'Войдите в аккаунт чтобы открыть профиль' }}</p>
        <div class="not-auth-btns">
          <RouterLink to="/login" class="btn btn-primary">{{ lang==='kaz' ? 'Кіру' : 'Войти' }}</RouterLink>
          <RouterLink to="/register" class="btn btn-outline">{{ lang==='kaz' ? 'Тіркелу' : 'Зарегистрироваться' }}</RouterLink>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- ── Profile Hero ── -->
      <section class="profile-hero">
        <div class="container profile-hero-inner">
          <!-- Avatar -->
          <div class="avatar-wrap">
            <div class="avatar-circle">
              <img v-if="profile.avatar" :src="profile.avatar" class="avatar-img" alt="avatar" />
              <span v-else class="avatar-initials">{{ initials }}</span>
            </div>
            <label class="avatar-upload-btn" :title="lang==='kaz' ? 'Фото өзгерту' : 'Сменить фото'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <input type="file" accept="image/jpg,image/jpeg,image/png,image/webp" class="avatar-file-input" @change="handleAvatarUpload" />
            </label>
            <div v-if="avatarLoading" class="avatar-loading">
              <span class="spinner-sm"></span>
            </div>
          </div>
          <!-- Name + role -->
          <div class="profile-hero-info">
            <h1 class="profile-name">{{ profile.firstName }} {{ profile.lastName }}</h1>
            <div class="profile-hero-badges">
              <span class="role-badge" :class="'role-' + (profile.role||'').toLowerCase()">
                {{ roleLabelLocal(profile.role) }}
              </span>
              <span v-if="profile.disabilityType" class="disability-badge">
                {{ disabilityIcon(profile.disabilityType) }} {{ disabilityLabelLocal(profile.disabilityType) }}
              </span>
              <span class="joined-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ lang==='kaz' ? 'Тіркелді:' : 'С нами с' }} {{ formatDate(profile.createdAt) }}
              </span>
            </div>
            <p v-if="profile.bio" class="profile-bio">{{ lang==='kaz' && profile.bioKaz ? profile.bioKaz : profile.bio }}</p>
          </div>
          <!-- Quick stats -->
          <div class="profile-stats">
            <div class="pstat">
              <div class="pstat-num">{{ authStore.savedOrgs.length }}</div>
              <div class="pstat-label">{{ lang==='kaz' ? 'Сақталған ұйымдар' : 'Сохранённых орг.' }}</div>
            </div>
            <div class="pstat">
              <div class="pstat-num">{{ authStore.savedChats.length }}</div>
              <div class="pstat-label">{{ lang==='kaz' ? 'AI чаттар' : 'AI чатов' }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Tabs ── -->
      <div class="container profile-main">
        <div class="profile-tabs">
          <button
            v-for="tab in profileTabs"
            :key="tab.id"
            class="profile-tab"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span v-html="tab.icon"></span>
            {{ tab.label }}
          </button>
        </div>

        <!-- ── TAB: Info ── -->
        <div v-if="activeTab === 'info'" class="tab-content">
          <div class="profile-grid">
            <!-- Left: view mode -->
            <div class="info-card-box">
              <div class="info-box-header">
                <h2 class="info-box-title">{{ lang==='kaz' ? 'Жеке ақпарат' : 'Личная информация' }}</h2>
                <button class="edit-toggle-btn" @click="editMode = !editMode">
                  <svg v-if="!editMode" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  {{ editMode ? (lang==='kaz' ? 'Болдырмау' : 'Отмена') : (lang==='kaz' ? 'Өзгерту' : 'Редактировать') }}
                </button>
              </div>

              <!-- View mode -->
              <div v-if="!editMode" class="info-fields-view">
                <div class="info-field-row">
                  <span class="ifl">{{ lang==='kaz' ? 'Аты' : 'Имя' }}</span>
                  <span class="ifv">{{ profile.firstName }}</span>
                </div>
                <div class="info-field-row">
                  <span class="ifl">{{ lang==='kaz' ? 'Тегі' : 'Фамилия' }}</span>
                  <span class="ifv">{{ profile.lastName }}</span>
                </div>
                <div class="info-field-row">
                  <span class="ifl">Email</span>
                  <span class="ifv">{{ profile.email }}</span>
                </div>
                <div class="info-field-row">
                  <span class="ifl">{{ lang==='kaz' ? 'Телефон' : 'Телефон' }}</span>
                  <span class="ifv">{{ profile.phone || '—' }}</span>
                </div>
                <div class="info-field-row">
                  <span class="ifl">{{ lang==='kaz' ? 'Рөл' : 'Роль' }}</span>
                  <span class="ifv">{{ roleLabelLocal(profile.role) }}</span>
                </div>
                <div v-if="profile.disabilityType" class="info-field-row">
                  <span class="ifl">{{ lang==='kaz' ? 'Мүгедектік түрі' : 'Тип инвалидности' }}</span>
                  <span class="ifv">{{ disabilityIcon(profile.disabilityType) }} {{ disabilityLabelLocal(profile.disabilityType) }}</span>
                </div>
                <div class="info-field-row">
                  <span class="ifl">{{ lang==='kaz' ? 'Туралы' : 'О себе' }}</span>
                  <span class="ifv">{{ (lang==='kaz' && profile.bioKaz ? profile.bioKaz : profile.bio) || '—' }}</span>
                </div>
              </div>

              <!-- Edit mode -->
              <form v-else class="edit-form" @submit.prevent="handleSaveProfile">
                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label">{{ lang==='kaz' ? 'Аты' : 'Имя' }}</label>
                    <input v-model="editForm.firstName" type="text" class="form-input" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ lang==='kaz' ? 'Тегі' : 'Фамилия' }}</label>
                    <input v-model="editForm.lastName" type="text" class="form-input" required />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">{{ lang==='kaz' ? 'Телефон' : 'Телефон' }}</label>
                  <input v-model="editForm.phone" type="tel" class="form-input" placeholder="+7 701 123 4567" />
                </div>
                <div v-if="profile.role === 'USER'" class="form-group">
                  <label class="form-label">{{ lang==='kaz' ? 'Мүгедектік түрі' : 'Тип инвалидности' }}</label>
                  <select v-model="editForm.disabilityType" class="form-input form-select">
                    <option value="">{{ lang==='kaz' ? 'Таңдалмаған' : 'Не указано' }}</option>
                    <option v-for="d in disabilityTypes" :key="d.value" :value="d.value">{{ d.icon }} {{ lang==='kaz' ? d.nameKaz : d.nameRus }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">{{ lang==='kaz' ? 'Туралы' : 'О себе' }}</label>
                  <textarea v-model="editForm.bio" class="form-input form-textarea" rows="2" :placeholder="lang==='kaz' ? 'Өзіңіз туралы жазыңыз...' : 'Расскажите о себе...'" />
                </div>
                <Transition name="fade">
                  <div v-if="saveSuccess" class="save-success">✅ {{ lang==='kaz' ? 'Сақталды!' : 'Сохранено!' }}</div>
                </Transition>
                <div class="edit-actions">
                  <button type="button" class="btn btn-outline btn-sm" @click="editMode=false">{{ lang==='kaz' ? 'Болдырмау' : 'Отмена' }}</button>
                  <button type="submit" class="btn btn-primary btn-sm" :disabled="saveLoading">
                    <span v-if="saveLoading" class="spinner-sm"></span>
                    {{ saveLoading ? '...' : (lang==='kaz' ? 'Сақтау' : 'Сохранить') }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Right: security card -->
            <div class="security-card-box">
              <h2 class="info-box-title">{{ lang==='kaz' ? 'Қауіпсіздік' : 'Безопасность' }}</h2>
              <div class="security-item">
                <div class="security-item-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <div>
                    <div class="sec-label">{{ lang==='kaz' ? 'Құпия сөз' : 'Пароль' }}</div>
                    <div class="sec-hint">{{ lang==='kaz' ? 'Соңғы өзгерту: белгісіз' : 'Последнее изменение: неизвестно' }}</div>
                  </div>
                </div>
                <button class="btn btn-outline btn-sm" @click="showChangePass=!showChangePass">{{ lang==='kaz' ? 'Өзгерту' : 'Изменить' }}</button>
              </div>
              <Transition name="fade">
                <div v-if="showChangePass" class="change-pass-form">
                  <input v-model="passForm.current" type="password" class="form-input" :placeholder="lang==='kaz' ? 'Ағымдағы құпия сөз' : 'Текущий пароль'" />
                  <input v-model="passForm.newPass" type="password" class="form-input" :placeholder="lang==='kaz' ? 'Жаңа құпия сөз' : 'Новый пароль'" />
                  <input v-model="passForm.confirm" type="password" class="form-input" :placeholder="lang==='kaz' ? 'Растау' : 'Подтверждение'" />
                  <div v-if="passError" class="field-error">{{ passError }}</div>
                  <div v-if="passSuccess" class="save-success">✅ {{ lang==='kaz' ? 'Құпия сөз өзгертілді' : 'Пароль изменён' }}</div>
                  <button class="btn btn-primary btn-sm" @click="handleChangePass">{{ lang==='kaz' ? 'Сақтау' : 'Сохранить' }}</button>
                </div>
              </Transition>

              <div class="security-item">
                <div class="security-item-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <div>
                    <div class="sec-label">Email</div>
                    <div class="sec-hint">{{ profile.email }}</div>
                  </div>
                </div>
                <span class="verified-tag">✓ {{ lang==='kaz' ? 'Расталды' : 'Подтверждён' }}</span>
              </div>

              <div class="danger-zone">
                <div class="danger-zone-title">⚠️ {{ lang==='kaz' ? 'Қауіпті аймақ' : 'Опасная зона' }}</div>
                <button class="btn-danger" @click="confirmDeactivate">{{ lang==='kaz' ? 'Аккаунтты деактивациялау' : 'Деактивировать аккаунт' }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── TAB: Saved Orgs ── -->
        <div v-else-if="activeTab === 'saved'" class="tab-content">
          <div class="tab-section-header">
            <h2 class="info-box-title">{{ lang==='kaz' ? 'Сақталған ұйымдар' : 'Сохранённые организации' }}</h2>
          </div>
          <div v-if="savedOrgsList.length === 0" class="empty-tab">
            <div class="empty-tab-icon">🏢</div>
            <p>{{ lang==='kaz' ? 'Сақталған ұйымдар жоқ' : 'Нет сохранённых организаций' }}</p>
            <RouterLink to="/organizations" class="btn btn-primary btn-sm">{{ lang==='kaz' ? 'Ұйымдарды шолу' : 'Найти организации' }}</RouterLink>
          </div>
          <div v-else class="saved-orgs-grid">
            <div v-for="org in savedOrgsList" :key="org.id" class="saved-org-card" @click="openOrg(org)">
              <div class="saved-org-avatar">{{ org.name.charAt(0) }}</div>
              <div class="saved-org-info">
                <div class="saved-org-name">{{ lang==='kaz' ? org.nameKaz : org.nameRus }}</div>
                <div class="saved-org-cat">{{ lang==='kaz' ? org.categoryLabel?.kaz : org.categoryLabel?.rus }}</div>
                <div class="saved-org-addr">📍 {{ org.address }}</div>
              </div>
              <div class="saved-org-actions">
                <span v-if="org.verified" class="mini-verified">✓</span>
                <button class="unsave-btn" @click.stop="authStore.toggleSaveOrg(org.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── TAB: Activity ── -->
        <div v-else-if="activeTab === 'activity'" class="tab-content">
          <div class="tab-section-header">
            <h2 class="info-box-title">{{ lang==='kaz' ? 'Белсенділік' : 'Активность' }}</h2>
          </div>
          <div class="activity-grid">
            <!-- Liked news -->
            <div class="activity-card">
              <div class="activity-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <h3>{{ lang==='kaz' ? 'Ұнатылған жаңалықтар' : 'Понравившиеся новости' }}</h3>
              </div>
              <div v-if="likedNewsList.length === 0" class="activity-empty">
                <p>{{ lang==='kaz' ? 'Ұнатылған жаңалықтар жоқ' : 'Нет понравившихся новостей' }}</p>
                <RouterLink to="/news" class="btn btn-outline btn-sm">{{ lang==='kaz' ? 'Жаңалықтарға өту' : 'Перейти к новостям' }}</RouterLink>
              </div>
              <div v-else class="liked-news-list">
                <RouterLink v-for="n in likedNewsList" :key="n.id" :to="`/news/${n.id}`" class="liked-news-item">
                  <img v-if="n.image" :src="n.image" class="liked-news-img" />
                  <div class="liked-news-placeholder" v-else>📰</div>
                  <div class="liked-news-info">
                    <div class="liked-news-title">{{ lang==='kaz' ? n.titleKaz : n.title }}</div>
                    <div class="liked-news-date">{{ formatDate(n.date) }}</div>
                  </div>
                </RouterLink>
              </div>
            </div>
            <!-- AI chat history -->
            <div class="activity-card">
              <div class="activity-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <h3>{{ lang==='kaz' ? 'AI чат тарихы' : 'История AI чатов' }}</h3>
              </div>
              <div v-if="authStore.savedChats.length === 0" class="activity-empty">
                <p>{{ lang==='kaz' ? 'Сақталған чаттар жоқ' : 'Нет сохранённых чатов' }}</p>
                <RouterLink to="/ai-assistant" class="btn btn-outline btn-sm">{{ lang==='kaz' ? 'Ассистентке жазу' : 'Открыть ассистента' }}</RouterLink>
              </div>
              <div v-else class="chats-list">
                <div v-for="(chat, i) in authStore.savedChats.slice(0,5)" :key="i" class="chat-history-item">
                  <div class="chi-icon">🤖</div>
                  <div class="chi-text">
                    <div class="chi-q">{{ chat.question }}</div>
                    <div class="chi-ans">{{ chat.answer?.slice(0,80) }}...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── TAB: Rides (InvaTaxi) ── -->
        <div v-else-if="activeTab === 'rides'" class="tab-content">
          <div class="tab-section-header">
            <h2 class="info-box-title">{{ lang==='kaz' ? 'ИнваТакси тапсырыстарым' : 'Мои заявки ИнваТакси' }}</h2>
            <RouterLink to="/inva-taxi" class="btn btn-primary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {{ lang==='kaz' ? 'Жаңа тапсырыс' : 'Новая заявка' }}
            </RouterLink>
          </div>
          <div v-if="taxiBookings.length === 0" class="empty-tab">
            <div class="empty-tab-icon">🚐</div>
            <p>{{ lang==='kaz' ? 'Тапсырыстар жоқ' : 'У вас пока нет заявок' }}</p>
            <RouterLink to="/inva-taxi" class="btn btn-primary btn-sm">{{ lang==='kaz' ? 'Тапсырыс беру' : 'Заказать поездку' }}</RouterLink>
          </div>
          <div v-else class="rides-list">
            <RouterLink
              v-for="b in taxiBookings"
              :key="b.id"
              to="/inva-taxi"
              class="ride-item"
              :class="'ride-' + b.status.toLowerCase()"
            >
              <span class="ride-status-dot"></span>
              <div class="ride-route">
                <span class="ride-from">{{ b.fromAddress }}</span>
                <span class="ride-arrow">→</span>
                <span class="ride-to">{{ b.toAddress }}</span>
              </div>
              <span class="ride-status-badge" :class="'badge-' + b.status.toLowerCase()">{{ statusLabel(b.status) }}</span>
              <span class="ride-date">{{ formatDate(b.scheduledAt) }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </template>

    <!-- Org modal -->
    <OrgModal v-if="selectedOrg" :org="selectedOrg" @close="selectedOrg=null" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { getMyProfile, updateMyProfile, uploadAvatar } from '../api/profile.js'
import { getMyBookings } from '../api/taxi.js'
import { getNews } from '../api/news.js'
import orgData from '../mock/organizations.json'
import OrgModal from '../components/OrgModal.vue'

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const lang = computed(() => a11y.lang)

// ── Profile data ─────────────────────────────────────────────────────────────
const profile = ref({ ...authStore.user })
const editMode = ref(false)
const saveLoading = ref(false)
const saveSuccess = ref(false)
const avatarLoading = ref(false)

const editForm = ref({
  firstName: '', lastName: '', phone: '',
  bio: '', bioKaz: '', disabilityType: ''
})

const initials = computed(() => {
  const f = profile.value.firstName?.[0] || ''
  const l = profile.value.lastName?.[0] || ''
  return (f + l).toUpperCase() || '?'
})

function startEdit() {
  editForm.value = {
    firstName: profile.value.firstName || '',
    lastName: profile.value.lastName || '',
    phone: profile.value.phone || '',
    bio: profile.value.bio || '',
    bioKaz: profile.value.bioKaz || '',
    disabilityType: profile.value.disabilityType || ''
  }
  editMode.value = true
}

watch(() => editMode.value, (val) => { if (val) startEdit() })

const handleSaveProfile = async () => {
  saveLoading.value = true
  try {
    const updated = await updateMyProfile(authStore.accessToken, editForm.value)
    profile.value = updated
    authStore.updateLocalUser(editForm.value)
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false; editMode.value = false }, 1500)
  } catch (e) { console.error(e) }
  finally { saveLoading.value = false }
}

const handleAvatarUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  avatarLoading.value = true
  try {
    const result = await uploadAvatar(authStore.accessToken, file)
    profile.value = { ...profile.value, avatar: result.avatar }
    authStore.updateLocalUser({ avatar: result.avatar })
  } finally { avatarLoading.value = false }
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const activeTab = ref('info')
const profileTabs = computed(() => [
  { id: 'info', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: lang.value==='kaz' ? 'Профиль' : 'Профиль' },
  { id: 'saved', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', label: lang.value==='kaz' ? 'Сақталған' : 'Избранное' },
  { id: 'activity', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', label: lang.value==='kaz' ? 'Белсенділік' : 'Активность' },
  { id: 'rides', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>', label: 'ИнваТакси' }
])

// ── Saved orgs ────────────────────────────────────────────────────────────────
const selectedOrg = ref(null)
const savedOrgsList = computed(() =>
  orgData.filter(o => authStore.savedOrgs.includes(o.id))
)
function openOrg(org) { selectedOrg.value = org }

// ── Liked news ────────────────────────────────────────────────────────────────
const allNews = ref([])
const likedNewsList = computed(() => allNews.value.filter((_, i) => i < 3))

// ── Taxi bookings ─────────────────────────────────────────────────────────────
const taxiBookings = ref([])

onMounted(async () => {
  if (authStore.isAuthenticated) {
    const [fullProfile, news, bookings] = await Promise.all([
      getMyProfile(authStore.accessToken).catch(() => authStore.user),
      getNews(),
      getMyBookings().catch(() => [])
    ])
    profile.value = fullProfile || authStore.user
    allNews.value = news
    taxiBookings.value = bookings
  }
})

// ── Password change ───────────────────────────────────────────────────────────
const showChangePass = ref(false)
const passForm = ref({ current: '', newPass: '', confirm: '' })
const passError = ref('')
const passSuccess = ref(false)

function handleChangePass() {
  passError.value = ''
  if (!passForm.value.current) { passError.value = lang.value==='kaz' ? 'Ағымдағы құпия сөзді енгізіңіз' : 'Введите текущий пароль'; return }
  if (passForm.value.newPass.length < 8) { passError.value = lang.value==='kaz' ? 'Кем дегенде 8 символ' : 'Минимум 8 символов'; return }
  if (passForm.value.newPass !== passForm.value.confirm) { passError.value = lang.value==='kaz' ? 'Құпия сөздер сәйкес емес' : 'Пароли не совпадают'; return }
  passSuccess.value = true
  passForm.value = { current: '', newPass: '', confirm: '' }
  setTimeout(() => { passSuccess.value = false; showChangePass.value = false }, 2000)
}

// ── Deactivate ────────────────────────────────────────────────────────────────
function confirmDeactivate() {
  const msg = lang.value==='kaz' ? 'Аккаунтты шынымен деактивациялайсыз ба?' : 'Вы уверены, что хотите деактивировать аккаунт?'
  if (confirm(msg)) {
    authStore.logout()
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const disabilityTypes = [
  { value: 'WHEELCHAIR', icon: '♿', nameKaz: 'Арба', nameRus: 'Колясочник' },
  { value: 'VISUAL', icon: '👁', nameKaz: 'Көру', nameRus: 'Зрение' },
  { value: 'HEARING', icon: '👂', nameKaz: 'Есту', nameRus: 'Слух' },
  { value: 'MENTAL', icon: '🧠', nameKaz: 'Психикалық', nameRus: 'Ментальное' },
  { value: 'SPEECH', icon: '🗣', nameKaz: 'Сөйлеу', nameRus: 'Речь' },
  { value: 'MUSCULOSKELETAL', icon: '🦽', nameKaz: 'ОДА', nameRus: 'ОДА' },
  { value: 'OTHER', icon: '📋', nameKaz: 'Басқа', nameRus: 'Другое' }
]

function disabilityLabelLocal(type) {
  const d = disabilityTypes.find(d => d.value === type)
  return d ? (lang.value==='kaz' ? d.nameKaz : d.nameRus) : type
}
function disabilityIcon(type) {
  return disabilityTypes.find(d => d.value === type)?.icon || ''
}
function roleLabelLocal(role) {
  const map = { ADMIN: 'Администратор', MODERATOR: 'Модератор', TAXI_MANAGER: 'Менеджер ИнваТакси', USER: lang.value==='kaz' ? 'Пайдаланушы' : 'Пользователь', RELATIVE: lang.value==='kaz' ? 'Қамқоршы' : 'Опекун' }
  return map[role] || role
}
function statusLabel(s) {
  const m = { PENDING: lang.value==='kaz'?'Күтуде':'Ожидает', CONFIRMED: lang.value==='kaz'?'Расталды':'Подтверждена', IN_PROGRESS: lang.value==='kaz'?'Жолда':'В пути', COMPLETED: lang.value==='kaz'?'Аяқталды':'Завершена', CANCELLED: lang.value==='kaz'?'Бас тартылды':'Отменена' }
  return m[s] || s
}
function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', { day:'2-digit', month:'short', year:'numeric' })
}

import { watch } from 'vue'
</script>

<style scoped>
/* ── Not auth ── */
.not-auth-screen { display: flex; justify-content: center; align-items: center; min-height: 60vh; padding: 32px; }
.not-auth-card { background: white; border-radius: var(--radius-xl); padding: 48px 40px; text-align: center; max-width: 400px; box-shadow: var(--shadow-lg); }
.not-auth-icon { font-size: 48px; margin-bottom: 16px; }
.not-auth-card h2 { font-size: var(--fs-xl); font-weight: 800; color: var(--black); margin-bottom: 8px; }
.not-auth-card p { color: var(--gray-500); font-size: var(--fs-sm); margin-bottom: 24px; }
.not-auth-btns { display: flex; gap: 12px; justify-content: center; }

/* ── Profile Hero ── */
.profile-hero { background: linear-gradient(135deg, #0A1628 0%, #1a3a6b 100%); padding: 40px 0; }
.profile-hero-inner { display: flex; align-items: center; gap: 28px; flex-wrap: wrap; }
.avatar-wrap { position: relative; flex-shrink: 0; }
.avatar-circle { width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), #0ea5e9); border: 3px solid rgba(255,255,255,0.3); overflow: hidden; display: flex; align-items: center; justify-content: center; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initials { font-size: 32px; font-weight: 900; color: white; }
.avatar-upload-btn { position: absolute; bottom: 0; right: 0; width: 28px; height: 28px; background: white; border-radius: 50%; border: 2px solid var(--gray-200); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--primary); transition: all var(--transition); }
.avatar-upload-btn:hover { background: var(--primary); color: white; }
.avatar-file-input { display: none; }
.avatar-loading { position: absolute; inset: 0; background: rgba(0,0,0,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.profile-hero-info { flex: 1; min-width: 200px; }
.profile-name { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; color: white; margin-bottom: 10px; }
.profile-hero-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.role-badge { padding: 3px 12px; border-radius: var(--radius-full); font-size: var(--fs-xs); font-weight: 700; }
.role-admin { background: rgba(239,68,68,0.2); color: #FCA5A5; border: 1px solid rgba(239,68,68,0.3); }
.role-moderator { background: rgba(245,158,11,0.2); color: #FCD34D; border: 1px solid rgba(245,158,11,0.3); }
.role-taxi_manager { background: rgba(34,197,94,0.2); color: #86EFAC; border: 1px solid rgba(34,197,94,0.3); }
.role-user { background: rgba(59,130,246,0.2); color: #93C5FD; border: 1px solid rgba(59,130,246,0.3); }
.role-relative { background: rgba(168,85,247,0.2); color: #C4B5FD; border: 1px solid rgba(168,85,247,0.3); }
.disability-badge { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.85); padding: 3px 10px; border-radius: var(--radius-full); font-size: var(--fs-xs); font-weight: 600; border: 1px solid rgba(255,255,255,0.2); }
.joined-badge { display: flex; align-items: center; gap: 5px; color: rgba(255,255,255,0.55); font-size: var(--fs-xs); }
.profile-bio { color: rgba(255,255,255,0.7); font-size: var(--fs-sm); max-width: 400px; line-height: 1.5; }
.profile-stats { display: flex; gap: 24px; margin-left: auto; }
.pstat { text-align: center; }
.pstat-num { font-size: 2rem; font-weight: 900; color: white; line-height: 1; }
.pstat-label { font-size: var(--fs-xs); color: rgba(255,255,255,0.55); margin-top: 4px; }
@media (max-width: 600px) { .profile-stats { margin-left: 0; } }

/* ── Tabs ── */
.profile-main { padding: 28px 0 64px; }
.profile-tabs { display: flex; gap: 4px; background: var(--gray-100); border-radius: var(--radius-lg); padding: 4px; margin-bottom: 24px; overflow-x: auto; }
.profile-tab { flex: 1; min-width: max-content; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; border-radius: calc(var(--radius-lg) - 4px); font-size: var(--fs-sm); font-weight: 600; color: var(--gray-600); transition: all var(--transition); cursor: pointer; }
.profile-tab.active { background: white; color: var(--primary); box-shadow: var(--shadow); }
.tab-content { animation: fadeUp 0.2s ease; }
@keyframes fadeUp { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform:none; } }

/* ── Info tab ── */
.profile-grid { display: grid; grid-template-columns: 1fr 360px; gap: 20px; }
@media (max-width: 860px) { .profile-grid { grid-template-columns: 1fr; } }
.info-card-box, .security-card-box { background: white; border-radius: var(--radius-xl); padding: 24px; box-shadow: var(--shadow); }
.info-box-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.info-box-title { font-size: var(--fs-lg); font-weight: 800; color: var(--black); }
.edit-toggle-btn { display: flex; align-items: center; gap: 6px; font-size: var(--fs-xs); font-weight: 700; color: var(--primary); padding: 6px 12px; border: 1.5px solid var(--primary-pale); border-radius: var(--radius-full); background: var(--primary-pale); transition: all var(--transition); }
.edit-toggle-btn:hover { background: var(--primary); color: white; }
.info-fields-view { display: flex; flex-direction: column; gap: 0; }
.info-field-row { display: flex; align-items: flex-start; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--gray-100); }
.info-field-row:last-child { border-bottom: none; }
.ifl { font-size: var(--fs-xs); font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.04em; min-width: 120px; padding-top: 1px; }
.ifv { font-size: var(--fs-sm); color: var(--black); font-weight: 500; }
.edit-form { display: flex; flex-direction: column; gap: 14px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 460px) { .form-row-2 { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-label { font-size: var(--fs-xs); font-weight: 700; color: var(--gray-600); }
.form-select { cursor: pointer; }
.form-textarea { resize: vertical; min-height: 64px; }
.edit-actions { display: flex; gap: 8px; justify-content: flex-end; }
.save-success { background: #DCFCE7; color: #166534; padding: 8px 12px; border-radius: var(--radius-sm); font-size: var(--fs-xs); font-weight: 600; }

/* Security */
.security-card-box { display: flex; flex-direction: column; gap: 0; }
.security-card-box .info-box-title { margin-bottom: 16px; }
.security-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--gray-100); }
.security-item-info { display: flex; align-items: center; gap: 10px; }
.security-item-info svg { color: var(--primary); }
.sec-label { font-size: var(--fs-sm); font-weight: 700; color: var(--black); }
.sec-hint { font-size: var(--fs-xs); color: var(--gray-400); margin-top: 2px; }
.verified-tag { font-size: var(--fs-xs); font-weight: 700; color: #22C55E; background: #DCFCE7; padding: 3px 10px; border-radius: var(--radius-full); }
.change-pass-form { display: flex; flex-direction: column; gap: 8px; padding: 12px 0; border-bottom: 1px solid var(--gray-100); }
.field-error { font-size: var(--fs-xs); color: #EF4444; }
.danger-zone { margin-top: 16px; padding: 16px; background: #FEF2F2; border-radius: var(--radius-md); border: 1px solid #FECACA; }
.danger-zone-title { font-size: var(--fs-xs); font-weight: 700; color: #991B1B; margin-bottom: 10px; }
.btn-danger { font-size: var(--fs-xs); font-weight: 700; color: #DC2626; border: 1.5px solid #FECACA; padding: 7px 14px; border-radius: var(--radius-sm); background: white; cursor: pointer; transition: all var(--transition); }
.btn-danger:hover { background: #DC2626; color: white; }

/* ── Saved orgs ── */
.tab-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.empty-tab { background: white; border-radius: var(--radius-xl); padding: 48px 32px; text-align: center; box-shadow: var(--shadow); }
.empty-tab-icon { font-size: 42px; margin-bottom: 12px; }
.empty-tab p { color: var(--gray-500); font-size: var(--fs-sm); margin-bottom: 16px; }
.saved-orgs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.saved-org-card { background: white; border-radius: var(--radius-lg); padding: 16px; box-shadow: var(--shadow); display: flex; gap: 14px; align-items: flex-start; cursor: pointer; transition: all var(--transition); }
.saved-org-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.saved-org-avatar { width: 44px; height: 44px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; flex-shrink: 0; }
.saved-org-info { flex: 1; }
.saved-org-name { font-size: var(--fs-sm); font-weight: 700; color: var(--black); margin-bottom: 3px; line-height: 1.3; }
.saved-org-cat { font-size: var(--fs-xs); color: var(--primary); font-weight: 600; margin-bottom: 4px; }
.saved-org-addr { font-size: var(--fs-xs); color: var(--gray-500); }
.saved-org-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.mini-verified { background: #DCFCE7; color: #16A34A; font-size: 11px; font-weight: 800; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.unsave-btn { color: #EF4444; padding: 4px; transition: opacity var(--transition); }
.unsave-btn:hover { opacity: 0.7; }

/* ── Activity tab ── */
.activity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 700px) { .activity-grid { grid-template-columns: 1fr; } }
.activity-card { background: white; border-radius: var(--radius-xl); padding: 20px; box-shadow: var(--shadow); }
.activity-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.activity-card-header h3 { font-size: var(--fs-md); font-weight: 700; color: var(--black); }
.activity-empty { text-align: center; padding: 24px 0; display: flex; flex-direction: column; gap: 10px; align-items: center; }
.activity-empty p { font-size: var(--fs-sm); color: var(--gray-400); }
.liked-news-list { display: flex; flex-direction: column; gap: 10px; }
.liked-news-item { display: flex; gap: 10px; align-items: center; text-decoration: none; color: inherit; padding: 8px; border-radius: var(--radius-md); transition: background var(--transition); }
.liked-news-item:hover { background: var(--gray-50); }
.liked-news-img { width: 52px; height: 40px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; }
.liked-news-placeholder { width: 52px; height: 40px; background: var(--gray-100); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.liked-news-title { font-size: var(--fs-xs); font-weight: 600; color: var(--black); line-height: 1.4; }
.liked-news-date { font-size: 11px; color: var(--gray-400); margin-top: 2px; }
.chats-list { display: flex; flex-direction: column; gap: 10px; }
.chat-history-item { display: flex; gap: 10px; align-items: flex-start; padding: 10px; background: var(--gray-50); border-radius: var(--radius-md); }
.chi-icon { font-size: 18px; flex-shrink: 0; }
.chi-q { font-size: var(--fs-xs); font-weight: 700; color: var(--black); margin-bottom: 3px; }
.chi-ans { font-size: var(--fs-xs); color: var(--gray-500); line-height: 1.4; }

/* ── Rides tab ── */
.rides-list { display: flex; flex-direction: column; gap: 10px; }
.ride-item { display: flex; align-items: center; gap: 12px; background: white; border-radius: var(--radius-lg); padding: 14px 16px; box-shadow: var(--shadow); text-decoration: none; color: inherit; border-left: 4px solid var(--gray-200); transition: all var(--transition); flex-wrap: wrap; }
.ride-item:hover { box-shadow: var(--shadow-lg); }
.ride-pending { border-left-color: #F59E0B; }
.ride-confirmed { border-left-color: #3B82F6; }
.ride-completed { border-left-color: #22C55E; }
.ride-cancelled { border-left-color: #EF4444; opacity: 0.7; }
.ride-status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gray-300); flex-shrink: 0; }
.ride-route { flex: 1; display: flex; align-items: center; gap: 6px; font-size: var(--fs-sm); min-width: 0; flex-wrap: wrap; }
.ride-from, .ride-to { color: var(--black); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
.ride-arrow { color: var(--gray-400); flex-shrink: 0; }
.ride-status-badge { padding: 3px 10px; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; }
.badge-pending { background: #FEF3C7; color: #92400E; }
.badge-confirmed { background: #DBEAFE; color: #1E40AF; }
.badge-in_progress { background: #FED7AA; color: #9A3412; }
.badge-completed { background: #D1FAE5; color: #065F46; }
.badge-cancelled { background: #FEE2E2; color: #991B1B; }
.ride-date { font-size: var(--fs-xs); color: var(--gray-400); white-space: nowrap; }

/* Spinner */
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Fade */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
