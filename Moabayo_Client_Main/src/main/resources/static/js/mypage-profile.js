// /js/mypage-profile.js

// 1) 프로필 불러와서 value/placeholder 채우기
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/profile', {
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('profile fetch failed');
    const p = await res.json(); // {name, phone, email, addr}

    const $ = sel => document.querySelector(sel);
    $('#pf-name').value  = p.name  ?? '';
    $('#pf-phone').value = p.phone ?? '';
    $('#pf-email').value = p.email ?? '';
    $('#pf-addr').value  = p.addr  ?? '';

    // 요청하신 대로 placeholder에도 동일 값 노출을 원하시면 아래 주석 해제
    // $('#pf-name').placeholder  = p.name  ?? $('#pf-name').placeholder;
    // $('#pf-phone').placeholder = p.phone ?? $('#pf-phone').placeholder;
    // $('#pf-email').placeholder = p.email ?? $('#pf-email').placeholder;
    // $('#pf-addr').placeholder  = p.addr  ?? $('#pf-addr').placeholder;

  } catch (e) {
    console.error(e);
  }
});

// 2) 저장(수정) 요청: 비번 일치 검사 후 전송
document.getElementById('formProfile').addEventListener('submit', async (e) => {
  e.preventDefault();
  const $ = sel => document.querySelector(sel);
  const body = {
    name:  $('#pf-name').value.trim(),
    phone: $('#pf-phone').value.trim(),
    email: $('#pf-email').value.trim(),
    address:  $('#pf-addr').value.trim(),
    newPw: $('#pf-newPw').value,
    newPwConfirm: $('#pf-newPwConfirm').value
  };

  // 비밀번호 검증: 둘 다 비어있으면 변경 안 함, 하나만 입력은 에러
  if (body.newPw || body.newPwConfirm) {
    if (body.newPw.length < 8) {
      alert('비밀번호는 8자 이상으로 입력해주세요.');
      return;
    }
    if (body.newPw !== body.newPwConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
  } else {
    // 서버로 보낼 때 명시적으로 제거(변경 의사 없음)
    delete body.newPw;
    delete body.newPwConfirm;
  }

  try {
    const res = await fetch('/profile', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        // CSRF 사용 중이면 여기서 토큰 헤더 추가
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`save failed: ${res.status}`);
    const ok = await res.json(); // {success:true}
    if (ok.success) {
      alert('저장되었습니다.');
      // 비번 입력 지우기
      $('#pf-newPw').value = '';
      $('#pf-newPwConfirm').value = '';
    } else {
      alert(ok.message || '저장 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error(err);
    alert('네트워크 오류가 발생했습니다.');
  }
});
