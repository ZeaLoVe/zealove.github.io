---
title: "Agent时代启示录：To Agent正在重写经济系统的底层逻辑"
date: 2026-04-24
slug: agent-era-to-agent-rewriting-economic-system
categories: ["AI时代"]
tags: ["AI时代", "AI-Agent", "商业探索"]
featured_image: '/image/agent-era-to-agent-rewriting-economic-system.png'
---

**摘要**：Anthropic 的 DAU 仅为 ChatGPT 的 2%，但两家 ARR 已追平。这不是逆袭，是旧度量衡失效的信号。当 Agent 同时成为生产者和消费者，一个从未出现过的主角登上了经济舞台。

---

## DAU 是个旧故事

2026年3月，Anthropic 年化收入（ARR）达到 300 亿美元。

同一个月份，Anthropic 产品（Claude、Claude Code 等）的日活用户总和，大约是 ChatGPT 的 2%。

这两个数字放在一起，放在五年前，任何一个 VC 都会投反对票：2% 的用户规模，凭什么撑 300 亿？

但事实就是这样。而且这个差距还在扩大。

问题不在于 Anthropic 做对了什么，而在于：**我们一直在用错误的尺子量新物种**。

---

## 旧尺度正在失效

**DAU/MAU 是互联网时代的尺子，但它从来不是为 AI 公司设计的。**

1999 年，分析师用"页面停留时间"给 Google 估值。Yahoo 用户停留 15 分钟，Google 用户停留 30 秒。按照旧逻辑，Yahoo 赢了。

Google 的用户离开得越快，恰恰说明效率越高——他们找到答案就走了。这是搜索引擎的本质，不是缺陷。

同样的逻辑正在 AI 时代重演。ChatGPT 的 DAU 高，因为它是给所有人用的泛化工具。Anthropic 的 DAU 低，因为它的核心用户是工程师、量化分析师、高价值任务执行者——这些人每天用 API 和 CLI 消耗的 Token 量，是普通对话用户的几十倍。

**价值集中在头部任务用户，而不是规模。** 这就是为什么低 DAU 可以对应高 ARR。

付费逻辑也在发生根本迁移。

传统的 SaaS 定价是 per-seat——一个席位一个月多少钱。Salesforce、Adobe、ServiceNow 都是这个逻辑。企业的购买决策走 IT 预算，预算盘子相对固定。

AI-native 的新玩家正在把锚点移向 **per-outcome**：只有 AI 真正解决了问题，才收费。Decagon 的 resolution-based pricing 只有 AI 解决了客户问题才计费；Sierra 直接把"pay for a job well done"写进产品 pitch。

锚点从 **IT 预算** 移向了 **人力成本池**。这两个池子的大小，差距是 1-2 个数量级。

最终的天花板是全球白领工资总额——美国约 6 万亿美元，全球约 **18-20 万亿美元**。

这就是 Agent 时代的终极市场。

---

## 软件正在被重写

互联网时代的软件是给人类用的。GUI、菜单、对话框——每一层抽象都是为了降低人类操作的认知负担。

**Agent 不需要这些。**

Claude Code 选择 CLI 而不是 IDE，不是功能取舍，是哲学选择。CLI 是 Agent 的母语。如果模型能力持续变强，最终的产品形态应该是更简洁、更接近底层的终端，而不是更复杂的图形界面。

这意味着一场系统性的格式迁移正在发生：

- **左列**（To Human）：图形界面、表单录入、人工审批流程、文档导出
- **右列**（To Agent）：API 调用、结构化数据、CLI 指令、自动化流水线

当 Agent 成为主要的信息消费者，信息的天然形态就要改变。

未来的软件不是一个有完整界面的应用，而是 **Model + Agent Harness + 按需生成的人类审阅层**。GUI 只在人类需要做决策时临时生成，其余全部由 Agent 自主完成。

---

## 旧范式的漫长熊市

每一次技术平台迁移，都是原生公司赢，渐进迁移者输。

雅虎不是不知道搜索重要。它的编辑导航逻辑和 Google 的爬虫算法在产品 DNA 层面互斥。每一个"搜索结果不够好，我们有编辑推荐"的优化，都是在强化旧范式的肌肉记忆。

**OpenAI 正在面临类似的问题。**

它的 8 亿用户是战略包袱，不是战略资产。每一个面向轻度对话用户的优化——更友好的 onboarding、更宽容的错误处理、更泛化的内容覆盖——都是对 Agent 深水区能力的一次妥协。对话 UI 要兼顾新手和高级用户，而 Agent 产品只需要假设用户是工程师或高价值任务的执行者。

Anthropic 没有这个包袱，所以 Claude Code 可以做成纯 CLI、纯 Agent-native。这不是技术差距，是历史包袱的重量差异。

当然，OpenAI 的综合实力和人才密度仍是全球最强之一。说这个不是在唱衰，而是指出：**最大风险不在技术，在成功基础让每个关键选择慢半拍**。

---

## To Agent：一个新物种加入了经济系统

