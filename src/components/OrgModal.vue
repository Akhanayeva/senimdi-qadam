<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="org" class="modal-overlay" @click.self="$emit('close')" role="dialog" aria-modal="true">
        <div class="modal-box org-modal">

          <!-- Close -->
          <button class="modal-close-btn" @click="$emit('close')" :aria-label="lang==='kaz' ? 'Жабу' : 'Закрыть'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <!-- ── HEADER ── -->
          <div class="org-header">
            <div class="org-header-top">
              <div class="org-avatar">{{ orgName.charAt(0) }}</div>
              <div class="org-header-main">
                <h2 class="org-title">{{ orgName }}</h2>
                <div v-if="org.verifiedDate" class="org-verified-date">
                  {{ lang === 'kaz' ? 'Верификация күні:' : 'Дата верификации:' }} {{ org.verifiedDate }}
                </div>
              </div>
            </div>
            <div class="org-type-status">
              <div class="org-type-row">
                <span class="detail-label">{{ lang === 'kaz' ? 'Түрі:' : 'Тип:' }}</span>
                <span class="detail-value">{{ lang === 'kaz' ? org.type?.kaz : org.type?.rus }}</span>
              </div>
              <div class="org-status-row">
                <span class="detail-label">{{ lang === 'kaz' ? 'Мәртебесі:' : 'Статус:' }}</span>
                <span v-if="org.verified" class="status-verified">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ lang === 'kaz' ? 'Верификацияланған' : 'Верифицировано' }}
                </span>
                <span v-else class="status-pending">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ lang === 'kaz' ? 'Верификация күтілуде' : 'Ожидает верификации' }}
                </span>
              </div>
            </div>
          </div>

          <!-- ── GENERAL INFORMATION ── -->
          <div class="org-section">
            <div class="section-heading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ lang === 'kaz' ? 'Жалпы ақпарат' : 'Общая информация' }}
            </div>
            <div class="section-body">
              <div class="info-field">
                <span class="info-field-label">{{ lang === 'kaz' ? 'Көмек санаты:' : 'Категория помощи:' }}</span>
                <span class="info-field-value">{{ lang === 'kaz' ? org.categoryLabel?.kaz : org.categoryLabel?.rus }}</span>
              </div>
              <div class="info-field">
                <span class="info-field-label">{{ lang === 'kaz' ? 'Мақсатты аудитория:' : 'Целевая аудитория:' }}</span>
                <span class="info-field-value">{{ lang === 'kaz' ? org.targetAudience?.kaz : org.targetAudience?.rus }}</span>
              </div>
              <div class="info-field">
                <span class="info-field-label">{{ lang === 'kaz' ? 'Қысқаша сипаттама:' : 'Краткое описание:' }}</span>
                <span class="info-field-value org-desc-text">{{ lang === 'kaz' ? org.descriptionKaz : org.description }}</span>
              </div>
            </div>
          </div>

          <!-- ── BASIC SERVICES ── -->
          <div v-if="org.services" class="org-section">
            <div class="section-heading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              {{ lang === 'kaz' ? 'Негізгі қызметтер' : 'Основные услуги' }}
            </div>
            <div class="section-body">
              <ul class="services-list">
                <li v-for="(service, i) in (lang === 'kaz' ? org.services.kaz : org.services.rus)" :key="i" class="service-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ service }}
                </li>
              </ul>
            </div>
          </div>

          <!-- ── CONTACTS ── -->
          <div class="org-section">
            <div class="section-heading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.8-.8a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {{ lang === 'kaz' ? 'Байланыс' : 'Контакты' }}
            </div>
            <div class="section-body contacts-grid">
              <div class="contact-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <div class="contact-label">{{ lang === 'kaz' ? 'Мекенжай:' : 'Адрес:' }}</div>
                  <div class="contact-value">{{ org.address }}</div>
                </div>
              </div>
              <div class="contact-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><path d="M12 22s-8-4-8-10a8 8 0 0 1 16 0c0 6-8 10-8 10z"/></svg>
                <div>
                  <div class="contact-label">{{ lang === 'kaz' ? 'Қала:' : 'Город:' }}</div>
                  <div class="contact-value">{{ org.city || 'Алматы' }}</div>
                </div>
              </div>
              <div v-if="org.phone" class="contact-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.8-.8a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <div>
                  <div class="contact-label">{{ lang === 'kaz' ? 'Телефон:' : 'Телефон:' }}</div>
                  <a :href="`tel:${org.phone}`" class="contact-link">{{ org.phone }}</a>
                </div>
              </div>
              <div v-if="org.whatsapp || org.telegram" class="contact-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="color:#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.003 2.003C6.476 2.003 2 6.478 2 12.003c0 1.992.578 3.854 1.59 5.43L2 22l4.65-1.574A9.957 9.957 0 0 0 12.003 22C17.53 22 22 17.525 22 12 22 6.476 17.53 2.003 12.003 2.003z"/></svg>
                <div>
                  <div class="contact-label">WhatsApp / Telegram:</div>
                  <div class="contact-value contact-messengers">
                    <a v-if="org.whatsapp" :href="`https://wa.me/${org.whatsapp.replace(/\D/g,'')}`" target="_blank" class="contact-link messenger-link whatsapp">WhatsApp</a>
                    <span v-if="org.whatsapp && org.telegram" class="separator">·</span>
                    <a v-if="org.telegram" :href="`https://t.me/${org.telegram.replace('@','')}`" target="_blank" class="contact-link messenger-link telegram">{{ org.telegram }}</a>
                    <span v-if="!org.whatsapp && !org.telegram" class="no-val">—</span>
                  </div>
                </div>
              </div>
              <div v-if="org.website" class="contact-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <div>
                  <div class="contact-label">{{ lang === 'kaz' ? 'Сайт:' : 'Сайт:' }}</div>
                  <a :href="org.website" target="_blank" rel="noopener" class="contact-link">{{ org.website }}</a>
                </div>
              </div>
              <div v-if="org.hours" class="contact-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <div class="contact-label">{{ lang === 'kaz' ? 'Жұмыс уақыты:' : 'Режим работы:' }}</div>
                  <div class="contact-value">{{ org.hours }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── ACCESSIBILITY ── -->
          <div v-if="org.accessibility" class="org-section">
            <div class="section-heading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              {{ lang === 'kaz' ? 'Қолжетімділік' : 'Доступность' }}
            </div>
            <div class="section-body">
              <div class="accessibility-grid">
                <div class="a11y-item" :class="org.accessibility.ramp ? 'a11y-yes' : 'a11y-no'">
                  <span class="a11y-icon">{{ org.accessibility.ramp ? '✅' : '❌' }}</span>
                  <span>{{ lang === 'kaz' ? 'Пандус / кіреберіс' : 'Пандус / вход для колясок' }}</span>
                </div>
                <div class="a11y-item" :class="org.accessibility.lift ? 'a11y-yes' : 'a11y-no'">
                  <span class="a11y-icon">{{ org.accessibility.lift ? '✅' : '❌' }}</span>
                  <span>{{ lang === 'kaz' ? 'Лифт' : 'Лифт' }}</span>
                </div>
                <div class="a11y-item" :class="org.accessibility.tactilePlates ? 'a11y-yes' : 'a11y-no'">
                  <span class="a11y-icon">{{ org.accessibility.tactilePlates ? '✅' : '❌' }}</span>
                  <span>{{ lang === 'kaz' ? 'Тактильді тақтайшалар / ірі қаріп' : 'Тактильные таблички / крупный шрифт' }}</span>
                </div>
                <div class="a11y-item" :class="org.accessibility.signLanguage ? 'a11y-yes' : 'a11y-no'">
                  <span class="a11y-icon">{{ org.accessibility.signLanguage ? '✅' : '❌' }}</span>
                  <span>{{ lang === 'kaz' ? 'Қызметкер ымдау тілін біледі' : 'Сотрудник знает жестовый язык' }}</span>
                </div>
                <div class="a11y-item" :class="org.accessibility.onlineConsultations ? 'a11y-yes' : 'a11y-no'">
                  <span class="a11y-icon">{{ org.accessibility.onlineConsultations ? '✅' : '❌' }}</span>
                  <span>{{ lang === 'kaz' ? 'Онлайн кеңес (иә/жоқ)' : 'Онлайн консультации (да/нет)' }}</span>
                </div>
              </div>
              <div v-if="org.accessibility.languages?.length" class="a11y-langs">
                <span class="contact-label">{{ lang === 'kaz' ? 'Қызмет тілдері:' : 'Языки обслуживания:' }}</span>
                <div class="lang-tags">
                  <span v-for="l in org.accessibility.languages" :key="l" class="lang-tag">{{ l }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── VERIFICATION (QA) ── -->
          <div v-if="org.verification" class="org-section">
            <div class="section-heading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {{ lang === 'kaz' ? 'Верификация (QA) + Ассистент' : 'Верификация (QA) + Ассистент' }}
            </div>
            <div class="section-body">
              <div class="info-field">
                <span class="info-field-label">{{ lang === 'kaz' ? 'Мәртебесі:' : 'Статус:' }}</span>
                <span :class="org.verification.status === 'verified' ? 'v-verified' : 'v-pending'">
                  {{ org.verification.status === 'verified'
                    ? (lang === 'kaz' ? '✓ Верификацияланған' : '✓ Верифицировано')
                    : (lang === 'kaz' ? '⏳ Верификация күтілуде' : '⏳ Ожидает верификации') }}
                </span>
              </div>
              <div v-if="org.verification.lastReviewer" class="info-field">
                <span class="info-field-label">{{ lang === 'kaz' ? 'Соңғы тексерген:' : 'Последний проверяющий:' }}</span>
                <span class="info-field-value">{{ org.verification.lastReviewer }}</span>
              </div>
              <div v-if="org.verification.source" class="info-field">
                <span class="info-field-label">{{ lang === 'kaz' ? 'Верификация көзі:' : 'Источник верификации:' }}</span>
                <span class="info-field-value">{{ org.verification.source }}</span>
              </div>
              <div v-if="org.verification.moderatorComment" class="moderator-comment">
                <div class="moderator-comment-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {{ lang === 'kaz' ? 'Модератордың пікірі:' : 'Комментарий модератора:' }}
                </div>
                <div class="moderator-comment-text">"{{ org.verification.moderatorComment }}"</div>
              </div>
            </div>
          </div>

          <!-- ── AI ASSISTANT BUTTON ── -->
          <div class="org-section org-ai-section">
            <div class="section-heading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l9-9"/><path d="M17 3h4v4"/></svg>
              {{ lang === 'kaz' ? 'AI Ассистент Сенім' : 'AI Ассистент Сенім' }}
            </div>
            <div class="section-body ai-assistant-body">
              <button class="btn-ai-assistant" @click="askAI">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M21 12h-4l-3 3-4-8-3 5H3"/></svg>
                {{ lang === 'kaz' ? 'Ассистентке қалай алуға болатынын сұра' : 'Спросить ассистента, как получить помощь здесь' }}
              </button>
              <p class="ai-assistant-hint">
                {{ lang === 'kaz'
                  ? 'Ассистент қандай қадамдар жасау керек, қандай құжаттар әзірлеу керек және кімге хабарласу керектігін түсіндіреді.'
                  : 'Ассистент объяснит, какие шаги предпринять, какие документы подготовить и к кому обратиться.' }}
              </p>
            </div>
          </div>

          <!-- ── FOOTER ACTIONS ── -->
          <div class="org-modal-footer">
            <!-- Rating -->
            <div class="org-rating">
              <span v-for="i in 5" :key="i">
                <svg width="14" height="14" viewBox="0 0 24 24" :fill="i <= Math.round(org.rating) ? '#F59E0B' : 'none'" stroke="#F59E0B" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </span>
              <strong class="rating-num">{{ org.rating }}</strong>
              <span class="rating-sep">/</span>
              <span class="rating-max">5.0</span>
            </div>
            <!-- Tags -->
            <div v-if="org.tags?.length" class="org-footer-tags">
              <span v-for="tag in org.tags" :key="tag" class="org-tag">#{{ tag }}</span>
            </div>
            <!-- Action buttons -->
            <div class="footer-btns">
              <a v-if="org.phone" :href="`tel:${org.phone}`" class="btn btn-primary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.8-.8a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {{ lang === 'kaz' ? 'Қоңырау шалу' : 'Позвонить' }}
              </a>
              <a v-if="org.whatsapp" :href="`https://wa.me/${org.whatsapp.replace(/\D/g,'')}`" target="_blank" class="btn btn-whatsapp btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.003 2.003C6.476 2.003 2 6.478 2 12.003c0 1.992.578 3.854 1.59 5.43L2 22l4.65-1.574A9.957 9.957 0 0 0 12.003 22C17.53 22 22 17.525 22 12 22 6.476 17.53 2.003 12.003 2.003z"/></svg>
                WhatsApp
              </a>
              <a v-if="org.website" :href="org.website" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                {{ lang === 'kaz' ? 'Сайт' : 'Сайт' }}
              </a>
              <button
                v-if="authStore.isAuthenticated"
                class="btn btn-sm"
                :class="authStore.isOrgSaved(org.id) ? 'btn-primary' : 'btn-outline'"
                @click="authStore.toggleSaveOrg(org.id)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" :fill="authStore.isOrgSaved(org.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {{ authStore.isOrgSaved(org.id) ? t('saved') : t('save') }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'

const props = defineProps({ org: Object })
const emit = defineEmits(['close'])

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const router = useRouter()
const lang = computed(() => a11y.lang)
const t = computed(() => useI18n(lang.value))

const orgName = computed(() =>
  props.org ? (lang.value === 'kaz' ? props.org.nameKaz : props.org.nameRus) : ''
)

function askAI() {
  emit('close')
  const orgN = orgName.value
  router.push({
    path: '/ai-assistant',
    query: { q: lang.value === 'kaz'
      ? `${orgN} ұйымынан қалай көмек алуға болады?`
      : `Как получить помощь в организации "${orgN}"?`
    }
  })
}
</script>

<style scoped>
/* ── Overlay & Box ── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(10,22,40,0.6); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px; overflow-y: auto;
}
.modal-box {
  background: white; border-radius: var(--radius-xl);
  width: 100%; max-width: 640px;
  max-height: calc(100vh - 32px); overflow-y: auto;
  box-shadow: 0 30px 80px rgba(0,0,0,0.3);
  position: relative;
}
.org-modal { }

/* ── Close ── */
.modal-close-btn {
  position: sticky; top: 12px; float: right; margin: 12px 12px 0 0; z-index: 10;
  color: var(--gray-400); padding: 6px; border-radius: 8px; transition: all var(--transition);
}
.modal-close-btn:hover { background: var(--gray-100); color: var(--gray-900); }

/* ── Header ── */
.org-header {
  padding: 20px 24px 0;
  border-bottom: 1px solid var(--gray-100);
  margin-bottom: 0;
}
.org-header-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px; }
.org-avatar {
  width: 56px; height: 56px; border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white; font-size: 22px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.org-header-main { flex: 1; }
.org-title { font-size: var(--fs-xl); font-weight: 800; color: var(--black); line-height: 1.3; margin-bottom: 4px; }
.org-verified-date { font-size: var(--fs-xs); color: var(--gray-500); text-align: right; }
.org-type-status { display: flex; flex-direction: column; gap: 6px; padding-bottom: 16px; }
.org-type-row, .org-status-row { display: flex; align-items: center; gap: 8px; font-size: var(--fs-sm); }
.detail-label { color: var(--gray-500); font-weight: 600; min-width: 60px; }
.detail-value { color: var(--black); font-weight: 500; }
.status-verified {
  display: inline-flex; align-items: center; gap: 5px;
  color: #065F46; background: #D1FAE5; font-weight: 700;
  font-size: var(--fs-xs); padding: 3px 10px; border-radius: var(--radius-full);
}
.status-pending {
  display: inline-flex; align-items: center; gap: 5px;
  color: #92400E; background: #FEF3C7; font-weight: 700;
  font-size: var(--fs-xs); padding: 3px 10px; border-radius: var(--radius-full);
}

/* ── Sections ── */
.org-section { padding: 16px 24px; border-bottom: 1px solid var(--gray-100); }
.org-section:last-child { border-bottom: none; }
.section-heading {
  display: flex; align-items: center; gap: 8px;
  font-size: var(--fs-sm); font-weight: 800; color: var(--black);
  margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.04em;
}
.section-heading svg { color: var(--primary); flex-shrink: 0; }
.section-body { }

/* ── Info fields ── */
.info-field { display: flex; flex-direction: column; gap: 2px; margin-bottom: 10px; }
.info-field:last-child { margin-bottom: 0; }
.info-field-label { font-size: var(--fs-xs); color: var(--gray-500); font-weight: 700; }
.info-field-value { font-size: var(--fs-sm); color: var(--gray-700); }
.org-desc-text { font-style: italic; color: var(--gray-600); line-height: 1.6; }

/* ── Services ── */
.services-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.service-item { display: flex; align-items: flex-start; gap: 8px; font-size: var(--fs-sm); color: var(--gray-700); line-height: 1.5; }
.service-item svg { flex-shrink: 0; margin-top: 2px; }

/* ── Contacts ── */
.contacts-grid { display: flex; flex-direction: column; gap: 10px; }
.contact-row { display: flex; align-items: flex-start; gap: 10px; font-size: var(--fs-sm); }
.contact-row svg { flex-shrink: 0; margin-top: 2px; color: var(--primary); }
.contact-label { font-size: var(--fs-xs); color: var(--gray-500); font-weight: 600; }
.contact-value { color: var(--gray-700); }
.contact-link { color: var(--primary); text-decoration: none; font-weight: 500; }
.contact-link:hover { text-decoration: underline; }
.contact-messengers { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.messenger-link { padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs); font-weight: 700; }
.messenger-link.whatsapp { background: #DCFCE7; color: #15803D; }
.messenger-link.telegram { background: #DBEAFE; color: #1D4ED8; }
.separator { color: var(--gray-300); }
.no-val { color: var(--gray-400); }

/* ── Accessibility ── */
.accessibility-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
@media (max-width: 480px) { .accessibility-grid { grid-template-columns: 1fr; } }
.a11y-item { display: flex; align-items: center; gap: 8px; font-size: var(--fs-sm); padding: 8px 10px; border-radius: var(--radius-md); }
.a11y-yes { background: #F0FDF4; color: #166534; }
.a11y-no { background: var(--gray-50); color: var(--gray-500); }
.a11y-icon { font-size: 14px; flex-shrink: 0; }
.a11y-langs { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.lang-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.lang-tag { background: var(--primary-pale); color: var(--primary); font-size: var(--fs-xs); font-weight: 700; padding: 2px 10px; border-radius: var(--radius-full); letter-spacing: 0.05em; }

/* ── Verification ── */
.v-verified { color: #065F46; font-weight: 700; font-size: var(--fs-sm); }
.v-pending { color: #92400E; font-weight: 700; font-size: var(--fs-sm); }
.moderator-comment { background: #FFFBEB; border-left: 3px solid #F59E0B; border-radius: 0 var(--radius-md) var(--radius-md) 0; padding: 10px 14px; margin-top: 10px; }
.moderator-comment-label { display: flex; align-items: center; gap: 6px; font-size: var(--fs-xs); font-weight: 700; color: #92400E; margin-bottom: 4px; }
.moderator-comment-text { font-size: var(--fs-sm); color: var(--gray-700); font-style: italic; line-height: 1.5; }

/* ── AI Section ── */
.org-ai-section { background: linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%); }
.ai-assistant-body { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
.btn-ai-assistant {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--primary); color: white;
  padding: 10px 20px; border-radius: var(--radius-md);
  font-size: var(--fs-sm); font-weight: 700;
  transition: all var(--transition); cursor: pointer; box-shadow: var(--shadow);
}
.btn-ai-assistant:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: var(--shadow-lg); }
.ai-assistant-hint { font-size: var(--fs-xs); color: var(--gray-600); line-height: 1.5; }

/* ── Footer ── */
.org-modal-footer { padding: 16px 24px; display: flex; flex-direction: column; gap: 12px; }
.org-rating { display: flex; align-items: center; gap: 2px; }
.rating-num { font-weight: 800; color: var(--black); font-size: var(--fs-sm); margin-left: 4px; }
.rating-sep { color: var(--gray-300); margin: 0 2px; }
.rating-max { color: var(--gray-400); font-size: var(--fs-sm); }
.org-footer-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.org-tag { font-size: var(--fs-xs); color: var(--primary); background: var(--primary-pale); padding: 3px 10px; border-radius: var(--radius-full); font-weight: 600; }
.footer-btns { display: flex; flex-wrap: wrap; gap: 8px; }
.btn-whatsapp { background: #22C55E; color: white; display: inline-flex; align-items: center; gap: 6px; border-radius: var(--radius-full); font-size: var(--fs-sm); font-weight: 700; padding: 8px 16px; text-decoration: none; }
.btn-whatsapp:hover { background: #16A34A; }

/* ── Transition ── */
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-active .modal-box { animation: modalSlideIn 0.2s ease; }
@keyframes modalSlideIn { from { transform: translateY(16px) scale(0.97); } to { transform: translateY(0) scale(1); } }
</style>
