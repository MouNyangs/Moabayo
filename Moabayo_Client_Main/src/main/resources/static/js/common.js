window.addEventListener("DOMContentLoaded", () => {
	fetch("html/header.html")
		.then(res => res.text())
		.then(data => {
			document.getElementById("header").innerHTML = data;
		});

	fetch("html/footer.html")
		.then(res => res.text())
		.then(data => {
			document.getElementById("footer").innerHTML = data;
		});
});

window.addEventListener("load", function() {
	setTimeout(() => {
		document.getElementById("loading-screen").style.display = "none";
		document.getElementById("main-content").style.display = "block";
	}, 2000); // 2초 후에 메인 콘텐츠 보여줌
});

document.addEventListener("DOMContentLoaded", () => {
	const loadingScreen = document.getElementById("loading-screen");
	const mainContent = document.getElementById("main-content");
	const progressBar = document.getElementById("progress-bar");
	const progressText = document.getElementById("progress-text");

	let progress = 0;

	const interval = setInterval(() => {
		if (progress >= 100) {
			clearInterval(interval);
			loadingScreen.style.display = "none";
			mainContent.style.display = "block";
		} else {
			progress += 2;
			progressBar.style.width = `${progress}%`;
			progressText.textContent = `${progress}%`;
		}
	}, 50); // 약 2.5초 만에 완료
});