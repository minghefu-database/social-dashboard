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

  updatedAt: "2026-06-19",
  lastUpdate: "2026-06-21 00:11",

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
          period: "近 7 日 · 真实后台",
          percentileStale: true,
          axes: [
            { label: "观看数",   value: "13.1万", percentile: 99 },
            { label: "涨粉数",   value: "2033",   percentile: 97 },
            { label: "主页访客", value: "2163",   percentile: 97 },
            { label: "发布数",   value: "2",      percentile: 91 },
            { label: "互动数",   value: "3052",   percentile: 96 },
          ],
        },
        // 抖音诊断(06-14, 近7日)。播放量超过同类作者 99.98%
        dy: {
          period: "近 7 日",
          note: "真实后台数据 · 06-19",
          axes: [
            { label: "播放量",   mine: 761623, peer: 32,   mineText: "76.16万", peerText: "32" },
            { label: "完播率",   mine: 4.4,    peer: 16.7, mineText: "4.4%",    peerText: "16.7%" },
            { label: "粉丝净增", mine: 7157,   peer: 398,  mineText: "7157",    peerText: "398" },
            { label: "投稿量",   mine: 2,      peer: 2,    mineText: "2",       peerText: "2" },
            { label: "互动率",   mine: 3.1,    peer: 6.3,  mineText: "3.1%",    peerText: "6.3%" },
          ],
        },
      },

      /* ================= 账号概览 ================= */
      overview: {
        // 小红书"观看数据"更新(06-14)
        xhs: {
          d7: {
            cards: [
              { label: "浏览量",       value: "19.2",   unit: "万",   delta: -21  },
              { label: "实际观看人数", value: "13.1",   unit: "万",   delta: -3   },
              { label: "封面点击率",   value: "12.5",   unit: "%",    delta: 3    },
              { label: "平均观看时长", value: "44.3",   unit: "秒",   delta: -4   },
              { label: "观看总时长",   value: "1834.1", unit: "小时", delta: null },
              { label: "完播率",       value: "5.2",    unit: "%",    delta: null },
            ],
            trend: { real:true, unitText:"浏览量(万) · 06-13~06-19 · 真实后台数据",
              labels:["06-13","06-14","06-15","06-16","06-17","06-18","06-19"],
              values:[5.3,4.4,1.4,0.8,0.5,0.3,0.3] },
          },
          d30: {
            cards: [
              { label: "浏览量",       value: "83.7",   unit: "万",   delta: null },
              { label: "实际观看人数", value: "32.4",   unit: "万",   delta: null },
              { label: "封面点击率",   value: "13.5",   unit: "%",    delta: null },
              { label: "平均观看时长", value: "50.7",   unit: "秒",   delta: null },
              { label: "观看总时长",   value: "5037.8", unit: "小时", delta: null },
              { label: "完播率",       value: "5.9",    unit: "%",    delta: null },
            ],
            trend: null, trendStale: true,
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
              { label: "投稿数",   value: "2",      unit: "",  delta: null },
              { label: "播放量",   value: "132.58", unit: "万", delta: null },
              { label: "完播率",   value: "4.33",   unit: "%", delta: null },
              { label: "互动指数", value: "3.09",   unit: "%", delta: null },
              { label: "点赞量",   value: "2.19",   unit: "万", delta: null },
              { label: "作品搜索", value: "1.6",    unit: "万", delta: null },
              { label: "弹幕量",   value: "5",      unit: "",  delta: null },
              { label: "封面点击", value: "100",    unit: "%", delta: null },
            ],
            // 真实每日播放明细(来自后台接口 option_list, 近30天截取活跃段)
            trend: { real:true, unitText:"播放量(万) · 06-08~06-19 · 真实后台数据",
              labels:["06-08","06-09","06-10","06-11","06-12","06-13","06-14","06-15","06-16","06-17","06-18","06-19"],
              values:[0,0.24,0.78,27.34,28.06,15.66,12.30,8.80,11.96,10.40,12.73,4.33] },
          },
        },
      },

      /* ================= 观看来源(条形) ================= */
      source: {
        xhs: {
          d7: { period:"近 7 日 · 真实后台", items:[
            { label:"视频推荐", pct:91 }, { label:"首页推荐", pct:2 },
            { label:"搜索", pct:2 }, { label:"个人主页", pct:1 }, { label:"其他来源", pct:4 } ] },
          d30: { stale:true, period:"05-15 至 06-13", items:[
            { label:"视频推荐", pct:68 }, { label:"首页推荐", pct:23 },
            { label:"搜索", pct:4 }, { label:"个人主页", pct:1 }, { label:"其他来源", pct:4 } ] },
        },
        dy: {
          d7: { stale:true, extra:"平台扶持流量 1028 次播放", items:[
            { label:"推荐页", pct:94.3, delta:5.1 }, { label:"搜索", pct:3.8, delta:-4.1 },
            { label:"个人主页", pct:1.4, delta:-1.1 }, { label:"其他", pct:0.4, delta:0.1 } ] },
          d30: null,
        },
      },

      /* ================= 观看时段(柱状) ================= */
      timeslot: {
        xhs: {
          d7: { period:"近 7 日 · 真实后台",
            labels:["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
            values:[13100,8027,4675,2556,1529,1579,2417,3396,4445,4245,4495,4291,4031,4967,4266,5048,4848,3931,3533,5530,5837,9602,11968,13155] },
          d30: { stale:true, estimated:true, period:"05-15 至 06-13",
            labels:["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
            values:[4000,2500,1600,1100,1000,1300,2000,2500,3000,3400,3700,3600,3500,3600,4300,4800,4600,5000,4800,4300,4200,6500,30000,22000] },
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
          d7: { period:"近 7 日 · 真实后台", items:[
            { rank:1, title:"让你家拥有一个S型身材的家居布局", date:"2026-06-11 11:52",
              stats:[{label:"播放",value:"129.0万"},{label:"点赞",value:"2.1万"},{label:"评论",value:"834"}] },
            { rank:2, title:"现代家中男尊女卑的实际理解", date:"2026-06-18 12:06",
              stats:[{label:"播放",value:"8.4万"},{label:"点赞",value:"1624"},{label:"评论",value:"30"}] },
            { rank:3, title:"不要迷信了！寺庙的秘密被可视化了", date:"2026-06-09 12:10",
              stats:[{label:"播放",value:"2.8万"},{label:"点赞",value:"550"},{label:"评论",value:"23"}] },
          ] },
          d30: { period:"近 30 日 · 真实后台", items:[
            { rank:1, title:"让你家拥有一个S型身材的家居布局", date:"2026-06-11 11:52",
              stats:[{label:"播放",value:"129.0万"},{label:"点赞",value:"2.1万"},{label:"评论",value:"834"}] },
            { rank:2, title:"现代家中男尊女卑的实际理解", date:"2026-06-18 12:06",
              stats:[{label:"播放",value:"8.4万"},{label:"点赞",value:"1624"},{label:"评论",value:"30"}] },
            { rank:3, title:"不要迷信了！寺庙的秘密被可视化了", date:"2026-06-09 12:10",
              stats:[{label:"播放",value:"2.8万"},{label:"点赞",value:"550"},{label:"评论",value:"23"}] },
          ] },
        },
      },

      /* ================= 作品分析(tab) ================= */
      works: {
        xhs: {
          period: "笔记数据 · 真实后台 06-19",
          note: "小红书每篇带封面点击率",
          items: [
            { title:"让你家拥有一个S型身材的家居布局", date:"2026-06-11 12:02", plays:"24.9万", avgDur:"56秒", ctr:"9.7%",  likes:"3443" },
            { title:"劝你不要在家里随便放诵经音乐。",   date:"2026-05-18 20:30", plays:"6.7万",  avgDur:"56秒", ctr:"14.6%", likes:"824" },
            { title:"不要迷信了！寺庙的秘密被可视化了", date:"2026-06-07 21:06", plays:"1951",   avgDur:"104秒", ctr:"14.0%", likes:"58" },
            { title:"现代家中男尊女卑的实际理解, 很实用!", date:"2026-06-18 12:19", plays:"1575", avgDur:"67秒", ctr:"12.2%", likes:"50" },
            { title:"容易提升成绩的位置，打造好的学习环境", date:"2026-06-15 19:14", plays:"1211", avgDur:"109秒", ctr:"12.3%", likes:"41" },
            { title:"劝你别把道乐当家里的背景音乐",     date:"2026-05-22 20:01", plays:"732",    avgDur:"24秒", ctr:"10.8%", likes:"20" },
          ],
        },
        dy: {
          period: "投稿 · 真实后台数据 06-19",
          note: "封面点击率口径不在本接口，改用「5秒完播率」(留存关键指标)",
          items: [
            { title:"让你家拥有一个S型身材的家居布局", tags:"#家居布局 #空间布局 #国学智慧 #明和符 #听宅人",
              date:"2026-06-11 11:52", plays:"129.0万", avgDur:"35秒", finishRate:"54.5%", likes:"2.1万", reward:"爆款" },
            { title:"现代家中男尊女卑的实际理解, 很实用!", tags:"#夫妻感情 #家居布局 #空间布局 #明和符 #听宅人",
              date:"2026-06-18 12:06", plays:"8.4万", avgDur:"26秒", finishRate:"41.6%", likes:"1624" },
            { title:"不要迷信了！寺庙的秘密被可视化了", tags:"#空间秩序 #寺庙 #礼乐 #听宅人 #明和符",
              date:"2026-06-09 12:10", plays:"2.8万", avgDur:"33秒", finishRate:"45.8%", likes:"550" },
            { title:"容易提升成绩的位置，打造好的学习环境", tags:"#高考 #空间布局 #家居布局 #明和符 #听宅人",
              date:"2026-06-15 19:13", plays:"5497", avgDur:"35秒", finishRate:"39.4%", likes:"127" },
          ],
        },
      },

      /* ================= 观众数据(tab) ================= */
      audience: {
        // 小红书"粉丝数据"(近30日为主, 统计周期 05-13 至 06-12)
        xhs: {
          base: [
            { label:"总粉丝",       value:"4782", sub:"获赞 7216" },
            { label:"30日净增粉丝", value:"4691", sub:"7日净增 2015" },
            { label:"30日流失粉丝", value:"179",  sub:"7日流失 88" },
            { label:"7日涨粉",      value:"2033", sub:"环比 -21%" },
            { label:"7日点赞",      value:"1773", sub:"" },
            { label:"7日收藏",      value:"955",  sub:"" },
          ],
          growth: { estimated:true,
            labels:["05-13","05-16","05-19","05-22","05-25","05-28","05-31","06-03","06-06","06-09","06-12"],
            values:[10,20,40,80,120,180,250,400,700,1800,3839] },
          followSource: [
            { label:"视频推荐", pct:78.1 }, { label:"首页推荐", pct:10.9 },
            { label:"其他来源", pct:9.3 }, { label:"搜索", pct:0.9 }, { label:"个人主页", pct:0.9 },
          ],
          portrait: {
            gender: { male:33, female:67 },
            age: { items:[
              {label:"<18",pct:0},{label:"18-24",pct:11},{label:"25-34",pct:40},{label:"35-44",pct:34},{label:">44",pct:12} ] },
            city: { items:[
              {label:"北京",pct:7},{label:"上海",pct:6},{label:"广州",pct:3},{label:"深圳",pct:3},{label:"成都",pct:3},{label:"杭州",pct:2},{label:"天津",pct:2},{label:"青岛",pct:1} ] },
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
            conclusion: "真实画像(06-19)：男性占 9 成、24-30 岁为主、山东居首、重度活跃粉丝 88%",
            gender: { male:90, female:10 },
            age: { items:[
              {label:"<23",pct:26},{label:"24-30",pct:44},{label:"31-40",pct:27},{label:"41-50",pct:2},{label:">50",pct:1} ] },
            city: { items:[
              {label:"山东",pct:15.8},{label:"河北",pct:9.9},{label:"广东",pct:9.8},{label:"河南",pct:9.4},{label:"江苏",pct:5.8},{label:"山西",pct:4.5},{label:"浙江",pct:4.2},{label:"陕西",pct:3.8} ] },
            device: { estimated:true, items:[
              {label:"苹果",pct:45},{label:"华为",pct:18},{label:"小米",pct:12},{label:"OPPO",pct:10},{label:"荣耀",pct:7},{label:"VIVO",pct:5},{label:"红米",pct:3} ] },
            active: { items:[
              {label:"低活",pct:0},{label:"轻度",pct:1},{label:"中度",pct:7},{label:"重度",pct:88} ] },
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
        { pf:"dy",  label:"抖音完播率",   value:4.4, unit:"%", peer:16.7, peerLabel:"同类作者均值" },
        { pf:"xhs", label:"小红书完播率", value:6.1,  unit:"%", peer:null, peerLabel:null },
      ],
    },
    benchmarks: { hitPlays:100000, goodFinish:45, lowFinish:40 },
  },
};
