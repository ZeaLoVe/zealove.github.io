---
title: "如何建博客 | How to Setup Blog"
date: 2022-09-06T15:18:44+08:00
draft: false
---

# 中文版

我选择用hugo加上github page的方式进行博客托管，之前也尝试过自建，大学期间也在一些托管网站上发过 如 https://www.iteye.com/blog/user/zealove。
基本的流程从这两篇入门文章就能搞定了，通过github action可以实现全程的自动发布，还是很方便的。

1. https://gohugo.io/getting-started/quick-start/
2. https://gohugo.io/hosting-and-deployment/hosting-on-github/

## 注意事项

1. 除了编辑的分支外，选择一个发布分支，直接用默认的gh-pages就好，hugo构建的public目录里的东西会提交到发布分支
2. action文件里的secret GITHUB_TOKEN 不要去改它，新手像我可能以为要加自己的token，其实不需要

# English

I choose to use hugo and github page for blog hosting, before that I also tried to self-hosted way, during the university I also posted on some hosting sites such as https://www.iteye.com/blog/user/zealove.
The basic process can be done from these two introductory articles, through github action can achieve the whole automatic release, very convenient.

1. https://gohugo.io/getting-started/quick-start/
2. https://gohugo.io/hosting-and-deployment/hosting-on-github/

## Cautions

1. in addition to the edit branch, select a release branch, the default is gh-pages, hugo build directory will be committed to the release branch of things
2. the secret GITHUB_TOKEN in the action file, do not change it, newbies like me may think to add their own token, but in fact do not need