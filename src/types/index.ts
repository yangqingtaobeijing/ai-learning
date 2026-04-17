export interface Course {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  chapters: Chapter[]
  tags: string[]
  icon: string
}

export interface Chapter {
  id: string
  title: string
  content: string
  duration: string
  type: 'theory' | 'practice' | 'project'
}

export interface UserProgress {
  completedChapters: string[]
  bookmarks: string[]
  lastVisited: { courseId: string; chapterId: string } | null
  startDate: string
}
