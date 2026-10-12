import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// 지금 보고 있는 섹션 id를 돌려준다 (헤더 메뉴 현재 위치 표시용)
// - 화면 위에서 35% 지점을 지난 마지막 섹션 = 지금 섹션
// - 페이지 맨 아래에 닿으면 마지막 섹션(푸터 = Contact)
// - 섹션이 없는 페이지(작품 상세)는 fallback 값 (Projects)
const useActiveSection = (ids, fallback = null) => {
  const [active, setActive] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    let frame = null;

    const update = () => {
      frame = null;
      const line = window.innerHeight * 0.35;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const found = ids.filter((id) => document.getElementById(id));

      let next = fallback;
      if (atBottom && found.length) {
        next = found[found.length - 1];
      } else {
        const passed = found.filter((id) => document.getElementById(id).getBoundingClientRect().top <= line);
        const sectionIds = found.filter((id) => id !== ids[ids.length - 1]); // 푸터 제외한 페이지 섹션
        if (passed.length) next = passed[passed.length - 1];
        else if (sectionIds.length) next = null; // 첫 섹션 위(맨 위)는 표시 없음
      }
      // 상세 페이지처럼 페이지 섹션이 없으면 푸터 전까지 fallback 유지
      if (!found.some((id) => id !== ids[ids.length - 1]) && next !== ids[ids.length - 1]) next = fallback;
      setActive((prev) => (prev === next ? prev : next));
    };

    const requestUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [pathname, ids, fallback]);

  return active;
};

export default useActiveSection;