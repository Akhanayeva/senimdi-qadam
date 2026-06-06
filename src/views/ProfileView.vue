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
              <img v-if="profile.avatarUrl" :src="buildAvatarUrl(profile.avatarUrl)" class="avatar-img" alt="avatar" />
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
            <p v-if="profile.bio || profile.bioKk" class="profile-bio">{{ lang==='kaz' && profile.bioKk ? profile.bioKk : profile.bio }}</p>
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
                <div v-if="profile.city" class="info-field-row">
                  <span class="ifl">{{ lang==='kaz' ? 'Қала' : 'Город' }}</span>
                  <span class="ifv">{{ profile.city }}</span>
                </div>
                <div v-if="profile.birthDate" class="info-field-row">
                  <span class="ifl">{{ lang==='kaz' ? 'Туған күні' : 'Дата рождения' }}</span>
                  <span class="ifv">{{ formatDate(profile.birthDate) }}</span>
                </div>
                <div v-if="profile.disabilityNote" class="info-field-row">
                  <span class="ifl">{{ lang==='kaz' ? 'Ескертпе' : 'Примечание' }}</span>
                  <span class="ifv">{{ profile.disabilityNote }}</span>
                </div>
                <div class="info-field-row">
                  <span class="ifl">{{ lang==='kaz' ? 'Туралы' : 'О себе' }}</span>
                  <span class="ifv">{{ (lang==='kaz' && profile.bioKk ? profile.bioKk : profile.bio) || '—' }}</span>
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
                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label">{{ lang==='kaz' ? 'Қала' : 'Город' }}</label>
                    <input v-model="editForm.city" type="text" class="form-input" placeholder="Алматы" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ lang==='kaz' ? 'Туған күні' : 'Дата рождения' }}</label>
                    <input v-model="editForm.birthDate" type="date" class="form-input" />
                  </div>
                </div>
                <div v-if="['USER','RELATIVE'].includes(profile.role)" class="form-group">
                  <label class="form-label">{{ lang==='kaz' ? 'Мүгедектік түрі' : 'Тип инвалидности' }}</label>
                  <select v-model="editForm.disabilityType" class="form-input form-select">
                    <option value="">{{ lang==='kaz' ? 'Таңдалмаған' : 'Не указано' }}</option>
                    <option v-for="d in disabilityTypes" :key="d.value" :value="d.value">{{ d.icon }} {{ lang==='kaz' ? d.nameKaz : d.nameRus }}</option>
                  </select>
                </div>
                <div v-if="editForm.disabilityType" class="form-group">
                  <label class="form-label">{{ lang==='kaz' ? 'Мүгедектік ескертпесі' : 'Примечание об инвалидности' }}</label>
                  <input v-model="editForm.disabilityNote" type="text" class="form-input" :placeholder="lang==='kaz' ? 'Мысалы: Инвалидті арба' : 'Например: Использую инвалидную коляску'" />
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
                  <button class="btn btn-primary btn-sm" :disabled="passLoading" @click="handleChangePass">
                    <span v-if="passLoading" class="spinner-sm-btn"></span>
                    {{ passLoading ? (lang==='kaz'?'Сақталуда...':'Сохранение...') : (lang==='kaz' ? 'Сақтау' : 'Сохранить') }}
                  </button>
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

              <!-- 2FA -->
              <div class="security-item">
                <div class="security-item-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  <div>
                    <div class="sec-label">{{ lang==='kaz' ? 'Екі факторлы аутентификация' : 'Двухфакторная аутентификация' }}</div>
                    <div class="sec-hint">{{ twoFaEnabled ? (lang==='kaz' ? 'Қосулы ✓' : 'Включена ✓') : (lang==='kaz' ? 'Өшірулі' : 'Отключена') }}</div>
                  </div>
                </div>
                <button class="btn btn-outline btn-sm" @click="toggle2FA">
                  {{ twoFaEnabled ? (lang==='kaz'?'Өшіру':'Отключить') : (lang==='kaz'?'Қосу':'Включить') }}
                </button>
              </div>
              <Transition name="fade">
                <div v-if="show2FASetup" class="twofa-setup">
                  <p class="twofa-hint">{{ lang==='kaz' ? 'QR-кодты Google Authenticator арқылы сканерлеңіз:' : 'Отсканируйте QR-код в Google Authenticator:' }}</p>
                  <img v-if="twoFaQr" :src="twoFaQr" class="twofa-qr" alt="QR Code" />
                  <div v-if="twoFaSecret" class="twofa-secret">{{ twoFaSecret }}</div>
                  <input v-model="twoFaCode" type="text" inputmode="numeric" maxlength="6" class="form-input twofa-input" :placeholder="lang==='kaz'?'6 таңбалы код':'6-значный код'" @keydown.enter="confirm2FA" />
                  <div v-if="twoFaError" class="field-error">{{ twoFaError }}</div>
                  <div class="twofa-actions">
                    <button class="btn btn-outline btn-sm" @click="show2FASetup=false">{{ lang==='kaz'?'Болдырмау':'Отмена' }}</button>
                    <button class="btn btn-primary btn-sm" :disabled="twoFaLoading || twoFaCode.length<6" @click="confirm2FA">
                      <span v-if="twoFaLoading" class="spinner-sm"></span>
                      {{ lang==='kaz'?'Растау':'Подтвердить' }}
                    </button>
                  </div>
                </div>
              </Transition>
              <Transition name="fade">
                <div v-if="show2FADisable" class="twofa-setup">
                  <p class="twofa-hint">{{ lang==='kaz' ? '2FA-ны өшіру үшін кодты енгізіңіз:' : 'Введите код из приложения для отключения 2FA:' }}</p>
                  <input v-model="twoFaCode" type="text" inputmode="numeric" maxlength="6" class="form-input twofa-input" :placeholder="lang==='kaz'?'6 таңбалы код':'6-значный код'" @keydown.enter="confirmDisable2FA" />
                  <div v-if="twoFaError" class="field-error">{{ twoFaError }}</div>
                  <div class="twofa-actions">
                    <button class="btn btn-outline btn-sm" @click="show2FADisable=false">{{ lang==='kaz'?'Болдырмау':'Отмена' }}</button>
                    <button class="btn btn-danger-outline btn-sm" :disabled="twoFaLoading || twoFaCode.length<6" @click="confirmDisable2FA">
                      <span v-if="twoFaLoading" class="spinner-sm"></span>
                      {{ lang==='kaz'?'Өшіру':'Отключить' }}
                    </button>
                  </div>
                </div>
              </Transition>

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
          <div v-if="savedOrgsLoading" class="empty-tab">
            <div class="spinner-sm" style="margin:0 auto 8px"></div>
            <p style="color:var(--gray-400)">{{ lang==='kaz' ? 'Жүктелуде...' : 'Загрузка...' }}</p>
          </div>
          <div v-else-if="savedOrgsList.length === 0" class="empty-tab">
            <div class="empty-tab-icon">🏢</div>
            <p>{{ lang==='kaz' ? 'Сақталған ұйымдар жоқ' : 'Нет сохранённых организаций' }}</p>
            <RouterLink to="/organizations" class="btn btn-primary btn-sm">{{ lang==='kaz' ? 'Ұйымдарды шолу' : 'Найти организации' }}</RouterLink>
          </div>
          <div v-else class="saved-orgs-grid">
            <div v-for="org in savedOrgsList" :key="org.id" class="saved-org-card" @click="openOrg(org)">
              <div class="saved-org-avatar">{{ (org.nameRu || '').charAt(0) }}</div>
              <div class="saved-org-info">
                <div class="saved-org-name">{{ lang==='kaz' ? (org.nameKk || org.nameRu) : org.nameRu }}</div>
                <div class="saved-org-cat">{{ org.category }}</div>
                <div class="saved-org-addr">📍 {{ org.address }}</div>
              </div>
              <div class="saved-org-actions">
                <span v-if="org.status === 'VERIFIED'" class="mini-verified">✓</span>
                <button class="unsave-btn" @click.stop="handleUnsaveOrg(org.id)">
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
                  <img v-if="n.imageUrl" :src="newsImageUrl(n.imageUrl)" class="liked-news-img" />
                  <div class="liked-news-placeholder" v-else>📰</div>
                  <div class="liked-news-info">
                    <div class="liked-news-title">{{ lang==='kaz' ? n.titleKk : n.titleRu }}</div>
                    <div class="liked-news-date">{{ formatDate(n.publishedAt) }}</div>
                  </div>
                </RouterLink>
              </div>
            </div>
            <!-- Liked guides -->
            <div class="activity-card">
              <div class="activity-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <h3>{{ lang==='kaz' ? 'Ұнатылған нұсқаулықтар' : 'Понравившиеся гайды' }}</h3>
              </div>
              <div v-if="likedGuidesList.length === 0" class="activity-empty">
                <p>{{ lang==='kaz' ? 'Ұнатылған нұсқаулықтар жоқ' : 'Нет понравившихся гайдов' }}</p>
                <RouterLink to="/guides" class="btn btn-outline btn-sm">{{ lang==='kaz' ? 'Нұсқаулықтарға өту' : 'Перейти к гайдам' }}</RouterLink>
              </div>
              <div v-else class="liked-news-list">
                <RouterLink v-for="g in likedGuidesList" :key="g.id" :to="`/guides`" class="liked-news-item">
                  <div class="liked-news-placeholder">📖</div>
                  <div class="liked-news-info">
                    <div class="liked-news-title">{{ lang==='kaz' ? (g.titleKk || g.titleRu) : (g.titleRu || g.title) }}</div>
                    <div class="liked-news-date">{{ formatDate(g.publishedAt || g.createdAt) }}</div>
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

        <!-- ── TAB: Relative Links ── -->
        <div v-else-if="activeTab === 'links'" class="tab-content">
          <div class="tab-section-header">
            <h2 class="info-box-title">{{ lang==='kaz' ? 'Туысқан / қамқоршы байланыстары' : 'Связи с родственниками / опекунами' }}</h2>
          </div>
          <p class="links-description">
            {{ lang==='kaz'
              ? 'Сізді туысқандарыңызбен немесе қамқоршыларыңызбен байланыстырады. Олар сіздің профиліңізді қарай алады және қажет болса көмек бере алады.'
              : 'Позволяет связать ваш профиль с профилями родственников или опекунов. Они смогут видеть вашу основную информацию и при необходимости помогать вам.' }}
          </p>

          <!-- Request new link -->
          <div class="link-request-form">
            <h3 class="link-form-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {{ lang==='kaz' ? 'Байланыс сұрату' : 'Запросить связь' }}
            </h3>
            <div class="link-form-row">
              <input
                v-model="linkEmail"
                type="email"
                class="form-input"
                :placeholder="lang==='kaz' ? 'Пайдаланушының email мекенжайы' : 'Email адрес пользователя'"
                @keydown.enter="handleRequestLink"
              />
              <button
                class="btn btn-primary btn-sm"
                :disabled="!linkEmail.trim() || linkRequestLoading"
                @click="handleRequestLink"
              >
                <span v-if="linkRequestLoading" class="spinner-sm"></span>
                {{ lang==='kaz' ? 'Жіберу' : 'Отправить' }}
              </button>
            </div>
            <Transition name="fade">
              <div v-if="linkRequestSuccess" class="save-success">
                ✅ {{ lang==='kaz' ? 'Сұраныс жіберілді!' : 'Запрос отправлен!' }}
              </div>
            </Transition>
            <div v-if="linkRequestError" class="field-error">{{ linkRequestError }}</div>
          </div>

          <!-- Links list -->
          <div v-if="linksLoading" class="links-loading">
            <span class="spinner-sm"></span>
          </div>
          <div v-else-if="relativeLinks.length === 0" class="empty-tab">
            <div class="empty-tab-icon">🤝</div>
            <p>{{ lang==='kaz' ? 'Байланыстар жоқ' : 'Нет связей' }}</p>
          </div>
          <div v-else class="links-list">
            <div
              v-for="link in relativeLinks"
              :key="link.id"
              class="link-item"
            >
              <div class="link-avatar">{{ (link.relatedUser?.firstName || '?').charAt(0) }}</div>
              <div class="link-info">
                <div class="link-name">
                  {{ link.relatedUser?.firstName }} {{ link.relatedUser?.lastName }}
                  <span v-if="link.relatedUser?.city" class="link-city">· {{ link.relatedUser.city }}</span>
                </div>
                <div class="link-email">{{ link.relatedUser?.email }}</div>
                <div class="link-role">{{ roleLabelLocal(link.relatedUser?.role) }}</div>
              </div>
              <div class="link-actions">
                <span class="link-status-badge" :class="'link-status-' + link.status.toLowerCase()">
                  {{ linkStatusLabel(link.status) }}
                </span>
                <button
                  v-if="link.status === 'PENDING' && link.direction === 'incoming'"
                  class="btn btn-primary btn-sm"
                  @click="handleAcceptLink(link.id)"
                >
                  {{ lang==='kaz' ? 'Қабылдау' : 'Принять' }}
                </button>
                <button class="btn-danger-sm" @click="handleDeleteLink(link.id)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── TAB: My News ── -->
        <div v-else-if="activeTab === 'mynews'" class="tab-content">
          <div class="tab-section-header">
            <h2 class="info-box-title">{{ lang==='kaz' ? 'Менің жаңалықтарым' : 'Мои новости' }}</h2>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <div class="mynews-filter">
                <button
                  v-for="f in newsFilters"
                  :key="f.value"
                  class="mynews-filter-btn"
                  :class="{ active: myNewsFilter === f.value }"
                  @click="myNewsFilter = f.value"
                >{{ lang==='kaz' ? f.labelKk : f.labelRu }}</button>
              </div>
              <button class="btn btn-primary btn-sm" @click="openCreateNews">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {{ lang==='kaz' ? 'Жаңалық жазу' : 'Написать новость' }}
              </button>
            </div>
          </div>
          <div v-if="myNewsLoading" class="empty-tab">
            <span class="spinner-sm" style="margin:0 auto"></span>
          </div>
          <div v-else-if="myNewsFiltered.length === 0" class="empty-tab">
            <div class="empty-tab-icon">📰</div>
            <p>{{ lang==='kaz' ? 'Жаңалықтар жоқ' : 'Нет новостей' }}</p>
            <button class="btn btn-primary btn-sm" @click="openCreateNews">
              {{ lang==='kaz' ? 'Алғашқы жаңалықты жазыңыз' : 'Написать первую новость' }}
            </button>
          </div>
          <div v-else class="mynews-list">
            <div
              v-for="n in myNewsFiltered"
              :key="n.id"
              class="mynews-item"
            >
              <img v-if="n.imageUrl" :src="newsImageUrl(n.imageUrl)" class="mynews-img" :alt="n.titleRu" />
              <div class="mynews-placeholder" v-else>📰</div>
              <div class="mynews-info">
                <div class="mynews-title">{{ lang==='kaz' ? n.titleKk : n.titleRu }}</div>
                <div class="mynews-meta">
                  <span class="mynews-date">{{ formatDate(n.publishedAt || n.createdAt) }}</span>
                  <span class="mynews-stat">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {{ n.likesCount || 0 }}
                  </span>
                  <span class="mynews-stat">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    {{ n.commentsCount || 0 }}
                  </span>
                </div>
              </div>
              <div class="mynews-actions">
                <span class="mynews-status-badge" :class="'mynews-status-' + (n.status||'').toLowerCase()">
                  {{ newsStatusLabel(n.status) }}
                </span>
                <button
                  v-if="n.status === 'DRAFT' || n.status === 'REJECTED'"
                  class="mynews-edit-btn"
                  @click="openEditNews(n)"
                  title="Редактировать"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button
                  v-if="n.status === 'DRAFT' || n.status === 'REJECTED'"
                  class="mynews-delete-btn"
                  :disabled="deletingNewsId === n.id"
                  @click="deleteMyNewsItem(n)"
                  title="Удалить"
                >
                  <svg v-if="deletingNewsId !== n.id" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  <span v-else class="spinner-sm-del"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- ── TAB: Requests (tickets + complaints) ── -->
        <div v-else-if="activeTab === 'requests'" class="tab-content">
          <div class="admin-tabs" style="margin-bottom:20px">
            <button class="admin-tab" :class="{active: reqTab==='tickets'}" @click="reqTab='tickets'">
              {{ lang==='kaz' ? 'Өтінімдер' : 'Обращения' }}
              <span v-if="myTickets.length" class="tab-count-sm">{{ myTickets.length }}</span>
            </button>
            <button class="admin-tab" :class="{active: reqTab==='complaints'}" @click="reqTab='complaints'">
              {{ lang==='kaz' ? 'Шағымдар' : 'Жалобы' }}
              <span v-if="myComplaints.length" class="tab-count-sm">{{ myComplaints.length }}</span>
            </button>
          </div>

          <!-- Tickets -->
          <div v-if="reqTab==='tickets'">
            <div v-if="reqLoading" class="empty-tab"><span class="spinner-sm" style="margin:0 auto"></span></div>
            <div v-else-if="myTickets.length === 0" class="empty-tab">
              <div class="empty-tab-icon">📭</div>
              <p>{{ lang==='kaz' ? 'Өтінімдер жоқ' : 'Обращений пока нет' }}</p>
              <RouterLink to="/help" class="btn btn-primary btn-sm">{{ lang==='kaz' ? 'Өтінім жіберу' : 'Написать обращение' }}</RouterLink>
            </div>
            <div v-else class="req-items-list">
              <div v-for="t in myTickets" :key="t.id" class="req-item-card">
                <div class="req-item-header">
                  <span class="req-item-subject">{{ t.subject }}</span>
                  <span class="req-item-badge" :class="ticketStatusClass(t.status)">{{ ticketStatusLabel(t.status) }}</span>
                </div>
                <p class="req-item-body">{{ t.body }}</p>
                <div class="req-item-footer">
                  <span class="req-item-date">📅 {{ formatDate(t.createdAt) }}</span>
                  <span v-if="t.response" class="req-item-response">💬 {{ t.response }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Complaints -->
          <div v-if="reqTab==='complaints'">
            <div v-if="reqLoading" class="empty-tab"><span class="spinner-sm" style="margin:0 auto"></span></div>
            <div v-else-if="myComplaints.length === 0" class="empty-tab">
              <div class="empty-tab-icon">🔕</div>
              <p>{{ lang==='kaz' ? 'Шағымдар жоқ' : 'Жалоб пока нет' }}</p>
            </div>
            <div v-else class="req-items-list">
              <div v-for="c in myComplaints" :key="c.id" class="req-item-card">
                <div class="req-item-header">
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="req-target-badge">{{ complaintTargetLabel(c.targetType) }}</span>
                    <span class="req-item-subject">{{ c.reason }}</span>
                  </div>
                  <span class="req-item-badge" :class="complaintStatusClass(c.status)">{{ complaintStatusLabel(c.status) }}</span>
                </div>
                <p v-if="c.description" class="req-item-body">{{ c.description }}</p>
                <div class="req-item-footer">
                  <span class="req-item-date">📅 {{ formatDate(c.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Org modal -->
    <OrgModal v-if="selectedOrg" :org="selectedOrg" @close="selectedOrg=null" />

    <!-- News create/edit modal -->
    <Teleport to="body">
      <div v-if="showNewsForm" class="profile-modal-overlay" @click.self="closeNewsForm">
        <div class="profile-modal">
          <div class="profile-modal-header">
            <h3>{{ editingNews ? (lang==='kaz' ? 'Жаңалықты өңдеу' : 'Редактировать новость') : (lang==='kaz' ? 'Жаңалық жазу' : 'Написать новость') }}</h3>
            <button class="profile-modal-close" @click="closeNewsForm">✕</button>
          </div>
          <div class="profile-modal-body">
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">{{ lang==='kaz' ? 'Тақырып (орысша)' : 'Заголовок (рус)' }} *</label>
                <input v-model="newsForm.titleRu" type="text" class="form-input" :placeholder="lang==='kaz'?'Тақырып орыс тілінде':'Заголовок на русском'" required />
              </div>
              <div class="form-group">
                <label class="form-label">{{ lang==='kaz' ? 'Тақырып (қазақша)' : 'Заголовок (каз)' }}</label>
                <input v-model="newsForm.titleKk" type="text" class="form-input" :placeholder="lang==='kaz'?'Тақырып қазақ тілінде':'Заголовок на казахском'" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">{{ lang==='kaz' ? 'Мазмұн (орысша)' : 'Текст (рус)' }} *</label>
              <textarea v-model="newsForm.contentRu" class="form-input form-textarea" rows="5" :placeholder="lang==='kaz'?'Мақала мәтіні...':'Текст статьи...'" required></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">{{ lang==='kaz' ? 'Мазмұн (қазақша)' : 'Текст (каз)' }}</label>
              <textarea v-model="newsForm.contentKk" class="form-input form-textarea" rows="3" :placeholder="lang==='kaz'?'Мақала мәтіні қазақша...':'Текст статьи на казахском...'" ></textarea>
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">{{ lang==='kaz' ? 'Санат' : 'Категория' }}</label>
                <select v-model="newsForm.category" class="form-input form-select">
                  <option value="">{{ lang==='kaz' ? 'Таңдалмаған' : 'Не указана' }}</option>
                  <option value="SOCIAL">{{ lang==='kaz' ? 'Әлеуметтік' : 'Социальная' }}</option>
                  <option value="MEDICAL">{{ lang==='kaz' ? 'Медицина' : 'Медицина' }}</option>
                  <option value="LEGAL">{{ lang==='kaz' ? 'Заңдық' : 'Юридическая' }}</option>
                  <option value="SPORT">{{ lang==='kaz' ? 'Спорт' : 'Спорт' }}</option>
                  <option value="CULTURE">{{ lang==='kaz' ? 'Мәдениет' : 'Культура' }}</option>
                  <option value="OTHER">{{ lang==='kaz' ? 'Басқа' : 'Другое' }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">{{ lang==='kaz' ? 'Сурет (файл)' : 'Изображение (файл)' }}</label>
                <input type="file" accept="image/*" class="form-input" style="padding:6px" @change="handleNewsImageSelect" />
                <div v-if="newsForm.imagePreview" class="news-img-preview-wrap">
                  <img :src="newsForm.imagePreview" class="news-img-preview" alt="preview" />
                </div>
              </div>
            </div>
            <div v-if="newsFormError" class="field-error">{{ newsFormError }}</div>
            <div v-if="newsFormSuccess" class="save-success">
              ✅ {{ editingNews ? (lang==='kaz'?'Сақталды!':'Сохранено!') : (lang==='kaz'?'Жіберілді модерацияға!':'Отправлено на модерацию!') }}
            </div>
          </div>
          <div class="profile-modal-footer">
            <button class="btn btn-outline btn-sm" @click="closeNewsForm" :disabled="newsFormLoading">
              {{ lang==='kaz' ? 'Болдырмау' : 'Отмена' }}
            </button>
            <button class="btn btn-primary btn-sm" :disabled="newsFormLoading || !newsForm.titleRu.trim() || !newsForm.contentRu.trim()" @click="submitNewsForm">
              <span v-if="newsFormLoading" class="spinner-sm-btn"></span>
              {{ newsFormLoading ? '...' : (editingNews ? (lang==='kaz'?'Сақтау':'Сохранить') : (lang==='kaz'?'Жіберу':'Отправить')) }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { getMyProfile, updateMyProfile, uploadAvatar, getLikedNews, getLikedGuides, getMyLinks, requestRelativeLink, acceptRelativeLink, deleteRelativeLink, deactivateAccount } from '../api/profile.js'
import { getMyBookings } from '../api/taxi.js'
import { getNews, getMyNews, createNews, updateNews, deleteNews, uploadNewsImage } from '../api/news.js'
import { newsImageUrl, avatarUrl as buildAvatarUrl } from '../api/apiClient.js'
import { getSavedOrganizations } from '../api/organizations.js'
import { getMyTickets } from '../api/tickets.js'
import { getMyComplaints } from '../api/complaints.js'
import { setup2FA, verify2FA, disable2FA, changePassword } from '../api/auth.js'
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
  city: '', birthDate: '', disabilityType: '', disabilityNote: '',
  bio: '', bioKk: ''
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
    city: profile.value.city || '',
    birthDate: profile.value.birthDate || '',
    disabilityType: profile.value.disabilityType || '',
    disabilityNote: profile.value.disabilityNote || '',
    bio: profile.value.bio || '',
    bioKk: profile.value.bioKk || ''
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
    profile.value = { ...profile.value, avatarUrl: result.avatarUrl }
    authStore.updateLocalUser({ avatarUrl: result.avatarUrl })
  } finally { avatarLoading.value = false }
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const activeTab = ref('info')
const profileTabs = computed(() => [
  { id: 'info', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: lang.value==='kaz' ? 'Профиль' : 'Профиль' },
  { id: 'saved', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', label: lang.value==='kaz' ? 'Сақталған' : 'Избранное' },
  { id: 'activity', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', label: lang.value==='kaz' ? 'Белсенділік' : 'Активность' },
  { id: 'rides', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>', label: 'ИнваТакси' },
  { id: 'links', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', label: lang.value==='kaz' ? 'Байланыстар' : 'Связи' },
  { id: 'mynews', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>', label: lang.value==='kaz' ? 'Менің жаңалықтарым' : 'Мои новости' },
  { id: 'requests', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', label: lang.value==='kaz' ? 'Өтінімдер' : 'Обращения' }
])

// ── Saved orgs ────────────────────────────────────────────────────────────────
const selectedOrg = ref(null)
// savedOrgsList is loaded from the API (not from local mock JSON)
// so it works correctly when real org IDs (UUIDs) are used
const savedOrgsList = ref([])
const savedOrgsLoading = ref(false)

async function loadSavedOrgs() {
  if (!authStore.isAuthenticated) return
  savedOrgsLoading.value = true
  try {
    const res = await getSavedOrganizations(authStore.accessToken, authStore.savedOrgs)
    savedOrgsList.value = res.items ?? []
  } catch { savedOrgsList.value = [] }
  finally { savedOrgsLoading.value = false }
}

function openOrg(org) { selectedOrg.value = org }

async function handleUnsaveOrg(orgId) {
  await authStore.toggleSaveOrg(orgId)
  // Reload saved orgs list so the removed org disappears immediately
  await loadSavedOrgs()
}

// ── Liked news ────────────────────────────────────────────────────────────────
const allNews = ref([])
const likedNewsIds = ref([])
const likedNewsList = computed(() =>
  allNews.value.filter(n => likedNewsIds.value.includes(n.id))
)

// ── Liked guides ──────────────────────────────────────────────────────────────
const likedGuidesList = ref([])

// ── Relative links ────────────────────────────────────────────────────────────
const relativeLinks = ref([])
const linksLoading = ref(false)
const linkEmail = ref('')
const linkRequestLoading = ref(false)
const linkRequestSuccess = ref(false)
const linkRequestError = ref('')

async function loadLinks() {
  linksLoading.value = true
  try {
    const res = await getMyLinks(authStore.accessToken)
    // Merge asGuardian + asDependent into one flat list for display
    relativeLinks.value = [...(res.asGuardian || []), ...(res.asDependent || [])]
  } catch {}
  finally { linksLoading.value = false }
}
async function handleRequestLink() {
  if (!linkEmail.value.trim()) return
  linkRequestLoading.value = true
  linkRequestError.value = ''
  try {
    await requestRelativeLink(authStore.accessToken, linkEmail.value.trim())
    linkEmail.value = ''
    linkRequestSuccess.value = true
    setTimeout(() => { linkRequestSuccess.value = false }, 3000)
    loadLinks()
  } catch (e) {
    linkRequestError.value = e.message || (lang.value==='kaz' ? 'Қате' : 'Ошибка')
  } finally { linkRequestLoading.value = false }
}
async function handleAcceptLink(linkId) {
  try { await acceptRelativeLink(authStore.accessToken, linkId); loadLinks() } catch {}
}
async function handleDeleteLink(linkId) {
  const msg = lang.value==='kaz' ? 'Байланысты жоюды растаңыз' : 'Подтвердите удаление связи'
  if (!confirm(msg)) return
  try { await deleteRelativeLink(authStore.accessToken, linkId); loadLinks() } catch {}
}
function linkStatusLabel(status) {
  const m = { PENDING: lang.value==='kaz'?'Күтуде':'Ожидает', ACCEPTED: lang.value==='kaz'?'Қабылданды':'Принята', REJECTED: lang.value==='kaz'?'Бас тартылды':'Отклонена' }
  return m[status] || status
}

// ── Taxi bookings ─────────────────────────────────────────────────────────────
const taxiBookings = ref([])

onMounted(async () => {
  if (authStore.isAuthenticated) {
    const [fullProfile, news, bookings, likedIds, likedGuides] = await Promise.all([
      getMyProfile(authStore.accessToken).catch(() => authStore.user),
      getNews(),
      getMyBookings().catch(() => []),
      getLikedNews(authStore.accessToken).catch(() => []),
      getLikedGuides().catch(() => [])
    ])
    profile.value = fullProfile || authStore.user
    allNews.value = (news?.items ?? news) || []
    taxiBookings.value = Array.isArray(bookings) ? bookings : []
    likedNewsIds.value = Array.isArray(likedIds) ? likedIds : []
    likedGuidesList.value = Array.isArray(likedGuides) ? likedGuides : (likedGuides?.items ?? [])
    twoFaEnabled.value = !!fullProfile?.twoFaEnabled
    loadLinks()
    loadSavedOrgs()
    loadMyRequests()
  }
})

// ── Password change ───────────────────────────────────────────────────────────
const showChangePass = ref(false)
const passForm = ref({ current: '', newPass: '', confirm: '' })
const passError = ref('')
const passSuccess = ref(false)
const passLoading = ref(false)

async function handleChangePass() {
  passError.value = ''
  if (!passForm.value.current) { passError.value = lang.value==='kaz' ? 'Ағымдағы құпия сөзді енгізіңіз' : 'Введите текущий пароль'; return }
  if (passForm.value.newPass.length < 8) { passError.value = lang.value==='kaz' ? 'Кем дегенде 8 символ' : 'Минимум 8 символов'; return }
  if (passForm.value.newPass !== passForm.value.confirm) { passError.value = lang.value==='kaz' ? 'Құпия сөздер сәйкес емес' : 'Пароли не совпадают'; return }
  passLoading.value = true
  try {
    await changePassword(passForm.value.current, passForm.value.newPass)
    passSuccess.value = true
    passForm.value = { current: '', newPass: '', confirm: '' }
    setTimeout(() => { passSuccess.value = false; showChangePass.value = false }, 2000)
  } catch (e) {
    passError.value = e.message || (lang.value==='kaz' ? 'Қате болды' : 'Ошибка смены пароля')
  } finally {
    passLoading.value = false
  }
}

// ── Deactivate ────────────────────────────────────────────────────────────────
async function confirmDeactivate() {
  const msg = lang.value==='kaz'
    ? 'Аккаунтты шынымен деактивациялайсыз ба? Бұл қайтарылмайды.'
    : 'Вы уверены? Аккаунт будет деактивирован и восстановить его будет невозможно.'
  if (!confirm(msg)) return
  try {
    await deactivateAccount()
  } catch {}
  authStore.logout()
}

// ── 2FA ───────────────────────────────────────────────────────────────────────
const twoFaEnabled = ref(false)
const show2FASetup = ref(false)
const show2FADisable = ref(false)
const twoFaQr = ref('')
const twoFaSecret = ref('')
const twoFaCode = ref('')
const twoFaError = ref('')
const twoFaLoading = ref(false)

async function toggle2FA() {
  twoFaError.value = ''
  twoFaCode.value = ''
  if (twoFaEnabled.value) {
    show2FASetup.value = false
    show2FADisable.value = true
  } else {
    show2FADisable.value = false
    twoFaLoading.value = true
    try {
      const res = await setup2FA()
      twoFaQr.value = res.qrCode || ''
      twoFaSecret.value = res.secret || ''
      show2FASetup.value = true
    } catch (e) {
      twoFaError.value = e.message || (lang.value==='kaz'?'Қате':'Ошибка')
    } finally { twoFaLoading.value = false }
  }
}

async function confirm2FA() {
  if (twoFaCode.value.length < 6) return
  twoFaLoading.value = true
  twoFaError.value = ''
  try {
    await verify2FA(twoFaCode.value)
    twoFaEnabled.value = true
    show2FASetup.value = false
    twoFaCode.value = ''
  } catch (e) {
    twoFaError.value = e.message || (lang.value==='kaz'?'Қате код':'Неверный код')
  } finally { twoFaLoading.value = false }
}

async function confirmDisable2FA() {
  if (twoFaCode.value.length < 6) return
  twoFaLoading.value = true
  twoFaError.value = ''
  try {
    await disable2FA(twoFaCode.value)
    twoFaEnabled.value = false
    show2FADisable.value = false
    twoFaCode.value = ''
  } catch (e) {
    twoFaError.value = e.message || (lang.value==='kaz'?'Қате код':'Неверный код')
  } finally { twoFaLoading.value = false }
}

// ── My requests (tickets + complaints) ───────────────────────────────────────
const reqTab = ref('tickets')
const myTickets = ref([])
const myComplaints = ref([])
const reqLoading = ref(false)

async function loadMyRequests() {
  reqLoading.value = true
  try {
    const [tickets, complaints] = await Promise.all([
      getMyTickets().catch(() => []),
      getMyComplaints().catch(() => [])
    ])
    myTickets.value = Array.isArray(tickets) ? tickets : (tickets?.items ?? [])
    myComplaints.value = Array.isArray(complaints) ? complaints : (complaints?.items ?? [])
  } finally { reqLoading.value = false }
}

function ticketStatusLabel(s) {
  const m = { OPEN: lang.value==='kaz'?'Ашық':'Открыто', IN_PROGRESS: lang.value==='kaz'?'Қаралуда':'В работе', RESOLVED: '✓ '+(lang.value==='kaz'?'Шешілді':'Решено'), CLOSED: lang.value==='kaz'?'Жабылды':'Закрыто' }
  return m[s] || s
}
function ticketStatusClass(s) {
  return { OPEN: 'badge-open', IN_PROGRESS: 'badge-inprogress', RESOLVED: 'badge-resolved', CLOSED: 'badge-closed' }[s] || ''
}
function complaintStatusLabel(s) {
  const m = { OPEN: lang.value==='kaz'?'Ашық':'Открыта', UNDER_REVIEW: lang.value==='kaz'?'Қаралуда':'На рассмотрении', RESOLVED: '✓ '+(lang.value==='kaz'?'Шешілді':'Решена'), DISMISSED: lang.value==='kaz'?'Қабылданбады':'Отклонена' }
  return m[s] || s
}
function complaintStatusClass(s) {
  return { OPEN: 'badge-open', UNDER_REVIEW: 'badge-inprogress', RESOLVED: 'badge-resolved', DISMISSED: 'badge-closed' }[s] || ''
}
function complaintTargetLabel(t) {
  return { Organization: '🏢', News: '📰', User: '👤' }[t] || t
}

// ── Helpers ───────────────────────────────────────────────────────────────────
// Profile disabilityType (per API): VISUAL | HEARING | MOBILITY | COGNITIVE | SPEECH | OTHER
// (different from taxi booking types which also include WHEELCHAIR)
const disabilityTypes = [
  { value: 'VISUAL',    icon: '👁',  nameKaz: 'Көру',           nameRus: 'Нарушение зрения' },
  { value: 'HEARING',   icon: '👂',  nameKaz: 'Есту',           nameRus: 'Нарушение слуха' },
  { value: 'MOBILITY',  icon: '♿',  nameKaz: 'Қозғалыс',       nameRus: 'Нарушение подвижности' },
  { value: 'COGNITIVE', icon: '🧠',  nameKaz: 'Когнитивті',     nameRus: 'Когнитивные особенности' },
  { value: 'SPEECH',    icon: '🗣',  nameKaz: 'Сөйлеу',         nameRus: 'Нарушение речи' },
  { value: 'OTHER',     icon: '📋',  nameKaz: 'Басқа',          nameRus: 'Другое' }
]

function disabilityLabelLocal(type) {
  const d = disabilityTypes.find(d => d.value === type)
  return d ? (lang.value==='kaz' ? d.nameKaz : d.nameRus) : type
}
function disabilityIcon(type) {
  return disabilityTypes.find(d => d.value === type)?.icon || ''
}
function roleLabelLocal(role) {
  const l = lang.value
  const map = {
    ADMIN:        'Администратор',
    MODERATOR:    'Модератор',
    TAXI_MANAGER: 'Менеджер ИнваТакси',
    ORG_MANAGER:  'Менеджер организации',
    USER:         l === 'kaz' ? 'Пайдаланушы' : 'Пользователь',
    RELATIVE:     l === 'kaz' ? 'Қамқоршы / Туысқан' : 'Опекун / Родственник'
  }
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

// ── My News ───────────────────────────────────────────────────────────────────
const myNewsList = ref([])
const myNewsLoading = ref(false)
const myNewsFilter = ref('ALL')

const newsFilters = [
  { value: 'ALL',       labelRu: 'Все',           labelKk: 'Барлығы' },
  { value: 'PUBLISHED', labelRu: 'Опубликованные', labelKk: 'Жарияланған' },
  { value: 'PENDING',   labelRu: 'На проверке',    labelKk: 'Тексерілуде' },
  { value: 'REJECTED',  labelRu: 'Отклонённые',    labelKk: 'Қабылданбаған' }
]

const myNewsFiltered = computed(() => {
  if (myNewsFilter.value === 'ALL') return myNewsList.value
  return myNewsList.value.filter(n => n.status === myNewsFilter.value)
})

function newsStatusLabel(status) {
  const m = {
    PUBLISHED: lang.value === 'kaz' ? 'Жарияланды'      : 'Опубликовано',
    PENDING:   lang.value === 'kaz' ? 'Тексерілуде'      : 'На проверке',
    REJECTED:  lang.value === 'kaz' ? 'Қабылданбады'     : 'Отклонено',
    DRAFT:     lang.value === 'kaz' ? 'Жоба'             : 'Черновик'
  }
  return m[status] || status
}

async function loadMyNews() {
  myNewsLoading.value = true
  try {
    const res = await getMyNews(authStore.accessToken)
    myNewsList.value = res.items || []
  } catch {}
  finally { myNewsLoading.value = false }
}

const deletingNewsId = ref(null)

async function deleteMyNewsItem(n) {
  if (!confirm(lang.value==='kaz' ? 'Жаңалықты жою керек пе?' : 'Удалить эту новость?')) return
  deletingNewsId.value = n.id
  try {
    await deleteNews(authStore.accessToken, n.id)
    myNewsList.value = myNewsList.value.filter(x => x.id !== n.id)
  } catch (e) {
    alert(e.message || 'Ошибка удаления')
  } finally {
    deletingNewsId.value = null
  }
}

// ── News create / edit ────────────────────────────────────────────────────────
const showNewsForm = ref(false)
const editingNews = ref(null) // null = create mode, object = edit mode
const newsFormLoading = ref(false)
const newsFormError = ref('')
const newsFormSuccess = ref(false)
const newsImageFile = ref(null)

function emptyNewsForm() {
  return { titleRu: '', titleKk: '', contentRu: '', contentKk: '', category: '', imagePreview: '' }
}
const newsForm = ref(emptyNewsForm())

function openCreateNews() {
  editingNews.value = null
  newsForm.value = emptyNewsForm()
  newsImageFile.value = null
  newsFormError.value = ''
  newsFormSuccess.value = false
  showNewsForm.value = true
}

function openEditNews(n) {
  editingNews.value = n
  newsForm.value = {
    titleRu: n.titleRu || '',
    titleKk: n.titleKk || '',
    contentRu: n.contentRu || n.content || '',
    contentKk: n.contentKk || '',
    category: n.category || '',
    imagePreview: n.imageUrl ? newsImageUrl(n.imageUrl) : ''
  }
  newsImageFile.value = null
  newsFormError.value = ''
  newsFormSuccess.value = false
  showNewsForm.value = true
}

function closeNewsForm() {
  showNewsForm.value = false
  editingNews.value = null
  newsImageFile.value = null
}

function handleNewsImageSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return
  newsImageFile.value = file
  newsForm.value.imagePreview = URL.createObjectURL(file)
}

async function submitNewsForm() {
  newsFormError.value = ''
  if (!newsForm.value.titleRu.trim()) { newsFormError.value = lang.value==='kaz'?'Тақырыпты енгізіңіз':'Введите заголовок'; return }
  if (!newsForm.value.contentRu.trim()) { newsFormError.value = lang.value==='kaz'?'Мәтінді енгізіңіз':'Введите текст'; return }
  newsFormLoading.value = true
  try {
    const payload = {
      titleRu: newsForm.value.titleRu.trim(),
      titleKk: newsForm.value.titleKk.trim() || undefined,
      contentRu: newsForm.value.contentRu.trim(),
      contentKk: newsForm.value.contentKk.trim() || undefined,
      category: newsForm.value.category || undefined,
    }
    let savedNews
    if (editingNews.value) {
      savedNews = await updateNews(editingNews.value.id, payload)
    } else {
      savedNews = await createNews(null, payload)
    }
    // Upload image if selected
    if (newsImageFile.value && savedNews?.id) {
      try { await uploadNewsImage(savedNews.id, newsImageFile.value) } catch {}
    }
    newsFormSuccess.value = true
    setTimeout(() => {
      closeNewsForm()
      loadMyNews()
    }, 1500)
  } catch (e) {
    newsFormError.value = e.message || (lang.value==='kaz'?'Қате болды':'Ошибка сохранения')
  } finally {
    newsFormLoading.value = false
  }
}

// Watch tab switch to lazy-load my news
watch(activeTab, (tab) => {
  if (tab === 'mynews' && myNewsList.value.length === 0) loadMyNews()
})
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
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
.spinner-sm-btn { width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; vertical-align: middle; margin-right: 4px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Fade */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Relative Links tab ── */
.links-description { font-size: var(--fs-sm); color: var(--gray-500); margin-bottom: 24px; max-width: 600px; line-height: 1.6; }
.link-request-form { background: white; border-radius: var(--radius-xl); padding: 20px 24px; box-shadow: var(--shadow); margin-bottom: 24px; }
.link-form-title { font-size: var(--fs-md); font-weight: 700; color: var(--black); display: flex; align-items: center; gap: 6px; margin-bottom: 14px; }
.link-form-row { display: flex; gap: 10px; align-items: center; }
.link-form-row .form-input { flex: 1; }
.links-loading { display: flex; justify-content: center; padding: 32px; }
.links-list { display: flex; flex-direction: column; gap: 12px; }
.link-item { display: flex; align-items: center; gap: 14px; background: white; border-radius: var(--radius-lg); padding: 14px 18px; box-shadow: var(--shadow); flex-wrap: wrap; }
.link-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), #7C3AED); color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; flex-shrink: 0; }
.link-info { flex: 1; min-width: 150px; }
.link-name { font-size: var(--fs-sm); font-weight: 700; color: var(--black); }
.link-city { color: var(--gray-400); font-weight: 400; font-size: var(--fs-xs); }
.link-email { font-size: var(--fs-xs); color: var(--gray-400); margin-top: 2px; }
.link-role { font-size: var(--fs-xs); color: var(--primary); font-weight: 600; margin-top: 2px; }
.link-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.link-status-badge { padding: 3px 10px; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; }
.link-status-pending  { background: #FEF3C7; color: #92400E; }
.link-status-accepted { background: #D1FAE5; color: #065F46; }
.link-status-rejected { background: #FEE2E2; color: #991B1B; }
.btn-danger-sm { display: flex; align-items: center; padding: 5px 8px; border-radius: var(--radius-sm); background: #FEE2E2; border: none; color: #DC2626; cursor: pointer; transition: background var(--transition); }
.btn-danger-sm:hover { background: #DC2626; color: white; }

/* ── My News tab ── */
.mynews-filter { display: flex; gap: 6px; flex-wrap: wrap; }
.mynews-filter-btn { padding: 5px 12px; border-radius: var(--radius-full); font-size: var(--fs-xs); font-weight: 600; color: var(--gray-500); border: 1.5px solid var(--gray-200); background: white; cursor: pointer; transition: all var(--transition); }
.mynews-filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
.mynews-list { display: flex; flex-direction: column; gap: 10px; }
.mynews-item { display: flex; align-items: center; gap: 14px; background: white; border-radius: var(--radius-lg); padding: 12px 16px; box-shadow: var(--shadow); }
.mynews-img { width: 64px; height: 48px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; }
.mynews-placeholder { width: 64px; height: 48px; background: var(--gray-100); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.mynews-info { flex: 1; min-width: 0; }
.mynews-title { font-size: var(--fs-sm); font-weight: 700; color: var(--black); line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mynews-meta { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
.mynews-date { font-size: 11px; color: var(--gray-400); }
.mynews-stat { display: flex; align-items: center; gap: 3px; font-size: 11px; color: var(--gray-500); }
.mynews-status-badge { padding: 3px 10px; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
.mynews-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.mynews-delete-btn {
  width: 28px; height: 28px; border-radius: 50%;
  border: 1.5px solid #fecaca; background: #fef2f2; color: #dc2626;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s;
}
.mynews-delete-btn:hover:not(:disabled) { background: #fee2e2; border-color: #dc2626; }
.mynews-delete-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.spinner-sm-del { width: 11px; height: 11px; border: 2px solid rgba(220,38,38,0.3); border-top-color: #dc2626; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
.mynews-status-published { background: #D1FAE5; color: #065F46; }
.mynews-status-pending   { background: #FEF3C7; color: #92400E; }
.mynews-status-rejected  { background: #FEE2E2; color: #991B1B; }
.mynews-status-draft     { background: var(--gray-100); color: var(--gray-500); }

/* ── 2FA ── */
.twofa-setup { background: var(--gray-50); border-radius: var(--radius-md); padding: 16px; margin: 10px 0; display: flex; flex-direction: column; gap: 10px; }
.twofa-hint { font-size: var(--fs-sm); color: var(--gray-600); }
.twofa-qr { width: 150px; height: 150px; border-radius: var(--radius-sm); }
.twofa-secret { font-family: monospace; font-size: 12px; background: white; border: 1.5px solid var(--gray-200); padding: 6px 10px; border-radius: var(--radius-sm); color: var(--gray-700); word-break: break-all; }
.twofa-input { max-width: 180px; letter-spacing: 4px; text-align: center; font-size: var(--fs-lg); font-weight: 700; }
.twofa-actions { display: flex; gap: 8px; }
.btn-danger-outline { border: 1.5px solid #DC2626 !important; color: #DC2626 !important; background: none !important; }
.btn-danger-outline:hover { background: #FEF2F2 !important; }

/* ── Requests tab ── */
.admin-tabs { display: flex; gap: 4px; background: white; padding: 6px; border-radius: 11px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); width: fit-content; }
.admin-tab { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; color: #64748b; background: transparent; transition: all 0.15s; }
.admin-tab:hover { background: #f1f5f9; color: #1e293b; }
.admin-tab.active { background: #3b82f6; color: white; }
.tab-count-sm { background: #ef4444; color: white; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
.admin-tab.active .tab-count-sm { background: rgba(255,255,255,0.3); }
.req-items-list { display: flex; flex-direction: column; gap: 12px; }
.req-item-card { background: white; border-radius: var(--radius-lg); padding: 16px 18px; box-shadow: var(--shadow); }
.req-item-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 8px; }
.req-item-subject { font-size: var(--fs-sm); font-weight: 700; color: var(--black); }
.req-item-body { font-size: var(--fs-sm); color: var(--gray-500); line-height: 1.6; margin-bottom: 10px; }
.req-item-footer { display: flex; align-items: center; gap: 16px; font-size: var(--fs-xs); color: var(--gray-400); flex-wrap: wrap; }
.req-item-response { color: var(--gray-600); font-style: italic; }
.req-target-badge { font-size: 16px; }
.req-item-badge { font-size: 11px; padding: 3px 10px; border-radius: var(--radius-full); font-weight: 700; white-space: nowrap; flex-shrink: 0; }
.badge-open       { background: #fefce8; color: #ca8a04; }
.badge-inprogress { background: #eff6ff; color: #3b82f6; }
.badge-resolved   { background: #f0fdf4; color: #16a34a; }
.badge-closed     { background: #f1f5f9; color: #64748b; }

/* ── News edit button ── */
.mynews-edit-btn {
  width: 28px; height: 28px; border-radius: 50%;
  border: 1.5px solid #bfdbfe; background: #eff6ff; color: #3b82f6;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s;
}
.mynews-edit-btn:hover { background: #dbeafe; border-color: #3b82f6; }

/* ── News form modal ── */
.profile-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 16px;
}
.profile-modal {
  background: white; border-radius: 14px; width: 100%; max-width: 620px;
  max-height: 92vh; display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
}
.profile-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid var(--gray-100);
}
.profile-modal-header h3 { font-size: var(--fs-lg); font-weight: 700; color: var(--black); }
.profile-modal-close {
  width: 30px; height: 30px; border-radius: 7px; border: none;
  background: var(--gray-100); color: var(--gray-500); cursor: pointer; font-size: 14px;
}
.profile-modal-close:hover { background: var(--gray-200); }
.profile-modal-body {
  padding: 20px 24px; overflow-y: auto;
  display: flex; flex-direction: column; gap: 14px;
}
.profile-modal-footer {
  padding: 16px 24px; border-top: 1px solid var(--gray-100);
  display: flex; justify-content: flex-end; gap: 10px;
}
.news-img-preview-wrap { margin-top: 6px; }
.news-img-preview { width: 100%; max-height: 160px; object-fit: cover; border-radius: 8px; border: 1px solid var(--gray-200); }
</style>
