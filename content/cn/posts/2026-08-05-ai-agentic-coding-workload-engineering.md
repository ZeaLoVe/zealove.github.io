---
title: "AI 代理编码工作负载的工程化"
date: 2026-08-05T11:32:00+08:00
slug: ai-agentic-coding-workload-engineering
tags: ["AI时代", "AI-Agent", "AI编程", "软件工程"]
featured_image: '/images/ai-agentic-coding-workload-engineering.jpg'
summary: '代理编码工作负载让对话式推理引擎集体失灵。GitHub Copilot 7.61 亿次调用实证揭示 KV 缓存跨 Turn 失效 90%→55%、idle-time 预测 86-90%、编排 2-4 倍 token 成本、能耗归因 44% 误差——五个新事实决定下一代 Agent-native 基础设施怎么建。'
draft: false
---

## 一、3.2 亿次调用的教训:GitHub 给行业画了第一张"代理编码"的地图

2026 年 7 月 30 日,微软研究院和 GitHub 的工程师在 arXiv 上挂出一篇论文 [1],标题平平无奇——《Agentic Coding in the Wild: Characterizing GitHub Copilot Traces at Production Scale》。但这篇论文可能是过去半年 AI 基础设施领域最重要的一份"体检报告"。

他们干了什么?把 2026 年 6 月里 GitHub Copilot 的生产 trace 抽了个样,然后老老实实地统计了一遍:

- **3.2 百万**用户
- **13 百万**次会话(session)
- **7.61 亿**次 LLM 调用
- **95 万亿** token

这是迄今为止对"代理编码"工作负载最完整的一次表征。读完之后,你会意识到一个被很多团队忽视的事实:过去三年,我们所有的 LLM 推理引擎——vLLM、TensorRT-LLM、TGI、SGLang——**几乎都是为"聊天"设计的**。当用户从 ChatGPT 风格的对话框切换到 Claude Code 风格的 Agent 时,这些引擎集体进入了"能用但低效"的灰色地带。

这篇文章想讲的,就是这件事到底严重到什么程度,以及行业里正在发生哪些工程化的应对。

## 二、对话和代理编码,根本不是同一类负载

很多人会本能地以为:Claude Code 和 ChatGPT 不都是"发给 LLM 一个 prompt,拿到一段回复"吗?只是回复长一点,中间多几次工具调用而已。

GitHub 的数据告诉我们,**这种想法是错的**。

论文 [1] 把代理编码会话结构画得非常清楚:

> Agentic coding sessions consist of **sparse user-initiated turns**, each unfolding into an autonomous agent loop of LLM calls almost always coupled with tool execution.

一句话翻译:用户敲一下回车,Agent 自己会跑出"LLM 调用 → 工具执行 → LLM 调用 → 工具执行"的循环,直到觉得任务完成才停下来。然后用户看结果,敲下一个回车。

这个结构带来 5 个和对话完全不同的负载特征。**阿里云尚旭春**在 AICon 深圳的演讲预告 [2] 里把它们总结得很到位:

1. **高并发**:一次会话内 Agent 会并行发起多路 LLM 调用(读文件、写代码、跑测试同时干)
2. **短请求**:每个工具调用对应的 prompt 都很短,但请求密度极高
3. **多轮工具调用**:一轮里可能跑 10-30 次工具,每次都伴随一次新的 LLM 前缀(预填)
4. **逐 Token 生成**:Agent 对延迟极其敏感——用户看着代码一格格生成,首字延迟 > 200ms 就会觉得"卡"
5. **长尾空闲**:Agent 自己跑得很快(几十秒),用户却要花几分钟看结果、敲下一条指令

把第 5 个特征放到一起看,你就理解了一个被传统推理引擎设计完全忽视的真相:

> **"代理编码"工作负载里,GPU 大部分时间都在等用户**——Agent 自己跑完一轮只要几十秒,用户却常常花几分钟看结果、敲下一条指令。论文里也用了一句话强调这种反差:*quick agentic turnaround times and the minutes-long user idle periods at turn boundaries* [1]。

这意味着推理引擎的优化目标必须彻底换一次。

## 三、优化目标的转向:从"极限吞吐"到"低延迟下的 GPU Token 效率"

