#!/bin/bash
# 发布所有游戏到 zealove.github.io/games/
# 用法: ./scripts/publish_games.sh [--commit]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
GAMES_DIR="$REPO_DIR/games"
CODESPACE="/Users/zealove/Desktop/codespace"

# 游戏列表
GAMES=("card-game" "iron-bloom" "poker-crush")

# 构建命令映射
declare -A BUILD_CMDS
BUILD_CMDS["card-game"]="cd $CODESPACE/card-game && npm run build"
BUILD_CMDS["iron-bloom"]="cd $CODESPACE/iron-bloom && npm run build"
BUILD_CMDS["poker-crush"]="cd $CODESPACE/poker-crush && pnpm build:web"

# 产物目录映射
declare -A DIST_DIRS
DIST_DIRS["card-game"]="$CODESPACE/card-game/dist"
DIST_DIRS["iron-bloom"]="$CODESPACE/iron-bloom/dist"
DIST_DIRS["poker-crush"]="$CODESPACE/poker-crush/dist-web"

# Hugo 输出目录（games 需拷贝到这里才能被 CI 部署）
PUBLIC_GAMES_DIR="$REPO_DIR/public/games"

# 解析参数
DO_COMMIT=false
if [[ "$1" == "--commit" ]]; then
  DO_COMMIT=true
fi

echo "=== 开始发布游戏 ==="

for game in "${GAMES[@]}"; do
  echo ""
  echo ">>> 发布 $game..."

  # 构建
  echo "    构建..."
  "${BUILD_CMDS[$game]}"

  # 清空目标目录（仓库根 games/ 和 public/games/）
  rm -rf "$GAMES_DIR/$game"
  rm -rf "$PUBLIC_GAMES_DIR/$game"
  mkdir -p "$GAMES_DIR/$game"
  mkdir -p "$PUBLIC_GAMES_DIR/$game"

  # 拷贝产物到两个位置
  echo "    拷贝到 games/$game/ (git 仓库)"
  cp -r "${DIST_DIRS[$game]}/." "$GAMES_DIR/$game/"
  echo "    拷贝到 public/games/$game/ (Hugo 输出，供 CI 部署)"
  cp -r "${DIST_DIRS[$game]}/." "$PUBLIC_GAMES_DIR/$game/"

  echo "<<< $game 发布完成"
done

# Hugo 生成 games listing page（同步 public/games/index.html 到 git games/ 目录）
echo ""
echo ">>> 同步 Hugo 生成的 games listing page..."
# 先运行 Hugo 生成 public/（包括 public/games/index.html）
echo "    运行 Hugo 构建..."
cd "$REPO_DIR" && hugo --gc --minify
# 把 Hugo 生成的 games/index.html 和 index.xml 同步到 git games/ 目录
if [[ -f "$PUBLIC_GAMES_DIR/index.html" ]]; then
  cp "$PUBLIC_GAMES_DIR/index.html" "$GAMES_DIR/index.html"
  cp "$PUBLIC_GAMES_DIR/index.xml" "$GAMES_DIR/index.xml" 2>/dev/null || true
  echo "    已同步 games/index.html 和 index.xml 到 git games/ 目录"
fi

echo ""
echo "=== 所有游戏发布完成 ==="

if $DO_COMMIT; then
  echo ""
  echo "=== 提交并推送 ==="
  cd "$REPO_DIR"
  git add games/ public/games/
  git commit -m "chore: update game builds $(date '+%Y-%m-%d %H:%M')"
  git push origin master
  echo "=== 已推送，CI 将自动构建并发布 ==="
else
  echo "games/ 和 public/games/ 目录已更新"
  echo "如需自动提交推送，请运行: ./scripts/publish_games.sh --commit"
  echo "注意: public/games/ 现在包含可直接访问的游戏文件"
fi
