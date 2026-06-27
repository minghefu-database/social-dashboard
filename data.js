/* =====================================================================
 *  听宅人 · 数据复盘看板  —  数据层
 *  所有数据来自创作者中心真实截图。需要更新时只改这个文件即可。
 *  数据来源: HAR抓包 2026-06-27
 *    小红书 note_detail_new + account/base (数据截至 06-25)
 *    抖音 overview/dashboard + fans/summary (数据截至 06-26)
 *
 *  字段说明:
 *    - value  : 真实数值(来自截图)
 *    - delta  : 环比(截图里有就填, 没有填 null -> 卡片不显示环比)
 *    - 标注 "estimated:true" 的序列(趋势/分布/时段) 数值为按截图形状估算的
 *      近似值, 不是后台精确数字。页面会标注「形态依据截图估算」。
 *    - 小红书诊断的"百分位"除发布数(91%)外其余为估算(截图数字不清晰)。
 * ===================================================================== */

const DASHBOARD_DATA = {

  updatedAt: "2026-06-25",
  lastUpdate: "2026-06-27 19:00",

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
        // 小红书诊断数据来自创作者中心后台API(06-19 至 06-25)
        xhs: {
          period: "近 7 日 · 真实后台(06-19~06-25)",
          percentileStale: false,
          axes: [
            { label: "观看数",   value: "5.7万",  percentile: 97 },
            { label: "涨粉数",   value: "2322",   percentile: 98 },
            { label: "主页访客", value: "3940",   percentile: 96 },
            { label: "发布数",   value: "2",      percentile: 91 },
            { label: "互动数",   value: "4827",   percentile: 97 },
          ],
        },
        // 抖音诊断取自 author_diagnosis API (06-20~06-26)
        // OwnValue/SimilarValue, AuthorRank归一化到百分位
        dy: {
          period: "近 7 日 (06-20~06-26)",
          note: "真实后台数据 · 06-26",
          axes: [
            { label: "播放量",   mine: 244869, peer: 35,   mineText: "24.49万", peerText: "35" },
            { label: "完播率",   mine: 3.7,    peer: 16.7, mineText: "3.7%",    peerText: "16.7%" },
            { label: "粉丝净增", mine: 2339,   peer: 437,  mineText: "2339",    peerText: "437" },
            { label: "投稿量",   mine: 2,      peer: 2,    mineText: "2",       peerText: "2" },
            { label: "互动率",   mine: 4.0,    peer: 6.6,  mineText: "4.0%",    peerText: "6.6%" },
          ],
        },
      },

      /* ================= 账号概览 ================= */
      overview: {
        // 小红书观看数据来自 account/base API (近7日 06-19~06-25)
        xhs: {
          d7: {
            cards: [
              { label: "浏览量",       value: "5.74",  unit: "万",   delta: -70  },
              { label: "封面点击率",   value: "14.9",  unit: "%",    delta: 19   },
              { label: "平均观看时长", value: "71.2",  unit: "秒",   delta: 60   },
              { label: "观看总时长",   value: "1.3",   unit: "小时", delta: null },
              { label: "完播率",       value: "12.4",  unit: "%",    delta: null },
              { label: "笔记涨粉",     value: "2322",  unit: "",     delta: 14   },
            ],
            trend: { real:true, unitText:"浏览量(万) · 06-19~06-25 · 真实后台数据",
              labels:["06-19","06-20","06-21","06-22","06-23","06-24","06-25"],
              values:[0.17,0.16,0.88,2.18,1.24,0.73,0.39] },
          },
          d30: {
            cards: [
              { label: "浏览量",       value: "34.34", unit: "万",   delta: null },
              { label: "封面点击率",   value: "13.9",  unit: "%",    delta: null },
              { label: "平均观看时长", value: "52.9",  unit: "秒",   delta: null },
              { label: "观看总时长",   value: "5.7",   unit: "小时", delta: null },
              { label: "完播率",       value: "7",     unit: "%",    delta: null },
              { label: "笔记涨粉",     value: "6985",  unit: "",     delta: null },
            ],
            // 30日每日浏览量趋势(05-27 至 06-25)
            trend: { real:true, unitText:"浏览量(万) · 05-27~06-25 · 真实后台数据",
              labels:["05-27","05-28","05-29","05-30","05-31","06-01","06-02","06-03","06-04","06-05","06-06","06-07","06-08","06-09","06-10","06-11","06-12","06-13","06-14","06-15","06-16","06-17","06-18","06-19","06-20","06-21","06-22","06-23","06-24","06-25"],
              values:[0.14,0.13,0.19,0.45,0.26,0.19,0.17,0.13,0.13,0.12,0.13,0.14,0.12,0.09,3.59,9.46,5.29,4.42,1.42,0.85,0.54,0.32,0.30,0.17,0.16,0.88,2.18,1.24,0.73,0.39] },
          },
        },
        // 抖音经营数据来自 overview/dashboard (近7日 06-20~06-26)
        dy: {
          d7: {
            cards: [
              { label: "投稿数",   value: "2",      unit: "",  delta: null },
              { label: "播放量",   value: "24.49",  unit: "万", delta: null },
              { label: "完播率",   value: "3.69",   unit: "%", delta: null },
              { label: "互动率",   value: "4.03",   unit: "%", delta: null },
              { label: "点赞量",   value: "5374",   unit: "",  delta: null },
              { label: "作品搜索", value: "3.62",   unit: "万", delta: null },
              { label: "弹幕量",   value: "5",      unit: "",  delta: null },
              { label: "封面点击", value: "92",     unit: "%", delta: null },
            ],
            // 7日每日播放量趋势
            trend: { real:true, unitText:"播放量 · 06-20~06-26 · 真实后台数据",
              labels:["06-20","06-21","06-22","06-23","06-24","06-25","06-26"],
              values:[90542,77089,21830,20070,19007,7572,8759] },
          },
          d30: {
            cards: [
              { label: "投稿数",   value: "7",      unit: "",  delta: null },
              { label: "播放量",   value: "157.07", unit: "万", delta: null },
              { label: "完播率",   value: "3.69",   unit: "%", delta: null },
              { label: "互动率",   value: "4.03",   unit: "%", delta: null },
              { label: "点赞量",   value: "27307",  unit: "",  delta: null },
              { label: "作品搜索", value: "3.62",   unit: "万", delta: null },
              { label: "弹幕量",   value: "25",     unit: "",  delta: null },
              { label: "封面点击", value: "92",     unit: "%", delta: null },
            ],
            // 真实每日播放明细(来自 dashboard 30d API, 06-09~06-26)
            trend: { real:true, unitText:"播放量 · 06-09~06-26 · 真实后台数据",
              labels:["06-09","06-10","06-11","06-12","06-13","06-14","06-15","06-16","06-17","06-18","06-19","06-20","06-21","06-22","06-23","06-24","06-25","06-26"],
              values:[0.24,0.78,27.34,28.06,15.66,12.30,8.80,11.96,10.40,12.73,4.33,9.05,7.71,2.18,2.01,1.90,0.76,0.88] },
          },
        },
      },

      /* ================= 观看来源(条形) ================= */
      source: {
        xhs: {
          d7: { period:"近 7 日(06-19~06-25) · 真实后台",
            items:[
            { label:"首页推荐", pct:42 }, { label:"视频推荐", pct:35 },
            { label:"个人主页", pct:12 }, { label:"搜索", pct:6 }, { label:"其他来源", pct:5 } ] },
          d30: { period:"05-27 至 06-25", items:[
            { label:"视频推荐", pct:75 }, { label:"首页推荐", pct:14 },
            { label:"搜索", pct:4 }, { label:"个人主页", pct:3 }, { label:"其他来源", pct:4 } ] },
        },
        dy: {
          d7: { extra:"近7日来自overview/all", items:[
            { label:"推荐页", pct:94.3 }, { label:"搜索", pct:3.8 },
            { label:"个人主页", pct:1.4 }, { label:"其他", pct:0.4 } ] },
          d30: null,
        },
      },

      /* ================= 观看时段(柱状) ================= */
      timeslot: {
        xhs: {
          d7: { period:"近 7 日(06-19~06-25) · 真实后台",
            labels:["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
            values:[3557,2494,1562,1046,817,1221,2483,3843,3991,3355,2732,1285,1706,1767,1663,2042,1929,1756,1521,1764,2115,2800,4565,5413] },
          d30: { period:"05-27 至 06-25 · 真实后台",
            labels:["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
            values:[29075,19680,12230,7541,5710,6215,15025,21397,25722,23435,22887,12106,15041,14394,15360,16143,16801,14922,13186,12269,14139,21378,35288,47833] },
        },
        dy: {
          d7: { stale:true, estimated:true, period:"06-09 12:00 ~ 06-10 14:00",
            labels:["09日12时","13时","14时","15时","16时","17时","18时","19时","20时","21时","22时","23时","10日0时","1时","2时","3时","4时","5时","6时","7时","8时","9时","10时","11时","12时","13时","14时"],
            values:[110,260,500,760,900,950,600,360,300,260,240,200,180,150,130,110,140,170,230,330,310,950,880,820,760,750,300] },
          d30: null,
        },
      },

      /* ================= 作品排行榜(账号概览内) ================= */
      ranking: {
        // 小红书\"新增观看最多\"(来自 note/analyze/list API)
        xhs: {
          d7: { period:"06-19 至 06-25", items:[
            { rank:1, title:"家居布局干货｜可能影响女性的格局", date:"2026-06-22 00:01",
              stats:[{label:"观看",value:"+3.7万"},{label:"点赞",value:"+1800"},{label:"评论",value:"+164"}] },
            { rank:2, title:"让你家拥有一个S型身材的家居布局", date:"2026-06-11 12:02",
              stats:[{label:"观看",value:"+25.6万"},{label:"点赞",value:"+3543"},{label:"评论",value:"+227"}] },
            { rank:3, title:"容易提升成绩的位置，打造好的学习环境", date:"2026-06-15 19:14",
              stats:[{label:"观看",value:"+3809"},{label:"点赞",value:"+138"},{label:"评论",value:"+19"}] },
          ] },
          d30: { period:"05-27 至 06-25", items:[
            { rank:1, title:"让你家拥有一个S型身材的家居布局", date:"2026-06-11 12:02",
              stats:[{label:"观看",value:"+25.6万"},{label:"点赞",value:"+3543"},{label:"评论",value:"+227"}] },
            { rank:2, title:"家居布局干货｜可能影响女性的格局", date:"2026-06-22 00:01",
              stats:[{label:"观看",value:"+3.7万"},{label:"点赞",value:"+1800"},{label:"评论",value:"+164"}] },
            { rank:3, title:"现代家中男尊女卑的实际理解, 很实用!", date:"2026-06-17 15:19",
              stats:[{label:"观看",value:"+2229"},{label:"点赞",value:"+67"},{label:"评论",value:"+14"}] },
          ] },
        },
        // 抖音(7条作品, 含私密/0播放忽略)
        dy: {
          d7: { period:"近 7 日 · 真实后台", items:[
            { rank:1, title:"现代家中男尊女卑的实际理解, 很实用!", date:"2026-06-18 12:06",
              stats:[{label:"播放",value:"17.5万"},{label:"点赞",value:"3828"},{label:"评论",value:"59"}] },
            { rank:2, title:"不利家中女性的格局, 三招解决！", date:"2026-06-22 00:00",
              stats:[{label:"播放",value:"3.3万"},{label:"点赞",value:"859"},{label:"评论",value:"53"}] },
            { rank:3, title:"酒店选房避雷指南, 国歌护体，睡稳心安。", date:"2026-06-25 18:37",
              stats:[{label:"播放",value:"4448"},{label:"点赞",value:"115"},{label:"评论",value:"7"}] },
          ] },
          d30: { period:"近 30 日 · 真实后台", items:[
            { rank:1, title:"让你家拥有一个S型身材的家居布局", date:"2026-06-11 11:52",
              stats:[{label:"播放",value:"132.7万"},{label:"点赞",value:"2.2万"},{label:"评论",value:"868"}] },
            { rank:2, title:"现代家中男尊女卑的实际理解, 很实用!", date:"2026-06-18 12:06",
              stats:[{label:"播放",value:"17.5万"},{label:"点赞",value:"3828"},{label:"评论",value:"59"}] },
            { rank:3, title:"不利家中女性的格局, 三招解决！", date:"2026-06-22 00:00",
              stats:[{label:"播放",value:"3.3万"},{label:"点赞",value:"859"},{label:"评论",value:"53"}] },
          ] },
        },
      },

      /* ================= 作品分析(tab) ================= */
      works: {
        xhs: {
          period: "笔记数据 · 真实后台 06-25",
          note: "小红书每篇带封面点击率",
          items: [
            { title:"让你家拥有一个S型身材的家居布局", date:"2026-06-11 12:02", plays:"25.6万", avgDur:"94秒", ctr:"10.2%",  likes:"3543" },
            { title:"家居布局干货｜可能影响女性的格局", date:"2026-06-22 00:01", plays:"3.7万",  avgDur:"116秒", ctr:"14.5%", likes:"1800", reward:"新爆款" },
            { title:"现代家中男尊女卑的实际理解, 很实用!", date:"2026-06-17 15:19", plays:"2229",  avgDur:"137秒", ctr:"14.6%", likes:"67" },
            { title:"容易提升成绩的位置，打造好的学习环境", date:"2026-06-15 19:14", plays:"3809",  avgDur:"157秒", ctr:"16.5%", likes:"138" },
            { title:"不要迷信了！寺庙的秘密被可视化了", date:"2026-06-09 12:10", plays:"2857",   avgDur:"106秒", ctr:"12.8%", likes:"79" },
            { title:"酒店选房避雷指南, 国歌护体，睡稳心安。", date:"2026-06-25 18:37", plays:"473", avgDur:"82秒", ctr:"9.7%",  likes:"11" },
            { title:"为什么有些地方会让你后背发凉", date:"2026-06-07 21:06", plays:"1128",   avgDur:"33秒", ctr:"10.2%", likes:"16" },
          ],
        },
        dy: {
          period: "投稿 · 真实后台数据 06-26",
          note: "封面点击率口径不在本接口，改用「5秒完播率」(留存关键指标)",
          items: [
            { title:"让你家拥有一个S型身材的家居布局", tags:"#家居布局 #空间布局 #国学智慧 #明和符 #听宅人",
              date:"2026-06-11 11:52", plays:"132.7万", avgDur:"35秒", finishRate:"54.5%", likes:"2.2万", reward:"爆款" },
            { title:"现代家中男尊女卑的实际理解, 很实用!", tags:"#夫妻感情 #家居布局 #空间布局 #明和符 #听宅人",
              date:"2026-06-18 12:06", plays:"17.5万", avgDur:"25秒", finishRate:"44.4%", likes:"3828" },
            { title:"不要迷信了！寺庙的秘密被可视化了", tags:"#空间秩序 #寺庙 #礼乐 #听宅人 #明和符",
              date:"2026-06-09 12:10", plays:"2.9万", avgDur:"33秒", finishRate:"45.3%", likes:"575" },
            { title:"不利家中女性的格局, 三招解决！", tags:"#女性运势 #家居布局 #空间布局 #明和符 #听宅人",
              date:"2026-06-22 00:00", plays:"3.3万", avgDur:"25秒", finishRate:"47.1%", likes:"859" },
            { title:"容易提升成绩的位置，打造好的学习环境", tags:"#高考 #空间布局 #家居布局 #明和符 #听宅人",
              date:"2026-06-15 19:13", plays:"7655", avgDur:"42秒", finishRate:"44.5%", likes:"186" },
            { title:"酒店选房避雷指南, 国歌护体，睡稳心安。", tags:"#酒店避坑 #科学睡眠 #国学智慧 #明和符 #听宅人",
              date:"2026-06-25 18:37", plays:"4450", avgDur:"26秒", finishRate:"42.9%", likes:"115" },
          ],
        },
      },

      /* ================= 观众数据(tab) ================= */
      audience: {
        // 小红书粉丝数据(06-25)
        xhs: {
          base: [
            { label:"总粉丝",       value:"7127", sub:"获赞 6249" },
            { label:"30日净增粉丝", value:"6938", sub:"7日净增 2294" },
            { label:"30日流失粉丝", value:"226",  sub:"7日流失 49" },
            { label:"7日涨粉",      value:"2322", sub:"14日涨粉 4711" },
            { label:"7日点赞",      value:"2174", sub:"" },
            { label:"7日收藏",      value:"2209", sub:"" },
          ],
          growth: { real:true,
            labels:["05-27","05-30","06-02","06-05","06-08","06-11","06-14","06-17","06-19","06-20","06-21","06-22","06-23","06-24","06-25"],
            values:[130,137,140,141,142,147,3586,4716,4784,4800,5099,6035,6604,6913,7063] },
          followSource: [
            { label:"视频推荐", pct:60 }, { label:"首页推荐", pct:29 },
            { label:"其他来源", pct:8 }, { label:"个人主页", pct:0 }, { label:"搜索", pct:0 },
          ],
          portrait: {
            gender: { male:24, female:76 },
            age: { items:[
              {label:"<18",pct:0},{label:"18-24",pct:8},{label:"25-34",pct:35},{label:"35-44",pct:38},{label:">44",pct:16} ] },
            city: { items:[
              {label:"北京",pct:7},{label:"上海",pct:6},{label:"广州",pct:4},{label:"深圳",pct:3},{label:"成都",pct:2},{label:"天津",pct:2},{label:"杭州",pct:2} ] },
          },
        },
        // 抖音粉丝分析(06-26)
        dy: {
          base: [
            { label:"总粉丝",       value:"15320", sub:"近7日 +2339" },
            { label:"30日净增粉丝", value:"15267", sub:"7日净增 2339" },
            { label:"30日取关粉丝", value:"784",   sub:"7日取关 213" },
            { label:"7日回访粉丝",  value:"1461",  sub:"30日回访 10231" },
          ],
          growth: { estimated:true,
            labels:["06-09","06-10","06-11","06-12","06-13","06-14","06-15","06-16","06-17","06-18","06-19","06-20","06-21","06-22","06-23","06-24","06-25","06-26"],
            values:[20,47,2759,5776,7272,8348,9174,10441,11605,12606,12933,13651,14457,14613,14828,15001,15112,15272] },
          followSource: [
            { label:"视频推荐", pct:79.6 }, { label:"其他", pct:8.7 },
            { label:"我的主页", pct:7.7 }, { label:"视频详情页", pct:3.9 }, { label:"搜索", pct:0.1 },
          ],
          topFans: [
            { name:"张复禄", idx:10 }, { name:"啦啦啦啦啦", idx:8 }, { name:"Vivian黄熙", idx:8 },
            { name:"SuperLL", idx:8 }, { name:"PEUGEOT·", idx:8 },
          ],
          portrait: {
            conclusion: "真实画像(06-26)：女性占 58%、24-40 岁为主、广东居首、重度活跃粉丝 95%",
            gender: { male:42, female:58 },
            age: { items:[
              {label:"<23",pct:14},{label:"24-30",pct:35},{label:"31-40",pct:43},{label:"41-50",pct:6},{label:">50",pct:2} ] },
            city: { items:[
              {label:"广东",pct:12},{label:"山东",pct:9},{label:"江苏",pct:6},{label:"河南",pct:6},{label:"河北",pct:6},{label:"四川",pct:5},{label:"浙江",pct:5},{label:"北京",pct:5} ] },
            device: { estimated:true, items:[
              {label:"苹果",pct:43},{label:"华为",pct:24},{label:"小米",pct:6},{label:"荣耀",pct:6},{label:"VIVO",pct:6},{label:"OPPO",pct:5},{label:"红米",pct:3} ] },
            active: { items:[
              {label:"低活",pct:2},{label:"轻度",pct:1},{label:"中度",pct:2},{label:"重度",pct:95} ] },
          },
          interest: {
            conclusion: "近期全部粉丝关注随拍最多",
            dist: { estimated:true, items:[
              {label:"随拍",pct:37},{label:"美食",pct:12},{label:"亲子",pct:11},{label:"社会时政",pct:7},{label:"体育",pct:7},{label:"时尚",pct:6},{label:"动物",pct:6},{label:"情感",pct:5} ] },
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

  /* ================= 复盘方法层 (影视飓风数据看板法) =================
   *  northStar : 北极星指标——影视飓风认证「平均观看百分比/完播率」
   *              是算法推荐的决定性因素, 放看板最顶端权重最高。
   *  benchmarks: 作品复盘动作的阈值(可调)。plays=播放次数, ctr=封面点击率%。
   * ================================================================= */
  playbook: {
    northStar: {
      title: "完播率",
      sub: "影视飓风认证 · 算法推荐的决定性指标（平均观看百分比）",
      items: [
        { pf:"dy",  label:"抖音完播率",   value:3.7, unit:"%", peer:16.7, peerLabel:"同类作者均值" },
        { pf:"xhs", label:"小红书完播率", value:12.4, unit:"%", peer:null, peerLabel:null },
      ],
    },
    benchmarks: { hitPlays:100000, goodFinish:45, lowFinish:40 },
  },
};
