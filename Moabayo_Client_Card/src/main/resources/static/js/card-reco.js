// === card-reco.js (Python → Chart.js용) =====================================

// 색상 토큰
function cssVar(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
const COL = { brand: cssVar('--brand') || '#7c3aed', ink: cssVar('--ink') || '#111827', sub: cssVar('--sub') || '#6b7280' };

// D-day
function startDday(days, elId){
  const el = document.getElementById(elId);
  if(!el) return;
  const end = Date.now() + days*864e5;
  (function tick(){
    const left = Math.max(0, end - Date.now());
    el.textContent = `D-${Math.ceil(left/864e5)}`;
    if(left > 0) requestAnimationFrame(tick);
  })();
}

// 공통 미니 차트 옵션
function miniOpts({ showXTicks=false } = {}){
  return {
    plugins:{ legend:{display:false}, tooltip:{enabled:true} },
    responsive:true, maintainAspectRatio:false,
    layout:{ padding:{ top:8, right:8, bottom: showXTicks ? 22 : 12, left:8 } },
    scales:{
      x:{ grid:{ display:false },
          ticks:{ display:showXTicks, color:COL.sub, font:{size:11}, maxRotation:0, autoSkip:false, padding:4 } },
      y:{ grid:{ display:false }, ticks:{ display:true, beginAtZero:true, color:COL.ink, font:{size:11} } }
    },
    clip:false
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  startDday(7, 'dday');  
  startDday(7, 'dday2');

  // ======================
  // Python API에서 데이터 가져오기
  // ======================
  const baseUrl = "http://localhost:8809/csv";

  async function fetchJson(path){
    const res = await fetch(`${baseUrl}/${path}`);
    return await res.json();
  }

  const [ageData, regionData, timeData] = await Promise.all([
    fetchJson('age'),
    fetchJson('region'),
    fetchJson('time')
  ]);

  // ======================
  // 연령별 차트
  // ======================
  const ageCtx = document.getElementById('ageChart');
  if(ageCtx && ageData.length){
    new Chart(ageCtx, {
      type:'bar',
      data:{
        labels: ageData.map(d=>d.age),
        datasets:[{ data: ageData.map(d=>d.card_TOTAL), backgroundColor:COL.brand, borderRadius:6 }]
      },
      options: miniOpts({ showXTicks:true })
    });
  }

  // ======================
  // 지역별 차트
  // ======================
  const regionCtx = document.getElementById('regionChart');
  if(regionCtx && regionData.length){
    new Chart(regionCtx, {
      type:'bar',
      data:{
        labels: regionData.map(d=>d.sido),
        datasets:[{ data: regionData.map(d=>d.card_TOTAL), backgroundColor:COL.brand, borderRadius:6 }]
      },
      options: miniOpts({ showXTicks:true })
    });
  }

  // ======================
  // 시간대별 차트
  // ======================
  const timeCtx = document.getElementById('timeChart');
  if(timeCtx && timeData.length){
    new Chart(timeCtx, {
      type:'bar',
      data:{
        labels: timeData.map(d=>d.time),
        datasets:[{ data: timeData.map(d=>d.card_TOTAL), backgroundColor:COL.brand, borderRadius:6 }]
      },
      options: miniOpts({ showXTicks:true })
    });
  }
});
