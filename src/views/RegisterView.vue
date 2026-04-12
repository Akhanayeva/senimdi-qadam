<template>
  <main class="page-content auth-bg">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="auth-logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="rgba(255,255,255,0.2)"/>
              <path d="M14 4L6 9v6c0 4.42 3.44 8.56 8 9.56 4.56-1 8-5.14 8-9.56V9L14 4z" fill="white" fill-opacity="0.9"/>
              <path d="M11 14l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span>SenimdiQAdam</span>
        </div>

        <h1 class="auth-title">{{ lang==='kaz' ? 'Тіркелу' : 'Регистрация' }}</h1>
        <p class="auth-subtitle">{{ lang==='kaz' ? 'Толық қол жеткізу үшін аккаунт жасаңыз' : 'Создайте аккаунт для полного доступа к платформе' }}</p>

        <!-- Progress steps -->
        <div class="reg-steps">
          <div class="reg-step" :class="{ active: step >= 1, done: step > 1 }">
            <div class="step-circle">{{ step > 1 ? '✓' : '1' }}</div>
            <span>{{ lang==='kaz' ? 'Жеке деректер' : 'Личные данные' }}</span>
          </div>
          <div class="step-line" :class="{ done: step > 1 }"></div>
          <div class="reg-step" :class="{ active: step >= 2, done: step > 2 }">
            <div class="step-circle">{{ step > 2 ? '✓' : '2' }}</div>
            <span>{{ lang==='kaz' ? 'Рөл & қажеттіліктер' : 'Роль & потребности' }}</span>
          </div>
          <div class="step-line" :class="{ done: step > 2 }"></div>
          <div class="reg-step" :class="{ active: step >= 3 }">
            <div class="step-circle">3</div>
            <span>{{ lang==='kaz' ? 'Қауіпсіздік' : 'Безопасность' }}</span>
          </div>
        </div>

        <form @submit.prevent="handleNext">

          <!-- ── Step 1: Personal info ── -->
          <div v-if="step === 1" class="form-step">
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">{{ lang==='kaz' ? 'Аты *' : 'Имя *' }}</label>
                <input v-model="form.firstName" type="text" class="form-input" :placeholder="lang==='kaz' ? 'Алуа' : 'Алуа'" required />
              </div>
              <div class="form-group">
                <label class="form-label">{{ lang==='kaz' ? 'Тегі *' : 'Фамилия *' }}</label>
                <input v-model="form.lastName" type="text" class="form-input" :placeholder="lang==='kaz' ? 'Нурлан' : 'Нурланова'" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input v-model="form.email" type="email" class="form-input" placeholder="example@mail.kz" required />
            </div>
            <div class="form-group">
              <label class="form-label">{{ lang==='kaz' ? 'Телефон (міндетті емес)' : 'Телефон (необязательно)' }}</label>
              <input v-model="form.phone" type="tel" class="form-input" placeholder="+7 701 123 4567" />
            </div>
          </div>

          <!-- ── Step 2: Role & disability ── -->
          <div v-else-if="step === 2" class="form-step">
            <div class="form-group">
              <label class="form-label">{{ lang==='kaz' ? 'Сіз кімсіз? *' : 'Кем вы являетесь? *' }}</label>
              <div class="role-cards">
                <button
                  type="button"
                  v-for="r in roles"
                  :key="r.value"
                  class="role-card"
                  :class="{ active: form.role === r.value }"
                  @click="form.role = r.value"
                >
                  <span class="role-icon">{{ r.icon }}</span>
                  <span class="role-name">{{ lang==='kaz' ? r.nameKaz : r.nameRus }}</span>
                  <span class="role-desc">{{ lang==='kaz' ? r.descKaz : r.descRus }}</span>
                </button>
              </div>
            </div>

            <!-- DisabilityType — only for USER -->
            <Transition name="fade">
              <div v-if="form.role === 'USER'" class="form-group">
                <label class="form-label">{{ lang==='kaz' ? 'Мүгедектік түрі (міндетті емес)' : 'Тип инвалидности (необязательно)' }}</label>
                <div class="disability-grid">
                  <button
                    type="button"
                    v-for="d in disabilityTypes"
                    :key="d.value"
                    class="disability-chip-btn"
                    :class="{ active: form.disabilityType === d.value }"
                    @click="form.disabilityType = form.disabilityType === d.value ? '' : d.value"
                  >
                    {{ d.icon }} {{ lang==='kaz' ? d.nameKaz : d.nameRus }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- ── Step 3: Security ── -->
          <div v-else-if="step === 3" class="form-step">
            <div class="form-group">
              <label class="form-label">{{ lang==='kaz' ? 'Құпия сөз *' : 'Пароль *' }}</label>
              <div class="input-password">
                <input v-model="form.password" :type="showPass?'text':'password'" class="form-input" placeholder="Минимум 8 символов" required />
                <button type="button" class="show-pass-btn" @click="showPass=!showPass">
                  <svg v-if="!showPass" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <!-- Password strength indicator -->
              <div class="pass-strength">
                <div class="pass-bar">
                  <div class="pass-bar-fill" :style="{ width: passStrength.pct + '%', background: passStrength.color }"></div>
                </div>
                <span class="pass-hint" :style="{ color: passStrength.color }">{{ passStrength.label }}</span>
              </div>
              <ul class="pass-rules">
                <li :class="{ ok: form.password.length >= 8 }">{{ lang==='kaz' ? '✓ Кем дегенде 8 символ' : '✓ Минимум 8 символов' }}</li>
                <li :class="{ ok: /[A-Z]/.test(form.password) }">{{ lang==='kaz' ? '✓ Бас әріп' : '✓ Заглавная буква' }}</li>
                <li :class="{ ok: /[0-9]/.test(form.password) }">{{ lang==='kaz' ? '✓ Цифр' : '✓ Цифра' }}</li>
              </ul>
            </div>
            <div class="form-group">
              <label class="form-label">{{ lang==='kaz' ? 'Құпия сөзді растау *' : 'Подтверждение пароля *' }}</label>
              <input v-model="form.confirmPassword" :type="showPass?'text':'password'" class="form-input" :class="{ 'input-error': form.confirmPassword && form.password !== form.confirmPassword }" placeholder="Повторите пароль" required />
              <span v-if="form.confirmPassword && form.password !== form.confirmPassword" class="field-error">{{ lang==='kaz' ? 'Құпия сөздер сәйкес емес' : 'Пароли не совпадают' }}</span>
            </div>
            <!-- Summary -->
            <div class="reg-summary">
              <div class="summary-row"><span>{{ lang==='kaz' ? 'Аты-жөні:' : 'Имя:' }}</span><strong>{{ form.firstName }} {{ form.lastName }}</strong></div>
              <div class="summary-row"><span>Email:</span><strong>{{ form.email }}</strong></div>
              <div class="summary-row"><span>{{ lang==='kaz' ? 'Рөл:' : 'Роль:' }}</span><strong>{{ roles.find(r=>r.value===form.role)?.[lang==='kaz'?'nameKaz':'nameRus'] }}</strong></div>
              <div v-if="form.disabilityType" class="summary-row"><span>{{ lang==='kaz' ? 'Мүгедектік:' : 'Инвалидность:' }}</span><strong>{{ disabilityTypes.find(d=>d.value===form.disabilityType)?.[lang==='kaz'?'nameKaz':'nameRus'] }}</strong></div>
            </div>
          </div>

          <Transition name="fade">
            <div v-if="error" class="auth-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {{ error }}
            </div>
          </Transition>

          <!-- Navigation buttons -->
          <div class="step-nav">
            <button v-if="step > 1" type="button" class="btn btn-outline" @click="step--">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              {{ lang==='kaz' ? 'Артқа' : 'Назад' }}
            </button>
            <button type="submit" class="btn btn-primary" :class="{ 'w-full': step === 1 }" :disabled="loading || (step===3 && form.password !== form.confirmPassword)">
              <span v-if="loading" class="spinner-sm"></span>
              <template v-else>
                {{ step < 3 ? (lang==='kaz' ? 'Келесі →' : 'Далее →') : (lang==='kaz' ? 'Тіркелу' : 'Зарегистрироваться') }}
              </template>
            </button>
          </div>
        </form>

        <div class="auth-footer">
          {{ lang==='kaz' ? 'Аккаунтыңыз бар ма?' : 'Уже есть аккаунт?' }}
          <RouterLink to="/login" class="auth-link">{{ lang==='kaz' ? 'Кіру' : 'Войти' }}</RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const router = useRouter()
const lang = computed(() => a11y.lang)

const step = ref(1)
const showPass = ref(false)
const error = ref('')
const loading = ref(false)

const form = ref({
  firstName: '', lastName: '', email: '', phone: '',
  role: 'USER', disabilityType: '',
  password: '', confirmPassword: ''
})

const roles = [
  { value: 'USER', icon: '♿', nameKaz: 'Мүгедектігі бар адам', nameRus: 'Человек с инвалидностью', descKaz: 'Негізгі пайдаланушы', descRus: 'Основной пользователь платформы' },
  { value: 'RELATIVE', icon: '👪', nameKaz: 'Жақын туыс / Қамқоршы', nameRus: 'Родственник / Опекун', descKaz: 'Опекаемыйға көмектеседі', descRus: 'Помогает подопечному' }
]

const disabilityTypes = [
  { value: 'WHEELCHAIR', icon: '♿', nameKaz: 'Арба', nameRus: 'Колясочник' },
  { value: 'VISUAL', icon: '👁', nameKaz: 'Көру', nameRus: 'Зрение' },
  { value: 'HEARING', icon: '👂', nameKaz: 'Есту', nameRus: 'Слух' },
  { value: 'MENTAL', icon: '🧠', nameKaz: 'Психикалық', nameRus: 'Ментальное' },
  { value: 'SPEECH', icon: '🗣', nameKaz: 'Сөйлеу', nameRus: 'Речь' },
  { value: 'MUSCULOSKELETAL', icon: '🦽', nameKaz: 'ОДА', nameRus: 'ОДА' },
  { value: 'OTHER', icon: '📋', nameKaz: 'Басқа', nameRus: 'Другое' }
]

const passStrength = computed(() => {
  const p = form.value.password
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const map = [
    { pct: 0, color: '#E5E7EB', label: '' },
    { pct: 25, color: '#EF4444', label: lang.value === 'kaz' ? 'Әлсіз' : 'Слабый' },
    { pct: 55, color: '#F59E0B', label: lang.value === 'kaz' ? 'Орташа' : 'Средний' },
    { pct: 80, color: '#22C55E', label: lang.value === 'kaz' ? 'Жақсы' : 'Хороший' },
    { pct: 100, color: '#16A34A', label: lang.value === 'kaz' ? 'Күшті' : 'Сильный' }
  ]
  return map[score]
})

const handleNext = async () => {
  error.value = ''
  if (step.value < 3) { step.value++; return }

  // Final submit
  if (form.value.password !== form.value.confirmPassword) {
    error.value = lang.value === 'kaz' ? 'Құпия сөздер сәйкес емес' : 'Пароли не совпадают'
    return
  }
  loading.value = true
  try {
    await authStore.register({
      email: form.value.email,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone,
      role: form.value.role,
      disabilityType: form.value.disabilityType || undefined
    })
    router.push('/profile')
  } catch (e) {
    error.value = e.message
    step.value = e.message.includes('email') ? 1 : step.value
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-bg { background: linear-gradient(135deg, #1e3a8a 0%, #0A1628 100%); display: flex; align-items: center; justify-content: center; min-height: calc(100vh - var(--header-h) - var(--navbar-h)); padding: 32px 16px; }
.auth-container { width: 100%; max-width: 500px; }
.auth-card { background: white; border-radius: var(--radius-xl); padding: 40px; box-shadow: 0 30px 80px rgba(0,0,0,0.3); }
.auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; font-size: var(--fs-md); font-weight: 800; color: var(--black); }
.auth-logo-icon { width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.auth-title { font-size: var(--fs-2xl); font-weight: 800; color: var(--black); margin-bottom: 6px; }
.auth-subtitle { color: var(--gray-500); font-size: var(--fs-sm); margin-bottom: 24px; }

/* Steps */
.reg-steps { display: flex; align-items: center; margin-bottom: 28px; }
.reg-step { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }
.step-circle { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--gray-300); display: flex; align-items: center; justify-content: center; font-size: var(--fs-xs); font-weight: 800; color: var(--gray-400); transition: all 0.3s; }
.reg-step.active .step-circle { border-color: var(--primary); color: var(--primary); background: var(--primary-pale); }
.reg-step.done .step-circle { border-color: #22C55E; color: white; background: #22C55E; }
.reg-step span:last-child { font-size: 10px; color: var(--gray-400); font-weight: 600; text-align: center; max-width: 70px; }
.reg-step.active span:last-child { color: var(--primary); }
.step-line { flex: 1; height: 2px; background: var(--gray-200); margin: 0 8px; margin-bottom: 14px; transition: background 0.3s; }
.step-line.done { background: #22C55E; }

/* Form step */
.form-step { display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 460px) { .form-row-2 { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: var(--fs-sm); font-weight: 600; color: var(--gray-700); }

/* Role cards */
.role-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.role-card { padding: 14px; border: 2px solid var(--gray-200); border-radius: var(--radius-md); text-align: center; cursor: pointer; transition: all var(--transition); display: flex; flex-direction: column; gap: 4px; align-items: center; background: white; }
.role-card:hover { border-color: var(--primary); background: var(--primary-pale); }
.role-card.active { border-color: var(--primary); background: var(--primary-pale); }
.role-icon { font-size: 24px; }
.role-name { font-size: var(--fs-xs); font-weight: 700; color: var(--black); }
.role-desc { font-size: 11px; color: var(--gray-400); }

/* Disability chips */
.disability-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.disability-chip-btn { padding: 7px 12px; border: 1.5px solid var(--gray-200); border-radius: var(--radius-full); font-size: var(--fs-xs); font-weight: 600; color: var(--gray-600); cursor: pointer; transition: all var(--transition); background: white; }
.disability-chip-btn:hover { border-color: var(--primary); color: var(--primary); }
.disability-chip-btn.active { background: var(--primary); color: white; border-color: var(--primary); }

/* Password */
.input-password { position: relative; }
.input-password .form-input { padding-right: 44px; }
.show-pass-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--gray-400); }
.pass-strength { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
.pass-bar { flex: 1; height: 4px; background: var(--gray-100); border-radius: 4px; overflow: hidden; }
.pass-bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s, background 0.3s; }
.pass-hint { font-size: var(--fs-xs); font-weight: 700; }
.pass-rules { list-style: none; display: flex; flex-direction: column; gap: 3px; }
.pass-rules li { font-size: var(--fs-xs); color: var(--gray-400); }
.pass-rules li.ok { color: #22C55E; }
.input-error { border-color: #EF4444 !important; }
.field-error { font-size: var(--fs-xs); color: #EF4444; }

/* Summary */
.reg-summary { background: var(--gray-50); border-radius: var(--radius-md); padding: 14px; display: flex; flex-direction: column; gap: 6px; }
.summary-row { display: flex; justify-content: space-between; font-size: var(--fs-xs); }
.summary-row span { color: var(--gray-500); }
.summary-row strong { color: var(--black); }

/* Step nav */
.step-nav { display: flex; gap: 10px; margin-top: 4px; }
.step-nav .btn { flex: 1; justify-content: center; }
.w-full { width: 100%; justify-content: center; }

/* Error */
.auth-error { display: flex; align-items: center; gap: 8px; background: #FEF2F2; color: #B91C1C; padding: 10px 14px; border-radius: var(--radius-sm); font-size: var(--fs-sm); }
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.auth-footer { text-align: center; font-size: var(--fs-sm); color: var(--gray-500); margin-top: 20px; }
.auth-link { color: var(--primary); font-weight: 700; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
