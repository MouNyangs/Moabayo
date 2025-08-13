// js/token-exp-display.js
(function () {
  function getStoredToken() {
    	console.log('[JWT] token-exp-display loaded'); // 디버깅용 로그
    const raw = localStorage.getItem('token'); // 로컬스토리지에서 토큰읽음
    if (!raw) return null; // 토큰 없으면 널 반환
    return raw.startsWith('Bearer ') ? raw.slice(7) : raw; // Bearer 접두사 자르기
  }

	function parseJwt(token) { //jwt 파싱 함수 선언
		const parts = token.split('.');//토큰은 3파트로 나뉘는데 .기준 잘라서 header.payload.signature 분리해서 담기
		if (parts.length !== 3) throw new Error('Invalid JWT');// 3개로 나눈 형식이 아니면 에러.
		const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/'); //jwt base64url을써서 base64로 변환
		const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4); //base64는 길이가 4의 배수여야 해서 = 패딩을 보정.
		const json = decodeURIComponent(
			atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
		); //		atob로 base64 디코드 → 바이너리를 %xx 형태로 바꿔 → decodeURIComponent로 UTF-8 문자열 복원.
		//        (그냥 atob만 쓰면 라틴1 이슈로 한글 같은 문자가 깨질 수 있는데, 이 코드가 안전하게 처리해줌.)
		return JSON.parse(json); //문자열로 변환해 반환
	}

  function pickUserId(payload) {
    return payload?.userId ?? payload?.uid ?? payload?.id ?? payload?.username ?? payload?.sub ?? null; // userId → uid → id → username → sub 순으로 존재하는 첫 값을 선택. 없으면 null
	                                                                                                    // 쉽게 로그인해야 토큰만료시간 뜨기
  }

  let timer; //setInterval 핸들을 담아둘 변수(중복 타이머 방지용).

  function hideRemain() { // 남은시간 표시를 숨기는 함수
    const box = document.getElementById('tokenBox');
    const remainEl = document.getElementById('remainTime');
    if (timer) clearInterval(timer);
    if (remainEl) remainEl.textContent = '-';
    if (box) box.style.display = 'none';
  }

  function showRemain() { // 남은시간 박스를 보여주게만드는 함수
    const box = document.getElementById('tokenBox');
    if (box) box.style.display = 'inline-block';
  }

  function startTokenTimer() {// 타이머 시작및 갱신 로직
    const box = document.getElementById('tokenBox');
    const remainEl = document.getElementById('remainTime');
    if (!box || !remainEl) return;

    const raw = localStorage.getItem('token');
    if (!raw) { hideRemain(); return; } // 토큰없으면 표시 숨기고 종료
    const tok = raw.startsWith('Bearer ') ? raw.slice(7) : raw;

    try {
      const payload = parseJwt(tok);
      const uid = localStorage.getItem('userId') || pickUserId(payload);
      const exp = payload?.exp;

      if (!uid || !exp) { hideRemain(); return; }

      const expMs = Number(exp) * 1000;
      if (timer) clearInterval(timer);

      function tick() {
        const left = expMs - Date.now();
        if (left <= 0) {
          remainEl.textContent = '만료됨';
          clearInterval(timer);
          hideRemain();
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
    } catch (e) {
      console.warn('[JWT] parse error:', e);
      hideRemain();
    }
  }

  function waitAndStart() {
    // 헤더가 비동기로 주입되는 경우 대비
    if (document.getElementById('tokenBox') && document.getElementById('remainTime')) {
      startTokenTimer(); return;
    }
    const target = document.getElementById('header') || document.body;
    const mo = new MutationObserver(() => {
      if (document.getElementById('tokenBox') && document.getElementById('remainTime')) {
        mo.disconnect();
        startTokenTimer();
      }
    });
    mo.observe(target, { childList: true, subtree: true });
  }

  // 다른 탭/창 변경
  window.addEventListener('storage', e => {
    if (e.key === 'token' || e.key === 'userId') waitAndStart();
  });

  // 같은 탭: 로그인/로그아웃 커스텀 이벤트
  window.addEventListener('auth:login', waitAndStart);
  window.addEventListener('auth:logout', () => { hideRemain(); });

  document.addEventListener('DOMContentLoaded', waitAndStart);

  // 수동 호출도 가능
  window.startTokenTimer = startTokenTimer;
})();
