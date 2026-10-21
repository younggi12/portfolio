// 맨 위로 버튼 — 오른쪽 아래 챗봇(YG) 버튼 바로 위
// - 첫 화면을 지나 내려오면 나타나고, 맨 위 근처 · 푸터(이미 "맨 위로"가 있음)에서는 숨김
// - 동그라미 없이 화살표만, 위아래로 살짝 떠다님 / 뒤에 깔린 배경이 어두우면 흰 화살표, 밝으면 검은 화살표 (스크롤할 때마다 버튼 자리의 배경색을 확인)
// - 홈에서는 로고처럼 흰 막 사이에 한 번에 맨 위로, 다른 페이지는 부드럽게
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { FOOTER_TEXT } from "@/data/site";
import { jumpToTop, scrollToY } from "@/utils/scrollToY";
import { isDarkBehind } from "@/utils/isDarkBehind";
import styles from "./TopButton.module.scss";

const TopButton = () => {
  const { pathname } = useLocation();
  const buttonRef = useRef(null);
  const [isShown, setIsShown] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const footer = document.querySelector("footer");
      const inFooter = Boolean(footer) && footer.getBoundingClientRect().top < window.innerHeight - 40;
      // 첫 화면(Hero)이 화면 가운데를 차지하는 동안은 숨김 — 챗봇 버튼과 같은 기준이라 HELLO 장면에서 둘이 같이 나타남
      const center = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      const inHero = Boolean(center?.closest("[data-chat-hide]"));
      setIsShown(window.scrollY > window.innerHeight * 0.8 && !inHero && !inFooter);
      if (buttonRef.current) setIsDark(isDarkBehind(buttonRef.current));
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    const timer = setInterval(request, 500); // 커튼 · 작품 장면처럼 스크롤 없이 배경이 바뀔 때
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [pathname]);

  const handleClick = () => (pathname === PATHS.home ? jumpToTop() : scrollToY(0));

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${styles.top} ${isDark ? styles.onDark : ""} ${isShown ? "" : styles.hidden}`}
      onClick={handleClick}
      aria-label={FOOTER_TEXT.toTop}
      tabIndex={isShown ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default TopButton;
