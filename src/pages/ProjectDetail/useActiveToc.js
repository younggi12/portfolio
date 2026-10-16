import { useEffect, useState } from "react";

// 왼쪽 목차 — 지금 화면 가운데쯤 있는 부분을 진하게 (data-toc 섹션을 지켜봄)
const useActiveToc = (ids) => {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(",");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" }); // 화면 위에서 40% ~ 45% 띠를 지나는 부분
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
};

export default useActiveToc;
