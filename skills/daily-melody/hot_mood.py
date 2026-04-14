#!/usr/bin/env python3
"""从热点资讯综合提取主导情绪主题"""
import sys, re, os
from collections import defaultdict
from datetime import date, timedelta

# ========== 话题分类 & 过滤规则 ==========
MOOD_MAP = {
    "geopolitical": ["tension and determination", "serious and reflective"],
    "tech_ai":       ["technological and forward-looking", "innovative and ambitious"],
    "economy":        ["optimistic and uplifting", "steady and measured"],
    "policy":         ["authoritative and contemplative", "serious and thoughtful"],
    "science":        ["wonder and exploration", "curious and expansive"],
    "culture":        ["warm and reflective", "narrative and emotional"],
    "social":         ["empathetic and layered", "thoughtful and human"],
}

TOPIC_KEYWORDS = {
    "geopolitical": ["伊朗", "美国", "制裁", "霍尔木兹", "谈判", "军事", "战争", "外长", "协议",
                     "美伊", "匈牙利", "欧尔班", "以色列", "内塔尼亚胡", "巴基斯坦", "台湾",
                     "民进党", "巴西", "中巴", "西班牙", "首相", "访华", "美以", "美副总统"],
    "tech_ai":      ["AI", "人工智能", "人形机器人", "科技", "华为", "算力", "大模型", "DeepSeek",
                     "智能", "自动化", "算法", "算力", "硬件", "芯片"],
    "economy":      ["比亚迪", "股市", "A股", "PPI", "经济", "股价", "市值", "特斯拉", "新能源",
                     "外贸", "关税", "稀土", "降息", "通胀", "摩根", "大摩", "美股", "盘后固定价"],
    "policy":       ["外交部", "中美", "峰会", "两会", "监管", "规定", "禁止", "双开", "反腐",
                     "法治", "立法", "非国家工作人员", "受贿", "行贿"],
    "science":      ["NASA", "诺贝尔", "科学", "研究", "实验", "论文", "太空", "宇宙", "植物", "生物"],
    "culture":      ["历史", "文明", "文化", "教育", "考研", "高考", "留学", "文学", "电影", "纪录",
                     "知识", "欧洲", "堡垒", "神话", "海洋之神"],
    "social":       ["医疗", "健康", "心理", "教育", "就业", "薪资", "薪酬", "保险", "买房", "养老",
                     "学生手机", "隐私", "未成年人", "霸凌", "抑郁"],
}

FILTER_KW = [
    "明星", "演员", "演唱会", "综艺", "偶像", "CP", "出道", "颜值",
    "绝区零", "原神", "明日方舟", "星铁", "崩坏", "BLG", "WBG", "JDG", "LPL", "LOL",
    "抽卡", "限定", "联动", "皮肤", "大司马", "卡普空", "蓝洞", "PUBG",
    "曼联", "利兹联", "足球", "NBA", "电竞", "转会", "战队", "Major",
    "浪姐", "乘风", "周杰伦", "专辑", "MV",
    "减肥", "穿搭", "美妆", "护肤",
    "搞笑", "整活", "网友", "神评", "沙雕", "段子",
    "开服", "版号", "游戏", "氪金", "退款",
    "狗血", "八卦", "恋情", "官宣",
    "农村", "美食", "吃播",
    "ZywOo", "Karrigan", "阿张", "嘎子", "希希芙", "TXT", "第五人格",
    "华强买瓜", "抽蒜薹", "二游", "近战武器", "赛季",
]

def is_filtered(title):
    return any(kw in title for kw in FILTER_KW)

def classify(title):
    matched = []
    for tag, kws in TOPIC_KEYWORDS.items():
        if any(kw in title for kw in kws):
            matched.append(tag)
    return matched

def parse_hot_file(filepath):
    sections = {"知乎": [], "B站": [], "贴吧": [], "头条": []}
    current = None
    for line in open(filepath).read().split("\n"):
        if line.startswith("## 知乎"): current = "知乎"
        elif line.startswith("## B站"): current = "B站"
        elif line.startswith("## 百度"): current = "贴吧"
        elif line.startswith("## 今日头条"): current = "头条"
        elif line.startswith("## ") or line.startswith("# "): current = None; continue
        if not current: continue

        # 匹配表格行：| 1 | 标题 | 或 | 1 | 关键词 | 热度 |
        m = re.match(r'\|\s*\d+\s*\|([^|]+)\|', line)
        if m:
            title = m.group(1).strip()
            # B站关键词列
            if current == "B站":
                parts = [p.strip() for p in line.split("|")]
                if len(parts) >= 3:
                    title = parts[2]
            sections[current].append(title)

    return sections

def main(date_str):
    hot_dir = os.environ.get("HOT_NEWS_DIR", "/Users/zealove/.openclaw/workspace/hot_news")
    fp = f"{hot_dir}/{date_str}.md"
    if not os.path.exists(fp):
        yesterday = (date.today() - timedelta(days=1)).isoformat()
        fp = f"{hot_dir}/{yesterday}.md"

    sections = parse_hot_file(fp)
    src_w = {"头条": 1.5, "知乎": 1.2, "贴吧": 1.0, "B站": 0.8}

    topic_scores = defaultdict(float)
    topic_examples = defaultdict(list)

    for src, titles in sections.items():
        w = src_w[src]
        for title in titles:
            if is_filtered(title):
                continue
            topics = classify(title)
            for t in topics:
                topic_scores[t] += w
                topic_examples[t].append(title[:25])

    # 无匹配 → fallback
    if not topic_scores:
        topic_scores["social"] = 1.0
        topic_examples["social"].append("综合社会议题")

    sorted_topics = sorted(topic_scores.items(), key=lambda x: -x[1])
    print(f"[话题分析] 日期: {date_str}")
    for t, score in sorted_topics:
        print(f"  {t}: {score:.1f}  例: {topic_examples[t][0]}")

    top = [t for t, _ in sorted_topics[:3]]
    primary = top[0]
    mood = MOOD_MAP.get(primary, MOOD_MAP["social"])[0]

    print(f"\n主导话题: {primary}  |  情绪: {mood}  |  Top3: {top}")
    print(f"MOOD={mood}")
    print(f"PRIMARY={primary}")
    print(f"TOPICS={','.join(top)}")

if __name__ == "__main__":
    d = sys.argv[1] if len(sys.argv) > 1 else date.today().isoformat()
    main(d)
