<template>
  <main class="page-content">
    <div class="container news-detail-content">
      <RouterLink to="/news" class="back-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Все новости
      </RouterLink>

      <div v-if="loading" class="news-detail-skeleton">
        <div class="skeleton" style="height:32px;width:60%;margin-bottom:12px;border-radius:8px"></div>
        <div class="skeleton" style="height:18px;width:40%;margin-bottom:32px;border-radius:8px"></div>
        <div class="skeleton" style="height:280px;margin-bottom:24px;border-radius:12px"></div>
        <div v-for="i in 4" :key="i" class="skeleton" style="height:16px;margin-bottom:10px;border-radius:6px"></div>
      </div>
      <div v-else-if="!article" class="empty-state">
        <div class="empty-state-icon">📰</div>
        <p>Новость не найдена</p>
        <RouterLink to="/news" class="btn btn-primary mt-4">Все новости</RouterLink>
      </div>
      <article v-else class="news-article">
        <div class="news-article-meta">
          <span class="news-article-cat">
            {{ article.category === 'event' ? '📅 Событие' : article.category === 'announcement' ? '📢 Анонс' : '📰 Новость' }}
          </span>
          <span class="news-article-date">{{ formatDate(article.date) }}</span>
          <span v-if="article.verified" class="badge badge-verified">✓ Проверено</span>
        </div>
        <h1 class="news-article-title">{{ a11y.lang === 'kaz' ? article.titleKaz : article.title }}</h1>
        <div class="news-article-author">
          <div class="author-avatar">{{ article.author?.charAt(0) }}</div>
          {{ article.author }}
        </div>
        <div class="news-article-image">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <div class="news-article-body">
          <p class="news-lead">{{ a11y.lang === 'kaz' ? article.excerptKaz : article.excerpt }}</p>
          <p>{{ article.content }}</p>
        </div>
        <div class="news-article-footer">
          <button class="like-btn-big" @click="liked = !liked">
            <svg width="20" height="20" viewBox="0 0 24 24" :fill="liked ? '#EF4444' : 'none'" stroke="#EF4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {{ article.likes + (liked ? 1 : 0) }}
          </button>
          <span class="news-article-comments">💬 {{ article.comments }} комментариев</span>
        </div>
      </article>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { getNewsById } from '../api/news.js'

const a11y = useAccessibilityStore()
const route = useRoute()
const article = ref(null)
const loading = ref(true)
const liked = ref(false)

onMounted(async () => { article.value = await getNewsById(route.params.id); loading.value = false })
const formatDate = (d) => d ? new Date(d).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
</script>

<style scoped>
.news-detail-content { padding: 32px 0 64px; max-width: 760px; }
.back-btn { display: inline-flex; align-items: center; gap: 6px; color: var(--primary); font-size: var(--fs-sm); font-weight: 600; text-decoration: none; margin-bottom: 28px; padding: 8px 14px; background: var(--primary-pale); border-radius: var(--radius-full); transition: all var(--transition); }
.back-btn:hover { background: var(--primary); color: white; }
.news-article {}
.news-article-meta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
.news-article-cat { font-size: var(--fs-sm); font-weight: 600; }
.news-article-date { font-size: var(--fs-sm); color: var(--gray-500); }
.news-article-title { font-size: var(--fs-3xl); font-weight: 800; color: var(--black); line-height: 1.2; margin-bottom: 20px; }
.news-article-author { display: flex; align-items: center; gap: 10px; font-size: var(--fs-sm); color: var(--gray-500); font-weight: 600; margin-bottom: 24px; }
.author-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--primary-pale); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: var(--fs-sm); }
.news-article-image { background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%); border-radius: var(--radius-lg); height: 280px; display: flex; align-items: center; justify-content: center; margin-bottom: 28px; }
.news-article-body { font-size: var(--fs-md); line-height: 1.8; color: var(--gray-700); }
.news-lead { font-weight: 600; color: var(--black); font-size: var(--fs-lg); margin-bottom: 16px; }
.news-article-footer { display: flex; align-items: center; gap: 20px; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--gray-200); }
.like-btn-big { display: flex; align-items: center; gap: 8px; font-size: var(--fs-md); font-weight: 600; color: var(--gray-700); transition: color var(--transition); }
.like-btn-big:hover { color: #EF4444; }
.news-article-comments { font-size: var(--fs-sm); color: var(--gray-500); }
</style>
