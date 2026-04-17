import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/courses', name: 'Courses', component: () => import('../views/Courses.vue') },
  { path: '/course/:courseId', name: 'CourseDetail', component: () => import('../views/CourseDetail.vue') },
  { path: '/course/:courseId/:chapterId', name: 'ChapterContent', component: () => import('../views/ChapterContent.vue') },
  { path: '/progress', name: 'Progress', component: () => import('../views/Progress.vue') },
  { path: '/admin', name: 'Admin', component: () => import('../views/Admin.vue') },
  { path: '/settings', name: 'Settings', component: () => import('../views/Settings.vue') },
]

const router = createRouter({
  history: createWebHashHistory('/ai-learning/'),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
