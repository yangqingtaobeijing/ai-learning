import { reactive, watch, computed } from 'vue'
import type { UserProgress } from '../types'

const STORAGE_KEY = 'ai-learning-progress'
const THEME_KEY = 'ai-learning-theme'

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map((item) => item.trim()),
    ),
  )
}

function normalizeLastVisited(value: unknown): UserProgress['lastVisited'] {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Record<string, unknown>
  if (typeof candidate.courseId !== 'string' || typeof candidate.chapterId !== 'string') return null
  return {
    courseId: candidate.courseId,
    chapterId: candidate.chapterId,
  }
}

function normalizeDate(value: unknown): string {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  return new Date().toISOString().slice(0, 10)
}

function normalizeProgress(value: unknown): UserProgress {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid progress data')
  }

  const candidate = value as Record<string, unknown>
  return {
    completedChapters: uniqueStrings(candidate.completedChapters),
    bookmarks: uniqueStrings(candidate.bookmarks),
    lastVisited: normalizeLastVisited(candidate.lastVisited),
    startDate: normalizeDate(candidate.startDate),
  }
}

function saveLocalStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return normalizeProgress(JSON.parse(raw))
  } catch {
    /* ignore */
  }
  return {
    completedChapters: [],
    bookmarks: [],
    lastVisited: null,
    startDate: new Date().toISOString().slice(0, 10),
  }
}

function loadTheme(): 'dark' | 'light' {
  try {
    const t = localStorage.getItem(THEME_KEY)
    if (t === 'light' || t === 'dark') return t
  } catch {
    /* ignore */
  }
  return 'dark'
}

const progress = reactive<UserProgress>(loadProgress())
const theme = reactive({ value: loadTheme() })

watch(
  () => ({ ...progress, completedChapters: [...progress.completedChapters], bookmarks: [...progress.bookmarks] }),
  () => {
    saveLocalStorage(STORAGE_KEY, JSON.stringify(progress))
  },
  { deep: true },
)

watch(
  () => theme.value,
  (val) => {
    saveLocalStorage(THEME_KEY, val)
    if (val === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  },
  { immediate: true },
)

export function useStore() {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const isChapterCompleted = (chapterId: string) =>
    progress.completedChapters.includes(chapterId)

  const toggleChapterComplete = (chapterId: string) => {
    const idx = progress.completedChapters.indexOf(chapterId)
    if (idx === -1) {
      progress.completedChapters.push(chapterId)
    } else {
      progress.completedChapters.splice(idx, 1)
    }
  }

  const isBookmarked = (chapterId: string) =>
    progress.bookmarks.includes(chapterId)

  const toggleBookmark = (chapterId: string) => {
    const idx = progress.bookmarks.indexOf(chapterId)
    if (idx === -1) {
      progress.bookmarks.push(chapterId)
    } else {
      progress.bookmarks.splice(idx, 1)
    }
  }

  const setLastVisited = (courseId: string, chapterId: string) => {
    progress.lastVisited = { courseId, chapterId }
  }

  const getCourseProgress = (_courseId: string, chapterIds: string[]) => {
    if (chapterIds.length === 0) return 0
    const done = chapterIds.filter((id) =>
      progress.completedChapters.includes(id),
    ).length
    return Math.round((done / chapterIds.length) * 100)
  }

  const totalCompletedChapters = computed(() => progress.completedChapters.length)

  const learningDays = computed(() => {
    if (!progress.startDate) return 0
    const start = new Date(progress.startDate)
    const now = new Date()
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(1, diff)
  })

  const resetProgress = () => {
    progress.completedChapters = []
    progress.bookmarks = []
    progress.lastVisited = null
    progress.startDate = new Date().toISOString().slice(0, 10)
  }

  const exportData = () => {
    return JSON.stringify(progress, null, 2)
  }

  const importData = (json: string) => {
    try {
      const data = normalizeProgress(JSON.parse(json))
      progress.completedChapters = data.completedChapters
      progress.bookmarks = data.bookmarks
      progress.lastVisited = data.lastVisited
      progress.startDate = data.startDate
      return true
    } catch {
      return false
    }
  }

  return {
    progress,
    theme,
    toggleTheme,
    isChapterCompleted,
    toggleChapterComplete,
    isBookmarked,
    toggleBookmark,
    setLastVisited,
    getCourseProgress,
    totalCompletedChapters,
    learningDays,
    resetProgress,
    exportData,
    importData,
  }
}
