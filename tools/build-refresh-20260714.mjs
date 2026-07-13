import fs from "fs";
import path from "path";
import vm from "vm";

const root = process.cwd();
const rawRoot = path.join(root, "tools/output/latest-raw");
const xhsDetailDir = path.join(rawRoot, "xhs-real-chrome-details-20260714");
const refreshDir = path.join(rawRoot, "refresh-20260714");
const dyDirectDir = path.join(refreshDir, "direct/dy");
const dyRequestDir = path.join(rawRoot, "dy-item-details-request-20260714");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function body(file) {
  const json = readJson(file);
  return json.body?.body ?? json.body?.data ?? json.body ?? json.data ?? json;
}

function maybeBody(file) {
  if (!fs.existsSync(file)) return null;
  try { return body(file); } catch { return null; }
}

function directByPrefix(prefix) {
  const file = fs.readdirSync(dyDirectDir).find(name => name.startsWith(prefix));
  return file ? body(path.join(dyDirectDir, file)) : null;
}

function dyDetailBody(index, exactId, suffix, directPrefix) {
  const exactFile = path.join(dyRequestDir, `${String(index).padStart(2, "0")}-${exactId}-${suffix}.json`);
  const exact = maybeBody(exactFile);
  if (exact && Number(exact.status_code) === 0) return exact;
  const direct = directPrefix ? directByPrefix(directPrefix) : null;
  if (direct && Number(direct.status_code) === 0) return direct;
  return exact || direct || null;
}

function pct(value, digits = 1) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Number((n * 100).toFixed(digits));
}

function fixed(value, digits = 1) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Number(n.toFixed(digits));
}

function cnNum(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  if (n >= 10000) return `${Number((n / 10000).toFixed(1))}万`;
  return Math.round(n).toLocaleString("zh-CN");
}

function plain(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toLocaleString("zh-CN");
}

function fmtDate(msOrSeconds) {
  const n = Number(msOrSeconds);
  const d = new Date(n < 10000000000 ? n * 1000 : n);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(d);
}

function fmtShort(msOrDate) {
  const d = msOrDate instanceof Date ? msOrDate : new Date(Number(msOrDate));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(d);
  return `${parts.find(p => p.type === "month").value}-${parts.find(p => p.type === "day").value}`;
}

function fmtHour(ms) {
  const d = new Date(Number(ms));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false
  }).formatToParts(d);
  return `${parts.find(p => p.type === "month").value}-${parts.find(p => p.type === "day").value} ${parts.find(p => p.type === "hour").value}:00`;
}

function msToHourPoint(item, valueKey = "count") {
  return { t: fmtHour(item.date), v: Number(item[valueKey] ?? item.count ?? 0), vd: Number(item.count_with_double ?? item[valueKey] ?? item.count ?? 0) };
}

function msToDayPoint(item, valueKey = "count") {
  return { t: fmtShort(item.date), v: Number(item[valueKey] ?? item.count ?? 0), vd: Number(item.count_with_double ?? item[valueKey] ?? item.count ?? 0) };
}

function listPoints(list, mode = "day") {
  if (!Array.isArray(list)) return [];
  return list.map(item => mode === "hour" ? msToHourPoint(item) : msToDayPoint(item));
}

function sum(list, key = "count") {
  return (list || []).reduce((total, item) => total + Number(item[key] || 0), 0);
}

function labelsValues(list) {
  const arr = Array.isArray(list) ? [...list] : [];
  arr.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return {
    labels: arr.map(item => fmtShort(item.date)),
    values: arr.map(item => Number(item.count || 0))
  };
}

function barItems(items, titleKey = "title", valueKey = "value") {
  return (items || [])
    .map(item => ({ label: item[titleKey] ?? item.key ?? item.label, pct: fixed(item[valueKey] ?? item.pct, 1) }))
    .filter(item => item.label !== undefined && item.pct !== null);
}

function countItems(items) {
  return (items || [])
    .map(item => ({ label: item.label ?? item.title ?? item.key, pct: fixed(item.count ?? item.value ?? item.pct, 1) }))
    .filter(item => item.label !== undefined && item.pct !== null);
}

function portraitFromXhs(data) {
  const gender = {};
  for (const item of data?.gender || []) {
    if (String(item.title).includes("男")) gender.male = Number(item.value);
    if (String(item.title).includes("女")) gender.female = Number(item.value);
  }
  return {
    gender,
    age: { items: barItems(data?.age) },
    city: { items: barItems(data?.city) },
    interest: { items: barItems(data?.interest) }
  };
}

