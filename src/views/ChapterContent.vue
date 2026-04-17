<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { courses } from '../data/courses'
import { useStore } from '../store'

const route = useRoute()
const router = useRouter()
const { isChapterCompleted, toggleChapterComplete, isBookmarked, toggleBookmark, setLastVisited } = useStore()

const course = computed(() => courses.find((c) => c.id === route.params.courseId))
const chapter = computed(() => course.value?.chapters.find((ch) => ch.id === route.params.chapterId))
const chapterIndex = computed(() => course.value?.chapters.findIndex((ch) => ch.id === route.params.chapterId) ?? -1)

const prevChapter = computed(() => {
  if (!course.value || chapterIndex.value <= 0) return null
  return course.value.chapters[chapterIndex.value - 1]
})

const nextChapter = computed(() => {
  if (!course.value || chapterIndex.value >= course.value.chapters.length - 1) return null
  return course.value.chapters[chapterIndex.value + 1]
})

const renderedContent = computed(() => {
  if (!chapter.value) return ''
  return marked(chapter.value.content) as string
})

function typeIcon(type: string) {
  return type === 'theory' ? '📖' : type === 'practice' ? '🔧' : '🎯'
}

function typeLabel(type: string) {
  return type === 'theory' ? '理论' : type === 'practice' ? '实操' : '项目'
}

watch(
  [course, chapter],
  ([currentCourse, currentChapter]) => {
    if (currentCourse && currentChapter) {
      setLastVisited(currentCourse.id, currentChapter.id)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="course && chapter" class="content-wrap page-shell">
    <div class="breadcrumb-line">
      <router-link to="/courses">课程</router-link>
      <span>/</span>
      <router-link :to="`/course/${course.id}`">{{ course.title }}</router-link>
      <span>/</span>
      <span>{{ chapter.title }}</span>
    </div>

    <div class="reader-layout">
      <aside class="side-panel reader-nav">
        <h3>{{ course.title }}</h3>
        <nav>
          <router-link
            v-for="(ch, idx) in course.chapters"
            :key="ch.id"
            :to="`/course/${course.id}/${ch.id}`"
            :class="{ active: ch.id === chapter.id }"
          >
            <span>{{ isChapterCompleted(ch.id) ? '✓' : idx + 1 }}</span>
            <em>{{ ch.title }}</em>
          </router-link>
        </nav>
      </aside>

      <main class="reader-main">
        <header class="reader-head">
          <div>
            <span>{{ typeIcon(chapter.type) }} {{ typeLabel(chapter.type) }} · {{ chapter.duration }} · 第 {{ chapterIndex + 1 }} / {{ course.chapters.length }} 章</span>
            <h1>{{ chapter.title }}</h1>
          </div>
        </header>

        <article class="markdown-body reader-article" v-html="renderedContent" />

        <div class="reader-actions">
          <button
            class="primary-action"
            :class="{ completed: isChapterCompleted(chapter.id) }"
            @click="toggleChapterComplete(chapter.id)"
          >
            <span v-if="isChapterCompleted(chapter.id)">✓ 已完成</span>
            <span v-else>标记为已完成</span>
          </button>
          <button
            class="secondary-action"
            @click="toggleBookmark(chapter.id)"
          >
            <span>{{ isBookmarked(chapter.id) ? '⭐ 已收藏' : '☆ 收藏' }}</span>
          </button>
        </div>

        <div class="reader-pager" :class="prevChapter && nextChapter ? 'two' : ''">
          <button
            v-if="prevChapter"
            @click="router.push(`/course/${course.id}/${prevChapter!.id}`)"
          >
            <div>
              <span>上一章</span>
              <strong>{{ prevChapter.title }}</strong>
            </div>
          </button>

          <button
            v-if="nextChapter"
            @click="router.push(`/course/${course.id}/${nextChapter!.id}`)"
          >
            <div>
              <span>下一章</span>
              <strong>{{ nextChapter.title }}</strong>
            </div>
          </button>
        </div>
      </main>

      <aside class="reader-tools">
        <div><span>课程</span><strong>{{ course.title }}</strong></div>
        <div><span>类型</span><strong>{{ typeLabel(chapter.type) }}</strong></div>
        <div><span>预计时长</span><strong>{{ chapter.duration }}</strong></div>
        <div><span>状态</span><strong>{{ isChapterCompleted(chapter.id) ? '已完成' : '学习中' }}</strong></div>
      </aside>
    </div>
  </div>

  <div v-else class="content-wrap empty-state">
    <p>章节未找到</p>
    <router-link to="/courses">返回课程列表</router-link>
  </div>
</template>
