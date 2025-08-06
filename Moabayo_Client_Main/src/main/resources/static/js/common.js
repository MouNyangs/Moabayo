window.addEventListener("DOMContentLoaded", () => {
	// ✅ 1. Header 불러오기
	fetch("html/header.html")
		.then(res => res.text())
		.then(data => {
			document.getElementById("header").innerHTML = data;

			// ✅ 로그인 상태 UI 변경
			const userName = localStorage.getItem("userName");
			const authSection = document.getElementById("authSection");

			if (userName && authSection) {
				console.log("로그인됨 페이지임");
				authSection.innerHTML = `
				<!-- ref link: https://getbootstrap.com/docs/5.3/components/dropdowns/#menu-items -->
				<div class="dropdown">
					<button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
						로그인됨
					</button>
					<ul class="dropdown-menu">
						<li><button class="dropdown-item" type="button">내 정보</button></li>
						<li><button class="dropdown-item" type="button">설정</button></li>
						<li><button class="dropdown-item" type="button">도움말</button></li>
					</ul>
				</div>
				<span class="welcome-message">${userName} 님</span>
				<a href="#" class="auth-link" onclick="logout()">로그아웃</a>
			`;
			} else {
				console.log("로그인안됨 페이지임");
				authSection.innerHTML = `
				<div class="dropdown">
					<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
						로그인안됨
					</button>
					<ul class="dropdown-menu">
						<li><button class="dropdown-item" type="button">로그인</button></li>
						<li><button class="dropdown-item" type="button">회원가입</button></li>
						<li><button class="dropdown-item" type="button">도움말</button></li>
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
		document.getElementById("loading-screen").style.display = "none";
		document.getElementById("main-content").style.display = "block";
	}, 3500); // 3.5초 후에 메인 콘텐츠 보여줌
});