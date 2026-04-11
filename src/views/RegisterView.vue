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
        <h1 class="auth-title">{{ t('registerTitle') }}</h1>
        <p class="auth-subtitle">Создайте аккаунт для сохранения избранного и доступа ко всем функциям</p>
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label class="form-label">{{ t('nameLabel') }}</label>
            <input v-model="name" type="text" class="form-input" placeholder="Ваше имя" required />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('emailLabel') }}</label>
            <input v-model="email" type="email" class="form-input" placeholder="example@email.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('passwordLabel') }}</label>
            <input v-model="password" type="password" class="form-input" placeholder="Минимум 6 символов" required minlength="6" />
          </div>
          <div v-if="error" class="auth-error">⚠️ {{ error }}</div>
          <button type="submit" class="btn btn-primary w-full" :disabled="loading">
            <span v-if="loading" class="spinner" style="width:16px;height:16px;border-width:2px"></span>
            {{ loading ? 'Регистрация...' : t('registerBtn') }}
          </button>
        </form>
        <div class="auth-footer">
          {{ t('haveAccount') }}
          <RouterLink to="/login" class="auth-link">{{ t('login') }}</RouterLink>
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

const name = ref(''), email = ref(''), password = ref(''), error = ref(''), loading = ref(false)

const handleRegister = async () => {
  loading.value = true; error.value = ''
  try {
    await authStore.register(name.value, email.value, password.value)
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
.auth-error { background: #FEF2F2; color: #B91C1C; padding: 10px 14px; border-radius: var(--radius-sm); font-size: var(--fs-sm); margin-bottom: 8px; }
.auth-footer { text-align: center; font-size: var(--fs-sm); color: var(--gray-500); margin-top: 20px; }
.auth-link { color: var(--primary); font-weight: 700; }
.auth-link:hover { text-decoration: underline; }
</style>
