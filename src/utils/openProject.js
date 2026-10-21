// 작품 → 상세 페이지 전환 — 검은 커튼이 아래에서 올라와 화면을 덮고, 상세 페이지로 바뀐 뒤 위로 걷히며 표지가 드러남
// (홈 이름 장면의 커튼과 같은 느낌) / 커튼 뒤에서 바뀌므로 표지 사진은 등장 연출 없이 바로, 글자만 차례로 나타남
// - 홈 작품 소개(사진 · "자세히 보기") · 상세 아래 "다른 작품 보기" · 상세 표지 "작품 목록으로"(홈으로 돌아갈 때도 같은 커튼)에서 사용
// - 새 탭 열기(Ctrl · Cmd · 가운데 버튼) · "동작 줄이기" 사용자는 평소 링크 그대로
const COVER_MS = 600;  // 커튼이 올라와 덮는 시간
const REVEAL_MS = 750; // 상세 페이지에서 커튼이 위로 걷히는 시간
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)"; // 천천히 출발 → 빠르게 → 천천히 도착
const CURTAIN_BG = "#1d1d1f"; // 상세 표지 바탕색 ($color-text) — 걷힐 때 이음매가 안 보이게

let running = false;  // 연달아 눌러도 한 번만
let arriving = false; // 상세 페이지가 "전환으로 들어왔는지" 확인할 표시

// 상세 페이지가 처음 그려질 때 한 번 확인 — true면 표지 사진의 등장 연출을 건너뜀 (커튼 뒤에 이미 떠 있게)
export const consumeProjectTransition = () => {
  const value = arriving;
  arriving = false;
  return value;
};

// toDetail: 상세 페이지로 가는지 (홈으로 돌아갈 때는 false — 표지 표시를 남기지 않음)
export const openProject = (e, { to, navigate, toDetail = true }) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  e.preventDefault();
  if (running) return;
  running = true;

  const curtain = document.createElement("div");
  Object.assign(curtain.style, {
    position: "fixed",
    inset: "0",
    zIndex: "60", // 헤더(10) · 챗봇(50) 위, 커서(1000) 아래
    backgroundColor: CURTAIN_BG,
    pointerEvents: "none",
    willChange: "transform",
  });
  document.body.appendChild(curtain);

  // 1) 아래에서 올라와 덮음
  const cover = curtain.animate(
    [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
    { duration: COVER_MS, easing: EASE, fill: "forwards" },
  );

  cover.onfinish = () => {
    // 2) 커튼 뒤에서 상세 페이지로 → 그려진 다음 위로 걷힘
    arriving = toDetail;
    navigate(to);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const reveal = curtain.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }],
        { duration: REVEAL_MS, easing: EASE, fill: "forwards" },
      );
      reveal.onfinish = () => { curtain.remove(); running = false; };
    }));
  };
};
