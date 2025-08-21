(() => {
  const $  = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));

  // ----- 목업 데이터 (API 연동 시 교체) -----
  const CARDS = [
    { id:'c1122', brand:'MoaNyangz', last4:'1122', expire:'12/29', holder:'CAT LOVER',
      skin1:'#0ea5e9', skin2:'#6366f1',
      limit:{ used:633000, max:1000000 },
      point:{ now:8220, next:'+3%' },
      bill:{ date:'09/05 (금)', min:150000 }
    },
    { id:'c7788', brand:'MoaNyangz', last4:'7788', expire:'03/28', holder:'CAT LOVER',
      skin1:'#fde68a', skin2:'#f5d0fe',
      limit:{ used:720000, max:1500000 },
      point:{ now:12400, next:'+3%' },
      bill:{ date:'08/30 (토)', min:90000 }
    },
    { id:'c3344', brand:'MoaNyangz', last4:'3344', expire:'08/31', holder:'CAT LOVER',
      skin1:'#111827', skin2:'#1f2937',
      limit:{ used:480000, max:800000 },
      point:{ now:6400, next:'+2%' },
      bill:{ date:'09/01 (일)', min:120000 }
    }
  ];

  // ----- 엘리먼트 -----
  const rail = $('#cardRail');
  const heroNumber = $('#hNumber');
  const heroHolder = $('#hHolder');
  const heroExpire = $('#hExpire');
  const usedAmt = $('#usedAmt'), limitAmt = $('#limitAmt'), limitBar = $('#limitBar');
  const pointAmt = $('#pointAmt'), nextTier = $('#nextTier'), pointBar = $('#pointBar');
  const dueDate = $('#dueDate'), minPay = $('#minPay');
  const txList = $('#txList');
  const pageBg = $('#pageBg');   // << 추가
  // 상태
  let active = 0;

  // ----- 렌더 -----
  function renderRail(){
    rail.innerHTML = CARDS.map((c,i)=> `
      <li class="card-mini" role="option" aria-selected="${i===active}" tabindex="${i===active?0:-1}"
          data-idx="${i}"
          style="--skin1:${c.skin1}; --skin2:${c.skin2}">
        <div class="skin"></div>
        <div class="brand">${c.brand}</div>
        <div class="last4">•••• ${c.last4}</div>
        <div class="exp">${c.expire}</div>
      </li>
    `).join('');
  }

  function applyHero(){
    const c = CARDS[active];
    heroNumber.textContent = `**** **** **** ${c.last4}`;
    heroHolder.textContent = c.holder;
    heroExpire.textContent = c.expire;

    // overview
    usedAmt.textContent  = `${c.limit.used.toLocaleString()}원`;
    limitAmt.textContent = `${c.limit.max.toLocaleString()}원`;
    limitBar.style.width = `${Math.min(100, c.limit.used / c.limit.max * 100)}%`;

    pointAmt.textContent = `${c.point.now.toLocaleString()}p`;
    nextTier.textContent = c.point.next;
    pointBar.style.width = `${Math.min(100, c.point.now / 15000 * 100)}%`; // 임의 기준치

    dueDate.textContent = c.bill.date;
    minPay.textContent  = `${c.bill.min.toLocaleString()}원`;

	pageBg?.style.setProperty('--pageA', CARDS[active].skin1);
	pageBg?.style.setProperty('--pageB', CARDS[active].skin2);
    // history (데모 3개)
    txList.innerHTML = [
      {n:'문방구', cat:'문구', amt:16800},
      {n:'냉커피', cat:'음료', amt:5200},
      {n:'택시',   cat:'교통', amt:7800},
    ].map(r=>`
      <li>
        <div class="left">
          <div class="logo"></div>
          <div>
            <div class="name">${r.n}</div>
            <div class="cat">${r.cat}</div>
          </div>
        </div>
        <div class="amt">${r.amt.toLocaleString()}원</div>
      </li>
    `).join('');
  }

  function setActive(idx){
    active = idx;
    $$('.card-mini', rail).forEach((el,i)=>{
      el.setAttribute('aria-selected', i===active ? 'true' : 'false');
      el.tabIndex = i===active ? 0 : -1;
    });
    applyHero();
  }

  // 이벤트
  function bind(){
    rail.addEventListener('click', e=>{
      const li = e.target.closest('.card-mini');
      if(!li) return;
      setActive(+li.dataset.idx);
    });

    // 탭
    const tabs = $$('.tab');
    tabs.forEach(t => t.addEventListener('click', ()=>{
      tabs.forEach(x=>{ x.classList.remove('active'); x.setAttribute('aria-selected','false'); });
      t.classList.add('active'); t.setAttribute('aria-selected','true');
      const name = t.dataset.tab;
      $$('.panel').forEach(p=>p.classList.remove('show'));
      $('#panel-'+name).classList.add('show');
    }));

    // 저장 (데모)
    $('#btnSave')?.addEventListener('click', ()=>{
      alert('저장되었습니다 (데모)');
    });
  }

  // init
  renderRail();
  bind();
  applyHero();
})();

