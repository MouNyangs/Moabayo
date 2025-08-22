document.addEventListener('DOMContentLoaded', () => {
  // THEME
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) html.setAttribute('data-theme', saved);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', cur);
      localStorage.setItem('theme', cur);
    });
  }

  // ELEMENTS
  const els = {
    list : document.getElementById('cardList'),
    cover: document.getElementById('dCover'),
    title: document.getElementById('dTitle'),
    bank : document.getElementById('dBank'),
    benefit: document.getElementById('dBenefit'),
    limit: document.getElementById('dLimit'),
    point: document.getElementById('dPoint'),
    state: document.getElementById('dState'),
    stSel: document.getElementById('stSelected'),
    stFav: document.getElementById('stFav'),
    stNext: document.getElementById('stNext'),
    btnFav: document.getElementById('btnFav'),
    btnShare: document.getElementById('btnShare'),
    reset: document.getElementById('resetBtn'),
  };

  if (!els.list) return;

  let selected = null;
  let favored  = false;

  function renderStatus(){
    if (els.stSel) {
      els.stSel.classList.toggle('active', !!selected);
      els.stSel.innerHTML = `<span class="dot"></span>${selected ? ' 선택됨: ' + (selected.dataset.title || '') : ' 선택된 카드 없음'}`;
    }
    if (els.stFav) {
      els.stFav.classList.toggle('fav', favored);
      els.stFav.innerHTML = `<span class="dot"></span>즐겨찾기: ${favored ? '켜짐' : '꺼짐'}`;
    }
    if (els.stNext) {
      const next = selected?.dataset.next || '-';
      els.stNext.innerHTML = `<span class="dot"></span>다음 납부일: ${next}`;
    }
  }

  function setStateBadge(stateText){
    if (!els.state) return;
    const st = (stateText || '').toLowerCase();
    els.state.className = 'badge'; // reset
    if (st === 'active') els.state.classList.add('state-active');
    else if (st === 'frozen') els.state.classList.add('state-frozen');
    else if (st === 'lost') els.state.classList.add('state-lost');
    els.state.textContent = st === 'active' ? '사용중'
                         : st === 'frozen' ? '정지'
                         : st === 'lost'   ? '분실 신고'
                         : '-';
  }

  function clearActive(){
    document.querySelectorAll('.card.is-active').forEach(el=>el.classList.remove('is-active'));
  }

  function fillDetail(card){
    if (!card) return;
    if (els.cover)   els.cover.style.backgroundImage = card.dataset.img ? `url('${card.dataset.img}')` : '';
    if (els.title)   els.title.textContent = card.dataset.title || '카드';
    if (els.bank)    els.bank.textContent  = card.dataset.bank || '';
    if (els.benefit) els.benefit.textContent = card.dataset.benefit || '-';
    if (els.limit)   els.limit.textContent   = card.dataset.limit || '-';
    if (els.point)   els.point.textContent   = card.dataset.point || '-';
    setStateBadge(card.dataset.state || '');
  }

  function onSelect(card){
    selected = card;
    clearActive();
    card.classList.add('is-active');
    fillDetail(card);
    renderStatus();
  }

  // 클릭/키보드 선택
  els.list.addEventListener('click', (e)=>{
    const card = e.target.closest('.card');
    if (card) onSelect(card);
  });
  els.list.addEventListener('keydown', (e)=>{
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('card')) {
      e.preventDefault(); onSelect(e.target);
    }
  });

  // 즐겨찾기 / 공유 / 초기화
  if (els.btnFav) els.btnFav.addEventListener('click', ()=>{
    if(!selected){ alert('카드를 먼저 선택하세요.'); return; }
    favored = !favored; renderStatus();
    // TODO: 서버 즐겨찾기 저장
  });

  if (els.btnShare) els.btnShare.addEventListener('click', async ()=>{
    if(!selected){ alert('카드를 먼저 선택하세요.'); return; }
    const text = `내 카드: ${selected.dataset.title} | 상태:${els.state?.textContent || '-'} | 한도:${selected.dataset.limit || '-'} | 다음 납부:${selected.dataset.next || '-'}`;
    try{
      if(navigator.share) await navigator.share({ title:'모으냥즈 내 카드', text, url: location.href });
      else { await navigator.clipboard.writeText(text); alert('카드 상태가 복사되었습니다.'); }
    }catch(_){}
  });

  if (els.reset) els.reset.addEventListener('click', ()=>{
    selected = null; favored = false;
    if (els.cover) els.cover.style.backgroundImage = '';
    if (els.title) els.title.textContent = '카드를 선택하세요';
    if (els.bank)  els.bank.textContent  = '은행/발급사';
    if (els.benefit) els.benefit.textContent = '-';
    if (els.limit)   els.limit.textContent   = '-';
    if (els.point)   els.point.textContent   = '-';
    if (els.state){ els.state.className = 'badge'; els.state.textContent = '-'; }
    renderStatus(); clearActive();
  });

  // 초기
  renderStatus();
  const first = els.list.querySelector('.card');
  if (first) onSelect(first);
});

