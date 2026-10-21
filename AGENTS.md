# AGENTS.md — 이영기 포트폴리오

> 사람이든 AI(Codex, Claude 등)든 코드 작업 전에 이 문서를 먼저 읽습니다.
> 문서와 실제 코드가 다르면 **코드 기준**으로 판단하고, 그 자리에서 이 문서를 고칩니다.

## 1. 프로젝트 개요
- 취업용 개인 포트폴리오 — 대상: 채용 담당자, 현직 개발자
- 핵심 문구: "디자인을 코드로, 화면을 경험으로."
- 배포: Vercel https://younggi-portfolio.vercel.app (`main` push 시 자동 배포, `vercel.json` rewrites로 새로고침 404 방지) — 주소가 바뀌면 `index.html`의 og:url · og:image · canonical도 같이
- 개인 프로젝트 — 모든 영역 담당 이영기

## 2. 기술 스택
- React 18 · Vite 5 · React Router 7 · SCSS Modules (`@use`) · npm
- 경로 별칭 `@` = `src` (JS · SCSS 모두 `@/...`)
- `three`: 첫 화면 3D YG (`pages/Home/sections/hero/heroScene.js`, 따로 불러옴)
- `gsap`: 헤더 로고 — YG ↔ YOUNG GI 저절로 펼쳤다 접기 무한 반복 (`Header/Logo.jsx`)
- `simple-icons` · `lucide-react`: 기술 아이콘 (`utils/skillIcons.js`에서 쓰는 것만 import)
- 챗봇: `api/chat.js`(Vercel 서버 함수) → OpenAI(`gpt-4o-mini`, 스트리밍). 키는 환경 변수 `OPENAI_API_KEY`만 (Vercel 설정 · 로컬 `.env.local`, `VITE_` 접두사 금지). **키워드 RAG** — 수업 방식 그대로 — 근거 자료 `api/guide.txt`를 `[00. 단원]` 단위로 나누고(`대표 명칭` · `관련 표현` · `내용`), `api/_rag.js`가 질문과 관련 표현을 소문자 · 띄어쓰기 없이 비교해 겹친 길이로 점수 → 상위 3개 + `[00] 공통 원칙`을 `api/_prompt.js`의 말투 지시와 함께 보냄(못 찾으면 자기소개 · 작품 목록). **사이트 데이터(src/data)를 고치면 guide.txt도 같이**. 개발 서버에서는 `vite.config.js`의 devApi가 같은 함수를 실행
- 새 패키지는 이 문서에 이유를 적은 뒤 설치

## 3. 폴더 구조
```
src/
├── App.jsx · main.jsx          # 라우터 / global.scss 1회 import
├── routes/paths.js             # PATHS, toProjectDetail(), SECTION_IDS — URL 하드코딩 금지
├── data/                       # 화면 글자는 전부 여기
│   ├── profile.js              # 이름 · 로고 · 소개 · 사진 · 교육 과정 · 배운 기술 · 연락처
│   ├── projects.js             # 작품 6개 + 상세(detail) + 조회 헬퍼
│   └── site.js                 # 메뉴 · 제목 · 버튼 · 첫 화면 · 상세 페이지 고정 문구
├── components/common/          # SiteLayout, Header, Footer, ChatBot, CursorBadge, Lightbox, SkillIcon, ScrollToTop
├── pages/
│   ├── Home/sections/
│   │   ├── Hero/               # Hero.jsx · heroScene.js(3D) · ygPath.js
│   │   ├── About/              # About.jsx(조립) · NameIntro · FactRows · TiltPhoto · aboutShared.js
│   │   └── ProjectTiles/
│   ├── ProjectDetail/          # ProjectDetail.jsx(조립) · Feature · Problem · useCoverSnap · useActiveToc · detailText
│   └── NotFound/
├── hooks/                      # useSmoothScroll, useHeaderTheme, useHideOnScroll, useScrollReveal, useActiveSection
├── utils/                      # scrollToY, getProjectImage, skillIcons
├── assets/images/projects/     # 작품 스크린샷 (webp)
└── styles/                     # _variables, _mixins, _reset, global
public/  favicon.svg · og-image.png · images/(About 사진) · docs/(팀 기획 문서 PDF)
docs/PROJECTS_CONTENT.md        # 작품 설명 원본
api/  chat.js(챗봇 서버 함수) · _rag.js(단원 검색) · _prompt.js(규칙 + 단원) · guide.txt(챗봇 참고서)
```
- 컴포넌트 · 섹션은 폴더 단위: `Header/Header.jsx` + `Header.module.scss` — 한 파일이 길어지면 같은 폴더 안에서 부품별 파일로 나눔
- 쓰지 않는 파일 · 이미지는 남기지 않음

