/* =====================================================================
 *  听宅人 · 数据复盘看板  —  数据层
 *  所有数据来自创作者中心真实截图。需要更新时只改这个文件即可。
 *
 *  字段说明:
 *    - value  : 真实数值(来自截图)
 *    - delta  : 环比(截图里有就填, 没有填 null -> 卡片不显示环比)
 *    - 标注 "estimated:true" 的序列(趋势/分布/时段) 数值为按截图形状估算的
 *      近似值, 不是后台精确数字。页面会标注「形态依据截图估算」。
 *    - 小红书诊断的"百分位"除发布数(91%)外其余为估算(截图数字不清晰)。
 * ===================================================================== */

const DASHBOARD_DATA = {

  updatedAt: "2026-06-14",

  platformOrder: ["xhs", "dy"],
  platformLabels: { xhs: "小红书", dy: "抖音" },

  accounts: [
    { id: "tingzhairen", name: "听宅人",     xhs: true,  dy: true  },
    { id: "lile_kepu",   name: "礼乐科普号", xhs: false, dy: false },
    { id: "lile_xiqu",   name: "礼乐戏曲号", xhs: false, dy: false },
  ],

  defaultAccount: "tingzhairen",

  data: {
    tingzhairen: {

      /* ================= 账号诊断(雷达) ================= */
      diagnosis: {
        // 小红书诊断更新(06-07 至 06-13)。发布数百分位 91% 确定, 其余为估算。
        xhs: {
          period: "06-07 至 06-13",
          axes: [
            { label: "观看数",   value: "18.8万", percentile: 99 },
            { label: "涨粉数",   value: "3440",   percentile: 97 },
            { label: "主页访客", value: "3544",   percentile: 97 },
            { label: "发布数",   value: "2",      percentile: 91 },
            { label: "互动数",   value: "4437",   percentile: 96 },
          ],
        },
        // 抖音诊断(06-14, 近7日)。播放量超过同类作者 99.98%
        dy: {
          period: "近 7 日",
          note: "部分数据次日更新",
          axes: [
            { label: "播放量",   mine: 564000, peer: 9,    mineText: "56.4万", peerText: "9" },
            { label: "完播率",   mine: 4.3,    peer: 22.2, mineText: "4.3%",   peerText: "22.2%" },
            { label: "粉丝净增", mine: 5775,   peer: 1,    mineText: "5775",   peerText: "1" },
            { label: "投稿量",   mine: 2,      peer: 1,    mineText: "2",      peerText: "1" },
            { label: "互动率",   mine: 3.1,    peer: 7.9,  mineText: "3.1%",   peerText: "7.9%" },
          ],
        },
      },

      /* ================= 账号概览 ================= */
      overview: {
        // 小红书"观看数据"更新(06-14)
        xhs: {
          d7: {
            cards: [
              { label: "浏览量",       value: "30.2",   unit: "万",   delta: 203  },
              { label: "实际观看人数", value: "18.8",   unit: "万",   delta: 1192 },
              { label: "封面点击率",   value: "11.9",   unit: "%",    delta: -19  },
              { label: "平均观看时长", value: "48",     unit: "秒",   delta: 4    },
              { label: "观看总时长",   value: "2948.3", unit: "小时", delta: 981  },
              { label: "完播率",       value: "6.1",    unit: "%",    delta: null },
            ],
            trend: { estimated:true, unitText:"浏览量(万) · 06-07~06-13",
              labels:["06-07","06-08","06-09","06-10","06-11","06-12","06-13"],
              values:[0.3,0.5,1.2,3,8,15.5,13] },
          },
          d30: {
            cards: [
              { label: "浏览量",       value: "71.6",   unit: "万",   delta: 10413 },
              { label: "实际观看人数", value: "24.6",   unit: "万",   delta: 22292 },
              { label: "封面点击率",   value: "13.6",   unit: "%",    delta: -6    },
              { label: "平均观看时长", value: "53.4",   unit: "秒",   delta: -15   },
              { label: "观看总时长",   value: "3956.4", unit: "小时", delta: 24714 },
              { label: "完播率",       value: "6.1",    unit: "%",    delta: -49   },
            ],
            trend: { estimated:true, unitText:"浏览量(万) · 05-15~06-13",
              labels:["05-15","05-17","05-19","05-21","05-23","05-25","05-27","05-29","05-31","06-02","06-04","06-06","06-08","06-10","06-12","06-13"],
              values:[0.2,0.5,1,4,2,1,0.6,0.5,0.5,0.6,0.7,1,2.5,7,15.5,13] },
          },
        },
        // 抖音经营数据(06-14)。7日与30日数值相同。无明确趋势折线。
        dy: {
          d7: {
            cards: [
              { label: "投稿数",   value: "2",     unit: "",  delta: null },
              { label: "播放量",   value: "72.1",  unit: "万", delta: null },
              { label: "完播率",   value: "4.33",  unit: "%", delta: null },
              { label: "互动指数", value: "3.09",  unit: "%", delta: null },
              { label: "点赞量",   value: "1.2",   unit: "万", delta: null },
              { label: "作品搜索", value: "1.6",   unit: "万", delta: null },
              { label: "弹幕量",   value: "5",     unit: "",  delta: null },
              { label: "封面点击", value: "100",   unit: "%", delta: null },
            ],
            trend: null,
          },
          d30: {
            cards: [
              { label: "投稿数",   value: "2",     unit: "",  delta: null },
              { label: "播放量",   value: "72.1",  unit: "万", delta: null },
              { label: "完播率",   value: "4.33",  unit: "%", delta: null },
              { label: "互动指数", value: "3.09",  unit: "%", delta: null },
              { label: "点赞量",   value: "1.2",   unit: "万", delta: null },
              { label: "作品搜索", value: "1.6",   unit: "万", delta: null },
              { label: "弹幕量",   value: "5",     unit: "",  delta: null },
              { label: "封面点击", value: "100",   unit: "%", delta: null },
            ],
            trend: null,
          },
        },
      },

      /* ================= 观看来源(条形) ================= */
      source: {
        xhs: {
          d7: { period:"06-07 至 06-13", items:[
            { label:"视频推荐", pct:89 }, { label:"首页推荐", pct:4 },
            { label:"搜索", pct:2 }, { label:"个人主页", pct:2 }, { label:"其他来源", pct:3 } ] },
          d30: { period:"05-15 至 06-13", items:[
            { label:"视频推荐", pct:68 }, { label:"首页推荐", pct:23 },
            { label:"搜索", pct:4 }, { label:"个人主页", pct:1 }, { label:"其他来源", pct:4 } ] },
        },
        dy: {
          d7: { extra:"平台扶持流量 1028 次播放", items:[
            { label:"推荐页", pct:94.3, delta:5.1 }, { label:"搜索", pct:3.8, delta:-4.1 },
            { label:"个人主页", pct:1.4, delta:-1.1 }, { label:"其他", pct:0.4, delta:0.1 } ] },
          d30: null,
        },
      },

      /* ================= 观看时段(柱状) ================= */
      timeslot: {
        xhs: {
          d7: { estimated:true, period:"06-07 至 06-13",
            labels:["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
            values:[3000,1900,1200,800,700,900,1500,1900,2300,2600,2800,2750,2700,2750,3300,3700,3500,3800,3700,3300,3200,5000,23000,17000] },
          d30: { estimated:true, period:"05-15 至 06-13",
            labels:["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
            values:[4000,2500,1600,1100,1000,1300,2000,2500,3000,3400,3700,3600,3500,3600,4300,4800,4600,5000,4800,4300,4200,6500,30000,22000] },
        },
        dy: {
          d7: { estimated:true, period:"06-09 12:00 ~ 06-10 14:00",
            labels:["09日12时","13时","14时","15时","16时","17时","18时","19时","20时","21时","22时","23时","10日0时","1时","2时","3时","4时","5时","6时","7时","8时","9时","10时","11时","12时","13时","14时"],
            values:[110,260,500,760,900,950,600,360,300,260,240,200,180,150,130,110,140,170,230,330,310,950,880,820,760,750,300] },
          d30: null,
        },
      },

      /* ================= 作品排行榜(账号概览内) ================= */
      ranking: {
        // 小红书"新增观看最多"更新
        xhs: {
          d7: { period:"06-07 至 06-13", items:[
            { rank:1, title:"让你家拥有一个S型身材的家居布局", date:"2026-06-11 12:02",
              stats:[{label:"观看",value:"+17.7万"},{label:"点赞",value:"+2489"},{label:"评论",value:"+194"}] },
            { rank:2, title:"劝你不要在家里随便放诵经音乐。", date:"2026-05-18 20:30",
              stats:[{label:"观看",value:"+6599"},{label:"点赞",value:"+81"},{label:"评论",value:"+19"}] },
            { rank:3, title:"不要迷信了！寺庙的秘密被可视化了", date:"2026-06-07 21:06",
              stats:[{label:"观看",value:"+1542"},{label:"点赞",value:"+49"},{label:"评论",value:"+1"}] },
          ] },
          d30: { period:"05-15 至 06-13", items:[
            { rank:1, title:"让你家拥有一个S型身材的家居布局", date:"2026-06-11 12:02",
              stats:[{label:"观看",value:"+17.7万"},{label:"点赞",value:"+2489"},{label:"评论",value:"+194"}] },
            { rank:2, title:"劝你不要在家里随便放诵经音乐。", date:"2026-05-18 20:30",
              stats:[{label:"观看",value:"+6.3万"},{label:"点赞",value:"+798"},{label:"评论",value:"+181"}] },
            { rank:3, title:"不要迷信了！寺庙的秘密被可视化了", date:"2026-06-07 21:06",
              stats:[{label:"观看",value:"+1542"},{label:"点赞",value:"+49"},{label:"评论",value:"+1"}] },
          ] },
        },
        // 抖音(2 条公开作品, 第3条私密未录入)
        dy: {
          d7: { period:"近 7 日", items:[
            { rank:1, title:"让你家拥有一个S型身材的家居布局", date:"2026-06-11 11:52",
              stats:[{label:"播放",value:"74.2万"},{label:"点赞",value:"1.2万"},{label:"封面点击率",value:"32.06%"}] },
            { rank:2, title:"不要迷信了！寺庙的秘密被可视化了", date:"2026-06-09 12:10",
              stats:[{label:"播放",value:"2.2万"},{label:"点赞",value:"444"},{label:"封面点击率",value:"100%"}] },
          ] },
          d30: { period:"近 30 日", items:[
            { rank:1, title:"让你家拥有一个S型身材的家居布局", date:"2026-06-11 11:52",
              stats:[{label:"播放",value:"74.2万"},{label:"点赞",value:"1.2万"},{label:"封面点击率",value:"32.06%"}] },
            { rank:2, title:"不要迷信了！寺庙的秘密被可视化了", date:"2026-06-09 12:10",
              stats:[{label:"播放",value:"2.2万"},{label:"点赞",value:"444"},{label:"封面点击率",value:"100%"}] },
          ] },
        },
      },

      /* ================= 作品分析(tab) ================= */
      works: {
        xhs: null, // 小红书本次未提供作品分析数据
        dy: {
          period: "近 90 天 · 投稿",
          note: "第 3 条为私密作品, 数据隐藏未录入",
          items: [
            { title:"让你家拥有一个S型身材的家居布局", tags:"#家居布局 #空间布局 #国学智慧 #明和符",
              date:"2026-06-11 11:52", plays:"74.2万", avgDur:"35秒", ctr:"32.06%", likes:"1.2万", reward:"20万流量激励" },
            { title:"不要迷信了！寺庙的秘密被可视化了", tags:"#空间秩序 #寺庙 #礼乐 #听宅人",
              date:"2026-06-09 12:10", plays:"2.2万", avgDur:"32秒", ctr:"100%", likes:"444", reward:"7214 流量激励" },
          ],
        },
      },

      /* ================= 观众数据(tab) ================= */
      audience: {
        // 小红书"粉丝数据"(近30日为主, 统计周期 05-13 至 06-12)
        xhs: {
          base: [
            { label:"总粉丝",        value:"3839", sub:"环比 +5898.4%" },
            { label:"新增粉丝",      value:"2692", sub:"环比 +4979.3%" },
            { label:"流失粉丝",      value:"91",   sub:"" },
            { label:"活跃粉丝占比",  value:"63%",  sub:"环比 -14.1%" },
            { label:"日均观看粉丝",  value:"94",   sub:"环比 +4600%" },
            { label:"日均互动粉丝",  value:"23",   sub:"环比 +2200%" },
          ],
          growth: { estimated:true,
            labels:["05-13","05-16","05-19","05-22","05-25","05-28","05-31","06-03","06-06","06-09","06-12"],
            values:[10,20,40,80,120,180,250,400,700,1800,3839] },
          followSource: [
            { label:"视频推荐", pct:78.1 }, { label:"首页推荐", pct:10.9 },
            { label:"其他来源", pct:9.3 }, { label:"搜索", pct:0.9 }, { label:"个人主页", pct:0.9 },
          ],
          portrait: {
            gender: { male:34, female:66 },
            age: { estimated:true, items:[
              {label:"<18",pct:5},{label:"18-24",pct:10},{label:"25-34",pct:40},{label:"35-44",pct:30},{label:">44",pct:15} ] },
            city: { estimated:true, items:[
              {label:"北京",pct:8},{label:"上海",pct:5.5},{label:"广州",pct:5},{label:"深圳",pct:4.5},{label:"成都",pct:4},{label:"杭州",pct:3.5},{label:"青岛",pct:3},{label:"西安",pct:2.5} ] },
          },
        },
        // 抖音"粉丝分析"
        dy: {
          base: [
            { label:"总粉丝",       value:"7272", sub:"近7日 0%" },
            { label:"30日净增粉丝", value:"7272", sub:"7日净增 7271" },
            { label:"30日取关粉丝", value:"259",  sub:"7日取关 259" },
            { label:"30日回访粉丝", value:"2278", sub:"7日回访 2278" },
          ],
          growth: { estimated:true,
            labels:["06-09","06-10","06-11","06-12","06-13"],
            values:[50,100,1900,5200,7272] },
          followSource: [
            { label:"视频推荐", pct:79.6 }, { label:"其他", pct:8.7 },
            { label:"我的主页", pct:7.7 }, { label:"视频详情页", pct:3.9 }, { label:"搜索", pct:0.1 },
          ],
          topFans: [
            { name:"张复禄", idx:10 }, { name:"啦啦啦啦啦", idx:8 }, { name:"Vivian黄熙", idx:8 },
            { name:"SuperLL", idx:8 }, { name:"PEUGEOT·", idx:8 },
          ],
          portrait: {
            conclusion: "近期广东粉丝群体占比较大；女性、31-40 岁、重度活跃粉丝为主",
            gender: { male:29, female:71 },
            age: { estimated:true, items:[
              {label:"<23",pct:6},{label:"24-30",pct:32},{label:"31-40",pct:42},{label:"41-50",pct:12},{label:">50",pct:8} ] },
            city: { estimated:true, items:[
              {label:"广东",pct:42},{label:"山东",pct:12},{label:"江苏",pct:11},{label:"浙江",pct:10},{label:"四川",pct:9},{label:"河南",pct:8},{label:"河北",pct:8} ] },
            device: { estimated:true, items:[
              {label:"苹果",pct:45},{label:"华为",pct:18},{label:"小米",pct:12},{label:"OPPO",pct:10},{label:"荣耀",pct:7},{label:"VIVO",pct:5},{label:"红米",pct:3} ] },
            active: { items:[
              {label:"低活",pct:2},{label:"轻度",pct:1},{label:"中度",pct:1},{label:"重度",pct:96} ] },
          },
          interest: {
            conclusion: "近期全部粉丝关注随拍最多",
            dist: { estimated:true, items:[
              {label:"随拍",pct:40},{label:"美食",pct:15},{label:"亲子",pct:13},{label:"社会",pct:12},{label:"动物",pct:8},{label:"时尚",pct:7},{label:"体育",pct:5} ] },
            words: [
              { word:"抖音短剧新番计划", heat:46 }, { word:"精彩短剧热播中", heat:null },
              { word:"先婚后爱", heat:null }, { word:"明和符", heat:null },
            ],
          },
        },
      },

      /* ================= 收入数据(tab) ================= */
      revenue: {
        xhs: null, // 小红书本次未提供收入数据
        dy: {
          cards: [
            { label:"总收入",   value:"0.00", unit:"元", sub:"" },
            { label:"星图收入", value:"0.00", unit:"元", sub:"参与 0 · 完成 0" },
            { label:"电商收入", value:"—",    unit:"",   sub:"金额 0 · 订单 0" },
          ],
        },
      },

    },
  },
};
