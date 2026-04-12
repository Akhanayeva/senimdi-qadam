<template>
  <main class="page-content">
    <!-- Hero -->
    <section class="taxi-hero">
      <div class="container taxi-hero-inner">
        <div class="taxi-hero-text">
          <div class="taxi-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            ИнваТакси
          </div>
          <h1 class="taxi-hero-title">{{ lang === 'kaz' ? 'Арнайы такси қызметі' : 'Специальное такси для людей с инвалидностью' }}</h1>
          <p class="taxi-hero-desc">{{ lang === 'kaz' ? 'Алматы бойынша мүгедектігі бар адамдарға арналған жайлы және қауіпсіз тасымал. Арнайы жабдықталған көліктер.' : 'Комфортные и безопасные поездки по Алматы. Специально оборудованные автомобили с подъёмниками, опытные водители.' }}</p>
          <div class="taxi-hero-features">
            <span class="taxi-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>{{ lang === 'kaz' ? 'Арбаға арналған лифт' : 'Подъёмник для коляски' }}</span>
            <span class="taxi-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>{{ lang === 'kaz' ? 'Тәжірибелі жүргізушілер' : 'Опытные водители' }}</span>
            <span class="taxi-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>{{ lang === 'kaz' ? 'Менеджермен чат' : 'Чат с менеджером' }}</span>
            <span class="taxi-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>{{ lang === 'kaz' ? 'Ыңғайлы брондау' : 'Удобное бронирование' }}</span>
          </div>
          <div class="taxi-hero-cta">
            <button class="btn btn-white-outline btn-lg" @click="activeTab = 'book'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ lang === 'kaz' ? 'Жолаушы тапсырыс беру' : 'Заказать поездку' }}
            </button>
            <a href="tel:+77273334455" class="btn btn-outline-white btn-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 7.07 7.07l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +7 (727) 333-44-55
            </a>
          </div>
        </div>
        <div class="taxi-hero-illustration">
          <img src="https://images.unsplash.com/photo-1619451683408-9a08b9be0c27?w=520&q=80" alt="ИнваТакси" class="taxi-hero-img" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- Tabs -->
    <div class="container taxi-main">
      <div class="taxi-tabs">
        <button
          v-for="tab in availableTabs"
          :key="tab.id"
          class="taxi-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span v-html="tab.icon"></span>
          {{ tab.label }}
          <span v-if="tab.id === 'bookings' && myBookings.length" class="tab-count">{{ myBookings.length }}</span>
          <span v-if="tab.id === 'manager' && managerStats.pending" class="tab-count tab-count--red">{{ managerStats.pending }}</span>
        </button>
      </div>

      <!-- ── TAB: BOOK ── -->
      <div v-if="activeTab === 'book'" class="taxi-tab-content">
        <div class="book-layout">
          <div class="book-form-wrap">
            <h2 class="section-title-sm">{{ lang === 'kaz' ? 'Жаңа тапсырыс' : 'Новая заявка на поездку' }}</h2>
            <form class="book-form" @submit.prevent="handleCreateBooking">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 14 8 14s8-8.5 8-14a8 8 0 0 0-8-8z"/></svg>
                    {{ lang === 'kaz' ? 'Кету мекенжайы' : 'Адрес отправления' }} *
                  </label>
                  <input v-model="form.fromAddress" type="text" class="form-input" :placeholder="lang === 'kaz' ? 'ул. Абай 1, Алматы' : 'ул. Абая 1, Алматы'" required />
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 14 8 14s8-8.5 8-14a8 8 0 0 0-8-8z"/></svg>
                    {{ lang === 'kaz' ? 'Бару мекенжайы' : 'Адрес назначения' }} *
                  </label>
                  <input v-model="form.toAddress" type="text" class="form-input" :placeholder="lang === 'kaz' ? 'Достык 10, Алматы' : 'ул. Достык 10, Алматы'" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {{ lang === 'kaz' ? 'Күні мен уақыты' : 'Дата и время' }} *
                  </label>
                  <input v-model="form.scheduledAt" type="datetime-local" class="form-input" :min="minDateTime" required />
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    {{ lang === 'kaz' ? 'Мүгедектік түрі' : 'Тип инвалидности' }} *
                  </label>
                  <select v-model="form.disabilityType" class="form-input form-select" required>
                    <option value="">{{ lang === 'kaz' ? 'Таңдаңыз' : 'Выберите...' }}</option>
                    <option value="WHEELCHAIR">{{ lang === 'kaz' ? 'Арба пайдаланушы' : 'Колясочник (WHEELCHAIR)' }}</option>
                    <option value="VISUAL">{{ lang === 'kaz' ? 'Көру қабілеті нашар' : 'Нарушение зрения (VISUAL)' }}</option>
                    <option value="HEARING">{{ lang === 'kaz' ? 'Есту қабілеті нашар' : 'Нарушение слуха (HEARING)' }}</option>
                    <option value="MENTAL">{{ lang === 'kaz' ? 'Психикалық ерекшеліктер' : 'Ментальные особенности (MENTAL)' }}</option>
                    <option value="SPEECH">{{ lang === 'kaz' ? 'Сөйлеу мүмкіндігі шектеулі' : 'Нарушение речи (SPEECH)' }}</option>
                    <option value="MUSCULOSKELETAL">{{ lang === 'kaz' ? 'Тірек-қимыл жүйесі' : 'ОДА (MUSCULOSKELETAL)' }}</option>
                    <option value="OTHER">{{ lang === 'kaz' ? 'Басқа' : 'Другое (OTHER)' }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">{{ lang === 'kaz' ? 'Ескертпе (міндетті емес)' : 'Примечание для водителя (необязательно)' }}</label>
                <textarea v-model="form.note" class="form-input form-textarea" :placeholder="lang === 'kaz' ? 'Мысалы: лифт қажет, итбалық орны бар...' : 'Например: нужен подъёмник, место для собаки-поводыря...'" rows="2"></textarea>
              </div>
              <div v-if="!authStore.isAuthenticated" class="form-auth-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {{ lang === 'kaz' ? 'Тапсырыс беру үшін жүйеге кіріңіз' : 'Для оформления заявки необходимо войти в аккаунт' }}
                <RouterLink to="/login" class="auth-link">{{ lang === 'kaz' ? 'Кіру' : 'Войти' }}</RouterLink>
              </div>
              <button type="submit" class="btn btn-primary btn-lg book-submit" :disabled="bookingLoading || !authStore.isAuthenticated">
                <span v-if="bookingLoading" class="spinner-sm"></span>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                {{ bookingLoading ? (lang === 'kaz' ? 'Жіберілуде...' : 'Отправляем...') : (lang === 'kaz' ? 'Тапсырыс беру' : 'Подать заявку') }}
              </button>
            </form>
          </div>
          <div class="book-info-aside">
            <div class="info-card">
              <div class="info-card-icon">📋</div>
              <h3>{{ lang === 'kaz' ? 'Тапсырыс мәртебелері' : 'Статусы заявки' }}</h3>
              <div class="status-flow">
                <div class="status-step" v-for="(s, i) in statusFlow" :key="i">
                  <span class="status-dot" :style="{ background: s.color }"></span>
                  <div>
                    <div class="status-name">{{ s.name }}</div>
                    <div class="status-desc">{{ lang === 'kaz' ? s.descKaz : s.desc }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="info-card">
              <div class="info-card-icon">📞</div>
              <h3>{{ lang === 'kaz' ? 'Байланыс' : 'Связаться с нами' }}</h3>
              <p class="info-card-text">{{ lang === 'kaz' ? 'Сұрақтар бойынша бізге хабарласыңыз:' : 'По любым вопросам обращайтесь к нам:' }}</p>
              <a href="tel:+77273334455" class="contact-link">📞 +7 (727) 333-44-55</a>
              <a href="https://wa.me/77273334455" class="contact-link whatsapp-link" target="_blank">💬 WhatsApp</a>
            </div>
          </div>
        </div>
        <!-- Success notification -->
        <Transition name="fade">
          <div v-if="bookingSuccess" class="booking-success">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <div>
              <strong>{{ lang === 'kaz' ? 'Тапсырыс қабылданды!' : 'Заявка принята!' }}</strong>
              <span>{{ lang === 'kaz' ? 'Менеджер сізбен хабарласады.' : 'Менеджер свяжется с вами в ближайшее время.' }}</span>
            </div>
            <button class="booking-success-close" @click="bookingSuccess = false">✕</button>
          </div>
        </Transition>
      </div>

      <!-- ── TAB: MY BOOKINGS ── -->
      <div v-else-if="activeTab === 'bookings'" class="taxi-tab-content">
        <div class="bookings-header">
          <h2 class="section-title-sm">{{ lang === 'kaz' ? 'Менің тапсырыстарым' : 'Мои поездки' }}</h2>
          <button class="btn btn-primary btn-sm" @click="activeTab = 'book'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {{ lang === 'kaz' ? 'Жаңа тапсырыс' : 'Новая заявка' }}
          </button>
        </div>
        <div v-if="bookingsLoading" class="bookings-grid">
          <div v-for="i in 3" :key="i" class="booking-card-skeleton">
            <div class="skeleton" style="height:20px;width:60%;margin-bottom:8px;border-radius:6px"></div>
            <div class="skeleton" style="height:14px;width:80%;margin-bottom:6px;border-radius:4px"></div>
            <div class="skeleton" style="height:14px;width:70%;border-radius:4px"></div>
          </div>
        </div>
        <div v-else-if="!authStore.isAuthenticated" class="empty-state">
          <div class="empty-state-icon">🔐</div>
          <p>{{ lang === 'kaz' ? 'Тапсырыстарды көру үшін жүйеге кіріңіз' : 'Войдите в аккаунт чтобы видеть свои заявки' }}</p>
          <RouterLink to="/login" class="btn btn-primary mt-4">{{ lang === 'kaz' ? 'Кіру' : 'Войти' }}</RouterLink>
        </div>
        <div v-else-if="myBookings.length === 0" class="empty-state">
          <div class="empty-state-icon">🚐</div>
          <p>{{ lang === 'kaz' ? 'Тапсырыстар жоқ' : 'У вас пока нет заявок' }}</p>
          <button class="btn btn-primary mt-4" @click="activeTab = 'book'">{{ lang === 'kaz' ? 'Тапсырыс беру' : 'Подать заявку' }}</button>
        </div>
        <div v-else class="bookings-list">
          <div
            v-for="booking in myBookings"
            :key="booking.id"
            class="booking-card"
            :class="'booking-card--' + booking.status.toLowerCase()"
            @click="openBookingDetail(booking)"
          >
            <div class="booking-card-header">
              <span class="booking-status-badge" :class="'badge-' + booking.status.toLowerCase()">
                {{ statusLabel(booking.status, lang) }}
              </span>
              <span class="booking-date">{{ formatDateTime(booking.scheduledAt) }}</span>
            </div>
            <div class="booking-card-route">
              <div class="route-point">
                <span class="route-dot route-dot--from"></span>
                <span class="route-addr">{{ booking.fromAddress }}</span>
              </div>
              <div class="route-line"></div>
              <div class="route-point">
                <span class="route-dot route-dot--to"></span>
                <span class="route-addr">{{ booking.toAddress }}</span>
              </div>
            </div>
            <div v-if="booking.driver" class="booking-driver-row">
              <div class="driver-mini-avatar">{{ booking.driver.name.charAt(0) }}</div>
              <span class="driver-mini-name">{{ booking.driver.name }}</span>
              <span class="driver-mini-vehicle">· {{ booking.driver.vehicle }}</span>
            </div>
            <div class="booking-card-footer">
              <span class="disability-chip">{{ disabilityLabel(booking.disabilityType, lang) }}</span>
              <span v-if="booking.messages?.length" class="chat-count">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {{ booking.messages.length }}
              </span>
              <button
                v-if="booking.status === 'PENDING' || booking.status === 'CONFIRMED'"
                class="cancel-btn"
                @click.stop="handleCancelBooking(booking)"
              >
                {{ lang === 'kaz' ? 'Бас тарту' : 'Отменить' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TAB: DRIVERS ── -->
      <div v-else-if="activeTab === 'drivers'" class="taxi-tab-content">
        <div class="drivers-header">
          <h2 class="section-title-sm">{{ lang === 'kaz' ? 'Біздің жүргізушілер' : 'Наши водители' }}</h2>
          <div class="driver-filter-btns">
            <button class="filter-pill" :class="{ active: driverFilter === 'all' }" @click="driverFilter = 'all'">{{ lang === 'kaz' ? 'Барлығы' : 'Все' }}</button>
            <button class="filter-pill" :class="{ active: driverFilter === 'ACTIVE' }" @click="driverFilter = 'ACTIVE'">
              <span class="status-dot-sm status-dot--green"></span>{{ lang === 'kaz' ? 'Белсенді' : 'Активные' }}
            </button>
            <button class="filter-pill" :class="{ active: driverFilter === 'INACTIVE' }" @click="driverFilter = 'INACTIVE'">
              <span class="status-dot-sm status-dot--gray"></span>{{ lang === 'kaz' ? 'Белсенді емес' : 'Неактивные' }}
            </button>
          </div>
        </div>
        <div v-if="driversLoading" class="drivers-grid">
          <div v-for="i in 4" :key="i" class="driver-card-skeleton">
            <div class="skeleton" style="height:80px;width:80px;border-radius:50%;margin:0 auto 16px"></div>
            <div class="skeleton" style="height:18px;width:70%;margin:0 auto 8px;border-radius:6px"></div>
            <div class="skeleton" style="height:13px;width:90%;margin:0 auto;border-radius:4px"></div>
          </div>
        </div>
        <div v-else class="drivers-grid">
          <div
            v-for="driver in filteredDrivers"
            :key="driver.id"
            class="driver-card"
            :class="{ 'driver-card--inactive': driver.status !== 'ACTIVE' }"
          >
            <div class="driver-avatar-wrap">
              <div class="driver-avatar">{{ driver.name.charAt(0) }}</div>
              <span class="driver-status-dot" :class="driver.status === 'ACTIVE' ? 'dot-active' : 'dot-inactive'"></span>
            </div>
            <h3 class="driver-name">{{ driver.name }}</h3>
            <div class="driver-rating">
              <span class="stars">{{ '★'.repeat(Math.round(driver.rating)) }}{{ '☆'.repeat(5 - Math.round(driver.rating)) }}</span>
              <span class="rating-num">{{ driver.rating.toFixed(1) }}</span>
              <span class="rating-rides">· {{ driver.totalRides }} {{ lang === 'kaz' ? 'сапар' : 'поездок' }}</span>
            </div>
            <div class="driver-vehicle">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              {{ driver.vehicle }} · {{ driver.licensePlate }}
            </div>
            <p class="driver-bio">{{ lang === 'kaz' ? (driver.bioKaz || driver.bio) : driver.bio }}</p>
            <div class="driver-equipment">
              <span v-for="eq in driver.disabilityEquipment" :key="eq" class="equipment-tag">
                {{ equipmentLabel(eq, lang) }}
              </span>
            </div>
            <div class="driver-actions">
              <span v-if="driver.status !== 'ACTIVE'" class="driver-unavailable">{{ lang === 'kaz' ? 'Қолжетімді емес' : 'Недоступен' }}</span>
              <a v-else :href="driver.whatsappLink" target="_blank" class="btn btn-whatsapp">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.003 2.003C6.476 2.003 2 6.478 2 12.003c0 1.992.578 3.854 1.59 5.43L2 22l4.65-1.574A9.957 9.957 0 0 0 12.003 22C17.53 22 22 17.525 22 12 22 6.476 17.53 2.003 12.003 2.003zm0 18.197a8.157 8.157 0 0 1-4.164-1.14l-.298-.179-3.088 1.046 1.056-3.019-.199-.316A8.16 8.16 0 0 1 3.8 12c0-4.519 3.678-8.197 8.203-8.197 4.524 0 8.197 3.678 8.197 8.197 0 4.524-3.673 8.197-8.197 8.197z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TAB: MANAGER ── -->
      <div v-else-if="activeTab === 'manager'" class="taxi-tab-content">
        <h2 class="section-title-sm">{{ lang === 'kaz' ? 'Менеджер панелі' : 'Панель менеджера' }}</h2>

        <!-- Stats row -->
        <div class="manager-stats">
          <div class="stat-card stat-card--yellow">
            <div class="stat-num">{{ managerStats.pending }}</div>
            <div class="stat-label">{{ lang === 'kaz' ? 'Күтуде' : 'Ожидают' }}</div>
          </div>
          <div class="stat-card stat-card--blue">
            <div class="stat-num">{{ managerStats.confirmed }}</div>
            <div class="stat-label">{{ lang === 'kaz' ? 'Расталған' : 'Подтверждены' }}</div>
          </div>
          <div class="stat-card stat-card--orange">
            <div class="stat-num">{{ managerStats.inProgress }}</div>
            <div class="stat-label">{{ lang === 'kaz' ? 'Жолда' : 'В пути' }}</div>
          </div>
          <div class="stat-card stat-card--green">
            <div class="stat-num">{{ managerStats.completed }}</div>
            <div class="stat-label">{{ lang === 'kaz' ? 'Аяқталды' : 'Завершены' }}</div>
          </div>
          <div class="stat-card stat-card--primary">
            <div class="stat-num">{{ managerStats.availableDrivers }}</div>
            <div class="stat-label">{{ lang === 'kaz' ? 'Бос жүргізушілер' : 'Свободных водителей' }}</div>
          </div>
        </div>

        <!-- Queue -->
        <h3 class="manager-subtitle">
          <span class="queue-dot"></span>
          {{ lang === 'kaz' ? 'Күту кезегі (PENDING)' : 'Очередь заявок (PENDING)' }}
        </h3>
        <div v-if="queueLoading" class="queue-skeleton">
          <div v-for="i in 3" :key="i" class="skeleton" style="height:90px;border-radius:12px"></div>
        </div>
        <div v-else-if="managerQueue.length === 0" class="empty-state-sm">
          <span>✅ {{ lang === 'kaz' ? 'Кезекте тапсырыс жоқ' : 'Очередь пуста — все заявки обработаны' }}</span>
        </div>
        <div v-else class="queue-list">
          <div v-for="item in managerQueue" :key="item.id" class="queue-item">
            <div class="queue-item-main">
              <div class="queue-user">
                <div class="queue-avatar">{{ item.userName.charAt(0) }}</div>
                <div>
                  <div class="queue-user-name">{{ item.userName }}</div>
                  <div class="queue-user-phone">{{ item.userPhone }}</div>
                </div>
              </div>
              <div class="queue-route">
                <div class="queue-addr">📍 {{ item.fromAddress }}</div>
                <div class="queue-arrow">→</div>
                <div class="queue-addr">🏁 {{ item.toAddress }}</div>
              </div>
              <div class="queue-meta">
                <span class="queue-time">🕐 {{ formatDateTime(item.scheduledAt) }}</span>
                <span class="queue-disability">{{ disabilityLabel(item.disabilityType, lang) }}</span>
                <span v-if="item.note" class="queue-note">📝 {{ item.note }}</span>
              </div>
            </div>
            <div class="queue-actions">
              <select v-model="assignMap[item.id]" class="assign-select">
                <option value="">{{ lang === 'kaz' ? 'Жүргізуші таңдаңыз...' : 'Выбрать водителя...' }}</option>
                <option v-for="d in availableDriversList" :key="d.id" :value="d.id">
                  {{ d.name }} · {{ d.vehicle }}
                </option>
              </select>
              <button
                class="btn btn-primary btn-sm"
                :disabled="!assignMap[item.id] || assigning[item.id]"
                @click="handleAssignDriver(item.id)"
              >
                <span v-if="assigning[item.id]" class="spinner-sm"></span>
                {{ assigning[item.id] ? '...' : (lang === 'kaz' ? 'Жіберу' : 'Назначить') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Add Driver Form -->
        <h3 class="manager-subtitle" style="margin-top:40px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ lang === 'kaz' ? 'Жаңа жүргізуші қосу' : 'Добавить водителя' }}
        </h3>
        <form class="add-driver-form" @submit.prevent="handleAddDriver">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ lang === 'kaz' ? 'Толық аты' : 'Имя водителя' }} *</label>
              <input v-model="driverForm.name" type="text" class="form-input" placeholder="Асхат Бекжанов" required />
            </div>
            <div class="form-group">
              <label class="form-label">{{ lang === 'kaz' ? 'Телефон' : 'Телефон' }} *</label>
              <input v-model="driverForm.phone" type="tel" class="form-input" placeholder="+77011234567" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ lang === 'kaz' ? 'Көлік' : 'Автомобиль' }} *</label>
              <input v-model="driverForm.vehicle" type="text" class="form-input" placeholder="Toyota Sienna 2021" required />
            </div>
            <div class="form-group">
              <label class="form-label">{{ lang === 'kaz' ? 'Мемлекеттік нөмір' : 'Гос. номер' }} *</label>
              <input v-model="driverForm.licensePlate" type="text" class="form-input" placeholder="777 ASK 02" required />
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="driverAddLoading">
            <span v-if="driverAddLoading" class="spinner-sm"></span>
            {{ driverAddLoading ? '...' : (lang === 'kaz' ? 'Қосу' : 'Добавить') }}
          </button>
          <Transition name="fade">
            <span v-if="driverAddSuccess" class="add-driver-success">✓ {{ lang === 'kaz' ? 'Жүргізуші қосылды!' : 'Водитель добавлен!' }}</span>
          </Transition>
        </form>
      </div>
    </div>

    <!-- Booking Detail Modal -->
    <Transition name="modal">
      <div v-if="selectedBooking" class="modal-overlay" @click.self="selectedBooking = null">
        <div class="modal-box booking-modal">
          <div class="modal-header">
            <h3>{{ lang === 'kaz' ? 'Тапсырыс мәліметтері' : 'Детали заявки' }}</h3>
            <span class="booking-status-badge" :class="'badge-' + selectedBooking.status.toLowerCase()">{{ statusLabel(selectedBooking.status, lang) }}</span>
            <button class="modal-close" @click="selectedBooking = null">✕</button>
          </div>
          <div class="modal-body">
            <!-- Route -->
            <div class="modal-section">
              <div class="modal-route">
                <div class="route-point">
                  <span class="route-dot route-dot--from"></span>
                  <div><div class="route-label">{{ lang === 'kaz' ? 'Кету' : 'Откуда' }}</div><div class="route-addr">{{ selectedBooking.fromAddress }}</div></div>
                </div>
                <div class="route-line-v"></div>
                <div class="route-point">
                  <span class="route-dot route-dot--to"></span>
                  <div><div class="route-label">{{ lang === 'kaz' ? 'Бару' : 'Куда' }}</div><div class="route-addr">{{ selectedBooking.toAddress }}</div></div>
                </div>
              </div>
            </div>
            <!-- Info row -->
            <div class="modal-info-row">
              <div class="modal-info-item">
                <span class="mii-label">{{ lang === 'kaz' ? 'Күні' : 'Дата' }}</span>
                <span class="mii-val">{{ formatDateTime(selectedBooking.scheduledAt) }}</span>
              </div>
              <div class="modal-info-item">
                <span class="mii-label">{{ lang === 'kaz' ? 'Мүгедектік' : 'Тип' }}</span>
                <span class="mii-val">{{ disabilityLabel(selectedBooking.disabilityType, lang) }}</span>
              </div>
              <div v-if="selectedBooking.note" class="modal-info-item modal-info-item--full">
                <span class="mii-label">{{ lang === 'kaz' ? 'Ескертпе' : 'Примечание' }}</span>
                <span class="mii-val">{{ selectedBooking.note }}</span>
              </div>
            </div>
            <!-- Driver -->
            <div v-if="selectedBooking.driver" class="modal-section">
              <h4 class="modal-section-title">{{ lang === 'kaz' ? 'Жүргізуші' : 'Водитель' }}</h4>
              <div class="modal-driver-card">
                <div class="modal-driver-avatar">{{ selectedBooking.driver.name.charAt(0) }}</div>
                <div class="modal-driver-info">
                  <div class="modal-driver-name">{{ selectedBooking.driver.name }}</div>
                  <div class="modal-driver-vehicle">{{ selectedBooking.driver.vehicle }}</div>
                  <div class="modal-driver-rating">⭐ {{ selectedBooking.driver.rating }}</div>
                </div>
                <div class="modal-driver-actions">
                  <a :href="'tel:' + selectedBooking.driver.phone" class="btn btn-outline btn-sm">📞</a>
                  <a :href="selectedBooking.driver.whatsappLink" target="_blank" class="btn btn-whatsapp btn-sm">💬</a>
                </div>
              </div>
            </div>
            <!-- Review -->
            <div v-if="selectedBooking.status === 'COMPLETED'" class="modal-section">
              <h4 class="modal-section-title">{{ lang === 'kaz' ? 'Бағалау' : 'Оценка поездки' }}</h4>
              <div v-if="selectedBooking.review" class="existing-review">
                <div class="review-stars">{{ '★'.repeat(selectedBooking.review.rating) }}{{ '☆'.repeat(5 - selectedBooking.review.rating) }}</div>
                <p v-if="selectedBooking.review.comment" class="review-comment">{{ selectedBooking.review.comment }}</p>
              </div>
              <div v-else class="review-form">
                <div class="star-picker">
                  <button v-for="n in 5" :key="n" class="star-btn" :class="{ active: reviewRating >= n }" @click="reviewRating = n">★</button>
                </div>
                <input v-model="reviewComment" type="text" class="form-input" :placeholder="lang === 'kaz' ? 'Пікір (міндетті емес)' : 'Комментарий (необязательно)'" />
                <button class="btn btn-primary btn-sm" :disabled="!reviewRating || reviewSubmitting" @click="handleLeaveReview">
                  {{ reviewSubmitting ? '...' : (lang === 'kaz' ? 'Жіберу' : 'Отправить') }}
                </button>
              </div>
            </div>
            <!-- Chat -->
            <div class="modal-section">
              <h4 class="modal-section-title">{{ lang === 'kaz' ? 'Менеджермен чат' : 'Чат с менеджером' }}</h4>
              <div class="chat-box" ref="chatBoxRef">
                <div v-if="chatMessages.length === 0" class="chat-empty">{{ lang === 'kaz' ? 'Хабарламалар жоқ' : 'Сообщений пока нет' }}</div>
                <div
                  v-for="msg in chatMessages"
                  :key="msg.id"
                  class="chat-msg"
                  :class="{ 'chat-msg--user': msg.role === 'user', 'chat-msg--manager': msg.role === 'manager' }"
                >
                  <div class="chat-msg-sender">{{ msg.senderName }}</div>
                  <div class="chat-msg-text">{{ msg.text }}</div>
                  <div class="chat-msg-time">{{ formatTime(msg.createdAt) }}</div>
                </div>
              </div>
              <div v-if="selectedBooking.status !== 'COMPLETED' && selectedBooking.status !== 'CANCELLED'" class="chat-input-row">
                <input
                  v-model="chatInput"
                  type="text"
                  class="form-input chat-input"
                  :placeholder="lang === 'kaz' ? 'Хабарлама жазыңыз...' : 'Написать сообщение...'"
                  @keydown.enter="handleSendChat"
                />
                <button class="btn btn-primary chat-send-btn" :disabled="!chatInput.trim() || chatSending" @click="handleSendChat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useAuthStore } from '../stores/auth.js'
import {
  getMyBookings, createBooking, cancelBooking,
  getDrivers, leaveDriverReview,
  getChatMessages, sendChatMessage,
  getManagerStats, getManagerQueue, getAvailableDrivers, assignDriver, addDriver
} from '../api/taxi.js'

const a11y = useAccessibilityStore()
const authStore = useAuthStore()
const lang = computed(() => a11y.lang)

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const activeTab = ref('book')
const isManager = computed(() => authStore.isAdmin || authStore.isModerator)

const allTabs = [
  { id: 'book', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', labelKaz: 'Тапсырыс беру', labelRus: 'Заказать' },
  { id: 'bookings', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', labelKaz: 'Менің сапарларым', labelRus: 'Мои поездки' },
  { id: 'drivers', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', labelKaz: 'Жүргізушілер', labelRus: 'Водители' },
  { id: 'manager', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>', labelKaz: 'Менеджер', labelRus: 'Менеджер', managerOnly: true }
]

const availableTabs = computed(() =>
  allTabs
    .filter(t => !t.managerOnly || isManager.value)
    .map(t => ({ ...t, label: lang.value === 'kaz' ? t.labelKaz : t.labelRus }))
)

// ─── Booking Form ─────────────────────────────────────────────────────────────
const form = ref({ fromAddress: '', toAddress: '', scheduledAt: '', disabilityType: '', note: '' })
const bookingLoading = ref(false)
const bookingSuccess = ref(false)

const minDateTime = computed(() => {
  const d = new Date(); d.setMinutes(d.getMinutes() + 30)
  return d.toISOString().slice(0, 16)
})

async function handleCreateBooking() {
  if (!authStore.isAuthenticated) return
  bookingLoading.value = true
  try {
    await createBooking({ ...form.value })
    form.value = { fromAddress: '', toAddress: '', scheduledAt: '', disabilityType: '', note: '' }
    bookingSuccess.value = true
    setTimeout(() => { bookingSuccess.value = false }, 4000)
    myBookings.value = await getMyBookings()
  } finally {
    bookingLoading.value = false
  }
}

// ─── My Bookings ──────────────────────────────────────────────────────────────
const myBookings = ref([])
const bookingsLoading = ref(true)

onMounted(async () => {
  if (authStore.isAuthenticated) {
    myBookings.value = await getMyBookings()
  }
  bookingsLoading.value = false
  driversLoading.value = true
  drivers.value = await getDrivers()
  driversLoading.value = false
  if (isManager.value) {
    const [stats, queue, avail] = await Promise.all([getManagerStats(), getManagerQueue(), getAvailableDrivers()])
    managerStats.value = stats
    managerQueue.value = queue
    availableDriversList.value = avail
    queueLoading.value = false
  }
})

async function handleCancelBooking(booking) {
  if (!confirm(lang.value === 'kaz' ? 'Тапсырысты бас тартасыз ба?' : 'Отменить заявку?')) return
  await cancelBooking(booking.id, '')
  myBookings.value = await getMyBookings()
}

// ─── Drivers ──────────────────────────────────────────────────────────────────
const drivers = ref([])
const driversLoading = ref(true)
const driverFilter = ref('all')

const filteredDrivers = computed(() => {
  if (driverFilter.value === 'all') return drivers.value
  return drivers.value.filter(d => d.status === driverFilter.value)
})

// ─── Booking Detail Modal ─────────────────────────────────────────────────────
const selectedBooking = ref(null)
const chatMessages = ref([])
const chatInput = ref('')
const chatSending = ref(false)
const chatBoxRef = ref(null)
const reviewRating = ref(0)
const reviewComment = ref('')
const reviewSubmitting = ref(false)

async function openBookingDetail(booking) {
  selectedBooking.value = booking
  reviewRating.value = 0
  reviewComment.value = ''
  chatMessages.value = await getChatMessages(booking.id)
  await nextTick()
  scrollChatToBottom()
}

function scrollChatToBottom() {
  if (chatBoxRef.value) chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
}

watch(chatMessages, async () => { await nextTick(); scrollChatToBottom() }, { deep: true })

async function handleSendChat() {
  if (!chatInput.value.trim() || chatSending.value) return
  chatSending.value = true
  const text = chatInput.value.trim()
  chatInput.value = ''
  await sendChatMessage(selectedBooking.value.id, text)
  chatMessages.value = await getChatMessages(selectedBooking.value.id)
  chatSending.value = false
  // Re-fetch after auto-reply
  setTimeout(async () => {
    chatMessages.value = await getChatMessages(selectedBooking.value?.id)
  }, 2000)
}

async function handleLeaveReview() {
  if (!reviewRating.value) return
  reviewSubmitting.value = true
  await leaveDriverReview(selectedBooking.value.id, reviewRating.value, reviewComment.value)
  myBookings.value = await getMyBookings()
  selectedBooking.value = myBookings.value.find(b => b.id === selectedBooking.value.id) || selectedBooking.value
  reviewSubmitting.value = false
}

// ─── Manager ──────────────────────────────────────────────────────────────────
const managerStats = ref({ pending: 0, confirmed: 0, inProgress: 0, completed: 0, cancelled: 0, availableDrivers: 0 })
const managerQueue = ref([])
const availableDriversList = ref([])
const queueLoading = ref(true)
const assignMap = ref({})
const assigning = ref({})

async function handleAssignDriver(bookingId) {
  const driverId = assignMap.value[bookingId]
  if (!driverId) return
  assigning.value[bookingId] = true
  await assignDriver(bookingId, driverId)
  const [stats, queue] = await Promise.all([getManagerStats(), getManagerQueue()])
  managerStats.value = stats
  managerQueue.value = queue
  delete assignMap.value[bookingId]
  assigning.value[bookingId] = false
}

const driverForm = ref({ name: '', phone: '', vehicle: '', licensePlate: '' })
const driverAddLoading = ref(false)
const driverAddSuccess = ref(false)

async function handleAddDriver() {
  driverAddLoading.value = true
  await addDriver({ ...driverForm.value })
  drivers.value = await getDrivers()
  availableDriversList.value = await getAvailableDrivers()
  driverForm.value = { name: '', phone: '', vehicle: '', licensePlate: '' }
  driverAddSuccess.value = true
  setTimeout(() => { driverAddSuccess.value = false }, 3000)
  driverAddLoading.value = false
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusFlow = [
  { name: 'PENDING', color: '#F59E0B', desc: 'Заявка принята, ожидает обработки', descKaz: 'Тапсырыс қабылданды, өңдеуді күтуде' },
  { name: 'CONFIRMED', color: '#3B82F6', desc: 'Водитель назначен, едет к вам', descKaz: 'Жүргізуші тағайындалды, сізге жол жүруде' },
  { name: 'IN_PROGRESS', color: '#F97316', desc: 'Поездка в процессе', descKaz: 'Сапар жүруде' },
  { name: 'COMPLETED', color: '#22C55E', desc: 'Поездка завершена', descKaz: 'Сапар аяқталды' },
  { name: 'CANCELLED', color: '#EF4444', desc: 'Заявка отменена', descKaz: 'Тапсырыс бас тартылды' }
]

function statusLabel(status, l) {
  const map = {
    PENDING: { kaz: 'Күтуде', rus: 'Ожидает' },
    CONFIRMED: { kaz: 'Расталды', rus: 'Подтверждена' },
    IN_PROGRESS: { kaz: 'Жолда', rus: 'В пути' },
    COMPLETED: { kaz: 'Аяқталды', rus: 'Завершена' },
    CANCELLED: { kaz: 'Бас тартылды', rus: 'Отменена' }
  }
  return map[status]?.[l === 'kaz' ? 'kaz' : 'rus'] || status
}

function disabilityLabel(type, l) {
  const map = {
    WHEELCHAIR: { kaz: '♿ Арба', rus: '♿ Колясочник' },
    VISUAL: { kaz: '👁 Көру', rus: '👁 Зрение' },
    HEARING: { kaz: '👂 Есту', rus: '👂 Слух' },
    MENTAL: { kaz: '🧠 Психикалық', rus: '🧠 Ментальное' },
    SPEECH: { kaz: '🗣 Сөйлеу', rus: '🗣 Речь' },
    MUSCULOSKELETAL: { kaz: '🦽 ОДА', rus: '🦽 ОДА' },
    OTHER: { kaz: '📋 Басқа', rus: '📋 Другое' }
  }
  return map[type]?.[l === 'kaz' ? 'kaz' : 'rus'] || type
}

function equipmentLabel(eq, l) {
  const map = {
    WHEELCHAIR_LIFT: { kaz: '🔧 Лифт', rus: '🔧 Подъёмник' },
    HAND_CONTROLS: { kaz: '✋ Қол басқару', rus: '✋ Ручное управление' },
    EXTRA_SPACE: { kaz: '🚐 Кең орын', rus: '🚐 Доп. место' },
    VISUAL_GUIDE: { kaz: '🦯 Бағыттаушы', rus: '🦯 Поводырь' }
  }
  return map[eq]?.[l === 'kaz' ? 'kaz' : 'rus'] || eq
}

function formatDateTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
/* ── Hero ── */
.taxi-hero {
  background: linear-gradient(135deg, #0A1628 0%, #1a3a6b 60%, #0B2550 100%);
  padding: 56px 0 52px;
}
.taxi-hero-inner { display: flex; gap: 48px; align-items: center; }
.taxi-hero-text { flex: 1; }
.taxi-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,0.12); color: white;
  font-size: var(--fs-sm); font-weight: 700; letter-spacing: 0.04em;
  padding: 6px 14px; border-radius: var(--radius-full);
  border: 1px solid rgba(255,255,255,0.2); margin-bottom: 20px;
}
.taxi-hero-title { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 900; color: white; line-height: 1.2; margin-bottom: 14px; }
.taxi-hero-desc { font-size: var(--fs-md); color: rgba(255,255,255,0.75); line-height: 1.7; margin-bottom: 20px; max-width: 520px; }
.taxi-hero-features { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.taxi-feature { display: flex; align-items: center; gap: 6px; font-size: var(--fs-sm); color: rgba(255,255,255,0.85); font-weight: 500; }
.taxi-hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-white-outline { background: white; color: var(--primary-dark); font-weight: 700; }
.btn-white-outline:hover { background: var(--primary-pale); }
.btn-outline-white { background: transparent; border: 2px solid rgba(255,255,255,0.5); color: white; }
.btn-outline-white:hover { background: rgba(255,255,255,0.1); border-color: white; }
.taxi-hero-illustration { flex-shrink: 0; width: 340px; }
.taxi-hero-img { width: 100%; height: 260px; object-fit: cover; border-radius: var(--radius-xl); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
@media (max-width: 860px) { .taxi-hero-inner { flex-direction: column; } .taxi-hero-illustration { width: 100%; } .taxi-hero-img { height: 200px; } }

/* ── Main / Tabs ── */
.taxi-main { padding: 36px 0 64px; }
.taxi-tabs { display: flex; gap: 4px; background: var(--gray-100); border-radius: var(--radius-lg); padding: 4px; margin-bottom: 28px; overflow-x: auto; }
.taxi-tab {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; min-width: max-content;
  padding: 10px 18px; border-radius: calc(var(--radius-lg) - 4px);
  font-size: var(--fs-sm); font-weight: 600; color: var(--gray-600);
  transition: all var(--transition); cursor: pointer; position: relative;
}
.taxi-tab.active { background: white; color: var(--primary); box-shadow: var(--shadow); }
.tab-count { background: var(--primary); color: white; font-size: 10px; font-weight: 800; border-radius: 10px; padding: 1px 6px; min-width: 18px; text-align: center; }
.tab-count--red { background: #EF4444; }
.taxi-tab-content { animation: fadeSlideUp 0.25s ease; }
@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* ── Book Form ── */
.book-layout { display: grid; grid-template-columns: 1fr 320px; gap: 28px; }
@media (max-width: 860px) { .book-layout { grid-template-columns: 1fr; } }
.book-form-wrap { background: white; border-radius: var(--radius-xl); padding: 28px; box-shadow: var(--shadow); }
.section-title-sm { font-size: var(--fs-xl); font-weight: 800; color: var(--black); margin-bottom: 20px; }
.book-form { display: flex; flex-direction: column; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { display: flex; align-items: center; gap: 5px; font-size: var(--fs-sm); font-weight: 600; color: var(--gray-700); }
.form-input { padding: 10px 14px; border: 1.5px solid var(--gray-200); border-radius: var(--radius-md); font-size: var(--fs-sm); color: var(--black); background: white; transition: border-color var(--transition), box-shadow var(--transition); }
.form-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
.form-select { cursor: pointer; }
.form-textarea { resize: vertical; min-height: 72px; }
.form-auth-notice { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #FEF3C7; border-radius: var(--radius-md); font-size: var(--fs-sm); color: #92400E; }
.auth-link { color: var(--primary); font-weight: 700; text-decoration: none; margin-left: 4px; }
.book-submit { width: 100%; justify-content: center; gap: 8px; margin-top: 4px; }
.booking-success { display: flex; align-items: center; gap: 14px; background: #ECFDF5; border: 1.5px solid #6EE7B7; border-radius: var(--radius-lg); padding: 16px 20px; margin-top: 20px; color: #065F46; font-size: var(--fs-sm); }
.booking-success strong { display: block; font-size: var(--fs-md); }
.booking-success-close { margin-left: auto; color: #6EE7B7; font-size: 18px; cursor: pointer; }

/* ── Info Cards ── */
.book-info-aside { display: flex; flex-direction: column; gap: 16px; }
.info-card { background: white; border-radius: var(--radius-xl); padding: 22px; box-shadow: var(--shadow); }
.info-card-icon { font-size: 28px; margin-bottom: 8px; }
.info-card h3 { font-size: var(--fs-md); font-weight: 700; color: var(--black); margin-bottom: 14px; }
.status-flow { display: flex; flex-direction: column; gap: 12px; }
.status-step { display: flex; align-items: flex-start; gap: 12px; }
.status-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; }
.status-name { font-size: var(--fs-xs); font-weight: 800; color: var(--gray-500); letter-spacing: 0.05em; }
.status-desc { font-size: var(--fs-xs); color: var(--gray-600); margin-top: 1px; line-height: 1.4; }
.info-card-text { font-size: var(--fs-sm); color: var(--gray-500); margin-bottom: 12px; }
.contact-link { display: flex; align-items: center; gap: 8px; font-size: var(--fs-sm); font-weight: 600; color: var(--primary); text-decoration: none; padding: 8px 0; border-bottom: 1px solid var(--gray-100); }
.contact-link:last-child { border-bottom: none; }
.whatsapp-link { color: #22C55E; }

/* ── My Bookings ── */
.bookings-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.bookings-list { display: flex; flex-direction: column; gap: 14px; }
.booking-card {
  background: white; border-radius: var(--radius-lg); padding: 18px 20px;
  box-shadow: var(--shadow); cursor: pointer;
  transition: all var(--transition); border-left: 4px solid var(--gray-200);
}
.booking-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.booking-card--pending { border-left-color: #F59E0B; }
.booking-card--confirmed { border-left-color: #3B82F6; }
.booking-card--in_progress { border-left-color: #F97316; }
.booking-card--completed { border-left-color: #22C55E; }
.booking-card--cancelled { border-left-color: #EF4444; opacity: 0.75; }
.booking-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.booking-date { font-size: var(--fs-xs); color: var(--gray-500); }
.booking-status-badge { padding: 3px 10px; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; }
.badge-pending { background: #FEF3C7; color: #92400E; }
.badge-confirmed { background: #DBEAFE; color: #1E40AF; }
.badge-in_progress { background: #FED7AA; color: #9A3412; }
.badge-completed { background: #D1FAE5; color: #065F46; }
.badge-cancelled { background: #FEE2E2; color: #991B1B; }
.booking-card-route { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
.route-point { display: flex; align-items: center; gap: 10px; }
.route-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.route-dot--from { background: var(--primary); }
.route-dot--to { background: #22C55E; }
.route-line { width: 1px; height: 14px; background: var(--gray-300); margin-left: 4.5px; }
.route-addr { font-size: var(--fs-sm); color: var(--gray-700); font-weight: 500; }
.booking-driver-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-top: 1px solid var(--gray-100); margin-bottom: 4px; }
.driver-mini-avatar { width: 22px; height: 22px; border-radius: 50%; background: var(--primary-pale); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; }
.driver-mini-name { font-size: var(--fs-xs); font-weight: 700; color: var(--black); }
.driver-mini-vehicle { font-size: var(--fs-xs); color: var(--gray-500); }
.booking-card-footer { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.disability-chip { background: var(--gray-100); padding: 3px 10px; border-radius: var(--radius-full); font-size: 11px; color: var(--gray-600); font-weight: 600; }
.chat-count { display: flex; align-items: center; gap: 4px; font-size: var(--fs-xs); color: var(--gray-500); }
.cancel-btn { margin-left: auto; color: #EF4444; font-size: var(--fs-xs); font-weight: 600; }
.cancel-btn:hover { text-decoration: underline; }

/* ── Drivers ── */
.drivers-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.driver-filter-btns { display: flex; gap: 8px; }
.filter-pill { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: var(--radius-full); border: 1.5px solid var(--gray-200); font-size: var(--fs-xs); font-weight: 600; color: var(--gray-600); cursor: pointer; transition: all var(--transition); background: white; }
.filter-pill.active { background: var(--primary); color: white; border-color: var(--primary); }
.status-dot-sm { width: 8px; height: 8px; border-radius: 50%; }
.status-dot--green { background: #22C55E; }
.status-dot--gray { background: #9CA3AF; }
.drivers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.driver-card { background: white; border-radius: var(--radius-xl); padding: 24px 20px; box-shadow: var(--shadow); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all var(--transition); }
.driver-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
.driver-card--inactive { opacity: 0.65; }
.driver-avatar-wrap { position: relative; }
.driver-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; }
.driver-status-dot { position: absolute; bottom: 4px; right: 4px; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; }
.dot-active { background: #22C55E; }
.dot-inactive { background: #9CA3AF; }
.driver-name { font-size: var(--fs-lg); font-weight: 800; color: var(--black); }
.driver-rating { display: flex; align-items: center; gap: 4px; font-size: var(--fs-sm); }
.stars { color: #F59E0B; letter-spacing: 1px; }
.rating-num { font-weight: 700; color: var(--black); }
.rating-rides { color: var(--gray-400); font-size: var(--fs-xs); }
.driver-vehicle { font-size: var(--fs-xs); color: var(--gray-500); display: flex; align-items: center; gap: 4px; }
.driver-bio { font-size: var(--fs-xs); color: var(--gray-500); line-height: 1.5; text-align: center; }
.driver-equipment { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.equipment-tag { background: #EFF6FF; color: var(--primary); font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: var(--radius-full); }
.driver-actions { margin-top: 4px; width: 100%; }
.driver-unavailable { font-size: var(--fs-xs); color: var(--gray-400); font-weight: 600; }
.btn-whatsapp { background: #22C55E; color: white; display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: var(--radius-full); font-size: var(--fs-sm); font-weight: 700; text-decoration: none; }
.btn-whatsapp:hover { background: #16A34A; }

/* ── Manager Panel ── */
.manager-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 28px; }
@media (max-width: 800px) { .manager-stats { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 480px) { .manager-stats { grid-template-columns: repeat(2, 1fr); } }
.stat-card { border-radius: var(--radius-lg); padding: 18px 16px; text-align: center; background: white; box-shadow: var(--shadow); border-top: 4px solid transparent; }
.stat-card--yellow { border-top-color: #F59E0B; }
.stat-card--blue { border-top-color: #3B82F6; }
.stat-card--orange { border-top-color: #F97316; }
.stat-card--green { border-top-color: #22C55E; }
.stat-card--primary { border-top-color: var(--primary); }
.stat-num { font-size: 2.2rem; font-weight: 900; color: var(--black); line-height: 1; }
.stat-label { font-size: var(--fs-xs); color: var(--gray-500); font-weight: 600; margin-top: 6px; }
.manager-subtitle { display: flex; align-items: center; gap: 8px; font-size: var(--fs-lg); font-weight: 700; color: var(--black); margin-bottom: 16px; }
.queue-dot { width: 10px; height: 10px; border-radius: 50%; background: #F59E0B; display: inline-block; }
.queue-list { display: flex; flex-direction: column; gap: 14px; }
.queue-item { background: white; border-radius: var(--radius-lg); padding: 18px 20px; box-shadow: var(--shadow); }
.queue-item-main { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: start; margin-bottom: 14px; }
@media (max-width: 700px) { .queue-item-main { grid-template-columns: 1fr; } }
.queue-user { display: flex; align-items: center; gap: 10px; }
.queue-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--primary-pale); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; flex-shrink: 0; }
.queue-user-name { font-size: var(--fs-sm); font-weight: 700; color: var(--black); }
.queue-user-phone { font-size: var(--fs-xs); color: var(--gray-500); }
.queue-route { display: flex; flex-direction: column; gap: 4px; }
.queue-addr { font-size: var(--fs-xs); color: var(--gray-700); }
.queue-arrow { font-size: var(--fs-xs); color: var(--gray-400); }
.queue-meta { display: flex; flex-direction: column; gap: 4px; text-align: right; }
.queue-time { font-size: var(--fs-xs); font-weight: 600; color: var(--gray-600); }
.queue-disability { font-size: 11px; background: var(--gray-100); padding: 2px 8px; border-radius: var(--radius-full); color: var(--gray-600); }
.queue-note { font-size: var(--fs-xs); color: var(--gray-500); font-style: italic; }
.queue-actions { display: flex; gap: 10px; align-items: center; border-top: 1px solid var(--gray-100); padding-top: 14px; }
.assign-select { flex: 1; padding: 8px 12px; border: 1.5px solid var(--gray-200); border-radius: var(--radius-md); font-size: var(--fs-sm); }
.assign-select:focus { outline: none; border-color: var(--primary); }
.add-driver-form { background: white; border-radius: var(--radius-xl); padding: 24px; box-shadow: var(--shadow); }
.add-driver-success { color: #065F46; font-size: var(--fs-sm); font-weight: 600; margin-left: 12px; }
.empty-state-sm { background: white; border-radius: var(--radius-lg); padding: 24px; text-align: center; color: var(--gray-500); font-size: var(--fs-sm); box-shadow: var(--shadow); }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal-box { background: white; border-radius: var(--radius-xl); width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 80px rgba(0,0,0,0.3); }
.booking-modal {}
.modal-header { display: flex; align-items: center; gap: 12px; padding: 20px 24px; border-bottom: 1px solid var(--gray-100); position: sticky; top: 0; background: white; z-index: 1; }
.modal-header h3 { font-size: var(--fs-lg); font-weight: 800; color: var(--black); flex: 1; }
.modal-close { color: var(--gray-400); font-size: 18px; cursor: pointer; transition: color var(--transition); }
.modal-close:hover { color: var(--black); }
.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 20px; }
.modal-section { }
.modal-section-title { font-size: var(--fs-sm); font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
.modal-route { display: flex; flex-direction: column; gap: 0; background: var(--gray-50); border-radius: var(--radius-md); padding: 14px; }
.route-label { font-size: 11px; color: var(--gray-400); font-weight: 600; text-transform: uppercase; }
.route-line-v { width: 1.5px; height: 20px; background: var(--gray-300); margin-left: 4.5px; }
.modal-info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.modal-info-item { background: var(--gray-50); border-radius: var(--radius-md); padding: 12px 14px; }
.modal-info-item--full { grid-column: 1/-1; }
.mii-label { display: block; font-size: 11px; color: var(--gray-400); font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
.mii-val { font-size: var(--fs-sm); font-weight: 600; color: var(--black); }
.modal-driver-card { display: flex; align-items: center; gap: 14px; background: var(--gray-50); border-radius: var(--radius-md); padding: 14px; }
.modal-driver-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; flex-shrink: 0; }
.modal-driver-info { flex: 1; }
.modal-driver-name { font-weight: 700; color: var(--black); font-size: var(--fs-sm); }
.modal-driver-vehicle { font-size: var(--fs-xs); color: var(--gray-500); }
.modal-driver-rating { font-size: var(--fs-xs); color: #F59E0B; font-weight: 600; }
.modal-driver-actions { display: flex; gap: 8px; }
.existing-review { background: #FFFBEB; border-radius: var(--radius-md); padding: 12px; }
.review-stars { font-size: 22px; color: #F59E0B; letter-spacing: 3px; }
.review-comment { font-size: var(--fs-sm); color: var(--gray-600); margin-top: 6px; }
.review-form { display: flex; flex-direction: column; gap: 10px; }
.star-picker { display: flex; gap: 6px; }
.star-btn { font-size: 24px; color: var(--gray-300); cursor: pointer; transition: color 0.15s; }
.star-btn.active { color: #F59E0B; }
.chat-box { background: var(--gray-50); border-radius: var(--radius-md); padding: 14px; min-height: 140px; max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
.chat-empty { text-align: center; color: var(--gray-400); font-size: var(--fs-sm); margin: auto; }
.chat-msg { max-width: 80%; display: flex; flex-direction: column; gap: 2px; }
.chat-msg--user { align-self: flex-end; align-items: flex-end; }
.chat-msg--manager { align-self: flex-start; }
.chat-msg-sender { font-size: 10px; color: var(--gray-400); font-weight: 600; }
.chat-msg-text { padding: 8px 12px; border-radius: var(--radius-md); font-size: var(--fs-sm); line-height: 1.5; }
.chat-msg--user .chat-msg-text { background: var(--primary); color: white; border-bottom-right-radius: 4px; }
.chat-msg--manager .chat-msg-text { background: white; color: var(--black); border: 1px solid var(--gray-200); border-bottom-left-radius: 4px; }
.chat-msg-time { font-size: 10px; color: var(--gray-400); }
.chat-input-row { display: flex; gap: 8px; margin-top: 10px; }
.chat-input { flex: 1; padding: 9px 14px; }
.chat-send-btn { padding: 9px 14px; flex-shrink: 0; }

/* ── Spinner ── */
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Skeleton ── */
.bookings-grid, .driver-card-skeleton, .queue-skeleton { display: grid; gap: 14px; }
.booking-card-skeleton, .driver-card-skeleton { background: white; border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--shadow); }

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box { transform: scale(0.94) translateY(12px); }
</style>
