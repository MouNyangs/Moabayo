// ===== 설정(필요 시만 수정) =====
const CARD_ART_URL = "/cardimg/KakaoTalk_20250812_152508906.png"; // 카드 면 이미지
const CARD_SCALE   = 0.85;   // 전체 카드 크기(0.8~1.0)
const ROTATE_ART   = false;  // 세로사진이면 true (카드 중심 기준 90° 회전)

const ART_SCALE    = 1.08;   // 카드 안을 꽉 채우는 최소 확대(1.06~1.12 권장)
const ART_SHIFT_X  = 0;      // 미세 위치 조정(X)
const ART_SHIFT_Y  = 0.5;    // 미세 위치 조정(Y)

const SHOW_PARALLAX = true;  // 마우스 패럴랙스
const SHOW_SHEEN    = true;  // 유광 스트립 애니메이션

// ===== 로직 =====
(function () {
  const artImg   = document.querySelector('.card-art');
  const artInner = document.getElementById('artInner');

  // 1) 이미지 주입 + cover(꽉 채움)
  artImg.setAttribute('xlink:href', CARD_ART_URL);
  artImg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

  // 2) 회전/확대/이동 (카드 중앙 170,270 기준)
  const cx = 170, cy = 270;
  let t = '';
  if (ROTATE_ART) t += `rotate(90 ${cx} ${cy}) `;
  t += `translate(${ART_SHIFT_X} ${ART_SHIFT_Y}) translate(${cx} ${cy}) scale(${ART_SCALE}) translate(${-cx} ${-cy})`;
  artInner.setAttribute('transform', t);

  // 3) GSAP 인트로 & 배치
  const tl = gsap.timeline()
    .set('.numTxt',  { x:22,  y:375 })
    .set('.nameTxt', { x:22,  y:410 })
    .set('.chip',    { x:148, y:66  })
    .add(centerMain(), 0.05)
    .from('.ball',   { duration:1.2, transformOrigin:'50% 50%', scale:0.9, opacity:0.6, ease:'power2.out', stagger:0.1 }, 0)
    .fromTo('.card',
      { x:200, y:40, rotation:-4, skewX:10, skewY:4, scale:2, opacity:0 },
      { duration:1.1, skewX:0, skewY:0, scale: CARD_SCALE, opacity:1, ease:'power4.inOut' },
      0.1
    );

  function centerMain(){
    gsap.set('.main', { x:'50%', xPercent:-50, y:'50%', yPercent:-50 });
  }
  addEventListener('resize', centerMain); centerMain();

  // 4) 패럴랙스/유광
  if (SHOW_PARALLAX) {
    addEventListener('mousemove', e => {
      const p = { x: e.clientX / innerWidth, y: e.clientY / innerHeight };
      gsap.to('.card', { rotation: -7 + 9*p.x, duration:.45, overwrite:'auto' });
      gsap.to('.bg',   { x:100-200*p.x, y:20-40*p.y, duration:.45, overwrite:'auto' });
    });
  }

  if (SHOW_SHEEN) {
    gsap.set('.sheen', { display:'block', x:-360, opacity:0 });
    gsap.to('.sheen',  { x:540, opacity:.6, duration:1.2, ease:'power2.out', delay:.6 });
  }
})();
