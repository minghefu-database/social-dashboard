#!/bin/zsh
set -e

cd "$(dirname "$0")"

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
