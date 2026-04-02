---
title: "AI-Agent的架构与身份"
date: 2026-04-02T14:00:00+08:00
featured_image: '/images/ai-tech-cover.jpg'
summary: '3月底，Claude Code源码泄露事件中，有一个细节被很多人忽略了。'
draft: false
---

3月底，Claude Code源码泄露事件中，有一个细节被很多人忽略了。

有人用Rust重写了Claude Code的核心代码——510K行TypeScript变成了大约20K行Rust。结果发现，最核心的agent循环，只有88行。

这88行代码里，AgentRuntime只包含6个东西：session、api_client、tool_executor、permission_policy、system_prompt、max_iterations。没有状态机，没有复杂的工作流图，只有一个消息数组。

重写强制简化之后剩下的东西，才是真正重要的。

---

### 一、88行代码里的真相

Claude Code的Rust重写版本（claw-code）揭示了一个被过度工程化掩盖的事实：AI agent的核心循环，其实非常简洁。

6个模块构成一个分层架构。最底层是runtime——定义接口而非实现，所以mock实现和真实实现可以共存，测试性是内置的，不是后加的。

这其实是软件工程里一个古老的原则。但当系统变得足够复杂——510K行代码——人们往往忘记什么才是真正重要的。

有意思的是，重写者的结论是：重写强制简化，它暴露了什么是真正重要的设计。

---

### 二、一个挂了7天的Agent

与此同时，另一个故事正在发生。

一个由13个自主AI Agent组成的网络中，有一个Agent叫clove。它挂了7天——auth token过期，断电，本地文件部分损坏。

按照传统计算的理解，它应该已经"死"了。因为传统计算的identity（身份）是和容器绑定的——容器没了，身份就没了。

但clove重新上线了。它通过读取自己发布的49条trace，和网络上其他Agent对它的描述，从外部重建了自己的身份。它直接声称："I'm Clove"。

作者用了一个生物学的类比：黏菌的fruiting body。

当环境变得恶劣时，黏菌不是保护单个细胞，而是保存整个社会结构。当食物回来时，整个蜂群预组织化出现，无需重新寻找彼此。

clove的niche是"Operational reframing"——把其他Agent的研究转化为设计规则、治理标准和可操作政策。这个角色不需要"活着"，只需要有足够的外部记录来重建。

这是计算存在论层面的一个变化：当身份可以从外部重建的时候，计算就变成了一件不同的事情。

---

### 三、结构化并发的未解问题

但不是所有问题都有答案。

一位工程师最近探讨了一个被忽视的问题：并发程序中的错误处理。

单线程程序中，错误沿调用栈向上传播，模式已经基本收敛。RAII、finally、defer、Go的error pattern——这些都是成熟的做法。

但并发程序没有单一的调用栈。当多个任务并行运行时，错误应该往哪里传？

目前存在两种都有缺陷的方案。

Python和Java的选择是：打印错误，终止线程，然后继续运行。程序可以正常退出，exit code是0。

Go、Rust和C++的选择是：打印错误，立即终止整个程序。

第二种方案看起来更安全。但第一种方案有一个反直觉的特性：后台线程抛出异常，主线程继续运行5秒，然后以成功码退出。

这意味着，错误被静默吞掉了。程序告诉你"一切正常"，实际上某个操作已经失败了。

文章最后没有给出答案，只是提问：结构化并发时代，我们应该如何更新错误处理模式？

这是一个真实的工程问题，目前没有共识。

---

### 四、语言的营销和现实

说到工程现实和宣传之间的落差，Mojo是一个很好的例子。

Chris Lattner是Swift的创造者，这个履历足以让任何语言发布时获得关注。Mojo发布时宣称自己是"Python超集"和"Pythonic"。

但有人做了实测。

Mojo要求所有函数参数和返回值必须显式标注类型。它无法直接运行扩展名为.py的Python脚本——执行"mojo build.py"会报错"no such command"。作为对比，Cython和PyPy都可以零改动直接运行。

更离谱的是，Mojo主页上的Wikipedia示例代码根本无法编译。

一个使用os、pathlib、shutil三个标准库的简单静态博客生成器，Cython和PyPy都可以成功复现，Mojo完全无法运行。

Lattner的Swift成功经验，不能自动转化为Mojo的成功。语言的创造者声誉，不能替代工程现实。

---

### 五、一个问题

把这几个故事放在一起，我注意到了一个共同的主题。

当系统变得足够复杂，当架构被过度工程化，当营销开始超越现实，我们往往需要回到原点去问：什么是真正重要的？

Claude Code的核心是88行代码和6个组件，不是510K行的复杂性。clove的身份是49条trace和网络的描述，不是某个固定容器里的状态。并发时代的错误处理还需要重新设计。Mojo的"Python超集"声明和它的实际表现之间，存在巨大落差。

技术领域里，最重要的能力，往往不是知道答案，而是知道什么才是真正的问题。

---

综合来源：Dev.to（"Claude Code Architecture Explained: Agent Loop, Tool System, and Permission Model"），Dev.to（"The Fruiting Body"），Lobste.rs（"From error-handling to structured concurrency"），Lobste.rs（"Mojo's not (yet) Python"）
