window.addEventListener("DOMContentLoaded", () => {
	// ✅ 1. Header 불러오기
	fetch("html/header.html")
		.then(res => res.text())
		.then(data => {
			document.getElementById("header").innerHTML = data;

			// ✅ 로그인 상태 UI 변경
			const userName = localStorage.getItem("userName");
			const authSection = document.getElementById("authSection");

			if (userName) {
				authSection.innerHTML = `
					      <div class="dropdown">
					        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					          ${userName} 님
					        </button>
					        <ul class="dropdown-menu dropdown-menu-end">
					          <li><a class="dropdown-item" href="#" id="logoutBtn">로그아웃</a></li>
					          <li><a class="dropdown-item" href="#" id="myPage">마이페이지</a></li>
					        </ul>
					      </div>
					    `;

				const logoutBtn = document.getElementById("logoutBtn");
				if (logoutBtn) {
					logoutBtn.addEventListener("click", (e) => {
						e.preventDefault();
						logout();
					});
				} else {
					console.error("logoutBtn 버튼을 찾지 못했습니다.");
				}

			} else {
				authSection.innerHTML = `
					      <div class="dropdown">
					        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					          <img src="/images/menu.png">
					        </button>
					        <ul class="dropdown-menu dropdown-menu-end">
					          <li><a class="dropdown-item" href="loginpage">로그인</a></li>
					          <li><a class="dropdown-item" href="registerpage">회원가입</a></li>
					        </ul>
					      </div>
					    `;
			}
		});

	// ✅ 2. Footer 불러오기
	fetch("html/footer.html")
		.then(res => res.text())
		.then(data => {
			document.getElementById("footer").innerHTML = data;
		});
});

// ✅ 로그아웃 함수 전역에 선언
function logout() {
	localStorage.clear();
	alert("로그아웃 되었습니다.");
	location.href = "mainpage";
}

// ✅ 3. 로딩 화면 → 메인 화면 전환
window.addEventListener("load", function() {
	setTimeout(() => {
		document.getElementById("main-content").style.display = "block";
	}, 3500); // 3.5초 후에 메인 콘텐츠 보여줌
});