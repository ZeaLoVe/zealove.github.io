---
title: "谈谈我认识的各种ops"
date: 2022-09-07T10:00:55+08:00
featured_image: '/images/post-0003.jpg'
summary: '运维工作可能是枯燥的，但结合其他领域的内容后，又会焕发生机。'
draft: false
---

跨界总是有神奇的魅力，很多科学的突破都是在学科的交叉处完成的。

当我们在一个方向或者方法论下走的太久找不到路的时候，或许换个方向找找交叉路口是个好选择。

又比如孙正义当年靠着从字典里随机捞几个单词排列组合的方式去思考专利，不得不佩服。

## DevOps

这是最早听到的一个组合，其实这里的Dev不仅是研发还包括质量保证（QA），只是笼统的将软件的开发和运维两个过程打通，已经不需要传统意义上的专职运维。

这个过程伴随着很多很多的概念兴起，包括敏捷、云原生、SRE、CICD 等等。每个名字都蕴含了大量的技术栈和方法论。

所以有人说DevOps本身是一个观念而非开发模式，实施DevOps需要配合大量的基础设施改造包括开发工具，如IaC、automation、CICD Pipeline；基础设施层面上的精进，如容器编排、无服务器架构。

感觉我已经编不下去了，大量的技术交汇在这一个名词之内，之前有看到一个的DevOps技术路线图，满满一屏幕都放不下。

## DevSecOps

在DevOps中间加了个安全(Sec)，让软件整个生命周期都安全成了目标。

和DevOps一样，DevSecOps一样强调的是工具的使用，将所有安全相关的扫描分析和检测全部集成到开发部署流水线上。

给软件开发和运维人员提供安全相关的培训，建立明确的安全规则制度。

除了流程上的安全，构建依赖和构建产物一样要安全，时刻关注依赖技术包括操作系统、容器镜像、第三方库等发布的漏洞信息，对于漏洞要及时处理，更新打了补丁的版本或者采用更安全的替代方案。

不可能存在绝对的安全，但安全意识不可少，不断的更新安全工具箱和学习攻击方式才能知己知彼百战百胜。安全与快速迭代之前也是需要权衡取舍的。

## AIOps

这是前几年AI爆发时期出现的，数据规模的量变引发AI模型的质变，AI基本上跟着大数据一起火起来的，按当时的节奏看万物皆可AI，似乎只要套上AI一切问题都得到解决，但我对此却一直深表怀疑。

但这些年也遇到过公司内有人提到AIOps，当时还在锐捷网络，一个组想要把磁盘故障提前检测的算法做到我们当时开发的虚拟化平台里。

但考虑到当时平台的最大容量规模不超过128台服务器，里面的磁盘数量多数也不会大于1000块。

我很怀疑这样的投入对客户有什么价值，何况客户会为这个功能付费？但这算法在云厂商里动辄几十万、几百万块盘的场景下价值是巨大的，这个不可否认。

因此我始终觉得AI是一个场景化的问题，当这个场景大到一定程度，AI的价值就会容易发挥出来，哪怕每次算法的提升只有几个百分点，但乘以一个巨大的基数，这就是巨大的效益。

## GitOps

GitOps就是将整个CICD流程跟git绑定起来，通过git上的代码提交变更，自动触发CICD流水线。现在比较有名的GitOps工具ArgoCD和FluxCD，基本都是基于K8S的。

之前调研的时候把argoCD、fluxCD、JenkinsX拉在一起写了个选型的表格。但其实上手跑一趟，个人主观的倾向还是比较重的。

虽然argoCD的体验做的更好一些，但我更喜欢FluxCD的架构和自动同步最新镜像的能力。最后我们并没有用以上的任何一个方案而是选择了自己在流水线上去控制这个发布的流程。

讲真GitOps的内容确实不多，而且适用的场景也比较有限，运行多版本的需求就无法满足，回滚版本也是通过取消提交来实现的。

补充：Argo 和 flux 双双从CNCF毕业了。

- [argo 毕业](https://www.cncf.io/announcements/2022/12/06/the-cloud-native-computing-foundation-announces-argo-has-graduated/)
- [flux 毕业](https://www.cncf.io/announcements/2022/11/30/flux-graduates-from-cncf-incubator/)

## ChatOps

这个概念其实我是第一次听说，但发现现在自动化工具越来越多，IM也越做能力越丰富了，集成了大量的机器人来给群组发消息，ChatOps更进了一步，通过人回复指定的命令就可以在聊天中解决工作问题。

包括在Github的PR里，通过命令对PR进行代码评审、指派、设置状态等。运维权限的审批申请和批复，也可以做到在聊天中搞定，执行完回复一句完成自动回收权限。

看起来似乎非常美好！其实实现的难度也不一样，还是要根据自己IT系统的能力一步一个脚印来吧。

chatGPT的诞生可能引发更加深远的影响，更加复杂的操作可以被实现，不再是预设一些简单的交互。

## DataOps

待补充

## 参考资料

1. [DevSecOps](https://medium.com/digital-transformation-and-platform-engineering/devsecops-automation-and-continuous-security-b2c7d0c883c9)
2. [The Four Stages of ChatOps](https://medium.com/get-put-post/the-four-stages-of-chatops-79cc60fc38a)
3. [AIOps — The new member in the DevOps Family](https://medium.com/faun/aiops-the-new-member-in-the-devops-family-d76bab14c98e)

