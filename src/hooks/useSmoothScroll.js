// 사이트 전체 부드러운 스크롤 — 마우스 휠을 조금 느리게, 미끄러지듯 따라가게
// - 휠 한 칸이 바로 뚝 내려가지 않고, 목표 위치까지 조금씩 따라감 (SiteLayout에서 1회 실행)
// - 키보드 · 스크롤바 · 메뉴 이동(scrollIntoView) · 터치는 브라우저 기본 그대로 (움직이면 목표를 그 위치로 맞춤)
// - 인트로 · 크게 보기처럼 스크롤을 잠근 동안, 안쪽에 스크롤 칸(코드 카드 등)이 있으면 건드리지 않음
// - "동작 줄이기" 사용자는 사용하지 않음
import { useEffect } from "react";

const SPEED = 0.75;  // 휠 한 칸에 움직이는 거리 배수 (1 = 브라우저 기본, 작을수록 느림)
const FOLLOW = 0.09; // 목표를 따라가는 정도 (작을수록 더 미끄러지듯)

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

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
};

export default useSmoothScroll;