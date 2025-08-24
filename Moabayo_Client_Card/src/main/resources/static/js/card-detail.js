/* ============ Theme toggle (auto ↔ dark ↔ light) ============ */
(function themeToggle(){
  const html = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  if(!btn) return;

  // 초기 상태: localStorage → 없으면 auto
  const saved = localStorage.getItem('moa.theme') || 'auto';
  html.setAttribute('data-theme', saved);

  // 버튼 아이콘 상태
  const render = () => {
    const mode = html.getAttribute('data-theme') || 'auto';
    btn.querySelector('.on').style.display  = (mode === 'dark') ? 'inline' : 'none';
    btn.querySelector('.off').style.display = (mode === 'light') ? 'inline' : 'none';
    if(mode === 'auto'){ btn.querySelector('.on').style.display = btn.querySelector('.off').style.display = 'inline'; }
  };
  render();

  // 순환: auto → dark → light → auto
  btn.addEventListener('click', () => {
    const cur = html.getAttribute('data-theme') || 'auto';
    const next = (cur === 'auto') ? 'dark' : (cur === 'dark') ? 'light' : 'auto';
    html.setAttribute('data-theme', next);
    localStorage.setItem('moa.theme', next);
    render();
  });
})();

/* ============ Optional: cardId 쿼리로 CTA 링크 연동 ============ */
(function linkParams(){
  const qs = new URLSearchParams(location.search);
  const id = qs.get('cardId');
  if(!id) return;
  const apply = document.getElementById('applyBtn');
  const terms = document.getElementById('termsBtn');
  if(apply) apply.href = `/cards/${id}/apply`;
  if(terms) terms.href = `/cards/${id}/terms`;
})();

/* ============ Optional: 샘플 데이터 바인딩 훅 (필요 시 교체) ============ */
// 서버에서 모델 바인딩하면 이 블록은 삭제해도 됩니다.
(function sampleData(){
  // 예시로 제목/발급사/적합도만 교체
  const title  = document.getElementById('cardTitle');
  const issuer = document.getElementById('cardIssuer');
  const fit    = document.getElementById('fitScore');
  if(title)  title.textContent  = title.textContent || 'Moa Plus';
  if(issuer) issuer.textContent = issuer.textContent || 'Moa Card';
  if(fit)    fit.textContent    = fit.textContent || '91%';
})();
