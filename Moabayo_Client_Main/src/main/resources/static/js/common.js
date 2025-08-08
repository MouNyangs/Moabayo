function toggleMenu() {
	const menu = document.getElementById("menu");
	if (menu) menu.classList.toggle("active");
}

window.addEventListener("DOMContentLoaded", () => {
	// ✅ HEADER 로드
	fetch("html/header.html")
		.then(res => res.text())
		.then(data => {
			const header = document.getElementById("header");
			if (!header) return; // 💥 header 요소가 없으면 중단

			header.innerHTML = data;

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
							{ icon: "fa-user-circle", label: "마이페이지", href: "mypage" }
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
						{ icon: "fa-user-plus", label: "회원가입", href: "registerpage" },
						{ icon: "fa-sign-in-alt", label: "로그인", href: "loginpage" }
					]);
				}
			}
		});

	// ✅ FOOTER 로드
	fetch("html/footer.html")
	  .then(res => res.text())
	  .then(data => {
	    const footer = document.getElementById("footer");
	    if (!footer) {
	      console.warn("⚠️ footer 요소가 없어서 스킵합니다.");
	      return;
	    }

	    footer.innerHTML = data;
	  });

});

function logout() {
	localStorage.clear();
	alert("로그아웃 되었습니다.");
	location.href = "mainpage";
}
