<template>
  <div class="guides-page" :class="{ dark: isDark }">

    <!-- Hero -->
    <section class="guides-hero">
      <div class="hero-content">
        <h1>{{ lang === 'kaz' ? 'Нұсқаулықтар' : 'Руководства' }}</h1>
        <p>{{ lang === 'kaz'
          ? 'Мүгедектігі бар адамдарға арналған пайдалы ақпарат пен нұсқаулықтар'
          : 'Полезная информация и практические руководства для людей с инвалидностью' }}</p>

        <!-- Search -->
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="lang === 'kaz' ? 'Іздеу...' : 'Поиск...'"
            @input="onSearch"
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''; loadGuides()">✕</button>
        </div>
      </div>
    </section>

    <!-- Category filters -->
    <section class="category-bar">
      <div class="category-scroll">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="cat-btn"
          :class="{ active: selectedCategory === cat.value }"
          @click="selectCategory(cat.value)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          {{ lang === 'kaz' ? cat.labelKk : cat.labelRu }}
        </button>
      </div>
    </section>

    <!-- Main content -->
    <section class="guides-content">
      <div class="container">

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>{{ lang === 'kaz' ? 'Жүктелуде...' : 'Загрузка...' }}</p>
        </div>

        <!-- Empty -->
        <div v-else-if="guides.length === 0" class="empty-state">
          <span class="empty-icon">📋</span>
          <p>{{ lang === 'kaz' ? 'Нұсқаулықтар табылмады' : 'Руководства не найдены' }}</p>
        </div>

        <!-- Grid -->
        <div v-else class="guides-grid">
          <article
            v-for="guide in guides"
            :key="guide.id"
            class="guide-card"
            @click="openGuide(guide)"
          >
            <div class="card-header">
              <span class="cat-badge" :class="`cat-${guide.category}`">
                {{ getCatLabel(guide.category) }}
              </span>
              <span class="likes-badge">
                <button
                  class="like-btn"
                  :class="{ liked: likedIds.includes(guide.id) }"
                  @click.stop="toggleLike(guide)"
                >
                  {{ likedIds.includes(guide.id) ? '❤️' : '🤍' }}
                </button>
                {{ guide.likesCount }}
              </span>
            </div>

            <h3 class="card-title">
              {{ lang === 'kaz' ? guide.titleKk : guide.titleRu }}
            </h3>

            <p class="card-excerpt">
              {{ excerpt(lang === 'kaz' ? guide.bodyKk : guide.bodyRu) }}
            </p>

            <div class="card-footer">
              <span class="card-date">{{ formatDate(guide.createdAt) }}</span>
              <span class="card-tags">
                <span v-for="tag in (guide.tags || []).slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
              </span>
              <span class="read-more">
                {{ lang === 'kaz' ? 'Толығырақ →' : 'Читать →' }}
              </span>
            </div>
          </article>
        </div>

        <!-- Total -->
        <p v-if="total > 0 && !loading" class="total-count">
          {{ lang === 'kaz' ? `Барлығы: ${total} нұсқаулық` : `Всего: ${total} руководств` }}
        </p>
      </div>
    </section>

    <!-- Guide detail modal -->
    <Teleport to="body">
      <div v-if="selectedGuide" class="modal-overlay" @click.self="closeGuide">
        <div class="modal-card">
          <div class="modal-header">
            <span class="cat-badge" :class="`cat-${selectedGuide.category}`">
              {{ getCatLabel(selectedGuide.category) }}
            </span>
            <button class="modal-close" @click="closeGuide">✕</button>
          </div>

          <h2 class="modal-title">
            {{ lang === 'kaz' ? selectedGuide.titleKk : selectedGuide.titleRu }}
          </h2>

          <div class="modal-meta">
            <span>📅 {{ formatDate(selectedGuide.createdAt) }}</span>
            <span class="likes-badge">
              <button
                class="like-btn"
                :class="{ liked: likedIds.includes(selectedGuide.id) }"
                @click="toggleLike(selectedGuide)"
              >
                {{ likedIds.includes(selectedGuide.id) ? '❤️' : '🤍' }}
              </button>
              {{ selectedGuide.likesCount }}
            </span>
          </div>

          <div class="modal-body" v-html="renderMarkdown(lang === 'kaz' ? selectedGuide.bodyKk : selectedGuide.bodyRu)"></div>

          <div class="modal-tags">
            <span v-for="tag in (selectedGuide.tags || [])" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAccessibilityStore } from '../stores/accessibility'
