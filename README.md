# СенімдіҚадам — Frontend

**SenimdiQadam** — веб-платформа для людей с инвалидностью в Алматы, Казахстан.  
Дипломный проект, 2026.

---

## О проекте

Платформа помогает людям с инвалидностью и их опекунам находить организации, получать юридическую и социальную помощь, вызывать специализированное такси и общаться с AI-ассистентом на русском и казахском языках.

**Основные возможности:**
- Каталог организаций с фильтрами, рейтингами и отзывами
- Лента новостей с системой лайков и комментариев (с модерацией)
- Обучающие гайды (правовая, социальная, медицинская тематика)
- ИнваТакси — специализированное такси с чатом с диспетчером
- AI-ассистент Сенім с поддержкой голоса (STT/TTS)
- Личный кабинет с профилем и системой опекун / подопечный
- Обращения в поддержку и жалобы
- Поддержка двух языков: русский и казахский
- Панель специальных возможностей (высокий контраст, размер шрифта, озвучивание)

---

## Технологический стек

| Технология | Версия | Назначение |
|---|---|---|
| Vue 3 | ^3.5 | UI-фреймворк, Composition API + script setup |
| Vite | ^8.0 | Сборщик, dev-сервер с HMR |
| Vue Router 4 | ^4.6 | Клиентская маршрутизация (Hash-режим) |
| Pinia | ^3.0 | Глобальное хранилище состояния |
| VueUse | ^14.2 | Утилиты для Composition API |

Сторонние UI-библиотеки не используются — все компоненты написаны с нуля.
CSS — собственная дизайн-токен-система через CSS Custom Properties.

---

## Структура проекта

```
src/
├── api/                  # Mock API-слой (заменяется на реальные fetch() при подключении бэка)
│   ├── apiClient.js      # Центральный HTTP-клиент: токены, 401-refresh, upload, URL-хелперы
│   ├── auth.js           # Авторизация: login, register, refresh, getMe
│   ├── profile.js        # Профиль, аватар, геолокация, лайки, relative links
│   ├── organizations.js  # Организации, геопоиск, избранное, отзывы
│   ├── news.js           # Новости, лайки, комментарии, создание
│   ├── guides.js         # Гайды, лайки, категории
│   ├── ai.js             # AI-ассистент: чат, сессии, STT, TTS, emergency
│   ├── taxi.js           # ИнваТакси: заявки, чат, водители, менеджер
│   ├── tickets.js        # Тикеты поддержки
│   └── complaints.js     # Жалобы
│
├── stores/               # Pinia-хранилища
│   ├── auth.js           # Пользователь, токены, savedOrgs, savedChats
│   ├── accessibility.js  # Контраст, размер шрифта, язык, TTS
│   └── search.js         # Глобальный поиск
│
├── views/                # Страницы (одна страница = один файл)
│   ├── HomeView.vue           # Главная: последние новости, виджеты
│   ├── OrganizationsView.vue  # Каталог организаций с фильтрами
│   ├── NewsView.vue           # Лента новостей с пагинацией
│   ├── NewsDetailView.vue     # Статья + комментарии
│   ├── GuidesView.vue         # Список и просмотр гайдов
│   ├── AIAssistantView.vue    # AI-ассистент с историей сессий
│   ├── InvaTaxiView.vue       # ИнваТакси (заявки + чат + водители + менеджер)
│   ├── ProfileView.vue        # Личный кабинет (профиль, новости, избранное, опекуны)
│   ├── LoginView.vue          # Вход + OAuth-callback
│   ├── RegisterView.vue       # 3-шаговая регистрация
│   ├── CommunityView.vue      # Сообщество
│   ├── HelpView.vue           # Помощь
│   └── PlaceholderView.vue    # Заглушка для будущих страниц
│
├── components/           # Переиспользуемые компоненты
│   ├── AppHeader.vue          # Шапка с поиском, профиль-меню, доступность
│   ├── AppNavbar.vue          # Нижняя навигационная панель
│   ├── AppFooter.vue          # Подвал
│   ├── AccessibilityPanel.vue # Панель спецвозможностей (контраст, шрифт, язык)
│   ├── OrgModal.vue           # Модальное окно карточки организации
│   └── OrganizationCard.vue   # Карточка организации в каталоге
│
├── mock/                 # JSON-файлы с тестовыми данными
│   ├── organizations.json
│   ├── news.json
│   ├── guides.json
│   ├── taxi.json
│   └── community.json
│
├── router/index.js       # Маршруты (Hash-режим)
├── assets/main.css       # Глобальные стили, дизайн-токены, high-contrast
├── i18n.js               # Переводы RU/KK
└── main.js               # Точка входа Vue
```

---

## Как запустить

```bash
# 1. Установить зависимости
npm install

# 2. Запустить в режиме разработки (mock-данные, без бэкенда)
npm run dev

# 3. Сборка для продакшна
npm run build

# 4. Предпросмотр собранного
npm run preview
```

Dev-сервер запускается на http://localhost:5173

---

## Архитектурные решения

### Hash Router
Приложение использует createWebHashHistory() — URL выглядят как /#/news, /#/profile.
Причина: упрощённый деплой без настройки сервера (nginx/Apache не нужен для SPA-fallback).

