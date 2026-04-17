<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from './store'
import { courses } from './data/courses'

const router = useRouter()
const route = useRoute()
const { theme, toggleTheme } = useStore()

const showSearch = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const searchResults = ref<{ id: string; title: string; type: 'course' | 'chapter'; meta: string }[]>([])

function doSearch() {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) {
    searchResults.value = []
    return
  }
  const results: { id: string; title: string; type: 'course' | 'chapter'; meta: string }[] = []
  for (const c of courses) {
    const courseText = `${c.title} ${c.description} ${c.tags.join(' ')}`.toLowerCase()
    if (courseText.includes(q)) {
      results.push({ id: c.id, title: `${c.icon} ${c.title}`, type: 'course', meta: `${c.chapters.length} 章 · ${c.duration}` })
    }
    for (const ch of c.chapters) {
      const chapterText = `${ch.title} ${ch.content}`.toLowerCase()
      if (chapterText.includes(q)) {
        results.push({ id: `${c.id}/${ch.id}`, title: ch.title, type: 'chapter', meta: c.title })
      }
    }
  }
  searchResults.value = results.slice(0, 10)
}

watch(searchQuery, doSearch)

function openSearch() {
  showSearch.value = true
  void nextTick(() => searchInput.value?.focus())
}

function goToResult(r: { id: string; type: 'course' | 'chapter' }) {
  showSearch.value = false
  searchQuery.value = ''
  if (r.type === 'course') {
    router.push(`/course/${r.id}`)
  } else {
    const parts = r.id.split('/')
    router.push(`/course/${parts[0]}/${parts[1]}`)
  }
}

function closeSearch() {
  showSearch.value = false
  searchQuery.value = ''
  searchResults.value = []
}

function handleGlobalKeydown(event: KeyboardEvent) {
  const key = event.key.toLowerCase()
  const isSearchShortcut = key === 'k' && (event.metaKey || event.ctrlKey)
  if (isSearchShortcut) {
    event.preventDefault()
    openSearch()
  }

  if (event.key === 'Escape' && showSearch.value) {
    closeSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

const navItems = [
  { path: '/', label: '首页', icon: 'home' },
  { path: '/courses', label: '课程', icon: 'book' },
  { path: '/progress', label: '学习进度', icon: 'chart' },
]
</script>

<template>
  <div class="app-shell grid-bg">
    <header class="app-header">
      <div class="app-header-inner">
        <router-link to="/" class="brand-lockup">
          <span class="brand-mark">AI</span>
          <span>AI 学堂</span>
        </router-link>

        <nav class="main-nav">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="main-nav-link"
            :class="{ active: route.path === item.path }"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="header-actions">
          <button class="search-trigger" @click="openSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>搜索</span>
            <kbd>⌘K</kbd>
          </button>

          <button class="icon-action" title="切换主题" @click="toggleTheme">
            <svg v-if="theme.value === 'dark'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </button>

          <router-link to="/settings" class="icon-action" title="设置">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Search Modal Overlay -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="showSearch"
          class="search-overlay"
          @click.self="closeSearch"
        >
          <div class="search-dialog">
            <div class="search-field">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="搜索课程、章节..."
                autofocus
                @keydown.escape="closeSearch"
              />
              <kbd>ESC</kbd>
            </div>

            <div v-if="searchResults.length" class="search-results">
              <button
                v-for="r in searchResults"
                :key="r.id"
                class="search-result"
                @click="goToResult(r)"
              >
                <div>{{ r.title }}</div>
                <span>
                  {{ r.type === 'course' ? '📚 课程' : '📄 章节' }} · {{ r.meta }}
                </span>
              </button>
            </div>
            <div v-else-if="searchQuery" class="search-empty">
              未找到相关结果
            </div>
            <div v-else class="search-empty">
              输入关键词搜索课程和章节
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Main Content with top padding for fixed navbar -->
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="content-wrap">
        <div class="footer-inner">
          <div>
            <div class="footer-brand">
              <span class="brand-mark">AI</span>
              <span>AI 学堂</span>
            </div>
            <p>产品经理的 AI 学习平台 · 系统学习，从入门到精通</p>
          </div>
          <div>
            Vue 3 + TypeScript + Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
