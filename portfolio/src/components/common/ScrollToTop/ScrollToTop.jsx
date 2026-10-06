// 페이지 이동 시 맨 위로, 주소에 #섹션이 있으면 그 섹션으로 스크롤
// (다른 페이지에서 헤더 메뉴를 누르면 Home으로 이동한 뒤 해당 섹션으로 — AGENTS.md 5장)
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // 페이지가 그려진 다음 프레임에 찾아야 섹션이 존재한다
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
