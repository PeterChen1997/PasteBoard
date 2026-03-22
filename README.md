# Paste Board

Paste Board 是一个基于 Next.js App Router 的轻量级 Paste 管理应用，围绕 “Thread -> Paste” 这一层级组织内容，适合做临时文本收集、代码片段归档和团队内部轻量共享。

当前版本已经具备基础可用的线程与内容管理能力，但整体仍处于 MVP 阶段：核心流程能跑通，工程化能力、稳定性和可维护性还有明显提升空间。

## 功能概览

- 创建 Thread，用标题组织一组相关内容
- 在 Thread 内新增 Paste
- 编辑已有 Paste 内容
- 在已有 Paste 末尾追加内容
- 删除不再需要的 Paste
- 按标题搜索 Thread
- 按内容搜索 Paste
- 查看 Thread 创建时间、最近更新时间和 Paste 数量
- 支持浅色 / 深色主题切换

## 技术栈

- Next.js 15 + React 19
- TypeScript
- App Router Route Handlers
- TanStack Query
- Drizzle ORM
- Neon Postgres
- Tailwind CSS
- Radix UI

## 目录结构

```text
app/
  api/                     # Route Handlers
    threads/
      route.ts             # Thread 列表、创建
      [id]/
        route.ts           # Thread 详情
        pastes/
          route.ts         # Paste 列表、创建
  components/              # 页面组件与 UI 组件
  lib/                     # 数据库、schema、类型、工具函数
  threads/[id]/page.tsx    # Thread 详情页
  page.tsx                 # 首页
```

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

项目运行依赖 `DATABASE_URL`，可在仓库根目录创建 `.env`：

```bash
DATABASE_URL=your_neon_postgres_connection_string
```

3. 启动开发环境

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

## 常用命令

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## 当前接口

```text
GET    /api/threads
POST   /api/threads
GET    /api/threads/[id]
GET    /api/threads/[id]/pastes
POST   /api/threads/[id]/pastes
PATCH  /api/threads/[id]/pastes/[pasteId]
DELETE /api/threads/[id]/pastes/[pasteId]
```

## 工程现状

这个仓库更像一个带真实数据库接入的产品原型，而不是一个已经完备的生产级项目。目前比较明显的缺口包括：

- 缺少数据库迁移和初始化说明
- 缺少自动化测试
- 缺少更系统化的请求校验、日志与监控方案
- 还没有分页 UI、线程编辑、批量操作等进阶能力
- 当前仍以单仓库 MVP 的方式组织，后续可以继续抽离数据访问层和测试基建

## 推荐阅读

- 项目 review 与优化路线图：
  [docs/review-and-roadmap.md](/Users/peterchen/code_hub/paste-board/docs/review-and-roadmap.md)
