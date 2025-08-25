// js/token-exp-display.js
(function () {
  function readCookie(name) {
    const cookies = document.cookie.split(";");
    for (let c of cookies) {
      const [k, v] = c.trim().split("=");
      if (k === name) return decodeURIComponent(v || "");
    }
    return null;
  }

  let timer;
  let expiredFired = false; // 중복 실행 방지

  function hide() {
    const b = document.getElementById("tokenBox");
    const r = document.getElementById("remainTime");
    if (timer) clearInterval(timer);
    if (r) r.textContent = "-";
    if (b) b.style.display = "none";
  }

  function show() {
    const b = document.getElementById("tokenBox");
    if (b) b.style.display = "inline-block";
  }

  // ✅ 만료 트리거 (한 번만)
  function fireExpiredOnce() {
    if (expiredFired) return;
    expiredFired = true;
    window.dispatchEvent(new Event("auth:expired"));
    if (typeof window.onTokenExpired === "function") {
      try { window.onTokenExpired(); } catch (e) { console.warn("[TTL] onTokenExpired error", e); }
    }
  }

  function runCountdown(expSec) {
    const r = document.getElementById("remainTime");
    if (!r) return;
    if (timer) clearInterval(timer);

    function tick() {
      const left = expSec * 1000 - Date.now();
      if (left <= 0) {
        hide();
        fireExpiredOnce(); // ✅ 만료 시 자동 로그아웃 트리거
        return;
      }
      const total = Math.floor(left / 1000);
      const m = Math.floor(total / 60);
      const s = total % 60;
      r.textContent = `${m}:${s < 10 ? "0" + s : s}`;
    }

    expiredFired = false; // 새 카운트다운 시작 시 초기화
    show();
    tick();
    timer = setInterval(tick, 1000);
  }

  function startIfReady() {
    const box = document.getElementById("tokenBox");
    const span = document.getElementById("remainTime");
    if (!box || !span) {
      console.log("[TTL] header elements missing:", { box: !!box, span: !!span });
      return false;
    }
    const expStr = readCookie("EXP");
    const exp = expStr ? Number(expStr) : 0;
    console.log("[TTL] start → EXP cookie =", expStr, "→ expNum =", exp);
    if (!exp) { hide(); return true; }
    runCountdown(exp);
    return true;
  }

  // 헤더가 나올 때까지 기다렸다가 start
  function waitForHeaderAndStart() {
    if (startIfReady()) return; // 이미 있으면 바로 시작
    const target = document.getElementById("header") || document.body;
    const mo = new MutationObserver(() => {
      if (startIfReady()) mo.disconnect();
    });
    mo.observe(target, { childList: true, subtree: true });
  }

  // bfcache 복귀, 로그인 직후 등 다양한 타이밍에 시도
  document.addEventListener("DOMContentLoaded", waitForHeaderAndStart);
  window.addEventListener("pageshow", waitForHeaderAndStart);
  window.addEventListener("auth:login", waitForHeaderAndStart);
  window.addEventListener("auth:logout", () => { document.cookie = "EXP=; Path=/; Max-Age=0; SameSite=Lax"; hide(); });

  // 디버그 수동 호출
  window.startTokenTimer = waitForHeaderAndStart;
})();