import { getGuides, likeGuide, getLikedGuideIds } from '../api/guides'

const accessStore = useAccessibilityStore()
const lang = computed(() => accessStore.lang)
const isDark = computed(() => accessStore.darkMode)

// State
const guides = ref([])
const total = ref(0)
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedGuide = ref(null)
const likedIds = ref([])

let searchTimeout = null

// Categories config
const categories = [
  { value: 'all',           icon: '📚', labelRu: 'Все',           labelKk: 'Барлығы' },
  { value: 'legal',         icon: '⚖️', labelRu: 'Правовые',      labelKk: 'Құқықтық' },
  { value: 'social',        icon: '🏛️', labelRu: 'Социальные',    labelKk: 'Әлеуметтік' },
  { value: 'employment',    icon: '💼', labelRu: 'Трудоустройство', labelKk: 'Жұмыс' },
  { value: 'health',        icon: '🏥', labelRu: 'Здоровье',       labelKk: 'Денсаулық' },
  { value: 'accessibility', icon: '♿', labelRu: 'Доступность',    labelKk: 'Қолжетімділік' },
  { value: 'education',     icon: '🎓', labelRu: 'Образование',    labelKk: 'Білім' },
]

function getCatLabel(catValue) {
  const cat = categories.find(c => c.value === catValue)
  if (!cat) return catValue
  return lang.value === 'kaz' ? cat.labelKk : cat.labelRu
}

async function loadGuides() {
  loading.value = true
  try {
    const res = await getGuides({
      category: selectedCategory.value,
      search: searchQuery.value,
    })
    guides.value = res.items
    total.value = res.total
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function loadLiked() {
  try {
    likedIds.value = await getLikedGuideIds()
  } catch {}
}

function selectCategory(cat) {
  selectedCategory.value = cat
  loadGuides()
}

function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(loadGuides, 400)
}

async function toggleLike(guide) {
  try {
    const res = await likeGuide(guide.id)
    guide.likesCount = res.likesCount
    if (res.liked) {
      if (!likedIds.value.includes(guide.id)) likedIds.value.push(guide.id)
    } else {
      likedIds.value = likedIds.value.filter(id => id !== guide.id)
    }
    // sync selected guide if open
    if (selectedGuide.value?.id === guide.id) {
      selectedGuide.value = { ...selectedGuide.value, likesCount: res.likesCount }
    }
  } catch (e) {
    console.error(e)
  }
}

function openGuide(guide) {
  selectedGuide.value = { ...guide }
  document.body.style.overflow = 'hidden'
}

function closeGuide() {
  selectedGuide.value = null
  document.body.style.overflow = ''
}

// Simple markdown renderer: **bold**, bullet lists, numbered lists
function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)/, '<p>$1')
    + '</p>'
}

function excerpt(text, len = 150) {
  if (!text) return ''
  // Strip markdown
  const clean = text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^[-\d]+\. /gm, '').replace(/^- /gm, '')
  return clean.length > len ? clean.slice(0, len) + '…' : clean
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang.value === 'kaz' ? 'kk-KZ' : 'ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

onMounted(() => {
  loadGuides()
  loadLiked()
})

// Reload when language changes
watch(lang, loadGuides)
</script>

<style scoped>
/* ── Base ── */
.guides-page {
  min-height: 100vh;
  background: #f4f6fa;
  color: #1a1a2e;
  transition: background 0.3s, color 0.3s;
}
.guides-page.dark {
  background: #0f0f1a;
  color: #e8e8f0;
}

/* ── Hero ── */
.guides-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 3rem 1.5rem 2.5rem;
  text-align: center;
}
.hero-content h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
}
.hero-content p {
  font-size: 1.05rem;
  opacity: 0.9;
  margin: 0 0 1.5rem;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

/* Search */
.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 50px;
  padding: 0.6rem 1.2rem;
  max-width: 480px;
  margin: 0 auto;
  backdrop-filter: blur(6px);
}
.search-icon { font-size: 1.1rem; margin-right: 0.6rem; }
.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 1rem;
}
.search-bar input::placeholder { color: rgba(255,255,255,0.7); }
.clear-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  font-size: 1rem;
  padding: 0 0.3rem;
}

