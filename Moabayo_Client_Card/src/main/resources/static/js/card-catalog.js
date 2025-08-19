// 토큰
function cssVar(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
const COL = { brand: cssVar('--brand') || '#7c3aed' };

// 이미지 주입 (data-img가 있으면 썸네일 배경으로)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.kcard').forEach(card=>{
    const url = card.getAttribute('data-img');
    if(url) card.querySelector('.thumb').style.backgroundImage = `url("${url}")`;
  });
});

// 필터/검색 (간단 목업)
document.addEventListener('DOMContentLoaded', () => {
  const chips = document.querySelectorAll('.chip');
  chips.forEach(ch=> ch.addEventListener('click', ()=>{
    chips.forEach(c=>c.classList.remove('is-active'));
    ch.classList.add('is-active');
    applyFilter();
  }));
  document.getElementById('q').addEventListener('input', applyFilter);
  function applyFilter(){
    const tag = document.querySelector('.chip.is-active')?.dataset.filter || 'all';
    const q = (document.getElementById('q').value||'').trim().toLowerCase();
    document.querySelectorAll('.kcard').forEach(el=>{
      const tags = (el.dataset.tags||'').toLowerCase();
      const name = el.querySelector('.name')?.textContent.toLowerCase() || '';
      const passTag = tag==='all' || tags.includes(tag);
      const passQ = !q || tags.includes(q) || name.includes(q);
      el.style.display = (passTag && passQ) ? '' : 'none';
    });
  }
  applyFilter();
});

// Flip (카드 클릭 / 뒤로 버튼)
document.addEventListener('click', (e)=>{
  const backBtn = e.target.closest('.flip-back');
  if(backBtn){
    backBtn.closest('.kcard')?.classList.remove('is-flipped');
    return;
  }
  const card = e.target.closest('.kcard');
  const cta  = e.target.closest('.apply-btn');
  if(cta){ sparkleBurstFrom(cta); return; } // CTA 클릭은 버스트만
  if(card){ card.classList.toggle('is-flipped'); }
}, {passive:true});

// 스파클·리플 버스트
function sparkleBurstFrom(btn){
  const rect = btn.getBoundingClientRect();
  const x = rect.left + rect.width/2;
  const y = rect.top  + rect.height/2;

  const overlay = document.createElement('div');
  overlay.className = 'fx-overlay';
  const burst = document.createElement('div');
  burst.className = 'fx-burst';
  burst.style.left = x + 'px';
  burst.style.top  = y + 'px';
  overlay.appendChild(burst);
  document.body.appendChild(overlay);

  const ripple = document.createElement('div');
  ripple.className = 'fx-ripple';
  burst.appendChild(ripple);

  const colors = [COL.brand, '#8b5cf6', '#22d3ee', '#f59e0b', '#10b981', '#ef4444'];
  const N = 26;
  for(let i=0;i<N;i++){
    const s = document.createElement('div');
    s.className = 'fx-spark ' + (Math.random()<0.3 ? 'star' : 'dot');
    s.style.color = colors[(Math.random()*colors.length)|0];
    burst.appendChild(s);

    const ang  = (i/N)*Math.PI*2 + (Math.random()-.5)*0.6;
    const dist = 90 + Math.random()*80;
    const dx = Math.cos(ang)*dist, dy = Math.sin(ang)*dist;
    const dur = 650 + Math.random()*500;

    s.animate(
      [
        { transform:'translate(-50%,-50%) scale(.8)', opacity:1 },
        { offset:.7, opacity:1 },
        { transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.2)`, opacity:0 }
      ],
      { duration:dur, easing:'cubic-bezier(.22,1,.36,1)', fill:'forwards' }
    ).onfinish = () => s.remove();
  }
  setTimeout(()=> overlay.remove(), 1200);
}
