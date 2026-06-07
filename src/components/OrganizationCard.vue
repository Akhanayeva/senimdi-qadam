<template>
  <div class="org-card" :class="{ 'org-card--verified': org.status === 'VERIFIED' }">
    <!-- Banner -->
    <div class="org-card-banner" :style="{ background: orgColor }">
      <span class="org-banner-letter">{{ (orgName || '').charAt(0) }}</span>
      <button
        v-if="authStore.isAuthenticated"
        class="save-btn"
        :class="{ saved: authStore.isOrgSaved(org.id) }"
        @click.stop="authStore.toggleSaveOrg(org.id)"
        :aria-label="authStore.isOrgSaved(org.id) ? t('saved') : t('save')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" :fill="authStore.isOrgSaved(org.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <div class="org-banner-badges">
        <span v-if="org.status === 'VERIFIED'" class="badge badge-verified badge-on-banner">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          {{ t('verified') }}
        </span>
        <span v-if="categoryLabel" class="badge badge-category badge-on-banner">{{ categoryLabel }}</span>
      </div>
    </div>

    <h3 class="org-name">{{ orgName }}</h3>

    <!-- Description -->
    <p class="org-desc">{{ orgDesc }}</p>

    <!-- Meta info -->
    <div class="org-meta">
      <div class="org-meta-item">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>{{ org.address }}</span>
      </div>
      <div v-if="org.phone" class="org-meta-item">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.8-.8a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <a :href="`tel:${org.phone}`" @click.stop>{{ org.phone }}</a>
      </div>
      <div v-if="org.workingHours || org.hours" class="org-meta-item">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>{{ org.workingHours || org.hours }}</span>
      </div>
    </div>

    <!-- Tags -->
    <div v-if="org.tags?.length" class="org-tags">
      <span v-for="tag in org.tags.slice(0,3)" :key="tag" class="org-tag">#{{ tag }}</span>
    </div>

    <!-- Rating -->
    <div class="org-footer">
      <div class="org-rating">
        <span class="stars">
          <svg v-for="i in 5" :key="i" width="12" height="12" viewBox="0 0 24 24" :fill="i <= Math.round(org.ratingAvg) ? '#F59E0B' : 'none'" stroke="#F59E0B" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </span>
        <span class="rating-val">{{ org.ratingAvg }}</span>
      </div>
      <button class="btn btn-primary btn-sm" @click="$emit('open', org)">
        {{ t('openCard') }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'

const props = defineProps({ org: Object })
defineEmits(['open'])

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const lang = computed(() => a11y.lang)
const t = computed(() => useI18n(lang.value))

// API returns already-localised `name`/`description` (language interceptor).
// Fall back to bilingual fields for safety / mock data.
const orgName = computed(() => {
  const o = props.org || {}
  return o.name || (lang.value === 'kaz' ? o.nameKk : o.nameRu) || o.nameRu || ''
})
const orgDesc = computed(() => {
  const o = props.org || {}
  return o.description || (lang.value === 'kaz' ? o.descriptionKk : o.descriptionRu) || ''
})

// Maps real API org.category enum → display label (RU/KK)
const CATEGORY_LABELS = {
  MEDICAL:        { rus: 'Медицина',             kaz: 'Медицина',            eng: 'Medical' },
  LEGAL:          { rus: 'Юридическая помощь',   kaz: 'Заңдық көмек',        eng: 'Legal Aid' },
  SOCIAL:         { rus: 'Социальная поддержка', kaz: 'Әлеуметтік қолдау',   eng: 'Social Support' },
  REHABILITATION: { rus: 'Реабилитация',          kaz: 'Оңалту',              eng: 'Rehabilitation' },
  EDUCATION:      { rus: 'Образование',           kaz: 'Білім',               eng: 'Education' },
  EMPLOYMENT:     { rus: 'Трудоустройство',       kaz: 'Жұмысқа орналасу',    eng: 'Employment' },
  SPORT:          { rus: 'Спорт',                 kaz: 'Спорт',               eng: 'Sport' },
  CULTURE:        { rus: 'Культура',              kaz: 'Мәдениет',            eng: 'Culture' },
  PSYCHOLOGICAL:  { rus: 'Психологическая',       kaz: 'Психологиялық',       eng: 'Psychological' },
  OTHER:          { rus: 'Прочее',                kaz: 'Басқа',               eng: 'Other' },
  NGO:            { rus: 'НКО / Фонд',            kaz: 'ҮЕҰ / Қор',           eng: 'NGO / Foundation' },
}

// Banner color based on org name initial
const COLORS = [
  'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)',
  'linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)',
  'linear-gradient(135deg,#10b981 0%,#059669 100%)',
  'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)',
  'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)',
  'linear-gradient(135deg,#8b5cf6 0%,#7c3aed 100%)',
  'linear-gradient(135deg,#ec4899 0%,#db2777 100%)',
  'linear-gradient(135deg,#14b8a6 0%,#0d9488 100%)',
]
const orgColor = computed(() => {
  const code = (orgName.value || 'A').charCodeAt(0)
  return COLORS[code % COLORS.length]
})

// Works with real API (org.category enum) AND mock (org.categoryLabel nested object)
const categoryLabel = computed(() => {
  if (!props.org) return ''
  const cat = props.org.category
  if (cat && CATEGORY_LABELS[cat]) {
    const l = lang.value
    return l === 'kaz' ? CATEGORY_LABELS[cat].kaz : l === 'eng' ? CATEGORY_LABELS[cat].eng : CATEGORY_LABELS[cat].rus
  }
  // Fallback to mock nested format
  const l = lang.value
  return l === 'kaz'
    ? props.org.categoryLabel?.kaz
    : l === 'eng'
      ? (props.org.categoryLabel?.eng || props.org.categoryLabel?.rus)
      : props.org.categoryLabel?.rus
})
</script>

<style scoped>
.org-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  transition: all var(--transition);
  cursor: pointer;
  border: 1.5px solid transparent;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.org-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
.org-card--verified { border-color: rgba(16,185,129,0.2); }
.org-card--verified:hover { border-color: rgba(16,185,129,0.4); }

/* Banner (like news card image) */
.org-card-banner {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}
.org-banner-letter {
  font-size: 56px;
  font-weight: 900;
  color: rgba(255,255,255,0.35);
  user-select: none;
  line-height: 1;
}
.org-banner-badges {
  position: absolute;
  bottom: 10px;
  left: 12px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.badge-on-banner {
  background: rgba(0,0,0,0.35) !important;
  color: white !important;
  border: none !important;
  backdrop-filter: blur(4px);
}
.save-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  color: rgba(255,255,255,0.8);
  background: rgba(0,0,0,0.25);
  padding: 6px;
  border-radius: 8px;
  transition: all var(--transition);
  backdrop-filter: blur(4px);
}
.save-btn:hover, .save-btn.saved { color: #EF4444; background: rgba(255,255,255,0.9); }

/* Card body */
.org-name,
.org-desc,
.org-meta,
.org-tags,
.org-footer {
  padding-left: 20px;
  padding-right: 20px;
}
.org-name {
  padding-top: 16px;
  font-size: var(--fs-md);
  font-weight: 700;
  color: var(--black);
  line-height: 1.3;
}
.org-desc {
  margin-top: 8px;
  font-size: var(--fs-sm);
  color: var(--gray-500);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.org-meta { display: flex; flex-direction: column; gap: 5px; margin-top: 10px; }
.org-meta-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: var(--fs-xs);
  color: var(--gray-500);
}
.org-meta-item a { color: var(--primary); }
.org-meta-item a:hover { text-decoration: underline; }
.org-meta-item svg { flex-shrink: 0; margin-top: 2px; }

.org-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.org-tag {
  font-size: 11px;
  color: var(--primary);
  background: var(--primary-pale);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-weight: 600;
}
.org-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  padding-bottom: 16px;
  border-top: 1px solid var(--gray-100);
  margin-top: 14px;
}
.org-rating { display: flex; align-items: center; gap: 5px; }
.stars { display: flex; gap: 1px; }
.rating-val { font-size: var(--fs-xs); font-weight: 700; color: var(--gray-700); }

</style>
