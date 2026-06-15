---
title: "Agent Skills 生态全景观察"
date: 2026-06-15T10:18:00+08:00
slug: agent-skills-ecosystem-overview
tags: ["AI时代", "AI-Agent", "软件工程", "开源"]
featured_image: '/images/agent-skills-ecosystem-overview.jpg'
summary: 'Vercel 一个找 skill 的 skill 装了 201.9 万次——AI Agent 的下半场从"调 API"变成"装技能包"。'
draft: false
---


# Agent Skills 生态全景观察

## 一、Vercel 有一个"找 skill 的 skill"，装了两百万次

在 2026 年谈 AI Agent，大家还是习惯拼模型、拼上下文、拼 Tool Use。

但如果你去看 `skills.sh` 这个榜单，会看到一个有点反直觉的事实：

> **Vercel Labs 发布的一个叫 `find-skills` 的 skill，已经被安装了 201.9 万次。**

这玩意儿干的事情极其简单——帮你**找其他 skill**。

换句话说，**Agent 圈现在最大的痛点，不是"模型不够强"，而是"我不知道该装什么"**。当 9,596 个 skill 同时存在、每周还在以几百个的速度新增，"目录"和"发现"本身就成了新基建。

这背后是 AI Agent 的一个静悄悄的转折点：

> **AI Agent 的下半场，从"调 API"变成了"装技能包"。**

---

## 二、SKILL.md 正在成为 Agent 时代的 README

什么是 Agent Skills？Anthropic 在 2025 年 10 月正式公开了标准，核心就两件东西：

- 一个文件夹
- 一份 `SKILL.md`（YAML frontmatter + Markdown 指令）

没了。

这种极简设计带来几个关键特性：

- **跨平台**：Claude Code、Cursor、Codex、GitHub Copilot、Windsurf、Gemini CLI、Goose、Cline、Zed 等 20+ 工具都认
- **零运行时**：本质是给模型读的一段文字 + 几个脚本，不绑定任何平台
- **人人可写**：会写 Markdown 就能发 skill，门槛远低于写一个 GPTs 或 Coze 插件

为了让你分清这堆"X"的关系，我列一个对比：

| 概念 | 性质 | 平台绑定 | 学习成本 |
|---|---|---|---|
| **Agent Skills (SKILL.md)** | 开放标准 | ❌ 跨平台 | 低（写文档）|
| GPTs | OpenAI 应用 | ✅ 仅 ChatGPT | 中 |
| Coze 插件 | 字节应用 | ✅ 仅扣子/飞书 | 中 |
| MCP | 协议 | ⚠️ 半开放 | 高（写服务）|
| Function Call | 模型能力 | 通用 | 高（写代码）|

简单说：**SKILL.md 是 Agent 时代的 README，GPTs 是 App Store 应用，MCP 是 RPC 协议。**

不在一个量级。

---

## 三、生态地图：9,596 个 skill 都在干嘛

数据不会撒谎。先看头部（2026-06-15 榜单）：

| 排名 | Skill | 厂牌 | 安装量 | 周安装 |
|---|---|---|---|---|
| 1 | find-skills | Vercel Labs | **201.9 万** | 11.8 万 |
| 2 | frontend-design | Anthropic | **54.5 万** | 3.2 万 |
| 3 | vercel-react-best-practices | Vercel Labs | 47.6 万 | 1.9 万 |
| 4 | agent-browser | Vercel Labs | 44.9 万 | 2.3 万 |
| 5 | microsoft-foundry | Microsoft Azure | 39.1 万 | 1.5 万 |
| 6 | web-design-guidelines | Vercel Labs | 39.0 万 | 1.9 万 |
| 7-20 | azure-* / entra-* / appinsights-* | Microsoft Azure | 各 32-39 万 | ~1.5 万 |

几个观察：

1. **Vercel 一家在前 6 名里占 4 席**。它不只是"Next.js 那个公司"了，它是 Agent 生态的基础设施供应商。
2. **Microsoft Azure 一口气占 20+ 席位**，各 38 万左右，企业云基本被它扫了一遍。
3. **Anthropic 自家最火的不是聊天**，是 `frontend-design`——一个让 Claude 写前端代码的 skill，单 skill 安装量 54.5 万。
4. 头部 80% 都是大厂官方出品，长尾才是个人的。

更值得关注的是**周增速**——这是判断"火不火"比累计安装更准的指标：