传统的聊天场景,我们关心 **throughput**(单位时间处理多少 token)。用户反正就那一两条消息,系统把请求批量塞满,慢慢算就行。

代理编码场景不行。Agent 的每一次"行动-观察"循环都很短,但循环密度极高。如果推理引擎为了榨吞吐把请求攒起来,Agent 就会卡在"等 LLM 返回"的那一秒里——而这一秒会被用户感知到。

所以尚旭春 [2] 给出的优化目标是:

> 在保证低延迟的前提下,实现更高的 GPU Token 输出效率。

这句话看起来平淡,但每半句都是坑:

- **保证低延迟** = 不能简单连续批处理(continuous batching)攒满,需要"快速出第一字"
- **更高的 GPU Token 输出效率** = 不能为低延迟牺牲太多吞吐
- 这两件事天然冲突,需要在调度层做精细平衡

具体怎么平衡?GitHub 论文 [1] 给出了一个非常关键的发现:**idle-time predictor**(空闲时间预测器)。

论文里说,Agent 跑完一轮到用户敲下一条指令之间,有"几分钟级别"的用户空闲。如果推理引擎能预测到这个空闲,就可以做几件事:

1. **主动把 GPU 让出来给其他用户的请求**(动态资源编排)
2. **提前为下一轮做 KV Cache 预热**(避免新一轮冷启动)
3. **延迟执行非紧急的后台任务**(比如日志聚合)

预测器效果如何?**能捕获 86% 到 90% 的总空闲时间** [1]。

这就解释了为什么"Agent-native 基础设施"这个概念突然变得值钱——传统推理引擎根本没有这种信号,也就没法做这些事。

## 四、那张地图上最重要的数字:90% vs 55%

如果整篇论文只能让你记住一个数字,那应该是:**KV Cache 命中率在 turn 内 90%,跨 turn 55%** [1]。

**为什么这个数字这么重要?**

KV Cache 是 LLM 推理里最大的优化手段——同一个 prefix 不重算,直接复用 prefix 的 attention 缓存。对话场景下,这个机制可以让吞吐提升 5-10 倍,几乎是所有现代推理引擎(vLLM 的 PagedAttention、TGI 的 RadixAttention、SGLang 的 RadixAttention)的核心。

代理编码场景下,这个机制**部分失效**。

论文 [1] 发现:

- **Turn 内部**(同一个 Agent 循环里连续调用 LLM):命中率约 **90%**——和对话场景差不多,甚至更高,因为 Agent 会反复在同一个上下文里做操作
- **跨 Turn 边界**(用户敲下一条指令,Agent 重新开始):命中率降到 **55%**——很多前缀变了,但"系统提示 + 工作区状态"等大块内容还在
- **Model 切换或 Context Compaction 后**:命中率**急剧失效**——基本回到 0,需要重新计算

这意味着什么?**传统推理引擎假设 KV Cache 是"准稳定状态"的假设被打破了**。

对话场景下,一个会话可以跑几十分钟,KV Cache 始终稳赚。代理编码场景下,每一次 Turn 切换都可能是"半失效"——保留下来的 55% 还不够冷启动,但丢弃又可惜。

工程上怎么应对?**阿里云尚旭春团队给出了一套分层 Runtime 架构** [2]:

1. **分层架构**:把 Runtime 拆成"请求接入层 / 调度层 / 执行层 / 存储层",每一层独立扩缩容
2. **自动通信编译**:把跨层通信编译成最优路径,避免序列化开销
3. **请求生命周期管理**:精确追踪每个请求从进入到完成的每个状态
4. **KV Cache 调度**:针对 Agent 场景专门优化——预填、保留、淘汰策略都要重新设计

这套架构长在**TokenSpeed**里——阿里云开源的下一代 LLM 推理引擎。尚旭春同时是这个社区的 Maintainer,也是 **Mooncake**(GitHub 4k+ star,做 LLM 推理 KV Cache 中心化存储)的 Maintainer,同时是 **SGLang** 社区的 Committer(贡献了 PD 分离、PP 并行、HiCache 等核心特性) [2]。

换句话说,阿里云在 LLM 推理基础设施上押了一整条生态链:**Mooncake 处理 KV 存储、SGLang 处理高吞吐调度、TokenSpeed 处理 Agent-native 场景**。三件套互为补充,覆盖了从单卡到集群的全场景。

