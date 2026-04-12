<template>
  <main class="page-content">

    <!-- ===== HERO SLIDER ===== -->
    <section class="hero-section" aria-label="Главный баннер">
      <div class="hero-slider" ref="sliderRef">
        <div
          v-for="(slide, idx) in slides"
          :key="idx"
          class="hero-slide"
          :class="{ active: currentSlide === idx }"
          :style="{ background: slide.gradient }"
        >
          <div class="container">
            <div class="hero-content">
              <div class="hero-tag">SenimdiQAdam ✓</div>
              <h1 class="hero-title">{{ slide.title }}</h1>
              <p class="hero-desc">{{ slide.desc }}</p>
              <RouterLink :to="slide.ctaLink" class="btn btn-primary btn-lg hero-cta">
                {{ slide.cta }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </RouterLink>
            </div>
          </div>
          <div class="hero-decor"></div>
        </div>

        <!-- Arrows -->
        <button class="slider-arrow slider-arrow-prev" @click="prevSlide" aria-label="Назад">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="slider-arrow slider-arrow-next" @click="nextSlide" aria-label="Вперёд">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <!-- Dots -->
        <div class="slider-dots" role="tablist">
          <button
            v-for="(_, idx) in slides"
            :key="idx"
            class="slider-dot"
            :class="{ active: currentSlide === idx }"
            @click="goToSlide(idx)"
            :aria-label="`Слайд ${idx + 1}`"
            role="tab"
          ></button>
        </div>
      </div>
    </section>

    <!-- ===== ABOUT US ===== -->
    <section class="section about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-visual">
            <div class="about-img-placeholder">
              <div class="about-img-inner">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" opacity="0.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <div class="about-stat-cards">
                  <div class="about-stat">
                    <span class="about-stat-num">12+</span>
                    <span class="about-stat-label">Организаций</span>
                  </div>
                  <div class="about-stat about-stat-blue">
                    <span class="about-stat-num">QA ✓</span>
                    <span class="about-stat-label">Проверено</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="about-content">
            <div class="section-tag">О платформе</div>
            <h2 class="section-title">{{ t('aboutTitle') }}</h2>
            <p class="about-text">{{ t('aboutText') }}</p>
            <div class="about-features">
              <div class="about-feature" v-for="f in features" :key="f.icon">
                <div class="feature-icon">{{ f.icon }}</div>
                <div>
                  <div class="feature-title">{{ f.title }}</div>
                  <div class="feature-desc">{{ f.desc }}</div>
                </div>
              </div>
            </div>
            <div v-if="!authStore.isAuthenticated" class="about-cta">
              <RouterLink to="/login" class="btn btn-primary">{{ t('loginRegister') }}</RouterLink>
              <RouterLink to="/services/ai" class="btn btn-outline">Попробовать ИИ</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== ORGANIZATIONS PREVIEW ===== -->
    <section class="section orgs-preview-section">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">{{ t('orgsPreview') }}</div>
          <h2 class="section-title">Проверенные организации Алматы</h2>
          <p class="section-subtitle">Центры, фонды и государственные учреждения — всё с подтверждённым статусом</p>
        </div>

        <!-- Skeleton or orgs circles -->
        <div v-if="orgsLoading" class="orgs-circles-grid">
          <div v-for="i in 8" :key="i" class="org-circle skeleton" style="height:100px"></div>
        </div>
        <div v-else class="orgs-circles-grid">
          <button
            v-for="org in featuredOrgs"
            :key="org.id"
            class="org-circle-btn"
            @click="selectedOrg = org"
            :title="lang === 'kaz' ? org.nameKaz : org.nameRus"
          >
            <div class="org-circle-avatar" :class="{ verified: org.verified }">
              <span class="org-circle-letter">{{ org.name.charAt(0) }}</span>
              <span v-if="org.verified" class="org-circle-check">✓</span>
            </div>
            <div class="org-circle-name">{{ (lang === 'kaz' ? org.nameKaz : org.nameRus).slice(0, 24) }}{{ (lang === 'kaz' ? org.nameKaz : org.nameRus).length > 24 ? '…' : '' }}</div>
          </button>
        </div>

        <div class="section-cta">
          <RouterLink to="/services/organizations" class="btn btn-primary btn-lg">
            {{ t('viewAll') }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ===== LATEST NEWS ===== -->
    <section class="section news-section">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">{{ t('latestNews') }}</div>
          <h2 class="section-title">{{ t('latestNews') }}</h2>
          <p class="section-subtitle">Актуальные новости о поддержке людей с инвалидностью в Алматы</p>
        </div>

        <div v-if="newsLoading" class="news-grid">
          <div v-for="i in 6" :key="i" class="news-card-skeleton">
            <div class="skeleton" style="height:180px;border-radius:12px 12px 0 0"></div>
            <div style="padding:16px;display:flex;flex-direction:column;gap:8px">
              <div class="skeleton" style="height:16px;width:60%"></div>
              <div class="skeleton" style="height:20px;width:90%"></div>
              <div class="skeleton" style="height:14px;width:80%"></div>
            </div>
          </div>
        </div>
        <div v-else-if="newsError" class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <p>{{ t('errorLoad') }}</p>
        </div>
        <div v-else class="news-grid">
          <RouterLink
            v-for="article in latestNews"
            :key="article.id"
            :to="`/news/${article.id}`"
            class="news-card"
          >
            <div class="news-card-image">
              <img v-if="article.image" :src="article.image" :alt="article.title" class="news-img" loading="lazy" />
              <div v-else class="news-image-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <div class="news-cat-badge">
                {{ article.category === 'event' ? '📅 Событие' : article.category === 'announcement' ? '📢 Анонс' : '📰 Новость' }}
              </div>
              <span v-if="article.verified" class="news-verified">✓</span>
            </div>
            <div class="news-card-body">
              <div class="news-date">{{ formatDate(article.date) }}</div>
              <h3 class="news-title">{{ lang === 'kaz' ? article.titleKaz : article.title }}</h3>
              <p class="news-excerpt">{{ lang === 'kaz' ? article.excerptKaz : article.excerpt }}</p>
              <div class="news-card-footer">
                <span class="news-author">{{ article.author }}</span>
                <div class="news-stats">
                  <span>❤️ {{ article.likes }}</span>
                  <span>💬 {{ article.comments }}</span>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
        <div class="section-cta">
          <RouterLink to="/news" class="btn btn-outline btn-lg">Все новости</RouterLink>
        </div>
      </div>
    </section>

    <!-- ===== ASK AI ===== -->
    <section class="section ask-ai-section">
      <div class="container">
        <div class="ask-ai-box">
          <div class="ask-ai-left">
            <div class="ask-ai-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M8 12l2 2 4-4"/></svg>
            </div>
            <div>
              <h2 class="ask-ai-title">{{ t('askAI') }}</h2>
              <p class="ask-ai-subtitle">ИИ-консультант Senim даёт ответы на основе проверенной базы данных Алматы</p>
            </div>
          </div>
          <div class="ask-ai-form">
            <div class="ask-ai-input-wrap">
              <textarea
                v-model="aiQuestion"
                class="ask-ai-textarea"
                :placeholder="t('askAIPlaceholder')"
                rows="2"
                @keydown.ctrl.enter="submitAiQuestion"
              ></textarea>
              <button
                class="ask-ai-submit btn btn-primary"
                :disabled="!aiQuestion.trim()"
                @click="submitAiQuestion"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                {{ t('send') }}
              </button>
            </div>
            <div class="ask-ai-hint">Например: «реабилитация для ребёнка с ДЦП» или «оформить льготы»</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Org Modal -->
    <OrgModal :org="selectedOrg" @close="selectedOrg = null" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'
import { getFeaturedOrganizations } from '../api/organizations.js'
import { getLatestNews as fetchLatestNews } from '../api/news.js'
import OrganizationCard from '../components/OrganizationCard.vue'
import OrgModal from '../components/OrgModal.vue'

const authStore = useAuthStore()
const a11y = useAccessibilityStore()
const router = useRouter()
const lang = computed(() => a11y.lang)
const t = computed(() => useI18n(lang.value))

// Slider
const currentSlide = ref(0)
let sliderInterval = null
const slides = computed(() => [
  {
    title: t.value('heroTitle1'),
    desc: t.value('heroDesc1'),
    cta: t.value('heroCta1'),
    ctaLink: '/services/organizations',
    gradient: 'linear-gradient(135deg, #1B3FD8 0%, #1430A0 100%)'
  },
  {
    title: t.value('heroTitle2'),
    desc: t.value('heroDesc2'),
    cta: t.value('heroCta2'),
    ctaLink: '/services/ai',
    gradient: 'linear-gradient(135deg, #1C2333 0%, #1B3FD8 100%)'
  },
  {
    title: t.value('heroTitle3'),
    desc: t.value('heroDesc3'),
    cta: t.value('heroCta3'),
    ctaLink: '/services/organizations',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1B3FD8 100%)'
  }
])

const nextSlide = () => { currentSlide.value = (currentSlide.value + 1) % slides.value.length }
const prevSlide = () => { currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length }
const goToSlide = (i) => { currentSlide.value = i }

onMounted(() => { sliderInterval = setInterval(nextSlide, 4000) })
onUnmounted(() => clearInterval(sliderInterval))

// About features
const features = computed(() => [
  { icon: '✅', title: 'QA-проверка', desc: 'Каждая организация проходит верификацию' },
  { icon: '🤖', title: 'ИИ-консультант', desc: 'Ответы из локальной базы данных' },
  { icon: '♿', title: 'Доступность', desc: 'Режим контраста, шрифт, голос' },
])

// Orgs preview
const featuredOrgs = ref([])
const orgsLoading = ref(true)
const selectedOrg = ref(null)

// News
const latestNews = ref([])
const newsLoading = ref(true)
const newsError = ref(null)

onMounted(async () => {
  try {
    featuredOrgs.value = await getFeaturedOrganizations()
  } finally { orgsLoading.value = false }
  try {
    latestNews.value = await fetchLatestNews()
  } catch (e) { newsError.value = e.message }
  finally { newsLoading.value = false }
})

// AI Quick question
const aiQuestion = ref('')
const submitAiQuestion = () => {
  if (!aiQuestion.value.trim()) return
  router.push({ path: '/services/ai', query: { q: aiQuestion.value } })
}

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString(lang.value === 'kaz' ? 'kk-KZ' : 'ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
/* ===== HERO ===== */
.hero-section { margin-bottom: 0; }
.hero-slider { position: relative; overflow: hidden; height: 480px; }
.hero-slide {
  position: absolute; inset: 0;
  opacity: 0; transition: opacity 0.7s ease;
  display: flex; align-items: center;
}
.hero-slide.active { opacity: 1; z-index: 1; }
.hero-content {
  max-width: 620px;
  padding: 60px 0;
  position: relative; z-index: 2;
  animation: fadeUp 0.6s ease;
}
.hero-tag {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.9);
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: var(--fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  backdrop-filter: blur(8px);
}
.hero-title {
  font-size: var(--fs-4xl);
  font-weight: 800;
  color: white;
  line-height: 1.15;
  margin-bottom: 16px;
  letter-spacing: -1px;
}
.hero-desc {
  font-size: var(--fs-md);
  color: rgba(255,255,255,0.8);
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 500px;
}
.hero-cta { font-size: var(--fs-md); }
.hero-decor {
  position: absolute; right: 0; top: 0; bottom: 0; width: 40%;
  background: url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='300' cy='200' r='180' fill='rgba(255,255,255,0.04)'/%3E%3Ccircle cx='200' cy='100' r='120' fill='rgba(255,255,255,0.03)'/%3E%3C/svg%3E") center/cover no-repeat;
  pointer-events: none;
}
.slider-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  z-index: 10;
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
  color: white;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
  backdrop-filter: blur(8px);
}
.slider-arrow:hover { background: rgba(255,255,255,0.3); }
.slider-arrow-prev { left: 20px; }
.slider-arrow-next { right: 20px; }
.slider-dots {
  position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 8px; z-index: 10;
}
.slider-dot {
  width: 8px; height: 8px;
  background: rgba(255,255,255,0.4);
  border-radius: 50%;
  transition: all var(--transition);
}
.slider-dot.active { background: white; width: 24px; border-radius: 4px; }

/* ===== ABOUT ===== */
.about-section { background: var(--gray-50); }
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.about-visual { position: relative; }
.about-img-placeholder {
  background: linear-gradient(135deg, var(--primary-pale) 0%, rgba(27,63,216,0.1) 100%);
  border-radius: var(--radius-xl);
  height: 380px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  overflow: hidden;
}
.about-img-inner { display: flex; flex-direction: column; align-items: center; gap: 32px; }
.about-stat-cards { display: flex; gap: 16px; }
.about-stat {
  background: white;
  padding: 16px 24px;
  border-radius: var(--radius);
  text-align: center;
  box-shadow: var(--shadow);
}
.about-stat-blue { background: var(--primary); }
.about-stat-blue .about-stat-num, .about-stat-blue .about-stat-label { color: white; }
.about-stat-num { display: block; font-size: var(--fs-2xl); font-weight: 800; color: var(--primary); }
.about-stat-label { display: block; font-size: var(--fs-xs); color: var(--gray-500); font-weight: 600; }
.section-tag {
  display: inline-block;
  background: var(--primary-pale);
  color: var(--primary);
  padding: 4px 14px;
  border-radius: var(--radius-full);
  font-size: var(--fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}
.about-text { color: var(--gray-700); font-size: var(--fs-md); line-height: 1.7; margin-bottom: 24px; }
.about-features { display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px; }
.about-feature { display: flex; gap: 14px; align-items: flex-start; }
.feature-icon { font-size: 22px; flex-shrink: 0; }
.feature-title { font-weight: 700; font-size: var(--fs-sm); color: var(--black); }
.feature-desc { font-size: var(--fs-sm); color: var(--gray-500); }
.about-cta { display: flex; gap: 12px; flex-wrap: wrap; }

/* ===== ORGS PREVIEW ===== */
.orgs-preview-section {}
.orgs-circles-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}
.org-circle-btn {
  display: flex; flex-direction: column;
  align-items: center; gap: 10px;
  padding: 16px 8px;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
  cursor: pointer;
}
.org-circle-btn:hover { box-shadow: var(--shadow); transform: translateY(-3px); }
.org-circle-avatar {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: var(--primary-pale);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--fs-xl);
  font-weight: 800;
  color: var(--primary);
  position: relative;
  transition: all var(--transition);
}
.org-circle-btn:hover .org-circle-avatar { background: var(--primary); color: white; }
.org-circle-avatar.verified { border: 2px solid var(--success); }
.org-circle-check {
  position: absolute;
  bottom: -2px; right: -2px;
  width: 18px; height: 18px;
  background: var(--success);
  color: white;
  border-radius: 50%;
  font-size: 9px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  border: 2px solid white;
}
.org-circle-letter { font-size: var(--fs-lg); font-weight: 800; }
.org-circle-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--gray-700);
  text-align: center;
  line-height: 1.3;
}
.section-cta { text-align: center; margin-top: 40px; }

