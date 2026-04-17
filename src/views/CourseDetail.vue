<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { courses } from '../data/courses'
import { useStore } from '../store'

const route = useRoute()
const router = useRouter()
const { progress: userProgress, isChapterCompleted, getCourseProgress } = useStore()

const course = computed(() => courses.find((c) => c.id === route.params.courseId))

const progress = computed(() => {
  if (!course.value) return 0
  return getCourseProgress(course.value.id, course.value.chapters.map((ch) => ch.id))
})

function levelLabel(level: string) {
  return level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'
}

function levelColor(level: string) {
  return level === 'beginner' ? 'var(--beginner)' : level === 'intermediate' ? 'var(--intermediate)' : 'var(--advanced)'
}

function typeIcon(type: string) {
  return type === 'theory' ? '📖' : type === 'practice' ? '🔧' : '🎯'
}

function typeLabel(type: string) {
  return type === 'theory' ? '理论' : type === 'practice' ? '实操' : '项目'
}

const circumference = 2 * Math.PI * 45
const strokeDashoffset = computed(() => circumference - (progress.value / 100) * circumference)

const completedCount = computed(() => {
  if (!course.value) return 0
  return course.value.chapters.filter(ch => isChapterCompleted(ch.id)).length
})

const continueChapterId = computed(() => {
  if (!course.value || course.value.chapters.length === 0) return ''
  const lastVisited = userProgress.lastVisited
  if (
    lastVisited?.courseId === course.value.id &&
    course.value.chapters.some((ch) => ch.id === lastVisited.chapterId)
  ) {
    return lastVisited.chapterId
  }

  return course.value.chapters.find((ch) => !isChapterCompleted(ch.id))?.id ?? course.value.chapters[0].id
})
</script>

<template>
  <div v-if="course" class="content-wrap page-shell">
    <div class="breadcrumb-line">
      <router-link to="/courses">课程</router-link>
      <span>/</span>
      <span>{{ course.title }}</span>
    </div>

    <section class="course-hero">
      <div>
        <span class="level-pill" :style="{ color: levelColor(course.level), borderColor: levelColor(course.level) }">{{ levelLabel(course.level) }}</span>
        <h1>{{ course.icon }} {{ course.title }}</h1>
        <p>{{ course.description }}</p>
        <div class="tag-row detail-tags">
          <span v-for="tag in course.tags" :key="tag">{{ tag }}</span>
        </div>
        <button class="primary-action" @click="router.push(`/course/${course.id}/${continueChapterId}`)">
          {{ progress > 0 ? '继续学习' : '开始学习' }}
        </button>
      </div>

      <div class="course-status-panel">
        <div class="ring-wrap">
          <svg width="132" height="132" class="-rotate-90">
            <circle cx="66" cy="66" r="45" stroke="var(--bg-primary)" stroke-width="10" fill="none" />
            <circle
              cx="66" cy="66" r="45"
              :stroke="levelColor(course.level)"
              stroke-width="10"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
            />
          </svg>
          <div>
            <strong>{{ progress }}%</strong>
            <span>完成度</span>
          </div>
        </div>
        <div class="status-grid">
          <div><span>章节</span><strong>{{ course.chapters.length }}</strong></div>
          <div><span>已完成</span><strong>{{ completedCount }}</strong></div>
          <div><span>时长</span><strong>{{ course.duration }}</strong></div>
        </div>
      </div>
    </section>

    <section class="detail-layout">
      <aside class="side-panel">
        <h3>章节目录</h3>
        <nav>
          <router-link
            v-for="(ch, idx) in course.chapters"
            :key="ch.id"
            :to="`/course/${course.id}/${ch.id}`"
          >
            <span>{{ isChapterCompleted(ch.id) ? '✓' : idx + 1 }}</span>
            <em>{{ ch.title }}</em>
            <small>{{ typeIcon(ch.type) }}</small>
          </router-link>
        </nav>
      </aside>

      <div class="chapter-list">
        <h2>课程大纲</h2>
        <article
          v-for="(ch, idx) in course.chapters"
          :key="ch.id"
          class="chapter-row-card"
          @click="router.push(`/course/${course.id}/${ch.id}`)"
        >
          <span class="chapter-index">{{ isChapterCompleted(ch.id) ? '✓' : String(idx + 1).padStart(2, '0') }}</span>
          <div>
            <h3>{{ ch.title }}</h3>
            <p>{{ typeIcon(ch.type) }} {{ typeLabel(ch.type) }} · {{ ch.duration }}</p>
          </div>
          <strong v-if="isChapterCompleted(ch.id)">已完成</strong>
        </article>
      </div>
    </section>
  </div>

  <div v-else class="content-wrap empty-state">
    <p>课程未找到</p>
    <router-link to="/courses">返回课程列表</router-link>
  </div>
</template>
