<template>
  <div class="admin-tickets">
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Обращения пользователей</h1>
        <p class="admin-page-sub">Тикеты в службу поддержки</p>
      </div>
    </div>

    <!-- Status tabs -->
    <div class="admin-tabs">
      <button
        v-for="tab in tabs" :key="tab.value"
        class="admin-tab" :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <div v-if="loading" class="admin-loading">Загрузка...</div>

    <div v-else-if="filtered.length === 0" class="empty-state">
      <div style="font-size:36px">📭</div>
      <p>Нет обращений в этом статусе</p>
    </div>

    <div v-else class="tickets-list">
      <div v-for="t in filtered" :key="t.id" class="ticket-card">
        <div class="ticket-header">
          <div>
            <div class="ticket-subject">{{ t.subject }}</div>
            <div class="ticket-type" v-if="t.type">{{ typeLabel(t.type) }}</div>
          </div>
          <span class="status-badge" :class="statusClass(t.status)">{{ statusLabel(t.status) }}</span>
        </div>

        <div class="ticket-body">{{ t.body }}</div>

        <!-- Existing response -->
        <div v-if="t.response" class="ticket-response">
          <div class="ticket-response-label">💬 Ответ поддержки:</div>
          <div class="ticket-response-text">{{ t.response }}</div>
        </div>

        <div class="ticket-footer">
          <div class="ticket-meta">
            <span>👤 {{ t.user?.profile?.firstName || t.user?.email || 'Пользователь' }}</span>
            <span>📅 {{ formatDate(t.createdAt) }}</span>
          </div>
          <div class="ticket-actions">
            <select
              class="status-select"
              :value="t.status"
              @change="setStatus(t, $event.target.value)"
            >
              <option value="OPEN">Открыто</option>
              <option value="IN_PROGRESS">В работе</option>
              <option value="RESOLVED">Решено</option>
              <option value="CLOSED">Закрыто</option>
            </select>
            <button
              class="reply-toggle-btn"
              :class="{ active: replyOpen === t.id }"
              @click="toggleReply(t.id)"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {{ replyOpen === t.id ? 'Скрыть' : 'Ответить' }}
            </button>
          </div>
        </div>

        <!-- Reply form -->
        <Transition name="slide">
          <div v-if="replyOpen === t.id" class="reply-form">
            <textarea
              v-model="replyText"
              class="reply-textarea"
              placeholder="Введите ответ пользователю..."
              rows="3"
            ></textarea>
            <div class="reply-form-actions">
              <button class="btn-cancel-reply" @click="replyOpen = null">Отмена</button>
              <button
                class="btn-send-reply"
                :disabled="!replyText.trim() || sendingReply === t.id"
                @click="sendReply(t)"
              >
                <span v-if="sendingReply === t.id" class="spinner-sm-dark"></span>
                {{ sendingReply === t.id ? 'Отправка...' : '✓ Отправить ответ' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminGetTickets, adminSetTicketStatus, adminReplyTicket } from '../../api/admin.js'

const tickets = ref([])
const loading = ref(true)
const activeTab = ref('OPEN')
const replyOpen = ref(null)
const replyText = ref('')
const sendingReply = ref(null)

const tabs = computed(() => [
  { label: 'Открытые', value: 'OPEN', count: tickets.value.filter(t => t.status === 'OPEN').length || null },
  { label: 'В работе', value: 'IN_PROGRESS', count: tickets.value.filter(t => t.status === 'IN_PROGRESS').length || null },
  { label: 'Решённые', value: 'RESOLVED', count: null },
  { label: 'Все', value: 'ALL', count: null },
])

const filtered = computed(() => {
  const data = activeTab.value === 'ALL'
    ? [...tickets.value]
    : tickets.value.filter(t => t.status === activeTab.value)
  return data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
})

const load = async () => {
  loading.value = true
  try {
    const res = await adminGetTickets(200)
    tickets.value = res.items ?? res
  } finally {
    loading.value = false
  }
}

const setStatus = async (ticket, status) => {
  try {
    await adminSetTicketStatus(ticket.id, status)
    const idx = tickets.value.findIndex(t => t.id === ticket.id)
    if (idx !== -1) tickets.value[idx] = { ...tickets.value[idx], status }
  } catch (e) {
    alert('Ошибка: ' + (e.message || ''))
  }
}

const toggleReply = (id) => {
  if (replyOpen.value === id) {
    replyOpen.value = null
    replyText.value = ''
  } else {
    replyOpen.value = id
    replyText.value = ''
  }
}

const sendReply = async (ticket) => {
  if (!replyText.value.trim()) return
  sendingReply.value = ticket.id
  try {
    await adminReplyTicket(ticket.id, replyText.value.trim())
    // Update locally
    const idx = tickets.value.findIndex(t => t.id === ticket.id)
    if (idx !== -1) {
      tickets.value[idx] = {
        ...tickets.value[idx],
        response: replyText.value.trim(),
        status: tickets.value[idx].status === 'OPEN' ? 'IN_PROGRESS' : tickets.value[idx].status,
      }
    }
    replyOpen.value = null
    replyText.value = ''
  } catch (e) {
    alert('Ошибка отправки: ' + (e.message || ''))
  } finally {
    sendingReply.value = null
  }
}

const statusLabel = (s) => ({ OPEN: 'Открыто', IN_PROGRESS: 'В работе', RESOLVED: '✓ Решено', CLOSED: 'Закрыто' }[s] || s)
const statusClass = (s) => ({ OPEN: 'badge-open', IN_PROGRESS: 'badge-inprogress', RESOLVED: 'badge-resolved', CLOSED: 'badge-closed' }[s] || '')
const typeLabel = (t) => ({ COMPLAINT: '🔔 Жалоба', QUESTION: '❓ Вопрос', SUGGESTION: '💡 Предложение', TECHNICAL: '🔧 Техническая' }[t] || t)
const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

onMounted(load)
</script>

<style scoped>
.admin-tickets { max-width: 860px; }
.admin-page-header { margin-bottom: 20px; }
.admin-page-title { font-size: 22px; font-weight: 800; color: #1e293b; }
.admin-page-sub { font-size: 13px; color: #64748b; margin-top: 3px; }

.admin-tabs { display: flex; gap: 4px; background: white; padding: 6px; border-radius: 11px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); width: fit-content; }
.admin-tab { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; color: #64748b; background: transparent; transition: all 0.15s; }
.admin-tab:hover { background: #f1f5f9; color: #1e293b; }
.admin-tab.active { background: #3b82f6; color: white; }
.tab-count { background: #ef4444; color: white; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
.admin-tab.active .tab-count { background: rgba(255,255,255,0.3); }

.admin-loading { padding: 40px; text-align: center; color: #64748b; }
.empty-state { text-align: center; padding: 60px; color: #94a3b8; font-size: 14px; background: white; border-radius: 12px; }
.empty-state p { margin-top: 10px; }

.tickets-list { display: flex; flex-direction: column; gap: 12px; }
.ticket-card { background: white; border-radius: 12px; padding: 18px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.ticket-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
.ticket-subject { font-size: 14.5px; font-weight: 700; color: #1e293b; line-height: 1.4; }
.ticket-type { font-size: 12px; color: #64748b; margin-top: 3px; }
.ticket-body { font-size: 13.5px; color: #475569; line-height: 1.6; margin-bottom: 14px; }
.ticket-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.ticket-meta { display: flex; gap: 16px; font-size: 12.5px; color: #94a3b8; }
.ticket-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

.ticket-response { background: #f0fdf4; border-left: 3px solid #22c55e; border-radius: 0 8px 8px 0; padding: 10px 14px; margin-bottom: 12px; }
.ticket-response-label { font-size: 11px; font-weight: 700; color: #16a34a; text-transform: uppercase; margin-bottom: 4px; }
.ticket-response-text { font-size: 13.5px; color: #166534; line-height: 1.5; }

.status-select { padding: 6px 10px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 12.5px; font-weight: 600; outline: none; cursor: pointer; background: white; }
.reply-toggle-btn { display: flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; font-size: 12.5px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.15s; }
.reply-toggle-btn:hover, .reply-toggle-btn.active { background: #eff6ff; border-color: #3b82f6; color: #3b82f6; }

.reply-form { border-top: 1px solid #f1f5f9; padding-top: 14px; margin-top: 14px; }
.reply-textarea { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; font-size: 13.5px; outline: none; resize: vertical; box-sizing: border-box; transition: border-color 0.15s; }
.reply-textarea:focus { border-color: #3b82f6; }
.reply-form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px; }
.btn-cancel-reply { padding: 7px 14px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; font-size: 12.5px; font-weight: 600; color: #64748b; cursor: pointer; }
.btn-cancel-reply:hover { background: #f1f5f9; }
.btn-send-reply { display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 8px; border: none; background: #3b82f6; color: white; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
.btn-send-reply:hover:not(:disabled) { background: #2563eb; }
.btn-send-reply:disabled { opacity: 0.6; cursor: not-allowed; }

.status-badge { font-size: 11.5px; padding: 4px 10px; border-radius: 20px; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
.badge-open { background: #fefce8; color: #ca8a04; }
.badge-inprogress { background: #eff6ff; color: #3b82f6; }
.badge-resolved { background: #f0fdf4; color: #16a34a; }
.badge-closed { background: #f1f5f9; color: #64748b; }

.spinner-sm-dark { width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
