# 本地一键自动更新器设计

## 目标

为听宅人数据复盘看板增加一个本地试运行版更新器，用来替代手动导出 HAR 的流程。用户在自己的电脑上登录抖音创作者中心和小红书创作者中心后，更新器自动打开对应页面、监听页面接口返回、保存原始采集结果，并在后续阶段用于生成新的 `data.js`。

本阶段只做安全的本地采集与导出，不自动修改线上页面、不自动推送 GitHub Pages。

## 范围

- 平台：抖音创作者中心、小红书创作者中心。
- 账号：当前看板中的听宅人账号。
- 输入：用户本机浏览器登录态。
- 输出：本机采集结果文件，存放在 `tools/output/`。
- 登录状态：保存在 `tools/.auth/`，仅本机使用，不提交仓库。

## 不做的事情

- 不保存账号密码。
- 不上传 cookie、token、HAR 原文或完整请求头到 GitHub。
- 不在云端自动登录账号。
- 不直接改动 `index.html` 的页面布局。
- 不在试运行阶段自动推送线上链接。

## 方案

使用 Playwright 写一个本地更新器：

1. 第一次运行时打开浏览器。
2. 用户自行完成扫码、验证码或登录确认。
3. 更新器保存本机浏览器状态到 `tools/.auth/`。
4. 更新器进入抖音和小红书的数据页面。
5. 监听网络响应，筛选 JSON 数据接口。
6. 将可解析的数据写入 `tools/output/latest-raw/`。
7. 生成一份采集摘要，标记哪些数据已获取、哪些数据缺失。

## 数据流

```text
用户本机登录态
  -> Playwright 浏览器
  -> 创作者中心页面
  -> 网络响应 JSON
  -> tools/output/latest-raw/
  -> tools/output/summary.json
```

后续确认采集稳定后，再增加：

```text
tools/output/latest-raw/
  -> 数据映射器
  -> data.js
  -> git commit
  -> git push
```

## 文件结构

```text
social-dashboard/
  tools/
    auto-refresh/
      package.json
      README.md
      src/
        collect.js
        config.js
        sanitize.js
    .auth/              # 本机登录态，git ignore
    output/
      latest-raw/       # 脱敏后的接口数据
      summary.json      # 采集摘要
```

## 安全规则

- `tools/.auth/` 必须加入 `.gitignore`。
- `tools/output/latest-raw/` 默认不提交，除非文件已脱敏且用户明确同意。
- 采集器写入文件前删除常见敏感字段，例如 `cookie`、`authorization`、`token`、`session`、`ticket`、`csrf`。
- 控制台只显示接口路径、状态码、数据体大小和识别结果，不打印完整请求头。
- 如果检测到登录页、验证码页或接口返回未登录，停止采集并提示用户手动登录。

## 失败处理

- 登录过期：提示重新登录，不清空旧数据。
- 页面改版：保存采集摘要，标记未识别接口，等待人工补适配。
- 平台风控：停止自动操作，让用户手动完成验证。
- 数据不完整：不覆盖现有 `data.js`，只在摘要里列出缺失项。

## 验证标准

- 能在本机打开抖音和小红书创作者中心。
- 第一次运行时允许用户手动登录。
- 登录态文件只保存在 `tools/.auth/`。
- 采集输出不包含完整 cookie、authorization 或 token。
- 运行失败不会修改 `data.js`、`index.html` 或线上链接。
- `git status` 不显示敏感登录态文件。

## 后续阶段

试运行确认能稳定抓到数据后，再做第二阶段：

- 解析采集结果到现有 `DASHBOARD_DATA` 结构。
- 自动识别新增作品。
- 自动计算抖音观看时段。
- 自动生成智能优化建议。
- 增加用户确认后的一键提交和推送。
