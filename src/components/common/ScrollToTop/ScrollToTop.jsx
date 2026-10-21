// 페이지 이동 시 맨 위로, 주소에 #섹션이 있으면 그 섹션으로 스크롤
// (다른 페이지에서 헤더 메뉴를 누르면 Home으로 이동한 뒤 해당 섹션으로 — AGENTS.md 5장)
// - 다른 페이지로 넘어갈 때는 즉시 이동 (부드러운 스크롤로 화면이 올라가며 보이지 않게)
// - 같은 페이지 안에서 메뉴로 섹션 이동할 때만 부드럽게
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { scrollToElement } from "@/utils/scrollToY";

const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const samePage = prevPathname.current === pathname;
    prevPathname.current = pathname;
    const behavior = samePage ? "smooth" : "instant";

    if (hash) {
      // 페이지가 그려진 다음 프레임에 찾아야 섹션이 존재한다
      requestAnimationFrame(() => {
        // About은 교육 과정 줄로 (헤더 메뉴와 같은 곳)
        const facts = hash === "#about" && document.querySelector("[data-about-facts]");
        if (facts) scrollToElement(facts, { smooth: behavior === "smooth", pad: 0, jump: true });
        else scrollToElement(document.getElementById(hash.slice(1)), { smooth: behavior === "smooth" });
      });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, key]); // key: 같은 메뉴 · 로고를 다시 눌러도 이동

  return null;
};

export default ScrollToTop;