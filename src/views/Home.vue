<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { courses } from '../data/courses'
import { useStore } from '../store'

const router = useRouter()
const { progress, totalCompletedChapters, learningDays, getCourseProgress } = useStore()

const recommendedCourses = computed(() => courses.slice(0, 6))

const allChapterIds = computed(() => courses.flatMap((c) => c.chapters.map((ch) => ch.id)))
const totalCourses = computed(() => courses.length)
const totalChapters = computed(() => allChapterIds.value.length)
const totalProgress = computed(() => {
  if (allChapterIds.value.length === 0) return 0
  return getCourseProgress('all', allChapterIds.value)
})

const levelStats = computed(() => {
  const levels = ['beginner', 'intermediate', 'advanced'] as const
  return levels.map((level) => {
    const levelCourses = courses.filter((c) => c.level === level)
    const ids = levelCourses.flatMap((c) => c.chapters.map((ch) => ch.id))
    const done = ids.filter((id) => progress.completedChapters.includes(id)).length
    return {
      level,
      label: level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级',
      subtitle: level === 'beginner' ? 'AI 基础认知 & 工具使用' : level === 'intermediate' ? 'AI 技术理解 & 应用开发' : 'AI 产品战略 & 系统设计',
      icon: level === 'beginner' ? '🌱' : level === 'intermediate' ? '🚀' : '👑',
      color: level === 'beginner' ? 'var(--beginner)' : level === 'intermediate' ? 'var(--intermediate)' : 'var(--advanced)',
      total: ids.length,
      done,
      pct: ids.length ? Math.round((done / ids.length) * 100) : 0,
      courseCount: levelCourses.length,
    }
  })
})

const hasProgress = computed(() => progress.completedChapters.length > 0)

function levelColor(level: string) {
  return level === 'beginner' ? 'var(--beginner)' : level === 'intermediate' ? 'var(--intermediate)' : 'var(--advanced)'
}

function levelLabel(level: string) {
  return level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'
}
</script>

<template>
  <div class="home-page">
    <section class="hero-console">
      <div class="content-wrap hero-grid">
        <div class="hero-copy">
          <div class="eyebrow">AI PRODUCT LEARNING OS</div>
          <h1>把 AI 学习变成一套可执行的产品能力系统</h1>
          <p>课程、章节、练习、进度和收藏都围绕产品经理的真实工作流组织。少一点花哨，多一点能落地的判断力。</p>
          <div class="hero-actions">
            <button class="primary-action" @click="router.push('/courses')">进入课程库</button>
            <button class="secondary-action" @click="router.push('/progress')">查看学习进度</button>
          </div>
          <div class="hero-metrics">
            <div><strong>{{ totalCourses }}</strong><span>门课程</span></div>
            <div><strong>{{ totalChapters }}</strong><span>个章节</span></div>
            <div><strong>{{ totalProgress }}%</strong><span>总进度</span></div>
          </div>
        </div>

        <div class="ops-panel">
          <div class="ops-panel-top">
            <span>LEARNING PIPELINE</span>
            <span>LIVE</span>
          </div>
          <div class="ops-command">pm-ai://roadmap --level all --mode practical</div>
          <div class="ops-bars">
            <div v-for="stat in levelStats" :key="stat.level" class="ops-row">
              <div>
                <span>{{ stat.label }}</span>
                <strong>{{ stat.done }}/{{ stat.total }}</strong>
              </div>
              <div class="ops-track"><i :style="{ width: stat.pct + '%', backgroundColor: stat.color }"></i></div>
            </div>
          </div>
          <div class="ops-grid">
            <div><span>完成章节</span><strong>{{ totalCompletedChapters }}</strong></div>
            <div><span>学习天数</span><strong>{{ learningDays }}</strong></div>
            <div><span>收藏内容</span><strong>{{ progress.bookmarks.length }}</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="hasProgress" class="content-wrap stats-strip">
      <div><span>总学习进度</span><strong>{{ totalProgress }}%</strong></div>
      <div><span>已完成章节</span><strong>{{ totalCompletedChapters }}</strong></div>
      <div><span>学习天数</span><strong>{{ learningDays }}</strong></div>
      <div><span>收藏内容</span><strong>{{ progress.bookmarks.length }}</strong></div>
    </section>

    <section class="content-wrap section-block">
      <div class="section-heading">
        <div>
          <span>ROADMAP</span>
          <h2>三阶段学习路径</h2>
        </div>
        <button class="ghost-link" @click="router.push('/courses')">全部课程</button>
      </div>
      <div class="track-grid">
        <article
          v-for="stat in levelStats"
          :key="stat.level"
          class="track-card"
          @click="router.push('/courses')"
        >
          <div class="track-card-head">
            <span>{{ stat.label }}</span>
            <strong>{{ stat.pct }}%</strong>
          </div>
          <h3>{{ stat.subtitle }}</h3>
          <p>{{ stat.courseCount }} 门课程 · {{ stat.total }} 个章节</p>
          <div class="progress-line"><i :style="{ width: stat.pct + '%', backgroundColor: stat.color }"></i></div>
        </article>
      </div>
    </section>

    <section class="content-wrap section-block">
      <div class="section-heading">
        <div>
          <span>START HERE</span>
          <h2>推荐课程</h2>
        </div>
        <button class="ghost-link" @click="router.push('/courses')">查看全部</button>
      </div>
      <div class="course-grid web-grid">
        <article
          v-for="course in recommendedCourses"
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
            <span>{{ course.chapters.length }} 章</span>
            <span>{{ course.duration }}</span>
            <strong :style="{ color: levelColor(course.level) }">{{ getCourseProgress(course.id, course.chapters.map(ch => ch.id)) }}%</strong>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