/* ===== NEWS ===== */
.news-section { background: var(--gray-50); }
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.news-card {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all var(--transition);
  text-decoration: none;
  color: inherit;
  display: flex; flex-direction: column;
}
.news-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
.news-card-image {
  height: 180px;
  background: linear-gradient(135deg, var(--gray-200) 0%, var(--gray-100) 100%);
  display: flex; align-items: center; justify-content: center;
  position: relative;
  overflow: hidden;
}
.news-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.news-card:hover .news-img { transform: scale(1.05); }
.news-image-placeholder { display: flex; align-items: center; justify-content: center; }
.news-cat-badge {
  position: absolute; bottom: 12px; left: 12px;
  background: white;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}
.news-verified {
  position: absolute; top: 12px; right: 12px;
  background: var(--success);
  color: white;
  width: 22px; height: 22px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
}
.news-card-body { padding: 20px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.news-date { font-size: var(--fs-xs); color: var(--gray-500); font-weight: 600; }
.news-title { font-size: var(--fs-md); font-weight: 700; color: var(--black); line-height: 1.4; }
.news-excerpt { font-size: var(--fs-sm); color: var(--gray-500); line-height: 1.6; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.news-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--gray-100); }
.news-author { font-size: var(--fs-xs); color: var(--gray-500); }
.news-stats { display: flex; gap: 10px; font-size: var(--fs-xs); color: var(--gray-500); }

