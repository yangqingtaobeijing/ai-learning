<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { courses } from '../data/courses'
import { useStore } from '../store'

const router = useRouter()
const { getCourseProgress } = useStore()

const activeLevel = ref<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
const searchQuery = ref('')

const tabs = [
  { key: 'all' as const, label: '全部', count: courses.length },
  { key: 'beginner' as const, label: '初级', count: courses.filter(c => c.level === 'beginner').length },
  { key: 'intermediate' as const, label: '中级', count: courses.filter(c => c.level === 'intermediate').length },
  { key: 'advanced' as const, label: '高级', count: courses.filter(c => c.level === 'advanced').length },
]

const filteredCourses = computed(() => {
  let result = courses
  if (activeLevel.value !== 'all') {
    result = result.filter((c) => c.level === activeLevel.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }
  return result
})

function levelLabel(level: string) {
  return level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'
}

function levelColor(level: string) {
  return level === 'beginner' ? 'var(--beginner)' : level === 'intermediate' ? 'var(--intermediate)' : 'var(--advanced)'
}

</script>

<template>
  <div class="content-wrap page-shell">
    <div class="page-heading">
      <div>
        <span>COURSE INDEX</span>
        <h1>全部课程</h1>
        <p>从基础到进阶，选择适合你的 AI 学习路线</p>
      </div>

      <label class="inline-search">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索课程..."
        />
      </label>
    </div>

    <div class="filter-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: activeLevel === tab.key }"
        @click="activeLevel = tab.key"
      >
        {{ tab.label }}
        <span>{{ tab.count }}</span>
      </button>
    </div>

    <div v-if="filteredCourses.length" class="course-grid">
      <article
        v-for="course in filteredCourses"
        :key="course.id"
        class="course-card"
        @click="router.push(`/course/${course.id}`)"
      >
        <div class="course-card-top">
          <span class="course-icon">{{ course.icon }}</span>
          <span class="level-pill" :style="{ color: levelColor(course.level), borderColor: levelColor(course.level) }">{{ levelLabel(course.level) }}</span>
        </div>
        <h3>{{ course.title }}</h3>
        <p>{{ course.description }}</p>
        <div class="course-meta">
          <span>{{ course.chapters.length }} 章节</span>
          <span>{{ course.duration }}</span>
          <strong :style="{ color: levelColor(course.level) }">{{ getCourseProgress(course.id, course.chapters.map(ch => ch.id)) }}%</strong>
        </div>
        <div class="progress-line">
          <i
            :style="{
              width: getCourseProgress(course.id, course.chapters.map(ch => ch.id)) + '%',
              backgroundColor: levelColor(course.level),
            }"
          />
        </div>
        <div class="tag-row">
          <span v-for="tag in course.tags.slice(0, 3)" :key="tag">{{ tag }}</span>
        </div>
      </article>
    </div>

    <div v-else class="empty-state">
      <p>未找到相关课程</p>
      <span>试试调整筛选条件或搜索关键词</span>
      <button class="secondary-action" @click="activeLevel = 'all'; searchQuery = ''">
        清除筛选
      </button>
    </div>
  </div>
</template>
