(function(){
  const root = document.getElementById('transfer');
  if(!root) return;

  // ---------- helpers ----------
  const $ = (sel, p=document) => p.querySelector(sel);
  const $$ = (sel, p=document) => Array.from(p.querySelectorAll(sel));
  const onlyDigits = s => (s||'').replace(/[^0-9]/g,'');
  const formatKRW = n => new Intl.NumberFormat('ko-KR').format(n) + '원';
  const PW_MIN_LEN = 8; // 로그인/가입 비밀번호 기준(필요 시 프로젝트 규칙에 맞게 조정)

  // ---------- elements ----------
  const toName = $('#toName');
  const fromAccount = $('#fromAccount');
  const amount = $('#amount');
  const btnSend = $('#btnSend');
  const btnCancel = $('#btnCancel');
  const progress = $('#tfProgress');
  const sendName = $('#sendName');
  const sendAmt = $('#sendAmt');
  const done = $('#tfDone');
  const snd = $('#sndSuccess');
  const doneName = $('#doneName');
  const doneAmt = $('#doneAmt');

  // password modal
  const pwModal = $('#pwModal');
  const accountPw = $('#accountPw');
  const btnPwOK = $('#btnPwOK');
  const btnPwCancel = $('#btnPwCancel');
  const btnTogglePw = $('#btnTogglePw');
  const pwError = $('#pwError');

  // ---------- form behaviors ----------
  $$('.quick button').forEach(btn => {
    btn.addEventListener('click', () => {
      const delta = +btn.dataset.amt;
      const cur = +(onlyDigits(amount.value) || 0);
      const next = Math.max(0, cur + delta);
      amount.value = next === 0 ? '' : next.toLocaleString('ko-KR');
      validate();
    });
  });

  amount.addEventListener('input', () => {
    const raw = onlyDigits(amount.value);
    amount.value = raw ? Number(raw).toLocaleString('ko-KR') : '';
    validate();
  });
  toName.addEventListener('input', validate);
  fromAccount.addEventListener('change', validate);

  function validate(){
    const nameOk = toName.value.trim().length >= 1;
    const accOk  = !!fromAccount.value;
    const amt    = +(onlyDigits(amount.value) || 0);
    const amtOk  = amt > 0;
    btnSend.disabled = !(nameOk && accOk && amtOk);
  }
  validate();

  // cancel
  btnCancel.addEventListener('click', () => {
    if (document.referrer) history.back();
    else window.location.href = '/';
  });

  // ---------- send flow with password ----------
  let attempts = 0;
  const MAX_ATTEMPTS = 5;

  btnSend.addEventListener('click', () => {
    if (done.classList.contains('show')) return; // 이미 완료 상태면 무시
    openPwModal();
  });

  function openPwModal(){
    pwError.hidden = true;
    accountPw.classList.remove('invalid','shake');
    accountPw.value = '';
    btnPwOK.disabled = true;
	
	// 패스워드 확인 창에 상대방 이름과 송금액 붙이기
	const amt = +(onlyDigits(amount.value) || 0);
	sendName.textContent = toName.value.trim() || '상대방';
	sendAmt.textContent = formatKRW(amt);

    pwModal.classList.add('show');
    pwModal.setAttribute('aria-hidden','false');
    setTimeout(()=> accountPw.focus(), 0);
  }

  function closePwModal(){
    pwModal.classList.remove('show');
    pwModal.setAttribute('aria-hidden','true');
  }

  // 비밀번호 입력 이벤트 (길이 기준으로만 1차 체크)
  accountPw.addEventListener('input', () => {
    btnPwOK.disabled = accountPw.value.length < PW_MIN_LEN;
    if (!btnPwOK.disabled) pwError.hidden = true;
  });

  // 엔터로 확인
  accountPw.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !btnPwOK.disabled){
      e.preventDefault();
      btnPwOK.click();
    }
  });

  // 보기/가리기
  btnTogglePw.addEventListener('click', () => {
    const t = accountPw.getAttribute('type') === 'password' ? 'text' : 'password';
    accountPw.setAttribute('type', t);
  });

  btnPwCancel.addEventListener('click', () => closePwModal());

  btnPwOK.addEventListener('click', async () => {
    btnPwOK.disabled = true;

    try{
      const ok = await verifyPassword(accountPw.value);
      if(!ok){
        attempts++;
        accountPw.classList.add('invalid','shake');
        pwError.textContent = `비밀번호가 올바르지 않습니다. (${attempts}/${MAX_ATTEMPTS})`;
        pwError.hidden = false;
        setTimeout(()=> accountPw.classList.remove('shake'), 350);

        if(attempts >= MAX_ATTEMPTS){
          pwError.textContent = '시도 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.';
          return; // 더 진행 금지
        }
        btnPwOK.disabled = false;
        accountPw.focus();
        return;
      }
    }catch(e){
      pwError.textContent = '인증 서버와 통신에 실패했습니다. 네트워크를 확인해 주세요.';
      pwError.hidden = false;
      btnPwOK.disabled = false;
      return;
    }

    // 인증 성공 → 송금 진행
    closePwModal();
    await doTransfer();
  });

  // 실제 송금 로직
  async function doTransfer(){
    btnSend.disabled = true;
    progress.classList.add('show');

    // TODO: 실제 송금 API 호출
    await new Promise(r => setTimeout(r, 1200));

    progress.classList.remove('show');
    const amt = +(onlyDigits(amount.value) || 0);
    doneName.textContent = toName.value.trim() || '상대방';
    doneAmt.textContent = formatKRW(amt);
    done.classList.add('show');

    try{ snd && snd.play && snd.play().catch(()=>{}); }catch(e){}

    setTimeout(() => { window.location.href = '/bank/history'; }, 3000);
  }

  /**
   * 🔐 계정 비밀번호 서버 검증
   * Spring 기준 예시: POST /api/auth/verify-password
   * body: { password:"..." }  →  { ok:true } / { ok:false }
   */
  async function verifyPassword(password){
    // CSRF 토큰 사용(있을 경우)
    const headers = { 'Content-Type': 'application/json' };
    const csrf = document.querySelector('meta[name="_csrf"]')?.content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;
    if (csrf && csrfHeader) headers[csrfHeader] = csrf;

    // 실제 API로 교체하세요.
    // const res = await fetch('/api/auth/verify-password', {
    //   method:'POST', headers, body: JSON.stringify({ password })
    // });
    // if(!res.ok) throw new Error('verify failed');
    // const data = await res.json();
    // return !!data.ok;

    // 데모: "moa1234!"만 성공
    await new Promise(r => setTimeout(r, 250));
    return password === 'moa1234!';
  }
})();


// 유저 검색
function searchUser() {
  const query = document.getElementById("toName").value;
  // 백엔드에 이 주소가 필요하다.
  fetch(`/bank/api/user/search?query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data) {
        document.getElementById("searchResult").innerHTML = `
          <div>
            <strong>${data.name}</strong> (${data.loginId})<br/>
            계좌번호: ${data.accountNum}<br/>
            전화번호: ${data.phone}
          </div>
        `;
      } else {
        document.getElementById("searchResult").innerText = "찾는 사용자가 없습니다.";
      }
    });
}

(function maskAccountNumbers() {
    const sel = document.getElementById('fromAccount');
    [...sel.options].forEach(opt => {
      if (!opt.value) return;
      const parts = opt.text.split(' • ');
      if (parts.length < 2) return;
      const name = parts[0];
      const num  = parts[1].replace(/\s/g,''); // 공백 제거
      // 단순 마스킹: 마지막 4자리만 남김
      const last4 = num.slice(-4);
      const masked = '****-****-' + last4;
      opt.text = `${name} • ${masked}`;
    });
  })();

