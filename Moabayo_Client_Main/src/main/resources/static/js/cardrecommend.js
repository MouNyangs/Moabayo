gsap.registerPlugin(ScrollTrigger);

gsap.to("img", { opacity: 1, delay: 0.1 }); // gentle fade in

let iteration = 0;

const spacing = 0.1,
	snap = gsap.utils.snap(spacing),
	cards = gsap.utils.toArray('.cards li'),
	seamlessLoop = buildSeamlessLoop(cards, spacing),
	scrub = gsap.to(seamlessLoop, {
		totalTime: 0,
		duration: 0.5,
		ease: "power3",
		paused: true
	}),
	trigger = ScrollTrigger.create({
		start: 0,
		onUpdate(self) {
			if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
				wrapForward(self);
			} else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
				wrapBackward(self);
			} else {
				scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
				scrub.invalidate().restart();
				self.wrapping = false;
			}
		},
		end: "+=3000",
		pin: ".gallery"
	});

function wrapForward(trigger) {
	iteration++;
	trigger.wrapping = true;
	trigger.scroll(trigger.start + 1);
}

function wrapBackward(trigger) {
	iteration--;
	if (iteration < 0) {
		iteration = 9;
		seamlessLoop.totalTime(seamlessLoop.totalTime() + seamlessLoop.duration() * 10);
		scrub.pause();
	}
	trigger.wrapping = true;
	trigger.scroll(trigger.end - 1);
}

function scrubTo(totalTime) {
	let progress = (totalTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration();
	if (progress > 1) {
		wrapForward(trigger);
	} else if (progress < 0) {
		wrapBackward(trigger);
	} else {
		trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
	}
}

document.querySelector(".next").addEventListener("click", () => scrubTo(scrub.vars.totalTime + spacing));
document.querySelector(".prev").addEventListener("click", () => scrubTo(scrub.vars.totalTime - spacing));

function buildSeamlessLoop(items, spacing) {
	let overlap = Math.ceil(1 / spacing),
		startTime = items.length * spacing + 0.5,
		loopTime = (items.length + overlap) * spacing + 1,
		rawSequence = gsap.timeline({ paused: true }),
		seamlessLoop = gsap.timeline({
			paused: true,
			repeat: -1,
			onRepeat() {
				this._time === this._dur && (this._tTime += this._dur - 0.01);
			}
		}),
		l = items.length + overlap * 2,
		time = 0,
		i, index, item;

	gsap.set(items, { xPercent: 300, opacity: 0, scale: 0 });

	for (i = 0; i < l; i++) {
		index = i % items.length;
		item = items[index];
		time = i * spacing;
		rawSequence.fromTo(item, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false }, time)
			.fromTo(item, { xPercent: 300 }, { xPercent: -300, duration: 1, ease: "none", immediateRender: false }, time);
		i <= items.length && seamlessLoop.add("label" + i, time);
	}

	rawSequence.time(startTime);
	seamlessLoop.to(rawSequence, {
		time: loopTime,
		duration: loopTime - startTime,
		ease: "none"
	}).fromTo(rawSequence, { time: overlap * spacing + 1 }, {
		time: startTime,
		duration: startTime - (overlap * spacing + 1),
		immediateRender: false,
		ease: "none"
	});
	return seamlessLoop;
}
const gallery = document.querySelector('.gallery');

if (gallery) {
	gallery.addEventListener('mouseenter', () => {
		document.body.style.overflow = 'hidden';
	});

	gallery.addEventListener('mouseleave', () => {
		document.body.style.overflow = '';
	});
} else {
	console.warn("'.gallery' 요소를 찾지 못했습니다.");
}

document.addEventListener('DOMContentLoaded', () => {
	const cardsWrap = document.querySelector('#main-card-section .cards-wrap');
	const cardItems = document.querySelectorAll('#main-card-section .card-item');
	const prevBtn = document.querySelector('#main-card-section .prev');
	const nextBtn = document.querySelector('#main-card-section .next');

	if (!cardsWrap) return;

	const STEP = 260; // 한 번에 이동할 픽셀 (카드 너비+간격에 맞춰 조정)

	// Prev/Next
	if (prevBtn) prevBtn.addEventListener('click', () => cardsWrap.scrollBy({ left: -STEP, behavior: 'smooth' }));
	if (nextBtn) nextBtn.addEventListener('click', () => cardsWrap.scrollBy({ left: STEP, behavior: 'smooth' }));

	// 마우스 휠을 가로 스크롤로 변환 (페이지 세로 스크롤 방지)
	cardsWrap.addEventListener('wheel', (e) => {
		// 수직 휠 움직임이 있을 때만 처리
		if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
			e.preventDefault(); // 중요: 페이지가 같이 스크롤 되는 것을 막음
			cardsWrap.scrollLeft += e.deltaY; // deltaY를 가로로 적용
		}
	}, { passive: false });

	// 가운데 카드 자동 highlighting (가장 화면 중앙에 있는 카드에 .center 추가)
	const updateCenter = () => {
		const wrapRect = cardsWrap.getBoundingClientRect();
		const centerX = wrapRect.left + wrapRect.width / 2;
		let closest = null;
		let best = Infinity;

		cardItems.forEach(item => {
			const r = item.getBoundingClientRect();
			const itemCenter = r.left + r.width / 2;
			const diff = Math.abs(itemCenter - centerX);
			if (diff < best) {
				best = diff;
				closest = item;
			}
			item.classList.remove('center');
		});
		if (closest) closest.classList.add('center');
	};

	// 스크롤 발생시 중앙 계산 (성능: requestAnimationFrame으로 묶음)
	let rafId = null;
	const onScroll = () => {
		if (rafId) cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(() => { updateCenter(); rafId = null; });
	};
	cardsWrap.addEventListener('scroll', onScroll);

	// 초기 중앙 지정
	updateCenter();

	// 화면 리사이즈에도 중앙 재계산
	window.addEventListener('resize', updateCenter);
});