<template>
  <main class="page-content">
    <div class="community-page-header">
      <div class="container">
        <h1 class="page-h1">{{ t('community') }}</h1>
        <p class="page-desc">Социальные сети и группы Алматы — поддержка и общение для людей с инвалидностью</p>
      </div>
    </div>
    <div class="container community-content">
      <div class="community-grid">
        <a
          v-for="group in groups"
          :key="group.id"
          :href="group.url"
          target="_blank"
          rel="noopener"
          class="community-card"
          :class="`platform-${group.platform}`"
        >
          <div class="community-icon">
            <span v-if="group.platform === 'telegram'">✈️</span>
            <span v-else-if="group.platform === 'instagram'">📸</span>
            <span v-else-if="group.platform === 'whatsapp'">💬</span>
          </div>
          <div class="community-info">
            <h3 class="community-name">{{ a11y.lang === 'kaz' ? group.nameKaz : group.name }}</h3>
            <p class="community-desc">{{ a11y.lang === 'kaz' ? group.descriptionKaz : group.description }}</p>
            <div class="community-meta">
              <span class="community-platform">{{ group.platform }}</span>
              <span class="community-members">👥 {{ group.members.toLocaleString() }}</span>
            </div>
          </div>
          <div class="community-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </a>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'
import communityData from '../mock/community.json'

const a11y = useAccessibilityStore()
const t = computed(() => useI18n(a11y.lang))
const groups = ref(communityData)
</script>

<style scoped>
.community-page-header { background: linear-gradient(135deg, var(--dark) 0%, #1a1f3a 100%); padding: 48px 0 40px; margin-bottom: 32px; }
.page-h1 { font-size: var(--fs-3xl); font-weight: 800; color: white; margin-bottom: 8px; }
.page-desc { color: rgba(255,255,255,0.7); font-size: var(--fs-md); }
.community-content { padding-bottom: 64px; }
.community-grid { display: flex; flex-direction: column; gap: 16px; max-width: 680px; }
.community-card {
  display: flex; align-items: center; gap: 20px;
  background: white; border-radius: var(--radius-lg);
  padding: 20px 24px; box-shadow: var(--shadow);
  text-decoration: none; color: inherit;
  transition: all var(--transition);
  border-left: 4px solid var(--gray-200);
}
.community-card:hover { box-shadow: var(--shadow-lg); transform: translateX(4px); }
.platform-telegram { border-left-color: #229ED9; }
.platform-instagram { border-left-color: #E1306C; }
.platform-whatsapp { border-left-color: #25D366; }
.community-icon { font-size: 36px; flex-shrink: 0; }
.community-info { flex: 1; }
.community-name { font-size: var(--fs-md); font-weight: 700; color: var(--black); margin-bottom: 4px; }
.community-desc { font-size: var(--fs-sm); color: var(--gray-500); line-height: 1.5; margin-bottom: 8px; }
.community-meta { display: flex; gap: 14px; font-size: var(--fs-xs); font-weight: 600; }
.community-platform { text-transform: capitalize; color: var(--primary); }
.community-members { color: var(--gray-500); }
.community-arrow { color: var(--gray-300); flex-shrink: 0; }
.community-card:hover .community-arrow { color: var(--primary); }
</style>
