import { useEffect, useState } from "react";

// CSS 미디어쿼리 조건을 JS에서 확인 (화면 크기·동작 줄이기 설정 등)
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
