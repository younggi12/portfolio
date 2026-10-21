// =============================================================
// 프로젝트 데이터 — 원본은 docs/PROJECTS_CONTENT.md (AGENTS.md 7장 데이터 계약)
// 기술(stack) 나열 순서: 마크업 · 언어 → 프레임워크 · 라이브러리 → 빌드 · 스타일 → 인터랙션 → 데이터 · 서버 → AI
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
    roleShort: "회원 인증 · 고객센터 · 위시리스트", // 작품 카드에 보이는 짧은 담당
    summary: "취향 설문을 바탕으로 AI가 전통주와 어울리는 안주·술잔을 한 상으로 추천해 주는 쇼핑몰", // "한 상"은 줄바꿈 안 되는 공백(\u00a0)
    stack: ["React 19", "React Router", "Vite", "SCSS Modules", "GSAP", "Firebase Auth", "Firebase Firestore", "Firebase Functions", "OpenAI API"],
    thumbnail: "jajak-thumb.webp",
    scrollShot: "jajak-scroll.webp", // 사이트 전체 캡처 — 썸네일에 마우스를 올리면 위에서 아래로 스크롤
    coverZoom: 1.11, // 상세 표지 배경 사진 확대 (기본 1.04 — 맨 위 한지 메뉴 띠가 안 보이게 조금 더)
    headerColor: "#f2ebe2", headerTone: "light", headerText: "#2c231b", // 헤더 배경은 한지 이미지(평균 색) · 글자 $color-text-primary
    links: [
      { label: "사이트", href: "https://jajak-ten.vercel.app" },
      { label: "GitHub", href: "https://github.com/jiwoo1012/TeamProject2" },
    ],
    // 팀 기획 문서 — public/docs/ 의 PDF, 상세 왼쪽 칸에서 내려받기
    docs: [
      { label: "기획서", file: "jajak-plan.pdf" },
      { label: "유스케이스", file: "jajak-usecase.pdf" },
      { label: "화면설계서", file: "jajak-screen-design.pdf" }, // Figma에서 내보낸 화면 116장 (용량 줄여 약 11MB)
      { label: "캐릭터 설정서", file: "jajak-character.pdf" },
    ],
    hasDetail: true,
    detail: {
      features: [
        { title: "회원 인증", text: "로그인 · 회원가입 · 로그아웃, 로그인 상태 유지, 정지 계정 차단", images: ["jajak-signup.webp", "jajak-signup-modal.webp", "jajak-login.webp"], code: { file: "src/firebase/auth.js", snippet: "// 로그인 상태 유지 선택 → 로그인 → 정지 계정이면 바로 로그아웃\nexport const login = async (email, password, rememberMe = true) => {\n  // 체크하면 브라우저를 닫아도 유지, 아니면 이번 창에서만\n  await setPersistence(\n    auth,\n    rememberMe ? browserLocalPersistence : browserSessionPersistence\n  );\n\n  const { user } = await signInWithEmailAndPassword(auth, email, password);\n  const userData = await getDocument(\"users\", user.uid);\n\n  if (userData?.status === \"suspended\") {\n    await signOut(auth);\n    throw new AccountSuspendedError(); // code: 'auth/account-suspended'\n  }\n\n  await updateDocument(\"users\", user.uid, { lastLoginAt: serverTimestamp() });\n  return { user, userData };\n};" } },
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
        result: { label: "회원가입할 때 회원 정보 저장이 실패한 비율", from: "100%", to: "0%" },
      },
      improvements: [
        "문의 내역을 전부 불러온 뒤 화면에서 걸러냄 → `where('userId', '==', uid)` 쿼리와 보안 규칙으로 본인 문의만 읽도록 개선 필요",
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
    roleShort: "상품 · 장바구니 · 브랜드 페이지",
    summary: "HTML · CSS · JavaScript만으로 3명이 함께 만든\n첫 팀 프로젝트",
    stack: ["HTML5", "CSS3", "JavaScript", "jQuery", "JSON", "localStorage", "sessionStorage", "Kakao Map API", "random.dog API"],
    thumbnail: "mungnyang-thumb.webp",
    scrollShot: "mungnyang-scroll.webp", // 사이트 전체 캡처 — 썸네일에 마우스를 올리면 위에서 아래로 스크롤
    coverZoom: 1.07, // 상세 표지 배경 사진 확대 (기본 1.04 — 맨 위 사이트 메뉴가 헤더와 겹쳐 보이지 않게 조금 더)
    headerColor: "#587866", headerTone: "dark", headerText: "#ffffff", // header rgba(46, 90, 68, 0.8)가 화면에 겹쳐 실제로 보이는 색(배포 사이트 캡처 측정) · .gnb a #ffffff
    links: [
      { label: "사이트", href: "https://projectmangryung.github.io/teamproject/" },
      { label: "GitHub", href: "https://github.com/projectMangRyung/teamproject" },
    ],
    docs: [ // 팀 문서 — public/docs/ (기획안 3개 버전 · 업무일지 4개를 하나씩으로 합침)
      { label: "기획서", file: "mungnyang-plan.pdf" },
      { label: "업무일지", file: "mungnyang-worklog.pdf" },
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
        result: { label: "휴대폰 화면에서 로그인 · 장바구니 메뉴가 보이는 비율", from: "0%", to: "100%" },
      },
      improvements: [
        "첫 팀 프로젝트라 병합 충돌이 잦았음 → 이후 JAJAK에서 브랜치 규칙 문서(AGENTS.md)로 협업 방식을 정리",
        "상품 가격이 \"28,900원\" 같은 글자로 저장돼 계산할 때마다 숫자만 골라냄 → JSON에 숫자로 저장하고 화면에 보일 때만 `toLocaleString()`으로 표시",
        "상품 JSON을 불러오다 실패하면 목록이 빈 채로 남음 → `try/catch`로 안내 문구 보여 주기",
        "이미지 폴더가 82MB(배너 한 장 최대 5.4MB) → 화면 크기에 맞춰 압축하고 WebP로 바꾸기",
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
    role: "기획·디자인·개발 전체 (Codex로 페이지·기능 초안을 만든 뒤 직접 검토·수정, 배너 애니메이션·이미지 최적화는 직접 구현)", // GitHub 기록과 맞춤: 9/23 초안 한 번에 → 이후 직접 수정
    roleShort: "기획 · 디자인 · 개발 전체 (Codex 초안 → 직접 검토 · 수정)",
    summary: "프레임워크 없이 상품 목록부터 상세 · 장바구니까지 5페이지를 직접 구현",
    stack: ["HTML5", "CSS3", "JavaScript", "IntersectionObserver", "JSON", "localStorage", "sessionStorage", "AI 캐릭터 생성 (ChatGPT)"],
    thumbnail: "blueline-thumb.webp",
    scrollShot: "blueline-scroll.webp", // 사이트 전체 캡처 — 썸네일에 마우스를 올리면 위에서 아래로 스크롤
    headerColor: "linear-gradient(135deg, #1d3a66, #2f6fed)", headerTone: "dark", headerText: "#ffffff", // style.css .top-bar (--navy → --blue) · .logo #fff
    links: [
      { label: "사이트", href: "https://younggi12.github.io/-4/index.html" },
      { label: "GitHub", href: "https://github.com/younggi12/-4" },
    ],
    hasDetail: true,
    detail: {
      features: [
        { title: "상품 · 상세", text: "fetch로 불러온 JSON 상품 데이터로 카테고리 필터와 상세 페이지(옵션 칩 · 수량 · 관련 상품)", images: ["blueline-shop.webp", "blueline-list.webp", "blueline-product.webp"] },
        { title: "장바구니", text: "새로고침해도 남는 장바구니(localStorage), 2만 원 이상 무료배송 자동 계산, 담기 피드백과 커스텀 모달", images: ["blueline-cart.webp", "blueline-cart-empty.webp"] },
        { title: "화면 연출", text: "스크롤 등장(IntersectionObserver), 무한 루프 캐러셀, 한 번만 나오는 인트로(sessionStorage)", code: { file: "app.js", snippet: "// 인트로는 탭을 닫기 전까지 1회만\nif (sessionStorage.getItem(\"blueline_intro_shown\")) {\n  intro.classList.add(\"is-hidden\");\n  return;\n}\nsessionStorage.setItem(\"blueline_intro_shown\", \"1\");\n\n// 섹션이 화면에 들어오면 카드 등장\nconst observer = new IntersectionObserver((entries) => {\n  entries.forEach((entry) => {\n    if (entry.isIntersecting) {\n      items.forEach((el) => el.classList.add(\"is-visible\"));\n      observer.unobserve(entry.target);\n    }\n  });\n}, { threshold: 0.25 });" } },
      ],
      problem: {
        title: "메인 페이지 이미지가 무거워 늦게 뜨던 문제",
        symptom: "메인 페이지를 열면 배너 · 매장 사진이 늦게 떠서 한동안 빈 칸이 보였습니다.",
        cause: "카메라 원본 사진(최대 6000×4000px, 한 장 6.3MB)과 큰 PNG 캐릭터를 그대로 써서, 화면에는 작게 보이는데도 메인 페이지에서만 이미지 13.8MB를 내려받고 있었습니다.",
        solution: "화면에 보이는 크기에 맞춰 사진은 가로 1600px · JPG 품질 80으로, PNG는 800px · 256색으로 줄였습니다. 파일 이름은 그대로 두어 코드는 바꾸지 않았습니다.",
        lesson: "이미지는 화면에 보이는 크기에 맞춰 줄여서 넣어야 한다",
        result: { label: "메인 페이지에서 내려받는 이미지 용량 (85% 감소)", from: "13.8MB", to: "2.0MB" },
      },
      improvements: [
        "인트로 이미지 문구를 \"Good Gear Better Days\"로 다시 제작",
        "이미지에 지연 로딩이 없어 아래쪽 매장 갤러리까지 처음에 한꺼번에 받음 → `loading=\"lazy\"`로 화면에 가까워질 때 불러오기",
        "상품 JSON을 불러오다 실패하면 목록이 빈 채로 남음 → `try/catch`로 \"상품을 불러오지 못했어요\" 안내와 다시 시도 버튼",
        "이미지가 JPG · PNG라 용량을 더 줄일 여지가 있음 → WebP로 바꿔 한 번 더 줄이기",
      ],
    },
  },
  {
    projectId: "f1-fansite",
    name: "F1 팬사이트 — 응원 메시지를 남기는 방명록",
    type: "solo",
    category: "React",
    teamSize: 1,
    period: "2026.07",
    role: "기획·디자인·개발 전체",
    roleShort: "기획 · 디자인 · 개발 전체",
    summary: "학습용 게시판(CRUD)에 디자인과 로그인 · 실시간 기능을 더해 완성한 React 방명록",
    stack: ["React 19", "React Router", "Vite", "SCSS Modules", "Zustand", "Firebase Auth", "Firebase Firestore"],
    thumbnail: "f1-thumb.webp",
    previewVideo: "f1-preview.mp4", // public/videos/ — 썸네일에 마우스를 올리면 재생 (F1 사이트 첫 화면 영상 3개가 넘어가는 연출)
    headerColor: "#000000", headerTone: "dark", headerText: "#ff0000", // Header.module.scss background-color: black · 메뉴 글자 color: red
    links: [
      { label: "사이트", href: "https://guestbook01-phi.vercel.app" },
      { label: "GitHub", href: "https://github.com/younggi12/guestbook01" },
      { label: "게시글(학습 버전)", href: "https://re008-tzii.vercel.app/" },
      { label: "GitHub(학습 버전)", href: "https://github.com/younggi12/re008" },
    ],
    hasDetail: true,
    detail: {
      features: [
        { title: "로그인 · 방명록", text: "로그인한 사람만 작성(Firebase Auth), 응원할 드라이버를 골라 메시지 작성, 팀별 필터 · 페이지네이션", images: ["f1-signup.webp", "f1-login.webp", "f1-guestbook-form.webp", "f1-guestbook-list.webp"] },
        { title: "본인 글만 수정 · 삭제", text: "작성자 uid 기준으로 화면에서 버튼을 숨기고, Firestore 보안 규칙에서도 한 번 더 차단", images: ["f1-owner.webp"], code: { file: "Guestbook.jsx · firestore.rules", snippet: "// 화면 — 내 글에만 수정 · 삭제 버튼\nconst isOwner =\n  user && item.authorUid === user.uid\n\n{isOwner && (\n  <div className={styles.postActions}>\n    <button onClick={...}>수정</button>\n    <button onClick={...}>삭제</button>\n  </div>\n)}\n\n// 서버 — 보안 규칙에서 한 번 더 차단\nallow delete: if request.auth != null\n  && resource.data.authorUid\n     == request.auth.uid;" } },
        { title: "실시간 · 스크롤 연출", text: "새로고침 없이 바로 반영되는 글 목록(Firestore 실시간 구독), 커스텀 훅으로 만든 스크롤 등장 애니메이션", code: { file: "Guestbook.jsx · About.jsx", snippet: "// 실시간 구독 — 새 글이 바로 목록에 반영\nconst unsubscribe = onSnapshot(q, (snap) => {\n  setPost(snap.docs.map((d) => ({\n    id: d.id, ...d.data(),\n  })))\n})\nreturn () => unsubscribe()\n\n// 스크롤 등장 — callback ref로\n// 요소가 생기는 순간 observer 연결\nconst ref = (el) => setNode(el)\nuseEffect(() => {\n  if (!node) return\n  const observer = new IntersectionObserver(\n    ([entry]) => {\n      if (entry.isIntersecting) {\n        setVisible(true)\n        observer.unobserve(entry.target)\n      }\n    }, { threshold: 0.2 })\n  observer.observe(node)\n}, [node])" } },
      ],
      problem: {
        title: "인트로가 끝난 뒤 스크롤 애니메이션이 동작하지 않던 문제",
        symptom: "인트로 영상이 끝난 뒤 나타나는 섹션은 스크롤해도 등장 애니메이션이 실행되지 않았습니다.",
        cause: "`useEffect`가 실행될 때는 아직 섹션이 화면에 없어서 `ref`가 비어 있었고, IntersectionObserver가 연결되지 않았습니다.",
        solution: "callback ref로 바꿔 요소가 실제로 생기는 순간 IntersectionObserver를 연결하는 `useReveal` 훅을 만들었습니다.",
        lesson: "요소가 나중에 생기는 경우엔 useRef + useEffect보다 callback ref가 정확하다",
        result: { label: "인트로 뒤 섹션에서 스크롤 등장 애니메이션이 동작한 비율", from: "0%", to: "100%" },
      },
      improvements: [
        "글 전체를 한 번에 구독하고 화면에서 나눠 보여줌 → 글이 많아지면 `limit` · `startAfter`로 페이지 단위로 불러오기 필요",
        "글 목록 실시간 구독(`onSnapshot`)에 실패 처리가 없어 불러오기에 실패하면 \"불러오는 중\"에서 멈춤 → 에러 콜백으로 안내 문구와 다시 시도",
        "삭제 확인 · 안내를 브라우저 기본 창(`confirm` · `alert`)으로 띄움 → 사이트 디자인에 맞춘 모달로 바꾸기",
      ],
    },
  },
  {
    projectId: "canvas-breaker",
    name: "SPACE BREAKER — 우주 테마 벽돌깨기 게임",
    type: "solo",
    category: "Canvas",
    teamSize: 1,
    period: "2026.06",
    role: "기획·디자인·개발 전체",
    roleShort: "기획 · 디자인 · 개발 전체",
    summary: "공 · 패들 · 벽돌의 움직임과 충돌을 Canvas로 직접 계산한 게임",
    stack: ["HTML5", "CSS3", "JavaScript", "Canvas API"],
    thumbnail: "breaker-thumb.webp",
    previewVideo: "breaker-preview.mp4", // public/videos/ — 썸네일에 마우스를 올리면 재생 (실제 게임 플레이 녹화)
    headerColor: "#0c161f", headerTone: "dark", headerText: "#ffffff", headerGlow: "cyan", // 헤더 없음 → 배경 이미지 위쪽 평균 색 · 제목 #gameTitle: color white + text-shadow 0 0 15px cyan
    links: [
      { label: "플레이", href: "https://younggi12.github.io/breaker/js061201.html" },
      { label: "코드", href: "https://github.com/younggi12/breaker/blob/main/js061201.html" },
    ],
    hasDetail: true,
    detail: {
      features: [
        { title: "게임 루프", text: "requestAnimationFrame으로 그리기 → 이동 → 충돌 검사 반복, 점수 · 목숨 3개 · 서브 대기", images: ["breaker-start.webp", "breaker-play.webp"] },
        { title: "반사 각도", text: "패들에 맞은 위치에 따라 최대 60°까지 반사 각도를 바꾸고 공의 빠르기는 유지", code: { file: "js061201.html", snippet: "// 패들 중심 기준 맞은 위치: 왼쪽 -1 ~ 가운데 0 ~ 오른쪽 +1\nlet hitPos = (ballX - (barX + barW / 2)) / (barW / 2)\nhitPos = Math.max(-1, Math.min(1, hitPos))\n\n// 맞은 위치에 비례해 최대 60°까지 기울임\nconst angle = hitPos * MAX_BOUNCE_ANGLE * Math.PI / 180\n\n// 각도만 바꾸고 빠르기(BALL_SPEED)는 유지\nballSpeedX = BALL_SPEED * Math.sin(angle)\nballSpeedY = -BALL_SPEED * Math.cos(angle)" } },
        { title: "결과 화면", text: "클리어 · 실패 화면과 최종 점수, 다시 시작", images: ["breaker-clear.webp", "breaker-fail.webp"] },
      ],
      problem: {
        title: "패들이 마우스와 어긋나던 문제",
        symptom: "마우스를 움직이면 패들이 마우스 위치보다 앞서거나 뒤처졌습니다.",
        cause: "캔버스의 실제 크기와 CSS로 보이는 크기가 달라, 마우스 좌표를 그대로 쓰면 비율만큼 어긋났습니다.",
        solution: "`(e.clientX - rect.left) * (canvas.width / rect.width)`로 화면 좌표를 캔버스 좌표로 바꿔 맞췄습니다.",
        lesson: "캔버스는 화면에 보이는 크기와 그리는 크기가 다를 수 있다",
        result: { label: "패들이 마우스 위치에서 어긋난 정도 (캔버스 폭 대비 — 800px 캔버스를 1000px로 늘려 보여 줄 때)", from: "최대 25%", to: "0%" },
      },
      improvements: [
        "공 이동과 서브 대기를 프레임 수로 계산(60fps 기준) → 120Hz 모니터에서는 공이 두 배 빨라짐 → 지난 프레임과의 시간 차이로 이동 거리 계산",
        "패들을 `mousemove`로만 움직여 휴대폰에서는 플레이할 수 없음 → `pointermove`로 바꿔 터치도 지원",
        "벽돌 한 판을 깨면 바로 끝남 → 판마다 공 속도를 올리는 레벨 추가",
      ],
    },
  },
  {
    projectId: "canvas-draw",
    name: "캔버스 드로잉 앱 — 그리고 저장하는 그림판",
    type: "solo",
    category: "Canvas",
    teamSize: 1,
    period: "2026.06",
    role: "기획·디자인·개발 전체",
    roleShort: "기획 · 디자인 · 개발 전체",
    summary: "Pointer Events로 마우스 · 터치 · 펜을 한 번에 처리하고, 되돌리기와 PNG 저장까지 지원",
    stack: ["HTML5", "CSS3", "JavaScript", "Canvas API", "Pointer Events"],
    thumbnail: "draw-thumb.webp",
    previewVideo: "draw-preview.mp4", // public/videos/ — 썸네일에 마우스를 올리면 재생 (그리기 → 되돌리기(Ctrl+Z) → 다시 그리기 녹화)
    headerColor: "#00008b", headerTone: "dark", headerText: "#ffffff", // #toolbar background-color: darkblue · 글자 white
    links: [
      { label: "사용해보기", href: "https://younggi12.github.io/breaker/js060901.html" }, // 터치 · 되돌리기를 넣은 최신본은 breaker 저장소에 있음 (draw-app 저장소는 6월 첫 버전)
      { label: "GitHub", href: "https://github.com/younggi12/breaker/blob/main/js060901.html" },
    ],
    hasDetail: true,
    detail: {
      features: [
        { title: "그리기", text: "마우스 · 터치 · 펜을 Pointer Events 하나로 처리, 캔버스 밖으로 나가도 획이 끊기지 않음", images: ["draw-main.webp", "draw-drawn.webp"] },
        { title: "되돌리기", text: "버튼이나 Ctrl+Z로 최근 20단계까지 되돌리기 (획을 긋기 직전 화면을 getImageData로 저장)", images: ["draw-drawn.webp", "draw-undo.webp"] },
        { title: "PNG 저장", text: "배경색 · 펜 색 · 굵기를 바꿔 그리고 PNG로 다운로드", code: { file: "js060901.html", snippet: "// 임시 캔버스에 배경색 + 그림을 합침\nconst tempCanvas = document.createElement(\"canvas\");\nconst tempCtx = tempCanvas.getContext(\"2d\");\ntempCanvas.width = canvas.width;\ntempCanvas.height = canvas.height;\n\ntempCtx.fillStyle = bgColor;\ntempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);\ntempCtx.drawImage(canvas, 0, 0);\n\n// PNG로 다운로드\nlet link = document.createElement(\"a\");\nlink.download = \"drawing.png\";\nlink.href = tempCanvas.toDataURL(\"image/png\");\nlink.click();" } },
      ],
      problem: {
        title: "다운로드한 그림이 보이지 않던 문제",
        symptom: "기본 펜으로 그린 그림을 PNG로 저장하면 그림이 보이지 않았습니다.",
        cause: "화면의 흰 배경은 CSS로만 칠해져 있어, 저장 파일에는 투명 배경과 기본 검정 배경값만 남았습니다.",
        solution: "저장할 때 임시 캔버스에 배경을 먼저 칠하고 그림을 합쳐 내보내고, 기본 배경을 흰색으로 통일했습니다.",
        lesson: "화면에 보이는 것과 캔버스에 실제로 그려진 것은 다를 수 있다",
        result: { label: "기본 펜으로 그린 그림이 저장한 PNG에서 사라진 비율", from: "100%", to: "0%" },
      },
      improvements: [
        "창 크기를 바꾸면 캔버스를 다시 만들면서 되돌리기 기록이 모두 지워짐 → 기록도 새 크기에 맞춰 옮겨 두기",
        "되돌리기만 있고 다시 실행이 없음 → 되돌린 화면을 따로 쌓아 두고 Ctrl+Shift+Z로 다시 실행",
        "고해상도(레티나) 화면에서 선이 흐릿하게 보임 → `devicePixelRatio`만큼 캔버스를 크게 만들어 선명하게",
      ],
    },
  },
];

// ---- 조회 헬퍼 ----
export const getProjectsByType = (type) => PROJECTS.filter((p) => p.type === type);
export const getProjectById = (projectId) => PROJECTS.find((p) => p.projectId === projectId);

// 상세 페이지가 있는 작품 (상세 페이지 아래 "다른 작품 보기" 줄, 배열 순서 그대로)
export const getDetailProjects = () => PROJECTS.filter((p) => p.hasDetail);