/* ===== ASK AI ===== */
.ask-ai-section { background: var(--primary); }
.ask-ai-box {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 48px 0;
}
.ask-ai-left { display: flex; align-items: center; gap: 20px; flex-shrink: 0; }
.ask-ai-icon {
  width: 64px; height: 64px;
  background: rgba(255,255,255,0.15);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(8px);
}
.ask-ai-title { font-size: var(--fs-xl); font-weight: 800; color: white; margin-bottom: 4px; }
.ask-ai-subtitle { font-size: var(--fs-sm); color: rgba(255,255,255,0.75); max-width: 280px; }
.ask-ai-form { flex: 1; }
.ask-ai-input-wrap { display: flex; gap: 10px; align-items: flex-end; }
.ask-ai-textarea {
  flex: 1;
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.25);
  border-radius: var(--radius);
  padding: 14px 18px;
  color: white;
  font-size: var(--fs-base);
  resize: none;
  outline: none;
  transition: border-color var(--transition);
  backdrop-filter: blur(8px);
}
.ask-ai-textarea::placeholder { color: rgba(255,255,255,0.55); }
.ask-ai-textarea:focus { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.2); }
.ask-ai-submit { background: white; color: var(--primary); flex-shrink: 0; }
.ask-ai-submit:hover { background: var(--gray-50); }
.ask-ai-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.ask-ai-hint { font-size: var(--fs-xs); color: rgba(255,255,255,0.55); margin-top: 8px; }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .hero-title { font-size: var(--fs-3xl); }
  .hero-slider { height: 400px; }
  .about-grid { grid-template-columns: 1fr; }
  .about-visual { display: none; }
  .orgs-circles-grid { grid-template-columns: repeat(4, 1fr); }
  .news-grid { grid-template-columns: repeat(2, 1fr); }
  .ask-ai-box { flex-direction: column; gap: 24px; padding: 40px 0; }
  .ask-ai-left { flex-direction: column; text-align: center; }
}
@media (max-width: 560px) {
  .hero-title { font-size: var(--fs-2xl); }
  .hero-slider { height: 340px; }
  .orgs-circles-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .news-grid { grid-template-columns: 1fr; }
  .slider-arrow { display: none; }
}
</style>