function xhsBaseToDetail(base, source, portrait, pageText = "") {
  const trend = {
    hourly: {
      view: listPoints(base.hour?.view_list, "hour"),
      rise_fans: listPoints(base.hour?.rise_fans_list, "hour"),
      exit_view2s: listPoints(base.hour?.exit_view2s_list, "hour")
    },
    daily: {
      view: listPoints(base.day?.view_list, "day"),
      rise_fans: listPoints(base.day?.rise_fans_list, "day"),
      exit_view2s: listPoints(base.day?.exit_view2s_list, "day")
    },
    leaveSummary: leaveSummary(base, pageText)
  };
  return {
    overview: {
      impl_count: plain(base.impl_count),
      view_count: plain(base.view_count),
      like_count: plain(base.like_count),
      comment_count: plain(base.comment_count),
      collect_count: plain(base.collect_count),
      share_count: plain(base.share_count),
      rise_fans_count: plain(base.rise_fans_count),
      view_time_avg: fixed(base.view_time_avg_with_double ?? base.view_time_avg, 1),
      cover_click_rate: fixed(base.cover_click_rate, 1),
      finish5s_rate: fixed(base.finish5s_rate, 1),
      full_view_rate: fixed(base.full_view_rate_with_double ?? base.full_view_rate, 1),
      exit_view2s_rate: fixed(base.exit_view2s_rate_with_fans ? base.exit_view2s_rate : base.exit_view2s_rate_with_double ?? base.exit_view2s_rate, 1),
      fans: {
        impl: fixed(base.impl_count_rate_with_fans, 1),
        view: fixed(base.view_rate_with_fans, 1),
        like: fixed(base.like_rate_with_fans, 1),
        comment: fixed(base.comment_rate_with_fans, 1),
        collect: fixed(base.collect_rate_with_fans, 1),
        share: fixed(base.share_rate_with_fans, 1),
        coverClick: fixed(base.cover_click_rate_with_fans, 1),
        viewTime: fixed(base.view_time_avg_with_fans, 1),
        finish5s: fixed(base.finish5s_rate_with_fans, 1),
        fullView: fixed(base.full_view_rate_with_fans, 1),
        exit2s: fixed(base.exit_view2s_rate_with_fans, 1)
      },
      trend
    },
    trend,
    playSource: barItems(source?.source || [], "title", "value_with_double"),
    portrait: portraitFromXhs(portrait),
    leaveSummary: trend.leaveSummary
  };
}

function leaveSummary(base, pageText) {
  const match = String(pageText || "").match(/超过\s*([\d.]+)%\s*的用户在5秒内离开/);
  if (match) return `超过 ${match[1]}% 的用户在5秒内离开。`;
  const rate = fixed(base.exit_view2s_rate ?? base.exit_view2s_rate_with_double, 1);
  return rate === null ? "" : `超过 ${rate}% 的用户在2秒内离开。`;
}

const xhsSummary = readJson(path.join(xhsDetailDir, "summary.json"));
const xhsItemDetails = {};
const xhsItemList = [];
for (const note of xhsSummary) {
  const baseFile = note.files.find(file => file.includes("base-by-note"));
  const sourceFile = note.files.find(file => file.includes("audience-source-by-note"));
  const portraitFile = note.files.find(file => file.includes("audience-source-detail-by-note"));
  const pageFile = path.join(xhsDetailDir, path.basename(baseFile).replace(/-\d+-base-by-note\.json$/, "-page.txt").replace(/-04-base-by-note\.json$/, "-page.txt"));
  const base = body(baseFile);
  const source = body(sourceFile);
  const portrait = body(portraitFile);
  const pageText = fs.existsSync(pageFile) ? fs.readFileSync(pageFile, "utf8") : "";
  const apiTitle = base.note_info?.desc || "";
  const title = (!apiTitle || apiTitle.includes("…") || apiTitle.length < note.title.length) ? note.title : apiTitle;
  const item = {
    id: note.id,
    title,
    date: fmtDate(base.note_info?.post_time),
    plays: cnNum(base.view_count),
    likes: plain(base.like_count),
    comments: plain(base.comment_count),
    favs: plain(base.collect_count),
    shares: plain(base.share_count),
    fans: plain(base.rise_fans_count),
    ctr: `${fixed(base.cover_click_rate, 1)}%`,
    clickRate: `${fixed(base.cover_click_rate, 1)}%`,
    finishRate5s: `${fixed(base.finish5s_rate, 1)}%`,
    fullViewRate: `${fixed(base.full_view_rate_with_double ?? base.full_view_rate, 1)}%`,
    avgDur: `${fixed(base.view_time_avg_with_double ?? base.view_time_avg, 1)}秒`
  };
  xhsItemList.push(item);
  xhsItemDetails[title] = xhsBaseToDetail(base, source, portrait, pageText);
}

const xhsAccount = body(path.join(refreshDir, "xhs/0006-work-c512c9fd.json"));
const xhsSlots = body(path.join(refreshDir, "xhs/0017-audience-a4a3749d.json"));
const xhsAccountSource = body(path.join(refreshDir, "xhs/0017-overview-audience-traffic-dea664da.json"));
const xhsFansOverall = body(path.join(refreshDir, "xhs/0023-audience-6bcaee2c.json"));
const xhsActiveFans = body(path.join(refreshDir, "xhs/0024-audience-b398d0a1.json"));
const xhsFansPortrait = body(path.join(refreshDir, "xhs/0025-audience-3cac25e5.json"));
const xhsFansSource = body(path.join(refreshDir, "xhs/0026-audience-traffic-27ea92fb.json"));

