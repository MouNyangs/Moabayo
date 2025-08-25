async function goToCardService() {
	  // 1) 세션 확인 (쿠키 자동 전송)
	  try {
	    const res = await fetch("http://localhost:8812/jwt/verify", {
	      method: "GET",
	      credentials: "include" // ❗쿠키 동반 필수
	    });
		

		const text = await res.text().catch(() => "(no body)");
		console.log("[verify] status:", res.status, "body:", text);

	    if (res.ok) {
	      // 2) 인증 성공 → 은행 서비스로 이동
	      window.location.href = "http://localhost:8814/usercard/cardList";
	    } else {
	      throw new Error("인증 실패");
	    }
	  } catch (err) {
	    console.error("❌ 인증 에러:", err);
	    alert("인증되지않았습니다. 다시 로그인해주세요.");
	    window.location.href = "http://localhost:8812/loginpage";
	  }
	}