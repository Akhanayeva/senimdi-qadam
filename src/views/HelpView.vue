<template>
  <main class="page-content">
    <div class="help-page-header">
      <div class="container">
        <h1 class="page-h1">{{ t('helpNav') }}</h1>
        <p class="page-desc">Пошаговое руководство по использованию платформы SenimdiQadam</p>
      </div>
    </div>
    <div class="container help-content">
      <div class="help-grid">
        <div class="help-card" v-for="item in helpItems" :key="item.title">
          <div class="help-icon">{{ item.icon }}</div>
          <h3 class="help-title">{{ item.title }}</h3>
          <p class="help-desc">{{ item.desc }}</p>
          <RouterLink :to="item.link" class="btn btn-outline btn-sm" style="margin-top:auto">
            Перейти →
          </RouterLink>
        </div>
      </div>

      <!-- Step-by-step guide -->
      <div class="help-guide">
        <h2 class="help-guide-title">Как пользоваться платформой</h2>
        <div class="help-steps">
          <div v-for="(step, i) in steps" :key="i" class="help-step">
            <div class="step-num">{{ i + 1 }}</div>
            <div class="step-content">
              <h4 class="step-title">{{ step.title }}</h4>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Форма обращения в поддержку ── -->
      <div class="support-section">
        <div class="support-header">
          <div class="support-header-icon">💬</div>
          <div>
            <h2 class="support-title">Обращение в поддержку</h2>
            <p class="support-sub">Не нашли ответ? Напишите нам — ответим в течение 24 часов</p>
          </div>
        </div>

        <div v-if="!authStore.isAuthenticated" class="support-auth-hint">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Для отправки обращения необходимо
          <RouterLink to="/login" class="support-auth-link">войти в аккаунт</RouterLink>
        </div>

        <form v-else class="support-form" @submit.prevent="submitTicket">
          <div class="support-form-row">
            <div class="sf-group">
              <label class="sf-label">Тема обращения *</label>
              <input
                v-model="ticketForm.subject"
                type="text"
                class="sf-input"
                placeholder="Кратко опишите проблему"
                required
                :disabled="ticketLoading || ticketSent"
              />
            </div>
            <div class="sf-group">
              <label class="sf-label">Тип обращения</label>
              <select v-model="ticketForm.type" class="sf-input sf-select" :disabled="ticketLoading || ticketSent">
                <option value="GENERAL">Общий вопрос</option>
                <option value="TECHNICAL">Техническая проблема</option>
                <option value="COMPLAINT">Жалоба</option>
                <option value="SUGGESTION">Предложение</option>
              </select>
            </div>
          </div>
          <div class="sf-group">
            <label class="sf-label">Описание *</label>
            <textarea
              v-model="ticketForm.body"
              class="sf-input sf-textarea"
              rows="5"
              placeholder="Подробно опишите вашу проблему или вопрос..."
              required
              :disabled="ticketLoading || ticketSent"
            />
          </div>
          <div v-if="ticketError" class="sf-error">{{ ticketError }}</div>
          <Transition name="fade">
            <div v-if="ticketSent" class="sf-success">
              ✅ Обращение отправлено! Мы ответим на {{ authStore.user?.email }} в течение 24 часов.
              <button type="button" class="sf-new-btn" @click="resetTicket">Новое обращение</button>
            </div>
          </Transition>
          <div v-if="!ticketSent" class="sf-actions">
            <button type="submit" class="btn btn-primary" :disabled="ticketLoading">
              <span v-if="ticketLoading" class="spinner-sm"></span>
              {{ ticketLoading ? 'Отправка...' : 'Отправить обращение' }}
            </button>
            <span class="sf-note">* обязательные поля</span>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useAuthStore } from '../stores/auth.js'
import { useI18n } from '../i18n.js'
import { createTicket } from '../api/tickets.js'

const a11y = useAccessibilityStore()
const authStore = useAuthStore()
const t = computed(() => useI18n(a11y.lang))

const helpItems = [
  { icon: '🏢', title: 'Каталог организаций', desc: 'Найдите нужный центр или фонд по категории, району или ключевому слову', link: '/services/organizations' },
  { icon: '🤖', title: 'ИИ-консультант Senim', desc: 'Опишите ситуацию и получите пошаговый план действий с рекомендованными организациями', link: '/services/ai' },
  { icon: '📰', title: 'Новости', desc: 'Актуальные события, анонсы мероприятий и полезные объявления', link: '/news' },
  { icon: '👥', title: 'Сообщество', desc: 'Ссылки на группы и чаты в социальных сетях для взаимопомощи', link: '/projects/community' },
  { icon: '🚕', title: 'ИнваТакси', desc: 'Заказ специализированного такси для людей с ограниченными возможностями', link: '/inva-taxi' },
  { icon: '♿', title: 'Доступность', desc: 'Режим высокого контраста, размер шрифта и голосовое чтение — значок ⏱ в шапке', link: '/' },
]

