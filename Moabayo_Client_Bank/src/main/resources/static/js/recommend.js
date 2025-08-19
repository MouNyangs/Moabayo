/* ===== 상태 ===== */
const state = {
  age: "20s",
  gender: "F",
  region: "서울",
  time: "noon"
};

/* ===== 목업 데이터 (세그먼트 예시) ===== */
const mock = {
  "20s_F_서울_noon": {
    kpis: { spend: 1240000, topCat: "외식 · 카페", peak: "점심 12:00", cohort: 7582 },
    donut: { labels: ["외식", "쇼핑", "교통", "생활", "여가"], data: [32, 28, 14, 16, 10] },
    bar:   { labels: ["아침", "점심", "저녁", "심야"], data: [22, 48, 38, 12] },
    line:  { labels: ["월","화","수","목","금","토","일"], data: [165,182,176,198,210,230,184] },
    products: [
      { bank:"모으냥은행", name:"냥청년 적금 12M", rate:"4.6%", tags:["만 34세 이하","자동이체 +0.5%p"], cta:"#", detail:"#"},
      { bank:"모으냥은행", name:"야식냥 체크카드", rate:"외식 10% 적립", tags:["점심/저녁 집중","월 한도 2만"], cta:"#", detail:"#"},
      { bank:"모으냥은행", name:"냥플렉스 자유적금", rate:"최대 4.0%", tags:["자유납입","잔돈 모으기"], cta:"#", detail:"#"}
    ]
  },
  "30s_M_경기_evening": {
    kpis: { spend: 1780000, topCat: "생활 · 주유", peak: "저녁 19:00", cohort: 5290 },
    donut: { labels: ["생활", "주유", "교통", "외식", "여가"], data: [30, 22, 18, 16, 14] },
    bar:   { labels: ["아침", "점심", "저녁", "심야"], data: [20, 26, 52, 18] },
    line:  { labels: ["월","화","수","목","금","토","일"], data: [210,205,220,240,265,250,200] },
    products: [
      { bank:"모으냥은행", name:"출퇴근냥 주유카드", rate:"주유 12% 캐시백", tags:["주유소 가맹점","월 3만 한도"], cta:"#", detail:"#"},
      { bank:"모으냥은행", name:"패밀리 적금 24M", rate:"4.2%", tags:["자녀 우대","공과금 자동납부 +0.3%p"], cta:"#", detail:"#"},
      { bank:"모으냥은행", name:"하이브리드 통장", rate:"체크+예금 통합", tags:["생활비 통합관리"], cta:"#", detail:"#"}
    ]
  }
};

/* ===== 유틸 ===== */
const fmtWon = v => "₩ " + v.toLocaleString();

/* ===== 차트 인스턴스 ===== */
let donutChart, barChart, lineChart;

/* ===== 초기화 ===== */
document.addEventListener("DOMContentLoaded", () => {
  // D-day 가벼운 카운트다운(7일 기준)
  startCountdown(7);

  bindFilters();
  const data = getData();
  applyKpis(data.kpis);
  mountCharts(data);
  renderProducts(data.products);
});

