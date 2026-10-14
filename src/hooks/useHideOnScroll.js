// 특정 섹션 안에서는 헤더 숨기기 — 스크롤 방향과 상관없이 항상 숨김
// (섹션이 화면 전체를 덮을 때만 — 다른 섹션 · 푸터가 보이기 시작하면 다시 보임)
// 작품 소개(Projects)에서 작품을 화면 가득 보여주기 위해 사용
// ※ 키보드로 헤더 링크에 들어가면 보임 (Header.module.scss `.hidden:not(:focus-within)`)
import { useEffect, useState } from "react";

const useHideOnScroll = (sectionId, offset = 0) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      // 섹션이 화면을 위(헤더 자리)부터 아래 끝까지 덮고 있을 때만 "안"
      const rect = document.getElementById(sectionId)?.getBoundingClientRect();
      setIsHidden(Boolean(rect && rect.top <= offset && rect.bottom >= window.innerHeight));
    };

    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [sectionId, offset]);

  return isHidden;
};

export default useHideOnScroll;