OAuth-redirect шим: Google OAuth перенаправляет на /auth/callback?token=... (без #).
Статический файл public/auth/callback.html перехватывает это и делает redirect на /#/auth/callback?token=..., чтобы Vue Router его поймал.

### Mock API → Real API
Весь API-слой сосредоточен в src/api/. Каждый файл — mock-реализация с задержками (delay()), имитирующая настоящий API.

Для подключения реального бэкенда достаточно заменить тело каждой функции на вызов через apiClient.js:

```js
// Было (mock):
export const getOrganizations = async (filters = {}) => {
  await delay(500)
  return { items: mockData, total: mockData.length }
}

// Станет (real API):
export const getOrganizations = async (filters = {}) => {
  return get('/core/organizations', buildQuery(filters))
}
```

apiClient.js уже настроен: автоматически добавляет Authorization: Bearer <token>,
обрабатывает 401 → refresh → retry.

### Единая точка входа
Все запросы идут через http://localhost:3000/api/ — Gateway API:
- /api/core/*  →  core-svc  (организации, новости, профиль, гайды)
- /api/taxi/*  →  taxi-svc  (ИнваТакси)
- /api/ai/*    →  ai-svc    (AI-ассистент)

### Статические файлы
Аватары и фото новостей отдаются с core-svc (порт 3001):
```
http://localhost:3001/uploads/avatars/<filename>
http://localhost:3001/uploads/news/<filename>
```

В коде используются хелперы из apiClient.js:
```js
import { avatarUrl, newsImageUrl } from '../api/apiClient.js'
// <img :src="avatarUrl(user.avatarUrl)" />
// <img :src="newsImageUrl(article.imageUrl)" />
```

---

## Аутентификация

Схема: JWT Access Token (15 мин) + Refresh Token (7 дней).

Токены хранятся в localStorage:
- sqAccessToken — используется в каждом защищённом запросе
- sqRefreshToken — используется для обновления

При получении 401 apiClient.js автоматически:
1. Ставит запрос в очередь
2. Делает POST /api/core/auth/refresh
3. Сохраняет новые токены
4. Повторяет исходный запрос

Управление состоянием пользователя — в stores/auth.js (Pinia).

---

## Специальные возможности (Accessibility)

Реализованы без сторонних библиотек, только CSS + Web API браузера.

| Функция | Реализация |
|---|---|
| Высокий контраст | CSS-класс high-contrast на html + 200+ правил в main.css |
| Размер шрифта | data-font-size="small/medium/large" на html, весь текст в rem/var() |
| Язык (RU/KK) | lang в stores/accessibility.js, переключается глобально через i18n.js |
| Text-to-Speech | Браузерный Web Speech API (SpeechSynthesisUtterance) |
| Сохранение настроек | localStorage с префиксом sq (sqHighContrast, sqFontSize, sqLang) |

---

## Роли пользователей

| Роль | Возможности |
|---|---|
| USER | Основной пользователь (человек с инвалидностью) |
| RELATIVE | Родственник/опекун, может связываться с USER |
| ORG_MANAGER | Менеджер организации |
| TAXI_MANAGER | Диспетчер ИнваТакси (отдельная панель в InvaTaxiView) |
| MODERATOR | Модерация новостей, комментариев, жалоб |
| ADMIN | Полный доступ |

---

## Пагинация

Везде используется offset-based пагинация:
- Query params: limit + offset
- Response: { items: [...], total: N }

---

## Тестовые аккаунты (mock)

| Email | Пароль | Роль |
|---|---|---|
| admin@senimdi.kz | admin123 | ADMIN |
| user@senimdi.kz | User1234 | USER |
| mod@senimdi.kz | Mod12345 | MODERATOR |
| manager@senimdi.kz | Manager1 | TAXI_MANAGER |
| relative@senimdi.kz | Relat123 | RELATIVE |

---

## Что реализовано

### Полностью реализовано
- Весь UI (все страницы и компоненты)
- Mock API со всеми эндпоинтами
- Авторизация (login, register, logout, OAuth-шим, refresh-логика)
- Профиль (просмотр, редактирование, аватар, геолокация)
- Система опекун / подопечный (RelativeLink)
- Организации (каталог, фильтры, поиск, геопоиск, отзывы, избранное)
- Новости (лента, детальная страница, лайки, комментарии)
- Гайды (список, детальная страница, лайки)
- ИнваТакси (заявка, мои поездки, чат, водители, менеджер-панель)
- AI-ассистент (чат, история сессий, mock RAG-режим)
- Тикеты поддержки и жалобы
- Специальные возможности (контраст, шрифт, язык, TTS)

### Заглушки / не реализовано
- STT в браузере (кнопка микрофона) — требует Web Audio API + Whisper на бэке
- TTS через реальный API (сейчас через браузерный SpeechSynthesis)
- Загрузка фото к новостям (POST /api/core/news/:id/image)
- Карта доступности (/services/accessibility-map)
- Вакансии (/services/jobs)
- Документы (/services/documents)
- Форумы (/projects/forums)
- Push-уведомления

---

## Как подключить реальный API

1. Запустить бэкенд: core-svc (3001), taxi-svc (3002), ai-svc (8000), gateway-api (3000)
2. Для каждого файла в src/api/ заменить тело функций с mock на вызовы через apiClient.js
3. apiClient.js уже настроен на http://localhost:3000/api — менять не нужно
4. Статические файлы (uploads/) — проверить, проксирует ли gateway или нужен прямой порт 3001

При желании вынести базовые URL в .env:
```env
VITE_API_BASE=http://localhost:3000/api
VITE_STATIC_BASE=http://localhost:3001
```
