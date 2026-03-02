# AI Chatbot 项目文档

## 一、项目概述

这是一个基于 Next.js 和 Vercel AI SDK 构建的全栈 AI 聊天机器人应用，支持多模型切换、流式响应、聊天历史存储、代码高亮、图表渲染等功能。

**项目地址**: https://github.com/xiezzzzl/ai-chatbot  
**在线演示**: https://ai-chatbot-zeta-virid-98.vercel.app

---

## 二、技术栈

### 前端
| 技术 | 用途 |
|------|------|
| Next.js 16 | React 全栈框架 |
| React 19 | UI 库 |
| TypeScript | 类型安全 |
| Tailwind CSS 4 | 样式框架 |
| shadcn/ui | UI 组件库 |
| Radix UI | 无样式组件库 |
| Framer Motion | 动画 |

### 后端
| 技术 | 用途 |
|------|------|
| Next.js App Router | 服务端渲染 & API |
| Server Actions | 后端逻辑 |
| NextAuth.js (Auth.js) | 身份认证 |

### AI & 数据
| 技术 | 用途 |
|------|------|
| Vercel AI SDK | AI 统一 API |
| Vercel AI Gateway | 多模型网关 |
| 支持模型: OpenAI, Anthropic, Google Gemini, xAI | 大语言模型 |

### 数据库
| 技术 | 用途 |
|------|------|
| PostgreSQL (Neon) | 主数据库 |
| Drizzle ORM | ORM 映射 |
| Redis (Vercel KV) | 会话存储 & 速率限制 |
| Vercel Blob | 文件存储 |

### 开发工具
| 技术 | 用途 |
|------|------|
| pnpm | 包管理器 |
| Biome | 代码规范 |
| Playwright | E2E 测试 |
| Drizzle Kit | 数据库迁移 |

---

## 三、项目结构

```
ai-chatbot/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 认证相关页面
│   │   ├── login/           # 登录页
│   │   ├── register/        # 注册页
│   │   └── auth.ts          # NextAuth 配置
│   ├── (chat)/              # 聊天页面
│   │   ├── page.tsx         # 新建聊天
│   │   └── chat/[id]/       # 聊天详情页
│   └── api/                 # API 路由
├── components/              # React 组件
│   ├── chat.tsx             # 核心聊天组件
│   ├── message.tsx          # 消息组件
│   ├── multimodal-input.tsx # 多模态输入框
│   ├── sidebar-history.tsx  # 侧边栏历史
│   └── ui/                  # shadcn/ui 组件
├── lib/
│   ├── ai/                  # AI 相关
│   │   ├── models.ts        # 模型配置
│   │   ├── providers.ts     # 模型提供者
│   │   └── tools/           # AI 工具函数
│   ├── db/                  # 数据库
│   │   ├── schema.ts        # 表结构
│   │   ├── queries.ts      # 查询函数
│   │   └── migrate.ts      # 迁移脚本
│   └── utils.ts             # 工具函数
├── hooks/                    # 自定义 Hooks
└── drizzle.config.ts        # Drizzle 配置
```

---

## 四、核心功能

### 1. 多模型支持
支持切换多个 AI 模型：
- **Google**: Gemini 2.5 Flash Lite, Gemini 3 Pro
- **OpenAI**: GPT-4.1 Mini, GPT-5.2
- **Anthropic**: Claude Haiku, Claude Sonnet, Claude Opus
- **xAI**: Grok 4.1 Fast

### 2. 流式响应
使用 Vercel AI SDK 实现实时流式输出，边聊边显示结果。

### 3. 聊天历史
- 自动保存聊天记录到 PostgreSQL
- 支持查看历史对话
- 可设置公开/私密聊天

### 4. 代码高亮
集成 CodeMirror，支持代码语法高亮和编辑器功能。

### 5. 多模态输入
支持文本、图片上传等多模态交互。

### 6. AI 工具调用
支持 AI 主动调用工具，如：
- 天气查询
- 文档创建/编辑
- 建议生成
- **学术论文搜索** (新增)

### 7. 身份认证
- 支持游客模式登录
- 支持注册账号
- NextAuth.js 提供安全保障

---

## 五、数据库设计

### 表结构 (Drizzle ORM)