- `qu-skills/skills`（2 周前发布）周增 **14.9 万**，全部是 AI 视频/图像/avatar 生成类
- `browser-act`（浏览器自动化 skill 工厂）周增 1.0 万
- `Matt Pocock` 的 `grill-me`（让 AI 挑刺你代码）周增 4.2 万

**新热点的形状**：单点突破 + 垂直化 + 增长曲线陡峭。

---

## 四、大厂都在怎么玩

### 4.1 Anthropic — 标准源头 + 文档四件套

作为标准的提出者，Anthropic 走的是"开源自家的核心能力"路线：

- **document-skills**（docx / pdf / pptx / xlsx）—— 跟 Claude 内部文档能力同源
- **skill-creator**（27 万安装）—— 教你写 skill 的 skill
- **frontend-design**（54.5 万）—— 让 Claude 写漂亮前端的范式

打法很清晰：**我不靠卖 skill 赚钱，我靠让大家都用 SKILL.md 标准来巩固生态位**。

### 4.2 Vercel Labs — 平台 + 目录 + 工具链

如果说 Anthropic 是"标准制定者"，Vercel 就是"生态运营者"：

- `find-skills`（201.9 万）—— 入口
- `vercel-react-best-practices`（47.6 万）—— 范式
- `agent-browser`（44.9 万）—— 浏览器代理能力
- `web-design-guidelines`（39.0 万）—— 设计规范
- `vercel/ai` 的 `ai-sdk`（3.4 万）—— 模型调用 SDK
- `next-cache-components` / `next-upgrade` —— Next.js 工程

Vercel 已经把"Agent 基础设施"和"前端最佳实践"两件事打包了。

### 4.3 Microsoft — Azure 全家桶 + Copilot

微软的打法是"企业云+开发工具"双线并进：

- **Azure 全套 20+ skill**：从 `azure-postgres` 到 `azure-ai` 到 `azure-hosted-copilot-sdk` 到 `entra-app-registration` 到 `appinsights-instrumentation`，每个都是 30-40 万安装
- **GitHub Copilot 系列**：`git-commit`、`gh-cli`、`documentation-writer`、`prd`、`excalidraw-diagram-generator`

它是头部最"重"的一家——**不动声色把企业 IT 流程全装了一遍**。

### 4.4 Google — Workspace + Firebase + Stitch

Google 走的是"自家 SaaS 全套接入"路线：

- **googleworkspace/cli**（20+ 个 `gws-*`）—— Drive / Docs / Sheets / Gmail / Calendar / Slides / Meet / Forms / Tasks 都有
- **firebase/agent-skills**（5 个）—— firebase-basics、firebase-ai-logic、developing-genkit-python
- **google-labs-code/stitch-skills** —— 实验性的设计/视频生成

打法没 Vercel 那么激进，但**稳**——每个 `gws-*` 稳定 1,000-2,000 周活，是"日常工具型" skill 的代表。

### 4.5 字节飞书 — 中文区霸榜

这个是**中文区最值得关注的厂牌**：

- `larksuite/cli` 一整套 9 个 skill —— `lark-doc`、`lark-base`、`lark-im`、`lark-drive`、`lark-shared`、`lark-calendar`、`lark-wiki`、`lark-whiteboard`、`lark-sheets`
- 每个 23 万+ 安装、周活 2.5 万

这是**唯一在 Vercel 主导的全球榜单上霸榜的中文厂牌**。其他中文 skill 像 `jimliu/baoyu-skills`（中文公众号 15+ 个）、`alchaincyf/huashu-design` 都是个人/小团队在做，**只有飞书是厂牌级别入场**。

如果你是做 toB / 出海，这一点必须盯。

### 4.6 其他横评（一页装下）

| 厂牌 | 核心 skill | 月活代表 |
|---|---|---|
| Stripe | stripe-projects | 3.4 万安装 / 3.2k 周 |
| Cloudflare | cloudflare、wrangler | 4.6 万安装 / 4.4k 周 |
| Supabase | supabase-postgres-best-practices | 23.1 万安装 / 1.6 万周 |
| Expo | expo-deployment / dev-client / cicd | 16 万安装 / 1 万周 |
| Remotion | remotion-best-practices | 37.1 万安装 / 1.5 万周 |
| better-auth | 鉴权 4 件套（create-auth / 2FA / org）| 8 万安装 / 4.4k 周 |

**Stripe、Cloudflare、Supabase 都在做"自家伙伴的 skill 化"**——把开发者常用的 SDK / CLI 转成 agent 友好的 skill，是个稳赢的方向。

