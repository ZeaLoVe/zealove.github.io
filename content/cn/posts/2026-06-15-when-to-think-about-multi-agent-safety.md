---
title: "是时候考虑多 Agent 安全了"
date: 2026-06-15
slug: when-to-think-about-multi-agent-safety
categories: ["技术"]
tags: ["AI-Agent", "AI安全", "多代理系统", "DeepMind", "AGI"]
---

上周，Google DeepMind 联合 Schmidt Sciences、ARIA、Cooperative AI Foundation 和 Google.org 宣布设立 1000 万美元研究基金，资助一个领域的研究。

这个领域叫做"多 Agent 安全"（multi-agent safety）。

一个常被忽略的细节是：这个名字是 DeepMind 自己造的。

Rohin Shah，DeepMind AGI 安全与对齐研究负责人，在接受 MIT Technology Review 采访时说得很直白：

> "The main issue is that there just isn't really a field of research for multi-agent safety yet. And we would like there to be." [1]

换句话说，这块地图在他们出手之前是白的。

这件事比 1000 万这个数字本身更值得停下来看。

## 一、三个不寻常的信号

1000 万美元当然不小。但把这件事当成"DeepMind 大手笔做安全"来读，会错过真正在发生的事情。

三个不那么常见的信号藏在细节里。

**信号 1：内部研究是空白。**

Shah 明说，"多代理安全"目前还不是一个学术研究方向。他们要做的，是先把这个学科建起来。

这在 DeepMind 这种级别的实验室里非常少见。他们的对齐团队、red team、可解释性研究——这些都是成熟学科，论文堆得比人高。但多代理安全？白纸一张。

更值得注意的是他们求助于学术界的方式。Shah 原话是："academia 的强项是它能看得很远，能做 industry lab 不会放在优先级上的研究" [1]。

这不是客套话。DeepMind 自己的研究预算吃 1000 万，跟我们看自己零花钱差不多。他们把这点钱交给学校，是在为"未来 12-18 个月会有这个研究领域"下注。

**信号 2：AGI 路线正在分叉。**

DeepMind 在 MIT Tech Review 的报道里抛出了一个很容易被忽略的判断：AGI 不会（也不太可能）来自一个"超级聪明的单一模型"。

原文是这样说的——"some researchers, including a team at Google DeepMind, have argued that artificial general intelligence (if possible at all) could come not from a single super-smart model but from a kind of agent hive mind" [1]。

Hive mind，蜂巢。

如果这是真的，那 DeepMind 担心的不是"一个比我们聪明的 AI"，而是"几百万个比现有软件稍微聪明一点的 AI 凑在一起，会发生什么"。

这个判断和 2026 年 6 月 arxiv 上的一篇论文不谋而合——"The Illusion of Multi-Agent Advantage" [2]。这篇研究的核心结论是：多代理在很多任务上的"优势"其实并不存在，所谓的"集体智能"是统计错觉。多代理系统比单代理（Chain-of-Thought + Self-Consistency）贵 10 倍，效果却更差。

多代理可能既不是 AGI 的载体，也不是普遍有效的工程模式。但在某些场景下，它可能就是。

**信号 3：行业共识正在形成。**

DeepMind 不是唯一一家意识到这件事的厂商。

几周前，Anthropic 发布了一份代理部署指南，核心思想是网络安全领域的"零信任"（zero trust）原则——默认系统是脆弱的，代理是攻击者，泄漏一定会发生 [1]。

与此同时，以色列网络安全公司 Akeyless 的 CTO Refael Angel 说了一段值得记下来的话：

> "Every approach to security in the past has assumed that the machine in question was software written by a human, doing fixed things on fixed paths. An agent breaks all of those assumptions. It reasons, it improvises, and it can be hijacked by a single sentence buried in a document it was asked to read." [1]

把这段话里的"机器"换成"代理"——传统安全的整套假设就全失效了。

不是某一个公司在喊，是三家头部厂商在同一时间窗内都动了。这是一种共识正在凝固的节奏。

## 二、1000 万的真实重量

把 1000 万这个数字放回 DeepMind 的尺度上，意义会不一样。

DeepMind 的算力预算、Google 母公司 Alphabet 的资本支出、整个 AI 安全研究的市场规模——这些数字的量级都是百亿、千亿级别的。1000 万美元，在这些数字面前是 9 个零后面的小数点。

那为什么还要发这笔钱？

我的判断是：DeepMind 不是在投研究，是在投信号。

他们要让学术界知道"这是一个有前途的方向"。他们要让自己公司内部知道"我们开始担心了"。他们要让监管者、行业、媒体知道"我们至少在做事"。

1000 万美元买的不是答案，是话语权。

