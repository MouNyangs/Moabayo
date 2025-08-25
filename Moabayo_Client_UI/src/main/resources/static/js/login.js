// 로그인 페이지로 접근하기 전에 사용자가 원래 가고자 했던 URL을 sessionStorage에 저장
if (document.referrer && !sessionStorage.getItem("redirectUrl") && !window.location.href.includes("login")) {
  sessionStorage.setItem("redirectUrl", document.referrer);
}

// ✅ 토큰에서 exp 꺼내는 함수
function extractExpFromBearer(bearer) {
  const raw = bearer.startsWith("Bearer ") ? bearer.slice(7) : bearer;
  const p = raw.split(".")[1];
  const base64 = p.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const json = decodeURIComponent(
    atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
  );
  return JSON.parse(json).exp; // seconds
}

// ✅ 쿠키에 exp 저장
function setExpCookie(expSec) {
  const maxAge = Math.max(1, Math.floor(expSec - Date.now() / 1000));
  document.cookie = `EXP=${expSec}; Path=/; SameSite=Lax; Max-Age=${maxAge}`;
}

// 로그인 폼 처리
document.getElementById("loginForm").addEventListener("submit", async function (e) {
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
      localStorage.setItem("userName", user.name || "");
      localStorage.setItem("role", user.role || "");

      // ✅ exp를 쿠키에 저장
      const exp = extractExpFromBearer(token);
      setExpCookie(exp);

      // ✅ 헤더에 알림 (옵션)
      window.dispatchEvent(new Event("auth:login"));

      alert("✅ 로그인 성공! 환영합니다 " + (user.name || user.id) + "님");

      // 원래 가고자 했던 URL로 리디렉션
      const redirectUrl = sessionStorage.getItem("redirectUrl") || "/mainpage";
      sessionStorage.removeItem("redirectUrl");
      location.href = redirectUrl;

    } else {
      const errorText = await response.text();
      alert("❌ 로그인 실패: " + errorText);
    }
  } catch (err) {
    console.error("🚨 로그인 요청 실패:", err);
    alert("⚠️ 서버에 연결할 수 없습니다.");
  }
});
