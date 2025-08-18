// 다크모드 유지(공용 토글과 호환)
(() => {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    if (saved === 'dark') document.body.classList.add('dark');
  }
})();

// 잔액 숫자 애니메이션 (있을 때만)
(() => {
  const el = document.querySelector('.bank-index .balance');
  if (!el) return;
  const raw = el.getAttribute('data-balance');
  const target = raw ? parseInt(raw, 10) : NaN;
  if (isNaN(target)) return;

  const start = performance.now();
  const dur = 900;
  const fmt = n => n.toLocaleString('ko-KR');

  function step(t) {
    const p = Math.min(1, (t - start)/dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(target * eased);
    el.textContent = `${fmt(val)} 원`;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();
