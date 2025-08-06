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
				authSection.innerHTML = `
	        <span class="welcome-message">${userName} 님</span>
	        <a href="#" class="auth-link" onclick="logout()">로그아웃</a>
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