# AI 学堂

面向产品经理的 AI 学习平台。项目使用 Vue 3、TypeScript、Vite 和 Tailwind CSS，课程数据目前以内置 TypeScript 数据文件的形式保存在前端。

## 已有功能

- 课程列表、等级筛选和课程搜索
- 课程详情、章节阅读、上一章/下一章导航
- 学习进度、章节完成状态、收藏列表和最近访问记录
- 深色/浅色主题切换
- 本地学习数据导入、导出和重置
- 管理后台演示页
- 基础移动端适配

## 技术栈

- Vue 3 + `<script setup>`
- TypeScript
- Vue Router hash 模式
- Vite
- Tailwind CSS v4
- `marked` 渲染 Markdown 课程内容

## 开发命令

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 目录结构

```text
src/
  App.vue               全局导航、搜索和页面容器
  data/courses.ts       课程与章节内容
  router/index.ts       路由配置
  store/index.ts        localStorage 状态、进度、主题和数据导入导出
  types/index.ts        课程与进度类型
  views/                页面组件
```

## 当前状态

应用主流程已经可以构建和运行。所有章节都已具备可阅读内容；中级后半段和高级课程使用统一的结构化章节模板，适合作为初版教材继续逐章扩写。
