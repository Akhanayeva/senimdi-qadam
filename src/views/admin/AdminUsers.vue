<template>
  <div class="admin-users">
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Пользователи</h1>
        <p class="admin-page-sub">Управление аккаунтами пользователей</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="admin-filters">
      <input class="admin-search" v-model="searchQuery" placeholder="Поиск по email или имени..." @input="applyFilters" />
      <select class="admin-select" v-model="filterRole" @change="applyFilters">
        <option value="all">Все роли</option>
        <option value="USER">USER</option>
        <option value="RELATIVE">RELATIVE</option>
        <option value="MODERATOR">MODERATOR</option>
        <option value="TAXI_MANAGER">TAXI_MANAGER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Телефон</th>
            <th>Дата регистрации</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="user-cell">
                <div class="user-avatar">{{ (user.firstName || user.email || 'U').charAt(0).toUpperCase() }}</div>
                <div>
                  <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="user-disability" v-if="user.disabilityType">{{ user.disabilityType }}</div>
                </div>
              </div>
            </td>
            <td class="text-sm text-gray">{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="`role-${user.role?.toLowerCase()}`">{{ user.role }}</span>
            </td>
            <td class="text-sm text-gray">{{ user.phone || '—' }}</td>
            <td class="text-sm text-gray">{{ formatDate(user.createdAt) }}</td>
            <td>
              <div class="action-btns">
                <select class="role-select" :value="user.role" @change="changeRole(user, $event.target.value)">
                  <option value="USER">USER</option>
                  <option value="RELATIVE">RELATIVE</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="TAXI_MANAGER">TAXI_MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <button class="action-btn action-btn-delete" @click="confirmDelete(user)" title="Заблокировать">🚫</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="6" class="empty-row">Пользователи не найдены</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Mock users — replace with real API GET /api/core/admin/users when backend ready
const allUsers = ref([
  { id: 'usr-1', firstName: 'Администратор', lastName: '', email: 'admin@senimdi.kz', role: 'ADMIN', phone: '+7 727 000 0001', createdAt: '2025-01-01T00:00:00Z', disabilityType: null },
  { id: 'usr-2', firstName: 'Асель', lastName: 'Нурланова', email: 'user@senimdi.kz', role: 'USER', phone: '+7 777 123 4567', createdAt: '2025-06-15T10:30:00Z', disabilityType: 'Нарушение опорно-двигательного аппарата' },
  { id: 'usr-3', firstName: 'Модератор', lastName: '', email: 'mod@senimdi.kz', role: 'MODERATOR', phone: '+7 727 000 0002', createdAt: '2025-02-10T09:00:00Z', disabilityType: null },
  { id: 'usr-4', firstName: 'Диспетчер', lastName: 'Ахметов', email: 'manager@senimdi.kz', role: 'TAXI_MANAGER', phone: '+7 701 987 6543', createdAt: '2025-03-20T08:00:00Z', disabilityType: null },
  { id: 'usr-5', firstName: 'Опекун', lastName: 'Серікова', email: 'relative@senimdi.kz', role: 'RELATIVE', phone: '+7 702 111 2233', createdAt: '2025-07-01T14:00:00Z', disabilityType: null },
  { id: 'usr-6', firstName: 'Бауыржан', lastName: 'Қасымов', email: 'b.kasymov@mail.ru', role: 'USER', phone: '+7 705 333 4455', createdAt: '2025-09-10T11:00:00Z', disabilityType: 'Нарушение зрения' },
  { id: 'usr-7', firstName: 'Зарина', lastName: 'Смагулова', email: 'z.smagulova@gmail.com', role: 'USER', phone: '+7 707 555 6677', createdAt: '2025-10-05T16:00:00Z', disabilityType: 'Нарушение слуха' },
])

const filteredUsers = ref([...allUsers.value])
const searchQuery = ref('')
const filterRole = ref('all')

const applyFilters = () => {
  let data = [...allUsers.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    data = data.filter(u =>
      (u.email || '').toLowerCase().includes(q) ||
      (u.firstName || '').toLowerCase().includes(q) ||
      (u.lastName || '').toLowerCase().includes(q)
    )
  }
  if (filterRole.value !== 'all') data = data.filter(u => u.role === filterRole.value)
  filteredUsers.value = data
}

const changeRole = (user, newRole) => {
  const idx = allUsers.value.findIndex(u => u.id === user.id)
  if (idx !== -1) allUsers.value[idx].role = newRole
  applyFilters()
}

const confirmDelete = (user) => {
  if (confirm(`Заблокировать пользователя "${user.email}"?`)) {
    allUsers.value = allUsers.value.filter(u => u.id !== user.id)
    applyFilters()
  }
}

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(applyFilters)
</script>

<style scoped>
.admin-users { max-width: 1100px; }
.admin-page-header { margin-bottom: 24px; }
.admin-page-title { font-size: 22px; font-weight: 800; color: #1e293b; }
.admin-page-sub { font-size: 13px; color: #64748b; margin-top: 3px; }

.admin-filters { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.admin-search {
  flex: 1; min-width: 200px; padding: 9px 14px;
  border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 13.5px; outline: none; background: white;
}
.admin-search:focus { border-color: #3b82f6; }
.admin-select {
  padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-size: 13.5px; outline: none; background: white; cursor: pointer;
}

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
  width: 36px; height: 36px; border-radius: 50%; background: #eff6ff; color: #3b82f6;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 15px; flex-shrink: 0;
}
.user-name { font-weight: 600; color: #1e293b; font-size: 13px; }
.user-disability { font-size: 11px; color: #94a3b8; margin-top: 1px; }
.text-sm { font-size: 13px; }
.text-gray { color: #64748b; }

.role-badge { font-size: 11px; padding: 3px 9px; border-radius: 20px; font-weight: 700; white-space: nowrap; }
.role-admin { background: #fdf4ff; color: #9333ea; }
.role-moderator { background: #eff6ff; color: #3b82f6; }
.role-taxi_manager { background: #f0fdf4; color: #16a34a; }
.role-user { background: #f1f5f9; color: #475569; }
.role-relative { background: #fefce8; color: #ca8a04; }

.action-btns { display: flex; gap: 6px; align-items: center; }
.role-select {
  padding: 5px 10px; border: 1.5px solid #e2e8f0; border-radius: 7px;
  font-size: 12px; outline: none; cursor: pointer; background: white;
}
.role-select:focus { border-color: #3b82f6; }
.action-btn {
  width: 30px; height: 30px; border-radius: 7px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; font-size: 14px;
  transition: background 0.15s;
}
.action-btn-delete { background: #fef2f2; }
.action-btn-delete:hover { background: #fee2e2; }
.empty-row { text-align: center; padding: 40px !important; color: #94a3b8; }
</style>
