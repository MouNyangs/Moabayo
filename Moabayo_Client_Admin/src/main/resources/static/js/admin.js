// admin.js

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // 엘리먼트 캐시
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const menuBtn = document.querySelector('#content nav .bx-menu');
  const switchCheckbox = document.getElementById('switch-mode');
  const notifIcon = document.getElementById('notificationIcon');
  const notifMenu = document.getElementById('notificationMenu');  // 없을 수 있음
  const profileIcon = document.getElementById('profileIcon');
  const profileMenu = document.getElementById('profileMenu');      // 없을 수 있음
  const sideLinks = document.querySelectorAll('#sidebar .side-menu.top li a');
  const form = document.querySelector('#content nav form');
  const searchBtn = form?.querySelector('.search-btn');

  // 1) 사이드바 토글
  if (menuBtn && sidebar && content) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('hide');
      // 폭 변경은 CSS에서 처리(#sidebar.hide ~ #content)
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
    if (notifMenu && !notifMenu.contains(t) && !notifIcon?.contains(t)) {
      notifMenu.classList.remove('show');
    }
    if (profileMenu && !profileMenu.contains(t) && !profileIcon?.contains(t)) {
      profileMenu.classList.remove('show');
    }
  });

  // 6) 사이드메뉴 active 표시 (클릭 즉시 반응 + 라우터가 최종 확정)
  sideLinks.forEach((a) => {
    a.addEventListener('click', () => {
      document.querySelectorAll('#sidebar .side-menu.top li').forEach((li) => li.classList.remove('active'));
      a.parentElement?.classList.add('active');
    });
  });

  // 7) 모바일 검색 UI (선택)
  if (form && searchBtn) {
    form.addEventListener('submit', (e) => e.preventDefault());
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


// ===========================
// 해시 라우터 (partials fetch)
// ===========================
(function () {
  // 라우트 ↔ 파일 매핑 (현재 프로젝트 구조 기준)
  const routes = {
    '/dashboard': '/adminpage/dashboard.html',
    '/bank': '/adminpage/bank.html',
    '/analytics': '/adminpage/analytics.html',
    '/messages': '/adminpage/messages.html',
    '/team': '/adminpage/team.html',
    '/settings': '/adminpage/settings.html',
    '/logout': null, // 특수 처리
  };

  const titleMap = {
    '/dashboard': 'Dashboard',
    '/bank': 'Bank',
    '/analytics': 'Analytics',
    '/messages': 'Message',
    '/team': 'Team',
    '/settings': 'Settings',
  };

  function getPathFromHash() {
    const h = location.hash || '#/dashboard';
    const [path] = h.replace('#', '').split('?');
    return path || '/dashboard';
  }

  function setSidebarActive(path) {
    document.querySelectorAll('#sidebar .side-menu.top li').forEach((li) => li.classList.remove('active'));
    const activeLink = document.querySelector(`#sidebar a[href="#${path}"]`);
    activeLink?.closest('li')?.classList.add('active');
  }

  function syncHeader(path) {
    const titleEl = document.getElementById('pageTitle') || document.querySelector('.head-title h1');
    const breadcrumb = document.getElementById('breadcrumb') || document.querySelector('.head-title .breadcrumb');
    const title = titleMap[path] || 'Dashboard';
    if (titleEl) titleEl.textContent = title;
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <li><a href="#/dashboard">Dashboard</a></li>
        <li><i class='bx bx-chevron-right'></i></li>
        <li><a class="active" href="#${path}">${title}</a></li>
      `;
    }
  }

  async function loadRoute(path) {
    // 로그아웃 처리
    if (path === '/logout') {
      // TODO: 세션/토큰 클리어 로직
      alert('로그아웃되었습니다.');
      location.hash = '#/dashboard';
      return;
    }

    const app = document.getElementById('app');
    const url = routes[path] || routes['/dashboard'];
    setSidebarActive(path);
    syncHeader(path);

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();
      app.innerHTML = html;
      window.scrollTo({ top: 0 });
    } catch (err) {
      app.innerHTML = `
        <div class="card">
          <h3>페이지 로드 실패</h3>
          <p class="muted">${url} - ${err.message}</p>
        </div>
      `;
    }
  }

  // 라우터 바인딩
  window.addEventListener('hashchange', () => loadRoute(getPathFromHash()));
  window.addEventListener('DOMContentLoaded', () => loadRoute(getPathFromHash()));

  // (선택) 초기 프리패치
  ['/dashboard', '/bank', '/analytics'].forEach((p) => {
    const u = routes[p];
    if (u) fetch(u, { mode: 'no-cors' }).catch(() => {});
  });
})();
