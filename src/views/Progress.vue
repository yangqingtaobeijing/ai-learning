<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { courses } from '../data/courses'
import { useStore } from '../store'

const router = useRouter()
const { progress, totalCompletedChapters, learningDays, getCourseProgress, isBookmarked } = useStore()

const allChapterIds = computed(() => courses.flatMap((c) => c.chapters.map((ch) => ch.id)))
const totalPct = computed(() => getCourseProgress('all', allChapterIds.value))

const courseProgressList = computed(() =>
  courses.map((c) => {
    const ids = c.chapters.map((ch) => ch.id)
    const pct = getCourseProgress(c.id, ids)
    const completedCount = ids.filter((id) => progress.completedChapters.includes(id)).length
    return { ...c, pct, completedCount }
  }),
)

const completedChapters = computed(() => {
  const result: { courseTitle: string; chapterId: string; chapterTitle: string; courseId: string }[] = []
  for (const c of courses) {
    for (const ch of c.chapters) {
      if (progress.completedChapters.includes(ch.id)) {
        result.push({ courseTitle: c.title, chapterId: ch.id, chapterTitle: ch.title, courseId: c.id })
      }
    }
  }
  return result
})

const bookmarkedChapters = computed(() => {
  const result: { courseTitle: string; chapterId: string; chapterTitle: string; courseId: string }[] = []
  for (const c of courses) {
    for (const ch of c.chapters) {
      if (isBookmarked(ch.id)) {
        result.push({ courseTitle: c.title, chapterId: ch.id, chapterTitle: ch.title, courseId: c.id })
      }
    }
  }
  return result
})

function levelColor(level: string) {
  return level === 'beginner' ? 'var(--beginner)' : level === 'intermediate' ? 'var(--intermediate)' : 'var(--advanced)'
}

function levelLabel(level: string) {
  return level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'
}

const circumference = 2 * Math.PI * 54
const strokeDashoffset = computed(() => circumference - (totalPct.value / 100) * circumference)
</script>

<template>
  <div class="content-wrap page-shell">
    <div class="page-heading">
      <div>
        <span>PROGRESS CENTER</span>
        <h1>学习进度</h1>
        <p>追踪课程完成度、收藏内容和最近的学习资产</p>
      </div>
    </div>

    <section class="progress-dashboard">
      <div class="progress-ring-card">
        <div class="ring-wrap">
          <svg width="120" height="120" class="-rotate-90">
            <circle cx="60" cy="60" r="54" stroke="var(--bg-primary)" stroke-width="8" fill="none" />
            <circle
              cx="60" cy="60" r="54"
              stroke="var(--accent)"
              stroke-width="8"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
            />
          </svg>
          <div>
            <strong>{{ totalPct }}%</strong>
            <span>总进度</span>
          </div>
        </div>
      </div>
      <div class="metric-panel">
        <span>已完成章节</span>
        <strong>{{ totalCompletedChapters }}</strong>
        <em>共 {{ allChapterIds.length }} 章</em>
      </div>
      <div class="metric-panel success">
        <span>学习天数</span>
        <strong>{{ learningDays }}</strong>
        <em>自 {{ progress.startDate }}</em>
      </div>
      <div class="metric-panel warning">
        <span>收藏章节</span>
        <strong>{{ bookmarkedChapters.length }}</strong>
        <em>可快速回访</em>
      </div>
    </section>

    <section class="progress-layout">
      <div class="progress-list">
        <div class="section-heading compact">
          <div>
            <span>COURSE STATUS</span>
            <h2>各课程进度</h2>
          </div>
        </div>
        <article
          v-for="cp in courseProgressList"
          :key="cp.id"
          class="progress-course-row"
          @click="router.push(`/course/${cp.id}`)"
        >
          <span class="course-icon">{{ cp.icon }}</span>
          <div>
            <div class="progress-course-head">
              <h3>{{ cp.title }}</h3>
              <span class="level-pill" :style="{ color: levelColor(cp.level), borderColor: levelColor(cp.level) }">{{ levelLabel(cp.level) }}</span>
              <strong :style="{ color: levelColor(cp.level) }">{{ cp.pct }}%</strong>
            </div>
            <div class="progress-line">
              <i :style="{ width: cp.pct + '%', backgroundColor: levelColor(cp.level) }" />
            </div>
            <p>{{ cp.completedCount }} / {{ cp.chapters.length }} 章节完成</p>
          </div>
        </article>
      </div>

      <div class="activity-panels">
        <section class="activity-panel">
          <h2>已完成章节</h2>
          <div v-if="completedChapters.length === 0" class="activity-empty">
            还没有完成任何章节
          </div>
          <div v-else class="activity-list">
            <button
              v-for="ch in completedChapters"
              :key="ch.chapterId"
              @click="router.push(`/course/${ch.courseId}/${ch.chapterId}`)"
            >
              <span>✓</span>
              <div>
                <strong>{{ ch.chapterTitle }}</strong>
                <em>{{ ch.courseTitle }}</em>
              </div>
            </button>
          </div>
        </section>

        <section class="activity-panel">
          <h2>收藏列表</h2>
          <div v-if="bookmarkedChapters.length === 0" class="activity-empty">
            还没有收藏任何章节
          </div>
          <div v-else class="activity-list">
            <button
              v-for="ch in bookmarkedChapters"
              :key="ch.chapterId"
              @click="router.push(`/course/${ch.courseId}/${ch.chapterId}`)"
            >
              <span>★</span>
              <div>
                <strong>{{ ch.chapterTitle }}</strong>
                <em>{{ ch.courseTitle }}</em>
              </div>
            </button>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>
