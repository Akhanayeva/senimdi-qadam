<template>
  <div class="toast-region" role="status" aria-live="polite" aria-atomic="false">
    <TransitionGroup name="toast">
      <div
        v-for="t in toast.items"
        :key="t.id"
        class="toast"
        :class="`toast--${t.type}`"
        @click="toast.dismiss(t.id)"
      >
        <span class="toast-icon" aria-hidden="true">
          <template v-if="t.type === 'success'">✓</template>
          <template v-else-if="t.type === 'error'">✕</template>
          <template v-else-if="t.type === 'warning'">!</template>
          <template v-else>i</template>
        </span>
        <span class="toast-msg">{{ t.message }}</span>
        <button class="toast-close" @click.stop="toast.dismiss(t.id)" aria-label="Закрыть">✕</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '../stores/toast.js'
const toast = useToast()
</script>

<style scoped>
.toast-region {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: min(380px, calc(100vw - 32px));
  pointer-events: none;
}
.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  border-radius: 12px;
  background: #fff;
  color: #1e293b;
  box-shadow: 0 8px 28px rgba(0,0,0,0.18);
  border-left: 4px solid #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.toast--success { border-left-color: #16a34a; }
.toast--error   { border-left-color: #dc2626; }
.toast--warning { border-left-color: #d97706; }
.toast--info    { border-left-color: #2563eb; }

.toast-icon {
  width: 22px; height: 22px; flex-shrink: 0;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; color: #fff;
  background: #64748b;
}
.toast--success .toast-icon { background: #16a34a; }
.toast--error   .toast-icon { background: #dc2626; }
.toast--warning .toast-icon { background: #d97706; }
.toast--info    .toast-icon { background: #2563eb; }

.toast-msg { flex: 1; line-height: 1.35; }
.toast-close {
  background: none; border: none; cursor: pointer;
  color: #94a3b8; font-size: 14px; padding: 2px 4px;
  flex-shrink: 0; line-height: 1;
}
.toast-close:hover { color: #475569; }

/* Animations */
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-enter-active { transition: all 0.28s ease; }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
.toast-leave-active { transition: all 0.2s ease; position: absolute; }

/* high-contrast */
:global(.high-contrast) .toast { background: #000; color: #fff; border: 2px solid #fff; }

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active, .toast-leave-active { transition: opacity 0.15s ease; }
  .toast-enter-from, .toast-leave-to { transform: none; }
}
</style>