/* ===== 필터 바인딩 ===== */
function bindFilters(){
  // chip/seg 버튼
  document.querySelectorAll(".chip-group, .seg-group").forEach(group=>{
    group.addEventListener("click", (e)=>{
      const btn = e.target.closest("button");
      if(!btn) return;
      [...group.querySelectorAll("button")].forEach(b=>b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state[group.dataset.key] = btn.dataset.value;
      refresh();
    });
  });
  // select
  document.querySelectorAll(".select").forEach(sel=>{
    sel.addEventListener("change", ()=>{
      state[sel.dataset.key] = sel.value;
      refresh();
    });
  });
}

/* ===== 데이터 선택 ===== */
function getData(){
  const key = `${state.age}_${state.gender}_${state.region}_${state.time}`;
  // 없으면 기본 세트 반환(20s_F_서울_noon)
  return mock[key] || mock["20s_F_서울_noon"];
}

/* ===== KPI 적용 ===== */
function applyKpis(k){
  document.getElementById("kpiSpend").textContent = fmtWon(k.spend);
  document.getElementById("kpiTopCat").textContent = k.topCat;
  document.getElementById("kpiPeak").textContent = k.peak;
  document.getElementById("kpiCohort").textContent = k.cohort.toLocaleString() + "명";
}

/* ===== 차트 마운트/업데이트 ===== */
function mountCharts(d){
  const donutCtx = document.getElementById("donutChart");
  const barCtx   = document.getElementById("barChart");
  const lineCtx  = document.getElementById("lineChart");

  // 공통 옵션
  const gridColor = getComputedStyle(document.documentElement).getPropertyValue("--line").trim();
  const tickColor = getComputedStyle(document.documentElement).getPropertyValue("--sub").trim();

  donutChart = new Chart(donutCtx, {
    type: "doughnut",
    data: {
      labels: d.donut.labels,
      datasets: [{ data: d.donut.data }]
    },
    options: {
      plugins:{ legend:{ position:"bottom", labels:{ color: tickColor } } },
      cutout: "62%"
    }
  });

  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: d.bar.labels,
      datasets: [{ data: d.bar.data }]
    },
    options: {
      scales:{
        x:{ grid:{ color:gridColor }, ticks:{ color:tickColor } },
        y:{ grid:{ color:gridColor }, ticks:{ color:tickColor }, beginAtZero:true }
      },
      plugins:{ legend:{ display:false } }
    }
  });

  lineChart = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: d.line.labels,
      datasets: [{ data: d.line.data, tension:.35, fill:false, pointRadius:3 }]
    },
    options: {
      scales:{
        x:{ grid:{ color:gridColor }, ticks:{ color:tickColor } },
        y:{ grid:{ color:gridColor }, ticks:{ color:tickColor }, beginAtZero:false }
      },
      plugins:{ legend:{ display:false } }
    }
  });
}

function updateCharts(d){
  donutChart.data.labels = d.donut.labels;
  donutChart.data.datasets[0].data = d.donut.data;
  donutChart.update();

  barChart.data.labels = d.bar.labels;
  barChart.data.datasets[0].data = d.bar.data;
  barChart.update();

  lineChart.data.labels = d.line.labels;
  lineChart.data.datasets[0].data = d.line.data;
  lineChart.update();
}

/* ===== 추천 상품 렌더링 ===== */
function renderProducts(items){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = items.map(p => `
    <article class="pcard">
      <span class="badge tag">이벤트</span>
      <div class="bank">${p.bank}</div>
      <h4>${p.name}</h4>
      <div class="rate">${p.rate}</div>
      <ul class="perks">
        ${p.tags.map(t=>`<li>• ${t}</li>`).join("")}
      </ul>
      <div class="actions">
        <a class="btn btn-primary" href="${p.cta}">가입하기</a>
        <a class="btn btn-outline" href="${p.detail}">자세히</a>
      </div>
    </article>
  `).join("");
}

/* ===== 새 세그먼트로 새로고침 ===== */
function refresh(){
  const data = getData();
  applyKpis(data.kpis);
  updateCharts(data);
  renderProducts(data.products);
}

/* ===== 간단 D-day ===== */
function startCountdown(days){
  const end = Date.now() + days*24*60*60*1000;
  const el = document.getElementById("dday");
  const tick = () => {
    const remain = Math.max(0, end - Date.now());
    const d = Math.ceil(remain / (24*60*60*1000));
    el.textContent = `D-${d}`;
    if(remain>0) requestAnimationFrame(tick);
  };
  tick();
}

/* ===== 실데이터 주입용 API =====
  파이썬/백엔드에서 분석 결과를 아래 포맷으로 넘기면 즉시 반영됩니다.
  window.renderInsights({
    kpis:{spend:1234000, topCat:"외식", peak:"저녁 19:00", cohort:5321},
    donut:{labels:["외식","쇼핑","교통","생활","여가"], data:[30,25,20,15,10]},
    bar:{labels:["아침","점심","저녁","심야"], data:[10,40,45,12]},
    line:{labels:["월","화","수","목","금","토","일"], data:[160,170,180,200,220,210,190]},
    products:[{bank:"", name:"", rate:"", tags:[], cta:"#", detail:"#"}, ...]
  })
================================================= */
window.renderInsights = function(payload){
  applyKpis(payload.kpis);
  updateCharts(payload);
  renderProducts(payload.products);
};
