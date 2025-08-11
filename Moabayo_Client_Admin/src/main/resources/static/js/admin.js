// admin.js

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // 엘리먼트 캐시
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const menuBtn = document.querySelector('#content nav .bx-menu');
  const switchCheckbox = document.getElementById('switch-mode');
  const notifIcon = document.getElementById('notificationIcon');
  const notifMenu = document.getElementById('notificationMenu');
  const profileIcon = document.getElementById('profileIcon');
  const profileMenu = document.getElementById('profileMenu');
  const sideLinks = document.querySelectorAll('#sidebar .side-menu.top li a');
  const form = document.querySelector('#content nav form');
  const searchBtn = form?.querySelector('.search-btn');

  // 1) 사이드바 토글
  if (menuBtn && sidebar && content) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('hide');
      // 콘텐츠 폭은 CSS에서 sibling selector로 처리됨 (#sidebar.hide ~ #content)
    });
  }

  // 2) 다크 모드 (localStorage 기억)
  const THEME_KEY = 'adminhub:theme';
  const savedTheme = localStorage.getItem(THEME_KEY); // 'dark' | 'light' | null
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    if (switchCheckbox) switchCheckbox.checked = true;
  }
  if (switchCheckbox) {
    switchCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        body.classList.add('dark');
        localStorage.setItem(THEME_KEY, 'dark');
      } else {
        body.classList.remove('dark');
        localStorage.setItem(THEME_KEY, 'light');
      }
    });
  }

  // 3) 알림 드롭다운
  if (notifIcon && notifMenu) {
    notifIcon.addEventListener('click', (e) => {
      e.preventDefault();
      notifMenu.classList.toggle('show');
      profileMenu?.classList.remove('show');
    });
  }

  // 4) 프로필 드롭다운
  if (profileIcon && profileMenu) {
    profileIcon.addEventListener('click', (e) => {
      e.preventDefault();
      profileMenu.classList.toggle('show');
      notifMenu?.classList.remove('show');
    });
  }

  // 5) 바깥 클릭 시 드롭다운 닫기
  document.addEventListener('click', (e) => {
    const t = e.target;
    // 알림
    if (notifMenu && !notifMenu.contains(t) && !notifIcon?.contains(t)) {
      notifMenu.classList.remove('show');
    }
    // 프로필
    if (profileMenu && !profileMenu.contains(t) && !profileIcon?.contains(t)) {
      profileMenu.classList.remove('show');
    }
  });

  // 6) 사이드메뉴 active 표시
  sideLinks.forEach((a) => {
    a.addEventListener('click', () => {
      document
        .querySelectorAll('#sidebar .side-menu.top li')
        .forEach((li) => li.classList.remove('active'));
      a.parentElement?.classList.add('active');
    });
  });

  // 7) 모바일 검색 UI (선택)
  if (form && searchBtn) {
    form.addEventListener('submit', (e) => {
      // 실제 검색 로직 없으면 기본 동작 막기
      e.preventDefault();
    });
    // 576px 이하에서 input 토글 보이게 하는 용도
    searchBtn.addEventListener('click', (e) => {
      if (window.innerWidth <= 576) {
        e.preventDefault();
        form.classList.toggle('show');
      }
    });
  }

  // 8) 접근성: ESC로 드롭다운 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      notifMenu?.classList.remove('show');
      profileMenu?.classList.remove('show');
    }
  });
});