## 五、Kernel 层:同一套 Runtime 跨硬件的工程难题

Runtime 之上的问题解决了,还有 Kernel 层。

传统 LLM 推理严重依赖 NVIDIA CUDA——这是历史包袱,但也是现实。H100、H200、B200 几乎是默认选项。但代理编码的部署场景**比聊天复杂得多**:

- 有的客户希望本地部署(合规要求)→ 消费级 GPU(RTX 4090/5090)
- 有的客户希望多云灵活 → AMD MI355X、Intel Gaudi
- 有的客户希望国产化 → 华为昇腾、寒武纪

每个硬件后端都有自己的 Kernel 库(CUDA、CK、SYCL、华为 CANN)。如果每换一个硬件就重写一遍推理引擎,这套"Agent-native Runtime"的价值就打了对折。

所以尚旭春分享里特别强调一个点:**让同一套 Runtime 跨硬件共享,Kernel 层做适配** [2]。具体做法他举了一个例子——**GPT-OSS 模型在 AMD MI355X 上的 Kernel 适配**。

GPT-OSS 是 OpenAI 早些时候开源的 GPT 系列参考实现,大量企业基于它做二次开发。这个模型的特点是 MoE(Mixture of Experts)架构——一次推理只激活部分专家,这对 Kernel 实现提出了新挑战(动态路由 + 稀疏激活)。

阿里云的做法是:**Kernel 层做硬件特化优化,Runtime 层抽象统一接口**。这样 Runtime 的"Agent-native 能力"在所有硬件上都能复用,Kernel 团队专注把每块硬件的极限性能榨出来。

这件事说起来简单,做起来极难。**Mooncake、SGLang、TokenSpeed 三个社区的核心贡献者里有大量这种"双层抽象"的设计** [2]。这也是为什么我前面说"基础设施的工程化比模型能力更难"——模型错了换下一个,基础设施建错了要重写十年。

## 六、一个被忽视的反直觉结论:别过度编排

到这里为止,听起来好像"Agent-native 基础设施"是银弹——只要引擎换一套,所有问题迎刃而解。

不一定。

2026 年 8 月初另一篇有意思的论文 *When Does LLM Orchestration Pay Off?*[3] 给了一个反直觉的实证:

> 编排带来中等且基准相关增益,**最高 4.6pp 准确率提升,但需 2-4 倍任务级推理 token 成本**,效果与骨干模型强交互。

翻译:Self-Refine、Best-of-N、Debate 这些"让 Agent 多想几次"的方法,确实能提升准确率,但代价是 token 成本翻 2 到 4 倍。而且**这个收益高度依赖你用的骨干模型**——同一个编排方法,在 GPT-5 上有用,在 Claude 上可能完全无效。

这和基础设施有什么关系?

关系很大。代理编码工作负载对**每 Token 成本**极其敏感(用户空闲时间有限、Agent 循环密度高),如果你的推理引擎不能把"编排开销"摊薄,**2-4 倍的成本会直接吃掉 Agent 的可用性**。

所以工程化的另一个维度是:**给编排做硬件级加速**——把 Self-Refine、Best-of-N 这种"同一 prompt 跑 N 次"的操作,在 GPU 上做成并行 prefix sharing。SGLang 的 RadixAttention、TokenSpeed 的 KVStore [2] 都在做这件事。

如果你的基础设施做不好这层,Agent-native 就只是营销话术。

## 七、能耗归因:另一个被忽视的工程问题

还有一个工程化方向,容易被忽视——**能耗**。

代理编码工作负载里,Agent 一晚上可能跑几千次 LLM 调用,GPU 的能耗账单才是真正的成本大头。但传统的能耗统计是按"GPU 用了多少电"算的——**这非常粗**。

arxiv 2608.00026 [4] 提出了一个叫 **JouleShare** 的框架,核心思路是用 Shapley 值精确归因每个请求的能耗。他们做了一组对照实验:

- **简单按 token 比例分配能耗**(行业通用做法):误差 L1 ≈ 0.440
- **JouleShare 离线精确归因**:误差 L1 ≈ 0.116
- **轻量在线校准模型 JCalib**:误差 L1 ≈ 0.177(略高于离线,但可实时)

