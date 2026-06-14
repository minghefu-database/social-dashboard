/* =====================================================================
 *  听宅人 · 数据复盘看板  —  数据层
 *  所有数据来自创作者中心真实截图。需要更新时只改这个文件即可。
 *
 *  字段说明:
 *    - value  : 真实数值(来自截图)
 *    - delta  : 环比(截图里有就填, 没有填 null -> 卡片不显示环比)
 *    - 标注 "estimated:true" 的序列(趋势折线/观看时段) 数值为按截图
 *      形状估算的近似值, 不是后台精确数字。拿到精确数字后替换即可。
 * ===================================================================== */

const DASHBOARD_DATA = {

  // 更新日期(显示在页头)
  updatedAt: "2026-06-10",

  // 左栏平台分组顺序: 小红书在上, 抖音在下
  platformOrder: ["xhs", "dy"],
  platformLabels: { xhs: "小红书", dy: "抖音" },

  // 账号列表。xhs/dy = 该平台是否有数据(无数据则左栏灰显, 点击提示暂无)
  accounts: [
    { id: "tingzhairen", name: "听宅人",     xhs: true,  dy: true  },
    { id: "lile_kepu",   name: "礼乐科普号", xhs: false, dy: false },
    { id: "lile_xiqu",   name: "礼乐戏曲号", xhs: false, dy: false },
  ],

  // 默认选中账号
  defaultAccount: "tingzhairen",

  // ===================================================================
  //  听宅人 的全部数据
  // ===================================================================
  data: {
    tingzhairen: {

      /* ---------------- 账号诊断(雷达图) ---------------- */
      diagnosis: {
        // 小红书: 截图只给"你的数据"绝对值 + "超过X%同类"百分位, 无同类绝对值。
        //         雷达半径用百分位, 标签显示真实值。
        xhs: {
          period: "06-03 至 06-09",
          axes: [
            { label: "观看数",   value: "9440", percentile: 99 },
            { label: "涨粉数",   value: "32",   percentile: 99 },
            { label: "主页访客", value: "355",  percentile: 99 },
            { label: "发布数",   value: "1",    percentile: 95 },
            { label: "互动数",   value: "239",  percentile: 97 },
          ],
        },
        // 抖音: 截图给"你的帐号 / 同类作者"两组绝对值, 画双线雷达
        dy: {
          period: "近 7 日",
          note: "部分数据次日更新",
          axes: [
            { label: "播放量",   mine: 2367, peer: 29,   mineText: "2367", peerText: "29" },
            { label: "完播率",   mine: 4.4,  peer: 23.8, mineText: "4.4%", peerText: "23.8%" },
            { label: "粉丝净增", mine: 20,   peer: 2,    mineText: "20",   peerText: "2" },
            { label: "投稿量",   mine: 1,    peer: 1,    mineText: "1",    peerText: "1" },
            { label: "互动率",   mine: 3.7,  peer: 4.8,  mineText: "3.7%", peerText: "4.8%" },
          ],
        },
      },

      /* ---------------- 账号概览 ---------------- */
      overview: {
        // 小红书: 6 个指标卡 + 趋势折线, 近7日 / 近30日 各一套
        xhs: {
          d7: {
            cards: [
              { label: "浏览量",       value: "6.3",   unit: "万",   delta: -40 },
              { label: "实际观看人数", value: "9440",  unit: "",     delta: -40 },
              { label: "封面点击率",   value: "14.8",  unit: "%",    delta: 0   },
              { label: "平均观看时长", value: "53.2",  unit: "秒",   delta: 17  },
              { label: "观看总时长",   value: "168.2", unit: "小时", delta: -43 },
              { label: "完播率",       value: "15.3",  unit: "%",    delta: -23 },
            ],
            trend: {
              estimated: true,
              unitText: "浏览量(次)",
              labels: ["06-03","06-04","06-05","06-06","06-07","06-08","06-09"],
              values: [12000, 8700, 9500, 8800, 8600, 9050, 7000],
            },
          },
          d30: {
            cards: [
              { label: "浏览量",       value: "43.9",   unit: "万",   delta: 8202 },
              { label: "实际观看人数", value: "6.2",    unit: "万",   delta: 6604 },
              { label: "封面点击率",   value: "14.2",   unit: "%",    delta: -8   },
              { label: "平均观看时长", value: "59.1",   unit: "秒",   delta: 3    },
              { label: "观看总时长",   value: "1075.2", unit: "小时", delta: 7980 },
              { label: "完播率",       value: "15.6",   unit: "%",    delta: 178  },
            ],
            trend: {
              estimated: true,
              unitText: "浏览量(万)",
              labels: ["05-11","05-13","05-15","05-17","05-19","05-21","05-23","05-25","05-27","05-29","05-31","06-02","06-04","06-06","06-08","06-09"],
              values: [0.1, 0.1, 0.15, 0.2, 0.2, 0.3, 7.2, 5.0, 2.3, 1.5, 1.1, 3.2, 1.3, 0.9, 0.95, 0.8],
            },
          },
        },

        // 抖音: 用自己的真实字段(经营数据-作品-投稿), 截图无环比 -> delta=null。
        //       7日与30日相同(仅 1 条作品)。无趋势折线。
        dy: {
          d7: {
            cards: [
              { label: "投稿数",   value: "1",    unit: "",  delta: null },
              { label: "播放量",   value: "2367", unit: "",  delta: null },
              { label: "完播率",   value: "4.45", unit: "%", delta: null },
              { label: "互动指数", value: "3.72", unit: "%", delta: null },
              { label: "点赞量",   value: "50",   unit: "",  delta: null },
              { label: "作品搜索", value: "959",  unit: "",  delta: null },
              { label: "弹幕量",   value: "0",    unit: "",  delta: null },
              { label: "封面点击", value: "100",  unit: "%", delta: null },
            ],
            trend: null,
          },
          d30: {
            cards: [
              { label: "投稿数",   value: "1",    unit: "",  delta: null },
              { label: "播放量",   value: "2367", unit: "",  delta: null },
              { label: "完播率",   value: "4.45", unit: "%", delta: null },
              { label: "互动指数", value: "3.72", unit: "%", delta: null },
              { label: "点赞量",   value: "50",   unit: "",  delta: null },
              { label: "作品搜索", value: "959",  unit: "",  delta: null },
              { label: "弹幕量",   value: "0",    unit: "",  delta: null },
              { label: "封面点击", value: "100",  unit: "%", delta: null },
            ],
            trend: null,
          },
        },
      },

      /* ---------------- 观看来源(条形图) ---------------- */
      source: {
        xhs: {
          d7: null,
          d30: {
            period: "05-11 至 06-09",
            items: [
              { label: "首页推荐", pct: 80 },
              { label: "搜索",     pct: 15 },
              { label: "个人主页", pct: 1  },
              { label: "其他来源", pct: 4  },
            ],
          },
        },
        dy: {
          d7: {
            extra: "平台扶持流量 1028 次播放",
            items: [
              { label: "推荐页",   pct: 94.3, delta: 5.1  },
              { label: "搜索",     pct: 3.8,  delta: -4.1 },
              { label: "个人主页", pct: 1.4,  delta: -1.1 },
              { label: "其他",     pct: 0.4,  delta: 0.1  },
            ],
          },
          d30: null,
        },
      },

      /* ---------------- 观看时段(柱状图) ---------------- */
      timeslot: {
        // 小红书: 真正 24 小时分布, 周期 05-11~06-09。逐根柱子按截图估算。
        xhs: {
          d7: null,
          d30: {
            estimated: true,
            period: "05-11 至 06-09",
            labels: ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
            values: [2950,1800,1150,750,700,900,1450,1750,2050,2200,2400,2350,2300,2350,2850,3150,3000,3250,3150,2800,2750,2400,5400,5000],
          },
        },
        // 抖音: 截图为 06-09 12:00 ~ 06-10 14:00 逐时趋势, 按要求做成柱状图。
        dy: {
          d7: {
            estimated: true,
            period: "06-09 12:00 ~ 06-10 14:00",
            labels: ["09日12时","13时","14时","15时","16时","17时","18时","19时","20时","21时","22时","23时","10日0时","1时","2时","3时","4时","5时","6时","7时","8时","9时","10时","11时","12时","13时","14时"],
            values: [110,260,500,760,900,950,600,360,300,260,240,200,180,150,130,110,140,170,230,330,310,950,880,820,760,750,300],
          },
          d30: null,
        },
      },

      /* ---------------- 作品排行榜 Top3 ---------------- */
      ranking: {
        xhs: {
          d7: null,
          d30: {
            period: "05-11 至 06-09",
            items: [
              { rank: 1, title: "劝你不要在家里随便放诵经音乐。", date: "2026-05-18 20:30", views: "+6万", likes: "+753", comments: "+176" },
              { rank: 2, title: "不要迷信了！寺庙的秘密被可视化了", date: "2026-06-07 21:06", views: "+500", likes: "+22",  comments: "+1"   },
              { rank: 3, title: "卧室东北角，调完就能睡好觉",       date: "2026-05-09 21:46", views: "+458", likes: "+9",   comments: "+2"   },
            ],
          },
        },
        // 抖音: 目前仅 1 条作品, 先留空(显示暂无)
        dy: { d7: null, d30: null },
      },

    },
  },
};
