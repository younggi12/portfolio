// 페이지 안 이동(로고 · 메뉴 · 점 · 맨 위로)은 모두 여기로 — 부드러운 휠 스크롤(useSmoothScroll)과 같은 엔진으로 움직여 서로 덮어쓰지 않게
// - useSmoothScroll이 켜져 있으면 그 훅이 이 요청을 받아 목표 위치로 미끄러지듯 이동 (휠을 더 굴려도 목표에 더해짐)
// - 꺼져 있으면(동작 줄이기 등) 브라우저 기본 scrollTo
export const SCROLL_EVENT = "site:scrollto";

export const scrollToY = (top, { smooth = true } = {}) => {
  const event = new CustomEvent(SCROLL_EVENT, { detail: { top, smooth }, cancelable: true });
  const handled = !window.dispatchEvent(event); // 훅이 preventDefault()하면 처리된 것
  if (!handled) window.scrollTo({ top, behavior: smooth ? "smooth" : "instant" });
};

// 요소 위치(헤더 높이만큼 위 여백 — global.scss scroll-padding-top과 같게)
export const scrollToElement = (el, options) => {
  if (!el) return;
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  scrollToY(Math.max(0, el.getBoundingClientRect().top + window.scrollY - pad), options);
};