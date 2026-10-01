// =============================================================
// 프로젝트 데이터 — 원본은 docs/PROJECTS_CONTENT.md (AGENTS.md 7장 데이터 계약)
// 배열 순서 = 화면 표시 순서 (팀 → 개인 / 개인은 React → Canvas → Vanilla JS)
// 상세 페이지 내용(detail)은 8번 작업 때 추가
// =============================================================

export const PROJECTS = [
  {
    projectId: "jajak",
    name: "JAJAK — 전통주 AI 큐레이션 쇼핑몰",
    type: "team",
    category: "React",
    teamSize: 5,
    period: "2026.08 ~ 2026.09",
    role: "회원 인증, 고객센터(공지사항·FAQ·1:1 문의), 위시리스트, 통합 단계 AI 큐레이션 UI·모바일 반응형 보완",
    summary: "취향 설문을 바탕으로 AI가 전통주와 어울리는 안주·술잔을 한 상으로 추천해 주는 쇼핑몰",
    points: [
      "Firebase Authentication으로 회원가입·로그인·로그아웃, 로그인 상태 유지, 정지 계정 차단까지 인증 흐름 전체 구현",
      "회원가입 성공 모달이 뜨지 않던 문제를 추적해 Firestore 보안 규칙 권한 문제임을 찾아내고 팀과 협의해 해결",
      "회원/비회원을 구분한 1:1 문의(Firestore 저장, 답변 상태 확인)와 찜 목록(조회·필터·삭제·장바구니 연동) 구현",
    ],
    stack: ["React 19", "Vite", "Firebase Auth", "Firestore", "SCSS Modules"],
    thumbnail: "jajak-thumb.webp",
    images: [
      "jajak-login.webp", "jajak-signup.webp", "jajak-signup-modal.webp",
      "jajak-notices.webp", "jajak-faq.webp", "jajak-inquiry-choice.webp",
      "jajak-inquiry-form.webp", "jajak-mypage-inquiries.webp", "jajak-wishlist.webp",
    ],
    links: [
      { label: "사이트", href: "https://jajak-ten.vercel.app" },
      { label: "GitHub", href: "https://github.com/jiwoo1012/TeamProject2" },
    ],
    featured: true,
    hasDetail: true,
  },
  {
    projectId: "mungnyang-hub",
    name: "멍냥허브 — 반려동물 용품 쇼핑몰",
    type: "team",
    category: "Vanilla JS",
    teamSize: 3,
    period: "2026.06 ~ 2026.07",
    role: "상품·장바구니 페이지, 브랜드·고객센터 페이지, 로그인 상태 헤더, 메인 슬라이드·리뷰, 모바일 반응형",
    summary: "반려동물 용품을 둘러보고 장바구니에 담을 수 있는 쇼핑몰 팀 프로젝트",
    points: [
      "상품 목록 카테고리 필터와 옵션별 가격 계산, 장바구니 담기 모달(컨페티 애니메이션)·주문 확인 모달",
      "localStorage/sessionStorage로 로그인 상태를 유지하고 모든 페이지 헤더에 로그인/로그아웃 반영",
      "헤더 애니메이션의 transform이 남아 모바일 메뉴(position: fixed)가 사라지던 버그의 원인을 찾아 수정",
    ],
    stack: ["HTML", "CSS", "JavaScript", "JSON", "localStorage"],
    thumbnail: "mungnyang-thumb.webp",
    images: [
      "mungnyang-brand.webp", "mungnyang-brand-story.webp", "mungnyang-review.webp",
      "mungnyang-product.webp", "mungnyang-option.webp", "mungnyang-cart-modal.webp",
    ],
    links: [
      { label: "사이트", href: "https://projectmangryung.github.io/teamproject/" },
      { label: "GitHub", href: "https://github.com/projectMangRyung/teamproject" },
    ],
    featured: false,
    hasDetail: false,
  },
  {
    projectId: "f1-fansite",
    name: "F1 팬사이트 — 방명록",
    type: "solo",
    category: "React",
    teamSize: 1,
    period: "2026.07",
    role: "기획·디자인·개발 전체",
    summary: "응원할 F1 드라이버를 골라 메시지를 남기는 방명록 사이트",
    points: [
      "작성자 uid 기준으로 본인 글만 수정·삭제 — 화면에서 버튼을 숨기고 Firestore 보안 규칙에서도 한 번 더 차단",
      "Firestore 실시간 구독으로 새 응원이 새로고침 없이 반영, 팀별 필터·페이지네이션",
      "IntersectionObserver + callback ref 커스텀 훅으로 스크롤 등장 애니메이션",
    ],
    stack: ["React 19", "React Router", "Zustand", "Firebase Auth", "Firestore", "SCSS Modules"],
    thumbnail: "f1-thumb.webp",
    images: ["f1-main.webp", "f1-guestbook-form.webp", "f1-guestbook-list.webp"],
    links: [
      { label: "방명록", href: "https://guestbook01-phi.vercel.app" },
      { label: "GitHub", href: "https://github.com/younggi12/guestbook01" },
      { label: "게시글(학습 버전)", href: "https://re008-tzii.vercel.app/" },
      { label: "GitHub(학습 버전)", href: "https://github.com/younggi12/re008" },
    ],
    featured: true,
    hasDetail: true,
  },
  {
    projectId: "canvas-breaker",
    name: "SPACE BREAKER — 캔버스 벽돌깨기",
    type: "solo",
    category: "Canvas",
    teamSize: 1,
    period: "2026.06",
    role: "기획·디자인·개발 전체",
    summary: "Canvas API와 requestAnimationFrame으로 만든 우주 테마 벽돌깨기 게임",
    points: [
      "requestAnimationFrame 게임 루프로 그리기 → 이동 → 충돌 검사를 매 프레임 처리, 점수·목숨 3개·서브 대기 구현",
      "패들에 맞은 위치에 따라 반사 각도를 최대 60°까지 바꾸고 공의 빠르기는 유지 (sin/cos로 속도 분해)",
      "캔버스 실제 크기와 CSS 표시 크기가 달라 패들이 마우스와 어긋나던 문제를 좌표 비율 보정으로 해결",
    ],
    stack: ["HTML5 Canvas", "JavaScript", "CSS"],
    thumbnail: "breaker-thumb.webp",
    images: ["breaker-start.webp", "breaker-play.webp", "breaker-clear.webp", "breaker-fail.webp"],
    links: [
      { label: "플레이", href: "https://younggi12.github.io/breaker/js061201.html" },
      { label: "코드", href: "https://github.com/younggi12/breaker/blob/main/js061201.html" },
    ],
    featured: true,
    hasDetail: false,
  },
  {
    projectId: "canvas-draw",
    name: "캔버스 드로잉 앱",
    type: "solo",
    category: "Canvas",
    teamSize: 1,
    period: "2026.06",
    role: "기획·디자인·개발 전체",
    summary: "펜 색·굵기·배경색을 바꿔 그리고 PNG로 저장할 수 있는 드로잉 앱",
    points: [
      "Pointer Events로 마우스·터치·펜 입력을 하나로 처리, 캔버스 밖으로 나가도 획이 끊기지 않게 포인터 캡처",
      "되돌리기(버튼·Ctrl+Z, 최근 20단계) — 획을 그리기 직전의 화면을 getImageData로 저장",
      "배경색과 그림을 임시 캔버스에서 합쳐 PNG로 다운로드",
    ],
    stack: ["HTML5 Canvas", "JavaScript", "Pointer Events"],
    thumbnail: "draw-thumb.webp",
    images: ["draw-main.webp"],
    links: [
      { label: "사용해보기", href: "https://younggi12.github.io/draw-app/js060901.html" },
      { label: "GitHub", href: "https://github.com/younggi12/draw-app" },
    ],
    featured: false,
    hasDetail: false,
  },
  {
    projectId: "blueline",
    name: "BlueLine — 야구용품 쇼핑몰",
    type: "solo",
    category: "Vanilla JS",
    teamSize: 1,
    period: "2026.09",
    role: "기획·디자인·개발 전체 (초기 일부 Codex 활용, 이후 기능·디자인 직접 구현)",
    summary: "프레임워크 없이 바닐라 HTML/CSS/JS로 만든 5페이지 야구용품 쇼핑몰",
    points: [
      "JSON 상품 데이터를 fetch로 불러와 카테고리 필터, 상품 상세(옵션 칩·수량·같은 브랜드 관련 상품) 구성",
      "localStorage 장바구니 — 새로고침해도 유지, 배송비 자동 계산(2만 원 이상 무료), 담기 피드백과 커스텀 모달",
      "IntersectionObserver 스크롤 등장, 무한 루프 캐러셀, sessionStorage로 인트로 1회만 재생, 이미지 최대 90% 압축",
    ],
    stack: ["HTML5", "CSS3", "JavaScript", "localStorage", "IntersectionObserver"],
    thumbnail: "blueline-thumb.webp",
    images: ["blueline-main.webp"],
    links: [
      { label: "사이트", href: "https://younggi12.github.io/-4/index.html" },
      { label: "GitHub", href: "https://github.com/younggi12/-4" },
    ],
    featured: false,
    hasDetail: false,
  },
];

// ---- 조회 헬퍼 ----
export const getFeaturedProjects = () => PROJECTS.filter((p) => p.featured);
export const getProjectsByType = (type) => PROJECTS.filter((p) => p.type === type);
export const getProjectById = (projectId) => PROJECTS.find((p) => p.projectId === projectId);
