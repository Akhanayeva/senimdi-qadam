<template>
  <main class="page-content">
    <div class="news-page">
      <div class="news-page-header">
        <div class="container">
          <h1 class="page-h1">{{ t('news') }}</h1>
          <p class="page-desc">Актуальные новости, события и анонсы для людей с инвалидностью в Алматы</p>
        </div>
      </div>
      <div class="container news-content">
        <div v-if="loading" class="news-grid-full">
          <div v-for="i in 6" :key="i" class="news-skeleton">
            <div class="skeleton" style="height:200px;border-radius:12px 12px 0 0;"></div>
            <div style="padding:16px;display:flex;flex-direction:column;gap:8px">
              <div class="skeleton" style="height:14px;width:50%"></div>
              <div class="skeleton" style="height:20px;width:90%"></div>
              <div class="skeleton" style="height:13px;width:80%"></div>
            </div>
          </div>
        </div>
        <div v-else class="news-grid-full">
          <RouterLink
            v-for="article in news"
            :key="article.id"
            :to="`/news/${article.id}`"
            class="news-card-full"
          >
            <div class="news-card-img">
              <img v-if="article.imageUrl" :src="article.imageUrl" :alt="article.titleRu" class="news-img" loading="lazy" />
              <svg v-else width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span class="news-badge-cat">
                {{ article.category === 'event' ? '📅' : article.category === 'announcement' ? '📢' : '📰' }}
              </span>
              <span v-if="article.status === 'PUBLISHED'" class="news-v">✓</span>
            </div>
            <div class="news-card-body">
              <div class="news-meta">
                <span class="news-date">{{ formatDate(article.publishedAt) }}</span>
                <span class="news-author">{{ article.author?.profile?.firstName || '' }}</span>
              </div>
              <h2 class="news-card-title">{{ a11y.lang === 'kaz' ? article.titleKk : article.titleRu }}</h2>
              <p class="news-card-excerpt">{{ excerpt(article) }}</p>
              <div class="news-card-stats">
                <button class="like-btn" @click.prevent="toggleLike(article)">
                  <svg width="14" height="14" viewBox="0 0 24 24" :fill="likedNews.has(article.id) ? '#EF4444' : 'none'" stroke="#EF4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  {{ article.likesCount + (likedNews.has(article.id) ? 1 : 0) }}
                </button>
                <span class="news-comments-count">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {{ article.commentsCount }}
                </span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'
import { getNews } from '../api/news.js'

const a11y = useAccessibilityStore()
const t = computed(() => useI18n(a11y.lang))
const news = ref([])
const loading = ref(true)
const likedNews = ref(new Set())

onMounted(async () => {
  const res = await getNews()
  // API returns { items, total }; fallback to plain array for safety
  news.value = res.items ?? res
  loading.value = false
})

const formatDate = (d) => d ? new Date(d).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

// First 140 chars of body as excerpt
const excerpt = (article) => {
  const body = a11y.lang === 'kaz' ? article.bodyKk : article.bodyRu
  return body ? body.slice(0, 140) + (body.length > 140 ? '…' : '') : ''
}

const toggleLike = (article) => {
  if (likedNews.value.has(article.id)) likedNews.value.delete(article.id)
  else likedNews.value.add(article.id)
}
</script>

<style scoped>
.news-page-header { background: linear-gradient(135deg, var(--dark) 0%, var(--primary-dark) 100%); padding: 48px 0 40px; margin-bottom: 32px; }
.page-h1 { font-size: var(--fs-3xl); font-weight: 800; color: white; margin-bottom: 8px; }
.page-desc { color: rgba(255,255,255,0.7); font-size: var(--fs-md); }
.news-content { padding-bottom: 64px; }
.news-grid-full { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.news-card-full {
  background: white; border-radius: var(--radius-lg);
  overflow: hidden; box-shadow: var(--shadow);
  transition: all var(--transition); text-decoration: none; color: inherit;
  display: flex; flex-direction: column;
}
.news-card-full:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
.news-card-img {
  height: 200px; background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.news-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.news-card-full:hover .news-img { transform: scale(1.05); }
.news-badge-cat { position: absolute; bottom: 12px; left: 12px; font-size: 18px; }
.news-v { position: absolute; top: 12px; right: 12px; background: var(--success); color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
.news-card-body { padding: 20px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.news-meta { display: flex; justify-content: space-between; font-size: var(--fs-xs); color: var(--gray-500); }
.news-card-title { font-size: var(--fs-lg); font-weight: 700; color: var(--black); line-height: 1.4; }
.news-card-excerpt { font-size: var(--fs-sm); color: var(--gray-500); line-height: 1.6; flex: 1; }
.news-card-stats { display: flex; gap: 14px; align-items: center; padding-top: 10px; border-top: 1px solid var(--gray-100); margin-top: auto; }
.like-btn { display: flex; align-items: center; gap: 5px; font-size: var(--fs-xs); color: var(--gray-500); transition: color var(--transition); }
.like-btn:hover { color: #EF4444; }
.news-comments-count { display: flex; align-items: center; gap: 5px; font-size: var(--fs-xs); color: var(--gray-500); }
@media (max-width: 900px) { .news-grid-full { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .news-grid-full { grid-template-columns: 1fr; } }
</style>
