<template>
  <main class="page-content">
    <div class="ai-page">
      <!-- Sidebar: Chat History -->
      <aside class="ai-sidebar" v-if="authStore.isAuthenticated">
        <div class="ai-sidebar-header">
          <h3>История чатов</h3>
          <button class="btn btn-primary btn-sm" @click="startNewChat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {{ t('newChat') }}
          </button>
        </div>
        <div v-if="authStore.savedChats.length === 0" class="sidebar-empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p>Нет сохранённых чатов</p>
        </div>
        <div v-else class="sidebar-chats">
          <div
            v-for="chat in authStore.savedChats.slice(0, 10)"
            :key="chat.id"
            class="sidebar-chat-item"
            @click="loadChat(chat)"
          >
            <div class="sidebar-chat-q">{{ chat.firstMessage }}</div>
            <div class="sidebar-chat-date">{{ formatDate(chat.date) }}</div>
          </div>
        </div>
      </aside>

      <!-- Main chat -->
      <div class="ai-main">
        <!-- Header -->
        <div class="ai-header">
          <div class="ai-header-left">
            <div class="ai-avatar">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M8 12l2 2 4-4"/></svg>
            </div>
            <div>
              <h1 class="ai-title">{{ t('aiTitle') }}</h1>
              <p class="ai-subtitle">{{ t('aiSubtitle') }}</p>
            </div>
          </div>
          <div class="ai-header-actions">
            <button
              v-if="authStore.isAuthenticated && messages.length > 0"
              class="btn btn-outline btn-sm"
              @click="saveCurrentChat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {{ t('saveChat') }}
            </button>
            <button class="btn btn-ghost btn-sm" @click="startNewChat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.39"/></svg>
              {{ t('newChat') }}
            </button>
          </div>
        </div>

        <!-- Messages area -->
        <div class="ai-messages" ref="messagesRef">
          <!-- Welcome state -->
          <div v-if="messages.length === 0" class="ai-welcome">
            <div class="ai-welcome-icon">🤖</div>
            <h2 class="ai-welcome-title">Привет! Я Senim</h2>
            <p class="ai-welcome-desc">Опишите вашу ситуацию — я дам конкретный пошаговый план на основе проверенной базы данных Алматы</p>
            <div class="ai-suggestions">
              <button
                v-for="s in suggestions"
                :key="s"
                class="ai-suggestion"
                @click="inputMessage = s; sendMessage()"
              >{{ s }}</button>
            </div>
          </div>

          <!-- Messages -->
          <template v-for="msg in messages" :key="msg.id">
            <!-- User message -->
            <div class="msg msg-user" v-if="msg.role === 'user'">
              <div class="msg-bubble msg-bubble-user">{{ msg.content }}</div>
              <div class="msg-avatar msg-avatar-user">
                {{ authStore.user?.name?.charAt(0) || 'У' }}
              </div>
            </div>

            <!-- AI message -->
            <div class="msg msg-ai" v-else>
              <div class="msg-avatar msg-avatar-ai">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M8 12l2 2 4-4"/></svg>
              </div>
              <div class="msg-content-wrap">
                <div class="msg-bubble msg-bubble-ai">
                  <div class="ai-response" v-html="renderMarkdown(msg.content)"></div>
                </div>

                <!-- Checklist -->
                <div v-if="msg.checklist?.length" class="ai-checklist">
                  <div class="ai-checklist-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    {{ t('checklist') }}
                  </div>
                  <ul class="ai-checklist-list">
                    <li v-for="item in msg.checklist" :key="item" class="ai-checklist-item">
                      <span class="checklist-checkbox"></span>
                      {{ item }}
                    </li>
                  </ul>
                </div>

                <!-- Suggested orgs -->
                <div v-if="msg.suggestedOrgs?.length" class="ai-suggested-orgs">
                  <div class="ai-suggested-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    {{ t('suggestedOrgs') }}
                  </div>
                  <div class="ai-org-cards">
                    <div
                      v-for="org in msg.suggestedOrgs"
                      :key="org.id"
                      class="ai-org-card"
                      @click="selectedOrg = org"
                    >
                      <div class="ai-org-avatar">{{ org.name.charAt(0) }}</div>
                      <div class="ai-org-info">
                        <div class="ai-org-name">{{ a11y.lang === 'kaz' ? org.nameKaz : org.nameRus }}</div>
                        <div class="ai-org-addr">{{ org.address }}</div>
                      </div>
                      <span v-if="org.verified" class="badge badge-verified" style="flex-shrink:0;font-size:10px">✓</span>
                    </div>
                  </div>
                </div>

                <!-- TTS -->
                <div class="msg-actions">
                  <button class="msg-action-btn" @click="a11y.speak(msg.content)" title="Читать вслух">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  </button>
                  <button class="msg-action-btn" @click="copyMessage(msg.content)" title="Скопировать">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="msg msg-ai">
            <div class="msg-avatar msg-avatar-ai">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>
            </div>
            <div class="msg-bubble msg-bubble-ai typing-bubble">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span style="margin-left:8px;color:var(--gray-500);font-size:var(--fs-xs)">{{ t('aiThinking') }}</span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="ai-input-area">
          <div class="ai-input-wrap">
            <textarea
              ref="inputRef"
              v-model="inputMessage"
              class="ai-textarea"
              :placeholder="t('typeMessage')"
              rows="1"
              @keydown.enter.prevent="sendMessage"
              @input="autoResize"
            ></textarea>
            <button
              class="ai-send-btn"
              :disabled="!inputMessage.trim() || isTyping"
              @click="sendMessage"
              aria-label="Отправить"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
          <div class="ai-input-hint">Enter — отправить · Ctrl+Enter — новая строка</div>
        </div>
      </div>
    </div>

    <OrgModal :org="selectedOrg" @close="selectedOrg = null" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'
