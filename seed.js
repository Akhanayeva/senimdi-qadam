/**
 * seed.js — заполняет базу данных тестовыми данными
 * Запуск: node seed.js
 *
 * Что делает:
 * 1. Входит как admin
 * 2. Создаёт 12 организаций из mock/organizations.json
 * 3. Создаёт 6 новостей из mock/news.json и публикует их
 */

const API = 'http://49.12.34.124:3000/api'
const ADMIN_EMAIL = 'admin@senimdi.kz'
const ADMIN_PASSWORD = 'Admin1234!'

// ── helpers ────────────────────────────────────────────────────────────────────
async function req(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json', 'Accept-Language': 'ru' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { json = { raw: text } }
  if (!res.ok) {
    console.error(`  ✗ ${method} ${path} → ${res.status}:`, JSON.stringify(json).slice(0, 200))
    return null
  }
  return json
}

// ── main ───────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 SenimdiQadam Seed Script\n')

  // 1. Login as admin
  console.log('1. Входим как администратор...')
  const loginRes = await req('/core/auth/login', 'POST', {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  })

  if (!loginRes?.accessToken) {
    console.error('❌ Не удалось войти. Проверь email/пароль администратора в seed.js')
    console.log('   Попробуй другие пароли: Admin123!, admin123, Admin1234, Admin123')
    process.exit(1)
  }
  const token = loginRes.accessToken
  console.log('   ✓ Вошли успешно\n')

  // 2. Seed organizations
  const orgs = require('./src/mock/organizations.json')
  console.log(`2. Создаём ${orgs.length} организаций...`)
  let orgOk = 0, orgFail = 0

  for (const org of orgs) {
    // Map mock fields → real API fields
    const payload = {
      nameRu:          org.nameRu,
      nameKk:          org.nameKk,
      descriptionRu:   org.description,
      descriptionKk:   org.descriptionKk || org.description,
      category:        org.category,
      address:         org.address,
      city:            org.city || 'Алматы',
      district:        org.district,
      phone:           org.phone,
      email:           org.email || undefined,
      website:         org.website || undefined,
      workingHours:    org.workingHours || org.hours,
      lat:             org.lat || undefined,
      lon:             org.lon || undefined,
      tags:            org.tags || [],
      status:          'VERIFIED',
    }

    // Remove undefined fields
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])

    const result = await req('/core/organizations', 'POST', payload, token)
    if (result) {
      console.log(`   ✓ ${org.nameRu}`)
      orgOk++
    } else {
      // Try admin route
      const result2 = await req('/core/admin/organizations', 'POST', payload, token)
      if (result2) {
        console.log(`   ✓ ${org.nameRu} (via admin route)`)
        orgOk++
      } else {
        console.log(`   ✗ ${org.nameRu} — пропускаем`)
        orgFail++
      }
    }
  }
  console.log(`   Итого: ${orgOk} создано, ${orgFail} пропущено\n`)

  // 3. Seed news
  const news = require('./src/mock/news.json')
  console.log(`3. Создаём ${news.length} новостей...`)
  let newsOk = 0, newsFail = 0

  for (const item of news) {
    const payload = {
      titleRu:  item.titleRu,
      titleKk:  item.titleKk,
      bodyRu:   item.bodyRu,
      bodyKk:   item.bodyKk,
      imageUrl: item.imageUrl || undefined,
    }
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])

    const result = await req('/core/news', 'POST', payload, token)
    if (result?.id) {
      // Publish the news
      await req(`/core/news/${result.id}/moderate`, 'PATCH', { status: 'PUBLISHED' }, token)
      console.log(`   ✓ ${item.titleRu?.slice(0, 60)}`)
      newsOk++
    } else {
      console.log(`   ✗ ${item.titleRu?.slice(0, 60)} — пропускаем`)
      newsFail++
    }
  }
  console.log(`   Итого: ${newsOk} создано, ${newsFail} пропущено\n`)

  console.log('✅ Seed завершён!')
  console.log(`   Организации: ${orgOk}/${orgs.length}`)
  console.log(`   Новости:     ${newsOk}/${news.length}`)
}

seed().catch(err => {
  console.error('❌ Ошибка:', err.message)
  process.exit(1)
})
