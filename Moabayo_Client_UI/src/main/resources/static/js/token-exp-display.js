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
  function hide(){ const b=document.getElementById('tokenBox'), r=document.getElementById('remainTime');
    if(timer) clearInterval(timer); if(r) r.textContent='-'; if(b) b.style.display='none'; }
  function show(){ const b=document.getElementById('tokenBox'); if(b) b.style.display='inline-block'; }

  function runCountdown(expSec){
    const r=document.getElementById('remainTime'); if(!r) return;
    if(timer) clearInterval(timer);
    function tick(){
      const left = expSec*1000 - Date.now();
      if(left<=0){ hide(); return; }
      const total = Math.floor(left/1000);
      const m = Math.floor(total/60);
      const s = total % 60;
      r.textContent = `${m}:${s<10?'0'+s:s}`;
    }
    show(); tick(); timer=setInterval(tick,1000);
  }

  function start(){
    const box = document.getElementById('tokenBox');
    const span = document.getElementById('remainTime');
    if(!box || !span) {
      console.log('[TTL] header elements missing:', {box: !!box, span: !!span});
      return;
    }
    const expStr = readCookie('EXP');
    const exp = expStr ? Number(expStr) : 0;
    console.log('[TTL] start → EXP cookie =', expStr, '→ expNum =', exp);
    if(!exp){ hide(); return; }
    runCountdown(exp);
  }

  document.addEventListener('DOMContentLoaded', start);
  window.addEventListener('auth:login', start);
  window.addEventListener('pageshow', start);   // ✅ BFCache 복귀시 재시작
  window.addEventListener('auth:logout', () => { document.cookie='EXP=; Path=/; Max-Age=0; SameSite=Lax'; hide(); });

  // 디버그/수동 강제 실행 훅
  window.startTokenTimer = start;
})();
