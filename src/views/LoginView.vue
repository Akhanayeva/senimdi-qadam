<template>
  <main class="page-content auth-bg">
    <div class="auth-container">

      <!-- Forgot password modal -->
      <Transition name="fade">
        <div v-if="showForgot" class="forgot-overlay" @click.self="showForgot=false">
          <div class="forgot-card">
            <button class="forgot-close" @click="showForgot=false">✕</button>
            <h3>{{ lang==='kaz' ? 'Құпия сөзді ұмыттыңыз ба?' : 'Забыли пароль?' }}</h3>
            <p>{{ lang==='kaz' ? 'Email енгізіңіз, кодты жіберміз.' : 'Введите email — отправим код для сброса.' }}</p>
            <div v-if="!forgotSent">
              <input v-model="forgotEmail" type="email" class="form-input" placeholder="example@mail.kz" />
              <button class="btn btn-primary w-full mt-3" :disabled="forgotLoading" @click="handleForgot">
                <span v-if="forgotLoading" class="spinner-sm"></span>
                {{ forgotLoading ? '...' : (lang==='kaz' ? 'Жіберу' : 'Отправить') }}
              </button>
            </div>
            <div v-else class="forgot-success">
              ✅ {{ lang==='kaz' ? 'Нұсқаулары бар хат жіберілді' : 'Письмо с инструкциями отправлено' }}
            </div>
          </div>
        </div>
      </Transition>

      <div class="auth-card">
        <!-- Logo -->
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

        <h1 class="auth-title">{{ lang==='kaz' ? 'Жүйеге кіру' : 'Вход в аккаунт' }}</h1>
        <p class="auth-subtitle">{{ lang==='kaz' ? 'Барлық мүмкіндіктерді пайдалану үшін кіріңіз' : 'Войдите, чтобы сохранять организации и использовать все функции' }}</p>

        <!-- Google OAuth hint -->
        <button class="btn-google" disabled>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          {{ lang==='kaz' ? 'Google арқылы кіру' : 'Войти через Google' }}
          <span class="coming-soon-tag">{{ lang==='kaz' ? 'Жақында' : 'Скоро' }}</span>
        </button>

        <div class="auth-divider"><span>{{ lang==='kaz' ? 'немесе email арқылы' : 'или через email' }}</span></div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="email" type="email" class="form-input" placeholder="example@email.com" required autocomplete="email" />
          </div>
          <div class="form-group">
            <label class="form-label">
              {{ lang==='kaz' ? 'Құпия сөз' : 'Пароль' }}
              <button type="button" class="forgot-link" @click="showForgot=true">
                {{ lang==='kaz' ? 'Ұмыттыңыз ба?' : 'Забыли?' }}
              </button>
            </label>
            <div class="input-password">
              <input v-model="password" :type="showPass?'text':'password'" class="form-input" placeholder="••••••••" required autocomplete="current-password" />
              <button type="button" class="show-pass-btn" @click="showPass=!showPass">
                <svg v-if="!showPass" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <!-- Demo hints -->
          <div class="auth-demo-hints">
            <div class="demo-hint-title">{{ lang==='kaz' ? 'Демо аккаунттар:' : 'Демо-аккаунты:' }}</div>
            <div class="demo-hints-grid">
              <button type="button" class="demo-hint" @click="fillDemo('admin@senimdi.kz','admin123')">🔑 {{ lang==='kaz' ? 'Әкімші' : 'Администратор' }}</button>
              <button type="button" class="demo-hint" @click="fillDemo('user@senimdi.kz','User1234')">👤 {{ lang==='kaz' ? 'Пайдаланушы' : 'Пользователь' }}</button>
              <button type="button" class="demo-hint" @click="fillDemo('mod@senimdi.kz','Mod12345')">🛡 {{ lang==='kaz' ? 'Модератор' : 'Модератор' }}</button>
              <button type="button" class="demo-hint" @click="fillDemo('manager@senimdi.kz','Manager1')">🚕 {{ lang==='kaz' ? 'Менеджер' : 'Менеджер' }}</button>
            </div>
          </div>

          <Transition name="fade">
            <div v-if="error" class="auth-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {{ error }}
            </div>
          </Transition>

          <button type="submit" class="btn btn-primary btn-lg w-full" :disabled="loading">
            <span v-if="loading" class="spinner-sm"></span>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            {{ loading ? (lang==='kaz' ? 'Кіру...' : 'Входим...') : (lang==='kaz' ? 'Кіру' : 'Войти') }}
          </button>
        </form>

        <div class="auth-footer">
          {{ lang==='kaz' ? 'Аккаунтыңыз жоқ па?' : 'Нет аккаунта?' }}
          <RouterLink to="/register" class="auth-link">{{ lang==='kaz' ? 'Тіркелу' : 'Зарегистрироваться' }}</RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { forgotPassword } from '../api/auth.js'
import { saveTokens } from '../api/apiClient.js'

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const router = useRouter()
const route = useRoute()
const lang = computed(() => a11y.lang)

const email = ref(''), password = ref(''), error = ref(''), loading = ref(false), showPass = ref(false)

// Forgot password
const showForgot = ref(false)
const forgotEmail = ref('')
const forgotLoading = ref(false)
const forgotSent = ref(false)

