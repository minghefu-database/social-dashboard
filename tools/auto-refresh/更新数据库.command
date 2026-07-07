#!/bin/zsh
set -e

trap 'echo ""; echo "运行出错，窗口已保留，方便把上面的错误发给 Codex。"; read "?按回车关闭窗口。"' ERR

if [ -f "$HOME/.zprofile" ]; then
  source "$HOME/.zprofile"
fi

if [ -f "$HOME/.zshrc" ]; then
  source "$HOME/.zshrc"
fi

cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "没有找到 npm。请先安装 Node.js，或把当前窗口里的错误发给 Codex。"
  read "?按回车关闭窗口。"
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "第一次运行：正在安装本地采集器依赖..."
  npm install
fi

echo "检查 Playwright Chromium 浏览器..."
npx playwright install chromium

npm run collect

echo ""
echo "采集结束。你可以把 tools/output/summary.json 的结果发给 Codex 继续做数据映射。"
read "?按回车关闭窗口。"
