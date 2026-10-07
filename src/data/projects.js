// =============================================================
// 프로젝트 데이터 — 원본은 docs/PROJECTS_CONTENT.md (AGENTS.md 7장 데이터 계약)
// 배열 순서 = 화면 표시 순서 (팀 → 개인 / 개인: BlueLine → F1 → 벽돌깨기 → 드로잉 앱)
// 상세 페이지 내용은 detail 필드 (모든 작품). problem · improvements는 없으면 생략 가능
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
    stack: ["React 19", "Vite", "Firebase Auth", "Firestore", "SCSS Modules"],
    thumbnail: "jajak-thumb.webp",
    links: [
      { label: "사이트", href: "https://jajak-ten.vercel.app" },
      { label: "GitHub", href: "https://github.com/jiwoo1012/TeamProject2" },
    ],
    hasDetail: true,
    detail: {
      features: [
        { title: "회원 인증", text: "로그인 · 회원가입 · 로그아웃, 로그인 상태 유지, 정지 계정 차단", images: ["jajak-signup.webp", "jajak-signup-modal.webp", "jajak-login.webp"] },
        { title: "고객센터", text: "공지사항 · FAQ, 회원/비회원을 구분한 1:1 문의와 내 문의 내역", images: ["jajak-notices.webp", "jajak-faq.webp", "jajak-inquiry-choice.webp", "jajak-inquiry-form.webp", "jajak-mypage-inquiries.webp"] },
        { title: "위시리스트", text: "찜 목록 조회 · 필터 · 정렬 · 페이지네이션, 장바구니 담기", images: ["jajak-wishlist.webp", "jajak-cart.webp"] },
      ],
      problem: {
        title: "회원가입 성공 모달이 뜨지 않던 문제",
        symptom: "계정은 만들어지는데 가입 성공 모달이 뜨지 않았습니다.",
        tries: "타이밍 문제로 보고 `useRef`로, 중복 요청으로 보고 중복 제출 방지로 고쳤지만 그대로였습니다.",
        cause: "`console.error`로 실제 에러를 보니 `permission-denied` — 회원 정보 저장이 Firestore 보안 규칙에 막혀 있었습니다.",
        solution: "보안 규칙은 팀장 담당이라 직접 고치지 않고, 원인과 필요한 권한을 정리해 요청해 해결했습니다.",
        lesson: "증상만 보고 추측하지 말고, 실제 에러 로그부터 확인하기",
      },
      improvements: [
        "문의 내역을 전체 조회 후 화면에서 걸러냄 → `where('userId', '==', uid)` 쿼리 + 보안 규칙으로 본인 것만 읽게 개선 필요",
        "찜 목록이 할인 전 가격으로 표시됨 → `discountRate`로 할인가 계산 필요",
      ],
    },
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
    stack: ["HTML", "CSS", "JavaScript", "JSON", "localStorage"],
    thumbnail: "mungnyang-thumb.webp",
    links: [
      { label: "사이트", href: "https://projectmangryung.github.io/teamproject/" },
      { label: "GitHub", href: "https://github.com/projectMangRyung/teamproject" },
    ],
    hasDetail: true,
    detail: {
      features: [
        { title: "상품 목록 · 장바구니", text: "카테고리 필터, 옵션별 가격 계산, 장바구니 담기 모달(컨페티)과 주문 확인 모달", images: ["mungnyang-product.webp", "mungnyang-option.webp", "mungnyang-cart-modal.webp"] },
        { title: "브랜드 · 리뷰", text: "브랜드 페이지와 메인 리뷰 슬라이더(마우스 · 터치 드래그)", images: ["mungnyang-brand.webp", "mungnyang-brand-story.webp", "mungnyang-review.webp"] },
        { title: "로그인 상태 헤더", text: "localStorage/sessionStorage로 로그인 상태를 유지하고 모든 페이지 헤더에 반영", code: { file: "common.js", snippet: "function updateHeaderLoginState() {\n  const currentUser =\n    JSON.parse(localStorage.getItem(\"currentUser\")) ||\n    JSON.parse(sessionStorage.getItem(\"currentUser\"));\n\n  if (currentUser) {\n    // 로그인 상태 → 로그아웃 · 이름 표시\n    loginLi.innerHTML =\n      `<a href=\"#\" id=\"logoutBtn\">로그아웃</a>`;\n    joinLi.innerHTML =\n      `<a href=\"./cart.html\">👤 ${currentUser.name}님</a>`;\n  } else {\n    // 비로그인 상태 → 로그인 · 회원가입\n  }\n}" } },
      ],
      problem: {
        title: "모바일 메뉴가 화면에서 사라지던 문제",
        symptom: "모바일에서 로그인 · 장바구니 메뉴를 열어도 화면에 보이지 않았습니다.",
        cause: "헤더 애니메이션이 끝난 뒤에도 `transform`이 남아 있어, 그 안의 `position: fixed` 메뉴가 화면이 아니라 헤더를 기준으로 그려지고 있었습니다.",
        solution: "애니메이션이 끝나면 `transform`을 지우도록 바꿔 메뉴가 다시 화면 기준으로 보이게 했습니다.",
        lesson: "transform이 있는 요소 안에서는 position: fixed의 기준이 바뀐다",
      },
      improvements: [
        "첫 팀 프로젝트라 병합 충돌이 잦았음 → 이후 JAJAK에서 브랜치 규칙 문서(AGENTS.md)로 협업 방식을 정리",
      ],
    },
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
    stack: ["HTML5", "CSS3", "JavaScript", "localStorage", "IntersectionObserver"],
    thumbnail: "blueline-thumb.webp",
    links: [
      { label: "사이트", href: "https://younggi12.github.io/-4/index.html" },
      { label: "GitHub", href: "https://github.com/younggi12/-4" },
    ],
    hasDetail: true,
    detail: {
      features: [
        { title: "상품 · 상세", text: "JSON 상품 데이터를 fetch로 불러와 카테고리 필터, 옵션 칩 · 수량 · 관련 상품이 있는 상세 페이지", images: ["blueline-shop.webp", "blueline-list.webp", "blueline-product.webp"] },
        { title: "장바구니", text: "localStorage로 새로고침해도 유지, 2만 원 이상 무료배송 자동 계산, 담기 피드백과 커스텀 모달", images: ["blueline-cart.webp", "blueline-cart-empty.webp"] },
        { title: "화면 연출", text: "IntersectionObserver 스크롤 등장, 무한 루프 캐러셀, 인트로는 sessionStorage로 1회만 재생", code: { file: "app.js", snippet: "// 인트로는 탭을 닫기 전까지 1회만\nif (sessionStorage.getItem(\"blueline_intro_shown\")) {\n  intro.classList.add(\"is-hidden\");\n  return;\n}\nsessionStorage.setItem(\"blueline_intro_shown\", \"1\");\n\n// 섹션이 화면에 들어오면 카드 등장\nconst observer = new IntersectionObserver((entries) => {\n  entries.forEach((entry) => {\n    if (entry.isIntersecting) {\n      items.forEach((el) => el.classList.add(\"is-visible\"));\n      observer.unobserve(entry.target);\n    }\n  });\n}, { threshold: 0.25 });" } },
      ],
      improvements: [
        "인트로 이미지 문구를 \"Good Gear Better Days\"로 다시 제작",
        "저장소 이름(`-4`)을 `blueline`으로 정리",
      ],
    },
  },
  {
    projectId: "f1-fansite",
    name: "F1 팬사이트 — 방명록",
    type: "solo",
    category: "React",
    teamSize: 1,
    period: "2026.07",
    role: "기획·디자인·개발 전체",
    summary: "로그인한 팬이 응원할 F1 드라이버를 골라 메시지를 남기는 방명록 사이트",
    stack: ["React 19", "React Router", "Zustand", "Firebase Auth", "Firestore", "SCSS Modules"],
    thumbnail: "f1-thumb.webp",
    links: [
      { label: "방명록", href: "https://guestbook01-phi.vercel.app" },
      { label: "GitHub", href: "https://github.com/younggi12/guestbook01" },
      { label: "게시글(학습 버전)", href: "https://re008-tzii.vercel.app/" },
      { label: "GitHub(학습 버전)", href: "https://github.com/younggi12/re008" },
    ],
    hasDetail: true,
    detail: {
      features: [
        { title: "로그인 · 방명록", text: "Firebase Auth 로그인 후에만 작성 가능, 응원할 드라이버를 골라 메시지 작성, 팀별 필터 · 페이지네이션", images: ["f1-signup.webp", "f1-login.webp", "f1-guestbook-form.webp", "f1-guestbook-list.webp"] },
        { title: "본인 글만 수정 · 삭제", text: "작성자 uid 기준으로 화면에서 버튼을 숨기고, Firestore 보안 규칙에서도 한 번 더 차단", images: ["f1-owner.webp"], code: { file: "Guestbook.jsx · firestore.rules", snippet: "// 화면 — 내 글에만 수정 · 삭제 버튼\nconst isOwner =\n  user && item.authorUid === user.uid\n\n{isOwner && (\n  <div className={styles.postActions}>\n    <button onClick={...}>수정</button>\n    <button onClick={...}>삭제</button>\n  </div>\n)}\n\n// 서버 — 보안 규칙에서 한 번 더 차단\nallow delete: if request.auth != null\n  && resource.data.authorUid\n     == request.auth.uid;" } },
        { title: "실시간 · 스크롤 연출", text: "Firestore 실시간 구독으로 새로고침 없이 반영, 커스텀 훅으로 스크롤 등장 애니메이션", code: { file: "Guestbook.jsx · About.jsx", snippet: "// 실시간 구독 — 새 글이 바로 목록에 반영\nconst unsubscribe = onSnapshot(q, (snap) => {\n  setPost(snap.docs.map((d) => ({\n    id: d.id, ...d.data(),\n  })))\n})\nreturn () => unsubscribe()\n\n// 스크롤 등장 — callback ref로\n// 요소가 생기는 순간 observer 연결\nconst ref = (el) => setNode(el)\nuseEffect(() => {\n  if (!node) return\n  const observer = new IntersectionObserver(\n    ([entry]) => {\n      if (entry.isIntersecting) {\n        setVisible(true)\n        observer.unobserve(entry.target)\n      }\n    }, { threshold: 0.2 })\n  observer.observe(node)\n}, [node])" } },
      ],
      problem: {
        title: "인트로가 끝난 뒤 스크롤 애니메이션이 동작하지 않던 문제",
        symptom: "인트로 영상이 끝난 뒤 나타나는 섹션은 스크롤해도 등장 애니메이션이 실행되지 않았습니다.",
        cause: "`useEffect`가 실행될 때는 아직 섹션이 화면에 없어서 `ref`가 비어 있었고, IntersectionObserver가 연결되지 않았습니다.",
        solution: "callback ref로 바꿔 요소가 실제로 생기는 순간 IntersectionObserver를 연결하는 `useReveal` 훅을 만들었습니다.",
        lesson: "요소가 나중에 생기는 경우엔 useRef + useEffect보다 callback ref가 정확하다",
      },
      improvements: [
        "학습용으로 만든 게시글 등록(CRUD) → 디자인과 기능을 더해 방명록으로 완성 (학습 버전도 링크로 함께 공개)",
      ],
    },
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
    stack: ["HTML5 Canvas", "JavaScript", "CSS"],
    thumbnail: "breaker-thumb.webp",
    links: [
      { label: "플레이", href: "https://younggi12.github.io/breaker/js061201.html" },
      { label: "코드", href: "https://github.com/younggi12/breaker/blob/main/js061201.html" },
    ],
    hasDetail: true,
    detail: {
      features: [
        { title: "게임 루프", text: "requestAnimationFrame으로 그리기 → 이동 → 충돌 검사, 점수 · 목숨 3개 · 서브 대기", images: ["breaker-start.webp", "breaker-play.webp"] },
        { title: "반사 각도", text: "패들에 맞은 위치에 따라 최대 60°까지 반사 각도를 바꾸고 공의 빠르기는 유지", code: { file: "js061201.html", snippet: "// 패들 중심 기준 맞은 위치: 왼쪽 -1 ~ 가운데 0 ~ 오른쪽 +1\nlet hitPos = (ballX - (barX + barW / 2)) / (barW / 2)\nhitPos = Math.max(-1, Math.min(1, hitPos))\n\n// 맞은 위치에 비례해 최대 60°까지 기울임\nconst angle = hitPos * MAX_BOUNCE_ANGLE * Math.PI / 180\n\n// 각도만 바꾸고 빠르기(BALL_SPEED)는 유지\nballSpeedX = BALL_SPEED * Math.sin(angle)\nballSpeedY = -BALL_SPEED * Math.cos(angle)" } },
        { title: "결과 화면", text: "클리어 · 실패 화면과 최종 점수, 다시 시작", images: ["breaker-clear.webp", "breaker-fail.webp"] },
      ],
      problem: {
        title: "패들이 마우스와 어긋나던 문제",
        symptom: "마우스를 움직이면 패들이 마우스 위치보다 앞서거나 뒤처졌습니다.",
        cause: "캔버스의 실제 크기와 CSS로 보이는 크기가 달라, 마우스 좌표를 그대로 쓰면 비율만큼 어긋났습니다.",
        solution: "`(e.clientX - rect.left) * (canvas.width / rect.width)`로 화면 좌표를 캔버스 좌표로 바꿔 맞췄습니다.",
        lesson: "캔버스는 화면에 보이는 크기와 그리는 크기가 다를 수 있다",
      },
      improvements: ["레벨이 오를수록 공 속도 증가", "모바일 터치 조작"],
    },
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
    stack: ["HTML5 Canvas", "JavaScript", "Pointer Events"],
    thumbnail: "draw-thumb.webp",
    links: [
      { label: "사용해보기", href: "https://younggi12.github.io/draw-app/js060901.html" },
      { label: "GitHub", href: "https://github.com/younggi12/draw-app" },
    ],
    hasDetail: true,
    detail: {
      features: [
        { title: "그리기", text: "Pointer Events로 마우스 · 터치 · 펜을 한 번에 처리, 캔버스 밖으로 나가도 획이 끊기지 않음", images: ["draw-main.webp", "draw-drawn.webp"] },
        { title: "되돌리기", text: "버튼 · Ctrl+Z로 최근 20단계 — 획을 그리기 직전 화면을 getImageData로 저장", images: ["draw-drawn.webp", "draw-undo.webp"] },
        { title: "PNG 저장", text: "배경색 · 펜 색 · 굵기를 바꿔 그리고 PNG로 다운로드", code: { file: "js060901.html", snippet: "// 임시 캔버스에 배경색 + 그림을 합침\nconst tempCanvas = document.createElement(\"canvas\");\nconst tempCtx = tempCanvas.getContext(\"2d\");\ntempCanvas.width = canvas.width;\ntempCanvas.height = canvas.height;\n\ntempCtx.fillStyle = bgColor;\ntempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);\ntempCtx.drawImage(canvas, 0, 0);\n\n// PNG로 다운로드\nlet link = document.createElement(\"a\");\nlink.download = \"drawing.png\";\nlink.href = tempCanvas.toDataURL(\"image/png\");\nlink.click();" } },
      ],
      problem: {
        title: "다운로드한 그림이 보이지 않던 문제",
        symptom: "기본 펜으로 그린 그림을 PNG로 저장하면 그림이 보이지 않았습니다.",
        cause: "화면의 흰 배경은 CSS로만 칠해져 있어, 저장 파일에는 투명 배경과 기본 검정 배경값만 남았습니다.",
        solution: "저장할 때 임시 캔버스에 배경을 먼저 칠하고 그림을 합쳐 내보내고, 기본 배경을 흰색으로 통일했습니다.",
        lesson: "화면에 보이는 것과 캔버스에 실제로 그려진 것은 다를 수 있다",
      },
    },
  },
];

// ---- 조회 헬퍼 ----
export const getProjectsByType = (type) => PROJECTS.filter((p) => p.type === type);
export const getProjectById = (projectId) => PROJECTS.find((p) => p.projectId === projectId);
