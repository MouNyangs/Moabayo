// 로그인 페이지로 접근하기 전에 사용자가 원래 가고자 했던 URL을 sessionStorage에 저장
if (document.referrer && !sessionStorage.getItem("redirectUrl") && !location.href.includes("login")) {
  sessionStorage.setItem("redirectUrl", document.referrer);
}

// (표시용) JWT exp 추출
function extractExpFromBearer(bearer) {
  const raw = bearer.startsWith("Bearer ") ? bearer.slice(7) : bearer;
  const p = raw.split(".")[1];
  const base64 = p.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const json = decodeURIComponent(atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  return JSON.parse(json).exp; // seconds
}

// (표시용) EXP 쿠키 저장
function setExpCookie(expSec) {
  const maxAge = Math.max(1, Math.floor(expSec - Date.now() / 1000));
  document.cookie = `EXP=${expSec}; Path=/; SameSite=Lax; Max-Age=${maxAge}`;
}

// 로그인 폼 제출
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("username").value;
  const pw = document.getElementById("password").value;

  try {
    const response = await fetch("/user/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, pw }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert("❌ 로그인 실패: " + errorText);
      return;
    }

    const user = await response.json();
    const token = response.headers.get("Authorization");
    if (!token) {
      alert("⚠️ 로그인 성공했지만 토큰이 없습니다.");
      return;
    }

    // 표시용 로컬 정보만 저장
    localStorage.setItem("userId", user.id || "");
    localStorage.setItem("userName", user.name || "");
    localStorage.setItem("role", user.role || "");

    // exp 표시용 쿠키 저장
    try {
      const exp = extractExpFromBearer(token);
      setExpCookie(exp);
    } catch {}

    // 서버가 HttpOnly ACCESS_TOKEN 심도록 verify 호출
    await fetch("http://localhost:8812/jwt/verify", {
      method: "GET",
      headers: { "Authorization": token },
      credentials: "include",
    });

    // 서버에게 로그인 상태 최종 확인
    const me = await checkLogin();
    if (!me) {
      alert("⚠️ 서버 세션 확인 실패");
      return;
    }

    alert(`✅ 로그인 성공! 환영합니다 ${me.name || me.id}님`);

    // 원래 가려던 곳 이동
    const redirectUrl = sessionStorage.getItem("redirectUrl") || "/mainpage";
    sessionStorage.removeItem("redirectUrl");
    location.href = redirectUrl;

  } catch (err) {
    console.error("🚨 로그인 요청 실패:", err);
    alert("⚠️ 서버에 연결할 수 없습니다.");
  }
});
