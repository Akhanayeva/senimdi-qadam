<template>
  <div class="admin-dashboard">
    <div class="admin-page-header">
      <h1 class="admin-page-title">Дашборд</h1>
      <p class="admin-page-sub">Обзор платформы SenimdiQadam</p>
    </div>

    <!-- Stats cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background:#eff6ff;color:#3b82f6">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.orgs }}</div>
          <div class="stat-label">Организаций</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background:#f0fdf4;color:#22c55e">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.users }}</div>
          <div class="stat-label">Пользователей</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background:#fefce8;color:#eab308">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pendingNews }}</div>
          <div class="stat-label">Новостей на модерации</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background:#fdf4ff;color:#a855f7">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h4l3 3v5h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.taxiActive }}</div>
          <div class="stat-label">Активных поездок</div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="admin-section">
      <h2 class="admin-section-title">Быстрые действия</h2>
      <div class="quick-actions">
        <RouterLink to="/admin/orgs" class="quick-action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Добавить организацию
        </RouterLink>
        <RouterLink to="/admin/news" class="quick-action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Модерация новостей
        </RouterLink>
        <RouterLink to="/admin/taxi" class="quick-action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h4l3 3v5h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          Диспетчер такси
        </RouterLink>
        <RouterLink to="/admin/users" class="quick-action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          Пользователи
        </RouterLink>
      </div>
    </div>

    <!-- Recent activity -->
    <div class="admin-section">
      <h2 class="admin-section-title">Последние действия</h2>
      <div class="activity-list">
        <div class="activity-item" v-for="item in recentActivity" :key="item.id">
          <div class="activity-dot" :style="`background:${item.color}`"></div>
          <div class="activity-content">
            <div class="activity-text">{{ item.text }}</div>
            <div class="activity-time">{{ item.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Mock stats — replace with real API calls when backend is ready
const stats = ref({
  orgs: 24,
  users: 138,
  pendingNews: 3,
  taxiActive: 5,
})

const recentActivity = ref([
  { id: 1, text: 'Новая организация "Алматы Арна" ожидает верификации', time: '5 мин назад', color: '#3b82f6' },
  { id: 2, text: 'Новость "Новые льготы для инвалидов" опубликована', time: '20 мин назад', color: '#22c55e' },
  { id: 3, text: 'Пользователь user@senimdi.kz оставил жалобу', time: '1 час назад', color: '#ef4444' },
  { id: 4, text: 'Заявка ИнваТакси #142 завершена', time: '2 часа назад', color: '#a855f7' },
  { id: 5, text: 'Комментарий к новости ожидает модерации', time: '3 часа назад', color: '#eab308' },
])
</script>

<style scoped>
.admin-dashboard { max-width: 1000px; }

.admin-page-header { margin-bottom: 28px; }
.admin-page-title { font-size: 24px; font-weight: 800; color: #1e293b; }
.admin-page-sub { font-size: 14px; color: #64748b; margin-top: 4px; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.stat-icon {
  width: 48px; height: 48px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-value { font-size: 26px; font-weight: 800; color: #1e293b; line-height: 1; }
.stat-label { font-size: 12px; color: #64748b; margin-top: 4px; }

.admin-section { margin-bottom: 32px; }
.admin-section-title { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 14px; }

.quick-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: white;
  border-radius: 10px;
  color: #1e293b;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: all 0.15s;
  border: 1.5px solid #e2e8f0;
}
.quick-action-btn:hover { border-color: #3b82f6; color: #3b82f6; box-shadow: 0 2px 8px rgba(59,130,246,0.15); }

.activity-list { background: white; border-radius: 12px; padding: 8px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px 20px;
  border-bottom: 1px solid #f1f5f9;
}
.activity-item:last-child { border-bottom: none; }
.activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.activity-text { font-size: 13.5px; color: #334155; }
.activity-time { font-size: 12px; color: #94a3b8; margin-top: 2px; }

@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }
</style>
