import { useEffect } from "react";

// 표지 ↔ 본문 한 번에 — 표지에서 휠을 아래로 굴리면 본문 시작(고정 칸 · 첫 기능)으로, 본문 맨 위에서 위로 굴리면 표지로
// (마우스 휠만 — 터치 · 키보드 · 스크롤바는 그대로, 사이트 부드러운 스크롤보다 먼저 받아서 처리)
const SNAP_TIME = 1200; // 표지 ↔ 본문 이동 시간(ms) — 천천히 출발해서 천천히 멈춤
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const useCoverSnap = (coverRef, key) => {
  useEffect(() => {
    const cover = coverRef.current;
    if (!cover || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    // 사이트 휠 엔진(처음에 확 움직이는 방식) 대신 여기서 직접 부드럽게 이동
    const glide = (to) => {
      const from = window.scrollY;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / SNAP_TIME);
        window.scrollTo({ top: from + (to - from) * easeInOut(t), behavior: "instant" });
        frame = t < 1 ? requestAnimationFrame(tick) : 0;
      };
      frame = requestAnimationFrame(tick);
    };
    const onWheel = (e) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const end = cover.getBoundingClientRect().bottom + window.scrollY; // 표지 끝 = 본문 시작
      const y = window.scrollY;
      const down = e.deltaY > 0 && y < end - 2;
      const up = e.deltaY < 0 && y > 2 && y <= end + 2;
      if (!down && !up && !frame) return;
      e.preventDefault(); // 이동 중에 들어오는 휠은 무시
      if (frame) return;
      glide(down ? end : 0);
    };
    // 내리는 동안 표지가 뒤로 물러나는 느낌 — 진행도(0~1)를 CSS 변수로 (사진은 천천히 내려가고 글은 흐려짐)
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = Math.min(1, Math.max(0, window.scrollY / cover.offsetHeight));
        cover.style.setProperty("--cover-p", p.toFixed(3));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointerdown", stop, true);
    window.addEventListener("keydown", stop, true);
    return () => {
      stop();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", stop, true);
      window.removeEventListener("keydown", stop, true);
    };
  }, [coverRef, key]);
};

export default useCoverSnap;