const fillDemo = (e, p) => { email.value = e; password.value = p }

const handleLogin = async () => {
  loading.value = true; error.value = ''
  try {
    await authStore.login(email.value, password.value)
    router.push('/profile')
  } catch (e) { error.value = e.message }
  finally { loading.value = false }
}

const handleForgot = async () => {
  if (!forgotEmail.value) return
  forgotLoading.value = true
  try {
    await forgotPassword(forgotEmail.value)
    forgotSent.value = true
  } finally {
    forgotLoading.value = false
  }
}

// ── Google OAuth callback (/auth/callback?accessToken=...&refreshToken=...) ──
// Real API redirects here after Google OAuth with tokens as query params.
// Mock: if tokens are present in URL, store them and redirect to profile.
onMounted(async () => {
  if (route.name === 'auth-callback') {
    const { accessToken, refreshToken } = route.query
    if (accessToken && refreshToken) {
      saveTokens(accessToken, refreshToken)
      // Load user profile using the token (real API: GET /api/core/auth/me)
      try {
        await authStore.loginWithTokens(accessToken, refreshToken)
        router.replace('/profile')
      } catch {
        // Token invalid — show normal login page
        error.value = lang.value === 'kaz' ? 'OAuth кіру қатесі' : 'Ошибка OAuth авторизации'
      }
    } else if (route.query.error) {
      // OAuth provider returned an error
      error.value = lang.value === 'kaz'
        ? 'Google арқылы кіру мүмкін болмады'
        : 'Не удалось войти через Google'
    }
  }
})
</script>

<style scoped>
.auth-bg { background: linear-gradient(135deg, #1e3a8a 0%, #0A1628 100%); display: flex; align-items: center; justify-content: center; min-height: calc(100vh - var(--header-h) - var(--navbar-h)); padding: 32px 16px; }
.auth-container { width: 100%; max-width: 460px; }
.auth-card { background: white; border-radius: var(--radius-xl); padding: 40px; box-shadow: 0 30px 80px rgba(0,0,0,0.3); }
.auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; font-size: var(--fs-md); font-weight: 800; color: var(--black); }
.auth-logo-icon { width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.auth-title { font-size: var(--fs-2xl); font-weight: 800; color: var(--black); margin-bottom: 6px; }
.auth-subtitle { color: var(--gray-500); font-size: var(--fs-sm); margin-bottom: 24px; line-height: 1.5; }

/* Google btn */
.btn-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 11px 16px; border: 1.5px solid var(--gray-200); border-radius: var(--radius-md); font-size: var(--fs-sm); font-weight: 600; color: var(--gray-600); background: white; cursor: not-allowed; opacity: 0.7; margin-bottom: 4px; }
.coming-soon-tag { background: var(--gray-100); color: var(--gray-400); font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: var(--radius-full); }
.auth-divider { display: flex; align-items: center; gap: 12px; margin: 14px 0 20px; color: var(--gray-400); font-size: var(--fs-xs); }
.auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--gray-200); }

/* Form */
.auth-form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { display: flex; justify-content: space-between; align-items: center; font-size: var(--fs-sm); font-weight: 600; color: var(--gray-700); }
.forgot-link { font-size: var(--fs-xs); color: var(--primary); font-weight: 600; cursor: pointer; }
.input-password { position: relative; }
.input-password .form-input { padding-right: 44px; }
.show-pass-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--gray-400); }

/* Demo */
.auth-demo-hints { background: var(--gray-50); border-radius: var(--radius-md); padding: 12px 14px; }
.demo-hint-title { font-size: var(--fs-xs); font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.demo-hints-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.demo-hint { padding: 8px; background: white; border: 1.5px solid var(--gray-200); border-radius: var(--radius-sm); font-size: var(--fs-xs); font-weight: 600; color: var(--gray-700); transition: all var(--transition); text-align: center; cursor: pointer; }
.demo-hint:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-pale); }
.auth-error { display: flex; align-items: center; gap: 8px; background: #FEF2F2; color: #B91C1C; padding: 10px 14px; border-radius: var(--radius-sm); font-size: var(--fs-sm); }
.w-full { width: 100%; justify-content: center; gap: 8px; }
.mt-3 { margin-top: 12px; }
.auth-footer { text-align: center; font-size: var(--fs-sm); color: var(--gray-500); margin-top: 20px; }
.auth-link { color: var(--primary); font-weight: 700; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }

/* Spinner */
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Forgot modal */
.forgot-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 16px; }
.forgot-card { background: white; border-radius: var(--radius-xl); padding: 32px; max-width: 400px; width: 100%; box-shadow: var(--shadow-lg); position: relative; }
.forgot-close { position: absolute; top: 14px; right: 14px; color: var(--gray-400); font-size: 18px; cursor: pointer; }
.forgot-card h3 { font-size: var(--fs-lg); font-weight: 800; margin-bottom: 8px; }
.forgot-card p { font-size: var(--fs-sm); color: var(--gray-500); margin-bottom: 16px; }
.forgot-success { background: #DCFCE7; color: #166534; padding: 12px; border-radius: var(--radius-md); font-size: var(--fs-sm); font-weight: 600; text-align: center; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
