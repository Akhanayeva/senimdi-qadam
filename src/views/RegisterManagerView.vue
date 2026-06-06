<template>
  <main class="page-content auth-bg">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="auth-logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="rgba(255,255,255,0.2)"/>
              <rect x="1" y="3" width="15" height="13" rx="2" fill="white" fill-opacity="0.9"/>
              <path d="M16 8h4l3 3v5h-7V8z" fill="white" fill-opacity="0.7"/>
              <circle cx="5.5" cy="18.5" r="2.5" fill="white"/>
              <circle cx="18.5" cy="18.5" r="2.5" fill="white"/>
            </svg>
          </div>
          <span>ИнваТакси — Диспетчер</span>
        </div>

        <h1 class="auth-title">Регистрация менеджера</h1>
        <p class="auth-subtitle">Введите ваш пригласительный код и данные для входа</p>

        <div v-if="success" class="success-screen">
          <div class="success-icon">✅</div>
          <h2>Аккаунт создан!</h2>
          <p>Вы зарегистрированы как менеджер ИнваТакси. Переходим в панель управления...</p>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="form-step">
          <div class="form-group">
            <label class="form-label">Пригласительный код *</label>
            <input
              v-model="form.inviteCode"
              type="text"
              class="form-input invite-input"
              placeholder="XXXX-XXXX"
              required
              autocomplete="off"
            />
            <div class="form-hint">Получите код у администратора системы</div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Имя *</label>
              <input v-model="form.firstName" type="text" class="form-input" placeholder="Канат" required />
            </div>
            <div class="form-group">
              <label class="form-label">Фамилия *</label>
              <input v-model="form.lastName" type="text" class="form-input" placeholder="Бекенов" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Телефон *</label>
            <input v-model="form.phone" type="tel" class="form-input" placeholder="+7 701 123 4567" required />
          </div>

          <div class="form-group">
            <label class="form-label">Email *</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="manager@example.kz" required />
          </div>

          <div class="form-group">
            <label class="form-label">Пароль *</label>
            <div class="input-password">
              <input
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                class="form-input"
                placeholder="Минимум 8 символов"
                required
              />
              <button type="button" class="show-pass-btn" @click="showPass = !showPass">
                <svg v-if="!showPass" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="reg-error">{{ error }}</div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <span v-if="loading" class="spinner-sm-white"></span>
            {{ loading ? 'Регистрация...' : 'Создать аккаунт' }}
          </button>

          <div class="auth-links">
            <RouterLink to="/login" class="auth-link">Уже есть аккаунт? Войти</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { registerManager } from '../api/taxi.js'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const showPass = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const form = ref({
  inviteCode: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
})

const handleSubmit = async () => {
  error.value = ''
  if (form.value.password.length < 8) {
    error.value = 'Пароль должен быть не менее 8 символов'
    return
  }
  loading.value = true
  try {
    const data = await registerManager({
      inviteCode: form.value.inviteCode.trim(),
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      phone: form.value.phone.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
    })
    // Store tokens if backend returns them
    if (data.accessToken) {
      await authStore.loginWithTokens(data.accessToken, data.refreshToken)
    }
    success.value = true
    setTimeout(() => router.push('/admin/taxi'), 1500)
  } catch (e) {
    error.value = e.message || 'Ошибка регистрации. Проверьте код приглашения.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}
.auth-container { width: 100%; max-width: 460px; }
.auth-card {
  background: white;
  border-radius: 20px;
  padding: 40px 36px;
  box-shadow: 0 25px 80px rgba(0,0,0,0.3);
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  font-weight: 700;
  font-size: 15px;
  color: #1e293b;
}
.auth-logo-icon {
  width: 42px; height: 42px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.auth-title { font-size: 24px; font-weight: 800; color: #1e293b; margin-bottom: 6px; }
.auth-subtitle { font-size: 14px; color: #64748b; margin-bottom: 28px; }

.form-step { display: flex; flex-direction: column; gap: 16px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.form-input {
  padding: 11px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
}
.form-input:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
.invite-input { font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700; letter-spacing: 2px; }
.form-hint { font-size: 12px; color: #94a3b8; }
.input-password { position: relative; }
.input-password .form-input { padding-right: 44px; }
.show-pass-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; padding: 4px; }

.reg-error { color: #dc2626; font-size: 13px; background: #fef2f2; padding: 10px 14px; border-radius: 8px; }

.btn-primary {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;
}
.btn-primary:hover:not(:disabled) { background: #d97706; }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-block { width: 100%; }
.auth-links { text-align: center; margin-top: 4px; }
.auth-link { font-size: 13px; color: #64748b; text-decoration: none; }
.auth-link:hover { color: #f59e0b; }

.success-screen { text-align: center; padding: 20px 0; }
.success-icon { font-size: 48px; margin-bottom: 16px; }
.success-screen h2 { font-size: 20px; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
.success-screen p { font-size: 14px; color: #64748b; }

.spinner-sm-white {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
