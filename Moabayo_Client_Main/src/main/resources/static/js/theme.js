// /js/theme.js
(function () {
  const STORAGE_KEY = "theme";                // "light" | "dark"
  const html = document.documentElement;
  const toggle = document.getElementById("switch-mode");
  const label = document.querySelector('label[for="switch-mode"]');
  if (!toggle || !label) return; // 이 페이지에 토글이 없으면 아무 것도 하지 않음

  const moonIcon = label.querySelector(".bxs-moon");
  const sunIcon  = label.querySelector(".bx-sun");

  // ---------- 초기화 ----------
  // 1) 저장된 테마 읽기 (없으면 light)
  let theme = (localStorage.getItem(STORAGE_KEY) || "light").toLowerCase();
  if (theme !== "light" && theme !== "dark") theme = "light";

  // 2) DOM 반영
  applyTheme(theme);

  // 3) 토글 상태 동기화: 체크됨=다크, 체크해제=라이트
  toggle.checked = theme === "dark";

  // ---------- 이벤트 ----------
  // 체크박스 상태가 바뀌면 테마 토글
  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "dark" : "light";
    applyTheme(newTheme);
  });

  // ---------- 함수 ----------
  function applyTheme(next) {
    html.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
    // 아이콘 표시: 다크 → 달 보임 / 라이트 → 해 보임
    if (moonIcon && sunIcon) {
      if (next === "dark") {
        moonIcon.style.display = "inline-block";
        sunIcon.style.display  = "none";
      } else {
        moonIcon.style.display = "none";
        sunIcon.style.display  = "inline-block";
      }
    }
  }
})();
