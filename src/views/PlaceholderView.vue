<template>
  <main class="page-content">
    <div class="placeholder-page">
      <div class="placeholder-content">
        <div class="placeholder-icon">{{ icon }}</div>
        <h1 class="placeholder-title">{{ title }}</h1>
        <p class="placeholder-desc">{{ t('underDev') }}</p>
        <div class="placeholder-badge">{{ t('inDev') }}</div>
        <RouterLink to="/" class="btn btn-primary mt-8">{{ t('backHome') }}</RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'

const a11y = useAccessibilityStore()
const t = computed(() => useI18n(a11y.lang))

defineProps({
  title: { type: String, default: 'Раздел' },
  icon: { type: String, default: '📄' }
})
</script>

<style scoped>
.placeholder-page { min-height: calc(100vh - var(--header-h) - var(--navbar-h) - 80px); display: flex; align-items: center; justify-content: center; }
.placeholder-content { text-align: center; max-width: 480px; padding: 48px 24px; }
.placeholder-icon { font-size: 64px; margin-bottom: 24px; }
.placeholder-title { font-size: var(--fs-3xl); font-weight: 800; color: var(--black); margin-bottom: 12px; }
.placeholder-desc { font-size: var(--fs-md); color: var(--gray-500); line-height: 1.6; margin-bottom: 20px; }
.placeholder-badge { display: inline-flex; align-items: center; gap: 6px; background: #FEF3C7; color: #92400E; padding: 8px 20px; border-radius: var(--radius-full); font-size: var(--fs-sm); font-weight: 700; }
</style>
