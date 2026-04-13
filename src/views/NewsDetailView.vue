<template>
  <main class="page-content">
    <div class="container news-detail-content">
      <RouterLink to="/news" class="back-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        {{ a11y.lang === 'kaz' ? 'Барлық жаңалықтар' : 'Все новости' }}
      </RouterLink>

      <!-- Skeleton -->
      <div v-if="loading" class="news-detail-skeleton">
        <div class="skeleton" style="height:32px;width:60%;margin-bottom:12px;border-radius:8px"></div>
        <div class="skeleton" style="height:18px;width:40%;margin-bottom:32px;border-radius:8px"></div>
        <div class="skeleton" style="height:280px;margin-bottom:24px;border-radius:12px"></div>
        <div v-for="i in 4" :key="i" class="skeleton" style="height:16px;margin-bottom:10px;border-radius:6px"></div>
      </div>

      <!-- Not found -->
      <div v-else-if="!article" class="empty-state">
        <div class="empty-state-icon">📰</div>
        <p>{{ a11y.lang === 'kaz' ? 'Жаңалық табылмады' : 'Новость не найдена' }}</p>
        <RouterLink to="/news" class="btn btn-primary mt-4">{{ a11y.lang === 'kaz' ? 'Барлық жаңалықтар' : 'Все новости' }}</RouterLink>
      </div>

      <!-- Article -->
      <article v-else class="news-article">
        <div class="news-article-meta">
          <span class="news-article-cat">
            {{ article.category === 'event' ? '📅 ' + (a11y.lang==='kaz'?'Оқиға':'Событие')
             : article.category === 'announcement' ? '📢 ' + (a11y.lang==='kaz'?'Хабарландыру':'Анонс')
             : '📰 ' + (a11y.lang==='kaz'?'Жаңалық':'Новость') }}
          </span>
          <span class="news-article-date">{{ formatDate(article.publishedAt) }}</span>
          <span v-if="article.status === 'PUBLISHED'" class="badge badge-verified">✓ {{ a11y.lang==='kaz'?'Тексерілді':'Проверено' }}</span>
        </div>

        <h1 class="news-article-title">{{ a11y.lang === 'kaz' ? article.titleKk : article.titleRu }}</h1>

        <div class="news-article-author">
          <div class="author-avatar">{{ (article.author?.profile?.firstName || '?').charAt(0) }}</div>
          {{ article.author?.profile?.firstName || '' }}
        </div>

        <div class="news-article-image">
          <img v-if="article.imageUrl" :src="article.imageUrl" :alt="article.titleRu" class="news-detail-img" />
          <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>

        <div class="news-article-body">
          <p>{{ a11y.lang === 'kaz' ? article.bodyKk : article.bodyRu }}</p>
        </div>

        <!-- Likes + comments count -->
        <div class="news-article-footer">
          <button
            class="like-btn-big"
            :class="{ liked: isLiked }"
            :disabled="likeLoading"
            @click="handleLike"
          >
            <svg width="20" height="20" viewBox="0 0 24 24"
              :fill="isLiked ? '#EF4444' : 'none'"
              stroke="#EF4444" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {{ displayLikes }}
          </button>
          <span class="news-article-comments">
            💬 {{ displayComments }} {{ a11y.lang==='kaz' ? 'пікір' : 'комментариев' }}
          </span>
        </div>

        <!-- ── Comments section ── -->
        <section class="comments-section">
          <h2 class="comments-title">
            💬 {{ a11y.lang==='kaz' ? 'Пікірлер' : 'Комментарии' }}
          </h2>

          <!-- Add comment (authenticated only) -->
          <div v-if="authStore.isAuthenticated" class="add-comment-form">
            <div class="comment-form-avatar">{{ commentAuthorInitial }}</div>
            <div class="comment-form-body">
              <textarea
                v-model="newComment"
                class="comment-textarea"
                :placeholder="a11y.lang==='kaz' ? 'Пікіріңізді жазыңыз...' : 'Напишите комментарий...'"
                rows="2"
                @keydown.ctrl.enter="submitComment"
              />
              <div class="comment-form-row">
                <span class="comment-hint">{{ a11y.lang==='kaz' ? 'Ctrl+Enter — жіберу' : 'Ctrl+Enter — отправить' }}</span>
                <button
                  class="btn btn-primary btn-sm"
                  :disabled="!newComment.trim() || commentLoading"
                  @click="submitComment"
                >
                  <span v-if="commentLoading" class="spinner-sm"></span>
                  {{ a11y.lang==='kaz' ? 'Жіберу' : 'Отправить' }}
                </button>
              </div>
            </div>
          </div>
          <div v-else class="comment-login-hint">
            <RouterLink to="/login" class="btn btn-outline btn-sm">
              {{ a11y.lang==='kaz' ? 'Пікір қалдыру үшін кіріңіз' : 'Войдите, чтобы оставить комментарий' }}
            </RouterLink>
          </div>

          <!-- Pending notice after submit -->
          <Transition name="fade">
            <div v-if="commentSuccess" class="comment-pending-notice">
              ⏳ {{ a11y.lang==='kaz'
                ? 'Пікіріңіз модерация күтуде. Бекітілгеннен кейін пайда болады.'
                : 'Ваш комментарий ожидает модерации. Он появится после одобрения.' }}
            </div>
          </Transition>

          <!-- Loading comments -->
          <div v-if="commentsLoading" class="comments-loading">
            <div class="spinner-sm" style="margin: 0 auto"></div>
          </div>

          <!-- Comments list -->
          <div v-else-if="comments.length" class="comments-list">
            <div
              v-for="c in comments"
              :key="c.id"
              class="comment-item"
            >
              <div class="comment-avatar">
                <img v-if="c.author?.profile?.avatarUrl" :src="c.author.profile.avatarUrl" />
                <span v-else>{{ (c.author?.profile?.firstName || '?').charAt(0) }}</span>
              </div>
              <div class="comment-body">
                <div class="comment-meta">
                  <span class="comment-author">{{ c.author?.profile?.firstName || (a11y.lang==='kaz'?'Пайдаланушы':'Пользователь') }}</span>
                  <span class="comment-date">{{ formatDate(c.createdAt) }}</span>
                  <span v-if="c.status === 'PENDING'" class="comment-status-badge">⏳ {{ a11y.lang==='kaz'?'Күтуде':'Ожидает' }}</span>
                </div>
                <p class="comment-text">{{ c.text }}</p>
              </div>
            </div>
          </div>

          <div v-else class="comments-empty">
            <p>{{ a11y.lang==='kaz' ? 'Пікірлер жоқ. Бірінші болыңыз!' : 'Комментариев пока нет. Будьте первым!' }}</p>
          </div>
        </section>
      </article>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useAuthStore } from '../stores/auth.js'
