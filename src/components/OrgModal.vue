<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="org" class="modal-overlay" @click.self="$emit('close')" role="dialog" aria-modal="true">
        <div class="modal-box org-modal">
          <button class="modal-close-btn" @click="$emit('close')" aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div class="org-modal-header">
            <div class="org-modal-avatar">{{ org.name.charAt(0) }}</div>
            <div>
              <h2 class="org-modal-name">{{ lang === 'kaz' ? org.nameKaz : org.nameRus }}</h2>
              <div class="org-modal-badges">
                <span v-if="org.verified" class="badge badge-verified">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ t('verified') }}
                  <span v-if="org.verifiedDate" style="opacity:0.7;margin-left:4px">{{ org.verifiedDate }}</span>
                </span>
                <span v-else class="badge badge-unverified">{{ t('notVerified') }}</span>
                <span class="badge badge-category">{{ lang === 'kaz' ? org.categoryLabel?.kaz : org.categoryLabel?.rus }}</span>
                <span class="badge badge-primary">{{ org.district }}</span>
              </div>
            </div>
          </div>

          <p class="org-modal-desc">{{ lang === 'kaz' ? org.descriptionKaz : org.description }}</p>

          <div class="org-modal-info">
            <div class="org-info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div><div class="info-label">Адрес</div><div>{{ org.address }}</div></div>
            </div>
            <div v-if="org.phone" class="org-info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.8-.8a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div><div class="info-label">Телефон</div><a :href="`tel:${org.phone}`" class="info-link">{{ org.phone }}</a></div>
            </div>
            <div v-if="org.email" class="org-info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <div><div class="info-label">Email</div><a :href="`mailto:${org.email}`" class="info-link">{{ org.email }}</a></div>
            </div>
            <div v-if="org.hours" class="org-info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div><div class="info-label">Часы работы</div><div>{{ org.hours }}</div></div>
            </div>
            <div v-if="org.website" class="org-info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <div><div class="info-label">Сайт</div><a :href="org.website" target="_blank" rel="noopener" class="info-link">{{ org.website }}</a></div>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="org.tags?.length" class="org-modal-tags">
            <span v-for="tag in org.tags" :key="tag" class="org-tag">#{{ tag }}</span>
          </div>

          <!-- Rating -->
          <div class="org-modal-rating">
            <span v-for="i in 5" :key="i">
              <svg width="16" height="16" viewBox="0 0 24 24" :fill="i <= Math.round(org.rating) ? '#F59E0B' : 'none'" stroke="#F59E0B" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </span>
            <strong>{{ org.rating }}</strong> / 5.0
          </div>

          <!-- Actions -->
          <div class="org-modal-actions">
            <a v-if="org.phone" :href="`tel:${org.phone}`" class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.8-.8a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Позвонить
            </a>
            <a v-if="org.website" :href="org.website" target="_blank" rel="noopener" class="btn btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Сайт
            </a>
            <button
              v-if="authStore.isAuthenticated"
              class="btn btn-outline"
              :class="{ 'btn-primary': authStore.isOrgSaved(org.id) }"
              @click="authStore.toggleSaveOrg(org.id)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" :fill="authStore.isOrgSaved(org.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {{ authStore.isOrgSaved(org.id) ? t('saved') : t('save') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'

defineProps({ org: Object })
defineEmits(['close'])

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const lang = computed(() => a11y.lang)
const t = computed(() => useI18n(lang.value))
</script>

<style scoped>
.org-modal { max-width: 600px; position: relative; }
.modal-close-btn {
  position: absolute; top: 16px; right: 16px;
  color: var(--gray-500); padding: 6px;
  border-radius: 8px; transition: all var(--transition);
}
.modal-close-btn:hover { background: var(--gray-100); color: var(--gray-900); }
.org-modal-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px; }
.org-modal-avatar {
  width: 60px; height: 60px;
  background: var(--primary);
  border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--fs-2xl); font-weight: 800; color: white;
  flex-shrink: 0;
}
.org-modal-name { font-size: var(--fs-lg); font-weight: 700; color: var(--black); margin-bottom: 8px; }
.org-modal-badges { display: flex; flex-wrap: wrap; gap: 6px; }
.org-modal-desc { color: var(--gray-700); font-size: var(--fs-sm); line-height: 1.7; margin-bottom: 20px; }
.org-modal-info { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.org-info-row {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px;
  background: var(--gray-50);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
}
.org-info-row svg { flex-shrink: 0; color: var(--primary); margin-top: 2px; }
.info-label { font-size: var(--fs-xs); color: var(--gray-500); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
.info-link { color: var(--primary); text-decoration: none; }
.info-link:hover { text-decoration: underline; }
.org-modal-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.org-tag { font-size: var(--fs-xs); color: var(--primary); background: var(--primary-pale); padding: 3px 10px; border-radius: var(--radius-full); font-weight: 600; }
.org-modal-rating { display: flex; align-items: center; gap: 4px; font-size: var(--fs-sm); color: var(--gray-600, #4B5563); margin-bottom: 20px; }
.org-modal-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
</style>