import { sendMessage as apiSend } from '../api/ai.js'
import { getOrganizationById } from '../api/organizations.js'
import OrgModal from '../components/OrgModal.vue'

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const route = useRoute()
const t = computed(() => useI18n(a11y.lang))

const messages = ref([])
const inputMessage = ref('')
const isTyping = ref(false)
const messagesRef = ref(null)
const inputRef = ref(null)
const selectedOrg = ref(null)

const suggestions = computed(() => [
  'Реабилитация для ребёнка с ДЦП',
  'Как оформить инвалидность?',
  'Юридическая помощь бесплатно',
  'Аутизм — куда обратиться?',
])

const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) messagesRef.value.scrollTop = messagesRef.value.scrollHeight
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return
  const userMsg = inputMessage.value.trim()
  inputMessage.value = ''

  messages.value.push({ id: Date.now(), role: 'user', content: userMsg })
  await scrollToBottom()

  isTyping.value = true
  try {
    const response = await apiSend(userMsg, a11y.lang)
    const orgs = []
    for (const id of response.orgIds || []) {
      const org = await getOrganizationById(id)
      if (org) orgs.push(org)
    }
    messages.value.push({
      id: response.id,
      role: 'ai',
      content: response.message,
      checklist: response.checklist,
      suggestedOrgs: orgs,
      timestamp: response.timestamp
    })
  } catch (e) {
    messages.value.push({ id: Date.now(), role: 'ai', content: '⚠️ Произошла ошибка. Попробуйте ещё раз.' })
  } finally {
    isTyping.value = false
    await scrollToBottom()
  }
}

const startNewChat = () => { messages.value = []; inputMessage.value = '' }

const saveCurrentChat = () => {
  if (messages.value.length === 0) return
  const firstMsg = messages.value.find(m => m.role === 'user')?.content || 'Чат'
  authStore.saveChat({ id: Date.now(), firstMessage: firstMsg, date: new Date().toISOString(), messages: messages.value })
  alert('Чат сохранён!')
}

const loadChat = (chat) => { messages.value = chat.messages || [] }

const renderMarkdown = (text) => {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
}

const copyMessage = (text) => {
  navigator.clipboard?.writeText(text)
}

const autoResize = (e) => {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 140) + 'px'
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : ''

onMounted(() => {
  if (route.query.q) {
    inputMessage.value = route.query.q
    sendMessage()
  }
})
</script>

<style scoped>
.ai-page {
  display: flex;
  height: calc(100vh - var(--header-h) - var(--navbar-h));
  overflow: hidden;
}

