// 특정 섹션 안에서만 헤더 숨기기 — 아래로 스크롤하면 숨김, 위로 올리면 다시 보임
// (섹션이 화면 전체를 덮을 때만 — 다른 섹션 · 푸터가 보이면 항상 보임)
// 작품 소개(Projects)에서 작품을 화면 가득 보여주기 위해 사용
import { useEffect, useState } from "react";

const MIN_DELTA = 6; // 이보다 작은 움직임(손 떨림 · 관성 끝)은 무시

const useHideOnScroll = (sectionId, offset = 0) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      // 섹션이 화면을 위(헤더 자리)부터 아래 끝까지 덮고 있을 때만 "안" — 푸터가 보이기 시작하면 밖
      const rect = document.getElementById(sectionId)?.getBoundingClientRect();
      const isInside = Boolean(rect && rect.top <= offset && rect.bottom >= window.innerHeight);
      if (!isInside) {
        lastY = y;
        setIsHidden(false);
        return;
      }
      if (Math.abs(delta) < MIN_DELTA) return;
      lastY = y;
      setIsHidden(delta > 0);
    };

    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", request, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
    };
  }, [sectionId, offset]);

  return isHidden;
};

export default useHideOnScroll;