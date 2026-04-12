import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/home', redirect: '/' },

  // Services
  {
    path: '/services/organizations',
    name: 'organizations',
    component: () => import('../views/OrganizationsView.vue')
  },
  {
    path: '/services/ai',
    name: 'ai',
    component: () => import('../views/AIAssistantView.vue')
  },
  {
    path: '/services/accessibility-map',
    name: 'accessmap',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Карта доступности', icon: '🗺️' }
  },
  {
    path: '/services/jobs',
    name: 'jobs',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Жұмыс іздеу / Вакансии', icon: '💼' }
  },
  {
    path: '/services/documents',
    name: 'documents',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Құжаттарды рәсімдеу / Документы', icon: '📋' }
  },

  // Projects
  {
    path: '/projects/forums',
    name: 'forums',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Форумдар / Форумы', icon: '💬' }
  },
  {
    path: '/projects/community',
    name: 'community',
    component: () => import('../views/CommunityView.vue')
  },

  // InvaTaxi — unified page (order, my rides, drivers, manager panel)
  {
    path: '/inva-taxi',
    name: 'inva-taxi',
    component: () => import('../views/InvaTaxiView.vue')
  },
  // Legacy redirects for old deep links
  { path: '/inva-taxi/order', redirect: '/inva-taxi' },
  { path: '/inva-taxi/my-rides', redirect: '/inva-taxi' },
  { path: '/inva-taxi/chat', redirect: '/inva-taxi' },

  // News
  {
    path: '/news',
    name: 'news',
    component: () => import('../views/NewsView.vue')
  },
  {
    path: '/news/:id',
    name: 'news-detail',
    component: () => import('../views/NewsDetailView.vue')
  },

  // Info
  {
    path: '/info',
    name: 'info',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Қосымша ақпараттар / Доп. информация', icon: '📚' }
  },

  // Help
  {
    path: '/help',
    name: 'help',
    component: () => import('../views/HelpView.vue')
  },

  // Auth
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },

  // Profile
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Мой профиль', icon: '👤' }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Избранное / Таңдаулылар', icon: '❤️' }
  },
  {
    path: '/requests',
    name: 'requests',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Мои заявки', icon: '📋' }
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Страница не найдена', icon: '🔍' }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
