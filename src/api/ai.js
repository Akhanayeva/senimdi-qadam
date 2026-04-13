/**
 * AI Ассистент «Сенім» — Mock API
 *
 * Mirrors:
 *   POST /api/ai/chat/                         — разовый чат
 *   POST /api/ai/chat/rag                       — чат + поиск организаций
 *   POST /api/ai/chat/emergency                 — экстренная помощь
 *   GET  /api/ai/chat/guide                     — гид по платформе
 *
 *   POST /api/ai/chat/sessions                  — создать сессию
 *   GET  /api/ai/chat/sessions                  — мои сессии
 *   GET  /api/ai/chat/sessions/:id              — сессия + сообщения
 *   POST /api/ai/chat/sessions/:id/message      — основной: отправить сообщение
 *   PATCH /api/ai/chat/sessions/:id/title       — переименовать
 *   DELETE /api/ai/chat/sessions/:id            — удалить
 *
 *   POST /api/ai/speech/transcribe              — аудио → текст (STT)
 *   POST /api/ai/speech/synthesize              — текст → MP3 (TTS)
 *   GET  /api/ai/speech/voices                  — список голосов
 *
 * Replace mock implementations with real fetch() calls when backend is ready.
 */

const delay = (ms = 800) => new Promise(r => setTimeout(r, ms))

// ─── Mock response bank ────────────────────────────────────────────────────────

const mockAnswers = {
  дцп: `**Реабилитация для ребёнка с ДЦП — Алматы**\n\n**Шаг 1.** Оформите инвалидность в ЦОН (если ещё не оформлена) — это даёт право на льготы и бесплатные услуги.\n\n**Шаг 2.** Обратитесь в детский реабилитационный центр «Үміт» (ул. Макатаева, 56) — специализируются на ДЦП.\n\n**Шаг 3.** Пройдите медико-социальную экспертизу (МСЭК) для назначения реабилитационного маршрута.\n\n**Шаг 4.** Уточните доступные государственные квоты на бесплатную реабилитацию через Фонд «Дара».`,
  аутизм: `**Помощь при аутизме — Алматы**\n\n**Шаг 1.** Обратитесь к детскому психиатру для получения официального диагноза.\n\n**Шаг 2.** Запишите ребёнка в «Үміт» — центр проводит АБА-терапию и сенсорную интеграцию.\n\n**Шаг 3.** Вступите в группу поддержки родителей.\n\n**Шаг 4.** Уточните в Фонде «Дара» доступные программы ранней интервенции.`,
  льготы: `**Оформление льгот по инвалидности — Алматы**\n\n**Шаг 1.** Соберите медицинские документы, подтверждающие ваше состояние здоровья.\n\n**Шаг 2.** Обратитесь в поликлинику по месту прикрепления для получения направления на МСЭК.\n\n**Шаг 3.** Пройдите Медико-социальную экспертизу (МСЭК) — там присваивают группу инвалидности.\n\n**Шаг 4.** Обратитесь в Центр социальной адаптации (ул. Байзакова, 280) для оформления льгот.`,
  юрид: `**Юридическая помощь для людей с инвалидностью**\n\n**Шаг 1.** Обратитесь в Юридическую клинику «Право» (пр. Аль-Фараби, 71) — бесплатные консультации.\n\n**Шаг 2.** Подготовьте документы: удостоверение, справка МСЭК, описание ситуации.\n\n**Шаг 3.** При необходимости — обратитесь в Фонд «Дара» для сопровождения.`,
  реаб: `**Реабилитация для взрослых — Алматы**\n\n**Шаг 1.** Обратитесь в Республиканский реабилитационный центр (ул. Абая, 44).\n\n**Шаг 2.** Пройдите первичную консультацию для составления индивидуальной программы реабилитации (ИПР).\n\n**Шаг 3.** Уточните, покрывает ли ваша ИПР бесплатные сеансы.\n\n**Шаг 4.** При необходимости психологической поддержки — обратитесь в центр «Гармония».`,
  default: `**Помощь на платформе СенімдіҚадам**\n\nЯ помогу вам найти нужную поддержку в Алматы.\n\n**Доступные разделы:**\n- 🏢 Каталог организаций (реабилитация, юридическая помощь, медицина)\n- 📰 Новости и обновления\n- 📚 Обучающие гайды по льготам и правам\n- 🚖 ИнваТакси — специализированное такси\n\nЗадайте уточняющий вопрос, и я дам более конкретный ответ!`
}

const mockAnswersKk = {
  дцп: `**Алматыда ДЦП бар бала үшін оңалту**\n\n**1-қадам.** МФО-да мүгедектікті рәсімдеңіз — бұл жеңілдіктер мен тегін қызметтерге құқық береді.\n\n**2-қадам.** «Үміт» балалар оңалту орталығына хабарласыңыз (Макатаева к-сі, 56).\n\n**3-қадам.** Оңалту маршрутын тағайындау үшін МӘС-тен өтіңіз.\n\n**4-қадам.** «Дара» қоры арқылы тегін оңалтуға қолжетімді квоталарды нақтылаңыз.`,
  default: `**СенімдіҚадам платформасындағы көмек**\n\nМен сізге Алматыдағы қажетті қолдауды табуға көмектесемін.\n\nНақтылайтын сұрақ қойыңыз, мен нақтырақ жауап беремін!`
}