function xhsTrend(periodKey, label) {
  const period = periodKey === "d7" ? xhsAccount.seven : xhsAccount.thirty;
  const lv = labelsValues(period.view_list);
  return { real: true, unitText: `浏览量 · ${label} · 真实后台数据`, labels: lv.labels, values: lv.values };
}

function xhsTimeslot(periodKey) {
  const key = periodKey === "d7" ? "seven" : "thirty";
  const begin = periodKey === "d7" ? xhsSlots.seven_begin_time : xhsSlots.thirty_begin_time;
  const end = periodKey === "d7" ? xhsSlots.seven_end_time : xhsSlots.thirty_end_time;
  return {
    period: `${fmtShort(begin)} 至 ${fmtShort(end)}`,
    labels: (xhsSlots[key] || []).map(item => String(item.start_point)),
    values: (xhsSlots[key] || []).map(item => Number(item.count || 0))
  };
}

function xhsOverview(periodKey) {
  const p = periodKey === "d7" ? xhsAccount.seven : xhsAccount.thirty;
  const label = periodKey === "d7" ? "07-06 至 07-12" : "06-13 至 07-12";
  const deltas7 = { exposure: -55, view: -65, ctr: 4, avg: -12, total: -67, full: -15, like: -60, comment: -77, collect: -56, share: -76, net: -61, rise: -60, leave: -43, home: -54 };
  const deltas30 = { exposure: -2, view: 26, ctr: 3, avg: 17, total: 31, full: 21, like: 98, comment: 35, collect: 192, share: 175, net: 101, rise: 105, leave: 128, home: 82 };
  const deltas = periodKey === "d7" ? deltas7 : deltas30;
  const fans = periodKey === "d7" ? xhsFansOverall.seven : xhsFansOverall.thirty;
  return {
    period: label,
    cards: [
      { label: "曝光数", value: periodKey === "d7" ? "4.7" : "63.2", unit: "万", delta: deltas.exposure },
      { label: "观看数", value: cnNum(p.view_count).replace("万", ""), unit: p.view_count >= 10000 ? "万" : "", delta: deltas.view },
      { label: "封面点击率", value: periodKey === "d7" ? "13.6" : "14.1", unit: "%", delta: deltas.ctr },
      { label: "平均观看时长", value: "1.1", unit: "分钟", delta: deltas.avg },
      { label: "观看总时长", value: periodKey === "d7" ? "223" : "4220.5", unit: "小时", delta: deltas.total },
      { label: "视频完播率", value: periodKey === "d7" ? "9.1" : "8", unit: "%", delta: deltas.full },
      { label: "点赞数", value: plain(p.like_count), unit: "", delta: deltas.like },
      { label: "评论数", value: plain(p.comment_count), unit: "", delta: deltas.comment },
      { label: "收藏数", value: plain(p.collect_count), unit: "", delta: deltas.collect },
      { label: "分享数", value: plain(p.share_count), unit: "", delta: deltas.share },
      { label: "净增粉丝", value: plain((fans?.rise_fans_count || 0) - (fans?.leave_fans_count || 0)), unit: "", delta: deltas.net },
      { label: "新增关注", value: plain(fans?.rise_fans_count), unit: "", delta: deltas.rise },
      { label: "取关粉丝", value: plain(fans?.leave_fans_count), unit: "", delta: deltas.leave },
      { label: "主页访客", value: plain(p.home_view_count), unit: "", delta: deltas.home },
      { label: "总粉丝量", value: plain(fans?.fans_count), unit: "", delta: null }
    ],
    flowTotalHours: periodKey === "d7" ? "223" : "4220.5",
    trend: xhsTrend(periodKey, label),
    timeslot: xhsTimeslot(periodKey)
  };
}

function sourceAccount(periodKey) {
  const key = periodKey === "d7" ? "seven" : "thirty";
  return {
    period: periodKey === "d7" ? "07-06 至 07-12 · 真实后台" : "06-13 至 07-12 · 真实后台",
    items: barItems(xhsAccountSource[key] || [])
  };
}

function audienceXhs(periodKey) {
  const key = periodKey === "d7" ? "seven" : "thirty";
  const fans = xhsFansOverall[key];
  const lv = labelsValues(fans.fans_list);
  return {
    note: `粉丝数据 · ${periodKey === "d7" ? "07-06 至 07-12" : "06-13 至 07-12"} · 数据更新至 2026-07-13 00:00`,
    base: [
      { label: "总粉丝量", value: plain(fans.fans_count), sub: "粉丝数据接口" },
      { label: periodKey === "d7" ? "7日涨粉" : "30日涨粉", value: plain(fans.rise_fans_count), sub: "新增关注" },
      { label: periodKey === "d7" ? "7日取关" : "30日取关", value: plain(fans.leave_fans_count), sub: "取消关注" },
      { label: "净增粉丝", value: plain(fans.rise_fans_count - fans.leave_fans_count), sub: "涨粉-取关" }
    ],
    growth: lv,
    followSource: { items: barItems(xhsFansSource), period: "粉丝来源 · 数据更新至 2026-07-13" },
    topFans: (xhsActiveFans[key] || []).slice(0, 10).map(item => ({ name: item.name, idx: item.count })),
    portrait: {
      conclusion: "核心粉丝以女性、25-44岁、一二线与新一线城市兴趣用户为主。",
      ...portraitFromXhs(xhsFansPortrait)
    }
  };
}

