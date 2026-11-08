/* 匠魂 MVP prototype — vanilla JS, local demo data */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const roleMeta = {
    boss: { initial: "陈", name: "陈厂长", sub: "厂长视角 · 看结果、看 ROI" },
    master: { initial: "周", name: "老周", sub: "老师傅视角 · 采集、审核" },
    newbie: { initial: "梁", name: "小梁", sub: "新人视角 · 问问题、学路径" },
    leader: { initial: "王", name: "王班长", sub: "班组长视角 · 看交接、看新人" },
  };

  const viewMeta = {
    dashboard: ["总览", "一车间今天的关键变化，都在这里。"],
    knowledge: ["知识库", "工艺卡片、异常案例、老师傅问答；每条都带适用条件。"],
    ask: ["问师傅", "先问系统，再问师傅；答案带条件、出处和审核人。"],
    capture: ["采集工作台", "把一次访谈，变成一条可审核、可追溯的知识。"],
    review: ["审核队列", "老师傅签字之后，知识才允许发布。"],
    onboarding: ["新人路径", "7 天知道学什么，30 天能独立看机台。"],
    settings: ["设置", "角色、权限、数据与试点边界。"],
  };

  const viewRoles = {
    dashboard: ["boss", "master", "newbie", "leader"],
    knowledge: ["boss", "master", "newbie", "leader"],
    ask: ["boss", "master", "newbie", "leader"],
    capture: ["boss", "master"],
    review: ["boss", "master"],
    onboarding: ["boss", "master", "newbie", "leader"],
    settings: ["boss"],
  };

  const seedKnowledge = [
    {
      id: "pc-1", type: "process", title: "PA66-GF30 尺寸超差调整",
      summary: "夜班尺寸超差时，先确认模温，再退保压；不要先动注射压力。",
      conditions: ["PA66-GF30", "机台 #03", "客户 A"],
      material: "PA66-GF30", machine: "#03", customer: "A", owner: "老周",
      updated: "2026-11-06", confidence: 96, version: "v3",
      body: "当夜班环境温度低于 18°C，模温升得慢，PA66-GF30 的收缩会变大。先把模温提前 20 分钟升到 78°C；如果尺寸仍偏小，保压从 3.2 秒退到 2.6 秒，周期从 35 秒降到 32 秒。每次调整只动一个参数，调完空打 2 模再取首件。",
      steps: ["确认材料批次与含水率", "模温提前升到 78°C", "保压 3.2→2.6 秒", "周期 35→32 秒", "空打 2 模，取首件送检"],
      source: "访谈 S01 / 现场拍摄 12 张 / 工艺卡 P-03",
    },
    {
      id: "pc-2", type: "process", title: "SPCC 冲压件毛刺控制",
      summary: "毛刺突然变大，先查刃口磨损与送料间隙，不要先加压。",
      conditions: ["SPCC 1.2mm", "模具 M-12", "客户 B"],
      material: "SPCC 1.2mm", machine: "M-12", customer: "B", owner: "李师傅",
      updated: "2026-11-04", confidence: 91, version: "v2",
      body: "SPCC 1.2mm 冲压件毛刺超过 0.05mm 时，先看刃口是否磨损、送料间隙是否偏移。刃口磨损的典型信号是毛刺发亮、方向一致；间隙偏移则是单边毛刺。不要先用提高压力去压毛刺，会把模具压坏。",
      steps: ["看毛刺方向与亮度", "检查刃口磨损", "复测送料间隙", "必要时换刃口/调整间隙"],
      source: "访谈 S04 / 模具保养记录",
    },
    {
      id: "pc-3", type: "process", title: "SMT 换线首件确认",
      summary: "换线后首件必须确认三件事：方向、极性、焊点。",
      conditions: ["客户 B", "线体 SMT-2", "换线/换料"],
      material: "PCB / 电子料", machine: "SMT-2", customer: "B", owner: "阿杰",
      updated: "2026-10-28", confidence: 88, version: "v1",
      body: "换线后的首件不要只看有没有缺件。先确认方向（二极管/连接器）、极性（电容/IC）、焊点（连锡/虚焊）。首件由操作员自检、班组长复检，拍照留档后再批量。",
      steps: ["对照 BOM 与站位表", "确认方向/极性", "看焊点与连锡", "拍照留档", "班组长签字"],
      source: "客户 B 审厂要求 / 首件记录",
    },
    {
      id: "ac-1", type: "case", title: "夜班尺寸超差：保压 3.2→2.6 秒",
      summary: "同一套模具、同一批料，白班正常、夜班超差。根因不是参数本身，是模温与环温。",
      conditions: ["PA66-GF30", "夜班", "环温 < 18°C"],
      material: "PA66-GF30", machine: "#03", customer: "A", owner: "老周",
      updated: "2026-11-06", confidence: 96, version: "v2",
      body: "夜班新人按白班参数开机，模温只有 71°C。尺寸偏小 0.06mm。老周没有调压力，先把模温升到 78°C，保压退到 2.6 秒，周期降到 32 秒。第三批尺寸回到公差中值。",
      steps: ["发现：夜班首件尺寸偏小", "判断：模温 71°C，低于 75°C", "动作：模温升到 78°C；保压 2.6s；周期 32s", "结果：第三批合格", "防止再发：夜班开机前 20 分钟升温"],
      source: "现场访谈 S01 / 夜班报表 11-03",
    },
    {
      id: "ac-2", type: "case", title: "模具排气槽堵塞导致烧焦",
      summary: "产品角落发黄、有焦味，先查排气槽，不要先降料温。",
      conditions: ["模具 M-08", "PC/ABS", "角落烧焦"],
      material: "PC/ABS", machine: "M-08", customer: "C", owner: "李师傅",
      updated: "2026-10-30", confidence: 90, version: "v1",
      body: "连续生产 6 小时后，模具排气槽被油污/碎屑堵住，气体排不出去，角落烧焦。先停机清理排气槽，再确认排气深度；不要用降料温硬扛，会带来缺料。",
      steps: ["看烧焦位置是否固定在角落", "停机检查排气槽", "清理油污/碎屑", "复测排气深度", "首件确认后复产"],
      source: "异常工单 WO-1027 / 现场照片",
    },
    {
      id: "ac-3", type: "case", title: "同一客诉反复：只改参数，没改交接",
      summary: "客户 A 同一尺寸问题 3 个月出现 4 次；根因是夜班交接没有确认模温。",
      conditions: ["客户 A", "夜班交接", "尺寸问题"],
      material: "PA66-GF30", machine: "#03", customer: "A", owner: "王班长",
      updated: "2026-10-22", confidence: 84, version: "v1",
      body: "前三次都靠老师傅调参数解决，没有写进交接班。第四次换人又发生。后来把“夜班开机前确认模温 ≥ 75°C”写进交接清单，并让班组长签字，才止住。",
      steps: ["统计 3 个月客诉", "发现都是夜班首件", "把模温确认写进交接", "班组长签字", "连续 4 周跟踪"],
      source: "客诉记录 CC-07 / 交接班表",
    },
    {
      id: "qa-1", type: "qa", title: "PA66-GF30 夜班尺寸超差怎么调？",
      summary: "先模温、再保压、最后周期；一次只动一个参数。",
      conditions: ["PA66-GF30", "夜班", "机台 #03"],
      material: "PA66-GF30", machine: "#03", customer: "A", owner: "老周",
      updated: "2026-11-06", confidence: 96, version: "v3",
      body: "先确认模温是否低于 75°C。低于 75°C，先把模温升到 78°C，等 20 分钟；尺寸仍偏小，再把保压从 3.2 秒退到 2.6 秒，周期从 35 秒降到 32 秒。不要同时动压力和料温。每次调整后空打 2 模，再取首件。",
      steps: ["模温 < 75°C → 升到 78°C", "保压 3.2→2.6 秒", "周期 35→32 秒", "空打 2 模，取首件"],
      source: "工艺卡片 PC-01 / 访谈 S01",
    },
    {
      id: "qa-2", type: "qa", title: "冲压件毛刺大，先查什么？",
      summary: "先看毛刺方向，再查刃口和送料间隙；不要先加压。",
      conditions: ["SPCC 1.2mm", "模具 M-12"],
      material: "SPCC 1.2mm", machine: "M-12", customer: "B", owner: "李师傅",
      updated: "2026-11-04", confidence: 91, version: "v2",
      body: "毛刺发亮、方向一致，多半是刃口磨损；单边毛刺，多半是送料间隙偏移。先停机检查刃口和间隙，不要用提高压力去压毛刺。",
      steps: ["看毛刺方向/亮度", "查刃口磨损", "复测送料间隙", "换刃口或调间隙"],
      source: "工艺卡片 PC-02",
    },
    {
      id: "qa-3", type: "qa", title: "新人第一天应该先学什么？",
      summary: "先安全、再认机台、再认材料；不要第一天就独立调机。",
      conditions: ["新人", "入职 0–7 天"],
      material: "—", machine: "—", customer: "—", owner: "王班长",
      updated: "2026-10-20", confidence: 86, version: "v1",
      body: "第一天只做三件事：记住急停/安全门位置；认本岗位的 3 台机台；认 3 种最常用材料。第二天开始跟师傅巡机，不独立调参数。",
      steps: ["安全位置", "认 3 台机台", "认 3 种材料", "跟师傅巡机"],
      source: "新人 7 天路径 / 班组长访谈",
    },
  ];

  const seedQueue = [
    { id: "rq-1", title: "PA66-GF30 模温 78°C 的适用边界", type: "工艺卡片", submitter: "老周", time: "10 分钟前", body: "模温 78°C 适用于 PA66-GF30、机台 #03、客户 A；当环境温度高于 28°C 时，模温上限要降到 76°C，避免尺寸偏大。", conditions: ["PA66-GF30", "机台 #03", "环温 > 28°C"], source: "访谈 S01 / 补充说明", confidence: 88 },
    { id: "rq-2", title: "模具排气槽清理后首模空打", type: "异常案例", submitter: "老周", time: "25 分钟前", body: "清理排气槽后，第一模必须空打，避免清理碎屑进入型腔。空打后检查排气深度，再取首件。", conditions: ["模具 M-08", "清理排气槽"], source: "现场操作 / 照片 4 张", confidence: 92 },
    { id: "rq-3", title: "客户 A 的尺寸公差要求", type: "工艺卡片", submitter: "王班长", time: "1 小时前", body: "客户 A 的关键尺寸公差为 ±0.05mm；首件与巡检都按这个标准，超出即停线。", conditions: ["客户 A", "关键尺寸"], source: "客户图纸 / 质量协议", confidence: 95 },
    { id: "rq-4", title: "夜班交接班检查清单", type: "异常案例", submitter: "王班长", time: "2 小时前", body: "交接班必须确认：模温、料位、模具状态、上一班异常、待处理首件。班组长签字后才可开机。", conditions: ["夜班", "交接班"], source: "交接班表 / 王班长", confidence: 90 },
    { id: "rq-5", title: "PA66 料含水率检测", type: "工艺卡片", submitter: "老周", time: "3 小时前", body: "PA66 料含水率超过 0.2% 时，先烘干 4 小时再上线；否则容易出现银纹和尺寸波动。", conditions: ["PA66", "含水率 > 0.2%"], source: "来料检验 / 老周", confidence: 87 },
    { id: "rq-6", title: "新人第 3 天：看 3 个异常案例", type: "问答", submitter: "小梁", time: "昨天", body: "第 3 天不跟机，先看 3 个异常案例：尺寸超差、烧焦、毛刺。看完用自己的话复述给班组长。", conditions: ["新人", "第 3 天"], source: "新人路径 / 王班长", confidence: 85 },
  ];

  const seedOnboarding = [
    { day: 1, title: "安全与机台认识", desc: "先知道哪里不能碰，再知道机器在哪。", tasks: [{ t: "记住急停/安全门位置", done: true }, { t: "认本岗位 3 台机台", done: true }] },
    { day: 2, title: "材料与模具", desc: "认 3 种常用材料，知道模具编号。", tasks: [{ t: "认 PA66-GF30 / SPCC / PC-ABS", done: true }, { t: "找到模具 M-12 / M-08", done: false }] },
    { day: 3, title: "看 3 个异常案例", desc: "不跟机，先看懂别人怎么判断。", tasks: [{ t: "尺寸超差案例", done: true }, { t: "烧焦案例", done: false }] },
    { day: 4, title: "跟师傅巡机", desc: "听声音、摸温度、看产品。", tasks: [{ t: "跟老周巡 1 次机", done: false }, { t: "记录 3 个异常信号", done: false }] },
    { day: 5, title: "首件确认", desc: "在师傅看着的情况下做一次首件。", tasks: [{ t: "独立做首件", done: false }, { t: "班组长复检", done: false }] },
    { day: 6, title: "复盘 5 个问题", desc: "把这一周问过的问题，自己讲一遍。", tasks: [{ t: "复述 5 个问答", done: false }, { t: "标出 1 个还不会的", done: false }] },
    { day: 7, title: "小测与确认", desc: "班组长确认可以进入下一阶段。", tasks: [{ t: "10 题小测 ≥ 8 分", done: false }, { t: "班组长签字", done: false }] },
  ];

  const state = {
    view: "dashboard",
    role: "boss",
    search: "",
    knowledgeTab: "all",
    filter: "all",
    selectedQueue: "rq-1",
    queue: seedQueue.map((x) => ({ ...x })),
    knowledge: seedKnowledge.map((x) => ({ ...x })),
    onboarding: seedOnboarding.map((d) => ({ ...d, tasks: d.tasks.map((t) => ({ ...t })) })),
    chat: [
      { role: "bot", text: "我是匠魂。可以问我车间里的工艺参数、异常处理，或者新人带教问题。每条答案都会带适用条件和出处。" },
    ],
    captureStep: 1,
    capture: {
      product: "", material: "", machine: "", customer: "",
      notes: "", extracted: null,
    },
  };

  const typeMap = { process: "工艺卡片", case: "异常案例", qa: "老师傅问答" };
  const typeClass = { process: "amber", case: "red", qa: "teal" };
  const roleAllowed = (view) => (viewRoles[view] || []).includes(state.role);

  const answerBank = [
    {
      keys: ["尺寸", "超差", "pa66", "保压", "夜班", "模温"],
      title: "先退保压，再确认模温",
      body: "先确认模温是否低于 75°C。低于 75°C，先把模温升到 78°C，等 20 分钟；尺寸仍偏小，再把保压从 3.2 秒退到 2.6 秒，周期从 35 秒降到 32 秒。不要同时动压力和料温。",
      conditions: ["PA66-GF30", "机台 #03", "夜班环温 < 18°C"],
      source: "工艺卡片 PC-01 / 访谈 S01",
      owner: "老周", confidence: 96,
    },
    {
      keys: ["毛刺", "批锋", "冲压", "刃口", "五金"],
      title: "先看毛刺方向，再查刃口和间隙",
      body: "毛刺发亮、方向一致，多半是刃口磨损；单边毛刺，多半是送料间隙偏移。先停机检查刃口和间隙，不要用提高压力去压毛刺。",
      conditions: ["SPCC 1.2mm", "模具 M-12"],
      source: "工艺卡片 PC-02 / 访谈 S04",
      owner: "李师傅", confidence: 91,
    },
    {
      keys: ["烧焦", "排气", "焦味", "发黄"],
      title: "先清排气槽，不要先降料温",
      body: "产品角落固定发黄/有焦味，先停机检查排气槽是否被油污或碎屑堵住。清理后复测排气深度，首件确认再复产；不要用降料温硬扛，会带来缺料。",
      conditions: ["模具 M-08", "PC/ABS", "角落烧焦"],
      source: "异常案例 AC-02 / 工单 WO-1027",
      owner: "李师傅", confidence: 90,
    },
    {
      keys: ["换线", "首件", "smt", "极性", "方向"],
      title: "首件先看方向、极性、焊点",
      body: "换线后的首件不要只看有没有缺件。先确认方向、极性、焊点，再由班组长复检、拍照留档，最后才批量。",
      conditions: ["客户 B", "线体 SMT-2", "换线/换料"],
      source: "工艺卡片 PC-03 / 客户 B 审厂要求",
      owner: "阿杰", confidence: 88,
    },
    {
      keys: ["新人", "第一天", "学什么", "带教"],
      title: "第一天只学安全、机台、材料",
      body: "第一天只做三件事：记住急停/安全门位置；认本岗位 3 台机台；认 3 种最常用材料。第二天开始跟师傅巡机，不独立调参数。",
      conditions: ["新人", "入职 0–7 天"],
      source: "新人 7 天路径 / 班组长访谈",
      owner: "王班长", confidence: 86,
    },
  ];

  state.chat.push({ role: "user", text: "PA66-GF30 夜班尺寸超差怎么调？" });
  state.chat.push({ role: "bot", answer: answerBank[0] });

  function roleLabel() { return roleMeta[state.role].name; }
  function queueCount() { return state.queue.length; }
  function doneTasks() { return state.onboarding.reduce((n, d) => n + d.tasks.filter((t) => t.done).length, 0); }
  function totalTasks() { return state.onboarding.reduce((n, d) => n + d.tasks.length, 0); }
  function progressPct() { return Math.round((doneTasks() / totalTasks()) * 100); }

  function syncChrome() {
    const meta = viewMeta[state.view];
    $("#pageTitle").textContent = meta[0];
    $("#pageSub").textContent = meta[1];
    $("#crumbView").textContent = meta[0];
    $("#avatar").textContent = roleMeta[state.role].initial;
    $("#avatar").title = roleMeta[state.role].name;
    $("#queueBadge").textContent = queueCount();
    document.querySelectorAll(".nav-item").forEach((btn) => {
      const v = btn.dataset.view;
      btn.classList.toggle("active", v === state.view);
      btn.classList.toggle("hidden", !roleAllowed(v));
    });
  }

  function setView(view) {
    if (!roleAllowed(view)) view = "dashboard";
    state.view = view;
    closeDrawer();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function render() {
    if (!roleAllowed(state.view)) state.view = "dashboard";
    const html = {
      dashboard: renderDashboard,
      knowledge: renderKnowledge,
      ask: renderAsk,
      capture: renderCapture,
      review: renderReview,
      onboarding: renderOnboarding,
      settings: renderSettings,
    }[state.view]();
    $("#view").innerHTML = html;
    syncChrome();
    if (state.view === "ask") {
      const log = $("#chatLog");
      if (log) log.scrollTop = log.scrollHeight;
      const input = $("#askInput");
      if (input) setTimeout(() => input.focus(), 30);
    }
    if (state.view === "review") syncChrome();
  }

  /* ---------------- dashboard ---------------- */
  function metricCard(label, value, unit, note, tone = "") {
    return `<div class="metric ${tone}">
      <div class="metric-label"><span>${esc(label)}</span><span class="dot" style="color:${tone === "red" ? "var(--red)" : tone === "teal" ? "var(--teal)" : "var(--amber)"}"></span></div>
      <div class="metric-value">${value}<small>${esc(unit)}</small></div>
      <div class="metric-note">${note}</div>
    </div>`;
  }

  function metricCards() {
    if (state.role === "boss") {
      return [
        metricCard("可调用知识", "50", "条", '<span class="trend-up">+12</span> 本月新增'),
        metricCard("本周提问", "128", "次", '新人占 <b>64%</b>', "teal"),
        metricCard("提问解决率", "68", "%", '<span class="trend-up">+9pp</span> 对比试点首周', "plum"),
        metricCard("待审核", queueCount(), "条", "老师傅签字后发布", "red"),
      ].join("");
    }
    if (state.role === "master") {
      return [
        metricCard("我的贡献", "18", "条", "本月被调用 142 次", "teal"),
        metricCard("待审核", queueCount(), "条", "其中 3 条待补充", "red"),
        metricCard("本周提问", "128", "次", "有 9 条没答案", "plum"),
        metricCard("答案采纳率", "68", "%", "目标 75%"),
      ].join("");
    }
    if (state.role === "newbie") {
      return [
        metricCard("我的进度", progressPct(), "%", `${doneTasks()}/${totalTasks()} 个任务`, "teal"),
        metricCard("本周提问", "12", "次", "6 次先问了系统", "plum"),
        metricCard("已学任务", doneTasks(), "个", "第 3 天 · 异常案例", "amber"),
        metricCard("可问知识", "50", "条", "带条件的答案"),
      ].join("");
    }
    return [
      metricCard("班组提问", "34", "次", "夜班占 21 次", "teal"),
      metricCard("新人进度", "2/3", "人", "小梁 43% · 阿杰 71%", "amber"),
      metricCard("交接异常", "2", "条", "已处理 1 条", "red"),
      metricCard("解决率", "68", "%", "目标 75%", "plum"),
    ].join("");
  }

  function quickActions() {
    const actions = {
      boss: [
        ["ask", "去问师傅", '<path d="M21 12a8.5 8.5 0 0 1-8.5 8.5H6l-3 2v-5.2A8.5 8.5 0 1 1 21 12z"/>'],
        ["review", "看审核队列", '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9l2.2 2.2L13 7.5M7 16l2.2 2.2L13 14.5"/>'],
      ],
      master: [
        ["capture", "采集一条经验", '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'],
        ["review", "审核队列", '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9l2.2 2.2L13 7.5M7 16l2.2 2.2L13 14.5"/>'],
      ],
      newbie: [
        ["ask", "去问师傅", '<path d="M21 12a8.5 8.5 0 0 1-8.5 8.5H6l-3 2v-5.2A8.5 8.5 0 1 1 21 12z"/>'],
        ["onboarding", "看新人路径", '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="12" r="2.2"/><path d="M8.2 6H13a3 3 0 0 1 3 3v.5M8.2 18H13a3 3 0 0 0 3-3v-.5"/>'],
      ],
      leader: [
        ["onboarding", "看新人进度", '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="12" r="2.2"/><path d="M8.2 6H13a3 3 0 0 1 3 3v.5M8.2 18H13a3 3 0 0 0 3-3v-.5"/>'],
        ["ask", "问师傅", '<path d="M21 12a8.5 8.5 0 0 1-8.5 8.5H6l-3 2v-5.2A8.5 8.5 0 1 1 21 12z"/>'],
      ],
    }[state.role];
    return `<div class="quick-row">${actions.map(([view, label, icon]) => `<button class="quick-btn" data-view="${view}"><svg viewBox="0 0 24 24">${icon}</svg>${label}</button>`).join("")}</div>`;
  }

  function renderDashboard() {
    const activities = [
      ["老周提交了 1 条工艺卡片", "PA66-GF30 模温 78°C 的适用边界", "10 分钟前", "amber"],
      ["小梁在夜班问了「尺寸超差」", "系统给了答案，他点了“有用”", "32 分钟前", "teal"],
      ["客户 A 的审厂资料已导出", "包含 12 条工艺卡、8 个异常案例", "1 小时前", ""],
      ["系统提示 2 条知识已过有效期", "模具 M-08 / 客户 C 的工艺卡", "2 小时前", "red"],
      ["王班长完成交接班检查", "夜班 3 台机台，2 条异常已交接", "3 小时前", "teal"],
    ];
    return `
      <div class="metric-grid">${metricCards()}</div>
      <div class="dash-grid">
        <div class="dash-stack">
          <section class="panel">
            <div class="panel-head">
              <div><div class="eyebrow">TODAY / 今天</div><h2>最近发生</h2><p>把“谁在问、谁在教、哪条知识快过期”放在一屏。</p></div>
              <button class="link-btn" data-view="knowledge">看全部知识 →</button>
            </div>
            <div class="panel-body activity">
              ${activities.map(([title, meta, time, tone]) => `
                <div class="activity-row">
                  <div class="activity-ico ${tone}">
                    <svg viewBox="0 0 24 24" class="icon"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2.5"/></svg>
                  </div>
                  <div class="activity-main"><p class="activity-title">${title}</p><div class="activity-meta">${meta}</div></div>
                  <div class="activity-time">${time}</div>
                </div>`).join("")}
            </div>
          </section>

          <section class="panel">
            <div class="panel-head">
              <div><div class="eyebrow">KNOWLEDGE HEALTH / 知识健康度</div><h2>哪些知识该补了</h2><p>不是“存了多少”，而是“还能不能用”。</p></div>
              <span class="badge amber">本周体检</span>
            </div>
            <div class="panel-body">
              <div class="health-list">
                ${[
                  ["工艺卡片", 82, "15 张，2 张需复核"],
                  ["异常案例", 64, "15 个，5 个缺“防止再发”"],
                  ["老师傅问答", 71, "50 条，9 条无条件下答案"],
                ].map(([name, pct, note]) => `
                  <div class="health-item">
                    <div class="health-top"><strong>${name}</strong><span>${pct}%</span></div>
                    <div class="health-bar"><span style="width:${pct}%"></span></div>
                    <div class="small muted" style="margin-top:4px">${note}</div>
                  </div>`).join("")}
              </div>
              <div class="quick-row">${quickActions()}</div>
            </div>
          </section>
        </div>

        <div class="dash-stack">
          <section class="panel">
            <div class="panel-head"><div><div class="eyebrow">MASTERS / 老师傅</div><h2>本周贡献</h2></div><span class="badge green">署名可见</span></div>
            <div class="panel-body">
              ${[
                ["周", "老周", "模具 · 32 年", 18],
                ["李", "李师傅", "冲压 · 21 年", 11],
                ["王", "王班长", "注塑 · 12 年", 6],
              ].map(([av, name, meta, count]) => `
                <div class="master-row">
                  <div class="master-avatar">${av}</div>
                  <div><div class="master-name">${name}</div><div class="master-meta">${meta}</div></div>
                  <div class="master-count">+${count}</div>
                </div>`).join("")}
              <div class="small muted" style="margin-top:10px">只展示“贡献”，不做公开排名；署名与顾问费挂钩。</div>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><div><div class="eyebrow">RISK / 今天要盯</div><h2>三个信号</h2></div></div>
            <div class="panel-body">
              ${[
                ["red", "夜班首件又超差", "小梁问了系统，答案采纳；但模温仍偏低。"],
                ["amber", "2 条知识过期", "模具 M-08、客户 C 的工艺卡超过 90 天未复核。"],
                ["teal", "客户 A 审厂倒计时 12 天", "需要导出培训记录与版本变更。"],
              ].map(([tone, title, body]) => `
                <div style="padding:9px 0;border-bottom:1px solid var(--line-2)">
                  <div style="display:flex;gap:7px;align-items:center"><span class="dot" style="color:var(--${tone === "red" ? "red" : tone === "amber" ? "amber-deep" : "teal"})"></span><strong style="font-size:11px;color:var(--navy)">${title}</strong></div>
                  <div class="small muted" style="margin:3px 0 0 13px">${body}</div>
                </div>`).join("")}
            </div>
          </section>
        </div>
      </div>`;
  }

  /* ---------------- knowledge ---------------- */
  function renderKnowledge() {
    const tabs = [
      ["all", "全部"],
      ["process", "工艺卡片"],
      ["case", "异常案例"],
      ["qa", "老师傅问答"],
    ];
    let items = state.knowledge;
    if (state.knowledgeTab !== "all") items = items.filter((x) => x.type === state.knowledgeTab);
    if (state.filter !== "all") {
      items = items.filter((x) => x.conditions.some((c) => c.includes(state.filter)) || x.material.includes(state.filter) || x.machine.includes(state.filter) || x.customer === state.filter);
    }
    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      items = items.filter((x) => `${x.title} ${x.summary} ${x.conditions.join(" ")}`.toLowerCase().includes(q));
    }
    return `
      <div class="toolbar">
        <div class="tabs">${tabs.map(([id, label]) => `<button class="tab ${state.knowledgeTab === id ? "active" : ""}" data-tab="${id}">${label}</button>`).join("")}</div>
        <div class="filter-row">
          ${["all", "PA66-GF30", "#03", "A", "M-12"].map((f) => `<button class="filter ${state.filter === f ? "active" : ""}" data-filter="${f}">${f === "all" ? "全部条件" : f}</button>`).join("")}
        </div>
      </div>
      <div class="k-grid">
        ${items.length ? items.map(kCard).join("") : `<div class="empty panel" style="grid-column:1/-1">没有匹配的知识。换个条件，或者去「问师傅」提一个。</div>`}
      </div>
      <div class="panel" style="margin-top:16px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div class="small muted">共 <b style="color:var(--navy)">${items.length}</b> 条示例知识；每条都带适用条件、出处和审核人。</div>
        <button class="btn ghost sm" data-view="capture">＋ 采集一条</button>
      </div>`;
  }

  function kCard(item) {
    return `<article class="k-card" data-open="${item.id}">
      <div class="k-card-top"><span class="k-type">${typeMap[item.type]}</span><span class="badge ${typeClass[item.type]}">${item.confidence}% 置信</span></div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.summary)}</p>
      <div class="k-meta">${item.conditions.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>
      <div class="k-foot"><span>审核：<strong>${esc(item.owner)}</strong> · ${esc(item.version)}</span><span>${esc(item.updated)}</span></div>
    </article>`;
  }

  /* ---------------- ask ---------------- */
  function renderAsk() {
    const top = [
      "PA66-GF30 夜班尺寸超差怎么调？",
      "冲压件毛刺大，先查什么？",
      "模具烧焦，是不是要先降料温？",
      "新人第一天应该先学什么？",
    ];
    return `<div class="ask-grid">
      <section class="panel chat-panel">
        <div class="chat-head">
          <div class="bot-mark">匠</div>
          <div><h2>问师傅</h2><p>答案带条件、出处、审核人；不确定的会转给老师傅。</p></div>
          <span class="badge green" style="margin-left:auto">在线</span>
        </div>
        <div class="chat-log" id="chatLog">
          ${state.chat.map((m) => msgHtml(m)).join("")}
        </div>
        <div class="suggestions">
          ${top.map((q) => `<button data-ask="${esc(q)}">${esc(q)}</button>`).join("")}
        </div>
        <form class="chat-input" id="askForm">
          <input id="askInput" type="text" placeholder="例如：PA66 夜班尺寸超差，保压要不要退？" autocomplete="off" />
          <button class="btn amber" type="submit">提问</button>
        </form>
      </section>
      <aside class="ask-side">
        <section class="panel">
          <h3>高频问题</h3>
          ${[
            ["尺寸超差", "PA66-GF30 · 32 次"],
            ["毛刺/批锋", "SPCC · 21 次"],
            ["烧焦/排气", "PC/ABS · 14 次"],
            ["新人带教", "第 1–7 天 · 9 次"],
          ].map(([q, meta]) => `<div class="qa-mini" data-ask="${esc(q)}"><strong>${q}</strong><span>${meta}</span></div>`).join("")}
        </section>
        <section class="panel">
          <h3>答案规则</h3>
          <p class="ask-note">每条答案必须写清 <b>材料、机台、客户、批次</b>；没有条件的答案不允许发布。涉及安全关键工艺时，必须由工艺工程师确认。</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><span class="chip amber">带条件</span><span class="chip teal">有出处</span><span class="chip green">老师傅审核</span></div>
        </section>
        <section class="panel">
          <h3>没找到答案？</h3>
          <p class="ask-note">点“提问”后会进入待补充队列，班组长可以转给老师傅；老师傅回答后，会回到知识库。</p>
        </section>
      </aside>
    </div>`;
  }

  function msgHtml(m) {
    if (m.role === "user") {
      return `<div class="msg user"><div class="msg-avatar">${roleMeta[state.role].initial}</div><div class="bubble">${esc(m.text)}</div></div>`;
    }
    if (m.answer) {
      const a = m.answer;
      return `<div class="msg bot"><div class="msg-avatar">匠</div><div class="bubble" style="padding:10px;background:transparent;border:0">
        <div class="answer-card">
          <div class="answer-label">建议答案 / ANSWER</div>
          <h4>${esc(a.title)}</h4>
          <p>${esc(a.body)}</p>
          <div class="answer-cond"><b>适用条件：</b>${a.conditions.map(esc).join(" · ")}</div>
          <div class="answer-source">
            <span class="chip teal">出处：${esc(a.source)}</span>
            <span class="chip green">审核：${esc(a.owner)}</span>
            <span class="chip amber">置信 ${a.confidence}%</span>
          </div>
          <div class="answer-actions">
            <button class="btn sm ghost" data-feedback="up">有用</button>
            <button class="btn sm ghost" data-feedback="down">需要补充</button>
          </div>
        </div>
      </div></div>`;
    }
    return `<div class="msg bot"><div class="msg-avatar">匠</div><div class="bubble">${esc(m.text)}</div></div>`;
  }

  function askQuestion(q) {
    const text = String(q || "").trim();
    if (!text) return;
    state.chat.push({ role: "user", text });
    const lower = text.toLowerCase();
    const hit = answerBank.find((a) => a.keys.some((k) => lower.includes(k)));
    if (hit) {
      state.chat.push({ role: "bot", answer: hit });
      showToast("已匹配到审核过的答案");
    } else {
      state.chat.push({
        role: "bot",
        text: "这个问题还没有审核过的答案。我已经把它记到「待补充问题」，班组长可以转给老师傅；有答案后会回到知识库。",
      });
      showToast("已记录到待补充问题");
    }
    render();
  }

  /* ---------------- capture ---------------- */
  function renderCapture() {
    const step = state.captureStep;
    const steps = [
      ["01", "基本信息", "产品、材料、机台、客户"],
      ["02", "采集", "访谈速记、照片、录音"],
      ["03", "AI 结构化", "参数、条件、动作、异常"],
      ["04", "提交审核", "老师傅签字后发布"],
    ];
    return `<div class="wizard">
      <aside class="steps">
        ${steps.map(([n, t, d], i) => `<div class="step ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}"><div class="step-num">${step > i + 1 ? "✓" : n}</div><div><strong>${t}</strong><span>${d}</span></div></div>`).join("")}
      </aside>
      <section class="panel form-panel">
        ${step === 1 ? captureStep1() : step === 2 ? captureStep2() : step === 3 ? captureStep3() : captureStep4()}
      </section>
    </div>`;
  }

  function captureStep1() {
    return `<div class="form-head"><div class="eyebrow">STEP 01 / 基本信息</div><h2>先记清楚：这是哪条产线的知识</h2><p>没有条件的知识，后面一定会被误用。</p></div>
      <div class="form-grid">
        <div class="field"><label>产品 / 零件</label><input id="capProduct" value="${esc(state.capture.product)}" placeholder="例如：连接器外壳" /></div>
        <div class="field"><label>材料 / 牌号</label><input id="capMaterial" value="${esc(state.capture.material)}" placeholder="例如：PA66-GF30" /></div>
        <div class="field"><label>机台 / 模具</label><input id="capMachine" value="${esc(state.capture.machine)}" placeholder="例如：#03 / M-08" /></div>
        <div class="field"><label>客户 / 内部标准</label><input id="capCustomer" value="${esc(state.capture.customer)}" placeholder="例如：客户 A" /></div>
        <div class="field full"><label>这次要采集什么？</label><textarea id="capNotes" placeholder="例如：夜班尺寸超差的判断与保压调整">${esc(state.capture.notes)}</textarea></div>
      </div>
      <div class="form-actions"><button class="btn amber" data-action="cap-next">下一步：去采集 →</button></div>`;
  }

  function captureStep2() {
    return `<div class="form-head"><div class="eyebrow">STEP 02 / 采集</div><h2>把老师傅的原话留下来</h2><p>不要急着总结；先保留“当时看到了什么、怎么判断、做了什么”。</p></div>
      <div class="form-grid">
        <div class="field full"><label>访谈速记 / 现场描述</label><textarea id="capInterview" style="min-height:150px" placeholder="点“模拟一段访谈”，或直接把老师傅的话记在这里">${esc(state.capture.notes)}</textarea></div>
        <div class="upload">
          <strong>现场照片 / 录音 / 工艺文件</strong>
          拖进来，或点这里选择；MVP 用模拟文件代替。
          <div class="fake-files"><span class="fake-file">🎙 访谈录音 12:38</span><span class="fake-file">📷 现场照片 8 张</span><span class="fake-file">📄 工艺卡 P-03</span></div>
        </div>
      </div>
      <div class="form-actions"><button class="btn ghost" data-action="cap-prev">← 上一步</button><button class="btn ghost" data-action="simulate">模拟一段访谈</button><button class="btn amber" data-action="ai-extract">AI 结构化 →</button></div>`;
  }

  function captureStep3() {
    const e = state.capture.extracted || {
      product: "连接器外壳", material: "PA66-GF30", machine: "#03", customer: "A",
      problem: "夜班尺寸超差", judgment: "模温 < 75°C", action: "保压 3.2→2.6s；周期 35→32s",
      conditions: "夜班环温 < 18°C；模具排气槽刚清理",
    };
    return `<div class="form-head"><div class="eyebrow">STEP 03 / AI 结构化</div><h2>AI 先整理，老师傅再签字</h2><p>AI 只给候选；每条都必须有适用条件，不允许直接发布。</p></div>
      <div class="form-grid">
        <div class="field"><label>产品</label><input id="extProduct" value="${esc(e.product)}" /></div>
        <div class="field"><label>材料</label><input id="extMaterial" value="${esc(e.material)}" /></div>
        <div class="field"><label>机台</label><input id="extMachine" value="${esc(e.machine)}" /></div>
        <div class="field"><label>客户</label><input id="extCustomer" value="${esc(e.customer)}" /></div>
        <div class="field full"><label>问题 / 现象</label><input id="extProblem" value="${esc(e.problem)}" /></div>
        <div class="field full"><label>判断依据</label><input id="extJudgment" value="${esc(e.judgment)}" /></div>
        <div class="field full"><label>处理动作</label><input id="extAction" value="${esc(e.action)}" /></div>
        <div class="field full"><label>适用条件（必须写）</label><textarea id="extConditions">${esc(e.conditions)}</textarea></div>
      </div>
      <div class="ai-box"><div class="eyebrow">AI 提取结果 / 待老师傅审核</div><p>已从访谈中提取 7 个字段、2 个条件。置信度 88%；“模温 < 75°C”需要老周确认。</p></div>
      <div class="form-actions"><button class="btn ghost" data-action="cap-prev">← 上一步</button><button class="btn amber" data-action="submit-capture">提交审核 →</button></div>`;
  }

  function captureStep4() {
    return `<div style="text-align:center;padding:28px 10px 18px">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--green-soft);color:var(--green);display:grid;place-items:center;margin:0 auto 14px;font-size:28px">✓</div>
      <h2 style="margin:0;color:var(--navy)">已提交审核</h2>
      <p class="muted" style="font-size:12px;margin:8px 0 18px">老周会在审核队列里看到这条；他签字后，才会进入知识库。</p>
      <div style="display:flex;gap:8px;justify-content:center"><button class="btn amber" data-view="review">去审核队列</button><button class="btn ghost" data-action="reset-capture">再采一条</button></div>
    </div>`;
  }

  function simulateInterview() {
    state.capture.notes = "夜班做 PA66-GF30 的时候，尺寸老是超差。老周说先别动注射压力，先看模温是不是低于 75 度；如果模温低，保压从 3.2 退到 2.6，周期从 35 降到 32。模具排气槽刚清过的话，第一模要空打。";
    state.capture.product = "连接器外壳";
    state.capture.material = "PA66-GF30";
    state.capture.machine = "#03";
    state.capture.customer = "A";
    render();
    showToast("已填入一段模拟访谈");
  }

  function aiExtract() {
    const notes = $("#capInterview")?.value || state.capture.notes;
    state.capture.notes = notes;
    state.capture.extracted = {
      product: state.capture.product || "连接器外壳",
      material: state.capture.material || "PA66-GF30",
      machine: state.capture.machine || "#03",
      customer: state.capture.customer || "A",
      problem: "夜班尺寸超差",
      judgment: "模温 < 75°C",
      action: "保压 3.2→2.6s；周期 35→32s",
      conditions: "夜班环温 < 18°C；模具排气槽刚清理",
    };
    state.captureStep = 3;
    render();
    showToast("AI 已提取 7 个字段，等待老师傅确认");
  }

  function submitCapture() {
    const val = (id, fallback) => ($(id)?.value || fallback).trim();
    const title = val("#extProblem", "未命名经验") + "：保压调整";
    const item = {
      id: "rq-" + Date.now(),
      title,
      type: "工艺卡片",
      submitter: "我",
      time: "刚刚",
      body: `判断依据：${val("#extJudgment", "")}；处理动作：${val("#extAction", "")}`,
      conditions: val("#extConditions", "").split(/[；;]/).filter(Boolean),
      source: "现场采集 / 待审核",
      confidence: 88,
    };
    state.queue.unshift(item);
    state.captureStep = 4;
    render();
    showToast("已提交审核，老周会收到");
  }

  function resetCapture() {
    state.captureStep = 1;
    state.capture = { product: "", material: "", machine: "", customer: "", notes: "", extracted: null };
    render();
  }

  /* ---------------- review ---------------- */
  function renderReview() {
    if (!state.queue.length) {
      return `<div class="panel" style="padding:36px;text-align:center"><div class="eyebrow">QUEUE CLEAR</div><h2 style="margin:6px 0;color:var(--navy)">审核队列空了</h2><p class="muted" style="font-size:12px">老师傅可以回车间了。新采集的经验会出现在这里。</p><button class="btn ghost" data-view="capture" style="margin-top:14px">去采集一条</button></div>`;
    }
    const selected = state.queue.find((x) => x.id === state.selectedQueue) || state.queue[0];
    state.selectedQueue = selected.id;
    return `<div class="review-grid">
      <section class="panel">
        <div class="panel-head"><div><div class="eyebrow">PENDING / 待审核</div><h2>${state.queue.length} 条等着签字</h2><p>老师傅不签，知识不发布。</p></div><span class="badge amber">按提交时间</span></div>
        <div class="panel-body queue-list">
          ${state.queue.map((item) => `<div class="queue-item ${item.id === selected.id ? "active" : ""}" data-queue="${item.id}">
            <div class="queue-dot"></div>
            <div class="queue-main"><strong>${esc(item.title)}</strong><span>${esc(item.type)} · ${esc(item.submitter)} · ${esc(item.time)}</span></div>
            <span class="badge ${item.type === "异常案例" ? "red" : item.type === "问答" ? "teal" : "amber"}">待审</span>
          </div>`).join("")}
        </div>
      </section>
      <section class="panel review-card">
        <div class="eyebrow">REVIEW / 审核</div>
        <h2>${esc(selected.title)}</h2>
        <div class="meta">${esc(selected.type)} · 提交人 ${esc(selected.submitter)} · ${esc(selected.time)}</div>
        <div class="review-block"><label>内容</label><p>${esc(selected.body)}</p></div>
        <div class="review-block"><label>适用条件</label><div style="display:flex;gap:5px;flex-wrap:wrap">${selected.conditions.map((c) => `<span class="chip amber">${esc(c)}</span>`).join("")}</div></div>
        <div class="review-block"><label>出处 / 置信度</label><p>${esc(selected.source)} · 置信 ${selected.confidence}%</p></div>
        <div class="review-block"><label>审核提示</label><p class="small muted">请确认：条件是否完整、是否涉及安全关键工艺、是否需要补充照片/版本号。</p></div>
        <div class="review-actions">
          <button class="btn amber" data-action="approve">通过并发布</button>
          <button class="btn ghost" data-action="reject">退回补充</button>
          <button class="btn ghost" data-action="open-queue-drawer">看原文</button>
        </div>
      </section>
    </div>`;
  }

  function approveSelected() {
    const item = state.queue.find((x) => x.id === state.selectedQueue);
    if (!item) return;
    const type = item.type === "异常案例" ? "case" : item.type === "问答" ? "qa" : "process";
    state.knowledge.unshift({
      id: "k-" + Date.now(), type, title: item.title, summary: item.body,
      conditions: item.conditions, material: item.conditions[0] || "—", machine: "—", customer: "—",
      owner: "老周", updated: "2026-11-08", confidence: item.confidence, version: "v1",
      body: item.body, steps: [], source: item.source,
    });
    state.queue = state.queue.filter((x) => x.id !== item.id);
    state.selectedQueue = state.queue[0]?.id || "";
    render();
    showToast("已发布，知识库 +1");
  }

  function rejectSelected() {
    const item = state.queue.find((x) => x.id === state.selectedQueue);
    if (!item) return;
    state.queue = state.queue.filter((x) => x.id !== item.id);
    state.selectedQueue = state.queue[0]?.id || "";
    render();
    showToast("已退回补充");
  }

  /* ---------------- onboarding ---------------- */
  function renderOnboarding() {
    const pct = progressPct();
    const team = [
      ["梁", "小梁", `第 3 天 · ${pct}%`, "进行中", "amber"],
      ["杰", "阿杰", "第 5 天 · 71%", "进行中", "teal"],
      ["慧", "小慧", "已完成 · 100%", "已完成", "green"],
    ];
    return `<div class="onboard-grid">
      <section class="panel">
        <div class="panel-head"><div><div class="eyebrow">7 DAYS / 新人路径</div><h2>先学什么，不靠师傅临时想</h2><p>每天 30–45 分钟；班组长可布置、可检查。</p></div><span class="badge amber">第 3 天</span></div>
        <div class="panel-body path-list">
          ${state.onboarding.map((d, di) => `<div class="path-day">
            <div class="day-badge">DAY<br>${d.day}</div>
            <div class="path-main"><strong>${esc(d.title)}</strong><p>${esc(d.desc)}</p>
              <div class="path-tasks">${d.tasks.map((t, ti) => `<label class="check ${t.done ? "done" : ""}"><input type="checkbox" data-task="${di}-${ti}" ${t.done ? "checked" : ""}><span>${esc(t.t)}</span></label>`).join("")}</div>
            </div>
          </div>`).join("")}
        </div>
      </section>
      <aside class="dash-stack">
        <section class="panel progress-card">
          <div class="ring" style="background:conic-gradient(var(--teal) 0 ${pct}%, #eee8dd ${pct}% 100%)"><div><strong>${pct}%</strong><span>完成度</span></div></div>
          <h3>${doneTasks()} / ${totalTasks()} 个任务</h3>
          <p>按这个节奏，第 7 天可以进小测。</p>
        </section>
        <section class="panel">
          <div class="panel-head"><div><div class="eyebrow">TEAM / 班组</div><h2>三个新人</h2></div><span class="badge green">2 人在学</span></div>
          <div class="panel-body">
            ${team.map(([av, name, meta, stateLabel, tone]) => `<div class="team-row"><div class="team-av">${av}</div><div><div class="team-name">${name}</div><div class="team-meta">${meta}</div></div><span class="team-state badge ${tone}">${stateLabel}</span></div>`).join("")}
          </div>
        </section>
        <section class="panel" style="padding:16px">
          <div class="eyebrow">RULE / 带教规则</div>
          <p class="ask-note" style="margin-top:6px">新人先问系统，10 分钟没解决再问师傅；师傅每周只看 1 次“待补充问题”，不被打断。</p>
        </section>
      </aside>
    </div>`;
  }

  /* ---------------- settings ---------------- */
  function renderSettings() {
    return `<div class="settings-grid">
      <section class="panel">
        <div class="panel-head"><div><div class="eyebrow">ACCESS / 角色权限</div><h2>谁能看，谁能改</h2><p>工艺参数是工厂的资产，权限先于功能。</p></div></div>
        <div class="panel-body">
          ${[
            ["厂长 / 决策者", "全部知识、ROI、导出", "可查看"],
            ["老师傅 / 审核人", "采集、审核、版本", "可编辑"],
            ["新人 / 操作员", "问答、学习路径", "仅本车间"],
            ["班组长", "新人进度、交接、提问", "仅本班组"],
            ["客户 / 审厂", "只读导出（脱敏）", "需授权"],
          ].map(([role, scope, level]) => `<div class="setting-row"><div><strong>${role}</strong><span>${scope}</span></div><span class="badge ${level === "可编辑" ? "amber" : level === "可查看" ? "green" : "muted"}">${level}</span></div>`).join("")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><div><div class="eyebrow">DATA / 数据与部署</div><h2>先让工厂放心</h2><p>私有化、脱敏、审计日志，是 B 端的第一道门槛。</p></div></div>
        <div class="panel-body">
          ${[
            ["私有化 / 本地部署", "数据不出厂；支持内网", true],
            ["客户图纸 / 报价不入库", "只采集工艺经验", true],
            ["答案审计日志", "谁改的、何时生效", true],
            ["自动同步到飞书/钉钉", "V2 再做", false],
          ].map(([title, sub, on]) => `<div class="setting-row"><div><strong>${title}</strong><span>${sub}</span></div><button class="switch ${on ? "on" : ""}" data-action="toggle-switch" aria-label="${title}"></button></div>`).join("")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><div><div class="eyebrow">PILOT / 试点信息</div><h2>当前这一家</h2></div></div>
        <div class="panel-body">
          ${[
            ["工厂", "东莞精密注塑（180 人）"],
            ["车间", "一车间 · 3 台注塑机"],
            ["老师傅", "3 位（老周、李师傅、王班长）"],
            ["知识", "50 条问答 / 15 张工艺卡 / 15 个案例"],
            ["试点周期", "第 1–8 周"],
          ].map(([k, v]) => `<div class="setting-row"><div><strong>${k}</strong></div><span class="small muted">${v}</span></div>`).join("")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><div><div class="eyebrow">EXPORT / 导出</div><h2>给审厂/老板的包</h2></div></div>
        <div class="panel-body">
          <p class="ask-note">导出会包含：知识清单、版本记录、培训记录、提问解决率。客户图纸、报价单、配方不会进入导出包。</p>
          <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button class="btn amber" data-action="export">导出试点包</button><button class="btn ghost" data-action="reset-demo">重置演示数据</button></div>
        </div>
      </section>
    </div>`;
  }

  /* ---------------- drawer ---------------- */
  function openDrawer(id) {
    const item = state.knowledge.find((x) => x.id === id);
    if (!item) return;
    $("#drawerEyebrow").textContent = typeMap[item.type];
    $("#drawerTitle").textContent = item.title;
    $("#drawerBody").innerHTML = `
      <div class="drawer-section"><label>一句话</label><p>${esc(item.summary)}</p></div>
      <div class="drawer-section"><label>适用条件</label><div class="conditions">${item.conditions.map((c) => `<span class="chip amber">${esc(c)}</span>`).join("")}</div></div>
      <div class="drawer-section"><label>正文 / 处理步骤</label><p>${esc(item.body)}</p>${item.steps?.length ? `<ol style="margin:10px 0 0 18px;padding:0;font-size:12px;line-height:1.8;color:var(--body)">${item.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}</div>
      <div class="drawer-section"><label>出处</label><p>${esc(item.source)}</p></div>
      <div class="drawer-section"><label>版本记录</label><div class="drawer-history"><div class="history-item"><b>${esc(item.version)}</b> · ${esc(item.updated)} · 审核 ${esc(item.owner)}</div><div class="history-item"><b>v1</b> · 首次发布 · 来自现场访谈</div></div></div>
      <div class="drawer-section"><label>风险提示</label><p class="small muted">涉及安全关键工艺（压力/温度/化学品/特种设备）时，必须由工艺工程师确认；AI 不直接给最终指令。</p></div>
      <div style="display:flex;gap:8px;margin-top:18px"><button class="btn amber" data-ask="${esc(item.title)}">就这个问题问师傅</button><button class="btn ghost" data-action="close-drawer">关闭</button></div>`;
    $("#drawer").classList.remove("hidden");
    $("#drawerOverlay").classList.remove("hidden");
    $("#drawer").setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    $("#drawer").classList.add("hidden");
    $("#drawerOverlay").classList.add("hidden");
    $("#drawer").setAttribute("aria-hidden", "true");
  }

  function showToast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => t.classList.add("hidden"), 2200);
  }

  /* ---------------- events ---------------- */
  document.addEventListener("click", (e) => {
    const nav = e.target.closest("[data-view]");
    if (nav) { setView(nav.dataset.view); return; }
    const open = e.target.closest("[data-open]");
    if (open) { openDrawer(open.dataset.open); return; }
    const tab = e.target.closest("[data-tab]");
    if (tab) { state.knowledgeTab = tab.dataset.tab; render(); return; }
    const filter = e.target.closest("[data-filter]");
    if (filter) { state.filter = filter.dataset.filter; render(); return; }
    const ask = e.target.closest("[data-ask]");
    if (ask) {
      state.view = "ask";
      closeDrawer();
      askQuestion(ask.dataset.ask);
      return;
    }
    const queue = e.target.closest("[data-queue]");
    if (queue) { state.selectedQueue = queue.dataset.queue; render(); return; }
    const fb = e.target.closest("[data-feedback]");
    if (fb) { showToast(fb.dataset.feedback === "up" ? "已标记有用，感谢反馈" : "已记录，会进入待补充问题"); return; }
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (!action) return;
    if (action === "close-drawer") closeDrawer();
    if (action === "cap-next") {
      state.capture.product = $("#capProduct")?.value || "";
      state.capture.material = $("#capMaterial")?.value || "";
      state.capture.machine = $("#capMachine")?.value || "";
      state.capture.customer = $("#capCustomer")?.value || "";
      state.capture.notes = $("#capNotes")?.value || "";
      state.captureStep = 2; render();
    }
    if (action === "cap-prev") { state.captureStep = Math.max(1, state.captureStep - 1); render(); }
    if (action === "simulate") simulateInterview();
    if (action === "ai-extract") aiExtract();
    if (action === "submit-capture") submitCapture();
    if (action === "reset-capture") resetCapture();
    if (action === "approve") approveSelected();
    if (action === "reject") rejectSelected();
    if (action === "open-queue-drawer") {
      const item = state.queue.find((x) => x.id === state.selectedQueue);
      if (item) {
        $("#drawerEyebrow").textContent = item.type;
        $("#drawerTitle").textContent = item.title;
        $("#drawerBody").innerHTML = `<div class="drawer-section"><label>提交人</label><p>${esc(item.submitter)} · ${esc(item.time)}</p></div><div class="drawer-section"><label>内容</label><p>${esc(item.body)}</p></div><div class="drawer-section"><label>适用条件</label><div class="conditions">${item.conditions.map((c) => `<span class="chip amber">${esc(c)}</span>`).join("")}</div></div><div class="drawer-section"><label>出处</label><p>${esc(item.source)}</p></div>`;
        $("#drawer").classList.remove("hidden"); $("#drawerOverlay").classList.remove("hidden");
      }
    }
    if (action === "toggle-switch") e.target.closest(".switch")?.classList.toggle("on");
    if (action === "export") showToast("已生成试点包：知识清单 + 版本记录 + 培训记录");
    if (action === "reset-demo") { location.reload(); }
  });

  document.addEventListener("submit", (e) => {
    if (e.target.id === "askForm") {
      e.preventDefault();
      const input = $("#askInput");
      askQuestion(input?.value || "");
      if (input) input.value = "";
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.id === "roleSelect") {
      state.role = e.target.value;
      if (!roleAllowed(state.view)) state.view = "dashboard";
      render();
      showToast("已切换到" + roleMeta[state.role].name + "视角");
    }
    if (e.target.matches("[data-task]")) {
      const [di, ti] = e.target.dataset.task.split("-").map(Number);
      state.onboarding[di].tasks[ti].done = e.target.checked;
      render();
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "globalSearch") {
      state.search = e.target.value;
      if (state.view === "knowledge") render();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.id === "globalSearch" && e.key === "Enter") {
      setView("knowledge");
    }
  });

  $("#drawerOverlay").addEventListener("click", closeDrawer);

  const params = new URLSearchParams(location.search);
  const initialRole = params.get("role");
  if (initialRole && roleMeta[initialRole]) state.role = initialRole;
  const initialView = params.get("view");
  if (initialView && viewMeta[initialView] && roleAllowed(initialView)) state.view = initialView;
  const initialStep = Number(params.get("step"));
  if (state.view === "capture" && initialStep >= 1 && initialStep <= 4) state.captureStep = initialStep;
  $("#roleSelect").value = state.role;
  render();
})();