/* ── Categories ── */
.category-bar {
  background: #fff;
  border-bottom: 1px solid #e8ecf4;
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
}
.dark .category-bar {
  background: #1a1a2e;
  border-color: #2a2a4a;
}
.category-scroll {
  display: flex;
  gap: 0.5rem;
  padding: 0 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
}
.category-scroll::-webkit-scrollbar { display: none; }
.cat-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border-radius: 50px;
  border: 1.5px solid #d8dcee;
  background: transparent;
  color: #555;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.dark .cat-btn { color: #aaa; border-color: #3a3a5a; }
.cat-btn:hover { border-color: #667eea; color: #667eea; }
.cat-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-color: transparent;
}
.cat-icon { font-size: 1rem; }

/* ── Content ── */
.guides-content { padding: 2rem 0 3rem; }
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem;
  color: #888;
}
.spinner {
  width: 40px; height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Empty */
.empty-state {
  text-align: center;
  padding: 4rem;
  color: #888;
}
.empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }

/* Grid */
.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Card */
.guide-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e8ecf4;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.dark .guide-card {
  background: #1a1a2e;
  border-color: #2a2a4a;
}
.guide-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(102,126,234,0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Category badges */
.cat-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
}
.cat-legal         { background: #e8f0fe; color: #1a73e8; }
.cat-social        { background: #fce8f1; color: #d81b60; }
.cat-employment    { background: #e6f4ea; color: #34a853; }
.cat-health        { background: #fef7e0; color: #f9ab00; }
.cat-accessibility { background: #f3e8fd; color: #9c27b0; }
.cat-education     { background: #e8f5e9; color: #2e7d32; }
.dark .cat-legal         { background: #1a2f4a; color: #64b5f6; }
.dark .cat-social        { background: #3a1a2e; color: #f48fb1; }
.dark .cat-employment    { background: #1a3a2e; color: #81c784; }
.dark .cat-health        { background: #3a3010; color: #ffcc02; }
.dark .cat-accessibility { background: #2a1a3a; color: #ce93d8; }
.dark .cat-education     { background: #1a2e1a; color: #a5d6a7; }

.likes-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: #888;
}
.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  transition: transform 0.15s;
}
.like-btn:hover { transform: scale(1.3); }

.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
  color: #1a1a2e;
}
.dark .card-title { color: #e8e8f0; }

.card-excerpt {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
  flex: 1;
}
.dark .card-excerpt { color: #9090b0; }

.card-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: auto;
}
.card-date { font-size: 0.78rem; color: #aaa; }
.card-tags { display: flex; gap: 0.3rem; flex: 1; }
.tag {
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  background: #f0f2fa;
  color: #667eea;
  border-radius: 50px;
}
.dark .tag { background: #2a2a4a; color: #a0a8e0; }
.read-more {
  font-size: 0.85rem;
  color: #667eea;
  font-weight: 600;
  white-space: nowrap;
}

.total-count {
  text-align: center;
  margin-top: 2rem;
  color: #aaa;
  font-size: 0.9rem;
}

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}
.modal-card {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
}
.dark .modal-card {
  background: #1a1a2e;
  color: #e8e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}
.modal-close {
  background: #f0f0f0;
  border: none;
  width: 32px; height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dark .modal-close { background: #2a2a4a; color: #aaa; }

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.75rem;
}

.modal-meta {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.modal-body {
  font-size: 1rem;
  line-height: 1.75;
  color: #333;
}
.dark .modal-body { color: #ccc; }
.modal-body :deep(strong) { color: #1a1a2e; font-weight: 700; }
.dark .modal-body :deep(strong) { color: #e8e8f0; }
.modal-body :deep(ul) { padding-left: 1.5rem; margin: 0.5rem 0; }
.modal-body :deep(li) { margin-bottom: 0.35rem; }
.modal-body :deep(p) { margin: 0 0 0.75rem; }

.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e8ecf4;
}
.dark .modal-tags { border-color: #2a2a4a; }

/* Responsive */
@media (max-width: 600px) {
  .hero-content h1 { font-size: 1.6rem; }
  .guides-grid { grid-template-columns: 1fr; }
  .modal-card { padding: 1.25rem; }
  .modal-title { font-size: 1.2rem; }
}
</style>