function pickAnswer(messages, lang = 'ru') {
  const lastUser = [...messages].reverse().find(m => m.role === 'user')
  const text = (lastUser?.content || '').toLowerCase()
  const bank = lang === 'kk' ? mockAnswersKk : mockAnswers
  if (text.includes('дцп') || text.includes('церебральн')) return bank.дцп || bank.default
  if (text.includes('аутизм')) return bank.аутизм || bank.default
  if (text.includes('льгот') || text.includes('пособи')) return bank.льготы || bank.default
  if (text.includes('юрид') || text.includes('закон')) return bank.юрид || bank.default
  if (text.includes('реаб') || text.includes('физиотер')) return bank.реаб || bank.default
  return bank.default
}

// ─── One-off chat ─────────────────────────────────────────────────────────────

/**
 * POST /api/ai/chat/
 * Body: { messages: [{role,content},...], location?: {lat,lon,city} }
 * Response: { answer: string, type: "chat" }
 */
export async function sendChat(messages, location = null) {
  await delay(1200)
  return {
    answer: pickAnswer(messages),
    type: 'chat'
  }
}

/**
 * POST /api/ai/chat/rag
 * Body: { messages: [{role,content},...], location?: {lat,lon,city} }
 * Response: { answer, type: "rag", organizations_found, organizations: [...] }
 */
export async function sendRagChat(messages, location = null) {
  await delay(1500)
  const mockOrgs = [
    { name: 'Республиканский реабилитационный центр', address: 'ул. Абая, 44', distance_km: 0.8 },
    { name: 'Центр психологической помощи «Гармония»', address: 'ул. Сейфуллина, 120', distance_km: 1.4 },
    { name: 'Юридическая клиника «Право»', address: 'пр. Аль-Фараби, 71', distance_km: 2.1 }
  ]
  return {
    answer: pickAnswer(messages) + '\n\n**Организации рядом с вами:**',
    type: 'rag',
    organizations_found: mockOrgs.length,
    organizations: mockOrgs
  }
}

/**
 * POST /api/ai/chat/emergency
 * Body: { message: string, location?: {lat,lon} }
 * Response: { answer, type: "emergency", emergency_numbers: {...} }
 */
export async function sendEmergency(message, location = null) {
  await delay(600)
  return {
    answer: '🆘 **Экстренная ситуация**\n\nНемедленно позвоните по номеру **112**. Оставайтесь на связи с оператором. Если возможно — оставайтесь на месте и ждите помощи.',
    type: 'emergency',
    emergency_numbers: {
      единый: '112',
      скорая: '103',
      полиция: '102',
      пожарная: '101'
    }
  }
}

/**
 * GET /api/ai/chat/guide
 * Response: { guide: string, type: "guide" }
 */
export async function getAIGuide() {
  await delay(500)
  return {
    guide: `**Добро пожаловать на платформу СенімдіҚадам!**\n\nЯ ваш AI-ассистент Сенім. Вот что я умею:\n\n📂 **Поиск организаций** — спросите меня о реабилитации, юридической помощи или медицинских центрах Алматы.\n\n🗺️ **RAG-поиск** — переключитесь в режим «Организации» и я найду ближайшие к вам учреждения.\n\n🆘 **Экстренная помощь** — нажмите красную кнопку при экстренной ситуации.\n\n🎤 **Голосовой ввод** — нажмите на микрофон и говорите.\n\n🔊 **Озвучивание** — нажмите на кнопку динамика рядом с моим ответом.`,
    type: 'guide'
  }
}

// ─── Chat Sessions ────────────────────────────────────────────────────────────

// In-memory sessions store
const sessionsStore = []

/**
 * POST /api/ai/chat/sessions
 * Body: { mode: "chat"|"rag", title?: string }
 * Response: session object
 */
