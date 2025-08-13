document.getElementById("loginForm").addEventListener("submit", async function(e) {
	e.preventDefault(); // form 기본 제출 방지

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
			// JSON 응답 파싱
			const user = await response.json();

			// 헤더에서 토큰 추출 (Authorization: Bearer xxx)
			const token = response.headers.get("Authorization");

			if (!token) {
				alert("⚠️ 로그인 성공했지만 토큰이 없습니다.");
				return;
			}

			// localStorage 저장
			localStorage.setItem("token", token);
			localStorage.setItem("userId", user.id);
			localStorage.setItem("userName", user.name || ""); // name이 없을 수도 있으니 기본값 처리
			localStorage.setItem("role", user.role || "");

			alert("✅ 로그인 성공! 환영합니다 " + (user.name || user.id) + "님");
			alert("토큰" + token);
			location.href = "/mainpage"; // 로그인 성공 후 이동

		} else {
			const errorText = await response.text();
			alert("❌ 로그인 실패: " + errorText);
		}
	} catch (err) {
		console.error("🚨 로그인 요청 실패:", err);
		alert("⚠️ 서버에 연결할 수 없습니다.");
	}
});