import { getNewsById, likeNews, getNewsComments, addNewsComment } from '../api/news.js'

const a11y = useAccessibilityStore()
const authStore = useAuthStore()
const route = useRoute()

const article = ref(null)
const loading = ref(true)
const isLiked = ref(false)
const displayLikes = ref(0)
const displayComments = ref(0)
const likeLoading = ref(false)

// Comments
const comments = ref([])
const commentsLoading = ref(false)
const newComment = ref('')
const commentLoading = ref(false)
const commentSuccess = ref(false)

const commentAuthorInitial = computed(() => {
  const u = authStore.user
  return ((u?.firstName?.[0] || '') + (u?.lastName?.[0] || '')).toUpperCase() || '?'
})

onMounted(async () => {
  try {
    const data = await getNewsById(route.params.id)
    article.value = data
    displayLikes.value = data.likesCount ?? 0
    displayComments.value = data.commentsCount ?? 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
  loadComments()
})

async function loadComments() {
  commentsLoading.value = true
  try {
    comments.value = await getNewsComments(route.params.id)
  } catch {}
  finally { commentsLoading.value = false }
}

async function handleLike() {
  if (!authStore.isAuthenticated || likeLoading.value) return
  likeLoading.value = true
  try {
    const res = await likeNews(route.params.id)
    isLiked.value = res.liked
    displayLikes.value = res.likesCount
  } catch (e) { console.error(e) }
  finally { likeLoading.value = false }
}

async function submitComment() {
  const text = newComment.value.trim()
  if (!text || commentLoading.value) return
  commentLoading.value = true
  try {
    await addNewsComment(route.params.id, text)
    newComment.value = ''
    commentSuccess.value = true
    setTimeout(() => { commentSuccess.value = false }, 4000)
    await loadComments()
  } catch (e) { console.error(e) }
  finally { commentLoading.value = false }
}

const formatDate = (d) => d
  ? new Date(d).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
  : ''
</script>

<style scoped>
.news-detail-content { padding: 32px 0 64px; max-width: 760px; }

.back-btn { display: inline-flex; align-items: center; gap: 6px; color: var(--primary); font-size: var(--fs-sm); font-weight: 600; text-decoration: none; margin-bottom: 28px; padding: 8px 14px; background: var(--primary-pale); border-radius: var(--radius-full); transition: all var(--transition); }
.back-btn:hover { background: var(--primary); color: white; }

.news-article-meta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
.news-article-cat { font-size: var(--fs-sm); font-weight: 600; }
.news-article-date { font-size: var(--fs-sm); color: var(--gray-500); }
.news-article-title { font-size: var(--fs-3xl); font-weight: 800; color: var(--black); line-height: 1.2; margin-bottom: 20px; }
.news-article-author { display: flex; align-items: center; gap: 10px; font-size: var(--fs-sm); color: var(--gray-500); font-weight: 600; margin-bottom: 24px; }
.author-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--primary-pale); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: var(--fs-sm); }
.news-article-image { background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%); border-radius: var(--radius-lg); height: 280px; display: flex; align-items: center; justify-content: center; margin-bottom: 28px; overflow: hidden; }
.news-detail-img { width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-lg); }
.news-article-body { font-size: var(--fs-md); line-height: 1.8; color: var(--gray-700); margin-bottom: 0; }

