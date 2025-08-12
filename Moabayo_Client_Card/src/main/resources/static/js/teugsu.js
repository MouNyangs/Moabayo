document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signupForm');
  const loginIdInput = document.getElementById('loginId');
  const checkUserIdBtn = document.getElementById('checkUserIdBtn');
  const userIdCheckMessage = document.getElementById('userIdCheckMessage');
  const signupBtn = signupForm.querySelector('button[type="submit"]');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const passwordMatchMsg = document.getElementById('passwordMatchMsg');
  const passwordMismatchMsg = document.getElementById('passwordMismatchMsg');

  let isUserIdAvailable = false;

  // 아이디 중복 확인 (예제: 무조건 가능 처리)
  checkUserIdBtn.addEventListener('click', () => {
    const userId = loginIdInput.value.trim();

    if (userId === '') {
      userIdCheckMessage.textContent = '아이디를 입력하라냥...';
      userIdCheckMessage.className = 'text-danger small';
      isUserIdAvailable = false;
    } else {
      userIdCheckMessage.textContent = '사용 가능한 아이디다냥!';
      userIdCheckMessage.className = 'text-success small';
      isUserIdAvailable = true;
    }

    checkFormValidity();
  });

  // 비밀번호 확인
  confirmPasswordInput.addEventListener('input', () => {
    validatePasswordMatch();
    checkFormValidity();
  });

  passwordInput.addEventListener('input', () => {
    validatePasswordMatch();
    checkFormValidity();
  });

  // 모든 입력 필드에 이벤트 연결
  const allInputs = signupForm.querySelectorAll('input');
  allInputs.forEach((input) => {
    input.addEventListener('input', checkFormValidity);
  });

  // 비밀번호 일치 여부 검사
  function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password === '' || confirmPassword === '') {
      confirmPasswordInput.setCustomValidity('비밀번호를 입력하라냥');
      passwordMatchMsg.style.display = 'none';
      passwordMismatchMsg.style.display = 'none';
      return;
    }

    if (password === confirmPassword) {
      confirmPasswordInput.setCustomValidity('');
      passwordMatchMsg.style.display = 'block';
      passwordMismatchMsg.style.display = 'none';
    } else {
      confirmPasswordInput.setCustomValidity('비밀번호가 일치하지 않습니다');
      passwordMatchMsg.style.display = 'none';
      passwordMismatchMsg.style.display = 'block';
    }
  }

  // 모든 조건 만족 시 버튼 활성화
  function checkFormValidity() {
    const isFormValid = signupForm.checkValidity();

    if (isFormValid && isUserIdAvailable) {
      signupBtn.disabled = false;
    } else {
      signupBtn.disabled = true;
    }
  }

  // 초기 버튼 비활성화
  signupBtn.disabled = true;
});