// --- [추가] 금액 파서: "633,000원 / 1,000,000원" -> {used:633000, total:1000000}
function parseLimitText(txt){
  if(!txt) return { used:0, total:0 };
  const parts = String(txt).split('/');
  const toNum = s => Number(String(s).replace(/[^\d]/g,'') || 0);
  const used  = toNum(parts[0]);
  const total = toNum(parts[1]);
  return { used, total };
}

// --- [추가] 진행률 바 업데이트
function updateLimitBar(limitText){
  const bar   = document.getElementById('limitBar');
  const label = document.getElementById('limitLabel');
  if(!bar || !label){ return; }

  const { used, total } = parseLimitText(limitText);
  const pct = (!total || used<0) ? 0 : Math.min(100, Math.round((used/total)*100));

  // 색상 단계(70%↑ 경고, 90%↑ 위험)
  bar.classList.remove('is-warn','is-danger');
  if (pct >= 90) bar.classList.add('is-danger');
  else if (pct >= 70) bar.classList.add('is-warn');

  bar.style.width = pct + '%';
  label.textContent = pct + '%';
}
function fillDetail(card){
  if (!card) return;
  // ...기존 세팅들...
  if (els.limit) els.limit.textContent = card.dataset.limit || '-';
  // 한도 진행률 바 반영
  updateLimitBar(card.dataset.limit || '');
}
if (els.reset) els.reset.addEventListener('click', ()=>{
  // ...기존 초기화...
  updateLimitBar('0 / 0');
});
/* =============================
   Fireflies (dark only)
   ============================= */
(function(){
  const canvas = document.getElementById('fireflies');
  if(!canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let w = 0, h = 0, rafId = null, running = false;

  const MAX = 26;       // 반딧불 개수
  const SPEED = 0.18;   // 기본 속도
  const GLOW = 28;      // 그림자 블러
  let bugs = [];

  function resize(){
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max){ return Math.random() * (max - min) + min; }

  function spawn(i=0){
    const palette = [
      getCssVar('--glow-1') || '#9a8cff',
      getCssVar('--glow-2') || '#ffd166',
      getCssVar('--glow-3') || '#6ee7ff',
    ];
    return {
      x: rand(0,w), y: rand(0,h),
      vx: rand(-SPEED,SPEED), vy: rand(-SPEED,SPEED),
      r: rand(1.2, 2.2),  // 반지름
      color: palette[i % palette.length],
      twinkle: rand(.4, 1), // 깜빡임 위상
    };
  }

  function getCssVar(name){
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function init(){
    bugs = Array.from({length: MAX}, (_,i)=>spawn(i));
  }

  function step(t){
    ctx.clearRect(0,0,w,h);
    for(let b of bugs){
      // 이동
      b.x += b.vx; b.y += b.vy;

      // 가장자리에서 되튐
      if(b.x < -10 || b.x > w+10) b.vx *= -1;
      if(b.y < -10 || b.y > h+10) b.vy *= -1;

      // 미세한 가속/방향 전환
      b.vx += rand(-.02, .02);
      b.vy += rand(-.02, .02);

      // 깜빡임
      const a = 0.35 + 0.35 * Math.sin(t*0.002 + b.twinkle*6.28);

      // 그리기 (부드러운 글로우)
      ctx.beginPath();
      ctx.fillStyle = b.color;
      ctx.globalAlpha = a;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = GLOW;
      ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(step);
  }

  function start(){
    if(running) return;
    running = true;
    resize(); init();
    rafId = requestAnimationFrame(step);
  }

  function stop(){
    running = false;
    if(rafId) cancelAnimationFrame(rafId);
    ctx.clearRect(0,0,w,h);
  }

  // 반응형
  window.addEventListener('resize', ()=>running && resize());

  // 테마 변경을 감지해 dark에서만 동작
  const html = document.documentElement;
  const observer = new MutationObserver(()=>{
    const dark = html.getAttribute('data-theme') === 'dark';
    dark ? start() : stop();
  });
  observer.observe(html, { attributes:true, attributeFilter:['data-theme'] });

  // 초기 상태
  const isDark = html.getAttribute('data-theme') === 'dark';
  if(isDark) start();
})();