const dyExact = [
  ["7660791922592284133", "3类人的财富布局💰｜中式美学下的器物搭配"],
  ["7659601597508699259", "卧室不动硬装的礼乐布局妙招"],
  ["7658276437728391281", "找到家里最\"旺\"你的位置，不用找\"大师\"。"],
  ["7656787757771445349", "全网首发揭秘：家中手办，正在悄悄改变你的认知！🚨"],
  ["7655548439049549669", "酒店选房避雷指南, 国歌护体，睡稳心安。"],
  ["7654027606584993701", "不利家中女性的格局, 三招解决！"],
  ["7652581925735312633", "现代家中男尊女卑的实际理解, 很实用!"],
  ["7651578818137783675", "容易提升成绩的位置，打造好的学习环境"],
  ["7649980868819643877", "让你家拥有一个S型身材的家居布局"],
  ["7649243282254738609", "不要迷信了！寺庙的秘密被可视化了"]
];

function loadPreviousDyDetails() {
  const dataPath = path.join(root, "data.js");
  if (!fs.existsSync(dataPath)) return {};
  try {
    const code = fs.readFileSync(dataPath, "utf8")
      .replace(/\/\* === DATA_REFRESH_2026_07_14_FULL_START === \*\/[\s\S]*?\/\* === DATA_REFRESH_2026_07_14_FULL_END === \*\//g, "")
      + "\nthis.__D = DASHBOARD_DATA;";
    const ctx = { console };
    vm.createContext(ctx);
    vm.runInContext(code, ctx);
    return ctx.__D?.data?.tingzhairen?.flowAnalysis?.dy?.itemDetails || {};
  } catch {
    return {};
  }
}

const previousDyDetails = loadPreviousDyDetails();

const dyWorkItems = body(path.join(dyDirectDir, "item-list.json")).items.slice(0, 10);
const dyManualMetrics = new Map([
  ["7649980868819643877", { view_count: 1399788, like_count: 23294, comment_count: 969, share_count: 10015, favorite_count: 9079, avg_view_second: 35, completion_rate_5s: .545, completion_rate: .043, bounce_rate_2s: .277, subscribe_count: 13643 }],
  ["7649243282254738609", { view_count: 31115, like_count: 601, comment_count: 25, share_count: 133, favorite_count: 298, avg_view_second: 33, completion_rate_5s: .448, completion_rate: .061, bounce_rate_2s: .286, subscribe_count: 353 }]
]);

const sourceLabelMap = {
  homepage_hot: "推荐页", follow: "关注", search: "搜索", homepage: "个人主页",
  message: "消息", familiar: "熟人", other: "其他", fresh: "同城/新鲜", yumme_vv_all: "其他平台"
};
const careerMap = {
  white_collar: "白领", blue_collar_service: "服务业蓝领", blue_collar_industry: "工业蓝领",
  inhouse_student: "学生", restaurant: "餐饮", public_servant: "公务员", retail: "零售",
  not_work: "暂未工作", teacher: "教师", driver: "司机", building_worker: "建筑工人",
  it: "IT", finance: "金融", medical_staff: "医护", agriculture: "农业", delivery_man: "外卖/配送",
  repair_worker: "维修"
};
const activeMap = { "-1": "低活跃", "1": "浅层", "2": "中度", "3": "高活跃", "4": "重度" };

function trendFromDy(data, metricName) {
  const trendMap = data?.trend_map || {};
  const metric = trendMap[metricName] || Object.values(trendMap)[0] || {};
  const points = metric["0"] || Object.values(metric)[0] || [];
  return {
    labels: points.map(item => item.date_time),
    values: points.map(item => Math.round(Number(item.value || 0)))
  };
}

function dyBar(list, labeler = key => key) {
  return (list || []).map(item => ({
    label: labeler(item.key),
    pct: pct(item.value, 1)
  })).filter(item => item.pct !== null).sort((a, b) => b.pct - a.pct);
}

function dyPortrait(data) {
  const genderList = data?.gender?.ratio_list || [];
  const gender = {};
  for (const item of genderList) {
    if (item.key === "male") gender.male = pct(item.value, 1);
    if (item.key === "female") gender.female = pct(item.value, 1);
  }
  return {
    gender,
    age: dyBar(data?.age?.ratio_list, key => key.replace("-18", "18岁以下").replace("50-", "50岁以上")),
    province: dyBar(data?.province?.ratio_list || data?.city?.ratio_list, key => key),
    city: dyBar(data?.city_level?.ratio_list, key => key),
    career: dyBar(data?.career, key => careerMap[key] || key).slice(0, 8),
    active: dyBar(data?.active, key => activeMap[key] || key)
  };
}

function chapterFromDy(data) {
  const chapters = (data?.chapter_info?.ChapterDetails || []).map(item => ({
    timestamp: Number(item.Timestamp || 0),
    timestamp_display: secText(Number(item.Timestamp || 0) / 1000),
    desc: item.Desc || "",
    detail: item.Detail || ""
  }));
  const top = (data?.chapter_top_data || []).map(item => ({
    timestamp: Number(item.chapter_detail?.Timestamp || 0),
    timestamp_display: secText(Number(item.chapter_detail?.Timestamp || 0) / 1000),
    desc: item.chapter_detail?.Desc || "",
    detail: item.chapter_detail?.Detail || "",
    clickRate: pct(item.click_rate, 1)
  }));
  return { chapters, top_chapters: top };
}

function secText(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function dySources(data) {
  return (data?.play_source || [])
    .map(item => ({ key: item.key, label: sourceLabelMap[item.key] || item.key, pct: pct(item.value, 1), delta: pct(item.history_difference || 0, 1) }))
    .filter(item => item.pct !== null && item.pct > 0)
    .sort((a, b) => b.pct - a.pct);
}

function dyOthers(data) {
  return {
    similarAuthors: (data?.audience_prefer_similar_authors || []).slice(0, 10).map(item => ({ name: item.nickname, followers: Number(item.follower_count || 0) })),
    preferTopics: (data?.audience_prefer_topics || data?.audience_prefer_challenge || []).slice(0, 12).map(item => ({ name: item.name || item.challenge_name || item.title }))
  };
}

const dyItemList = [];
const dyItemDetails = {};
for (let i = 0; i < dyExact.length; i++) {
  const [exactId, title] = dyExact[i];
  const sourceIndex = i + 1;
  const item = dyWorkItems[i] || {};
  const metrics = dyManualMetrics.get(exactId) || item.metrics || {};
  const date = fmtDate(item.create_time || (exactId === "7649980868819643877" ? 1781136000 : 1780963200));
  const listItem = {
    id: exactId,
    title,
    date,
    plays: cnNum(metrics.view_count),
    avgDur: `${fixed(metrics.avg_view_second, 0)}秒`,
    click: pct(metrics.cover_click_rate || 1, 1),
    finish5: pct(metrics.completion_rate_5s, 1),
    bounce2: pct(metrics.bounce_rate_2s, 1),
    likes: plain(metrics.like_count),
    shares: plain(metrics.share_count),
    clickRate: `${pct(metrics.cover_click_rate || 1, 1)}%`,
    finishRate5s: `${pct(metrics.completion_rate_5s, 1)}%`,
    bounce2s: `${pct(metrics.bounce_rate_2s, 1)}%`,
    like: plain(metrics.like_count),
    share: plain(metrics.share_count)
  };
  dyItemList.push(listItem);

  const viewHour = dyDetailBody(sourceIndex, exactId, "viewHour", `${sourceIndex}-metrics-view-hour-`);
  const viewDay = dyDetailBody(sourceIndex, exactId, "viewDay", `${sourceIndex}-metrics-view-day-`);
  const subHour = dyDetailBody(sourceIndex, exactId, "subHour", `${sourceIndex}-metrics-sub-hour-`);
  const subDay = dyDetailBody(sourceIndex, exactId, "subDay", `${sourceIndex}-metrics-sub-day-`);
  const source = dyDetailBody(sourceIndex, exactId, "source", `${sourceIndex}-play-source-`);
  const portrait = dyDetailBody(sourceIndex, exactId, "portrait", `${sourceIndex}-fans-item-portrait-`);
  const chapter = dyDetailBody(sourceIndex, exactId, "chapter", `${sourceIndex}-chapter-`);
  const others = dyDetailBody(sourceIndex, exactId, "others", `${sourceIndex}-fans-item-others-`);
  const bullet = directByPrefix(`${sourceIndex}-bullet-analysis-`);
  const wordcloud = dyDetailBody(sourceIndex, exactId, "wordcloud", `${sourceIndex}-wordcloud-`);
  const otherMapped = dyOthers(others);
  const previousTraffic = previousDyDetails[title]?.traffic || {};
  const fallbackSearchKeywords = previousTraffic.searchKeywords || [];
  const fallbackInspireSearch = previousTraffic.inspireSearch || [];
  const detail = {
    overview: {
      playCount: plain(metrics.view_count),
      likeCount: plain(metrics.like_count),
      commentCount: plain(metrics.comment_count),
      shareCount: plain(metrics.share_count),
      favoriteCount: plain(metrics.favorite_count),
      subscribeCount: plain(metrics.subscribe_count),
      avgViewSecond: fixed(metrics.avg_view_second, 1),
      completionRate: pct(metrics.completion_rate, 1),
      completion5sRate: pct(metrics.completion_rate_5s, 1),
      bounce2sRate: pct(metrics.bounce_rate_2s, 1),
      viewTrend: { ...trendFromDy(viewHour, "view_count"), daily: trendFromDy(viewDay, "view_count") },
      subscribeTrend: { ...trendFromDy(subHour, "subscribe_count"), daily: trendFromDy(subDay, "subscribe_count") }
    },
    traffic: {
      chapterClickRate: chapterFromDy(chapter),
      playSource: dySources(source),
      playSourceNote: source ? "" : "平台数据还未更新",
      searchKeywords: fallbackSearchKeywords,
      searchKeywordsNote: fallbackSearchKeywords.length ? "" : "平台数据还未更新",
      inspireSearch: fallbackInspireSearch,
      inspireSearchNote: fallbackInspireSearch.length ? "" : "平台数据还未更新"
    },
    audience: { ...dyPortrait(portrait), ...otherMapped },
    wordCloud: (wordcloud?.word_cloud || wordcloud?.wordcloud || []).slice(0, 20).map(item => ({ word: item.word || item.key, score: Number(item.score || item.value || 1) }))
  };
  if (exactId === "7660791922592284133") detail.traffic.boostFlow = "平台扶持流量 748次播放";
  if (exactId === "7659601597508699259") {
    detail.traffic.boostFlow = "平台扶持流量 2922次播放";
  }
  dyItemDetails[title] = detail;
}

const dyOverviewAll = body(path.join(refreshDir, "dy/0049-overview-trend-work-audience-b63cc5fd.json"));
const dyFans = body(path.join(dyDirectDir, "fans-summary.json"));
function dyTrendFromOverview(key) {
  const list = (dyOverviewAll[key]?.option_list || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  return { labels: list.map(item => item.date.slice(5)), values: list.map(item => Number(item.count || 0)) };
}
function dyOverview(periodKey) {
  if (periodKey === "d7") {
    const play = Number(dyOverviewAll.play?.current_count || 0);
    return {
      period: "07-06 至 07-12",
      cards: [
        { label: "投稿数", value: "2", unit: "", delta: null },
        { label: "播放量", value: cnNum(play).replace("万", ""), unit: play >= 10000 ? "万" : "", delta: null },
        { label: "点赞量", value: plain(dyOverviewAll.digg?.current_count), unit: "", delta: null },
        { label: "分享量", value: plain(dyOverviewAll.share?.current_count), unit: "", delta: null },
        { label: "评论量", value: plain(dyOverviewAll.comment?.current_count), unit: "", delta: null },
        { label: "净增粉丝", value: plain(dyOverviewAll.new_fans?.current_count), unit: "", delta: null },
        { label: "取关粉丝", value: plain(dyOverviewAll.cancel_fans?.current_count), unit: "", delta: null },
        { label: "总粉丝量", value: plain(dyFans.fans_cnt_sum), unit: "", delta: null }
      ],
      trend: { real: true, unitText: "播放量 · 07-06~07-12 · 真实后台数据", ...dyTrendFromOverview("play") }
    };
  }
  const totals = dyItemList.reduce((acc, item) => {
    const detail = dyItemDetails[item.title]?.overview || {};
    acc.play += Number(String(detail.playCount || "0").replace(/,/g, ""));
    acc.like += Number(String(detail.likeCount || "0").replace(/,/g, ""));
    acc.share += Number(String(detail.shareCount || "0").replace(/,/g, ""));
    acc.comment += Number(String(detail.commentCount || "0").replace(/,/g, ""));
    acc.fans += Number(String(detail.subscribeCount || "0").replace(/,/g, ""));
    return acc;
  }, { play: 0, like: 0, share: 0, comment: 0, fans: 0 });
  const daily = new Map();
  for (const detail of Object.values(dyItemDetails)) {
    const d = detail.overview.viewTrend.daily;
    (d.labels || []).forEach((label, idx) => {
      const short = String(label).slice(5, 10);
      daily.set(short, (daily.get(short) || 0) + Number(d.values?.[idx] || 0));
    });
  }
  const labels = [...daily.keys()].sort();
  return {
    period: "当前10篇作品累计 · 单篇真实后台汇总",
    cards: [
      { label: "投稿数", value: "10", unit: "", delta: null },
      { label: "播放量", value: cnNum(totals.play).replace("万", ""), unit: "万", delta: null },
      { label: "点赞量", value: plain(totals.like), unit: "", delta: null },
      { label: "分享量", value: plain(totals.share), unit: "", delta: null },
      { label: "评论量", value: plain(totals.comment), unit: "", delta: null },
      { label: "净增粉丝", value: plain(totals.fans), unit: "", delta: null },
      { label: "总粉丝量", value: plain(dyFans.fans_cnt_sum), unit: "", delta: null }
    ],
    trend: { real: true, unitText: "播放量 · 当前10篇作品按天汇总", labels, values: labels.map(label => daily.get(label)) }
  };
}

function dyAudience(periodKey) {
  const day = periodKey === "d7" ? "7" : "30";
  const summary = dyFans[`fans_data_${periodKey === "d7" ? "7" : "30"}`] || dyFans.fans_data_7 || {};
  const growth = dyTrendFromOverview("fans");
  const genderItems = countItems(dyFans.gender_distribution);
  const male = genderItems.find(item => item.label === "male")?.pct ?? 43;
  const female = genderItems.find(item => item.label === "female")?.pct ?? 57;
  return {
    note: `粉丝数据 · 真实后台 · 数据更新至 2026-07-13`,
    base: [
      { label: "总粉丝量", value: plain(dyFans.fans_cnt_sum), sub: "粉丝数据接口" },
      { label: `${day}日净增粉丝`, value: plain(summary.net_fans ?? dyOverviewAll.new_fans?.current_count), sub: "新增-取关" },
      { label: `${day}日取关`, value: plain(summary.cancel_fans ?? dyOverviewAll.cancel_fans?.current_count), sub: "取消关注" },
      { label: "主页访客粉丝", value: plain(summary.home_view_fans), sub: "粉丝页接口" }
    ],
    growth,
    portrait: {
      conclusion: "抖音粉丝以女性略高、24-40岁、重度活跃用户为主。",
      gender: { male, female },
      age: { items: countItems(dyFans.age_distribution) },
      city: { items: countItems(dyFans.city_distribution).slice(0, 10) },
      device: { items: countItems(dyFans.device_brand_distribution).slice(0, 8) },
      active: { items: countItems(dyFans.active_levels) }
    },
    interest: {
      conclusion: "粉丝兴趣来自抖音粉丝数据接口。",
      dist: { items: countItems(dyFans.fans_interest_distribution).slice(0, 10) }
    }
  };
}

function numDisplay(value) {
  if (typeof value === "number") return value;
  const text = String(value || "").replace(/,/g, "");
  const n = Number.parseFloat(text);
  if (!Number.isFinite(n)) return 0;
  if (text.includes("万")) return n * 10000;
  if (text.includes("亿")) return n * 100000000;
  return n;
}

function rankForXhs(items, period) {
  return {
    period,
    items: items.slice(0, 5).map((item, idx) => ({
      rank: idx + 1,
      title: item.title,
      date: item.date,
      stats: [
        { label: "阅读", value: item.plays },
        { label: "点赞", value: item.likes },
        { label: "评论", value: item.comments }
      ]
    }))
  };
}

function rankForDy(items, period) {
  return {
    period,
    items: items.slice(0, 5).map((item, idx) => ({
      rank: idx + 1,
      title: item.title,
      date: item.date,
      stats: [
        { label: "播放", value: item.plays },
        { label: "5秒完播", value: item.finishRate5s },
        { label: "涨粉", value: dyItemDetails[item.title]?.overview?.subscribeCount || "-" }
      ]
    }))
  };
}

const avg = key => fixed(dyItemList.reduce((total, item) => total + Number(item[key] || 0), 0) / dyItemList.length, 1);
const latestRefresh = {
  updatedAt: "2026-07-13",
  lastUpdate: "2026-07-14 01:55",
  playbook: {
    northStar: {
      title: "留存质量",
      sub: "",
      items: [
        {
          pf: "dy",
          label: "抖音条均5秒完播率",
          value: avg("finish5"),
          unit: "%",
          peer: null,
          peerLabel: null,
          evaluation: avg("finish5") >= 50 ? "良好，开头留人能力达标" : "需优化开头承接",
          advice: "继续把结论、冲突或视觉变化前置到前3-5秒；同时盯住2秒跳出率和平均播放时长，避免只有开头强但中段掉人。",
          references: [
            { label: "条均完整完播率", value: fixed(dyItemList.reduce((t, item) => t + Number(String(dyItemDetails[item.title]?.overview?.completionRate || 0)), 0) / dyItemList.length, 1), unit: "%" },
            { label: "条均2秒跳出率", value: avg("bounce2"), unit: "%" },
            { label: "条均播放时长", value: fixed(dyItemList.reduce((t, item) => t + Number(dyItemDetails[item.title]?.overview?.avgViewSecond || 0), 0) / dyItemList.length, 1), unit: "秒" }
          ]
        },
        {
          pf: "xhs",
          label: "小红书完播率",
          value: 9.1,
          unit: "%",
          peer: null,
          peerLabel: null,
          evaluation: "封面点击稳定，完播和观看时长需继续提升",
          advice: "账号判断看封面点击、观看时长和完播率组合。后续笔记要更早给结论，减少铺垫，把可自测/可复用的方法提前",
          references: [
            { label: "封面点击率", value: 13.6, unit: "%" },
            { label: "平均观看时长", value: 1.1, unit: "分钟" },
            { label: "观看数", value: 1.3, unit: "万" }
          ]
        }
      ]
    }
  },
  data: {
    tingzhairen: {
      playbook: {
        northStar: {
          dy: {
            label: "抖音条均5秒完播率",
            value: `${avg("finish5")}%`,
            eval: avg("finish5") >= 50 ? "良好" : "需优化开头承接",
            reference: `完整完播率均值 ${fixed(dyItemList.reduce((t, item) => t + Number(String(dyItemDetails[item.title]?.overview?.completionRate || 0)), 0) / dyItemList.length, 1)}%，2秒跳出率均值 ${avg("bounce2")}%`
          },
          xhs: {
            label: "小红书视频完播率",
            value: "9.1%",
            eval: "封面点击稳定，完播和观看时长需继续前置信息密度",
            reference: "封面点击率 13.6%，平均观看时长 1.1分钟，7日观看数 1.3万"
          }
        }
      },
      diagnosis: {
        xhs: {
          period: "07-06 至 07-12",
          percentileStale: false,
          note: "红线=你的数据，半径为「超过同类百分位」，标签为真实值",
          axes: [
            { label: "观看数", value: 95, percentile: 95, text: "1.3万 · 超过95%同类" },
            { label: "涨粉数", value: 99, percentile: 99, text: "270 · 超过99%同类" },
            { label: "主页访客", value: 96, percentile: 96, text: "607 · 超过96%同类" },
            { label: "发布数", value: 80, percentile: 80, text: "2 · 超过80%同类" },
            { label: "互动数", value: 96, percentile: 96, text: "802 · 超过96%同类" }
          ]
        }
      },
      overview: {
        xhs: { d7: xhsOverview("d7"), d30: xhsOverview("d30") },
        dy: { d7: dyOverview("d7"), d30: dyOverview("d30") }
      },
      source: {
        xhs: { d7: sourceAccount("d7"), d30: sourceAccount("d30") },
        dy: { d7: null, d30: null }
      },
      ranking: {
        xhs: {
          d7: rankForXhs(xhsItemList.slice().sort((a, b) => numDisplay(b.plays) - numDisplay(a.plays)), "07-06 至 07-12 · 真实后台"),
          d30: rankForXhs(xhsItemList.slice().sort((a, b) => numDisplay(b.plays) - numDisplay(a.plays)), "06-13 至 07-12 · 真实后台")
        },
        dy: {
          d7: rankForDy(dyItemList.slice(0, 5), "07-06 至 07-12 · 当前发布作品"),
          d30: rankForDy(dyItemList.slice().sort((a, b) => Number(String(dyItemDetails[b.title]?.overview?.playCount || "0").replace(/,/g, "")) - Number(String(dyItemDetails[a.title]?.overview?.playCount || "0").replace(/,/g, ""))), "当前10篇作品累计 · 单篇真实后台汇总")
        }
      },
      audience: {
        xhs: { d7: audienceXhs("d7"), d30: audienceXhs("d30") },
        dy: { d7: dyAudience("d7"), d30: dyAudience("d30") }
      },
      flowAnalysis: {
        xhs: {
          period: "单篇详情 · 数据更新至 2026-07-13",
          note: "小红书创作者中心官方接口",
          itemList: xhsItemList,
          itemDetails: xhsItemDetails
        },
        dy: {
          period: "单篇详情 · 数据更新至 2026-07-13",
          summary: {
            cards: [
              { label: "平均播放量", value: cnNum(dyItemList.reduce((t, item) => t + Number(String(dyItemDetails[item.title]?.overview?.playCount || "0").replace(/,/g, "")), 0) / dyItemList.length), unit: "" },
              { label: "平均5秒完播率", value: avg("finish5"), unit: "%" },
              { label: "平均2秒跳出率", value: avg("bounce2"), unit: "%" },
              { label: "平均播放时长", value: fixed(dyItemList.reduce((t, item) => t + Number(dyItemDetails[item.title]?.overview?.avgViewSecond || 0), 0) / dyItemList.length, 1), unit: "秒" }
            ]
          },
          itemList: dyItemList,
          itemDetails: dyItemDetails
        }
      }
    }
  }
};

const dataPath = path.join(root, "data.js");
let dataJs = fs.readFileSync(dataPath, "utf8");
const markerStart = "/* === DATA_REFRESH_2026_07_14_FULL_START === */";
const markerEnd = "/* === DATA_REFRESH_2026_07_14_FULL_END === */";
const block = `${markerStart}
const DATA_REFRESH_2026_07_14_FULL = ${JSON.stringify(latestRefresh, null, 2)};
(function applyDataRefresh(target, source) {
  Object.keys(source).forEach(function(key) {
    const value = source[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) target[key] = {};
      applyDataRefresh(target[key], value);
    } else {
      target[key] = value;
    }
  });
})(DASHBOARD_DATA, DATA_REFRESH_2026_07_14_FULL);
${markerEnd}`;
const oldBlockRe = /\/\* === DATA_REFRESH_2026_07_14_FULL_START === \*\/[\s\S]*?\/\* === DATA_REFRESH_2026_07_14_FULL_END === \*\//g;
dataJs = `${dataJs.replace(oldBlockRe, "").trimEnd()}\n${block}\n`;
fs.writeFileSync(dataPath, dataJs);

const ctx = { console };
vm.createContext(ctx);
vm.runInContext(`${dataJs}\nthis.__D = DASHBOARD_DATA;`, ctx);
console.log(JSON.stringify({
  updatedAt: ctx.__D.updatedAt,
  lastUpdate: ctx.__D.lastUpdate,
  xhsItems: ctx.__D.data.tingzhairen.flowAnalysis.xhs.itemList.length,
  dyItems: ctx.__D.data.tingzhairen.flowAnalysis.dy.itemList.length,
  xhsLatest: ctx.__D.data.tingzhairen.flowAnalysis.xhs.itemList[0].title,
  dyLatest: ctx.__D.data.tingzhairen.flowAnalysis.dy.itemList[0].title
}, null, 2));
