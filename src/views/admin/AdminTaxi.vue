<template>
  <div class="admin-taxi">
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">ИнваТакси — Панель диспетчера</h1>
        <p class="admin-page-sub">Управление заявками и водителями</p>
      </div>
    </div>

    <!-- Stats row -->
    <div class="taxi-stats">
      <div class="taxi-stat-card" style="border-left: 4px solid #f59e0b">
        <div class="taxi-stat-val">{{ bookings.filter(b => b.status === 'PENDING').length }}</div>
        <div class="taxi-stat-label">Ожидают водителя</div>
      </div>
      <div class="taxi-stat-card" style="border-left: 4px solid #3b82f6">
        <div class="taxi-stat-val">{{ bookings.filter(b => b.status === 'ACCEPTED').length }}</div>
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
      <button class="admin-tab" :class="{ active: activeTab === 'bookings' }" @click="activeTab = 'bookings'">
        Заявки
        <span v-if="pendingCount" class="tab-count">{{ pendingCount }}</span>
      </button>
      <button class="admin-tab" :class="{ active: activeTab === 'drivers' }" @click="activeTab = 'drivers'">Водители</button>
    </div>

    <!-- Bookings tab -->
    <div v-if="activeTab === 'bookings'" class="bookings-list">
      <div v-if="bookings.length === 0" class="empty-state">
        <div style="font-size:36px">🚖</div>
        <p>Нет заявок</p>
      </div>
      <div class="booking-card" v-for="b in bookings" :key="b.id">
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
          <button v-if="b.status === 'ACCEPTED'" class="admin-action-btn btn-approve" @click="completeBooking(b)">✓ Завершить</button>
          <button v-if="['PENDING','ACCEPTED'].includes(b.status)" class="admin-action-btn btn-reject" @click="cancelBooking(b)">✕ Отменить</button>
        </div>
      </div>
    </div>

    <!-- Drivers tab -->
    <div v-if="activeTab === 'drivers'" class="drivers-section">
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
                <button class="admin-action-btn btn-reject" @click="confirmDeleteDriver(d)">🗑 Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('bookings')

const bookings = ref([
  { id: 1001, fromAddress: 'ул. Абая 10', toAddress: 'Больница №1, пр. Достык', passengerName: 'Асель Нурланова', specialNeeds: 'Инвалидная коляска', status: 'PENDING', assignedDriverId: '', createdAt: new Date().toISOString() },
  { id: 1002, fromAddress: 'мкр Алмагуль, д.5', toAddress: 'Реабилитационный центр', passengerName: 'Бауыржан Қасымов', specialNeeds: 'Нарушение зрения', status: 'ACCEPTED', assignedDriverId: 'drv-1', createdAt: new Date(Date.now()-3600000).toISOString() },
  { id: 1003, fromAddress: 'пр. Назарбаева 100', toAddress: 'ТД Мегацентр', passengerName: 'Зарина Смагулова', specialNeeds: '', status: 'COMPLETED', assignedDriverId: 'drv-2', createdAt: new Date(Date.now()-7200000).toISOString() },
])

const drivers = ref([
  { id: 'drv-1', name: 'Канат Бекенов', car: 'Hyundai H1 • А 001 АА', phone: '+7 701 111 2233', rating: 4.8, available: true },
  { id: 'drv-2', name: 'Серік Алтынбеков', car: 'Ford Transit • В 222 ВВ', phone: '+7 707 333 4455', rating: 4.6, available: false },
  { id: 'drv-3', name: 'Дмитрий Чен', car: 'Volkswagen Caravelle • С 333 СС', phone: '+7 702 555 6677', rating: 4.9, available: true },
])

const pendingCount = computed(() => bookings.value.filter(b => b.status === 'PENDING').length)
const availableDrivers = computed(() => drivers.value.filter(d => d.available))

const assignDriver = (booking) => {
  if (booking.assignedDriverId) {
    booking.status = 'ACCEPTED'
  }
}

const completeBooking = (booking) => { booking.status = 'COMPLETED' }
const cancelBooking = (booking) => {
  if (confirm('Отменить эту заявку?')) booking.status = 'CANCELLED'
}

const confirmDeleteDriver = (driver) => {
  if (confirm(`Удалить водителя "${driver.name}"?`)) {
    drivers.value = drivers.value.filter(d => d.id !== driver.id)
  }
}

const bookingStatusLabel = (status) => {
  const map = { PENDING: '⏳ Ожидает', ACCEPTED: '🚗 В пути', COMPLETED: '✓ Завершена', CANCELLED: '✕ Отменена' }
  return map[status] || status
}
const bookingStatusClass = (status) => {
  const map = { PENDING: 'status-pending', ACCEPTED: 'status-inprogress', COMPLETED: 'status-done', CANCELLED: 'status-cancelled' }
  return map[status] || ''
}

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.admin-taxi { max-width: 1000px; }
.admin-page-header { margin-bottom: 20px; }
.admin-page-title { font-size: 22px; font-weight: 800; color: #1e293b; }
.admin-page-sub { font-size: 13px; color: #64748b; margin-top: 3px; }

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

@media (max-width: 640px) { .taxi-stats { grid-template-columns: repeat(2, 1fr); } }
</style>