---

## 五、6 大工作流：大家都在拿 skill 干什么

把 9,596 个 skill 按用途分，6 个方向占了 85%+ 的安装量：

### 1. AI Agent 基建（自家生态）
Vercel 整套、Anthropic 标准、Microsoft Azure、Notion、Slack 的官方 skill 都在这一类。**最热，也最卷**。

### 2. 办公协作 / SaaS 工具集成
Google Workspace 全套、飞书全套、Microsoft 365、GitHub、Notion、Linear、ClickUp——**刚需最大**。每多一个 SaaS，就多一类 skill。

### 3. 前端 / 移动开发
Next.js（Vercel）、Vue / Vite / Vitest（antfu）、SwiftUI、React 最佳实践、Expo、shadcn-ui、NestJS、GSAP——**技术博客社区最活跃的一类**。

### 4. 设计与创意生成（增速最猛）
Anthropic `frontend-design`（爆款）、pbakaus/impeccable 设计套件、ckm:design-system、Remotion、qu-skills 视频/图像/avatar 5 件套（2 周 **14.9 万/周**）、agentspace-so runcomfy（11 件，各 23 万+）、gpt-image-2、nano-banana、flux——

**这一类是 2026 年真正的增长黑马云图**。

### 5. 后端 / 云 / DevOps / 测试
Azure 20+ 服务、Cloudflare、Firebase、wrangler、Momentic 测试、better-auth 鉴权、Matt Pocock TDD/grill-me（4.2 万/周）、Docker expert。**节奏稳，企业买单最多**。

### 6. 内容创作 / 营销 / SEO / 写作
coreyhaines31/marketingskills（15+ 营销类）、SEO / SEO-geo / Backlink、documentation-writer、mattpocock/writing-shape 等写作风格类。**小而美，长尾稳定**。

---

## 六、4 个正在发生的趋势

### 趋势 1：标准之争才刚开始

`agentskills.io` 是个标准，但**目录归谁**是下一个问题。

Vercel 拿了目录（find-skills 201.9 万），Anthropic 拿了下游能力（document-skills、frontend-design、skill-creator），Google / Microsoft 拿了自家 SaaS 入口（gws-*、azure-*），字节飞书拿了中文区（lark-*）——

**没有一家通吃**。这也是为什么 `skill-vetter`（useai-pro 出品的安全审计 skill，1.9 万安装）这种"基础设施中的基础设施"反而有空间。

### 趋势 2：垂直化正在加速

头部 skill 已经不拼"功能多"，开始拼"垂直深"：

- 鉴权：`better-auth` 4 件套（create-auth / email / org / 2FA）
- 视频生成：`qu-skills` 5 件套 / `agentspace-so` 11 件套
- 写作风格：`mattpocock` 3 件套（shape / fragments / beats）
- 测试：`momentic-ai` 2 件套

**通用型 skill 已经被卷死，垂直型 skill 才是新机会**。

### 趋势 3：中文化才刚起跑

飞书霸榜是个开始，但**中文内容创作类 skill 还是个人/小团队在做**（baoyu 公众号、huashu 设计、humanizer-zh 去 AI 化）——

没有中文大厂像 Anthropic / Vercel 那样下场做"中文场景的标准源"。

**谁先把"中文场景的标准 skill 库"做出来，谁就拿下中文区**。

### 趋势 4：安全化是隐线

SKILL.md 本质是给模型执行的一段指令——**这玩意本身就是攻击面**。

`useai-pro/openclaw-skills-security` 出的 `skill-vetter` 是个信号：未来会有专门的"skill 投毒"、"skill 审计"、"skill 签名"赛道。

如果你要做企业级 skill 落地，**安全审计是必选项，不是可选项**。

---

## 七、给你的一句话建议

别再只盯着 prompt 调优了。

打开 `~/.claude/skills/` 或者你用的 Agent 工具的 skill 目录，**给你的 agent 写第一份 SKILL.md**。

写不出来的话，去装一个 `skill-creator`（27 万人装过，肯定比我靠谱）。

> **AI Agent 的下半场，会用 skill 的人和不会用的人，差距会从 10% 拉到 90%。**

---

## 附录：数据源

- 主榜单：`https://skills.sh`（Vercel 维护的 Agent Skills Directory）
- 标准源：`https://agentskills.io` + `https://github.com/anthropics/skills`
- 排行榜覆盖 9,596 个 skill，累计 70.9 万次安装，TOP 100 头部 80%+ 来自大厂官方
