/**
 * AI Assistant «Сенім» — Real backend calls
 * Base: /ai/chat, /ai/speech
 * All endpoints go through the same gateway.
 * Backend AI responses may take up to 120s — show a spinner.
 */
import { get, post, patch, del, upload, buildQuery } from './apiClient.js'

// ─── Sessions ────────────────────────────────────────────────────────────────

/** GET /ai/chat/sessions — my sessions list */
export const getSessions = async () => {
  const res = await get('/ai/chat/sessions')
  if (Array.isArray(res)) return res
  return res.items ?? res
}

/** POST /ai/chat/sessions — create new session → { id, title, createdAt } */
export const createSession = async (title = '') => post('/ai/chat/sessions', { title })

/** GET /ai/chat/sessions/:id — session + messages */
export const getSession = async (id) => get(`/ai/chat/sessions/${id}`)

/** POST /ai/chat/sessions/:id/message — { content, language? }
 *  Returns: { id, role, content, createdAt }
 */
export const sendMessage = async (sessionId, content, language) =>
  post(`/ai/chat/sessions/${sessionId}/message`, { content, language })

/** PATCH /ai/chat/sessions/:id/title — { title } */
export const renameSession = async (id, title) => patch(`/ai/chat/sessions/${id}/title`, { title })

/** DELETE /ai/chat/sessions/:id */
export const deleteSession = async (id) => del(`/ai/chat/sessions/${id}`)

// ─── Standalone chat (no session) ────────────────────────────────────────────

/** POST /ai/chat/ — single-turn chat, no session saved */
export const chatOnce = async (messages, language) =>
  post('/ai/chat/', { messages, language })

/** POST /ai/chat/rag — chat with org knowledge base search */
export const chatWithRag = async (messages, language) =>
  post('/ai/chat/rag', { messages, language })

/** POST /ai/chat/emergency — urgent help */
export const emergencyChat = async (message, language) =>
  post('/ai/chat/emergency', { message, language })

/** GET /ai/chat/guide — platform guide */
export const getPlatformGuide = async () => get('/ai/chat/guide')

// ─── Speech ──────────────────────────────────────────────────────────────────

/** POST /ai/speech/transcribe — multipart, field: "file" (audio)
 *  Returns: { text: "..." }
 */
export const transcribeAudio = async (audioFile) => {
  const form = new FormData()
  form.append('file', audioFile)
  return upload('/ai/speech/transcribe', form)
}

/** POST /ai/speech/synthesize — { text, voice?, language? }
 *  Returns: audio/mpeg binary — use as blob URL
 */
export const synthesizeSpeech = async (text, voice, language) => {
  const { GATEWAY_URL, getAccessToken } = await import('./apiClient.js')
  const res = await fetch(`${GATEWAY_URL}/ai/speech/synthesize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`,
      'Accept-Language': language === 'kaz' ? 'kk' : 'ru',
    },
    body: JSON.stringify({ text, voice, language })
  })
  if (!res.ok) throw new Error('TTS failed')
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

/** GET /ai/speech/voices — available TTS voices */
export const getVoices = async () => get('/ai/speech/voices')

// ─── Aliases for backwards compatibility with AIAssistantView ────────────────
export const getMySessions     = getSessions
export const createChatSession = (_token, _type, title) => createSession(title)
export const getChatSession    = (_token, id) => getSession(id)
export const sendChat          = (messages, _lang) => chatOnce(messages)

export const sendSessionMessage = (_token, sessionId, content, language) => sendMessage(sessionId, content, language)
export const updateSessionTitle = (_token, id, title) => renameSession(id, title)
export const deleteChatSession  = (_token, id) => deleteSession(id)
