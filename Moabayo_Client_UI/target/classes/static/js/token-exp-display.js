// js/token-exp-display.js
(function() {
	function getStoredToken() {
		console.log('[JWT] token-exp-display loaded');
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

	function pickUserId(payload) {
		return payload?.userId ?? payload?.uid ?? payload?.id ?? payload?.username ?? payload?.sub ?? null;
	}

	let timer;

	function hideRemain() {
		const box = document.getElementById('tokenBox');
		const remainEl = document.getElementById('remainTime');
		if (timer) clearInterval(timer);
		if (remainEl) remainEl.textContent = '-';
		if (box) box.style.display = 'none';
	}

	function showRemain() {
		const box = document.getElementById('tokenBox');
		if (box) box.style.display = 'inline-block';
	}

	function startTokenTimer() {
		const box = document.getElementById('tokenBox');
		const remainEl = document.getElementById('remainTime');
		if (!box || !remainEl) return;

		const raw = localStorage.getItem('token');
		if (!raw) { hideRemain(); return; }
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
					logout();
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
