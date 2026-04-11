<template>
  <footer class="app-footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <!-- Brand -->
        <div class="footer-brand">
          <div class="footer-logo">
            <div class="footer-logo-icon">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="rgba(255,255,255,0.15)"/>
                <path d="M14 4L6 9v6c0 4.42 3.44 8.56 8 9.56 4.56-1 8-5.14 8-9.56V9L14 4z" fill="white" fill-opacity="0.9"/>
                <path d="M11 14l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <div class="footer-logo-name">SenimdiQAdam</div>
              <div class="footer-logo-sub">Reliable Step · Сенімді Қадам</div>
            </div>
          </div>
          <p class="footer-desc">{{ t('aboutText') }}</p>
          <div class="footer-socials">
            <a href="https://instagram.com/senimdi_qadam" class="social-btn" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://t.me/senimdi_qadam" class="social-btn" target="_blank" rel="noopener" aria-label="Telegram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="https://wa.me/77270000000" class="social-btn" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </a>
          </div>
        </div>

        <!-- Services links -->
        <div class="footer-col">
          <h4 class="footer-col-title">{{ t('services') }}</h4>
          <ul class="footer-links">
            <li><RouterLink to="/services/organizations">{{ t('orgList') }}</RouterLink></li>
            <li><RouterLink to="/services/ai">{{ t('localAI') }}</RouterLink></li>
            <li><RouterLink to="/services/accessibility-map">{{ t('accessMap') }}</RouterLink></li>
            <li><RouterLink to="/services/jobs">{{ t('jobs') }}</RouterLink></li>
            <li><RouterLink to="/services/documents">{{ t('documents') }}</RouterLink></li>
          </ul>
        </div>

        <!-- Platform links -->
        <div class="footer-col">
          <h4 class="footer-col-title">Платформа</h4>
          <ul class="footer-links">
            <li><RouterLink to="/news">{{ t('news') }}</RouterLink></li>
            <li><RouterLink to="/projects/community">{{ t('community') }}</RouterLink></li>
            <li><RouterLink to="/inva-taxi/order">{{ t('invaTaxi') }}</RouterLink></li>
            <li><RouterLink to="/info">{{ t('moreInfo') }}</RouterLink></li>
            <li><RouterLink to="/help">{{ t('helpNav') }}</RouterLink></li>
          </ul>
        </div>

        <!-- Contacts -->
        <div class="footer-col">
          <h4 class="footer-col-title">Контакты</h4>
          <ul class="footer-contacts">
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ t('footerAddress') }}
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.8-.8a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {{ t('footerPhone') }}
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {{ t('footerEmail') }}
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>{{ t('footerRights') }}</span>
        <div class="footer-bottom-links">
          <RouterLink to="/help">Помощь по сайту</RouterLink>
          <RouterLink to="/login">{{ t('login') }}</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'

const a11y = useAccessibilityStore()
const t = computed(() => useI18n(a11y.lang))
</script>

<style scoped>
.app-footer {
  background: var(--dark);
  color: rgba(255,255,255,0.8);
  padding: 64px 0 0;
  margin-top: 80px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}
.footer-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.footer-logo-icon {
  width: 44px; height: 44px;
  background: var(--primary);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.footer-logo-name { font-size: var(--fs-md); font-weight: 800; color: white; }
.footer-logo-sub { font-size: var(--fs-xs); color: rgba(255,255,255,0.5); }
.footer-desc { font-size: var(--fs-sm); line-height: 1.7; color: rgba(255,255,255,0.6); margin-bottom: 20px; }
.footer-socials { display: flex; gap: 8px; }
.social-btn {
  width: 36px; height: 36px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.7);
  transition: all var(--transition);
}
.social-btn:hover { background: var(--primary); color: white; transform: translateY(-2px); }
.footer-col-title {
  font-size: var(--fs-sm);
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 16px;
}
.footer-links { display: flex; flex-direction: column; gap: 10px; }
.footer-links a {
  font-size: var(--fs-sm);
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  transition: color var(--transition);
}
.footer-links a:hover { color: white; }
.footer-contacts { display: flex; flex-direction: column; gap: 12px; }
.footer-contacts li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: var(--fs-sm);
  color: rgba(255,255,255,0.6);
}
.footer-contacts svg { flex-shrink: 0; margin-top: 2px; }
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--fs-xs);
  color: rgba(255,255,255,0.4);
}
.footer-bottom-links { display: flex; gap: 20px; }
.footer-bottom-links a { color: rgba(255,255,255,0.5); text-decoration: none; transition: color var(--transition); }
.footer-bottom-links a:hover { color: white; }

@media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) {
  .footer-grid { grid-template-columns: 1fr; gap: 32px; }
  .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
}
</style>
