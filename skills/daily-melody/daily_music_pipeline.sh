#!/bin/bash
# 每日旋律 Pipeline
# 触发：launchd 定时（每日 10:10）
# 流程：读热点 → 综合情绪分析 → 生成音乐 → 压缩 → metadata → 推送博客

set -e

DATE=$(date +%Y-%m-%d)
BLOG_REPO="/Users/zealove/Desktop/codespace/zealove.github.io"
MUSIC_DIR="${BLOG_REPO}/static/music/daily"
OUTPUT="${MUSIC_DIR}/${DATE}.m4a"
TMP_MP3="/tmp/daily_music_${DATE}.mp3"
LOG="/Users/zealove/.openclaw/workspace/logs/daily_music_${DATE}.log"
HOT_NEWS_DIR="${HOT_NEWS_DIR:-/Users/zealove/.openclaw/workspace/hot_news}"
HOT_MOOD_SCRIPT="${SCRIPT_DIR}/hot_mood.py"

mkdir -p "${MUSIC_DIR}" "$(dirname $LOG)"

exec > >(tee -a "$LOG") 2>&1

echo "=== 每日旋律 Pipeline | ${DATE} ==="

# Step 1: 确认热点文件存在
echo "[1/7] 确认热点文件..."
HOT_FILE="${HOT_NEWS_DIR}/${DATE}.md"
if [ ! -f "$HOT_FILE" ]; then
  YESTERDAY=$(date -v-1d +%Y-%m-%d)
  HOT_FILE="${HOT_NEWS_DIR}/${YESTERDAY}.md"
  echo "    今日文件不存在，使用昨日 ($YESTERDAY)"
fi

if [ ! -f "$HOT_FILE" ]; then
  echo "    ⚠️ 热点文件完全不存在，使用 fallback 情绪"
  ANALYSIS="contemplative and warm"
  PRIMARY_TOPIC="social"
  THEME=""
else
  # Step 2: 综合情绪分析（多平台热点 + 话题过滤）
  echo "[2/7] 综合情绪分析（多平台加权）..."

  MOOD_RESULT=$(python3 "$HOT_MOOD_SCRIPT" "$DATE" 2>/dev/null)
  ANALYSIS=$(echo "$MOOD_RESULT" | grep "^MOOD=" | cut -d= -f2)
  PRIMARY_TOPIC=$(echo "$MOOD_RESULT" | grep "^PRIMARY=" | cut -d= -f2)
  TOP_TOPICS=$(echo "$MOOD_RESULT" | grep "^TOPICS=" | cut -d= -f2-)

  if [ -z "$ANALYSIS" ]; then
    echo "    ⚠️ 情绪分析失败，使用 fallback"
    ANALYSIS="contemplative and warm"
    PRIMARY_TOPIC="social"
    THEME=""
  else
    echo "    主导话题: $PRIMARY_TOPIC"
    echo "    情绪风格: $ANALYSIS"
    echo "    Top3话题: $TOP_TOPICS"
  fi

  # 周几主题（叠加在情绪上）
  DOW=$(date +%u)
  case $DOW in
    1) theme="Monday motivation, fresh start";;
    2) theme="deep focus, work mode";;
    3) theme="afternoon contemplation";;
    4) theme="thoughtful and introspective";;
    5) theme="Friday energy, upbeat";;
    6) theme="weekend adventure";;
    7) theme="Sunday serenity";;
  esac
fi

# Step 3: 生成音乐（60s instrumental）
echo "[3/7] 生成音乐（60s）..."
PROMPT="Cinematic instrumental, ${ANALYSIS}, ${theme}, solo piano with strings, 80-90bpm, minor to major resolution, instrumental"
echo "    Prompt: $PROMPT"

METADATA_ARTIST="MiniMax Music Model"
METADATA_ALBUM="ZeaLoVe Daily Melody"
METADATA_COMMENT="${ANALYSIS}${theme:+, }${theme}"

mmx music generate \
  --prompt "$PROMPT" \
  --instrumental \
  --out "$TMP_MP3" \
  --quiet 2>&1 | grep -v '^\[' || true

if [ ! -f "$TMP_MP3" ]; then
  echo "生成失败！"
  exit 1
fi

# Step 4: 压缩到 600KB 以内（32kbps AAC）
echo "[4/7] 压缩到 600KB（32kbps AAC）..."
python3 -c "
with open('$TMP_MP3','rb') as f:
    data = f.read()
if data[:3] == b'ID3':
    sz = (data[6]&0x7f)*0x200000 + (data[7]&0x7f)*0x4000 + (data[8]&0x7f)*0x80 + (data[9]&0x7f)
    audio = data[10+sz:]
    with open('/tmp/raw.mp3','wb') as f:
        f.write(audio)
else:
    with open('/tmp/raw.mp3','wb') as f:
        f.write(data)
" 2>/dev/null || cp "$TMP_MP3" /tmp/raw.mp3

afconvert /tmp/raw.mp3 -f mp4f -d aac -b 32000 "$OUTPUT" 2>/dev/null || {
  echo "    压缩失败，使用原始文件"
  cp "$TMP_MP3" "${OUTPUT%.m4a}.mp3"
  OUTPUT="${OUTPUT%.m4a}.mp3"
}

SIZE=$(ls -lh "$OUTPUT" | awk '{print $5}')
echo "    输出: $OUTPUT (${SIZE})"

# Step 5: 写入 metadata
echo "[5/7] 写入音频 metadata..."
python3 -c "
import mutagen
from mutagen.mp4 import MP4
track = MP4('$OUTPUT')
track['\xa9ART'] = '$METADATA_ARTIST'
track['\xa9alb'] = '$METADATA_ALBUM'
track['\xa9cmt'] = '$METADATA_COMMENT'
track['\xa9day'] = '$DATE'
track.save()
print('  metadata 写入成功')
" 2>/dev/null || echo "    metadata 写入失败（继续流程）"

# Step 6: 提交到博客
echo "[6/7] 提交到博客..."
cd "$BLOG_REPO"
git add "static/music/daily/${DATE}.m4a" "static/music/daily/${DATE}.mp3" 2>/dev/null || true
git add "static/music/daily/${DATE}"*
git commit -m "feat: daily music ${DATE}" 2>/dev/null && {
  git push origin master 2>/dev/null && echo "    推送成功！" || echo "    推送失败（可能无变更）"
} || echo "    无需提交（文件未变化）"

# Step 7: 飞书通知
echo "[7/7] 发送飞书通知..."
echo "🎵 每日旋律 ${DATE} 已生成"
echo "🎵 Artist : $METADATA_ARTIST"
echo "🎵 Album  : $METADATA_ALBUM"
echo "🎵 Mood   : $METADATA_COMMENT"
echo "🎵 Topic  : $PRIMARY_TOPIC"

rm -f "$TMP_MP3" /tmp/raw.mp3

echo "=== 完成 ==="
