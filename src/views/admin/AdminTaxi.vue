<template>
  <div class="admin-taxi">
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">ИнваТакси — Панель диспетчера</h1>
        <p class="admin-page-sub">Управление заявками и водителями</p>
      </div>
      <button class="btn btn-secondary" :disabled="loadingAll" @click="loadAll" style="display:flex;align-items:center;gap:6px">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :style="loadingAll ? 'animation:spin 1s linear infinite' : ''"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
        {{ loadingAll ? 'Загрузка...' : 'Обновить' }}
      </button>
    </div>
    <div v-if="usingMock" class="mock-notice">⚠️ Нет подключения к серверу — показаны демо-данные</div>

    <!-- Stats row -->
    <div class="taxi-stats">
      <div class="taxi-stat-card" style="border-left: 4px solid #f59e0b">
        <div class="taxi-stat-val">{{ bookings.filter(b => b.status === 'PENDING').length }}</div>
        <div class="taxi-stat-label">Ожидают водителя</div>
      </div>
      <div class="taxi-stat-card" style="border-left: 4px solid #3b82f6">
        <div class="taxi-stat-val">{{ activeCount }}</div>
        <div class="taxi-stat-label">В пути</div>
      </div>
      <div class="taxi-stat-card" style="border-left: 4px solid #22c55e">
        <div class="taxi-stat-val">{{ bookings.filter(b => b.status === 'COMPLETED').length }}</div>
        <div class="taxi-stat-label">Завершены</div>
      </div>
      <div class="taxi-stat-card" style="border-left: 4px solid #8b5cf6">
        <div class="taxi-stat-val">{{ drivers.filter(d => d.available).length }}</div>
        <div class="taxi-stat-label">Водителей онлайн</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="admin-tabs">
      <button class="admin-tab" :class="{ active: activeTab === 'bookings' }" @click="switchAdminTab('bookings')">
        Заявки
        <span v-if="pendingCount" class="tab-count">{{ pendingCount }}</span>
        <span v-if="unreadChatCount > 0" class="tab-count tab-count--chat" title="Непрочитанных сообщений">💬 {{ unreadChatCount }}</span>
      </button>
      <button class="admin-tab" :class="{ active: activeTab === 'drivers' }" @click="activeTab = 'drivers'">Водители</button>
      <button class="admin-tab" :class="{ active: activeTab === 'invites' }" @click="activeTab = 'invites'; loadInvites()">
        Приглашения
        <span v-if="invites.filter(i => !i.usedAt).length" class="tab-count">{{ invites.filter(i => !i.usedAt).length }}</span>
      </button>
    </div>

    <!-- Bookings tab -->
    <div v-if="activeTab === 'bookings'">
      <div class="taxi-filters">
        <input v-model="bookingSearch" class="admin-search" placeholder="Поиск по пассажиру, адресу..." @input="null" />
        <select v-model="bookingStatusFilter" class="admin-select">
          <option value="all">Все статусы</option>
          <option value="PENDING">Ожидают водителя</option>
          <option value="CONFIRMED">Подтверждены</option>
          <option value="IN_PROGRESS">В пути</option>
          <option value="COMPLETED">Завершены</option>
          <option value="CANCELLED">Отменены</option>
        </select>
      </div>
      <div class="bookings-list">
      <div v-if="filteredBookings.length === 0" class="empty-state">
        <div style="font-size:36px">🚖</div>
        <p>Нет заявок</p>
      </div>
      <div class="booking-card" v-for="b in filteredBookings" :key="b.id">
        <div class="booking-header">
          <div class="booking-id">#{{ b.id }}</div>
          <span class="booking-status" :class="bookingStatusClass(b.status)">{{ bookingStatusLabel(b.status) }}</span>
        </div>
        <div class="booking-body">
          <div class="booking-row">
            <span class="booking-icon">📍</span>
            <div>
              <div class="booking-label">Откуда</div>
              <div class="booking-val">{{ b.fromAddress }}</div>
            </div>
          </div>
          <div class="booking-row">
            <span class="booking-icon">🏁</span>
            <div>
              <div class="booking-label">Куда</div>
              <div class="booking-val">{{ b.toAddress }}</div>
            </div>
          </div>
          <div class="booking-row">
            <span class="booking-icon">👤</span>
            <div>
              <div class="booking-label">Пассажир</div>
              <div class="booking-val">{{ b.passengerName }}</div>
            </div>
          </div>
          <div class="booking-row" v-if="b.specialNeeds">
            <span class="booking-icon">♿</span>
            <div>
              <div class="booking-label">Особые потребности</div>
              <div class="booking-val">{{ b.specialNeeds }}</div>
            </div>
          </div>
          <div class="booking-row">
            <span class="booking-icon">🕐</span>
            <div>
              <div class="booking-label">Время заявки</div>
              <div class="booking-val">{{ formatDate(b.createdAt) }}</div>
            </div>
          </div>
        </div>
        <div class="booking-actions">
          <!-- Assign driver -->
          <select class="role-select" v-if="b.status === 'PENDING'" v-model="b.assignedDriverId" @change="assignDriver(b)">
            <option value="">Назначить водителя...</option>
            <option v-for="d in availableDrivers" :key="d.id" :value="d.id">{{ d.name }} — {{ d.car }}</option>
          </select>
          <button v-if="b.status === 'CONFIRMED'" class="admin-action-btn btn-inprogress" @click="setInProgress(b)">🛣 В путь</button>
          <button v-if="['CONFIRMED','IN_PROGRESS'].includes(b.status)" class="admin-action-btn btn-approve" @click="completeBooking(b)">✓ Завершить</button>
          <button v-if="['PENDING','CONFIRMED','IN_PROGRESS'].includes(b.status)" class="admin-action-btn btn-reject" @click="cancelBooking(b)">✕ Отменить</button>
          <button class="admin-action-btn btn-chat" @click="openChat(b)">💬 Чат</button>
        </div>
      </div>
      </div>
    </div>

    <!-- Drivers tab -->
    <div v-if="activeTab === 'drivers'" class="drivers-section">
      <!-- Add driver form -->
      <div class="add-driver-card">
        <div class="add-driver-title">➕ Добавить водителя</div>
        <div class="add-driver-form">
          <input v-model="newDriver.firstName" class="driver-input" placeholder="Имя *" />
          <input v-model="newDriver.lastName" class="driver-input" placeholder="Фамилия *" />
          <input v-model="newDriver.phone" class="driver-input" placeholder="Телефон *" />
          <input v-model="newDriver.vehicleModel" class="driver-input" placeholder="Модель авто *" />
          <input v-model="newDriver.licensePlate" class="driver-input" placeholder="Номер авто *" />
          <button class="admin-action-btn btn-approve" :disabled="addingDriver" @click="submitAddDriver">
            <span v-if="addingDriver">...</span>
            <span v-else>Добавить</span>
          </button>
        </div>
        <div v-if="addDriverError" class="driver-error">{{ addDriverError }}</div>
      </div>

      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Водитель</th>
              <th>Автомобиль</th>
              <th>Телефон</th>
              <th>Рейтинг</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in drivers" :key="d.id">
              <td>
                <div class="user-cell">
                  <div class="user-avatar">{{ d.name.charAt(0) }}</div>
                  <div class="user-name">{{ d.name }}</div>
                </div>
              </td>
              <td class="text-sm">{{ d.car }}</td>
              <td class="text-sm text-gray">{{ d.phone }}</td>
              <td><span class="rating-cell">⭐ {{ d.rating }}</span></td>
              <td>
                <span class="booking-status" :class="d.available ? 'status-available' : 'status-busy'">
                  {{ d.available ? 'Онлайн' : 'Занят' }}
                </span>
              </td>
              <td>
                <button class="admin-action-btn btn-reject" @click="confirmDeleteDriver(d)">🗑 Деактивировать</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Invites tab -->
    <div v-if="activeTab === 'invites'" class="invites-section">
      <div class="invite-toolbar">
        <div>
          <div class="invite-toolbar-title">Коды приглашений для менеджеров</div>
          <div class="invite-toolbar-sub">Передайте код будущему менеджеру — он регистрируется на <a href="#/taxi-manager-register" target="_blank" class="invite-reg-link">/taxi-manager-register</a></div>
        </div>
        <button class="btn-create-invite" :disabled="creatingInvite" @click="generateInvite">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ creatingInvite ? 'Создание...' : 'Создать код' }}
        </button>
      </div>

      <div v-if="invitesLoading" class="admin-loading">Загрузка...</div>
      <div v-else-if="invites.length === 0" class="empty-state">
        <div style="font-size:36px">🔑</div>
        <p>Нет кодов приглашений</p>
      </div>
      <div v-else class="invites-list">
        <div v-for="inv in invites" :key="inv.id" class="invite-card" :class="{ 'invite-used': inv.usedAt }">
          <div class="invite-code-wrap">
            <code class="invite-code">{{ inv.code }}</code>
            <button class="invite-copy-btn" @click="copyCode(inv.code)" title="Копировать">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
          <div class="invite-meta">
            <span class="invite-status-badge" :class="inv.usedAt ? 'invite-status-used' : 'invite-status-active'">
              {{ inv.usedAt ? '✓ Использован' : '● Активен' }}
            </span>
            <span class="invite-date">Создан: {{ formatDate(inv.createdAt) }}</span>
            <span v-if="inv.usedAt" class="invite-date">Использован: {{ formatDate(inv.usedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Chat modal -->
  <Transition name="fade">
    <div v-if="chatBooking" class="chat-overlay" @click.self="closeChat()">
      <div class="chat-panel">
        <div class="chat-header">
          <div class="chat-header-left">
            <div class="chat-avatar">{{ (chatBooking.passengerName || '?').charAt(0) }}</div>
            <div>
              <div class="chat-title">{{ chatBooking.passengerName || 'Клиент' }}</div>
              <div class="chat-sub">Заявка · {{ chatBooking.fromAddress }} → {{ chatBooking.toAddress }}</div>
            </div>
          </div>
          <button class="chat-close" @click="closeChat()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="chat-messages" ref="chatScroll">
          <div v-if="chatLoading" class="chat-loading">
            <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
          </div>
          <div v-else-if="chatMessages.length === 0" class="chat-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <p>Сообщений пока нет</p>
          </div>
          <div
            v-for="m in chatMessages" :key="m.id"
            class="chat-msg"
            :class="m.senderType === 'MANAGER' ? 'msg-mine' : 'msg-theirs'"
          >
            <div class="msg-label">{{ m.senderType === 'MANAGER' ? 'Вы' : (chatBooking.passengerName || 'Клиент') }}</div>
            <div class="msg-bubble">{{ m.text }}</div>
            <div class="msg-time">{{ formatTime(m.createdAt) }}</div>
          </div>
        </div>
        <div class="chat-input-row">
          <input
            v-model="chatInput"
            class="chat-input"
            placeholder="Написать клиенту..."
            @keydown.enter="sendManagerMessage"
          />
          <button class="chat-send-btn" :disabled="!chatInput.trim()" @click="sendManagerMessage">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getManagerBookings, getDrivers, addDriver,
  assignDriver as apiAssignDriver, setManagerBookingStatus, setDriverStatus,
  getChatMessages, sendChatMessage,
  createManagerInvite, getManagerInvites
} from '../../api/taxi.js'
import { GATEWAY_URL, getAccessToken } from '../../api/apiClient.js'
import { getManagerUnreadMessages } from '../../api/taxi.js'
import { useToast } from '../../stores/toast.js'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const activeTab = ref('bookings')

// Демо-данные — показываются, если нет прав TAXI_MANAGER или бэкенд недоступен
const mockBookings = [
  { id: 1001, fromAddress: 'ул. Абая 10', toAddress: 'Больница №1, пр. Достык', passengerName: 'Асель Нурланова', specialNeeds: 'Инвалидная коляска', status: 'PENDING', assignedDriverId: '', createdAt: new Date().toISOString() },
  { id: 1002, fromAddress: 'мкр Алмагуль, д.5', toAddress: 'Реабилитационный центр', passengerName: 'Бауыржан Қасымов', specialNeeds: 'Нарушение зрения', status: 'CONFIRMED', assignedDriverId: 'drv-1', createdAt: new Date(Date.now()-3600000).toISOString() },
  { id: 1003, fromAddress: 'пр. Назарбаева 100', toAddress: 'ТД Мегацентр', passengerName: 'Зарина Смагулова', specialNeeds: '', status: 'COMPLETED', assignedDriverId: 'drv-2', createdAt: new Date(Date.now()-7200000).toISOString() },
]
const mockDrivers = [
  { id: 'drv-1', name: 'Канат Бекенов', car: 'Hyundai H1 • А 001 АА', phone: '+7 701 111 2233', rating: 4.8, available: true },
  { id: 'drv-2', name: 'Серік Алтынбеков', car: 'Ford Transit • В 222 ВВ', phone: '+7 707 333 4455', rating: 4.6, available: false },
  { id: 'drv-3', name: 'Дмитрий Чен', car: 'Volkswagen Caravelle • С 333 СС', phone: '+7 702 555 6677', rating: 4.9, available: true },
]

const bookings = ref([])
const drivers = ref([])
const usingMock = ref(false)
const loadingAll = ref(false)
let pollTimer = null

// Приводим заявку с бэкенда к виду, который ждёт шаблон
const mapBooking = (b) => ({
  id: b.id,
  fromAddress: b.fromAddress,
  toAddress: b.toAddress,
  passengerName: b.userName || [b.user?.firstName, b.user?.lastName].filter(Boolean).join(' ') || '—',
  specialNeeds: b.note || disabilityLabel(b.disabilityType),
  status: b.status,
  assignedDriverId: b.driverId || b.driver?.id || '',
  createdAt: b.scheduledAt || b.createdAt,
})

const mapDriver = (d) => ({
  id: d.id,
  name: [d.firstName, d.lastName].filter(Boolean).join(' ') || d.name || '—',
  car: [d.vehicleModel, d.licensePlate].filter(Boolean).join(' • ') || d.car || '—',
  phone: d.phone || '—',
  rating: d.ratingAvg ?? d.rating ?? 0,
  available: d.status ? d.status === 'ACTIVE' : !!d.available,
})

function disabilityLabel(type) {
  const map = { WHEELCHAIR: 'Колясочник', VISUAL: 'Нарушение зрения', HEARING: 'Нарушение слуха', MOBILITY: 'Нарушение подвижности', OTHER: 'Другое' }
  return map[type] || ''
}

async function loadAll() {
  loadingAll.value = true
  try {
    const [bk, drv] = await Promise.all([getManagerBookings(), getDrivers()])
    bookings.value = (bk || []).map(mapBooking)
    drivers.value = (drv || []).map(mapDriver)
    usingMock.value = false
  } catch (e) {
    // нет прав / бэкенд недоступен → демо-данные
    bookings.value = [...mockBookings]
    drivers.value = [...mockDrivers]
    usingMock.value = true
  } finally {
    loadingAll.value = false
  }
}

let unreadPollTimer = null
let lastManagerUnread = -1  // -1 = первый запрос, не показывать уведомление
const unreadChatCount = ref(0)

// startPolls вызывается из единого onMounted ниже
function startPolls() {
  pollTimer = setInterval(loadAll, 15000)
  if (Notification && Notification.permission === 'default') Notification.requestPermission()
  unreadPollTimer = setInterval(async () => {
    try {
      const raw = await getManagerUnreadMessages()
      const n = typeof raw === 'number' ? raw : (raw?.count ?? 0)
      unreadChatCount.value = n
      if (lastManagerUnread >= 0 && n > lastManagerUnread) {
        const items = Array.isArray(raw) ? raw : (raw?.items ?? raw?.bookings ?? [])
        const bk = items[0]
        const bookingId = bk?.bookingId ?? bk?.id ?? null
        const bookingInfo = bk?.fromAddress
          ? ` — заявка: ${bk.fromAddress}`
          : bookingId ? ` — заявка #${bookingId}` : ''
        const msg = `💬 Новое сообщение от клиента${bookingInfo}`
        const link = bookingId ? `/admin/taxi?openChat=${bookingId}` : '/admin/taxi'
        toast.info(msg, 10000, link)
        if (Notification?.permission === 'granted') {
          const notif = new Notification('SenimdiQadam — ИнваТакси Чат', { body: msg, icon: '/favicon.ico' })
          notif.onclick = () => {
            window.focus()
            if (bookingId) localStorage.setItem('sqPendingChat', String(bookingId))
            window.location.href = window.location.origin + '/#/admin/taxi'
          }
        }
      }
      lastManagerUnread = n
    } catch {}
  }, 5000)
}

// ─── Авто-открытие чата по уведомлению ───────────────────────────────────────
// Сохраняем ID заявки пока bookings ещё не загрузились
let pendingChatBookingId = null

function tryOpenPendingChat() {
  const id = pendingChatBookingId
  if (!id || !bookings.value.length) return
  const booking = bookings.value.find(b => String(b.id) === String(id))
  if (booking) {
    pendingChatBookingId = null
    activeTab.value = 'bookings'
    nextTick(() => openChat(booking))
  }
}

// Когда заявки загрузились — проверяем есть ли отложенный чат
watch(bookings, () => tryOpenPendingChat())

function checkAndOpenChat() {
  // Из браузерного уведомления (localStorage)
  const lsId = localStorage.getItem('sqPendingChat')
  if (lsId) {
    localStorage.removeItem('sqPendingChat')
    pendingChatBookingId = lsId
    activeTab.value = 'bookings'
    tryOpenPendingChat()
    return
  }
  // Из тост-уведомления (query param)
  const qId = route.query.openChat
  if (qId) {
    router.replace({ query: {} })
    pendingChatBookingId = String(qId)
    activeTab.value = 'bookings'
    tryOpenPendingChat()
  }
}

onMounted(async () => {
  await loadAll()
  startPolls()
  checkAndOpenChat()
  window.addEventListener('focus', checkAndOpenChat)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  if (unreadPollTimer) clearInterval(unreadPollTimer)
  stopChatPoll()
  window.removeEventListener('focus', checkAndOpenChat)
})

const bookingSearch = ref('')
const bookingStatusFilter = ref('all')

const filteredBookings = computed(() => {
  let data = [...bookings.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  if (bookingStatusFilter.value !== 'all') data = data.filter(b => b.status === bookingStatusFilter.value)
  if (bookingSearch.value.trim()) {
    const q = bookingSearch.value.toLowerCase()
    data = data.filter(b =>
      (b.passengerName || '').toLowerCase().includes(q) ||
      (b.fromAddress || '').toLowerCase().includes(q) ||
      (b.toAddress || '').toLowerCase().includes(q)
    )
  }
  return data
})

const pendingCount = computed(() => bookings.value.filter(b => b.status === 'PENDING').length)
const activeCount = computed(() => bookings.value.filter(b => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status)).length)
const availableDrivers = computed(() => drivers.value.filter(d => d.available))

const assignDriver = async (booking) => {
  if (!booking.assignedDriverId) return
  if (usingMock.value) { booking.status = 'CONFIRMED'; return }
  try {
    await apiAssignDriver(booking.id, booking.assignedDriverId)
    toast.success('Водитель назначен')
    await loadAll()
  } catch (e) { toast.error('Не удалось назначить: ' + e.message) }
}

const completeBooking = async (booking) => {
  if (usingMock.value) { booking.status = 'COMPLETED'; return }
  try {
    await setManagerBookingStatus(booking.id, 'COMPLETED')
    toast.success('Поездка завершена')
    await loadAll()
  } catch (e) { toast.error('Ошибка: ' + e.message) }
}

const cancelBooking = async (booking) => {
  if (!confirm('Отменить эту заявку?')) return
  if (usingMock.value) { booking.status = 'CANCELLED'; return }
  try {
    await setManagerBookingStatus(booking.id, 'CANCELLED', 'Отменено диспетчером')
    toast.success('Заявка отменена')
    await loadAll()
  } catch (e) { toast.error('Ошибка: ' + e.message) }
}

const confirmDeleteDriver = async (driver) => {
  if (!confirm(`Деактивировать водителя "${driver.name}"?`)) return
  if (usingMock.value) { drivers.value = drivers.value.filter(d => d.id !== driver.id); return }
  try {
    await setDriverStatus(driver.id, 'INACTIVE')
    toast.success('Водитель деактивирован')
    await loadAll()
  } catch (e) { toast.error('Ошибка: ' + e.message) }
}

const setInProgress = async (booking) => {
  if (usingMock.value) { booking.status = 'IN_PROGRESS'; return }
  try {
    await setManagerBookingStatus(booking.id, 'IN_PROGRESS')
    toast.success('Статус: В пути')
    await loadAll()
  } catch (e) { toast.error('Ошибка: ' + e.message) }
}

// ── Add driver ────────────────────────────────────────────────────────
const newDriver = ref({ firstName: '', lastName: '', phone: '', vehicleModel: '', licensePlate: '' })
const addingDriver = ref(false)
const addDriverError = ref('')

const submitAddDriver = async () => {
  if (!newDriver.value.firstName || !newDriver.value.phone || !newDriver.value.vehicleModel) {
    addDriverError.value = 'Заполните обязательные поля (Имя, Телефон, Авто)'
    return
  }
  addingDriver.value = true
  addDriverError.value = ''
  try {
    await addDriver(newDriver.value)
    toast.success('Водитель добавлен')
    newDriver.value = { firstName: '', lastName: '', phone: '', vehicleModel: '', licensePlate: '' }
    await loadAll()
  } catch (e) {
    addDriverError.value = e.message || 'Ошибка добавления'
  } finally {
    addingDriver.value = false
  }
}

// ── Chat ──────────────────────────────────────────────────────────────
const chatBooking = ref(null)
const chatMessages = ref([])
const chatLoading = ref(false)
const chatInput = ref('')
const chatScroll = ref(null)
let chatPollTimer = null

const startChatPoll = () => {
  stopChatPoll()
  chatPollTimer = setInterval(async () => {
    if (!chatBooking.value) return
    try {
      const res = await fetch(`${GATEWAY_URL}/taxi/chat/manager/bookings/${chatBooking.value.id}/messages`, { headers: { Authorization: `Bearer ${getAccessToken()}` } })
      const data = await res.json()
      const msgs = Array.isArray(data) ? data : (data.items ?? [])
      if (msgs.length !== chatMessages.value.length) {
        chatMessages.value = msgs
        await nextTick()
        if (chatScroll.value) chatScroll.value.scrollTop = chatScroll.value.scrollHeight
      }
    } catch {}
  }, 4000)
}

const stopChatPoll = () => { if (chatPollTimer) { clearInterval(chatPollTimer); chatPollTimer = null } }

function switchAdminTab(id) {
  activeTab.value = id
  if (id === 'bookings') {
    lastManagerUnread = unreadChatCount.value  // запомнить сколько видели
    unreadChatCount.value = 0
  }
}

const closeChat = () => { chatBooking.value = null; stopChatPoll() }

const openChat = async (booking) => {
  chatBooking.value = booking
  lastManagerUnread = unreadChatCount.value  // запомнить сколько видели
  unreadChatCount.value = 0
  chatMessages.value = []
  chatLoading.value = true
  try {
    const res = await fetch(
      `${GATEWAY_URL}/taxi/chat/manager/bookings/${booking.id}/messages`,
      { headers: { Authorization: `Bearer ${getAccessToken()}` } }
    )
    const data = await res.json()
    chatMessages.value = Array.isArray(data) ? data : (data.items ?? [])
  } catch {
    chatMessages.value = []
  } finally {
    chatLoading.value = false
    await nextTick()
    if (chatScroll.value) chatScroll.value.scrollTop = chatScroll.value.scrollHeight
    startChatPoll()
  }
}

const sendManagerMessage = async () => {
  const text = chatInput.value.trim()
  if (!text || !chatBooking.value) return
  chatInput.value = ''
  try {
    const res = await fetch(
      `${GATEWAY_URL}/taxi/chat/manager/bookings/${chatBooking.value.id}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({ text })
      }
    )
    const msg = await res.json()
    chatMessages.value.push({ ...msg, isFromManager: true })
    await nextTick()
    if (chatScroll.value) chatScroll.value.scrollTop = chatScroll.value.scrollHeight
  } catch (e) {
    toast.error('Не удалось отправить')
  }
}

const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : ''

const bookingStatusLabel = (status) => {
  const map = {
    PENDING: '⏳ Ожидает', CONFIRMED: '🚗 Назначен', IN_PROGRESS: '🛣 В пути',
    COMPLETED: '✓ Завершена', CANCELLED: '✕ Отменена'
  }
  return map[status] || status
}
const bookingStatusClass = (status) => {
  const map = {
    PENDING: 'status-pending', CONFIRMED: 'status-inprogress', IN_PROGRESS: 'status-inprogress',
    COMPLETED: 'status-done', CANCELLED: 'status-cancelled'
  }
  return map[status] || ''
}

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// ── Manager invites ───────────────────────────────────────────────────
const invites = ref([])
const invitesLoading = ref(false)
const creatingInvite = ref(false)

const loadInvites = async () => {
  invitesLoading.value = true
  try {
    const res = await getManagerInvites()
    invites.value = Array.isArray(res) ? res : (res.items ?? [])
  } catch (e) {
    // not a taxi manager or endpoint unavailable
    invites.value = []
  } finally {
    invitesLoading.value = false
  }
}

const generateInvite = async () => {
  creatingInvite.value = true
  try {
    const inv = await createManagerInvite()
    invites.value.unshift(inv)
    toast.success('Код создан: ' + inv.code)
  } catch (e) {
    toast.error('Ошибка: ' + (e.message || 'не удалось создать код'))
  } finally {
    creatingInvite.value = false
  }
}

const copyCode = (code) => {
  navigator.clipboard?.writeText(code).then(() => toast.success('Код скопирован')).catch(() => {})
}
</script>

<style scoped>
.admin-taxi { max-width: 1000px; }
.admin-page-header { margin-bottom: 20px; }
.admin-page-title { font-size: 22px; font-weight: 800; color: #1e293b; }
.admin-page-sub { font-size: 13px; color: #64748b; margin-top: 3px; }

.taxi-filters { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.admin-search { flex: 1; min-width: 200px; padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; outline: none; }
.admin-search:focus { border-color: #3b82f6; }
.admin-select { padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; background: white; cursor: pointer; outline: none; }
.taxi-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.taxi-stat-card {
  background: white; border-radius: 10px; padding: 16px 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.taxi-stat-val { font-size: 28px; font-weight: 800; color: #1e293b; line-height: 1; }
.taxi-stat-label { font-size: 12px; color: #64748b; margin-top: 4px; }

.admin-tabs { display: flex; gap: 4px; background: white; padding: 6px; border-radius: 11px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); width: fit-content; }
.admin-tab {
  display: flex; align-items: center; gap: 6px; padding: 8px 16px;
  border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600;
  color: #64748b; background: transparent; transition: all 0.15s;
}
.admin-tab:hover { background: #f1f5f9; color: #1e293b; }
.admin-tab.active { background: #3b82f6; color: white; }
.tab-count { background: #ef4444; color: white; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
.tab-count--chat { background: #2563eb; }
.admin-tab.active .tab-count { background: rgba(255,255,255,0.3); }

.bookings-list { display: flex; flex-direction: column; gap: 14px; }
.empty-state { text-align: center; padding: 60px; color: #94a3b8; font-size: 14px; background: white; border-radius: 12px; }
.empty-state p { margin-top: 10px; }

.booking-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.booking-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
.booking-id { font-size: 13px; font-weight: 700; color: #64748b; }
.booking-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 8px; }
.booking-row { display: flex; align-items: flex-start; gap: 10px; }
.booking-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
.booking-label { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
.booking-val { font-size: 13.5px; color: #1e293b; font-weight: 500; margin-top: 1px; }
.booking-actions { padding: 12px 18px; border-top: 1px solid #f1f5f9; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

.booking-status { font-size: 11.5px; padding: 4px 10px; border-radius: 20px; font-weight: 600; white-space: nowrap; }
.status-pending { background: #fefce8; color: #ca8a04; }
.status-inprogress { background: #eff6ff; color: #3b82f6; }
.status-done { background: #f0fdf4; color: #16a34a; }
.status-cancelled { background: #fef2f2; color: #dc2626; }
.status-available { background: #f0fdf4; color: #16a34a; }
.status-busy { background: #fef2f2; color: #dc2626; }

.admin-action-btn {
  padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer;
  font-size: 12.5px; font-weight: 600; transition: all 0.15s;
}
.btn-approve { background: #f0fdf4; color: #16a34a; }
.btn-approve:hover { background: #dcfce7; }
.btn-reject { background: #fef2f2; color: #dc2626; }
.btn-reject:hover { background: #fee2e2; }

.role-select {
  padding: 7px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 12.5px; outline: none; cursor: pointer; background: white;
}

/* Drivers table */
.drivers-section { margin-top: 4px; }
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

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-avatar {
  width: 34px; height: 34px; border-radius: 50%; background: #eff6ff; color: #3b82f6;
  display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; flex-shrink: 0;
}
.user-name { font-weight: 600; color: #1e293b; font-size: 13px; }
.text-sm { font-size: 13px; }
.text-gray { color: #64748b; }
.rating-cell { font-size: 13px; color: #475569; }

/* Add driver */
.add-driver-card { background: white; border-radius: 12px; padding: 18px 20px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.add-driver-title { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
.add-driver-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.driver-input { padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; outline: none; flex: 1; min-width: 130px; }
.driver-input:focus { border-color: #3b82f6; }
.driver-error { margin-top: 8px; font-size: 12.5px; color: #dc2626; }

.btn-chat { background: #f0f9ff; color: #0284c7; }
.btn-chat:hover { background: #e0f2fe; }
.btn-inprogress { background: #eff6ff; color: #3b82f6; }
.btn-inprogress:hover { background: #dbeafe; }

/* Chat modal */
.chat-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.55); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: flex-end; justify-content: flex-end; padding: 20px; }
.chat-panel { background: white; border-radius: 20px; width: 400px; max-width: 100%; height: 580px; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,0.22); overflow: hidden; }
.chat-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); }
.chat-header-left { display: flex; align-items: center; gap: 12px; }
.chat-avatar { width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.2); color: white; font-weight: 800; font-size: 15px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.chat-title { font-weight: 700; color: white; font-size: 14px; }
.chat-sub { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 1px; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chat-close { background: rgba(255,255,255,0.15); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.chat-close:hover { background: rgba(255,255,255,0.3); }
.chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 8px; background: #f8fafc; }
.chat-loading { display: flex; gap: 5px; justify-content: center; align-items: center; padding: 30px 0; }
.typing-dot { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; animation: typingBounce 1.2s infinite; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typingBounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
.chat-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #94a3b8; font-size: 13px; padding: 40px 0; }
.chat-msg { max-width: 78%; display: flex; flex-direction: column; gap: 3px; }
.msg-mine { align-self: flex-end; align-items: flex-end; }
.msg-theirs { align-self: flex-start; align-items: flex-start; }
.msg-label { font-size: 10px; font-weight: 700; color: #94a3b8; padding: 0 6px; }
.msg-bubble { padding: 10px 14px; border-radius: 18px; font-size: 13.5px; line-height: 1.5; word-break: break-word; }
.msg-mine .msg-bubble { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border-bottom-right-radius: 5px; box-shadow: 0 2px 8px rgba(59,130,246,0.3); }
.msg-theirs .msg-bubble { background: white; color: #1e293b; border-bottom-left-radius: 5px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
.msg-time { font-size: 10px; color: #94a3b8; padding: 0 6px; }
.chat-input-row { display: flex; gap: 8px; padding: 12px 14px; border-top: 1px solid #f1f5f9; background: white; }
.chat-input { flex: 1; padding: 10px 16px; border: 1.5px solid #e2e8f0; border-radius: 24px; font-size: 13.5px; outline: none; transition: border-color 0.15s; }
.chat-input:focus { border-color: #3b82f6; }
.chat-send-btn { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; box-shadow: 0 2px 8px rgba(59,130,246,0.35); border: none; cursor: pointer; }
.chat-send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 12px rgba(59,130,246,0.45); }
.chat-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Invites */
.invites-section { display: flex; flex-direction: column; gap: 16px; }
.invite-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; background: white; border-radius: 12px; padding: 18px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.invite-toolbar-title { font-size: 14px; font-weight: 700; color: #1e293b; }
.invite-toolbar-sub { font-size: 12.5px; color: #64748b; margin-top: 3px; }
.btn-create-invite { display: flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 9px; border: none; background: #3b82f6; color: white; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s; flex-shrink: 0; white-space: nowrap; }
.btn-create-invite:hover:not(:disabled) { background: #2563eb; }
.btn-create-invite:disabled { opacity: 0.6; cursor: not-allowed; }
.invites-list { display: flex; flex-direction: column; gap: 8px; }
.invite-card { background: white; border-radius: 10px; padding: 14px 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.invite-used { opacity: 0.65; }
.invite-code-wrap { display: flex; align-items: center; gap: 8px; }
.invite-code { font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700; color: #1e293b; background: #f1f5f9; padding: 6px 12px; border-radius: 8px; letter-spacing: 1.5px; }
.invite-copy-btn { background: none; border: none; cursor: pointer; color: #64748b; padding: 5px; border-radius: 6px; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
.invite-copy-btn:hover { background: #e2e8f0; color: #1e293b; }
.invite-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.invite-status-badge { font-size: 11.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px; }
.invite-status-active { background: #f0fdf4; color: #16a34a; }
.invite-status-used { background: #f1f5f9; color: #64748b; }
.invite-date { font-size: 12px; color: #94a3b8; }
.invite-reg-link { color: #3b82f6; text-decoration: none; font-weight: 600; }
.invite-reg-link:hover { text-decoration: underline; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.mock-notice { background: #FEF3C7; color: #92400E; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .taxi-stats { grid-template-columns: repeat(2, 1fr); }
  .chat-panel { width: 100%; height: 70vh; }
  .chat-overlay { align-items: flex-end; padding: 0; }
  .chat-panel { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
}
</style>
