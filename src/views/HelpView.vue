<template>
  <main class="page-content">
    <div class="help-page-header">
      <div class="container">
        <h1 class="page-h1">{{ t('helpNav') }}</h1>
        <p class="page-desc">Пошаговое руководство по использованию платформы SenimdiQAdam</p>
      </div>
    </div>
    <div class="container help-content">
      <div class="help-grid">
        <div class="help-card" v-for="item in helpItems" :key="item.title">
          <div class="help-icon">{{ item.icon }}</div>
          <h3 class="help-title">{{ item.title }}</h3>
          <p class="help-desc">{{ item.desc }}</p>
          <RouterLink :to="item.link" class="btn btn-outline btn-sm" style="margin-top:auto">
            Перейти →
          </RouterLink>
        </div>
      </div>

      <!-- Step-by-step guide -->
      <div class="help-guide">
        <h2 class="help-guide-title">Как пользоваться платформой</h2>
        <div class="help-steps">
          <div v-for="(step, i) in steps" :key="i" class="help-step">
            <div class="step-num">{{ i + 1 }}</div>
            <div class="step-content">
              <h4 class="step-title">{{ step.title }}</h4>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAccessibilityStore } from '../stores/accessibility.js'
import { useI18n } from '../i18n.js'
const a11y = useAccessibilityStore()
const t = computed(() => useI18n(a11y.lang))

const helpItems = [
  { icon: '🏢', title: 'Каталог организаций', desc: 'Найдите нужный центр или фонд по категории, району или ключевому слову', link: '/services/organizations' },
  { icon: '🤖', title: 'ИИ-консультант Senim', desc: 'Опишите ситуацию и получите пошаговый план действий с рекомендованными организациями', link: '/services/ai' },
  { icon: '📰', title: 'Новости', desc: 'Актуальные события, анонсы мероприятий и полезные объявления', link: '/news' },
  { icon: '👥', title: 'Сообщество', desc: 'Ссылки на группы и чаты в социальных сетях для взаимопомощи', link: '/projects/community' },
  { icon: '🚕', title: 'ИнваТакси', desc: 'Заказ специализированного такси для людей с ограниченными возможностями', link: '/inva-taxi/order' },
  { icon: '♿', title: 'Доступность', desc: 'Режим высокого контраста, размер шрифта и голосовое чтение — значок ⏱ в шапке', link: '/' },
]

const steps = [
  { title: 'Выберите способ поиска', desc: 'Воспользуйтесь поиском в шапке, каталогом организаций или ИИ-консультантом Senim.' },
  { title: 'Опишите ситуацию или найдите организацию', desc: 'Введите запрос в поле поиска или воспользуйтесь фильтрами по категории, районy и статусу проверки.' },
  { title: 'Изучите карточку организации', desc: 'Нажмите "Подробнее" для просмотра адреса, телефона, часов работы и статуса верификации (значок ✓).' },
  { title: 'Свяжитесь напрямую', desc: 'Нажмите "Позвонить" или перейдите на сайт организации прямо с карточки.' },
  { title: 'Сохраняйте избранное', desc: 'После регистрации вы можете сохранять организации и чаты с ИИ в избранное.' },
]
</script>

<style scoped>
.help-page-header { background: linear-gradient(135deg, var(--dark) 0%, var(--primary-dark) 100%); padding: 48px 0 40px; margin-bottom: 40px; }
.page-h1 { font-size: var(--fs-3xl); font-weight: 800; color: white; margin-bottom: 8px; }
.page-desc { color: rgba(255,255,255,0.7); font-size: var(--fs-md); }
.help-content { padding-bottom: 64px; }
.help-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 56px; }
.help-card { background: white; border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 12px; transition: all var(--transition); }
.help-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.help-icon { font-size: 36px; }
.help-title { font-size: var(--fs-md); font-weight: 700; color: var(--black); }
.help-desc { font-size: var(--fs-sm); color: var(--gray-500); line-height: 1.6; flex: 1; }
.help-guide { background: white; border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow); }
.help-guide-title { font-size: var(--fs-2xl); font-weight: 800; color: var(--black); margin-bottom: 32px; }
.help-steps { display: flex; flex-direction: column; gap: 24px; }
.help-step { display: flex; gap: 20px; align-items: flex-start; }
.step-num { width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: var(--fs-md); flex-shrink: 0; }
.step-title { font-size: var(--fs-md); font-weight: 700; color: var(--black); margin-bottom: 4px; }
.step-desc { font-size: var(--fs-sm); color: var(--gray-500); line-height: 1.6; }
@media (max-width: 900px) { .help-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .help-grid { grid-template-columns: 1fr; } }
</style>
