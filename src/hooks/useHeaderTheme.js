import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// 헤더 바로 아래에 깔린 요소의 data-header-theme 값을 찾아 돌려준다
// (Apple처럼 헤더 배경을 지금 보고 있는 섹션 배경에 맞추기 위해)
// 값: "light" | "band" | "dark"
const useHeaderTheme = (headerHeight) => {
  const [theme, setTheme] = useState("light");
  const { pathname } = useLocation();

  useEffect(() => {
    let frame = null;

    const update = () => {
      frame = null;
      // 헤더 바로 아래 1px 지점에 있는 요소들 중 테마 표시가 있는 가장 가까운 조상
      const elements = document.elementsFromPoint(window.innerWidth / 2, headerHeight + 1);
      const section = elements.find((el) => el.closest("[data-header-theme]"));
      const next = section?.closest("[data-header-theme]")?.dataset.headerTheme ?? "light";
      setTheme((prev) => (prev === next ? prev : next));
    };

    // 스크롤마다 바로 계산하지 않고 다음 프레임에 한 번만 (성능)
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
  }, [headerHeight, pathname]); // 페이지가 바뀌면 다시 계산

  return theme;
};

export default useHeaderTheme;