这是全文最核心的一句话：**Agent 同时成为生产者和消费者，一个非人类双边市场正在形成。**

### 生产侧已经发生

2026年2-3月，Anthropic 在 52 天内发布了 70 多个产品 features。这个速度在互联网时代是不可想象的。

这些 features 中，大量是 Agent 写、Agent 测试、Agent 部署的。OpenAI 发布 Codex 时展示了内部全程用 Agent 编写的项目，用"no manual code"描述这种工作模式。

**本质变化：边际生产成本趋近于零。** 过去一个团队一周完成的 feature，Agent 几小时能做。100 人公司的产出，可以对标过去 1000 人公司的体量。

### 消费侧正在跟上

生产侧先行，消费侧是自然延伸。

今年 3 月，Stripe 和 Tempo 联合发布了 **Machine Payments Protocol**——一个让 Agent 自主完成支付的开放协议。Cloudflare 在 Bot Management 中新增 AI bot 分类，网站可以针对 AI Agent 流量和人类流量设置不同的安全策略。

这些基础设施的设计假设：**Agent 是第一公民，不是"让 Agent 也能用"的适配对象。**

### 闭环正在形成

Agent 写的 feature 被另一个 Agent 调用；Agent 生成的数据被另一个 Agent 消费；Agent 做的采购决策，由另一个 Agent 的 API 承接。

这在人类经济史上从未出现过：**生产者和消费者同时是非人类的双边市场，而且这个市场可能比之前的更有效率。**

---

## Agent = Model + Harness

最近 Agentic AI 领域有一个关键认知更新：**最好的 Harness，比 2023 年的 LangChain 薄得多。**

LangChain 时代是重工程时代——大量 rule-based 的 chain + guardrail，因为当时的模型不可靠，工程师必须用代码把不确定性包住。

2024年底，Anthropic 的 Opus 4.5 越过了 Agentic 能力拐点。模型可靠性达到阈值后，越薄的 Harness 反而越强。Claude Code 核心的 Agent Loop 本身只有几十行代码，配套的工程（上下文压缩、Multi-Agent 协调、工具调用）才是 Harness 的真正厚度。

这个月，Anthropic 率先发布了 **Managed Agents beta**，Harness 第一次被产品化。这个叙事的战略意义远大于技术意义。

**商业模式也在改变。** 以前客户今天用 Claude 明天可以切 GPT，切换成本是几行代码。现在如果 Agent 定义、状态、记忆全部存在 Anthropic 这儿，切换成本就是整个 workflow 的重建。

就像 AWS 的粘性从来不是 EC2 本身，而是 IAM + VPC + S3 + Lambda 编织成的一张状态网。如果 Anthropic 继续在 Harness 这条线上发布 Managed Skills、Managed Runtime，新一代云平台式的锁定就会出现——**LLM 公司第一次有了真正的护城河**。

---

## 三个值得布局的方向

把 Agent Harness 拆解开来，能看到三层结构，对应三个机会：

**Runtime 层：Agent Infra**

传统沙盒和虚拟机都是为人类设计的，包含大量 Agent 不需要的模块（GUI 模拟、完整操作系统等）。Agent 的原生需求完全不同：per-agent 状态隔离、Fork/Snapshot（用于 Agent 分支探索）、Durable Execution（跨故障持久执行）。这一层值得重做。

**Context 层：Vertical Harness**

Anthropic 做不完所有垂直领域的 Skills。Healthcare、legal、finance 三个人力成本最高的领域最先发生。OpenEvidence、Rogo、Sierra 这些公司能切入上一代公司做不深的工作流，靠的是更适合 agentic workflow 的 vertical harness。通用 Harness 无法覆盖的深度，是模型公司的盲区。

**Orchestration 层：Agent Identity + Agent Payment**

这是让 Agent 成为规模化消费者的前置条件。Identity 层解决"这个 Agent 是谁、谁授权、出了事找谁"；Payment 层让 Agent 能够自主完成交易。Stripe 已经发布了 Machine Payments Protocol，但协议层之上还需要一个"Agent 版的 Plaid"——不是做协议本身，而是做协议上面的应用层。

---

## 真正的坐标转移

最后，让我们回到那个最根本的框架问题。

互联网时代的分析坐标是 To B / To C。这个框架服务了整整三十年。

**Agent 时代的分析坐标是 To Human / To Agent。**

To Human：服务有具体目标、具体任务的人。To C / To B 的划分不再重要，因为同一批 Prosumer（工程师、创意工作者、小企业主）正在同时扮演两个角色。

To Agent：Agent 本身成为生产者和消费者。商业逻辑的主体发生了物种替换。

这不是一个增量市场。这是一个全新的经济坐标轴。

---

*本文核心素材来源：海外独角兽《Agent时代启示录：当Agent作为新物种加入经济系统》，有删改和观点延伸。*

---

**相关阅读：**

- [DESIGN.md 开放标准：Google 让 AI 编码代理读懂设计系统](https://zealove.github.io)
- [Hermes Agent 源码解析：Self-Improving 机制](https://zealove.github.io)
