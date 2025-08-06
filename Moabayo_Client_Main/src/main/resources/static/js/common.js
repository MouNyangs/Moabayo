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
	}, 3500); // 2초 후에 메인 콘텐츠 보여줌
});