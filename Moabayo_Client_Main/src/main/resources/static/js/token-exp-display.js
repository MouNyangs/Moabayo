// js/token-exp-display.js
(function () {
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
  function getUserId(p) { return p.userId ?? p.uid ?? p.id ?? p.username ?? p.sub ?? null; }

  let timer;

  function hideRemain() {
    const wrap = document.getElementById('remainWrap');
    const remainEl = document.getElementById('remainTime');
    if (timer) clearInterval(timer);
    if (remainEl) remainEl.textContent = '-';
    if (wrap) wrap.style.display = 'none';
  }
  function showRemain() {
    const wrap = document.getElementById('remainWrap');
    if (wrap) wrap.style.display = 'inline';
  }

  function startTokenTimer() {
    const wrap = document.getElementById('remainWrap');
    const remainEl = document.getElementById('remainTime');
    if (!wrap || !remainEl) return;

    const tok = getStoredToken();
    if (!tok) { hideRemain(); return; }

    try {
      const payload = parseJwt(tok);
      const uid = getUserId(payload);
      const exp = payload.exp;

      // 유저 아이디가 없거나 exp 없으면 표시 안 함
      if (!uid || !exp) { hideRemain(); return; }

      const expMs = exp * 1000;
      if (timer) clearInterval(timer);

      function tick() {
        const left = expMs - Date.now();
        if (left <= 0) {
          remainEl.textContent = '만료됨';
          clearInterval(timer);
          // 만료 시 아예 숨기려면 다음 줄 주석 해제
          // hideRemain();
          return;
        }
        const s = Math.floor(left / 1000);
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const ss = s % 60;
        const pad = n => (n < 10 ? '0' + n : n);
        remainEl.textContent = h > 0 ? `${h}:${pad(m)}:${pad(ss)}` : `${m}:${pad(ss)}`;
      }

      showRemain();
      tick();
      timer = setInterval(tick, 1000);
    } catch {
      hideRemain();
    }
  }

  function waitAndStart() {
    if (document.getElementById('remainTime')) { startTokenTimer(); return; }
    const target = document.getElementById('header') || document.body;
    const mo = new MutationObserver(() => {
      if (document.getElementById('remainTime')) {
        mo.disconnect();
        startTokenTimer();
      }
    });
    mo.observe(target, { childList: true, subtree: true });
  }

  window.addEventListener('storage', e => { if (e.key === 'token') waitAndStart(); });
  document.addEventListener('DOMContentLoaded', waitAndStart);
  window.startTokenTimer = startTokenTimer;
})();