const steps = [
  { title: 'Выберите способ поиска', desc: 'Воспользуйтесь поиском в шапке, каталогом организаций или ИИ-консультантом Senim.' },
  { title: 'Опишите ситуацию или найдите организацию', desc: 'Введите запрос в поле поиска или воспользуйтесь фильтрами по категории, районy и статусу проверки.' },
  { title: 'Изучите карточку организации', desc: 'Нажмите "Подробнее" для просмотра адреса, телефона, часов работы и статуса верификации (значок ✓).' },
  { title: 'Свяжитесь напрямую', desc: 'Нажмите "Позвонить" или перейдите на сайт организации прямо с карточки.' },
  { title: 'Сохраняйте избранное', desc: 'После регистрации вы можете сохранять организации и чаты с ИИ в избранное.' },
]

// ── Ticket form ───────────────────────────────────────────────────────────────
const ticketForm = ref({ subject: '', body: '', type: 'GENERAL' })
const ticketLoading = ref(false)
const ticketSent = ref(false)
const ticketError = ref('')

async function submitTicket() {
  if (!ticketForm.value.subject.trim() || !ticketForm.value.body.trim()) return
  ticketLoading.value = true
  ticketError.value = ''
  try {
    await createTicket(null, {
      subject: ticketForm.value.subject.trim(),
      body: ticketForm.value.body.trim(),
      type: ticketForm.value.type,
    })
    ticketSent.value = true
  } catch (e) {
    ticketError.value = e.message || 'Ошибка при отправке. Попробуйте ещё раз.'
  } finally {
    ticketLoading.value = false
  }
}

function resetTicket() {
  ticketForm.value = { subject: '', body: '', type: 'GENERAL' }
  ticketSent.value = false
  ticketError.value = ''
}
</script>

<style scoped>
.help-page-header { background: linear-gradient(135deg, var(--dark) 0%, var(--primary-dark) 100%); padding: 48px 0 40px; margin-bottom: 40px; }
.page-h1 { font-size: var(--fs-3xl); font-weight: 800; color: white; margin-bottom: 8px; }
.page-desc { color: rgba(255,255,255,0.7); font-size: var(--fs-md); }
.help-content { padding-bottom: 64px; }
.help-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 56px; }
.help-card { background: white; border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 12px; transition: all var(--transition); }
.help-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.help-icon { font-size: 36px; }
.help-title { font-size: var(--fs-md); font-weight: 700; color: var(--black); }
.help-desc { font-size: var(--fs-sm); color: var(--gray-500); line-height: 1.6; flex: 1; }
.help-guide { background: white; border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow); margin-bottom: 40px; }
.help-guide-title { font-size: var(--fs-2xl); font-weight: 800; color: var(--black); margin-bottom: 32px; }
.help-steps { display: flex; flex-direction: column; gap: 24px; }
.help-step { display: flex; gap: 20px; align-items: flex-start; }
.step-num { width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: var(--fs-md); flex-shrink: 0; }
.step-title { font-size: var(--fs-md); font-weight: 700; color: var(--black); margin-bottom: 4px; }
.step-desc { font-size: var(--fs-sm); color: var(--gray-500); line-height: 1.6; }

/* ── Support form ── */
.support-section { background: white; border-radius: var(--radius-xl); padding: 36px 40px; box-shadow: var(--shadow); }
.support-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
.support-header-icon { font-size: 40px; }
.support-title { font-size: var(--fs-xl); font-weight: 800; color: var(--black); margin-bottom: 4px; }
.support-sub { font-size: var(--fs-sm); color: var(--gray-500); }

.support-auth-hint { display: flex; align-items: center; gap: 8px; padding: 16px 20px; background: var(--gray-50); border-radius: var(--radius); font-size: var(--fs-sm); color: var(--gray-600); }
.support-auth-link { color: var(--primary); font-weight: 700; text-decoration: none; margin-left: 4px; }
.support-auth-link:hover { text-decoration: underline; }

.support-form { display: flex; flex-direction: column; gap: 18px; }
.support-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 640px) { .support-form-row { grid-template-columns: 1fr; } }
.sf-group { display: flex; flex-direction: column; gap: 6px; }
.sf-label { font-size: var(--fs-xs); font-weight: 700; color: var(--gray-600); }
.sf-input { padding: 10px 14px; border: 1.5px solid var(--gray-200); border-radius: var(--radius); font-size: var(--fs-sm); outline: none; transition: border-color var(--transition); background: white; }
.sf-input:focus { border-color: var(--primary); }
.sf-input:disabled { background: var(--gray-50); color: var(--gray-400); }
.sf-select { cursor: pointer; }
.sf-textarea { resize: vertical; min-height: 120px; font-family: inherit; line-height: 1.6; }
.sf-error { background: #FEF2F2; color: #DC2626; padding: 10px 14px; border-radius: var(--radius); font-size: var(--fs-sm); font-weight: 600; }
.sf-success { background: #F0FDF4; color: #166534; padding: 16px 20px; border-radius: var(--radius); font-size: var(--fs-sm); font-weight: 600; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.sf-new-btn { background: none; border: 1.5px solid #166534; color: #166534; padding: 5px 14px; border-radius: var(--radius-full); font-size: var(--fs-xs); font-weight: 700; cursor: pointer; transition: all var(--transition); }
.sf-new-btn:hover { background: #166534; color: white; }
.sf-actions { display: flex; align-items: center; gap: 16px; }
.sf-note { font-size: var(--fs-xs); color: var(--gray-400); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 900px) { .help-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .help-grid { grid-template-columns: 1fr; } .support-section { padding: 24px 20px; } }
</style>