// === 페이지 배경 제어용 노드 ===
const root   = document.getElementById('mycards');   // <section id="mycards">
const pageBg = document.getElementById('pageBg');    // <div id="pageBg" class="page-bg">

// 배경 모드 선택: 'poster' | 'spread' | 'flat'
setPageBG('poster');   // ← 원하면 'spread' 또는 'flat' 로 바꾸면 됨

function setPageBG(mode = 'poster'){
  root && root.setAttribute('data-bg', mode);
}

// 활성 카드의 2가지 색을 CSS 변수로 연결
function updatePageBG(colors){
  // colors: { a, b } or { skin1, skin2 }
  const c1 = colors?.a     || colors?.skin1 || '#7c3aed';
  const c2 = colors?.b     || colors?.skin2 || '#60a5fa';
  pageBg && pageBg.style.setProperty('--pageA', c1);
  pageBg && pageBg.style.setProperty('--pageB', c2);
}

// 처음 로딩 시
let active = 0;                         // 너희 쪽 활성 인덱스 쓰면 됨
updatePageBG(CARDS[active]);

// 카드가 바뀌는 곳(예: selectCard, onClick 등)에 한 줄만 추가
function onSelectCard(idx){
  active = idx;
  updatePageBG(CARDS[idx]);            // ✅ 배경 업데이트
  // ... 기존 처리(히어로/내역 렌더 등)
}

// 섹션/앰비언트 노드
const mycardsRoot = document.getElementById('mycards');
const ambient = document.getElementById('ambient');

// (A) 활성 카드 색을 배경 변수로 주입
function updateAmbientColors(colors){
  const a = colors?.a || colors?.skin1 || '#7c3aed';
  const b = colors?.b || colors?.skin2 || '#60a5fa';
  if (ambient){
    ambient.style.setProperty('--pageA', a);
    ambient.style.setProperty('--pageB', b);
  }
}

/* 이미 updatePageBG가 있다면 이렇게 살짝 수정해도 됨:
function updatePageBG(colors){
  const c1 = colors?.a || colors?.skin1 || '#7c3aed';
  const c2 = colors?.b || colors?.skin2 || '#60a5fa';
  // 기존 pageBg 갱신 …
  if (ambient){
    ambient.style.setProperty('--pageA', c1);
    ambient.style.setProperty('--pageB', c2);
  }
}
*/

// (B) 섹션 내 마우스 움직임에 따라 배경 하이라이트가 살짝 따라오게
if (mycardsRoot){
  mycardsRoot.addEventListener('pointermove', (e)=>{
    const r = mycardsRoot.getBoundingClientRect();
    const mx = (e.clientX - r.left)/r.width  - .5;   // -0.5 ~ 0.5
    const my = (e.clientY - r.top )/r.height - .5;
    mycardsRoot.style.setProperty('--mx', mx.toFixed(3));
    mycardsRoot.style.setProperty('--my', my.toFixed(3));
  });
}

// (C) 페이지 진입 시/카드 변경 시 한 줄만 호출해주면 끝!
// 예시) 초기 렌더
// updateAmbientColors({ a:'#60a5fa', b:'#a78bfa' });

// 예시) 카드 선택 함수 안
// function onSelectCard(idx){
//   const card = CARDS[idx];           // { skin1, skin2, … }
//   updateAmbientColors({ a: card.skin1, b: card.skin2 });
//   // … 기존 렌더 로직
// }
