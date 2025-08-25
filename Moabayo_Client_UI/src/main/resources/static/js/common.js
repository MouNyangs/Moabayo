// 메뉴 토글
function toggleMenu() {
	const menu = document.getElementById("menu");
	if (menu) menu.classList.toggle("active");
}

// 사용자 이름 표시 (단순 표시용)
function showUserName() {
	const userName = localStorage.getItem("userName") || localStorage.getItem("userId") || "사용자";
	const userNameDisplay = document.getElementById("userNameDisplay");
	if (userNameDisplay) {
		userNameDisplay.textContent = userName + "님";
	}
}

// 드롭다운 메뉴 토글
function toggleDropdown() {
	const menu = document.getElementById("dropdownMenu");
	if (menu) {
		menu.style.display = menu.style.display === "block" ? "none" : "block";
	}
}

// 로그인 상태에 따른 드롭다운 UI 업데이트
function updateDropdownMenu() {
	const loggedInEl = document.querySelector(".logged-in");
	const loggedOutEl = document.querySelector(".logged-out");
	const userNameDisplay = document.getElementById("userNameDisplay");
	const defaultProfileIcon = document.getElementById("defaultProfileIcon");
	const userProfileImage = document.getElementById("userProfileImage");

	const token = localStorage.getItem("token");
	const userName = localStorage.getItem("userName");
	const profileImgUrl = localStorage.getItem("profileImg") || "";

	if (token) {
		// 로그인 상태
		if (loggedInEl) loggedInEl.style.display = "block";
		if (loggedOutEl) loggedOutEl.style.display = "none";

		if (userNameDisplay) userNameDisplay.textContent = userName+" 님" || "사용자";

		if (profileImgUrl) {
			userProfileImage.src = profileImgUrl;
			userProfileImage.style.display = "inline-block";
			defaultProfileIcon.style.display = "none";
		} else {
			defaultProfileIcon.style.display = "inline-block";
			userProfileImage.style.display = "none";
		}
	} else {
		// 비로그인 상태
		if (loggedInEl) loggedInEl.style.display = "none";
		if (loggedOutEl) loggedOutEl.style.display = "block";

		if (userNameDisplay) userNameDisplay.textContent = "로그인이 필요합니다";

		defaultProfileIcon.style.display = "inline-block";
		userProfileImage.style.display = "none";
	}
}

// 로그아웃 처리
function logout() {
  // 1) 로컬스토리지 정리
  localStorage.clear();

  // 2) 표시용 EXP 쿠키 제거
  document.cookie = "EXP=; Path=/; Max-Age=0; SameSite=Lax";

  // 3) 헤더 타이머 숨기기 (token-exp-display.js가 듣고 있음)
  window.dispatchEvent(new Event("auth:logout"));

  // 4) 서버에도 ACCESS_TOKEN 쿠키 무효화 요청 (HttpOnly 쿠키는 JS에서 못 지움)
  fetch("http://localhost:8812/user/logout", {
    method: "POST",
    credentials: "include"
  }).catch(err => console.warn("서버 로그아웃 요청 실패:", err));

  // 5) 안내 + 이동
  alert("로그아웃 되었습니다.");
  location.href = "http://localhost:8812/loginpage";
}


// 메뉴 생성 함수 (로그인 상태에 따라 다르게 생성)
function createRotatingMenu(items) {
	return `
    <div class="menu" id="menu">
      <div class="btn trigger" onclick="toggleMenu()">
        <span class="line"></span>
      </div>
      <div class="icons">
        ${items
			.map(
				(item) => `
          <div class="rotater">
            <div class="btn btn-icon">
              <a href="${item.href}" ${item.id ? `id="${item.id}"` : ""} style="color:inherit; text-decoration:none;">
                <i class="fa ${item.icon}"></i>${item.label}
              </a>
            </div>
          </div>`
			)
			.join("")}
      </div>
    </div>
  `;
}

// 페이지가 로드되면 헤더, 푸터 로드 및 초기화
window.addEventListener("DOMContentLoaded", () => {
	// HEADER 로드
	fetch("http://localhost:8810/fragments/header.html")
		.then((res) => res.text())
		.then((data) => {
			const header = document.getElementById("header");
			if (!header) return; // header 요소 없으면 중단

			header.innerHTML = data;

			updateDropdownMenu();

			// 토큰 타이머 시작 시도
			if (window.startTokenTimer) {
				try {
					window.startTokenTimer();
				} catch (e) {
					console.warn("[JWT] startTokenTimer 실행 중 오류:", e);
				}
			} else {
				console.warn("[JWT] startTokenTimer를 찾지 못했습니다. token-exp-display.js 로드 순서 확인 필요");
			}

			// authSection 메뉴 생성
			const userName = localStorage.getItem("userName");
			const authSection = document.getElementById("authSection");

			if (authSection) {
				if (userName) {
					authSection.innerHTML = `
            <span class="welcome-message">${userName} 님</span>
            ${createRotatingMenu([
						{ icon: "fa-sign-out-alt", label: "로그아웃", href: "#", id: "logoutBtn" },
						{ icon: "fa-user-circle", label: "마이페이지", href: "http://localhost:8812/mypage" },
					])}
          `;

					const logoutBtn = document.getElementById("logoutBtn");
					if (logoutBtn) {
						logoutBtn.addEventListener("click", (e) => {
							e.preventDefault();
							logout();
						});
					}
				} else {
					authSection.innerHTML = createRotatingMenu([
						{ icon: "fa-user-plus", label: "회원가입", href: "http://localhost:8812/registerpage" },
						{ icon: "fa-sign-in-alt", label: "로그인", href: "http://localhost:8812/loginpage" },
					]);
				}
			}
		});

	// FOOTER 로드
	fetch("http://localhost:8810/fragments/footer.html")
		.then((res) => res.text())
		.then((data) => {
			const footer = document.getElementById("footer");
			if (!footer) {
				console.warn("⚠️ footer 요소가 없어서 스킵합니다.");
				return;
			}
			footer.innerHTML = data;
		});

	// 카드 스크롤 컨트롤 (prev, next 버튼)
	const cards = document.querySelector(".cards");
	const prevBtn = document.querySelector(".prev");
	const nextBtn = document.querySelector(".next");

	const scrollStep = 300;

	if (prevBtn && nextBtn && cards) {
		prevBtn.addEventListener("click", () => {
			cards.scrollBy({ left: -scrollStep, behavior: "smooth" });
		});

		nextBtn.addEventListener("click", () => {
			cards.scrollBy({ left: scrollStep, behavior: "smooth" });
		});
	}

	// 드롭다운 닫기 (외부 클릭 시)
	document.addEventListener("click", (event) => {
		const profile = document.querySelector(".profile-dropdown");
		if (profile && !profile.contains(event.target)) {
			const dropdown = document.getElementById("dropdownMenu");
			if (dropdown) dropdown.style.display = "none";
		}
	});
});

// 다른 탭에서 로그인/로그아웃 시 토큰 타이머 갱신
window.addEventListener("storage", (e) => {
	if (e.key === "token" && window.startTokenTimer) {
		window.startTokenTimer();
	}
});

// 전역 네비게이션 이동 함수
const goTo = (url) => {
	window.location.href = url;
};
window.goToMainService = () => goTo("http://localhost:8812/mainpage");
window.goToBankService = () => goTo("/bank");
window.goToCardService = () => goTo("/cards");
window.goToTransactions = () => goTo("/accounts");
window.goAdmin = () => goTo("/support");
window.goToTransactions = () => goTo("http://localhost:8812/transactions");
