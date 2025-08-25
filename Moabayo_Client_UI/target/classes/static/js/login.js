// 로그인 폼 처리
document.getElementById("loginForm").addEventListener("submit", async function(e) {
	e.preventDefault();

	const id = document.getElementById("username").value;
	const pw = document.getElementById("password").value;

	try {
		const response = await fetch("/user/validate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ id, pw })
		});

		if (response.ok) {
			const user = await response.json();
			const token = response.headers.get("Authorization");

			if (!token) {
				alert("⚠️ 로그인 성공했지만 토큰이 없습니다.");
				return;
			}

			localStorage.setItem("token", token);
			localStorage.setItem("userId", user.id);
			localStorage.setItem("userName", user.name || "");
			localStorage.setItem("role", user.role || "");

			alert(`✅ 로그인 성공! 환영합니다 ${(user.name || user.id)}님`);

			// 리디렉션 URL 가져오기
			location.href = "/mainpage";

		} else {
			const errorText = await response.text();
			alert("❌ 로그인 실패: " + errorText);
		}
	} catch (err) {
		console.error("🚨 로그인 요청 실패:", err);
		alert("⚠️ 서버에 연결할 수 없습니다.");
	}
});