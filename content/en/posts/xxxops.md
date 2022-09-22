---
title: "My view about X-ops"
date: 2022-09-07T10:00:55+08:00
featured_image: '/images/post-0003.jpg'
summary: 'Operation is not boring, when you add something to it.'
draft: false
---

Crossing boundaries always has a magical charm, and many scientific breakthroughs are done at the intersection of disciplines.

When we go too long in a direction to find the way, perhaps a change of direction to find the intersection is a good choice.

Another example is Masayoshi Son's approach to thinking about patents by randomly fishing for a few words from the dictionary to arrange combinations, which has to be admired.

## DevOps

This is one of the earliest heard, in fact, here Dev is not only R&D also includes quality assurance (QA), just a generalization of the software development and operation and maintenance of the two processes through, no longer need the traditional sense of full-time operations and maintenance staff.

This process is accompanied by the rise of many concepts, including agile, cloud-native, SRE, CICD, and so on. Each name implies a large number of technology stacks and methodologies.

So some people say DevOps itself is a concept rather than a development model, and that implementing DevOps requires a lot of infrastructure transformation including development tools such as IaC, automation, CICD Pipeline; and infrastructure level such as container orchestration, serverless architecture.

Hard for me to go on, a lot of technology intersection within this one term, before I saw a DevOps technology learning roadmap, full of a screen not enough to put on.

## DevSecOps

In the middle of DevOps added a security (Sec), so that the entire lifecycle of software security has become the goal.

Like DevOps, DevSecOps emphasizes the use of tools that integrate all security-related scanning and analysis and detection into the development and deployment pipeline.

Provide security-related training to software development and operations staff, and establish a clear system of security rules.

In addition to process security, dependencies and build artifacts should be just as secure. Always pay attention to vulnerability information released by dependent technologies including operating systems, container images, third-party libraries, etc. Vulnerabilities should be handled in a timely manner, and patched versions should be updated or more secure alternatives should be adopted.

There can be no absolute security, but security awareness is indispensable, constantly update the security toolbox and learn how to attack in order to know your enemy. There is also a trade-off between security and rapid iteration.

## AIOps

This is the first few years of the AI outbreak, the quantitative change in the scale of data triggered a qualitative change in the AI model, AI basically followed the big data, it seems that with AI all problems can be solved, but I have been deeply skeptical.

But over the years, we have also encountered people mentioning AIOps in the company. At that time, i still work for Ruijie Network, and a group wanted to make the algorithm of early detection of disk failure into the virtualization platform we developed at that time.

But considering that the maximum capacity of the platform at that time was no more than 128 servers in size, the number of disks inside most of them would not be greater than 1000.

I doubt that such an investment would be of any value to customers, let alone that they would pay for this feature. But the value of this algorithm in the cloud vendors are often hundreds of thousands, millions of disks in the scene is huge, this have undeniable value.

So I always think AI is a scenario-based problem, and when that scenario is big enough, the value of AI will be easy to play out, even if each algorithm boost is only a few percentage points, but multiplied by a huge base, that's a huge benefit.

## GitOps

GitOps is all about tying the entire CICD process to git and automatically triggering the CICD pipeline by committing changes to code on git. The most famous GitOps tools now are ArgoCD and FluxCD, all based on K8S.

I put argoCD, fluxCD, JenkinsX together to compare and accomplish a selection feathures into a table. But in fact, the personal subjective tendency is still relatively heavy after I try these tools.

Although the argoCD experience is a bit better, I prefer the architecture of FluxCD and the ability to automatically synchronize the latest images. In the end, we didn't use any of the above but chose to control the release process ourselves in the pipeline. JenkinsX is just too complicate, my teammates hates jenkins.

The content of GitOps is really not much, and the scenarios for it are rather limited.

## ChatOps

This concept is actually the first time I heard of it, but I found that now there are more and more automation tools, and IM is getting richer in capabilities, integrating a lot of bots to send messages to groups, ChatOps goes one step further, and you can solve work problems in chat by replying to specified commands.

Including in Github's PR, code review, assignment, setting status, etc. by typing in commands to PR. The approval application and approval of Ops permissions can also be done in the chat, and after that, replying to a command to complete will automatic recall of permissions.

It seems to be awesome! In fact, which level of chatops need achive, depends on the ability of IT systems, need one step at a time.

## Reference

1. [DevSecOps](https://medium.com/digital-transformation-and-platform-engineering/devsecops-automation-and-continuous-security-b2c7d0c883c9)
2. [The Four Stages of ChatOps](https://medium.com/get-put-post/the-four-stages-of-chatops-79cc60fc38a)
3. [AIOps - The new member in the DevOps Family](https://medium.com/faun/aiops-the-new-member-in-the-devops-family-d76bab14c98e)