export async function createChatSession(accessToken, mode = 'chat', title = 'Новый чат') {
  await delay(300)
  const session = {
    id: 'sess-' + Date.now(),
    userId: 'usr-current',
    mode,
    title,
    messages: [],
    messages_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  sessionsStore.unshift(session)
  return session
}

/**
 * GET /api/ai/chat/sessions
 * Response: { sessions: [...], total: N }
 */
export async function getMySessions(accessToken) {
  await delay(400)
  return {
    sessions: sessionsStore.map(s => ({
      id: s.id,
      title: s.title,
      mode: s.mode,
      messages_count: s.messages.length,
      created_at: s.created_at,
      updated_at: s.updated_at
    })),
    total: sessionsStore.length
  }
}

/**
 * GET /api/ai/chat/sessions/:sessionId
 * Response: session with messages array
 */
export async function getChatSession(accessToken, sessionId) {
  await delay(400)
  const session = sessionsStore.find(s => s.id === sessionId)
  if (!session) throw new Error('Session not found')
  return { ...session }
}

/**
 * POST /api/ai/chat/sessions/:sessionId/message  ← MAIN ENDPOINT
 * Body: { message: string, location?: {lat,lon,city} }
 * Response: { session_id, user_message, answer, organizations?: [...] }
 */
export async function sendSessionMessage(accessToken, sessionId, message, location = null) {
  await delay(1200)
  const session = sessionsStore.find(s => s.id === sessionId)
  if (!session) throw new Error('Session not found')

  const userMsg = {
    id: 'msg-' + Date.now(),
    role: 'user',
    content: message,
    created_at: new Date().toISOString()
  }
  session.messages.push(userMsg)

  // Build messages array for answer picking
  const msgs = session.messages.map(m => ({ role: m.role, content: m.content }))
  const answerText = session.mode === 'rag'
    ? pickAnswer(msgs) + '\n\n*Поиск организаций выполнен (RAG-режим)*'
    : pickAnswer(msgs)

  await delay(300)
  const assistantMsg = {
    id: 'msg-' + (Date.now() + 1),
    role: 'assistant',
    content: answerText,
    created_at: new Date().toISOString()
  }
  session.messages.push(assistantMsg)
  session.updated_at = new Date().toISOString()

  const result = {
    session_id: sessionId,
    user_message: userMsg,
    answer: assistantMsg
  }

  if (session.mode === 'rag') {
    result.organizations_found = 2
    result.organizations = [
      { name: 'Республиканский реабилитационный центр', address: 'ул. Абая, 44', distance_km: 0.8 },
      { name: 'Юридическая клиника «Право»', address: 'пр. Аль-Фараби, 71', distance_km: 2.1 }
    ]
  }

  return result
}

/**
 * PATCH /api/ai/chat/sessions/:sessionId/title
 * Body: { title: string }
 */
export async function updateSessionTitle(accessToken, sessionId, title) {
  await delay(300)
  const session = sessionsStore.find(s => s.id === sessionId)
  if (session) {
    session.title = title
    session.updated_at = new Date().toISOString()
  }
  return { success: true }
}

/**
 * DELETE /api/ai/chat/sessions/:sessionId
 */
export async function deleteChatSession(accessToken, sessionId) {
  await delay(300)
  const idx = sessionsStore.findIndex(s => s.id === sessionId)
  if (idx !== -1) sessionsStore.splice(idx, 1)
  return { success: true }
}

// ─── Speech (STT / TTS) ───────────────────────────────────────────────────────

/**
 * POST /api/ai/speech/transcribe
 * Real: multipart/form-data, field "file" (audio), query ?language=ru-RU
 * Mock: returns a canned transcription after a delay
 * Response: { text: string, language: string, engine: string }
 */
export async function transcribeAudio(audioBlob, language = 'ru-RU') {
  await delay(1500)
  // Mock: return a canned phrase (real API would use faster-whisper)
  return {
    text: 'Где можно пройти реабилитацию в Алматы?',
    language,
    engine: 'faster-whisper'
  }
}

/**
 * POST /api/ai/speech/synthesize
 * Body: { text: string, language: "ru-RU"|"kk-KZ" }
 * Real API: returns audio/mpeg binary MP3
 * Mock: returns a null blob (browser Web Speech API can be used as fallback in AIAssistantView)
 * Response: Blob (audio/mpeg) or null in mock
 */
export async function synthesizeSpeech(text, language = 'ru-RU') {
  await delay(800)
  // Mock: use browser's SpeechSynthesis as a local substitute
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'kk-KZ' ? 'kk-KZ' : 'ru-RU'
    window.speechSynthesis.speak(utterance)
  }
  // Return null (real API returns MP3 Blob)
  return null
}

/**
 * GET /api/ai/speech/voices
 * Response: array of available TTS voices
 */
export async function getVoices() {
  await delay(200)
  return [
    { id: 'ru-svetlana', name: 'Светлана', language: 'ru-RU', gender: 'female' },
    { id: 'kk-aigul',    name: 'Айгүл',   language: 'kk-KZ', gender: 'female' }
  ]
}

// ─── Legacy exports (used by AIAssistantView.vue) ─────────────────────────────
// Keep these for backward compatibility until AIAssistantView is updated

/** @deprecated use sendChat() instead */
export const sendMessage = async (message, lang = 'rus') => {
  await delay(1200)
  const msgs = [{ role: 'user', content: message }]
  const answer = pickAnswer(msgs, lang === 'kaz' ? 'kk' : 'ru')
  return {
    id: Date.now(),
    message: answer,
    checklist: [],
    orgIds: [],
    timestamp: new Date().toISOString()
  }
}

/** @deprecated use getMySessions() instead */
export const getChatHistory = async () => {
  await delay(300)
  return []
}
