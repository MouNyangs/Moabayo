const dotAnimation = document.querySelector('.draw-s');

dotAnimation.addEventListener('animationend', () => {
  // 애니메이션이 끝난 후 페이지 이동
  window.location.href = "mainpage"; // 원하는 URL로 변경
});