---
title: "How to Setup Blog"
date: 2022-09-06T15:18:44+08:00
draft: false
featured_image: '/images/post-0002.jpg'
---

I choose to use hugo and github page for blog hosting, before that I also tried to self-hosted way, during the university I also posted on some hosting sites such as https://www.iteye.com/blog/user/zealove.

The basic process can be done from these two introductory articles, through github action can achieve the whole automatic release, very convenient.

1. https://gohugo.io/getting-started/quick-start/
2. https://gohugo.io/hosting-and-deployment/hosting-on-github/

## Cautions

1. in addition to the edit branch, select a release branch, the default is gh-pages, hugo build directory will be committed to the release branch of things
2. the secret GITHUB_TOKEN in the action file, do not change it, newbies like me may think to add their own token, but in fact do not need