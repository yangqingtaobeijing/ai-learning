<script setup lang="ts">
import { useStore } from '../store'

const { theme, toggleTheme, resetProgress, exportData } = useStore()

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

function handleReset() {
  if (confirm('确定要清除所有学习进度吗？此操作不可恢复。')) {
    resetProgress()
  }
}
</script>

<template>
  <div class="max-w-[900px] mx-auto px-8 py-10">
    <h1 class="text-3xl font-bold mb-2 tracking-tight">设置</h1>
    <p class="mb-8" style="color: var(--text-secondary)">管理你的偏好和数据</p>

    <div class="space-y-4">
      <!-- Theme -->
      <div class="rounded-xl border overflow-hidden" style="background-color: var(--bg-card); border-color: var(--border)">
        <div class="flex items-center justify-between px-6 py-5">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: color-mix(in srgb, var(--accent) 15%, transparent)">
              <span class="text-lg">{{ theme.value === 'dark' ? '🌙' : '☀️' }}</span>
            </div>
            <div>
              <h2 class="font-semibold">主题设置</h2>
              <p class="text-sm mt-0.5" style="color: var(--text-muted)">
                当前：{{ theme.value === 'dark' ? '深色模式' : '浅色模式' }}
              </p>
            </div>
          </div>
          <button
            class="px-5 py-2.5 rounded-xl font-medium text-sm border cursor-pointer transition-all duration-200"
            style="border-color: var(--border); color: var(--text-primary); background: transparent"
            @click="toggleTheme"
          >
            切换为{{ theme.value === 'dark' ? '浅色' : '深色' }}模式
          </button>
        </div>
      </div>

      <!-- Export -->
      <div class="rounded-xl border overflow-hidden" style="background-color: var(--bg-card); border-color: var(--border)">
        <div class="flex items-center justify-between px-6 py-5">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: color-mix(in srgb, var(--success) 15%, transparent)">
              <span class="text-lg">📥</span>
            </div>
            <div>
              <h2 class="font-semibold">导出数据</h2>
              <p class="text-sm mt-0.5" style="color: var(--text-muted)">导出学习进度和收藏数据为 JSON 文件</p>
            </div>
          </div>
          <button
            class="px-5 py-2.5 rounded-xl font-medium text-sm text-white cursor-pointer transition-all duration-200 hover:shadow-lg"
            style="background-color: var(--accent)"
            @click="handleExport"
          >
            导出
          </button>
        </div>
      </div>

      <!-- Clear Progress -->
      <div class="rounded-xl border overflow-hidden" style="background-color: var(--bg-card); border-color: color-mix(in srgb, var(--danger) 20%, var(--border))">
        <div class="flex items-center justify-between px-6 py-5">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: color-mix(in srgb, var(--danger) 15%, transparent)">
              <span class="text-lg">🗑️</span>
            </div>
            <div>
              <h2 class="font-semibold" style="color: var(--danger)">清除学习进度</h2>
              <p class="text-sm mt-0.5" style="color: var(--text-muted)">重置所有进度、收藏和书签，此操作不可恢复</p>
            </div>
          </div>
          <button
            class="px-5 py-2.5 rounded-xl font-medium text-sm text-white cursor-pointer transition-all duration-200"
            style="background-color: var(--danger)"
            @click="handleReset"
          >
            清除
          </button>
        </div>
      </div>

      <!-- About -->
      <div class="rounded-xl border overflow-hidden" style="background-color: var(--bg-card); border-color: var(--border)">
        <div class="px-6 py-5">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: color-mix(in srgb, var(--advanced) 15%, transparent)">
              <span class="text-lg">🤖</span>
            </div>
            <div>
              <h2 class="font-semibold">关于 AI 学堂</h2>
              <p class="text-sm mt-0.5" style="color: var(--text-muted)">产品经理的 AI 学习平台</p>
            </div>
          </div>
          <div class="ml-14 space-y-1.5 text-sm" style="color: var(--text-secondary)">
            <p>系统化学习 AI 知识，从基础认知到产品实战</p>
            <p class="flex items-center gap-2">
              <span class="text-xs px-2 py-0.5 rounded" style="background: var(--bg-primary); color: var(--text-muted)">Vue 3</span>
              <span class="text-xs px-2 py-0.5 rounded" style="background: var(--bg-primary); color: var(--text-muted)">TypeScript</span>
              <span class="text-xs px-2 py-0.5 rounded" style="background: var(--bg-primary); color: var(--text-muted)">Tailwind CSS</span>
              <span class="text-xs px-2 py-0.5 rounded" style="background: var(--bg-primary); color: var(--text-muted)">Vite</span>
            </p>
            <p class="text-xs" style="color: var(--text-muted)">数据存储于本地 localStorage，不会上传到任何服务器</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