## 4. 화면 구성
### Home (`/`)
1. **Hero** — 흰 화면, 3D YG가 스크롤에 따라 선 → 면으로 채워지고 문구가 "디자인을 코드로" → "화면을 경험으로"로 타이핑. 오른쪽 아래 "작품 바로 보기"로 연출을 건너뛰고 작품 소개로. 다 채워지면 화면이 내려가지 않고 **Y의 오른쪽 위 팔 속으로 들어가며** 검게 → 바로 이름 장면
2. **이름 장면 (About 시작)** — 검은 화면에서 시간으로 저절로: HELLO / I'M 타이핑 → 1초 멈춤 → YG → YOUNG GI. **풀네임이 다 나오기 전엔 스크롤해도 내려가지 않음**(헤더 메뉴 · 작품 바로 보기는 로고처럼 흰 막 사이에 한 번에 이동 — 커튼은 걷어 둔 채, About 메뉴는 EDUCATION으로). 휠을 한 번 굴리면 검은 화면이 **커튼처럼 위로 걷히며** EDUCATION (위로 굴리면 다시 내려옴)
3. **EDUCATION** — 교육 과정 한 줄 + 숫자 4줄(커튼이 다 걷힌 뒤 0부터 올라감)
4. **PROFILE** — 사진(마우스 올릴 때마다 뒤집히며 `hoverPhotos` 차례로, 없으면 YG) · 이름 · 소개 · 일하는 방식 3줄
5. **SKILLS** — 배운 기술 6분야
6. **Projects** — TEAM / SOLO 그룹, 한 화면에 작품 하나(이 구간에서는 헤더 숨김), 썸네일에 마우스를 올리면 사이트 전체 캡처가 스크롤(`scrollShot`), 한 화면짜리 작품(F1 · 벽돌깨기 · 드로잉)은 짧은 시연 영상 재생(`previewVideo`, `public/videos/`, mp4 · 무음 · 1200×600)
7. **Footer = Contact** — 이메일 · 전화(복사) · GitHub (이력서 PDF는 숨김 — `profile.resume`을 채우면 다시 표시)

### ProjectDetail (`/projects/:projectId`)
- 표지: 썸네일이 화면 전체 배경(어둡게), 왼쪽에 이름 · 부제 · 소개 · 사이트/GitHub 버튼. 아래로 굴리면 1.2초 천천히 본문으로, 표지는 뒤로 물러남
- 본문: 왼쪽 고정 칸(담당 · 기술 · 링크 · 기획 문서 내려받기 · 목차) + 오른쪽 기능(사진 `1 / 3` 번호 · 코드 카드 · 확대) → 문제 해결 → 개선할 점 → 다른 작품 목록
- 없는 작품 id는 404

### 공통
- 헤더: 로고(YG ↔ YOUNG GI 저절로 무한 반복, 누르면 흰 막 사이로 맨 위) + About / Projects / Contact(섹션으로 이동). 모든 섹션 최상위에 `data-header-theme="light" | "dark"` 필수 — 헤더 글자색이 이걸 보고 바뀜
- 스크롤: `useSmoothScroll`(휠을 부드럽게) — 페이지 안 이동은 반드시 `utils/scrollToY`의 `scrollToY` / `scrollToElement`로 (직접 `window.scrollTo` 금지)
- 챗봇: 오른쪽 아래 YG 버튼(첫 화면 Hero에서는 숨김, `data-chat-hide`) → 이영기 본인 말투(1인칭 "저", 존댓말)로 포트폴리오 내용만 답함. 창 안 휠은 페이지 연출과 분리(`data-chat`)
- 커서: `CursorBadge` — 점 커서, 버튼 자석, 작품 사진 위 VIEW 원 (마우스 기기만)
- 스크롤 등장: 요소에 `data-reveal`
- "동작 줄이기" 설정이면 연출 없이 최종 화면

