// 사이트 전체 부드러운 스크롤 — 마우스 휠을 조금 느리게, 미끄러지듯 따라가게
// - 휠 한 칸이 바로 뚝 내려가지 않고, 목표 위치까지 조금씩 따라감 (SiteLayout에서 1회 실행)
// - 키보드 · 스크롤바 · 터치는 브라우저 기본 그대로 (누르거나 움직이면 따라가기를 멈추고 그 위치로 맞춤)
// - 로고 · 메뉴 · 점 · 맨 위로 이동(utils/scrollToY)도 이 훅이 같은 방식으로 처리 — 서로 덮어쓰지 않음
// - 인트로 · 크게 보기처럼 스크롤을 잠근 동안, 안쪽에 스크롤 칸(코드 카드 등)이 있으면 건드리지 않음
// - "동작 줄이기" 사용자는 사용하지 않음
import { useEffect } from "react";
import { SCROLL_EVENT } from "@/utils/scrollToY";

const SPEED = 0.75;  // 휠 한 칸에 움직이는 거리 배수 (1 = 브라우저 기본, 작을수록 느림)
const FOLLOW = 0.09; // 목표를 따라가는 정도 (작을수록 더 미끄러지듯)
const NAV_GUARD = 600; // 메뉴 이동 직후 이 시간(ms) 동안 들어오는 휠은 무시 (터치패드 관성 휠이 이동을 흔들지 않게)

// 휠이 굴러간 곳 안에 같은 방향으로 더 스크롤할 수 있는 칸이 있으면 그 칸에 맡김
const canScrollInside = (el, dy) => {
  for (let node = el; node && node !== document.body; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight) {
      if (dy > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 1) return true;
      if (dy < 0 && node.scrollTop > 0) return true;
    }
  }
  return false;
};

const useSmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let target = window.scrollY;
    let current = window.scrollY;
    let frame = 0;
    let navAt = 0; // 마지막 메뉴 이동 시각

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const step = () => {
      current += (target - current) * FOLLOW;
      if (Math.abs(target - current) < 0.5) current = target;
      window.scrollTo({ top: current, behavior: "instant" });
      frame = current === target ? 0 : requestAnimationFrame(step);
    };

    const onWheel = (e) => {
      if (e.ctrlKey || e.defaultPrevented) return; // 확대 · 다른 처리 우선
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // 가로 휠
      if (document.body.style.overflow === "hidden") return; // 인트로 · 크게 보기
      if (canScrollInside(e.target, e.deltaY)) return;
      e.preventDefault();
      if (performance.now() - navAt < NAV_GUARD) return; // 메뉴 이동 직후 관성 휠
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1; // 줄 · 페이지 단위 휠
      if (!frame) { target = window.scrollY; current = window.scrollY; } // 멈춰 있었으면 지금 위치에서 시작
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY * unit * SPEED));
      if (!frame) frame = requestAnimationFrame(step);
    };

    // 휠이 아닌 방법으로 움직이면(키보드 · 스크롤바 · 메뉴 이동) 따라가던 것을 멈추고 그 위치로 맞춤
    const onScroll = () => {
      if (frame && Math.abs(window.scrollY - current) > 2) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      if (!frame) { target = window.scrollY; current = window.scrollY; }
    };

    // 휠로 따라가는 중에 누르거나(로고 · 메뉴 · 점 · 맨 위로) 키를 누르면 즉시 멈춤
    // — 멈추지 않으면 다음 프레임의 scrollTo가 메뉴 이동(부드러운 스크롤)을 덮어써서 제자리에 남음
    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
      target = window.scrollY;
      current = window.scrollY;
    };

    // 로고 · 메뉴 · 점 · 맨 위로 (utils/scrollToY) — 같은 엔진으로 목표 위치까지 미끄러지듯
    const onNavigate = (e) => {
      const { top, smooth } = e.detail;
      stop();
      if (!smooth) return; // 즉시 이동은 브라우저에 맡김 (preventDefault 안 함)
      e.preventDefault();
      navAt = performance.now();
      target = Math.max(0, Math.min(maxScroll(), top));
      frame = requestAnimationFrame(step);
    };

    window.addEventListener(SCROLL_EVENT, onNavigate);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", stop, true);
    window.addEventListener("keydown", stop, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(SCROLL_EVENT, onNavigate);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", stop, true);
      window.removeEventListener("keydown", stop, true);
    };
  }, []);
};

export default useSmoothScroll;