换句话说:**"按 token 比例分摊能耗"这个大家都在用的做法,平均误差接近 44%** [4]。

对 Agent 场景这意味着什么?

代理编码的请求模式极不均衡——有的请求 200 token,有的请求 20000 token;有的请求需要长上下文,有的只是简单工具调用。如果按 token 比例粗分摊,**复杂任务的能耗会被低估,简单任务会被高估**。

这不仅影响成本核算,还影响**碳排放合规**。欧盟 AI Act 已经要求大模型披露训练和推理的碳足迹——如果连"单个请求的能耗"都算不准,合规就是空话。

JCalib 这类模型未来很可能成为推理引擎的标准组件——就像今天的 PagedAttention 一样。

## 八、基础设施转向:从"模型中心"到"工作负载中心"

把以上几点串起来,你会看到一个清晰的转向:

- **优化目标**:从极限吞吐 → 低延迟 + Token 输出效率
- **KV Cache**:从准稳态长期复用 → 跨 Turn 半失效,需要调度
- **资源利用**:从满载优先 → 空闲预测 + 主动让出
- **硬件假设**:从 NVIDIA 单一栈 → Runtime 抽象 + Kernel 适配
- **编排方式**:从单次推理 → 并行 prefix sharing
- **能耗核算**:从 token 粗分摊 → Shapley / 在线校准
- **团队能力**:从模型 + CUDA → 模型 + 系统 + 调度 + 硬件

**每一行都是一条独立的工程战线**。不是某一家公司能做完的,也不是一年两年能做完的。

这也是为什么 **Mooncake、SGLang、TokenSpeed** 这种开源社区的存在变得关键——它们把零散的工程优化沉淀成可复用的组件,让做 Agent 的团队不用每个人都重写一遍推理引擎。

阿里云尚旭春团队在这个生态里的位置特别有意思:**他们是横跨三个社区的核心贡献者** [2]。这种"跨社区"贡献者往往是行业基础设施真正向前推的那批人——模型可以换、社区可以选,但调度、KV、Kernel 这些底子一旦奠定,后续十年都在它的延长线上。

## 九、留白:接下来 12 个月看什么

不预测,不评判。三个观察点:

**1. "Agent-native"会不会从营销词变成工程标准。**

接下来 12 个月,看各家推理引擎(vLLM v2、TensorRT-LLM v2、SGLang、TokenSpeed)是不是真的把"idle-time 预测、跨 Turn KV 调度、并行 prefix sharing"作为一等公民支持。如果还只是博客里说说,这个词就还是营销。

**2. 跨硬件 Runtime 抽象会不会突破 demo 阶段。**

阿里云在 AMD MI355X 上的 GPT-OSS 适配 [2] 是一个具体例证。看其他家(尤其是国产硬件:华为昇腾、寒武纪、摩尔线程)能不能跟上。如果一年内还能看到"每家硬件一套 Runtime"的状态,这层抽象就没立起来。

**3. 能耗归因会不会进合规清单。**

arxiv 2608.00026 的 Shapley 归因方法 [4] 现在还在论文阶段。看欧盟 AI Act、美国 AI EO、中国生成式 AI 管理办法会不会把"请求级能耗披露"纳入要求。如果纳入,JCalib 这类组件会变成推理引擎的标准件——就像 PagedAttention 一样。

---

## 引用

[1] Banruo Liu, Haoran Qiu, Íñigo Goiri, Rodrigo Fonseca, Ricardo Bianchini, Esha Choukse. *Agentic Coding in the Wild: Characterizing GitHub Copilot Traces at Production Scale*. arXiv:2608.00101, 2026-07-30. https://arxiv.org/abs/2608.00101

[2] 阿里云尚旭春. *面向 Agentic 负载的下一代 LLM 推理引擎设计实践*. AICon 深圳,2026-07-14. https://www.infoq.cn/article/fjkG0xhaV42S8sfCayFy

[3] arXiv:2608.00685. *When Does LLM Orchestration Pay Off? A Controlled Evaluation of Accuracy, Cost, and Task Difficulty*. 2026-08-04. https://arxiv.org/abs/2608.00685

[4] arXiv:2608.00026. *Request-Level Energy Attribution for Batched LLM Serving*. 2026-08-04. https://arxiv.org/abs/2608.00026
