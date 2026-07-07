# 本地一键更新器（试运行版）

这个工具用于替代手动导出 HAR。它会在本机打开抖音和小红书创作者中心，读取页面加载时返回的 JSON 数据，并把脱敏后的采集结果保存到 `tools/output/`。

当前版本只采集和导出数据，不会修改 `data.js`，也不会推送线上页面。

## 第一次使用

进入工具目录：

```bash
cd /Users/vivianxix/Documents/Claude/social-dashboard/tools/auto-refresh
```

安装依赖：

```bash
npm install
```

安装浏览器：

```bash
npx playwright install chromium
```

运行采集：

```bash
npm run collect
```

浏览器打开后，如果页面要求登录，请你自己扫码、验证码或确认登录。登录完成后回到终端按回车，采集器会继续监听接口数据。

## 只采集一个平台

小红书：

```bash
npm run collect:xhs
```

抖音：

```bash
npm run collect:dy
```

## 输出位置

```text
tools/output/latest-raw/
tools/output/summary.json
```

## 安全说明

- 登录状态只保存在 `tools/.auth/`。
- `tools/.auth/` 和 `tools/output/` 已被 `.gitignore` 忽略。
- 脚本会删除常见敏感字段，例如 cookie、authorization、token、session、ticket、csrf。
- 当前试运行版不会自动改 `data.js`，避免采集失败时影响线上看板。
