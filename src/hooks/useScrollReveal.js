// 스크롤 등장 — data-reveal 속성이 붙은 요소가 화면에 들어오면 서서히 나타남
// (인트로와 같은 연출: 흐림 → 선명 + 살짝 위로, 스타일은 global.scss의 [data-reveal])
// - 한 번에 같이 들어온 요소들은 위에서부터 순서대로 조금씩 늦게 등장 (카드 줄 등)
// - 인트로가 재생 중이면 끝날 때까지 기다렸다가 시작 (Intro가 html[data-intro="playing"] 표시)
// - 새로 생기는 요소(페이지 이동, 더보기)도 MutationObserver로 자동 등록
// - "동작 줄이기" 사용자는 연출 없이 바로 보임
import { useEffect } from "react";

const STAGGER = 90;   // 같이 들어온 요소 사이 간격(ms)
const MAX_STAGGER = 6; // 이보다 많아도 늦어지는 시간은 여기까지

const useScrollReveal = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (!("IntersectionObserver" in window)) return undefined;

    const root = document.documentElement;
    root.classList.add("reveal-on"); // JS가 동작할 때만 숨김 (실패해도 내용은 보임)

    const isIntroPlaying = () => root.dataset.intro === "playing";
    const pending = new Set(); // 인트로 중 화면에 들어온 요소

    const show = (elements) => {
      elements
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        .forEach((el, i) => {
          el.style.setProperty("--reveal-delay", `${Math.min(i, MAX_STAGGER) * STAGGER}ms`);
          el.classList.add("is-revealed");
        });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((e) => e.isIntersecting).map((e) => e.target);
        entering.forEach((el) => observer.unobserve(el));
        if (isIntroPlaying()) entering.forEach((el) => pending.add(el));
        else show(entering);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const register = (scope) => {
      scope.querySelectorAll?.("[data-reveal]:not(.is-revealed)").forEach((el) => observer.observe(el));
      if (scope.matches?.("[data-reveal]:not(.is-revealed)")) observer.observe(scope);
    };
    register(document);

    const mutation = new MutationObserver((records) => {
      records.forEach((r) => r.addedNodes.forEach((node) => node.nodeType === 1 && register(node)));
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    const onIntroDone = () => {
      show([...pending]);
      pending.clear();
    };
    window.addEventListener("introdone", onIntroDone);

    return () => {
      observer.disconnect();
      mutation.disconnect();
      window.removeEventListener("introdone", onIntroDone);
      root.classList.remove("reveal-on");
    };
  }, []);
};

export default useScrollReveal;