```typescript
// 用户表
User {
  id: uuid (主键)
  email: varchar (64)
  password: varchar (64, 可选)
}

// 聊天表
Chat {
  id: uuid (主键)
  createdAt: timestamp
  title: text
  userId: uuid (外键 -> User)
  visibility: enum (public/private)
}

// 消息表 (v2)
Message_v2 {
  id: uuid (主键)
  chatId: uuid (外键 -> Chat)
  role: varchar (user/assistant)
  parts: json (消息内容)
  attachments: json (附件)
  createdAt: timestamp
}

// 投票表
Vote_v2 {
  chatId: uuid (外键)
  messageId: uuid (外键)
  isUpvoted: boolean
}

// 文档表
Document {
  id: uuid
  createdAt: timestamp
  title: text
  content: text
  kind: enum (text/code/image/sheet)
  userId: uuid (外键 -> User)
}
```

---

## 六、部署

### Vercel 一键部署
1. 访问 https://vercel.com/new/import
2. 选择 GitHub 仓库
3. 点击 Deploy

### 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `AUTH_SECRET` | NextAuth 密钥 | `openssl rand -base64 32` 生成 |
| `POSTGRES_URL` | PostgreSQL 连接串 | Vercel 自动配置 |
| `REDIS_URL` | Redis 连接串 | Vercel 自动配置 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token | Vercel 自动配置 |
| `AI_GATEWAY_API_KEY` | AI Gateway API | Vercel 自动配置 |

---

## 七、面试问答

### Q1: 这个项目的技术选型是怎么考虑的？

**答**：选择 Next.js 是因为它是 React 全栈框架的天花板，支持服务端渲染、API Routes、Server Actions 等特性，非常适合构建 AI 应用。选择 Vercel AI SDK 是因为它提供了统一的 AI 接口，可以轻松切换不同模型商（OpenAI、Anthropic、Google 等），降低了厂商锁定风险。数据库选择 PostgreSQL + Redis 是因为结构化数据适合用关系型数据库，而会话和速率限制适合用内存数据库。

### Q2: 如何实现流式响应的？

**答**：使用 Vercel AI SDK 的 `useChat` hook，它内部使用 Server-Sent Events (SSE) 接收服务端流式数据。服务端通过 `streamText()` API 将 AI 的响应以流的形式返回，客户端 hook 会实时更新 UI，无需等待完整响应。

### Q3: 项目中遇到的最大挑战是什么？

**答**：对于这个项目，最大的挑战是多模型切换的兼容性处理。不同模型的 API 接口、参数格式、响应结构都有差异，通过 Vercel AI Gateway 统一了这些差异，但在某些高级功能（如工具调用、推理模型）上仍需要针对不同模型做适配处理。

### Q4: 如何保证数据安全？

**答**：使用环境变量管理敏感信息，从不提交到 Git。密码使用 bcrypt 加密存储。NextAuth 使用 HTTP-only Cookie 存储 session。数据库使用 Vercel 提供的 Serverless PostgreSQL，默认启用了加密。

### Q5: 数据库迁移是如何管理的？

**答**：使用 Drizzle Kit 进行数据库迁移。每次 schema 变更后，运行 `pnpm db:generate` 生成迁移文件，然后 `pnpm db:migrate` 执行迁移。在 Vercel 上通过 `package.json` 的 build 脚本自动执行迁移。

### Q6: 前端性能是如何优化的？

**答**：主要使用了以下优化手段：
1. React Server Components (RSC) 减少客户端 JavaScript
2. 流式渲染加快首屏加载
3. 客户端组件使用 `use client` 标记
4. 图片和静态资源由 Vercel CDN 加速
5. 使用 `SWR` 进行数据缓存和预取

### Q7: 如何扩展新的 AI 模型？

**答**：在 `lib/ai/models.ts` 中添加模型配置，在 `lib/ai/providers.ts` 中配置模型提供者。AI Gateway 会自动处理不同模型的 API 请求格式。

### Q8: 项目中使用了哪些设计模式？

**答**：
1. **Provider Pattern**: AI 模型通过 provider 统一封装
2. **Hook Pattern**: 自定义 hooks 封装业务逻辑（如 `use-chat`）
3. **Server Actions**: 服务端逻辑通过函数调用封装
4. **ORM Pattern**: Drizzle ORM 抽象数据库操作

### Q9: 如何处理高并发？

**答**：
1. Vercel Serverless 自动扩缩容
2. Redis 用于速率限制和会话缓存
3. 数据库连接池由 Neon Serverless 管理
4. AI Gateway 可配置缓存策略

### Q10: 项目的后续规划是什么？

**答**：
1. 添加更多 AI 工具（如网页搜索、文件解析）
2. 支持语音输入输出
3. 优化移动端体验
4. 添加团队协作功能

---

## 八、本地开发

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local

# 运行数据库迁移
pnpm db:migrate

# 启动开发服务器
pnpm dev
```

---

## 九、相关资源

- [Vercel AI SDK 文档](https://ai-sdk.dev)
- [Next.js 文档](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Neon 数据库](https://neon.tech)
