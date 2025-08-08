function goToCardService() {
	const token = localStorage.getItem('token');

	if (!token) {
		alert("로그인이 필요합니다.");
		window.location.href = "loginpage";
		return;
	}

	// ✅ 카드 인증 요청
	fetch("http://localhost:8812/card/verify", {
		method: "GET",
		headers: {
			"Authorization": token
		}
	})
		.then(res => {
			if (res.ok) {
				return res.text();  // HTML 문자열로 응답 받음
			} else {
				throw new Error("인증 실패");
			}
		})
		.then(html => {
			document.open();
			document.write(html);
			document.close();
		})
		.catch(err => {
			console.error("❌ 인증 에러:", err);
			alert("인증되지 않았습니다. 다시 로그인해주세요.");
			window.location.href = "loginpage";
		});
}