// 페이지 안 이동(로고 · 메뉴 · 점 · 맨 위로)은 모두 여기로 — 부드러운 휠 스크롤(useSmoothScroll)과 같은 엔진으로 움직여 서로 덮어쓰지 않게
// - useSmoothScroll이 켜져 있으면 그 훅이 이 요청을 받아 목표 위치로 미끄러지듯 이동 (휠을 더 굴려도 목표에 더해짐)
// - 꺼져 있으면(동작 줄이기 등) 브라우저 기본 scrollTo
export const SCROLL_EVENT = "site:scrollto";
export const SCROLL_DONE_EVENT = "site:scrolldone"; // 메뉴 이동이 끝남(도착 · 휠 · 누름으로 멈춤)

// el: 목표 요소 — 이동하는 동안 위쪽 내용 높이가 바뀌어도(사진 로드 등) 그 요소를 끝까지 따라감
export const scrollToY = (top, { smooth = true, el = null } = {}) => {
  const event = new CustomEvent(SCROLL_EVENT, { detail: { top, smooth, el }, cancelable: true });
  const handled = !window.dispatchEvent(event); // 훅이 preventDefault()하면 처리된 것
  if (!handled) window.scrollTo({ top, behavior: smooth ? "smooth" : "instant" });
};

// 요소 위치(헤더 높이만큼 위 여백 — global.scss scroll-padding-top과 같게)
export const scrollToElement = (el, options) => {
  if (!el) return;
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  scrollToY(Math.max(0, el.getBoundingClientRect().top + window.scrollY - pad), { ...options, el });
};
// 맨 위(Hero)로 한 번에 — 흰 막이 살짝 덮였다 걷히는 사이에 순간 이동
// (긴 페이지를 거슬러 올라가는 스크롤도, 뚝 끊기는 순간 이동도 어색해서) — 로고 · 맨 위로 버튼
const VEIL_IN = 250;  // 흰 막이 덮이는 시간(ms)
const VEIL_OUT = 450; // 걷히는 시간(ms)
export const jumpToTop = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    scrollToY(0, { smooth: false });
    return;
  }
  const veil = document.createElement("div");
  Object.assign(veil.style, {
    position: "fixed",
    inset: "0",
    zIndex: "9", // 헤더 바로 아래
    backgroundColor: getComputedStyle(document.body).backgroundColor,
    pointerEvents: "none",
  });
  document.body.appendChild(veil);
  const cover = veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: VEIL_IN, easing: "ease-in", fill: "forwards" });
  cover.onfinish = () => {
    scrollToY(0, { smooth: false });
    const reveal = veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: VEIL_OUT, easing: "ease-out", fill: "forwards" });
    reveal.onfinish = () => veil.remove();
  };
};