## 5. 디자인 토큰 (`styles/_variables.scss`에서만 정의)
- 색: 흰 배경 `$color-bg` · 글자 `$color-text`(#1D1D1F) · 진한 배경 위 글자 `$color-on-panel`(흰) · 팔레트 #384959 #6A89A7 #88BDF2 #BDDDFC. 글자색은 검정 / 흰색 두 가지
- 폰트: Pretendard Variable, 큰 제목 굵기 700
- 레이아웃: 헤더 72px · 본문 최대 1280px(작품 1600px) · 좌우 여백 80 / 40 / 20px
- 반응형: 모바일 ~767 / 태블릿 768~1199 / 데스크톱 1200~ — `@include mobile` · `tablet` · `below-desktop`만 사용
- 색 · 간격 · 글자 크기 하드코딩 금지 (토큰이 없으면 먼저 추가)

## 6. 데이터 계약
```js
// projects.js — 배열 순서 = 화면 순서 (팀 JAJAK → 멍냥허브 / 개인 BlueLine → F1 → 벽돌깨기 → 드로잉)
{
  projectId: "jajak", name: "JAJAK — 부제",   // " — " 앞 이름, 뒤 부제
  type: "team" | "solo", category: "React", teamSize: 5, period: "2026.08 ~ 2026.09",
  role: "상세 담당", roleShort: "카드용 짧은 담당", summary: "한 줄 소개(\n = 상세 표지 줄바꿈)",
  stack: ["React 19"], thumbnail: "jajak-thumb.webp",  // 1200×600
  previewVideo: "f1-preview.mp4",    // 선택 — public/videos/ 시연 영상(호버 시 재생)
  scrollShot: "jajak-scroll.webp",   // 선택 — 사이트 전체 캡처(가로 1200), 썸네일에 마우스를 올리면 위→아래 스크롤
  headerColor, headerTone, headerText,  // 그 사이트 헤더 색 → 작품 카드 기술 패널
  coverZoom: 1.07,                      // 선택 — 상세 표지 사진 확대
  links: [{ label: "사이트", href }, { label: "GitHub", href }],
  docs: [{ label: "기획서", file: "jajak-plan.pdf" }],  // 선택 — public/docs/ PDF, 작품 소개 · 상세에서 내려받기
  hasDetail: true,
  detail: {
    features: [{ title, text, images: ["…webp"], code: { file, snippet } }], // 3개, code는 선택
    problem: { title, symptom, tries?, cause, solution, lesson },             // 선택
    improvements: ["…"],                                                       // 선택
  },
}
```
- 이미지는 파일명만, 화면에서는 `getProjectImage(파일명)`
- 문장 속 `` `코드` ``는 `<code>`로 표시
- 화면 글자는 `src/data/*`에만 (JSX에 문구 하드코딩 금지)

## 7. 코드 규칙
- 컴포넌트 PascalCase / 변수 · 함수 camelCase / 상수 UPPER_SNAKE / SCSS 클래스 camelCase / 이미지 영문 소문자-하이픈.webp
- 상태는 가까운 범위에 (`useState` → props → 커스텀 훅). 전역 상태 라이브러리 · Context 없음
- 브라우저 저장소는 `try/catch` 필수
- 주석은 한국어로, "무엇을 왜" 짧게

## 8. Git · 배포
- `main` = 배포 브랜치, 항상 빌드되는 상태
- 커밋: `feat:` `fix:` `style:` `refactor:` `docs:` `chore:` + 한글 설명
- `.env*` 커밋 금지, `push --force` 금지
- push 전 `npm run build` 확인

## 9. 작업 규칙 (AI 포함)
- 요청 범위만 수정, 기존 컴포넌트 · 훅 · 토큰 먼저 재사용
- 끝나면: 수정한 파일 목록 + `npm run build` 결과 보고
- 완료 기준: 빌드 오류 없음 · 모바일 / 태블릿 / 데스크톱 확인 · 키보드 이동 가능 · 문구는 data에만 · 바뀐 규칙은 이 문서에 반영

## 10. 나중에 할 일
- [ ] About 사진 넣기 (`public/images/` + `profile.photo`)
- [ ] Vite 최신 버전 업그레이드
- [ ] BlueLine 제작 기간 확정

## 버전
- v4.2 (2026-10-20): 팀 작품 소개 · 상세에 기획 문서 PDF 내려받기 (`docs` 필드, `public/docs/`), 메뉴 이동이 이름 장면을 바로 지나감, 사진 뒤집기
- v4.1 (2026-10-16): 섹션 · 상세 페이지를 폴더 + 부품 파일로 나눔, 안 쓰는 이모지 파일 삭제
- v4.0 (2026-10-16): 지금 사이트 기준으로 전면 정리 (Hero 3D · 이름 장면 커튼 · 상세 표지 배경 사진 반영, 지난 기록 삭제)
