// js/token-exp-display.js
(function () {
  console.log('[JWT] token-exp-display loaded');

  function getStoredToken() {
    const raw = localStorage.getItem('token');
    if (!raw) return null;
    return raw.startsWith('Bearer ') ? raw.slice(7) : raw;
  }

  function parseJwt(token) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT');
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(json);
  }

  let timer;

  function startTokenTimer() {
    const expEl = document.getElementById('expTime');
    const remainEl = document.getElementById('remainTime');
    if (!expEl || !remainEl) {
      console.log('[JWT] token box not found yet');
      return;
    }

    const tok = getStoredToken();
    if (!tok) { expEl.textContent = '토큰 없음'; remainEl.textContent = '-'; return; }

    try {
      const { exp } = parseJwt(tok);
      if (!exp) { expEl.textContent = 'exp 없음'; remainEl.textContent = '-'; return; }

      const expMs = exp * 1000;
      expEl.textContent = new Date(expMs).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        const left = expMs - Date.now();
        if (left <= 0) { remainEl.textContent = '만료됨'; clearInterval(timer); return; }
        const s = Math.floor(left / 1000);
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const ss = s % 60;
        const pad = n => (n < 10 ? '0' + n : n);
        remainEl.textContent = h > 0 ? `${h}:${pad(m)}:${pad(ss)}` : `${m}:${pad(ss)}`;
      }, 1000);
    } catch (e) {
      console.warn('[JWT] parse error:', e);
      expEl.textContent = '토큰 파싱 실패';
      remainEl.textContent = e.message || 'error';
    }
  }

  // 헤더가 주입될 때까지 대기했다가 실행
  function waitAndStart() {
    if (document.getElementById('expTime') && document.getElementById('remainTime')) {
      startTokenTimer();
      return;
    }
    const target = document.getElementById('header') || document.body;
    const mo = new MutationObserver(() => {
      if (document.getElementById('expTime') && document.getElementById('remainTime')) {
        mo.disconnect();
        startTokenTimer();
      }
    });
    mo.observe(target, { childList: true, subtree: true });
  }

  // 다른 탭/창에서 토큰이 바뀌어도 갱신
  window.addEventListener('storage', e => {
    if (e.key === 'token') waitAndStart();
  });

  // 초기 진입 시도
  document.addEventListener('DOMContentLoaded', waitAndStart);

  // 디버깅/수동 호출용
  window.startTokenTimer = startTokenTimer;
})();
