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
          <h1 class="taxi-hero-title">{{ t('taxiHeroTitle') }}</h1>
          <p class="taxi-hero-desc">{{ t('taxiHeroDesc') }}</p>
          <div class="taxi-hero-features">
            <span class="taxi-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>{{ t('taxiFeatureWheelchair') }}</span>
            <span class="taxi-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>{{ t('taxiFeatureDrivers') }}</span>
            <span class="taxi-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>{{ t('taxiFeatureChat') }}</span>
            <span class="taxi-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>{{ t('taxiFeatureBooking') }}</span>
          </div>
          <div class="taxi-hero-cta">
            <button class="btn btn-white-outline btn-lg" @click="activeTab = 'book'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ t('orderRideBtn') }}
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
          @click="switchTab(tab.id)"
        >
          <span v-html="tab.icon"></span>
          {{ tab.label }}
          <span v-if="tab.id === 'bookings' && myBookings.length" class="tab-count">{{ myBookings.length }}</span>
          <span v-if="tab.id === 'bookings' && unreadChatBadge > 0" class="tab-count tab-count--chat" title="Непрочитанных сообщений от диспетчера">💬{{ unreadChatBadge }}</span>
          <span v-if="tab.id === 'manager' && managerStats.pending" class="tab-count tab-count--red">{{ managerStats.pending }}</span>
        </button>
      </div>

      <!-- ── TAB: BOOK ── -->
      <div v-if="activeTab === 'book'" class="taxi-tab-content">
        <div class="book-layout">
          <div class="book-form-wrap">
            <h2 class="section-title-sm">{{ t('newRideRequest') }}</h2>
            <form class="book-form" @submit.prevent="handleCreateBooking">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 14 8 14s8-8.5 8-14a8 8 0 0 0-8-8z"/></svg>
                    {{ t('fromAddressLabel') }} *
                  </label>
                  <input v-model="form.fromAddress" type="text" class="form-input" placeholder="ул. Абая 1, Алматы" required />
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 14 8 14s8-8.5 8-14a8 8 0 0 0-8-8z"/></svg>
                    {{ t('toAddressLabel') }} *
                  </label>
                  <input v-model="form.toAddress" type="text" class="form-input" placeholder="ул. Достык 10, Алматы" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {{ t('dateTimeLabel') }} *
                  </label>
                  <input v-model="form.scheduledAt" type="datetime-local" class="form-input" :min="minDateTime" required />
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    {{ t('disabilityTypeLabel') }} *
                  </label>
                  <select v-model="form.disabilityType" class="form-input form-select" required>
                    <option value="">{{ t('selectPlaceholder') }}</option>
                    <option value="WHEELCHAIR">{{ t('typeWheelchair') }}</option>
                    <option value="VISUAL">{{ t('typeVisual') }}</option>
                    <option value="HEARING">{{ t('typeHearing') }}</option>
                    <option value="MOBILITY">{{ t('typeMobility') }}</option>
                    <option value="OTHER">{{ t('typeOther') }}</option>
                  </select>
                </div>
              </div>
              <!-- For RELATIVE: select dependent -->
              <div v-if="authStore.isRelative && dependents.length > 0" class="form-group">
                <label class="form-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  {{ t('forWhomLabel') }}
                </label>
                <select v-model="form.dependentId" class="form-input form-select">
                  <option value="">{{ t('forMyselfOption') }}</option>
                  <option v-for="dep in dependents" :key="dep.dependentId" :value="dep.dependentId">
                    {{ dep.dependent?.profile?.firstName || dep.dependent?.email || dep.label || dep.dependentId }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('driverNoteLabel') }}</label>
                <textarea v-model="form.note" class="form-input form-textarea" :placeholder="t('driverNotePlaceholder')" rows="2"></textarea>
              </div>

              <div v-if="!authStore.isAuthenticated" class="form-auth-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {{ t('loginToOrder') }}
                <RouterLink to="/login" class="auth-link">{{ t('login') }}</RouterLink>
              </div>
              <div v-if="bookingError" class="field-error-sm">⚠️ {{ bookingError }}</div>
              <button type="submit" class="btn btn-primary btn-lg book-submit" :disabled="bookingLoading || !authStore.isAuthenticated">
                <span v-if="bookingLoading" class="spinner-sm"></span>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                {{ bookingLoading ? t('submitting') : t('submitOrderBtn') }}
              </button>
            </form>
          </div>
          <div class="book-info-aside">
            <div class="info-card">
              <div class="info-card-icon">📋</div>
              <h3>{{ t('orderStatusTitle') }}</h3>
              <div class="status-flow">
                <div class="status-step" v-for="(s, i) in statusFlow" :key="i">
                  <span class="status-dot" :style="{ background: s.color }"></span>
                  <div>
                    <div class="status-name">{{ s.name }}</div>
                    <div class="status-desc">{{ lang === 'eng' ? (s.descEng || s.desc) : (lang === 'kaz' ? s.descKaz : s.desc) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="info-card">
              <div class="info-card-icon">📞</div>
              <h3>{{ t('contactTitle') }}</h3>
              <p class="info-card-text">{{ t('contactMsg') }}</p>
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
              <strong>{{ t('orderAcceptedMsg') }}</strong>
              <span>{{ t('managerMsg') }}</span>
            </div>
            <button class="booking-success-close" @click="bookingSuccess = false">✕</button>
          </div>
        </Transition>
      </div>

      <!-- ── TAB: MY BOOKINGS ── -->
      <div v-else-if="activeTab === 'bookings'" class="taxi-tab-content">
        <div class="bookings-header">
          <h2 class="section-title-sm">{{ t('myRidesTitle') }}</h2>
          <button class="btn btn-primary btn-sm" @click="activeTab = 'book'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {{ t('newOrderBtn') }}
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
          <p>{{ t('loginToRides') }}</p>
          <RouterLink to="/login" class="btn btn-primary mt-4">{{ t('login') }}</RouterLink>
        </div>
        <div v-else-if="myBookings.length === 0" class="empty-state">
          <div class="empty-state-icon">🚐</div>
          <p>{{ t('noOrders') }}</p>
          <button class="btn btn-primary mt-4" @click="activeTab = 'book'">{{ t('submitOrderBtn') }}</button>
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
              <div class="driver-mini-avatar">{{ (booking.driver.firstName || '?').charAt(0) }}</div>
              <span class="driver-mini-name">{{ booking.driver.firstName }} {{ booking.driver.lastName }}</span>
              <span class="driver-mini-vehicle">· {{ booking.driver.vehicleModel }}</span>
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
                {{ t('cancelRide') }}
              </button>
              <button
                v-if="booking.status === 'CONFIRMED' && !booking._paymentDone"
                class="pay-btn"
                @click.stop="openPayment(booking)"
              >
                💳 {{ t('payRide') }}
              </button>
              <button
                v-if="booking.status === 'COMPLETED' && !booking._reviewed"
                class="review-btn"
                @click.stop="openReview(booking)"
              >
                ⭐ {{ t('rateRide') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TAB: DRIVERS ── -->
      <div v-else-if="activeTab === 'drivers'" class="taxi-tab-content">
        <div class="drivers-header">
          <h2 class="section-title-sm">{{ t('ourDrivers') }}</h2>
          <div class="driver-filter-btns">
            <button class="filter-pill" :class="{ active: driverFilter === 'all' }" @click="driverFilter = 'all'">{{ t('allFilter') }}</button>
            <button class="filter-pill" :class="{ active: driverFilter === 'ACTIVE' }" @click="driverFilter = 'ACTIVE'">
              <span class="status-dot-sm status-dot--green"></span>{{ t('activeDrivers') }}
            </button>
            <button class="filter-pill" :class="{ active: driverFilter === 'INACTIVE' }" @click="driverFilter = 'INACTIVE'">
              <span class="status-dot-sm status-dot--gray"></span>{{ t('inactiveDrivers') }}
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
              <div class="driver-avatar">{{ (driver.firstName || '?').charAt(0) }}</div>
              <span class="driver-status-dot" :class="driver.status === 'ACTIVE' ? 'dot-active' : 'dot-inactive'"></span>
            </div>
            <h3 class="driver-name">{{ driver.firstName }} {{ driver.lastName }}</h3>
            <div class="driver-rating">
              <span class="stars">{{ '★'.repeat(Math.round(driver.ratingAvg)) }}{{ '☆'.repeat(5 - Math.round(driver.ratingAvg)) }}</span>
              <span class="rating-num">{{ driver.ratingAvg.toFixed(1) }}</span>
              <span class="rating-rides">· {{ driver.totalTrips }} {{ t('ridesCount') }}</span>
            </div>
            <div class="driver-vehicle">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              {{ driver.vehicleModel }} · {{ driver.licensePlate }}
            </div>
            <p class="driver-bio">{{ lang.value === 'kaz' ? (driver.bioKk || driver.bio) : driver.bio }}</p>
            <div class="driver-equipment">
              <span v-for="eq in driver.equipment" :key="eq" class="equipment-tag">
                {{ equipmentLabel(eq, lang) }}
              </span>
            </div>
            <div class="driver-actions">
              <span v-if="driver.status !== 'ACTIVE'" class="driver-unavailable">{{ t('driverUnavailable') }}</span>
              <a v-else :href="driver.whatsapp" target="_blank" class="btn btn-whatsapp">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.003 2.003C6.476 2.003 2 6.478 2 12.003c0 1.992.578 3.854 1.59 5.43L2 22l4.65-1.574A9.957 9.957 0 0 0 12.003 22C17.53 22 22 17.525 22 12 22 6.476 17.53 2.003 12.003 2.003zm0 18.197a8.157 8.157 0 0 1-4.164-1.14l-.298-.179-3.088 1.046 1.056-3.019-.199-.316A8.16 8.16 0 0 1 3.8 12c0-4.519 3.678-8.197 8.203-8.197 4.524 0 8.197 3.678 8.197 8.197 0 4.524-3.673 8.197-8.197 8.197z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TAB: RECURRING ── -->
      <div v-else-if="activeTab === 'recurring'" class="taxi-tab-content">
        <div class="bookings-header">
          <h2 class="section-title-sm">{{ t('regularRides') }}</h2>
          <button class="btn btn-primary btn-sm" @click="showRecurringForm = !showRecurringForm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {{ t('addBtn') }}
          </button>
        </div>

        <!-- Create form -->
        <div v-if="showRecurringForm" class="recurring-form-card">
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">{{ t('fromLabel') }}</label>
              <input v-model="recurringForm.fromAddress" type="text" class="form-input" :placeholder="t('fromAddressLabel')" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('toLabel') }}</label>
              <input v-model="recurringForm.toAddress" type="text" class="form-input" :placeholder="t('toAddressLabel')" />
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">{{ t('timeLabel') }}</label>
              <input v-model="recurringForm.time" type="time" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('daysLabel') }}</label>
              <div class="weekday-picker">
                <button
                  v-for="(d, i) in weekdays"
                  :key="i"
                  class="weekday-btn"
                  :class="{ active: recurringForm.weekdays.includes(i) }"
                  @click="toggleWeekday(i)"
                >{{ d }}</button>
              </div>
            </div>
          </div>
          <div v-if="recurringError" class="field-error-sm">{{ recurringError }}</div>
          <div class="form-actions">
            <button class="btn btn-outline btn-sm" @click="showRecurringForm=false">{{ t('cancel') }}</button>
            <button class="btn btn-primary btn-sm" :disabled="recurringLoading" @click="submitRecurring">
              <span v-if="recurringLoading" class="spinner-sm"></span>
              {{ t('send') }}
            </button>
          </div>
        </div>

        <!-- List -->
        <div v-if="recurringLoading && recurringRides.length === 0" class="empty-state">
          <span class="spinner-sm" style="margin:0 auto"></span>
        </div>
        <div v-else-if="recurringRides.length === 0" class="empty-state">
          <div class="empty-state-icon">🔁</div>
          <p>{{ t('noRegularRides') }}</p>
        </div>
        <div v-else class="recurring-list">
          <div v-for="r in recurringRides" :key="r.id" class="recurring-card">
            <div class="recurring-route">
              <span class="rec-dot rec-dot--from"></span>
              <div class="rec-addresses">
                <span class="rec-addr">{{ r.fromAddress }}</span>
                <span class="rec-arrow">→</span>
                <span class="rec-addr">{{ r.toAddress }}</span>
              </div>
            </div>
            <div class="recurring-meta">
              <span class="rec-time">🕐 {{ r.time || '—' }}</span>
              <span class="rec-days">{{ formatWeekdays(r.weekdays) }}</span>
              <span class="rec-status-badge" :class="r.isPaused ? 'badge-cancelled' : 'badge-confirmed'">
                {{ r.isPaused ? t('pausedStatus') : t('activeStatus') }}
              </span>
            </div>
            <div class="recurring-actions">
              <button v-if="!r.isPaused" class="btn btn-outline btn-sm" @click="handlePauseRecurring(r.id)">⏸ {{ t('pauseBtn') }}</button>
              <button v-else class="btn btn-primary btn-sm" @click="handleResumeRecurring(r.id)">▶ {{ t('resumeBtn') }}</button>
              <button class="btn btn-sm" style="color:#DC2626;border-color:#DC2626" @click="handleDeleteRecurring(r.id)">🗑</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TAB: MANAGER ── -->
      <div v-else-if="activeTab === 'manager'" class="taxi-tab-content">
        <h2 class="section-title-sm">{{ t('managerPanel') }}</h2>

        <!-- Stats row -->
        <div class="manager-stats">
          <div class="stat-card stat-card--yellow">
            <div class="stat-num">{{ managerStats.pending }}</div>
            <div class="stat-label">{{ t('statPending') }}</div>
          </div>
          <div class="stat-card stat-card--blue">
            <div class="stat-num">{{ managerStats.confirmed }}</div>
            <div class="stat-label">{{ t('statConfirmed') }}</div>
          </div>
          <div class="stat-card stat-card--orange">
            <div class="stat-num">{{ managerStats.inProgress }}</div>
            <div class="stat-label">{{ t('statInProgress') }}</div>
          </div>
          <div class="stat-card stat-card--green">
            <div class="stat-num">{{ managerStats.completed }}</div>
            <div class="stat-label">{{ t('statCompleted') }}</div>
          </div>
          <div class="stat-card stat-card--primary">
            <div class="stat-num">{{ managerStats.availableDrivers }}</div>
            <div class="stat-label">{{ t('statFreeDrivers') }}</div>
          </div>
        </div>

        <!-- Queue -->
        <h3 class="manager-subtitle">
          <span class="queue-dot"></span>
          {{ t('pendingQueue') }}
        </h3>
        <div v-if="queueLoading" class="queue-skeleton">
          <div v-for="i in 3" :key="i" class="skeleton" style="height:90px;border-radius:12px"></div>
        </div>
        <div v-else-if="managerQueue.length === 0" class="empty-state-sm">
          <span>✅ {{ t('queueEmpty') }}</span>
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
                <option value="">{{ t('selectDriverOpt') }}</option>
                <option v-for="d in availableDriversList" :key="d.id" :value="d.id">
                  {{ d.firstName }} {{ d.lastName }} · {{ d.vehicleModel }}
                </option>
              </select>
              <button
                class="btn btn-primary btn-sm"
                :disabled="!assignMap[item.id] || assigning[item.id]"
                @click="handleAssignDriver(item.id)"
              >
                <span v-if="assigning[item.id]" class="spinner-sm"></span>
                {{ assigning[item.id] ? '...' : t('assignBtn') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Add Driver Form -->
        <h3 class="manager-subtitle" style="margin-top:40px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ t('addDriverTitle') }}
        </h3>
        <form class="add-driver-form" @submit.prevent="handleAddDriver">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ t('fullNameLabel') }} *</label>
              <input v-model="driverForm.name" type="text" class="form-input" placeholder="Асхат Бекжанов" required />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('phoneLabel') }} *</label>
              <input v-model="driverForm.phone" type="tel" class="form-input" placeholder="+77011234567" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ t('vehicleLabel') }} *</label>
              <input v-model="driverForm.vehicle" type="text" class="form-input" placeholder="Toyota Sienna 2021" required />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('plateLabel') }} *</label>
              <input v-model="driverForm.licensePlate" type="text" class="form-input" placeholder="777 ASK 02" required />
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="driverAddLoading">
            <span v-if="driverAddLoading" class="spinner-sm"></span>
            {{ driverAddLoading ? '...' : t('addDriverBtn') }}
          </button>
          <Transition name="fade">
            <span v-if="driverAddSuccess" class="add-driver-success">✓ {{ t('driverAdded') }}</span>
          </Transition>
        </form>
      </div>
    </div>

    <!-- Booking Detail Modal -->
    <Transition name="modal">
      <div v-if="selectedBooking" class="modal-overlay" @click.self="selectedBooking = null">
        <div class="modal-box booking-modal">
          <div class="modal-header">
            <div class="modal-header-left">
              <h3>{{ t('bookingDetails') }}</h3>
              <span class="booking-status-badge" :class="'badge-' + selectedBooking.status.toLowerCase()">{{ statusLabel(selectedBooking.status, lang) }}</span>
            </div>
            <button class="modal-close" @click="selectedBooking = null">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <!-- Route -->
            <div class="modal-section">
              <div class="modal-route">
                <div class="route-point">
                  <span class="route-dot route-dot--from"></span>
                  <div><div class="route-label">{{ t('fromRouteLabel') }}</div><div class="route-addr">{{ selectedBooking.fromAddress }}</div></div>
                </div>
                <div class="route-line-v"></div>
                <div class="route-point">
                  <span class="route-dot route-dot--to"></span>
                  <div><div class="route-label">{{ t('toRouteLabel') }}</div><div class="route-addr">{{ selectedBooking.toAddress }}</div></div>
                </div>
              </div>
            </div>
            <!-- Info row -->
            <div class="modal-info-row">
              <div class="modal-info-item">
                <span class="mii-label">{{ t('dateLabel2') }}</span>
                <span class="mii-val">{{ formatDateTime(selectedBooking.scheduledAt) }}</span>
              </div>
              <div class="modal-info-item">
                <span class="mii-label">{{ t('disabilityLabel2') }}</span>
                <span class="mii-val">{{ disabilityLabel(selectedBooking.disabilityType, lang) }}</span>
              </div>
              <div v-if="selectedBooking.note" class="modal-info-item modal-info-item--full">
                <span class="mii-label">{{ t('noteLabel2') }}</span>
                <span class="mii-val">{{ selectedBooking.note }}</span>
              </div>
            </div>
            <!-- Driver -->
            <div v-if="selectedBooking.driver" class="modal-section">
              <h4 class="modal-section-title">{{ t('driverLabel') }}</h4>
              <div class="modal-driver-card">
                <div class="modal-driver-avatar">{{ (selectedBooking.driver.firstName || '?').charAt(0) }}</div>
                <div class="modal-driver-info">
                  <div class="modal-driver-name">{{ selectedBooking.driver.firstName }} {{ selectedBooking.driver.lastName }}</div>
                  <div class="modal-driver-vehicle">{{ selectedBooking.driver.vehicleModel }}</div>
                  <div class="modal-driver-rating">⭐ {{ selectedBooking.driver.ratingAvg }}</div>
                </div>
                <div class="modal-driver-actions">
                  <a :href="'tel:' + selectedBooking.driver.phone" class="btn btn-outline btn-sm">📞</a>
                  <a :href="selectedBooking.driver.whatsapp" target="_blank" class="btn btn-whatsapp btn-sm">💬</a>
                </div>
              </div>
            </div>
            <!-- Live tracking -->
            <div v-if="isTrackable(selectedBooking.status)" class="modal-section">
              <h4 class="modal-section-title">
                {{ t('liveTracking') }}
                <span class="live-badge" :class="{ on: liveConnected }">
                  <span class="live-dot"></span>{{ liveConnected ? 'LIVE' : t('noConnection') }}
                </span>
              </h4>
              <div v-if="driverLocation" class="track-wrap">
                <iframe
                  class="track-map"
                  :src="mapUrl"
                  title="Карта"
                  loading="lazy"
                ></iframe>
                <div class="track-info">
                  <div class="track-eta" v-if="driverEta != null">
                    🚐 {{ t('arrivalEta') }}:
                    <strong>{{ driverEta }} {{ t('minLabel') }}</strong>
                  </div>
                  <div class="track-coords">📍 {{ driverLocation.lat.toFixed(5) }}, {{ driverLocation.lon.toFixed(5) }}</div>
                </div>
              </div>
              <div v-else class="track-waiting">
                <span class="spinner-sm"></span>
                {{ t('waitingGps') }}
              </div>
            </div>

            <!-- Review -->
            <div v-if="selectedBooking.status === 'COMPLETED'" class="modal-section">
              <h4 class="modal-section-title">{{ t('rateTrip') }}</h4>
              <div v-if="selectedBooking.review" class="existing-review">
                <div class="review-stars">{{ '★'.repeat(selectedBooking.review.rating) }}{{ '☆'.repeat(5 - selectedBooking.review.rating) }}</div>
                <p v-if="selectedBooking.review.comment" class="review-comment">{{ selectedBooking.review.comment }}</p>
              </div>
              <div v-else class="review-form">
                <div class="star-picker">
                  <button v-for="n in 5" :key="n" class="star-btn" :class="{ active: reviewRating >= n }" @click="reviewRating = n">★</button>
                </div>
                <input v-model="reviewComment" type="text" class="form-input" :placeholder="t('commentPlaceholder')" />
                <button class="btn btn-primary btn-sm" :disabled="!reviewRating || reviewSubmitting" @click="handleLeaveReview">
                  {{ reviewSubmitting ? '...' : t('send') }}
                </button>
              </div>
            </div>
            <!-- Chat -->
            <div class="modal-section">
              <h4 class="modal-section-title">{{ t('chatManager') }}</h4>
              <div class="chat-box" ref="chatBoxRef">
                <div v-if="chatMessages.length === 0" class="chat-empty">{{ t('noMessages') }}</div>
                <div
                  v-for="msg in chatMessages"
                  :key="msg.id"
                  class="chat-msg"
                  :class="msg.senderType === 'USER' ? 'chat-msg--mine' : 'chat-msg--theirs'"
                >
                  <div class="chat-msg-label">{{ msg.senderType === 'USER' ? t('youLabel') : t('managerLabel') }}</div>
                  <div class="chat-msg-text">{{ msg.text }}</div>
                  <div class="chat-msg-time">{{ formatTime(msg.createdAt) }}</div>
                </div>
              </div>
              <div v-if="selectedBooking.status !== 'COMPLETED' && selectedBooking.status !== 'CANCELLED'" class="chat-input-row">
                <input
                  v-model="chatInput"
                  type="text"
                  class="form-input chat-input"
                  :placeholder="t('messagePlaceholder')"
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

    <!-- ── PAYMENT MODAL ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="paymentBooking" class="modal-overlay" @click.self="paymentBooking=null">
          <div class="modal-box" style="max-width:420px">
            <button class="modal-close-btn" @click="paymentBooking=null">✕</button>
            <h3 class="modal-title">💳 {{ t('payRide') }}</h3>
            <p class="modal-sub">{{ paymentBooking.fromAddress }} → {{ paymentBooking.toAddress }}</p>
            <div v-if="paymentBooking.price" class="payment-amount">{{ paymentBooking.price }} ₸</div>
            <div class="payment-methods">
              <button v-for="m in payMethods" :key="m.value" class="pay-method-btn" :class="{ active: payMethod===m.value }" @click="payMethod=m.value">
                {{ m.icon }} {{ lang.value === 'kaz' ? m.labelKk : lang.value === 'eng' ? (m.labelEn || m.labelRu) : m.labelRu }}
              </button>
            </div>
            <div v-if="payError" class="field-error-sm">{{ payError }}</div>
            <div v-if="paySuccess" class="save-success-sm">✅ {{ t('payConfirmed') }}</div>
            <div v-if="!paySuccess" class="modal-footer-btns">
              <button class="btn btn-outline btn-sm" @click="paymentBooking=null">{{ t('cancel') }}</button>
              <button class="btn btn-primary btn-sm" :disabled="payLoading" @click="submitPayment">
                <span v-if="payLoading" class="spinner-sm"></span>
                {{ t('payRide') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── REVIEW MODAL ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="reviewBooking" class="modal-overlay" @click.self="reviewBooking=null">
          <div class="modal-box" style="max-width:420px">
            <button class="modal-close-btn" @click="reviewBooking=null">✕</button>
            <h3 class="modal-title">⭐ {{ t('rateRide') }}</h3>
            <div v-if="reviewBooking.driver" class="review-driver-info">
              <div class="driver-mini-avatar">{{ (reviewBooking.driver.firstName || '?').charAt(0) }}</div>
              <span>{{ reviewBooking.driver.firstName }} {{ reviewBooking.driver.lastName }}</span>
            </div>
            <div class="review-stars-row">
              <button v-for="i in 5" :key="i" class="star-pick-btn" :class="i <= reviewRating ? 'star-on' : 'star-off'" @click="reviewRating=i">★</button>
            </div>
            <textarea v-model="reviewComment" class="form-input" rows="3" :placeholder="t('commentPlaceholder')" style="width:100%;margin-top:12px;resize:none;font-family:inherit" />
            <div v-if="reviewSubmitError" class="field-error-sm">{{ reviewSubmitError }}</div>
            <div v-if="reviewSubmitSuccess" class="save-success-sm">✅ {{ t('reviewSent') }}</div>
            <div v-if="!reviewSubmitSuccess" class="modal-footer-btns" style="margin-top:12px">
              <button class="btn btn-outline btn-sm" @click="reviewBooking=null">{{ t('cancel') }}</button>
              <button class="btn btn-primary btn-sm" :disabled="!reviewRating || reviewSubmitting" @click="submitDriverReview">
                <span v-if="reviewSubmitting" class="spinner-sm"></span>
                {{ t('send') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useAuthStore } from '../stores/auth.js'
import { useI18n } from '../i18n.js'
import {
  getMyBookings, createBooking, cancelBooking,
  getDrivers, leaveDriverReview, reviewDriver,
  getChatMessages, sendChatMessage, getDriverLocation,
  getManagerStats, getManagerQueue, getAvailableDrivers, assignDriver, addDriver,
  initiatePayment, confirmPayment,
  getRecurringRides, createRecurringRide, pauseRecurringRide, resumeRecurringRide, deleteRecurringRide,
  estimatePrice
} from '../api/taxi.js'
import {
  getTaxiSocket, joinBookingRoom,
  sendSocketMessage, disconnectTaxiSocket
} from '../api/taxiSocket.js'
import { getMyLinks } from '../api/profile.js'
import { getUnreadMessages } from '../api/taxi.js'
import { useToast } from '../stores/toast.js'

const a11y = useAccessibilityStore()
const authStore = useAuthStore()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const lang = computed(() => a11y.lang)
const t = computed(() => useI18n(lang.value))

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const activeTab = ref('book')
// Manager tab: only TAXI_MANAGER + ADMIN (isTaxiManager already covers both)
const isManager = computed(() => authStore.isTaxiManager)

const allTabs = [
  { id: 'book', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', labelKaz: 'Тапсырыс беру', labelRus: 'Заказать', labelEng: 'Book a ride' },
  { id: 'bookings', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', labelKaz: 'Менің сапарларым', labelRus: 'Мои поездки', labelEng: 'My rides' },
  { id: 'drivers', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', labelKaz: 'Жүргізушілер', labelRus: 'Водители', labelEng: 'Drivers' },
  { id: 'recurring', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>', labelKaz: 'Тұрақты', labelRus: 'Регулярные', labelEng: 'Regular' },
  { id: 'manager', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>', labelKaz: 'Менеджер', labelRus: 'Менеджер', labelEng: 'Manager', managerOnly: true }
]

const availableTabs = computed(() =>
  allTabs
    .filter(tab => !tab.managerOnly || isManager.value)
    .map(tab => ({ ...tab, label: lang.value === 'kaz' ? tab.labelKaz : lang.value === 'eng' ? tab.labelEng : tab.labelRus }))
)

// ─── Relative: dependents list ────────────────────────────────────────────────
const dependents = ref([])

onMounted(async () => {
  if (authStore.isRelative && authStore.isAuthenticated) {
    try {
      const links = await getMyLinks()
      dependents.value = links?.asGuardian ?? []
    } catch {}
  }
})

// ─── Booking Form ─────────────────────────────────────────────────────────────
const form = ref({ fromAddress: '', toAddress: '', scheduledAt: '', disabilityType: '', note: '', dependentId: '' })
const bookingLoading = ref(false)
const bookingSuccess = ref(false)

const minDateTime = computed(() => {
  const d = new Date(); d.setMinutes(d.getMinutes() + 30)
  return d.toISOString().slice(0, 16)
})

// ── Price estimate ────────────────────────────────────────────────────
const priceEstimate = ref(null)
const priceEstimateError = ref('')
const estimating = ref(false)

async function calcPriceEstimate() {
  estimating.value = true
  priceEstimate.value = null
  priceEstimateError.value = ''
  try {
    // Try browser geolocation to get fromLat/Lon — fallback gracefully
    const res = await estimatePrice({
      fromAddress: form.value.fromAddress,
      toAddress: form.value.toAddress,
    })
    priceEstimate.value = res?.estimatedPrice ?? res?.price ?? res?.amount ?? null
    if (priceEstimate.value === null) {
      priceEstimateError.value = lang.value === 'kaz' ? 'Баға диспетчермен анықталады' : 'Стоимость уточняется диспетчером'
    }
  } catch {
    priceEstimateError.value = lang.value === 'kaz' ? 'Баға диспетчермен анықталады' : 'Стоимость уточняется диспетчером'
  } finally {
    estimating.value = false
  }
}

const bookingError = ref('')

async function handleCreateBooking() {
  if (!authStore.isAuthenticated) return
  bookingLoading.value = true
  bookingError.value = ''
  try {
    const { dependentId, ...payload } = form.value
    if (dependentId) payload.dependentId = dependentId
    await createBooking(payload)
    form.value = { fromAddress: '', toAddress: '', scheduledAt: '', disabilityType: '', note: '', dependentId: '' }
    priceEstimate.value = null
    bookingSuccess.value = true
    setTimeout(() => { bookingSuccess.value = false }, 4000)
    myBookings.value = await getMyBookings()
  } catch (e) {
    bookingError.value = e?.message || (lang.value === 'kaz' ? 'Қате кетті, қайта көріңіз' : lang.value === 'eng' ? 'Error submitting. Please try again.' : 'Ошибка при подаче заявки. Попробуйте снова.')
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
    loadRecurringRides()
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
  // Запрос разрешения на browser-уведомления
  if (Notification && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  startUnreadChatPoll()
  checkAndOpenBooking()
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
let userChatPollTimer = null

function startUserChatPoll(bookingId) {
  stopUserChatPoll()
  userChatPollTimer = setInterval(async () => {
    try {
      const msgs = await getChatMessages(bookingId)
      if (msgs.length !== chatMessages.value.length) chatMessages.value = msgs
    } catch {}
  }, 4000)
}
function stopUserChatPoll() { if (userChatPollTimer) { clearInterval(userChatPollTimer); userChatPollTimer = null } }
const reviewRating = ref(0)
const reviewComment = ref('')
const reviewSubmitting = ref(false)

// ─── Live tracking ──────────────────────────────────────────────────────────
const driverLocation = ref(null)   // { lat, lon }
const driverEta = ref(null)        // минуты
const liveConnected = ref(false)
let locationPoll = null            // REST-фолбэк, если сокет недоступен

// Поездку можно отслеживать, когда водитель назначен и в пути
function isTrackable(status) {
  return status === 'CONFIRMED' || status === 'IN_PROGRESS'
}

// URL карты OpenStreetMap (без сторонних библиотек) с меткой водителя
const mapUrl = computed(() => {
  if (!driverLocation.value) return ''
  const { lat, lon } = driverLocation.value
  const d = 0.008
  const bbox = `${lon - d}%2C${lat - d}%2C${lon + d}%2C${lat + d}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`
})

async function fetchDriverLocationRest(bookingId) {
  try {
    const res = await getDriverLocation(bookingId)
    if (res && res.lat != null && res.lon != null) {
      driverLocation.value = { lat: res.lat, lon: res.lon }
      if (res.etaMinutes != null) driverEta.value = res.etaMinutes
    }
  } catch { /* нет данных пока — молча ждём */ }
}

function startTracking(booking) {
  if (!isTrackable(booking.status)) return
  // 1) сразу пробуем REST, чтобы показать последнюю известную точку
  fetchDriverLocationRest(booking.id)
  // 2) подключаем сокет и слушаем живые события
  const s = joinBookingRoom(booking.id)
  liveConnected.value = s.connected

  s.on('connect', () => { liveConnected.value = true })
  s.on('disconnect', () => { liveConnected.value = false })

  s.on('driver:location', (p) => {
    if (!selectedBooking.value || p.bookingId !== selectedBooking.value.id) return
    driverLocation.value = { lat: p.lat, lon: p.lon }
  })

  s.on('booking:status_changed', (p) => {
    if (!selectedBooking.value || p.bookingId !== selectedBooking.value.id) return
    selectedBooking.value.status = p.status
    const idx = myBookings.value.findIndex(b => b.id === p.bookingId)
    if (idx !== -1) myBookings.value[idx].status = p.status
    if (!isTrackable(p.status)) stopTracking()
  })

  s.on('message:received', (m) => {
    if (!selectedBooking.value || m.bookingId !== selectedBooking.value.id) return
    if (!chatMessages.value.some(x => x.id === m.id)) chatMessages.value.push(m)
  })

  // 3) REST-фолбэк раз в 12 сек на случай, если WebSocket не проходит через шлюз
  locationPoll = setInterval(() => {
    if (!liveConnected.value && selectedBooking.value) {
      fetchDriverLocationRest(selectedBooking.value.id)
    }
  }, 12000)
}

function stopTracking() {
  if (locationPoll) { clearInterval(locationPoll); locationPoll = null }
  const s = getTaxiSocket()
  if (s) {
    s.off('driver:location'); s.off('booking:status_changed')
    s.off('message:received'); s.off('connect'); s.off('disconnect')
  }
  driverLocation.value = null
  driverEta.value = null
  liveConnected.value = false
}

function switchTab(id) {
  activeTab.value = id
  if (id === 'bookings') {
    lastUnreadCount = unreadChatBadge.value  // запомнить сколько видели
    unreadChatBadge.value = 0
  }
}

async function openBookingDetail(booking) {
  selectedBooking.value = booking
  reviewRating.value = 0
  reviewComment.value = ''
  lastUnreadCount = unreadChatBadge.value  // запомнить сколько видели
  unreadChatBadge.value = 0
  chatMessages.value = await getChatMessages(booking.id)
  await nextTick()
  scrollChatToBottom()
  startTracking(booking)
  startUserChatPoll(booking.id)
}

// Чистим отслеживание при закрытии модалки
watch(selectedBooking, (val) => { if (!val) { stopTracking(); stopUserChatPoll() } })

// ─── Фоновые уведомления о новых сообщениях в чате ───────────────────────────
let unreadChatPoll = null
let lastUnreadCount = -1  // -1 = первый запрос, не показывать уведомление
const unreadChatBadge = ref(0)

function startUnreadChatPoll() {
  if (!authStore.isAuthenticated) return
  if (unreadChatPoll) clearInterval(unreadChatPoll)
  unreadChatPoll = setInterval(async () => {
    if (selectedBooking.value) return
    try {
      const raw = await getUnreadMessages()
      const n = typeof raw === 'number' ? raw : (raw?.count ?? 0)
      unreadChatBadge.value = n
      if (lastUnreadCount >= 0 && n > lastUnreadCount) {
        const diff = n - lastUnreadCount
        // Пробуем достать адрес из ответа
        const items = Array.isArray(raw) ? raw : (raw?.items ?? raw?.bookings ?? [])
        const bk = items[0]
        const bookingId = bk?.bookingId ?? bk?.id ?? null
        const bookingInfo = bk?.fromAddress ? ` (${bk.fromAddress})` : bookingId ? ` #${bookingId}` : ''
        const msg = lang.value === 'kaz'
          ? `💬 ${diff} жаңа хабарлама диспетчерден${bookingInfo}`
          : lang.value === 'eng'
          ? `💬 ${diff} new message(s) from dispatcher${bookingInfo}`
          : `💬 ${diff} новое сообщение от диспетчера${bookingInfo}`
        const link = bookingId ? `/inva-taxi?openBooking=${bookingId}` : '/inva-taxi'
        toast.info(msg, 10000, link)
        if (Notification?.permission === 'granted') {
          const notif = new Notification('SenimdiQadam — ИнваТакси Чат', { body: msg, icon: '/favicon.ico' })
          notif.onclick = () => {
            window.focus()
            if (bookingId) localStorage.setItem('sqPendingBooking', String(bookingId))
            window.location.href = window.location.origin + '/#/inva-taxi'
          }
        }
      }
      lastUnreadCount = n
    } catch {}
  }, 5000)
}

// ─── Авто-открытие заявки/чата по уведомлению ────────────────────────────────
let pendingBookingId = null

function tryOpenPendingBooking() {
  const id = pendingBookingId
  if (!id || !myBookings.value.length) return
  const booking = myBookings.value.find(b => String(b.id) === String(id))
  if (booking) {
    pendingBookingId = null
    activeTab.value = 'bookings'
    nextTick(() => openBookingDetail(booking))
  }
}

watch(myBookings, () => tryOpenPendingBooking())

function checkAndOpenBooking() {
  const lsId = localStorage.getItem('sqPendingBooking')
  if (lsId) {
    localStorage.removeItem('sqPendingBooking')
    pendingBookingId = lsId
    activeTab.value = 'bookings'
    tryOpenPendingBooking()
    return
  }
  const qId = route.query.openBooking
  if (qId) {
    router.replace({ query: {} })
    pendingBookingId = String(qId)
    activeTab.value = 'bookings'
    tryOpenPendingBooking()
  }
}

onUnmounted(() => { stopTracking(); disconnectTaxiSocket(); stopUserChatPoll(); if (unreadChatPoll) clearInterval(unreadChatPoll) })

function scrollChatToBottom() {
  if (chatBoxRef.value) chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
}

watch(chatMessages, async () => { await nextTick(); scrollChatToBottom() }, { deep: true })

async function handleSendChat() {
  if (!chatInput.value.trim() || chatSending.value) return
  chatSending.value = true
  const text = chatInput.value.trim()
  chatInput.value = ''
  // Только REST — сохраняет в БД. Сокет не используем для отправки, т.к. это дублирует запись.
  await sendChatMessage(selectedBooking.value.id, text)
  chatMessages.value = await getChatMessages(selectedBooking.value.id)
  chatSending.value = false
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

// Taxi booking disabilityType: WHEELCHAIR | VISUAL | HEARING | MOBILITY | OTHER
function disabilityLabel(type, l) {
  const map = {
    WHEELCHAIR: { kaz: '♿ Арба', rus: '♿ Колясочник' },
    VISUAL:     { kaz: '👁 Көру', rus: '👁 Зрение' },
    HEARING:    { kaz: '👂 Есту', rus: '👂 Слух' },
    MOBILITY:   { kaz: '🦽 Қозғалыс', rus: '🦽 Подвижность' },
    OTHER:      { kaz: '📋 Басқа', rus: '📋 Другое' }
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

// ─── Recurring rides ──────────────────────────────────────────────────────────
const recurringRides = ref([])
const showRecurringForm = ref(false)
const recurringLoading = ref(false)
const recurringError = ref('')
const recurringForm = ref({ fromAddress: '', toAddress: '', time: '', weekdays: [] })
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function toggleWeekday(i) {
  const idx = recurringForm.value.weekdays.indexOf(i)
  if (idx === -1) recurringForm.value.weekdays.push(i)
  else recurringForm.value.weekdays.splice(idx, 1)
}

function formatWeekdays(days) {
  if (!Array.isArray(days) || days.length === 0) return '—'
  return days.map(d => weekdays[d]).join(', ')
}

async function loadRecurringRides() {
  try {
    const res = await getRecurringRides()
    recurringRides.value = Array.isArray(res) ? res : (res?.items ?? [])
  } catch {}
}

async function submitRecurring() {
  recurringError.value = ''
  if (!recurringForm.value.fromAddress.trim() || !recurringForm.value.toAddress.trim()) {
    recurringError.value = lang.value === 'kaz' ? 'Мекенжайларды толтырыңыз' : 'Укажите адреса'
    return
  }
  recurringLoading.value = true
  try {
    await createRecurringRide({ ...recurringForm.value })
    recurringForm.value = { fromAddress: '', toAddress: '', time: '', weekdays: [] }
    showRecurringForm.value = false
    await loadRecurringRides()
  } catch (e) {
    recurringError.value = e.message || (lang.value === 'kaz' ? 'Қате' : 'Ошибка')
  } finally { recurringLoading.value = false }
}

async function handlePauseRecurring(id) {
  await pauseRecurringRide(id).catch(() => {})
  await loadRecurringRides()
}

async function handleResumeRecurring(id) {
  await resumeRecurringRide(id).catch(() => {})
  await loadRecurringRides()
}

async function handleDeleteRecurring(id) {
  if (!confirm(lang.value === 'kaz' ? 'Жоюды растаңыз' : 'Подтвердите удаление')) return
  await deleteRecurringRide(id).catch(() => {})
  await loadRecurringRides()
}

// ─── Payment ──────────────────────────────────────────────────────────────────
const paymentBooking = ref(null)
const payMethod = ref('CASH')
const payLoading = ref(false)
const payError = ref('')
const paySuccess = ref(false)

const payMethods = [
  { value: 'CASH', icon: '💵', labelRu: 'Наличные', labelKk: 'Қолма-қол' },
  { value: 'KASPI', icon: '📱', labelRu: 'Kaspi Pay', labelKk: 'Kaspi Pay' },
  { value: 'CARD', icon: '💳', labelRu: 'Карта', labelKk: 'Карта' },
]

function openPayment(booking) {
  paymentBooking.value = booking
  payMethod.value = 'CASH'
  payError.value = ''
  paySuccess.value = false
}

async function submitPayment() {
  payLoading.value = true
  payError.value = ''
  try {
    const tx = await initiatePayment(paymentBooking.value.id, payMethod.value)
    if (tx?.id) await confirmPayment(paymentBooking.value.id, tx.id)
    paySuccess.value = true
    // Mark locally so button disappears
    const idx = myBookings.value.findIndex(b => b.id === paymentBooking.value.id)
    if (idx !== -1) myBookings.value[idx] = { ...myBookings.value[idx], _paymentDone: true }
    setTimeout(() => { paymentBooking.value = null }, 2000)
  } catch (e) {
    payError.value = e.message || (lang.value === 'kaz' ? 'Қате' : 'Ошибка оплаты')
  } finally { payLoading.value = false }
}

// ─── Driver review (from booking card) ───────────────────────────────────────
const reviewBooking = ref(null)
// reviewRating, reviewComment, reviewSubmitting are shared with booking-detail review (declared above)
const reviewSubmitError = ref('')
const reviewSubmitSuccess = ref(false)

function openReview(booking) {
  reviewBooking.value = booking
  reviewRating.value = 0
  reviewComment.value = ''
  reviewSubmitError.value = ''
  reviewSubmitSuccess.value = false
}

async function submitDriverReview() {
  if (!reviewRating.value) return
  reviewSubmitting.value = true
  reviewSubmitError.value = ''
  try {
    await reviewDriver(reviewBooking.value.id, reviewRating.value, reviewComment.value.trim() || undefined)
    reviewSubmitSuccess.value = true
    const idx = myBookings.value.findIndex(b => b.id === reviewBooking.value.id)
    if (idx !== -1) myBookings.value[idx] = { ...myBookings.value[idx], _reviewed: true }
    setTimeout(() => { reviewBooking.value = null }, 2000)
  } catch (e) {
    reviewSubmitError.value = e.message || (lang.value === 'kaz' ? 'Қате' : 'Ошибка')
  } finally { reviewSubmitting.value = false }
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
.tab-count--chat { background: #2563eb; animation: chatPulse 2s ease-in-out infinite; }
@keyframes chatPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
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

.price-estimate-block { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: var(--radius-md); padding: 12px 16px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.price-estimate-header { display: flex; align-items: center; gap: 6px; font-size: var(--fs-sm); font-weight: 700; color: #166534; }
.price-estimate-value { font-size: 18px; font-weight: 800; color: #15803d; }
.price-estimate-hint { font-size: var(--fs-sm); color: #64748b; flex: 1; }
.price-estimate-btn { margin-left: auto; padding: 6px 14px; border-radius: var(--radius-sm); border: 1.5px solid #22c55e; background: white; color: #16a34a; font-size: var(--fs-sm); font-weight: 600; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
.price-estimate-btn:hover:not(:disabled) { background: #dcfce7; }
.price-estimate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
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
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid var(--gray-100); position: sticky; top: 0; background: white; z-index: 1; }
.modal-header-left { display: flex; align-items: center; gap: 12px; }
.modal-header h3 { font-size: var(--fs-lg); font-weight: 800; color: var(--black); }
.modal-close { width: 32px; height: 32px; border-radius: 50%; background: var(--gray-100); border: none; color: var(--gray-500); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
.modal-close:hover { background: var(--gray-200); color: var(--black); }
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
.chat-box { background: #f8fafc; border-radius: var(--radius-md); padding: 14px; min-height: 140px; max-height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; border: 1px solid var(--gray-100); }
.chat-empty { text-align: center; color: var(--gray-400); font-size: var(--fs-sm); margin: auto; }
.chat-msg { max-width: 78%; display: flex; flex-direction: column; gap: 3px; }
.chat-msg--mine { align-self: flex-end; align-items: flex-end; }
.chat-msg--theirs { align-self: flex-start; align-items: flex-start; }
.chat-msg-label { font-size: 10px; color: var(--gray-400); font-weight: 700; padding: 0 6px; }
.chat-msg-text { padding: 10px 14px; border-radius: 18px; font-size: var(--fs-sm); line-height: 1.5; word-break: break-word; }
.chat-msg--mine .chat-msg-text { background: linear-gradient(135deg, var(--primary), #2563eb); color: white; border-bottom-right-radius: 5px; box-shadow: 0 2px 8px rgba(59,130,246,0.25); }
.chat-msg--theirs .chat-msg-text { background: white; color: var(--black); border: 1px solid var(--gray-200); border-bottom-left-radius: 5px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.chat-msg-time { font-size: 10px; color: var(--gray-400); padding: 0 6px; }
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

/* ── Live tracking ── */
.live-badge {
  display: inline-flex; align-items: center; gap: 5px;
  margin-left: 8px; padding: 2px 8px; border-radius: 20px;
  font-size: 10px; font-weight: 800; letter-spacing: 0.5px;
  background: #f1f5f9; color: #94a3b8; vertical-align: middle;
}
.live-badge.on { background: #fee2e2; color: #dc2626; }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.live-badge.on .live-dot { animation: livePulse 1.4s ease-in-out infinite; }
@keyframes livePulse { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
.track-wrap { border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
.track-map { width: 100%; height: 240px; border: 0; display: block; }
.track-info {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 14px; background: #f8fafc; flex-wrap: wrap;
}
.track-eta { font-size: 14px; color: #0f172a; }
.track-eta strong { color: #1B3FD8; }
.track-coords { font-size: 12px; color: #64748b; }
.track-waiting {
  display: flex; align-items: center; gap: 10px;
  padding: 24px; justify-content: center;
  background: #f8fafc; border-radius: 12px;
  color: #64748b; font-size: 13.5px;
}
@media (prefers-reduced-motion: reduce) {
  .live-badge.on .live-dot { animation: none; }
}

/* ── Pay / Review buttons on booking card ── */
.pay-btn { background: #059669; color: white; border: none; padding: 5px 12px; border-radius: var(--radius-full); font-size: 12px; font-weight: 700; cursor: pointer; transition: background var(--transition); }
.pay-btn:hover { background: #047857; }
.review-btn { background: #F59E0B; color: white; border: none; padding: 5px 12px; border-radius: var(--radius-full); font-size: 12px; font-weight: 700; cursor: pointer; transition: background var(--transition); }
.review-btn:hover { background: #D97706; }

/* ── Payment modal ── */
.payment-amount { font-size: 32px; font-weight: 900; color: var(--primary); text-align: center; margin: 16px 0; }
.payment-methods { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.pay-method-btn { flex: 1; min-width: 90px; padding: 10px 8px; border: 2px solid var(--gray-200); border-radius: var(--radius-md); background: white; cursor: pointer; font-size: var(--fs-sm); font-weight: 600; color: var(--gray-600); transition: all var(--transition); text-align: center; }
.pay-method-btn:hover { border-color: var(--primary); color: var(--primary); }
.pay-method-btn.active { border-color: var(--primary); background: var(--primary-pale); color: var(--primary); }
.modal-footer-btns { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
.modal-title { font-size: var(--fs-lg); font-weight: 800; color: var(--black); margin-bottom: 6px; }
.modal-sub { font-size: var(--fs-sm); color: var(--gray-500); margin-bottom: 4px; }
.field-error-sm { background: #FEF2F2; color: #DC2626; padding: 8px 12px; border-radius: var(--radius); font-size: var(--fs-xs); font-weight: 600; margin-bottom: 8px; }
.save-success-sm { background: #F0FDF4; color: #166534; padding: 10px 14px; border-radius: var(--radius); font-size: var(--fs-sm); font-weight: 600; }

/* ── Review modal ── */
.review-driver-info { display: flex; align-items: center; gap: 10px; margin: 12px 0; font-weight: 600; font-size: var(--fs-sm); }
.review-stars-row { display: flex; gap: 6px; }
.star-pick-btn { font-size: 28px; background: none; border: none; cursor: pointer; padding: 2px; line-height: 1; transition: transform 0.1s; }
.star-pick-btn:hover { transform: scale(1.15); }
.star-on { color: #F59E0B; }
.star-off { color: var(--gray-200); }

/* ── Recurring rides ── */
.recurring-form-card { background: white; border-radius: var(--radius-xl); padding: 20px 24px; box-shadow: var(--shadow); margin-bottom: 20px; }
.weekday-picker { display: flex; gap: 6px; flex-wrap: wrap; }
.weekday-btn { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--gray-200); background: white; font-size: 12px; font-weight: 700; color: var(--gray-600); cursor: pointer; transition: all var(--transition); }
.weekday-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
.recurring-list { display: flex; flex-direction: column; gap: 12px; }
.recurring-card { background: white; border-radius: var(--radius-lg); padding: 16px 20px; box-shadow: var(--shadow); }
.recurring-route { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.rec-dot--from { width: 10px; height: 10px; border-radius: 50%; background: var(--primary); flex-shrink: 0; }
.rec-addresses { display: flex; align-items: center; gap: 8px; font-size: var(--fs-sm); color: var(--black); font-weight: 600; flex-wrap: wrap; }
.rec-arrow { color: var(--gray-400); }
.recurring-meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: var(--gray-500); margin-bottom: 10px; flex-wrap: wrap; }
.rec-time { font-weight: 600; }
.rec-status-badge { padding: 2px 8px; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; }
.recurring-actions { display: flex; gap: 8px; }
.form-actions { display: flex; gap: 10px; }
</style>
