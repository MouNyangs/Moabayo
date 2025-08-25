window.addEventListener('DOMContentLoaded', () => {
  const svg  = document.getElementById('logoSVG');
  const band = document.getElementById('revealBand');
  const pen  = document.getElementById('penDot');

  if (!svg || !band) return;

  const vb = svg.viewBox.baseVal;               // 210×297
  const DRAW_MS = 2600;
  const EASE = 'cubic-bezier(.25,.8,.25,1)';

  // 시작 전 완전 숨김
  band.setAttribute('width', 0);
  band.setAttribute('height', vb.height);       // 혹시 빠졌다면 높이 보장
  band.setAttribute('y', 0);

  // 왼→오 드러내기
  band.animate(
    [{ width: 0 }, { width: vb.width }],
    { duration: DRAW_MS, easing: EASE, fill: 'forwards' }
  );

  // (선택) 펜촉 이동
  if (pen) {
    pen.setAttribute('cy', Math.round(vb.height * 0.74));
    pen.animate(
      [{ transform: 'translateX(0px)', opacity: 0 },
       { transform: `translateX(${vb.width - 6}px)`, opacity: 1 }],
      { duration: DRAW_MS, easing: EASE, fill: 'forwards' }
    );
    setTimeout(() =>
      pen.animate([{opacity:1},{opacity:0}], {duration: 300, fill:'forwards'}),
      DRAW_MS
    );
  }
});
