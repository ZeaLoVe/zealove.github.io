# 每日旋律（Daily Melody）技能

## 概述

根据当日多平台热点资讯，自动生成一首 60 秒器乐曲目，推送到博客并发送飞书通知。

## 触发方式

- **定时触发**：每日 10:10（launchd `com.zealove.daily-music`）
- **手动触发**：`bash ~/.openclaw/workspace/scripts/daily_music_pipeline.sh`

## 核心流程

```
热点读取 → 话题分析 → 情绪映射 → 音乐生成 → 压缩 → metadata → 推送博客 → 飞书通知
```

### Step 1：热点读取

读取 `~/.openclaw/workspace/hot_news/YYYY-MM-DD.md`（四平台热点聚合文件）：
- 知乎热榜（权重 1.2x）
- 今日头条（权重 1.5x）
- 百度贴吧（权重 1.0x）
- B站热搜（权重 0.8x）

今日文件不存在时 fallback 至昨日。

### Step 2：话题分析与情绪映射

`scripts/hot_mood.py` 核心逻辑：

1. **过滤**：剔除娱乐/游戏/电竞/明星/八卦类话题
2. **话题分类**：每个标题匹配 geopolitical / tech_ai / economy / policy / science / culture / social
3. **加权计分**：各话题按匹配次数 × 来源权重累加
4. **主导情绪输出**

话题 → 音乐情绪映射：

| 话题 | 情绪 |
|------|------|
| geopolitical | tension and determination |
| tech_ai | technological and forward-looking |
| economy | optimistic and uplifting |
| policy | authoritative and contemplative |
| science | wonder and exploration |
| culture | warm and reflective |
| social | empathetic and layered |

### Step 3：叠加周几主题

| 星期 | 主题 |
|------|------|
| 周一 | Monday motivation, fresh start |
| 周二 | deep focus, work mode |
| 周三 | afternoon contemplation |
| 周四 | thoughtful and introspective |
| 周五 | Friday energy, upbeat |
| 周六 | weekend adventure |
| 周日 | Sunday serenity |

### Step 4：音乐生成

调用 `mmx music generate`，生成 60 秒器乐（cinematic instrumental）：
- 80-90bpm，solo piano with strings
- minor to major resolution（叙事感）

### Step 5：压缩与 metadata

- 压缩至 600KB 以内（32kbps AAC）
- 写入 metadata：Artist / Album / Comment（情绪+主题）/ Date

### Step 6：推送博客

```
static/music/daily/YYYY-MM-DD.m4a
```

自动 commit 并 push 到 GitHub。

### Step 7：飞书通知

推送链接 + 情绪 + Topic 到飞书。

## 文件结构

```
skills/daily-melody/
├── SKILL.md                    # 本文件
├── hot_mood.py                 # 核心：热点情绪分析脚本
└── daily_music_pipeline.sh     # 主 pipeline 脚本
```

## 依赖

- `mmx` CLI（MiniMax 音乐生成）
- `mutagen` Python 库（metadata 写入）
- `afconvert`（macOS 音频压缩）
- 热点文件：`~/.openclaw/workspace/hot_news/YYYY-MM-DD.md`

## 输出

- 博客路径：`static/music/daily/YYYY-MM-DD.m4a`
- 访问地址：`https://zealove.github.io/music/daily/YYYY-MM-DD.m4a`
- 日志：`~/.openclaw/workspace/logs/daily_music_YYYY-MM-DD.log`