/* Sidebar */
.ai-sidebar {
  width: 280px;
  background: var(--gray-50);
  border-right: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.ai-sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ai-sidebar-header h3 { font-size: var(--fs-sm); font-weight: 700; color: var(--gray-700); }
.sidebar-empty {
  padding: 32px 16px;
  text-align: center;
  color: var(--gray-400, #9CA3AF);
  font-size: var(--fs-sm);
}
.sidebar-empty svg { margin: 0 auto 12px; }
.sidebar-chats { overflow-y: auto; flex: 1; padding: 8px; }
.sidebar-chat-item {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition);
  margin-bottom: 4px;
}
.sidebar-chat-item:hover { background: var(--gray-200); }
.sidebar-chat-q { font-size: var(--fs-xs); font-weight: 600; color: var(--gray-700); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sidebar-chat-date { font-size: 10px; color: var(--gray-400, #9CA3AF); margin-top: 2px; }

/* Main */
.ai-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: white;
}
.ai-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  flex-shrink: 0;
}
.ai-header-left { display: flex; align-items: center; gap: 14px; }
.ai-avatar {
  width: 48px; height: 48px;
  background: var(--primary);
  border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ai-title { font-size: var(--fs-lg); font-weight: 800; color: var(--black); }
.ai-subtitle { font-size: var(--fs-xs); color: var(--gray-500); }
.ai-header-actions { display: flex; gap: 8px; }

/* Messages */
.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Welcome */
.ai-welcome { text-align: center; margin: auto; max-width: 480px; padding: 40px 0; }
.ai-welcome-icon { font-size: 56px; margin-bottom: 16px; }
.ai-welcome-title { font-size: var(--fs-2xl); font-weight: 800; color: var(--black); margin-bottom: 12px; }
.ai-welcome-desc { color: var(--gray-500); font-size: var(--fs-md); line-height: 1.6; margin-bottom: 28px; }
.ai-suggestions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.ai-suggestion {
  padding: 8px 16px;
  background: var(--primary-pale);
  color: var(--primary);
  border-radius: var(--radius-full);
  font-size: var(--fs-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  border: 1.5px solid transparent;
}
.ai-suggestion:hover { background: var(--primary); color: white; }

/* Messages */
.msg { display: flex; gap: 10px; align-items: flex-end; }
.msg-user { flex-direction: row-reverse; }
.msg-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--fs-sm);
  font-weight: 700;
  flex-shrink: 0;
}
.msg-avatar-ai { background: var(--primary); color: white; }
.msg-avatar-user { background: var(--gray-200); color: var(--gray-700); }
.msg-content-wrap { flex: 1; display: flex; flex-direction: column; gap: 10px; max-width: 75%; }
.msg-bubble {
  padding: 14px 18px;
  border-radius: 16px;
  font-size: var(--fs-sm);
  line-height: 1.6;
  max-width: 75%;
}
.msg-bubble-user {
  background: var(--primary);
  color: white;
  border-radius: 16px 16px 4px 16px;
  margin-left: auto;
}
.msg-bubble-ai {
  background: var(--gray-50);
  color: var(--gray-900);
  border-radius: 4px 16px 16px 16px;
  max-width: 100%;
}
.ai-response { line-height: 1.7; }
.ai-response :deep(strong) { font-weight: 700; color: var(--black); }
.ai-response :deep(p) { margin-bottom: 8px; }

/* Typing */
.typing-bubble {
  display: flex; align-items: center; padding: 14px 18px;
}
.typing-dot {
  width: 7px; height: 7px;
  background: var(--primary);
  border-radius: 50%;
  animation: typing 1.2s infinite;
  margin-right: 4px;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }

/* Checklist */
.ai-checklist {
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: var(--radius);
  padding: 14px 16px;
}
.ai-checklist-title {
  display: flex; align-items: center; gap: 6px;
  font-size: var(--fs-sm); font-weight: 700; color: #166534;
  margin-bottom: 10px;
}
.ai-checklist-list { display: flex; flex-direction: column; gap: 7px; }
.ai-checklist-item {
  display: flex; align-items: center; gap: 10px;
  font-size: var(--fs-sm); color: #166534;
}
.checklist-checkbox {
  width: 16px; height: 16px;
  border: 2px solid #166534;
  border-radius: 4px;
  flex-shrink: 0;
}

/* Suggested orgs */
.ai-suggested-orgs {}
.ai-suggested-title {
  display: flex; align-items: center; gap: 6px;
  font-size: var(--fs-sm); font-weight: 700; color: var(--gray-700);
  margin-bottom: 10px;
}
.ai-org-cards { display: flex; flex-direction: column; gap: 8px; }
.ai-org-card {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  background: white;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--transition);
}
.ai-org-card:hover { border-color: var(--primary); box-shadow: 0 2px 12px rgba(27,63,216,0.1); }
.ai-org-avatar {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: var(--primary-pale);
  color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: var(--fs-md);
  flex-shrink: 0;
}
.ai-org-name { font-size: var(--fs-sm); font-weight: 600; color: var(--black); }
.ai-org-addr { font-size: var(--fs-xs); color: var(--gray-500); }

/* Msg actions */
.msg-actions { display: flex; gap: 4px; }
.msg-action-btn {
  padding: 5px 8px;
  color: var(--gray-400, #9CA3AF);
  border-radius: 6px;
  font-size: var(--fs-xs);
  transition: all var(--transition);
  display: flex; align-items: center; gap: 4px;
}
.msg-action-btn:hover { background: var(--gray-100); color: var(--gray-700); }

/* Input */
.ai-input-area {
  padding: 16px 24px;
  border-top: 1px solid var(--gray-200);
  background: white;
  flex-shrink: 0;
}
.ai-input-wrap {
  display: flex; align-items: flex-end; gap: 10px;
  background: var(--gray-50);
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 8px 8px 8px 16px;
  transition: border-color var(--transition);
}
.ai-input-wrap:focus-within { border-color: var(--primary); background: white; }
.ai-textarea {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: var(--fs-base);
  color: var(--gray-900);
  resize: none;
  max-height: 140px;
  min-height: 24px;
  line-height: 1.5;
  padding: 4px 0;
}
.ai-textarea::placeholder { color: var(--gray-300); }
.ai-send-btn {
  width: 40px; height: 40px;
  background: var(--primary);
  color: white;
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
  flex-shrink: 0;
}
.ai-send-btn:hover:not(:disabled) { background: var(--primary-dark); }
.ai-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.ai-input-hint { font-size: 11px; color: var(--gray-400, #9CA3AF); margin-top: 6px; }

@media (max-width: 768px) {
  .ai-sidebar { display: none; }
  .ai-messages { padding: 16px; }
  .msg-bubble { max-width: 90%; }
  .msg-content-wrap { max-width: 90%; }
}
</style>
