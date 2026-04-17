<script setup lang="ts">
import { ref, computed } from 'vue'
import { courses } from '../data/courses'
import { useStore } from '../store'

const { progress, totalCompletedChapters, learningDays, resetProgress, exportData, importData } = useStore()

const isAuthenticated = ref(false)
const passwordInput = ref('')
const passwordError = ref(false)
const importText = ref('')
const importStatus = ref<'idle' | 'success' | 'error'>('idle')

const ADMIN_PASSWORD = 'admin123'

function login() {
  if (passwordInput.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true
    passwordError.value = false
  } else {
    passwordError.value = true
  }
}

function handleExport() {
  const data = exportData()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-learning-progress-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleImport() {
  const ok = importData(importText.value)
  importStatus.value = ok ? 'success' : 'error'
  if (ok) importText.value = ''
  setTimeout(() => (importStatus.value = 'idle'), 3000)
}

function handleReset() {
  if (confirm('确定要重置所有学习进度吗？此操作不可恢复。')) {
    resetProgress()
  }
}

const allChapterIds = computed(() => courses.flatMap((c) => c.chapters.map((ch) => ch.id)))

const stats = computed(() => ({
  totalCourses: courses.length,
  totalChapters: allChapterIds.value.length,
  beginnerCourses: courses.filter((c) => c.level === 'beginner').length,
  intermediateCourses: courses.filter((c) => c.level === 'intermediate').length,
  advancedCourses: courses.filter((c) => c.level === 'advanced').length,
  completedChapters: totalCompletedChapters.value,
  bookmarks: progress.bookmarks.length,
  learningDays: learningDays.value,
}))
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-8 py-10">
    <h1 class="text-3xl font-bold mb-8 tracking-tight">管理后台</h1>

    <!-- Login Gate -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-[400px]">
      <div class="w-full max-w-md">
        <div class="rounded-xl border overflow-hidden" style="background-color: var(--bg-card); border-color: var(--border)">
          <div class="h-1 animated-gradient"></div>
          <div class="p-8">
            <div class="text-center mb-8">
              <div class="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4" style="background: color-mix(in srgb, var(--accent) 15%, transparent)">🔒</div>
              <h2 class="text-xl font-bold">管理员登录</h2>
              <p class="text-sm mt-2" style="color: var(--text-muted)">请输入管理密码以访问管理后台</p>
            </div>
            <form @submit.prevent="login">
              <input
                v-model="passwordInput"
                type="password"
                placeholder="请输入密码"
                class="w-full px-4 py-3 rounded-xl border text-sm outline-none mb-4 transition-all duration-200 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                style="background-color: var(--bg-primary); border-color: var(--border); color: var(--text-primary)"
              />
              <p v-if="passwordError" class="text-sm mb-3 flex items-center gap-1.5" style="color: var(--danger)">
                <span>✗</span> 密码错误，请重试
              </p>
              <button
                type="submit"
                class="w-full py-3 rounded-xl font-semibold text-white cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                style="background: linear-gradient(135deg, var(--accent), var(--success))"
              >
                登录
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Panel -->
    <div v-else class="space-y-6">
      <!-- Stats Cards -->
      <div class="rounded-xl border overflow-hidden" style="background-color: var(--bg-card); border-color: var(--border)">
        <div class="px-6 py-4 border-b" style="border-color: var(--border)">
          <h2 class="text-lg font-bold">平台统计</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-4 gap-4 mb-4">
            <div class="rounded-xl p-4 text-center border" style="background-color: var(--bg-primary); border-color: var(--border)">
              <div class="text-2xl font-bold" style="color: var(--accent)">{{ stats.totalCourses }}</div>
              <div class="text-xs mt-1" style="color: var(--text-muted)">总课程数</div>
            </div>
            <div class="rounded-xl p-4 text-center border" style="background-color: var(--bg-primary); border-color: var(--border)">
              <div class="text-2xl font-bold" style="color: var(--accent)">{{ stats.totalChapters }}</div>
              <div class="text-xs mt-1" style="color: var(--text-muted)">总章节数</div>
            </div>
            <div class="rounded-xl p-4 text-center border" style="background-color: var(--bg-primary); border-color: var(--border)">
              <div class="text-2xl font-bold" style="color: var(--success)">{{ stats.completedChapters }}</div>
              <div class="text-xs mt-1" style="color: var(--text-muted)">已完成章节</div>
            </div>
            <div class="rounded-xl p-4 text-center border" style="background-color: var(--bg-primary); border-color: var(--border)">
              <div class="text-2xl font-bold" style="color: var(--warning)">{{ stats.bookmarks }}</div>
              <div class="text-xs mt-1" style="color: var(--text-muted)">收藏数</div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="rounded-xl p-4 text-center border" style="background-color: var(--bg-primary); border-color: var(--border)">
              <div class="text-2xl font-bold" style="color: var(--beginner)">{{ stats.beginnerCourses }}</div>
              <div class="text-xs mt-1" style="color: var(--text-muted)">初级课程</div>
            </div>
            <div class="rounded-xl p-4 text-center border" style="background-color: var(--bg-primary); border-color: var(--border)">
              <div class="text-2xl font-bold" style="color: var(--intermediate)">{{ stats.intermediateCourses }}</div>
              <div class="text-xs mt-1" style="color: var(--text-muted)">中级课程</div>
            </div>
            <div class="rounded-xl p-4 text-center border" style="background-color: var(--bg-primary); border-color: var(--border)">
              <div class="text-2xl font-bold" style="color: var(--advanced)">{{ stats.advancedCourses }}</div>
              <div class="text-xs mt-1" style="color: var(--text-muted)">高级课程</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Export & Import Row -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Export -->
        <div class="rounded-xl border" style="background-color: var(--bg-card); border-color: var(--border)">
          <div class="px-6 py-4 border-b" style="border-color: var(--border)">
            <h2 class="text-lg font-bold">数据导出</h2>
          </div>
          <div class="p-6">
            <p class="text-sm mb-5" style="color: var(--text-secondary)">导出当前所有学习进度数据为 JSON 文件</p>
            <button
              class="px-5 py-2.5 rounded-xl font-medium text-sm text-white cursor-pointer transition-all duration-200 hover:shadow-lg"
              style="background-color: var(--accent)"
              @click="handleExport"
            >
              📥 导出数据
            </button>
          </div>
        </div>

        <!-- Import -->
        <div class="rounded-xl border" style="background-color: var(--bg-card); border-color: var(--border)">
          <div class="px-6 py-4 border-b" style="border-color: var(--border)">
            <h2 class="text-lg font-bold">数据导入</h2>
          </div>
          <div class="p-6">
            <textarea
              v-model="importText"
              rows="3"
              placeholder='粘贴 JSON 数据...'
              class="w-full px-4 py-3 rounded-xl border text-sm outline-none mb-4 font-mono transition-all duration-200 focus:border-[var(--accent)]"
              style="background-color: var(--bg-primary); border-color: var(--border); color: var(--text-primary); resize: vertical"
            />
            <div class="flex items-center gap-3">
              <button
                class="px-5 py-2.5 rounded-xl font-medium text-sm text-white cursor-pointer transition-all duration-200"
                style="background-color: var(--success)"
                :disabled="!importText.trim()"
                @click="handleImport"
              >
                📤 导入数据
              </button>
              <span v-if="importStatus === 'success'" class="text-sm font-medium" style="color: var(--success)">✓ 导入成功</span>
              <span v-if="importStatus === 'error'" class="text-sm font-medium" style="color: var(--danger)">✗ 数据格式无效</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="rounded-xl border" style="background-color: var(--bg-card); border-color: color-mix(in srgb, var(--danger) 30%, var(--border))">
        <div class="px-6 py-4 border-b" style="border-color: color-mix(in srgb, var(--danger) 20%, var(--border))">
          <h2 class="text-lg font-bold" style="color: var(--danger)">⚠️ 危险操作</h2>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium mb-1">重置所有学习进度</p>
              <p class="text-xs" style="color: var(--text-muted)">清除所有进度、收藏和书签。此操作不可恢复。</p>
            </div>
            <button
              class="px-5 py-2.5 rounded-xl font-medium text-sm text-white cursor-pointer transition-all duration-200 shrink-0"
              style="background-color: var(--danger)"
              @click="handleReset"
            >
              🗑️ 重置进度
            </button>
          </div>
        </div>
      </div>

      <!-- Logout -->
      <div class="text-center pt-4">
        <button
          class="text-sm cursor-pointer transition-colors duration-200 hover:text-[var(--accent)]"
          style="color: var(--text-muted)"
          @click="isAuthenticated = false; passwordInput = ''"
        >
          退出管理后台
        </button>
      </div>
    </div>
  </div>
</template>