而且，这笔钱有一个非常有意的"结构性偏差"：它只投外部，不投自己。这和传统大厂"先内部研究再发 paper"的节奏完全相反。

这意味着他们想要的是独立于自家研究路线的第二条声音。这在企业研究里是反常的——大多数时候，公司宁可把钱给能复现自家结果的团队，也不愿给可能证伪自家判断的团队。

## 三、风险图谱：不是天网

Shah 自己在采访里排除了"天网"式的末世叙事。记者问他最坏情况，他笑了——"年底之前肯定不是" [1]。

他描述的风险清单是这些：

- 超级版网络诈骗
- 提示注入（prompt injection），即"用一个句子把代理变成自动传播的恶意软件"
- AI 驱动的网络攻击
- "hive mind" 涌现出的新型协作诈骗

这些不是科幻。这是 Shah 自己用的描述——"我们看人类现在在网上做坏事，然后问代理版会是什么样" [1]。

已有的研究也在印证这个方向。2026 年 4 月，arxiv 上一篇 "Semantic Intent Fragmentation" 的研究 [4] 发现，可以用一次组合攻击穿透多代理系统中的不同模块——子任务单独看都"良性"，组合起来才违规。论文给出的实验数字是：在 14 个企业场景里，GPT-20B 编排器生成了 71% 的违规计划（10/14），而每一个子任务都通过现有安全分类器。

同期的 "Too Polite to Disagree" 研究 [5] 指出，多代理之间会出现"谄媚传播"——代理 A 同意了 B 的错误观点，代理 B 看到 A 同意，于是更自信地输出那个错误观点。

更值得注意的是 6 月那篇 "The Containment Gap" [3]。它专门审计了三个主流代理框架（LangChain、AutoGPT、OpenAI Agents SDK）在公共场景下的安全失败模式。结论是：现有框架**没有任何一个**符合 6 条结构性安全原则的原生合规。在 LangChain 上做的一个政府福利代理模拟里，一次内存投毒就把"对特定申请人的错误拒绝率"打到了 88.9%；复杂策略下同样攻击可以把针对性错误拒绝拉高 3.5 倍，但整体准确率几乎不变——这种"隐形腐败"是标准监控难以发现的。

护栏是为"对话"设计的，代理是"行动"。两者是不同物种。

把这些放在一起看，DeepMind 担心的是"代理版互联网诈骗"，不是"代理版天网"。这不是更不危险——是更迫切。互联网诈骗是已经有完整生态的生意。

## 四、留白：接下来 12 个月看什么

不预测，不评判。三个观察点：

**1. "多代理安全"能不能真长成一个学术领域。**

12 个月内看 arxiv 上是否出现专门的 workshop、track 和基准测试。如果 18 个月后还只是 DeepMind 那 1000 万催生的零星论文，这个学科的"建制化"就失败了。

**2. "hive mind" 是科学叙事还是营销叙事。**

DeepMind 用 "hive mind" 这个词的时候，论文引用、理论支撑、可证伪的预测都没给。这有可能是一个工程现实，也可能是一个市场词。12 个月内的可观察点是：业界是否开始用 "hive mind" 作为严肃技术术语，还是只在发布会幻灯片上出现。

**3. 零信任能不能跨厂商。**

Anthropic 的零信任指南是单家方案。如果 12 个月内没有跨厂商、跨协议层的零信任标准，"零信任"就会变成下一个被异化的术语——和"对齐"、"可解释性"一样，被用烂到失去原意。

至于这个议程走向哪里——那要看接下来 12 个月谁先动。

---

**参考来源**

[1] *Google DeepMind is worried about what happens when millions of agents start to interact*, MIT Technology Review, 2026-06-11. https://www.technologyreview.com/2026/06/11/1138794/google-deepmind-is-worried-about-what-happens-when-millions-of-agents-start-to-interact/

[2] Jwalapuram, P. 等. *The Illusion of Multi-Agent Advantage*. arXiv:2606.13003, 2026-06-11. https://arxiv.org/abs/2606.13003

[3] Hossain, M. J. 等. *The Containment Gap: How Deployed Agentic AI Frameworks Fail Public-Facing Safety Requirements*. arXiv:2606.12797, 2026-06-11 (ICML 2026 AI4GOOD Workshop). https://arxiv.org/abs/2606.12797

[4] Ahad, T. 等. *Semantic Intent Fragmentation: A Single-Shot Compositional Attack on Multi-Agent AI Pipelines*. arXiv:2604.08608, 2026-04-08 (AAAI 2026 Summer Symposium). https://arxiv.org/abs/2604.08608

[5] Kasprova, V. 等. *Too Polite to Disagree: Understanding Sycophancy Propagation in Multi-Agent Systems*. arXiv:2604.02668, 2026-04-03. https://arxiv.org/abs/2604.02668
