<template>
  <Transition name="slide">
    <div v-if="open" class="a11y-panel" role="dialog" aria-label="Настройки доступности">
      <div class="a11y-header">
        <h3 class="a11y-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/>
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
          </svg>
          {{ t('accessPanel') }}
        </h3>
        <button class="a11y-close" @click="$emit('close')" aria-label="Закрыть">✕</button>
      </div>

      <!-- High Contrast -->
      <div class="a11y-section">
        <div class="a11y-toggle-row">
          <div class="a11y-toggle-info">
            <div class="a11y-toggle-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              {{ t('highContrast') }}
            </div>
            <div class="a11y-toggle-hint">Черно-белый режим</div>
          </div>
          <button
            class="toggle-switch"
            :class="{ active: a11y.highContrast }"
            @click="a11y.toggleContrast()"
            role="switch"
            :aria-checked="a11y.highContrast"
          >
            <span class="toggle-knob"></span>
          </button>
        </div>
      </div>

      <!-- Font Size -->
      <div class="a11y-section">
        <div class="a11y-section-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
          Размер шрифта
        </div>
        <div class="font-size-buttons">
          <button
            class="font-btn"
            :class="{ active: a11y.fontSize === 'small' }"
            @click="a11y.setFontSize('small')"
            style="font-size:12px"
          >{{ t('fontSmall') }}</button>
          <button
            class="font-btn"
            :class="{ active: a11y.fontSize === 'medium' }"
            @click="a11y.setFontSize('medium')"
            style="font-size:15px"
          >{{ t('fontMedium') }}</button>
          <button
            class="font-btn"
            :class="{ active: a11y.fontSize === 'large' }"
            @click="a11y.setFontSize('large')"
            style="font-size:19px"
          >{{ t('fontLarge') }}</button>
        </div>
      </div>

      <!-- TTS -->
      <div class="a11y-section">
        <div class="a11y-section-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          Голосовое чтение
        </div>
        <div class="tts-controls">
          <button class="btn btn-outline btn-sm" @click="speakPageContent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            {{ t('voiceRead') }}
          </button>
          <button class="btn btn-ghost btn-sm" @click="a11y.stopSpeaking()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            {{ t('stopVoice') }}
          </button>
        </div>
      </div>

      <!-- Keyboard hint -->
      <div class="a11y-section a11y-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/></svg>
        Навигация с клавиатуры: Tab / Enter / Esc
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'

defineProps({ open: Boolean })
defineEmits(['close'])

const a11y = useAccessibilityStore()
const t = computed(() => useI18n(a11y.lang))

const speakPageContent = () => {
  const mainContent = document.querySelector('main')?.innerText?.slice(0, 500) || 'Добро пожаловать на платформу SenimdiQAdam'
  a11y.speak(mainContent)
}
</script>

<style scoped>
.a11y-panel {
  position: fixed;
  top: calc(var(--header-h) + var(--navbar-h) + 12px);
  right: 16px;
  width: 300px;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
  z-index: 700;
  overflow: hidden;
}
.a11y-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--primary);
  color: white;
}
.a11y-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-md);
  font-weight: 700;
  color: white;
}
.a11y-close {
  color: rgba(255,255,255,0.8);
  font-size: 18px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all var(--transition);
}
.a11y-close:hover { background: rgba(255,255,255,0.2); color: white; }
.a11y-section {
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-100);
}
.a11y-section:last-child { border-bottom: none; }
.a11y-section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 12px;
}

/* Toggle */
.a11y-toggle-row { display: flex; justify-content: space-between; align-items: center; }
.a11y-toggle-info {}
.a11y-toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--gray-700);
}
.a11y-toggle-hint { font-size: var(--fs-xs); color: var(--gray-500); margin-top: 2px; }
.toggle-switch {
  width: 44px; height: 24px;
  background: var(--gray-300);
  border-radius: var(--radius-full);
  position: relative;
  transition: background var(--transition);
  flex-shrink: 0;
}
.toggle-switch.active { background: var(--primary); }
.toggle-knob {
  position: absolute;
  top: 2px; left: 2px;
  width: 20px; height: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform var(--transition);
}
.toggle-switch.active .toggle-knob { transform: translateX(20px); }

/* Font buttons */
.font-size-buttons { display: flex; gap: 8px; }
.font-btn {
  flex: 1;
  padding: 8px;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-weight: 600;
  color: var(--gray-700);
  transition: all var(--transition);
  background: var(--gray-50);
}
.font-btn:hover { border-color: var(--primary); color: var(--primary); }
.font-btn.active { border-color: var(--primary); background: var(--primary-pale); color: var(--primary); }

/* TTS */
.tts-controls { display: flex; gap: 8px; }

/* Hint */
.a11y-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-xs);
  color: var(--gray-500);
  background: var(--gray-50);
}

/* Transition */
.slide-enter-from { opacity: 0; transform: translateX(20px); }
.slide-enter-active { transition: all 0.2s ease; }
.slide-leave-to { opacity: 0; transform: translateX(20px); }
.slide-leave-active { transition: all 0.15s ease; }
</style>
