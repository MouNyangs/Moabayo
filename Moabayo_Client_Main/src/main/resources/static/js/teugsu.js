document.getElementById('checkUserIdBtn').addEventListener('click', function() {
  const userId = document.getElementById('userid').value.trim();

  if (!userId) {
    alert('아이디를 먼저 입력해라냥!');
    return;
  }

  fetch(`/registration/checkId?loginId=${encodeURIComponent(userId)}`)
    .then(res => res.text())
    .then(result => {
      if (result === 'available') {
        alert('사용 가능한 아이디라냥!');
      } else {
        alert('이미 사용 중인 아이디라냥...');
      }
    })
    .catch(err => {
      alert('중복확인 중 오류 발생! 🐾');
      console.error(err);
    });
});
