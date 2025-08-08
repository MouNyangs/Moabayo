document.addEventListener("DOMContentLoaded", () => {
	const cardsList = document.querySelector(".cards");
	const cards = document.querySelectorAll(".cards li");
	const prevBtn = document.querySelector(".prev");
	const nextBtn = document.querySelector(".next");

	const cardWidth = 320; // 카드 300 + gap 20
	const originalCount = cards.length;

	// 앞뒤로 카드 복제해서 무한 루프 구현
	for (let i = 0; i < originalCount; i++) {
		const cloneFront = cards[originalCount - 1 - i].cloneNode(true);
		cardsList.insertBefore(cloneFront, cardsList.firstChild);
		const cloneBack = cards[i].cloneNode(true);
		cardsList.appendChild(cloneBack);
	}

	const allCards = cardsList.querySelectorAll("li");
	const totalCards = allCards.length;

	let currentIndex = originalCount;
	let isTransitioning = false; // 트랜지션 중복 방지

	function updateSlider(animate = true) {
		if (animate) {
			cardsList.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
		} else {
			cardsList.style.transition = "none";
		}
		const offset = currentIndex * cardWidth;
		cardsList.style.transform = `translateX(${-offset}px)`;

		allCards.forEach(card => card.classList.remove("active"));

		// 중앙 카드 active 처리 (currentIndex + 1 위치)
		let activeIndex = currentIndex + 1;
		if (activeIndex >= totalCards) activeIndex = activeIndex - totalCards;
		allCards[activeIndex].classList.add("active");
	}

	cardsList.addEventListener("transitionstart", () => {
		isTransitioning = true;
	});

	cardsList.addEventListener("transitionend", () => {
		isTransitioning = false;

		// transition 끝나고 바로 위치 점프 할 때 깜빡임 방지용 처리
		if (currentIndex >= originalCount * 2) {
			currentIndex -= originalCount;
			// transition 끄고 위치만 옮긴 뒤 다음 프레임에 transition 다시 켜기
			cardsList.style.transition = "none";
			requestAnimationFrame(() => {
				updateSlider(false);
				requestAnimationFrame(() => {
					cardsList.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
				});
			});
		} else if (currentIndex < originalCount) {
			currentIndex += originalCount;
			cardsList.style.transition = "none";
			requestAnimationFrame(() => {
				updateSlider(false);
				requestAnimationFrame(() => {
					cardsList.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
				});
			});
		}
	});

	prevBtn.addEventListener("click", () => {
		if (isTransitioning) return; // 트랜지션 중에는 무시
		currentIndex--;
		updateSlider();
	});

	nextBtn.addEventListener("click", () => {
		if (isTransitioning) return;
		currentIndex++;
		updateSlider();
	});

	// 휠 스크롤 이벤트로 카드 이동
	cardsList.addEventListener("wheel", (e) => {
		e.preventDefault();

		if (isTransitioning) return;

		if (e.deltaY < 0) {
			currentIndex--;
		} else {
			currentIndex++;
		}
		updateSlider();
	}, { passive: false });

	// 초기 세팅
	currentIndex = originalCount;
	updateSlider(false);
});