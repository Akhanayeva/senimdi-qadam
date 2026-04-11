<template>
  <main class="page-content auth-bg">
    <div class="auth-container">
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

        <h1 class="auth-title">{{ t('loginTitle') }}</h1>
        <p class="auth-subtitle">Войдите, чтобы сохранять организации и использовать все функции</p>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label class="form-label">{{ t('emailLabel') }}</label>
            <input
              v-model="email"
              type="email"
              class="form-input"
              :placeholder="`example@email.com`"
              required
              autocomplete="email"
            />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('passwordLabel') }}</label>
            <div class="input-password">
              <input
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                class="form-input"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
              <button type="button" class="show-pass-btn" @click="showPass = !showPass">
                <svg v-if="!showPass" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <!-- Demo hints -->
          <div class="auth-demo-hints">
            <div class="demo-hint-title">Демо-аккаунты:</div>
            <div class="demo-hints-grid">
              <button type="button" class="demo-hint" @click="fillDemo('admin@senimdi.kz', 'admin123')">
                🔑 Администратор
              </button>
              <button type="button" class="demo-hint" @click="fillDemo('user@senimdi.kz', 'user123')">
                👤 Пользователь
              </button>
            </div>
          </div>

          <div v-if="error" class="auth-error">⚠️ {{ error }}</div>

          <button type="submit" class="btn btn-primary w-full" :disabled="loading">
            <span v-if="loading" class="spinner" style="width:16px;height:16px;border-width:2px"></span>
            {{ loading ? 'Вход...' : t('loginBtn') }}
          </button>
        </form>

        <div class="auth-footer">
          {{ t('noAccount') }}
          <RouterLink to="/register" class="auth-link">{{ t('register') }}</RouterLink>
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
import { useI18n } from '../i18n.js'

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const router = useRouter()
const t = computed(() => useI18n(a11y.lang))

const email = ref(''), password = ref(''), error = ref(''), loading = ref(false), showPass = ref(false)

const fillDemo = (e, p) => { email.value = e; password.value = p }

const handleLogin = async () => {
  loading.value = true; error.value = ''
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (e) { error.value = e.message }
  finally { loading.value = false }
}
</script>

<style scoped>
.auth-bg { background: linear-gradient(135deg, var(--primary) 0%, var(--dark) 100%); display: flex; align-items: center; justify-content: center; min-height: calc(100vh - var(--header-h) - var(--navbar-h)); }
.auth-container { width: 100%; max-width: 440px; padding: 24px; }
.auth-card { background: white; border-radius: var(--radius-xl); padding: 40px; box-shadow: 0 24px 64px rgba(0,0,0,0.25); }
.auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; font-size: var(--fs-md); font-weight: 800; color: var(--black); }
.auth-logo-icon { width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.auth-title { font-size: var(--fs-2xl); font-weight: 800; color: var(--black); margin-bottom: 8px; }
.auth-subtitle { color: var(--gray-500); font-size: var(--fs-sm); margin-bottom: 28px; }
.auth-form { display: flex; flex-direction: column; gap: 4px; }
.input-password { position: relative; }
.input-password .form-input { padding-right: 44px; }
.show-pass-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--gray-400, #9CA3AF); }
.auth-demo-hints { background: var(--gray-50); border-radius: var(--radius); padding: 12px 14px; margin: 12px 0; }
.demo-hint-title { font-size: var(--fs-xs); font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.demo-hints-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.demo-hint { padding: 8px; background: white; border: 1.5px solid var(--gray-200); border-radius: var(--radius-sm); font-size: var(--fs-xs); font-weight: 600; color: var(--gray-700); transition: all var(--transition); text-align: center; }
.demo-hint:hover { border-color: var(--primary); color: var(--primary); }
.auth-error { background: #FEF2F2; color: #B91C1C; padding: 10px 14px; border-radius: var(--radius-sm); font-size: var(--fs-sm); margin-bottom: 8px; }
.auth-footer { text-align: center; font-size: var(--fs-sm); color: var(--gray-500); margin-top: 20px; }
.auth-link { color: var(--primary); font-weight: 700; }
.auth-link:hover { text-decoration: underline; }
</style>