.news-article-footer { display: flex; align-items: center; gap: 20px; margin-top: 32px; padding: 20px 0; border-top: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); }
.like-btn-big { display: flex; align-items: center; gap: 8px; font-size: var(--fs-md); font-weight: 600; color: var(--gray-700); transition: color var(--transition); cursor: pointer; background: none; border: none; padding: 0; }
.like-btn-big:hover { color: #EF4444; }
.like-btn-big.liked { color: #EF4444; }
.like-btn-big:disabled { opacity: 0.6; cursor: not-allowed; }
.news-article-comments { font-size: var(--fs-sm); color: var(--gray-500); }

/* ── Comments ── */
.comments-section { margin-top: 40px; }
.comments-title { font-size: var(--fs-xl); font-weight: 700; color: var(--black); margin-bottom: 24px; }

.add-comment-form { display: flex; gap: 12px; margin-bottom: 20px; }
.comment-form-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--primary-pale); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: var(--fs-sm); flex-shrink: 0; }
.comment-form-body { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.comment-textarea { width: 100%; padding: 10px 14px; border: 1.5px solid var(--gray-200); border-radius: var(--radius-md); font-size: var(--fs-sm); resize: none; font-family: inherit; transition: border-color var(--transition); }
.comment-textarea:focus { outline: none; border-color: var(--primary); }
.comment-form-row { display: flex; justify-content: space-between; align-items: center; }
.comment-hint { font-size: 0.75rem; color: var(--gray-400); }

.comment-login-hint { margin-bottom: 20px; }

.comment-pending-notice { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 12px 16px; border-radius: var(--radius-md); font-size: var(--fs-sm); margin-bottom: 16px; }

.comments-loading { text-align: center; padding: 20px; }

.comments-list { display: flex; flex-direction: column; gap: 20px; }
.comment-item { display: flex; gap: 12px; }
.comment-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--gray-100); color: var(--gray-500); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: var(--fs-sm); flex-shrink: 0; overflow: hidden; }
.comment-avatar img { width: 100%; height: 100%; object-fit: cover; }
.comment-body { flex: 1; }
.comment-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
.comment-author { font-size: var(--fs-sm); font-weight: 700; color: var(--black); }
.comment-date { font-size: 0.75rem; color: var(--gray-400); }
.comment-status-badge { font-size: 0.72rem; background: #fef3c7; color: #92400e; padding: 1px 6px; border-radius: 50px; }
.comment-text { font-size: var(--fs-sm); color: var(--gray-700); line-height: 1.55; margin: 0; }
.comments-empty { color: var(--gray-400); font-size: var(--fs-sm); padding: 16px 0; }

/* fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
