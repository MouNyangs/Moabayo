function toggleMenu() {
	const menu = document.getElementById("menu");
	if (menu) menu.classList.toggle("active");
}
function showUserName() {
	const userName = localStorage.getItem("userName") || localStorage.getItem("userId") || "사용자";
	const userNameDisplay = document.getElementById("userNameDisplay");
	if (userNameDisplay) {
		userNameDisplay.textContent = userName + "님";
	}
}

window.addEventListener("DOMContentLoaded", () => {
	// ✅ HEADER 로드
	fetch("http://localhost:8810/fragments/header.html")
		.then(res => res.text())
		.then(data => {
			const header = document.getElementById("header");
			if (!header) return; // 💥 header 요소가 없으면 중단

			header.innerHTML = data;

			updateDropdownMenu();
			// ✅✅ 헤더가 DOM에 삽입된 '이후' 토큰 타이머 시작
			if (window.startTokenTimer) {
				try {
					window.startTokenTimer();
				} catch (e) {
					console.warn("[JWT] startTokenTimer 실행 중 오류:", e);
				}
			} else {
				console.warn("[JWT] startTokenTimer를 찾지 못했습니다. token-exp-display.js 로드 순서를 확인하세요.");
			}

			const userName = localStorage.getItem("userName");
			const authSection = document.getElementById("authSection");

			function createRotatingMenu(items) {
				return `
          <div class="menu" id="menu">
            <div class="btn trigger" onclick="toggleMenu()">
              <span class="line"></span>
            </div>
            <div class="icons">
              ${items.map(item => `
                <div class="rotater">
                  <div class="btn btn-icon">
                    <a href="${item.href}" ${item.id ? `id="${item.id}"` : ''} style="color:inherit; text-decoration:none;"><i class="fa ${item.icon}"></i>${item.label}</a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
			}

			if (authSection) {
				if (userName) {
					authSection.innerHTML = `
            <span class="welcome-message">${userName} 님</span>
            ${createRotatingMenu([
						{ icon: "fa-sign-out-alt", label: "로그아웃", href: "#", id: "logoutBtn" },
						{ icon: "fa-user-circle", label: "마이페이지", href: "http://localhost:8812/mypage" }
					])}
          `;

					const logoutBtn = document.getElementById("logoutBtn");
					if (logoutBtn) {
						logoutBtn.addEventListener("click", e => {
							e.preventDefault();
							logout();
						});
					}
				} else {
					authSection.innerHTML = createRotatingMenu([
						{ icon: "fa-user-plus", label: "회원가입", href: "http://localhost:8812/registerpage" },
						{ icon: "fa-sign-in-alt", label: "로그인", href: "http://localhost:8812/loginpage" }
					]);
				}
			}
		});

	// ✅ FOOTER 로드
	fetch("http://localhost:8810/fragments/footer.html")
		.then(res => res.text())
		.then(data => {
			const footer = document.getElementById("footer");
			if (!footer) {
				console.warn("⚠️ footer 요소가 없어서 스킵합니다.");
				return;
			}
			footer.innerHTML = data;
		});

	// ✅ (옵션) 다른 탭에서 로그인/로그아웃 시 갱신
	window.addEventListener("storage", (e) => {
		if (e.key === "token" && window.startTokenTimer) {
			window.startTokenTimer();
		}
	});
	updateDropdownMenu();
});

let isLoggedIn = false; // TODO: 서버에서 로그인 상태에 따라 true/false 설정

function toggleDropdown() {
	const menu = document.getElementById("dropdownMenu");
	menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function updateDropdownMenu() {
	const loggedInEl = document.querySelector(".logged-in");
	const loggedOutEl = document.querySelector(".logged-out");

	if (!loggedInEl || !loggedOutEl) {
		console.warn("드롭다운 요소가 존재하지 않습니다.");
		return;
	}

	const isLoggedIn = !!localStorage.getItem("token");

	if (isLoggedIn) {
		showUserName();
		loggedInEl.style.display = "block";
		loggedOutEl.style.display = "none";
	} else {
		loggedInEl.style.display = "none";
		loggedOutEl.style.display = "block";
	}
}

document.addEventListener("click", function(event) {
	const profile = document.querySelector(".profile-dropdown");
	if (!profile.contains(event.target)) {
		document.getElementById("dropdownMenu").style.display = "none";
	}
});

window.addEventListener("DOMContentLoaded", updateDropdownMenu);

document.addEventListener("DOMContentLoaded", () => {
	const cards = document.querySelector(".cards");
	const prevBtn = document.querySelector(".prev");
	const nextBtn = document.querySelector(".next");

	let scrollAmount = 0;
	const scrollStep = 300; // 한 번에 이동할 px

	if (prevBtn && nextBtn && cards) {
		prevBtn.addEventListener("click", () => {
			cards.scrollBy({ left: -scrollStep, behavior: "smooth" });
		});

		nextBtn.addEventListener("click", () => {
			cards.scrollBy({ left: scrollStep, behavior: "smooth" });
		});
	}
});
// 전역 네비 (header onclick용)
const goTo = (url) => { window.location.href = url; };
window.goToMainService = () => goTo('http://localhost:8812/mainpage');
window.goToBankService = () => goTo('/bank');
window.goToCardService = () => goTo('/cards');
window.goToTransactions = () => goTo('/accounts');
window.goAdmin = () => goTo('/support');

function goToTransactions() {
	window.location.href = "http://localhost:8812/transactions"
}

function logout() {
	localStorage.clear();
	alert("로그아웃 되었습니다.");
	location.href = "mainpage";
}
