# AGENTS.md — 이영기 포트폴리오

> 2차 팀 프로젝트(JAJAK)의 AGENTS.md 방식을 개인 프로젝트에 맞게 옮긴 공식 규칙 문서입니다.
> 사람이든 AI(Codex, Claude 등)든 코드 작업 전에 이 문서를 먼저 읽습니다.

---

## 0. 문서 운영 원칙
- 이 문서가 이 프로젝트의 최종 기준입니다. 메모, 대화 기록보다 우선합니다.
- 문서와 실제 코드가 다르면 **실제 코드 기준**으로 판단하고, 그 자리에서 문서를 갱신합니다.
- 규칙을 바꿀 때는 코드만 바꾸지 않고 이 문서와 맨 아래 버전 히스토리를 함께 갱신합니다.
- `[확정 필요]` 표시는 아직 정하지 않은 항목입니다. 정해지면 표시를 지우고 내용을 확정합니다.

## 0-1. 디자인 동결 (2026-10-06~)
- 과정 종료(2026.10) 전 **완성·배포가 우선**입니다. 지금부터 디자인 방향·색·레이아웃은 바꾸지 않습니다.
- 새 아이디어는 아래 "나중에 추가" 목록에 적어두고, 배포 후에 하나씩 진행합니다.

### 나중에 추가 (배포 후)
- [ ] 사이트 첫 진입 인트로 영상 (11장)
- [ ] Skills 섹션 (`data/skills.js`는 유지)
- [ ] Vite 5 → 최신 버전 업그레이드 (esbuild 개발 서버 보안 경고 해결)
- [ ] 벽돌깨기 레벨업·모바일 터치, BlueLine 인트로 이미지 문구 수정

## 1. 프로젝트 개요
- 목적: 취업용 개인 포트폴리오 웹사이트
- 대상: 채용 담당자, 현직 개발자(코드와 GitHub까지 볼 수 있는 사람)
- 핵심 메시지: "디자인을 코드로, 화면을 경험으로." (첫 화면 한 줄 소개)
- 배포: Vercel (`main` 브랜치 push 시 자동 배포)

## 2. 역할 (Ownership)
개인 프로젝트이므로 **모든 영역의 담당자는 이영기**입니다.

| 영역 | 담당 |
| --- | --- |
| 기획 / 콘텐츠(자기소개, 프로젝트 설명) | 이영기 |
| 디자인(디자인 토큰, 화면 설계) | 이영기 |
| 공통 구조(Layout, Header, Footer, Routing) | 이영기 |
| 페이지 구현 | 이영기 |
| 인트로 영상(새로 제작) / 이미지 자산 | 이영기 |
| 배포 / 문서(README, AGENTS.md) | 이영기 |

- 팀 프로젝트처럼 "남의 영역이라 못 고치는 파일"은 없습니다.
- 대신 **공통 파일(6장)을 고칠 때는 영향 범위를 먼저 확인**합니다. 혼자라도 공통 파일 하나가 모든 페이지를 깨뜨릴 수 있기 때문입니다.

## 3. 기술 스택
- React 18, Vite 5, JavaScript + JSX
- React Router 7 (`react-router-dom`)
- 경로 별칭: `@` = `src` (`vite.config.js`). JS·SCSS 모두 `@/...`로 import
- Sass / SCSS Modules (`*.module.scss`, `@use` 방식)
- 패키지 매니저: npm 고정, `package-lock.json` 기준
- 새 패키지는 **이 문서에 이유를 적은 뒤** 설치합니다(GSAP 등 애니메이션 라이브러리 포함).

## 4. 디자인 토큰
모든 값은 `src/styles/_variables.scss`에서만 정의하고, 컴포넌트에서는 변수만 씁니다. 색상·간격 하드코딩 금지.

### 4-1. 색상 — "Stormy morning" × Apple 방식 (밝은 페이지 + 진한 카드)
팔레트 4색(`#384959` `#6A89A7` `#88BDF2` `#BDDDFC`) + 흰색만 쓰고, 새 색은 이 색들의 **투명도 변형**으로만 만듭니다.
apple.com의 색 구조(흰 배경 / 밝은 회색 띠 / 거의 검정 글자 / 검은 제품 카드)를 팔레트에 그대로 대응시켰습니다.

| 토큰 | 값 | Apple 대응 | 용도 | 대비 |
| --- | --- | --- | --- | --- |
| `$color-bg` | `#FFFFFF` | `#FFFFFF` | 페이지 배경 | — |
| `$color-band` | `#BDDDFC` 30% | `#F5F5F7` | 섹션 띠 배경 (흰 섹션과 번갈아) | 위 글자 8.4 |
| `$color-text` | `#1D1D1F` | `#1D1D1F` | 밝은 배경 위 **모든 글자** (버튼 글자 포함) — **팔레트 예외** | 흰 16.8 / 연한 카드 11.95 |
| `$color-text-soft` | `#6A89A7` | `#6E6E73` | 2톤 제목의 뒷부분 등 — **24px 이상 또는 18.66px 이상 굵은 글씨에만** | 3.65 |
| `$color-border` | `#6A89A7` 30% | `#D2D2D7` | 테두리·구분선 | — |
| `$color-panel` | `#384959` | `#1D1D1F` 패널 | 진한 카드, 주요 버튼 배경 | — |
| `$color-on-panel` | `#FFFFFF` | `#F5F5F7` | 진한 배경(카드·버튼·헤더) 위 **모든 글자** | 9.27 |
| `$color-panel-point` | `#88BDF2` | `#2997FF` | 진한 카드 위 포인트 (버튼 배경, 강조) | 4.68 |
| `$color-panel-tag` | `#88BDF2` 20% | — | 진한 카드 위 태그 배경 | 위 흰 글자 6.52 |
| `$color-panel-soft` | `#BDDDFC` | 하늘색 제품 카드 | 연한 카드 | 위 검정 글자 11.95 |
| `$color-panel-soft-tag` | 흰색 60% | — | 연한 카드 위 태그 배경 | 위 글자 8.1 |
| `$color-focus` | `#384959` | `#0071E3` | 포커스 링 | — |
| `$color-black` | `#000000` | 검정 | 헤더 진한 테마, 그림자 | — |
| `$color-intro-bg` / `$color-intro-text` | `#384959` / `#FFFFFF` | — | 인트로 (어둡게 시작해 밝은 페이지로 열림) | 9.27 |

**규칙**
- **글자색은 검정(`#1D1D1F`)과 흰색 두 가지만** 씁니다 (Apple 방식). 밝은 배경 위 → 검정, 진한 배경 위 → 흰색. 버튼 글자도 동일.
- 팔레트 색은 배경·카드·버튼·테두리에만 쓰고 글자에는 쓰지 않습니다. 예외: 큰 제목 2톤 처리의 `$color-text-soft`.
- 위계는 크기·굵기로 구분합니다.
- `#88BDF2`는 **진한 카드(`$color-panel`) 위에서만** 씁니다. 흰 배경 위에서는 글자·버튼에 쓰지 않습니다(1.98:1).
- 섹션은 흰색 ↔ `$color-band`를 번갈아 배치합니다 (`@include band`).
- **헤더는 Apple 방식**: 항상 화면 위에 고정되어 따라오고, 배경색은 헤더 바로 아래 섹션에 맞춰 바뀝니다.
  - 모든 섹션·페이지 최상위 요소에 `data-header-theme="light" | "band" | "dark"`를 반드시 붙입니다 (흰 배경 / 띠 배경 / 진한 배경).
  - 새 섹션을 만들 때 이 속성을 빠뜨리면 헤더 색이 맞지 않습니다.
- 프로젝트 카드는 진한 카드(`tone="dark"`)와 연한 카드(`tone="light"`)를 번갈아 배치합니다.
- 버튼: 흰 배경 위 `@include button-primary`(진한 배경 + 흰 글자), 진한 카드 위 `@include button-on-panel`(하늘색 배경 + 진한 글자). 호버는 투명도 85%.
- 링크 호버는 색 변화 대신 밑줄 `@include hover-underline`.
- 긴 본문은 `$text-max-width`(680px)를 넘지 않게 합니다.

### 4-2. 타이포그래피
- 기본 폰트: **Pretendard Variable** — `index.html`에서 dynamic subset CSS **한 줄만** 로드 (static 전체 파일 중복 로드 금지)
- 대체 폰트: `-apple-system, "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif`
- 본문 17px, 큰 제목 굵기 700, 제목 자간 `$letter-spacing-title`(-0.025em) / `$letter-spacing-heading`(-0.015em)
- 폰트 크기·굵기는 `_variables.scss`의 `$font-size-*`, `$font-weight-*` 토큰 사용

### 4-3. 간격
- 4px 단위 스케일: `$space-1`(4px) ~ `$space-10`(40px), `$space-16`(64px), `$space-20`(80px)

### 4-4. 레이아웃 / 반응형
- 헤더 높이 `$header-height`(72px), 섹션 이동 시 헤더에 가려지지 않게 `scroll-padding-top` 적용
- Breakpoint: Mobile 0–767 / Tablet 768–1199 / Desktop 1200+
- PC 1440 기준, content max-width 1280, 좌우 여백 80px(모바일 20px), gutter 24px
- 미디어쿼리는 `_mixins.scss`의 `@include mobile`, `@include tablet`, `@include below-desktop` 믹스인으로만 작성
- 가운데 정렬 콘텐츠 영역은 `@include container` 사용

### 4-5. 모서리 · 모션
- Radius: `$radius-sm`(4) / `$radius-md`(8) / `$radius-lg`(12) / `$radius-pill`
- 전환 시간: `$duration-fast`(0.15s) / `$duration-base`(0.3s), `$easing-base`

## 5. 페이지 / 라우트
URL은 `src/routes/paths.js`에서만 정의합니다. 컴포넌트에서 `"/projects"`처럼 문자열 하드코딩 금지 → `PATHS.projects` 사용.

| 페이지 | 경로 | 내용 |
| --- | --- | --- |
| Home | `/` | **첫 화면(라벨·이름·한 줄 소개·보조 설명, 버튼 없음) → About(사진·소개·교육 과정·배운 것) → 작품 소개(Apple 타일 6개) → 푸터(연락처)** |
| Projects | `/projects` | 프로젝트 6개 전체 — **팀 프로젝트 / 개인 프로젝트 두 섹션**, 카드마다 기술 태그 |
| ProjectDetail | `/projects/:projectId` | 개요, 담당, 문제·해결, 스크린샷, 링크 — `hasDetail: true`인 프로젝트만 |
| NotFound | `*` | 404 (없는 `projectId`, 상세 페이지 없는 `projectId`도 여기로) |

- 헤더 로고는 이니셜 `YG`(`profile.logo`), 누르면 홈. 헤더 아래 구분선 없음(배경색이 아래 섹션과 같아 자연스럽게 이어짐)
- About 사진: `public/images/`에 넣고 `profile.photo`에 파일명만 적음(세로 4:5). 비어 있으면 같은 크기의 빈 자리 표시
- About은 Home 안의 섹션, **Contact는 푸터**입니다 (헤더 Contact 메뉴 → 푸터로 스크롤). Skills는 "나중에 추가" 목록.
- Projects 페이지는 필터 없이 "팀 프로젝트" 섹션 → "개인 프로젝트" 섹션 순서로 나눠 보여줍니다. 구분은 `projects.js`의 `type`(`"team"` / `"solo"`) 값으로만 합니다.
- 카드마다 기술 분류 태그(`category`: React / Canvas / Vanilla JS)를 붙입니다. 개인 섹션은 React → Canvas → Vanilla JS 순서로 배치합니다.
- 카드 클릭 동작: `hasDetail: true`면 상세 페이지로, `false`면 상세 페이지 없이 카드의 배포/GitHub 버튼만 노출합니다.
- 헤더 메뉴(About / Projects / Contact)는 Home의 각 섹션으로 스크롤 이동합니다. 다른 페이지에서 누르면 Home으로 이동한 뒤 해당 섹션으로 스크롤합니다.
- 프로젝트가 늘어나도 페이지는 늘리지 않고 `projects.js`에 데이터만 추가합니다.
- Vercel에서 새로고침 시 404가 나지 않도록 루트에 `vercel.json` rewrites 설정 필수.

## 6. 폴더 구조
```
portfolio/
├── docs/
│   ├── design/book/         # 책 연출 원본(사진·영상) 보관 — 사이트에선 안 씀
│   └── PROJECTS_CONTENT.md  # 프로젝트 카드·상세 페이지 콘텐츠 원본 (data/projects.js로 옮기기 전 정리본)
├── AGENTS.md
├── README.md
├── index.html
├── package.json / package-lock.json
├── vite.config.js
├── vercel.json
├── public/
│   ├── images/              # About 사진 (profile.webp, 세로 4:5)
│   ├── intro.mp4            # 인트로 영상(새로 제작 예정)
│   └── intro-poster.jpg     # 인트로 첫 프레임(새로 제작 예정)
└── src/
    ├── main.jsx             # global.scss는 여기서 한 번만 import
    ├── App.jsx              # Router 설정만
    ├── assets/
    │   └── images/projects/ # 프로젝트 스크린샷 (webp, 파일명 영문 소문자 + 하이픈)
    ├── components/
    │   ├── common/          # SiteLayout, Header, Footer, ScrollToTop (+ IntroVideo: 10번 작업)
    │   └── ui/              # SectionTitle, ProjectCard (필요 시 Button, Tag 추가)
    ├── data/
    │   ├── profile.js       # 이름, 로고, 소개, 사진, 교육 과정, 배운 것, 연락처
    │   ├── projects.js      # 프로젝트 목록 + 상세 + 조회 헬퍼
    │   ├── skills.js        # 스킬 (Skills 섹션 보류 — 데이터만 유지)
    │   └── site.js          # 메뉴, 섹션 제목, 버튼 문구 등 고정 문구
    ├── pages/
    │   ├── Home/
    │   │   ├── Home.jsx
    │   │   └── sections/    # Hero, About, ProjectTiles (각각 .jsx + .module.scss)
    │   ├── Projects/
    │   ├── ProjectDetail/
    │   └── NotFound/
    ├── hooks/
    │   └── useHeaderTheme.js   # 헤더 아래 섹션의 테마(light/band/dark) 감지
    ├── routes/
    │   └── paths.js         # PATHS, toProjectDetail(), SECTION_IDS
    ├── utils/
    │   └── getProjectImage.js  # 이미지 파일명 → 빌드 URL
    └── styles/
        ├── _variables.scss
        ├── _mixins.scss
        ├── _reset.scss
        └── global.scss
```
- 폴더를 새로 만들 땐 먼저 이 트리에 추가합니다.
- 컴포넌트는 폴더 단위: `ProjectCard/ProjectCard.jsx` + `ProjectCard.module.scss`

**공통 파일**(수정 전 영향 범위 확인): `App.jsx`, `main.jsx`, `routes/*`, `styles/*`, `components/common/*`, `components/ui/*`, `data/*`, `index.html`, `vite.config.js`, `vercel.json`, `package.json`

## 7. 데이터 계약
화면에 보이는 텍스트 콘텐츠는 `src/data/*`에서만 관리합니다. JSX에 콘텐츠 하드코딩 금지.

```js
// src/data/projects.js
{
  projectId: "jajak",           // URL에 쓰이는 영문 소문자 id (고유)
  name: "JAJAK — 전통주 AI 큐레이션 쇼핑몰",
  type: "team",                 // "team" | "solo" → Projects 페이지 섹션 결정
  category: "React",            // "React" | "Canvas" | "Vanilla JS" → 카드 태그
  teamSize: 5,                  // solo면 1
  period: "2026.08 ~ 2026.09",  // 이 프로젝트를 만든 기간(월 단위)
  role: "로그인/회원가입/로그아웃, 공지사항·1:1 문의, 위시리스트",  // 팀: 내 담당 / 솔로: "기획·디자인·개발 전체"
  summary: "한 줄 소개 — 무엇을 만든 프로젝트인지",
  points: ["핵심 구현 2~3개 — 기술 이름이 아니라 무엇을 만들고 무엇을 해결했는지"],
  stack: ["React", "Firebase Auth", "Firestore"],   // 사용 기술
  thumbnail: "jajak-thumb.webp", // assets/images/projects/ 기준, 800×500
  images: ["jajak-login.webp"],  // 상세·갤러리용 스크린샷 (1600px)
  links: [                      // 버튼 순서대로, 없으면 빈 배열
    { label: "사이트", href: "https://jajak-ten.vercel.app" },
    { label: "GitHub", href: "https://github.com/jiwoo1012/TeamProject2" },
  ],
  featured: true,               // Home 대표 프로젝트(최대 3개)
  hasDetail: true,              // 상세 페이지 유무
}
```
- 필드를 추가·삭제할 때는 이 예시부터 고칩니다.
- 이미지는 파일명만 적고, 화면에서는 `getProjectImage(파일명)`으로 URL을 얻습니다.
- 상세 페이지 내용(`detail`)은 8번 작업 때 필드를 추가합니다.
- `links`가 빈 배열이면 버튼 영역을 렌더링하지 않습니다.

### 7-1. 프로젝트 목록 (6개)
| projectId | 이름 | 구분 | 분류 | 대표 | 상세 | 링크 |
| --- | --- | --- | --- | --- | --- | --- |
| `jajak` | JAJAK — 전통주 AI 큐레이션 쇼핑몰 | 팀 | React | ★ | O | 사이트 jajak-ten.vercel.app / GitHub jiwoo1012/TeamProject2 |
| `mungnyang-hub` | 멍냥허브 — 반려동물 용품 쇼핑몰 | 팀 | Vanilla JS | | X | 사이트 projectmangryung.github.io/teamproject/ / GitHub projectMangRyung/teamproject |
| `f1-fansite` | F1 팬사이트 — 방명록 | 개인 | React | ★ | O | 방명록 guestbook01-phi.vercel.app (GitHub younggi12/guestbook01) / 게시글(학습 버전) re008-tzii.vercel.app (GitHub younggi12/re008) |
| `canvas-breaker` | 캔버스 벽돌깨기 게임 | 개인 | Canvas | ★ | X | 사이트 younggi12.github.io/breaker/js061201.html / GitHub younggi12/breaker |
| `canvas-draw` | 캔버스 드로잉 앱 | 개인 | Canvas | | X | 사이트 younggi12.github.io/draw-app/js060901.html / GitHub younggi12/draw-app |
| `blueline` | BlueLine 야구용품 쇼핑몰 | 개인 | Vanilla JS | | X | 사이트 younggi12.github.io/-4/index.html / GitHub younggi12/-4 |

- 대표(★) 3개는 `featured: true`, Home에 노출. 순서는 위 표 순서(팀 → 개인).
- 대표 선정 기준: 팀 협업(JAJAK) / React + Firebase 개인 작업(F1 팬사이트) / Canvas 인터랙션(벽돌깨기) — 서로 다른 역량이 하나씩 보이도록.
- `f1-fansite`: 학습하며 만든 게시글 등록(CRUD, 디자인 없음)을 기반으로 디자인과 기능을 확장해 방명록으로 완성. **"학습 버전 → 완성 버전" 성장 과정**을 상세 페이지의 중심 이야기로 사용. 저장소는 둘로 분리됨: 방명록 younggi12/guestbook01(Public), 게시글 younggi12/re008. 카드 버튼 순서: 방명록 → 방명록 GitHub → 게시글(학습 버전) → 게시글 GitHub.
- guestbook01 저장소의 `.env`, `firebase.txt` 제거 완료(2026-10-01) — Vercel 환경변수(Production·Preview)로 이전, `.gitignore`에 추가.
- `blueline`: 바닐라 JS로 직접 구현한 5페이지 쇼핑몰. Codex는 초기 일부만 활용 — 카드 담당 칸에 가볍게 언급(중심 이야기 아님).
- JAJAK 저장소(jiwoo1012/TeamProject2) Public 확인 완료 — GitHub 링크 노출. 기여자 5명(팀 5인).

#### 담당 / 핵심 내용 (정리된 것)
- **JAJAK** (2026.08 ~ 2026.09, 5인 팀): 로그인/회원가입/로그아웃, 공지사항·1:1 문의, 위시리스트, 상품상세 협업 · React 19, Firebase Authentication, Firestore
- **멍냥허브**: 옵션별 가격 계산, localStorage/sessionStorage 로그인 상태 유지, 모바일 네비게이션 버그 수정, 브랜드 페이지 제작 · HTML, CSS, JavaScript
- **F1 팬사이트** (방명록 2026.07, 첫 배포 7/15): 기획·디자인·개발 전체, 방명록(드라이버 캐릭터 선택·팀 필터·페이지네이션), 게시글 등록, 스크롤 애니메이션 · React, Vite, Firebase, Zustand, SCSS
- **벽돌깨기 / 드로잉 앱**: 기획·개발 전체 · HTML5 Canvas, JavaScript
- **BlueLine**: Codex + README.md 활용 제작 · HTML, CSS, JavaScript
- 각 프로젝트의 기간(`period`), 핵심 구현(`points`)은 추가 정리 필요 `[확정 필요]`

## 8. 네이밍 컨벤션
- 컴포넌트 PascalCase / 변수·함수·객체 필드 camelCase
- 이벤트 핸들러 `handleXxx`, boolean `isXxx` / `hasXxx` / `canXxx`
- 상수 UPPER_SNAKE_CASE (`PATHS`, `INTRO_MAX_MS`)
- SCSS Modules 클래스명 camelCase (`styles.projectCard`)
- 이미지 파일명 영문 소문자 + 하이픈, 형식은 webp (`jajak-thumb.webp`, `jajak-login.webp`)
- 스크린샷 규칙: 브라우저 탭·주소창 제거, 가로 1600px, 개인정보(이메일 등)는 흐리게 처리. 썸네일은 800×500(16:10)

## 9. 스타일링 규칙
- `global.scss`는 `main.jsx`에서 한 번만 import
- 각 `*.module.scss`는 `@use "@/styles/variables" as *;` 형태로 토큰을 불러옴
- 색·간격·폰트 크기 하드코딩 금지(토큰 없으면 `_variables.scss`에 먼저 추가)
- 대표 모션은 인트로 영상(보류) 한 곳. 그 외 페이지 전체에 같은 등장 애니메이션 반복 금지
- **작품 소개 규칙** (`pages/Home/sections/ProjectTiles.jsx`)
  - 팀 프로젝트 → 개인 프로젝트 순서로 나눠 보여줌 (`type` 기준)
  - 카드 크기는 모두 같게: 4열(태블릿 2열, 모바일 1열), 간격 `$space-6`
  - **카드 = 작품 사진만**(16:10, 둥근 모서리), 분류·이름·부제·버튼은 카드 **아래**
  - 이름은 `name`의 " — " 앞, 부제는 뒤
  - 버튼 2개: 상세 페이지 있으면 [자세히 보기, 첫 링크], 없으면 [첫 링크, 둘째 링크]
  - 썸네일은 **사이트 메인 화면** 캡처(내 담당 화면 X), 1200×750 webp

## 10. 상태관리 원칙
- 상태는 가장 가까운 범위에: `useState` → props → Custom Hook 순
- 전역 상태관리 라이브러리(Zustand, Redux 등)와 Context는 도입하지 않음 — 규모상 불필요
- 브라우저 저장소는 방문자 편의 값에만 사용(`try/catch` 필수). 현재 사용 키: `introSeen`(11장)

## 11. 인트로 영상 규칙
- **방향: 어두운 배경 + 흰색 텍스트** (`$color-intro-bg`, `$color-intro-text`) — 인트로가 끝나면 밝은 페이지가 열리는 대비 연출
- **보류 — "나중에 추가" 목록으로 이동 (2026-10-06).** 영상 내용: 구상 중 — 이전 VS Code 타이핑 영상은 사용하지 않음. 제작 방식(직접 녹화 / AI 생성 / 코드 렌더링)도 내용과 함께 정함
- `public/intro.mp4`를 Home 최초 진입 시 재생(전체화면 여부는 영상이 정해지면 확정)
- 영상 진행률 = 상단 로딩바 진행률, 종료 후 페이드로 Home 노출
- 클릭/아무 키로 건너뛰기, 로딩 중 `body` 스크롤 잠금
- 로드 실패 시 즉시 건너뜀, 10초 초과 시 강제 종료
- **첫 방문 때 1회만 재생, 재방문 시 재생하지 않음** — 다 보거나 건너뛰면 `localStorage`에 `introSeen: "true"` 저장(`try/catch` 필수, 저장 실패 시엔 매번 재생돼도 무방). 다른 브라우저·저장소 삭제 시에는 다시 재생됨
- 영상 조건: 무음 H.264 MP4, 10초 이하, 2MB 이하

## 12. Git 워크플로우 (개인용)
- `main`: 배포 브랜치(Vercel 자동 배포) — 항상 빌드되는 상태 유지
- `feature/작업명`: 기능 단위 작업 브랜치 (예: `feature/intro-video`, `feature/project-detail`)
- 흐름: `git switch main` → `git pull` → `git switch -c feature/작업명` → 작업 → `npm run build` 확인 → `main`에 merge → push
- 커밋 메시지: `feat:` / `fix:` / `style:` / `refactor:` / `docs:` / `chore:` + 한글 설명
- `git push --force` 금지, `.env*` 파일 커밋 금지

## 13. AI 작업 규칙 (Codex / Claude)
작업 전
1. 이 문서를 읽는다
2. 요청 범위를 확인한다
3. 기존 Component / Hook / data / 토큰을 먼저 검색해 재사용한다
4. 실제 폴더 구조를 확인한다

작업 중
- 요청하지 않은 페이지·파일 동시 리팩터링 금지
- 새 패키지 임의 설치 금지(3장 절차 따름)
- 공통 UI 중복 생성 금지, Route 문자열 하드코딩 금지
- 데이터 구조(7장) 임의 변경 금지

작업 후
- 수정한 파일 목록, 범위 이탈 여부, import 경로, `npm run build` 오류 여부를 보고

## 14. Definition of Done
- [ ] 요청 범위 안에서만 수정했다
- [ ] 공통 UI·토큰을 재사용했다(하드코딩 없음)
- [ ] 콘텐츠는 `src/data/*`에만 있다
- [ ] Mobile / Tablet / Desktop 3단계에서 확인했다
- [ ] 키보드로 이동 가능하고 포커스가 보인다
- [ ] `npm run build` 오류 없음
- [ ] 바뀐 규칙이 있으면 AGENTS.md를 갱신했다

## 15. Change Management
아래를 바꿀 때는 **이 문서를 먼저 고친 뒤** 코드를 바꿉니다.
- 폴더 구조 / Routes / 데이터 계약(7장) / 디자인 토큰 / Dependency / Git 워크플로우 / 인트로 규칙

## 16. 버전 히스토리
- v3.0 (2026-10-07): 작품 소개를 팀/개인 분리 + 같은 크기 사진 카드(글은 카드 아래)로 정리. JAJAK·멍냥허브 썸네일을 사이트 메인 화면으로 교체. **책 연출 코드 정리** — `FeaturedBook`·`FeaturedProjects`·`Skills`·`Section.module.scss`·`useMediaQuery`·`public/book/`·`react-pageflip`·`BOOK_TEXT`·`HERO_TEXT`·`$color-book-paper` 삭제 (원본은 `docs/design/book/`에 보관).
- v2.9 (2026-10-07): Home 작품 소개를 책 연출 대신 **Apple 홈페이지 제품 타일 방식**으로 교체 (`ProjectTiles`) — 2열, 연한 하늘색/검정 체크무늬, 분류 → 큰 이름 → 부제 → 버튼 2개 → 스크린샷. 전체 6개 노출. 책 파일(`FeaturedBook`, `public/book/`)은 확정 전까지 보관.
- v2.8 (2026-10-07): 첫 화면 버튼 제거, 문구를 "디자인을 코드로, 화면을 경험으로."로 확정(기술 이름 빼고 짧게). 헤더 로고 `YG`, 헤더 구분선 제거(검정 섹션에선 헤더도 검정). About 개편 — 사진 자리(4:5) + 소개 + 교육 과정(2026.04.16 ~ 2026.10.26) + 과정에서 배운 것 4묶음(`profile.learned`). index.html 글씨체 중복 로드 제거.
- v2.7 (2026-10-07): 글씨체 확정 — Pretendard Variable 웹폰트를 index.html에서 실제로 불러옴(이전엔 이름만 지정돼 설치 안 된 PC에선 맑은 고딕으로 보임). 본문 17px, 큰 제목 굵기 800→700, 제목 자간 토큰 추가. 첫 화면 Apple 제품 섹션 방식(가운데 정렬).
- v2.6 (2026-10-06): **방향 확정 + 디자인 동결.** Home 흐름을 인트로(첫 화면) → About → 작품 소개(검정 책) → 푸터(연락처)로 단순화. Skills·Contact 섹션 제거, 연락처는 푸터로 합침(이메일 크게 + 메일 보내기·GitHub). 인트로 영상·Skills·Vite 업그레이드는 "나중에 추가" 목록으로.
- v2.5 (2026-10-06): 대표 프로젝트 책을 **검정 섹션 + Firefly 실사 책 영상**으로 교체 — 스크롤 재생 오프닝(자동 이어 재생 포함) → 내용 순차 등장 → `react-pageflip` 종이 휨 넘김. 모바일은 영상 자동 재생 + 카드 목록. `$color-black`·`$color-book-paper` 토큰, `public/book/` 자산 추가.
- v2.4 (2026-10-02): 책 넘기기에 이전/다음 버튼·키보드(←/→) 추가, 실제 책 질감(하드커버·종이 결·책등 그림자·페이지 두께)을 CSS로 적용.
- v2.3 (2026-10-02): Home 대표 프로젝트를 **책 넘기기 연출**로 변경 — 스크롤에 맞춰 3D로 페이지가 넘어감(한 페이지 = 작품 하나). 모바일·동작 줄이기는 카드 목록 대체. `useMediaQuery` 훅, `BOOK_TEXT` 문구 추가. 대표 모션 규칙을 인트로 + 책 두 곳으로 수정.
- v2.2 (2026-10-02): 글자색을 Apple처럼 검정(`#1D1D1F`, 팔레트 예외)·흰색 두 가지로 통일. 하늘색 버튼 글자도 검정. 팔레트 색은 배경·카드·버튼·테두리 전용.
- v2.1 (2026-10-02): 헤더를 Apple 방식으로 — 항상 고정, 아래 섹션 배경(light/band/dark)에 맞춰 헤더 색이 바뀜. `useHeaderTheme` 훅, `data-header-theme` 속성 규칙, `$color-band-solid` 토큰 추가.
- v2.0 (2026-10-02): ~~프레임 레이아웃 추가 — 바깥 연분홍 액자(`$color-frame` #F0E3FD, 팔레트 예외) + 둥근 흰 판. 헤더를 fixed → 흰 판 안 sticky로 변경, 액자 틈을 덮는 고정 띠 추가. `frame-gap` 믹스인 추가.~~ → **시도 후 되돌림.** 액자 없이 흰 페이지가 화면 끝까지 차는 방식(Apple 실제 사이트와 동일) 유지.
- v1.9 (2026-10-02): **밝은 테마로 전환 (Apple 방식)** — 흰 페이지 + `#BDDDFC` 띠 + `#384959` 글자, 프로젝트 카드는 진한/연한 톤 번갈아. 흰 글자는 진한 카드·버튼 안에서만. 토큰 전면 교체(`$color-band`, `$color-panel*`, `$color-text-soft`, `$color-focus`), 믹스인 `button-primary`·`button-on-panel`·`band` 추가, `button-outline` 삭제. Home 섹션을 전체 너비 + `.inner` 구조로 변경.
- v1.8 (2026-10-02): 모든 글자색을 흰색으로 통일(`$color-text`), 호버는 포인트색 밑줄, 주요 버튼은 흰 글자 + 포인트색 테두리로 변경. `hover-underline`·`button-outline` 믹스인 추가. `$color-text-secondary`·`$color-on-point` 삭제.
- v1.7 (2026-10-01): 색 역할 재배치 — 글자는 흰색 유지, 포인트색은 채운 버튼·라벨·메뉴 표시 중심으로, 카드 배경에 `#6A89A7` 12%, 태그 배경 토큰 추가, 카드 위 포인트 글자 금지 규칙 추가. 본문 줄간격 1.7, `$text-max-width` 추가.
- v1.6 (2026-10-01): 뼈대 세팅 완료 — React Router 7, `@` 경로 별칭, 디자인 토큰(4-5 모서리·모션 추가), 공통 레이아웃·페이지 뼈대, `data/site.js`·`utils/getProjectImage.js` 추가, 데이터 계약에 `images` 필드 추가, 프로젝트 6개 데이터 입력. 구 `Portfolio.jsx`·`Portfolio.module.scss`·`public/magnifier.png` 삭제.
- v1.5 (2026-10-01): `docs/PROJECTS_CONTENT.md`(프로젝트 콘텐츠 정리본) 추가, 이미지 형식을 webp로 통일하고 스크린샷 규칙 추가. JAJAK·F1 콘텐츠 정리 완료.
- v1.4 (2026-10-01): F1 방명록·게시글 등록을 "F1 팬사이트"(`f1-fansite`) 하나로 통합 → 총 6개. Projects는 팀/개인 섹션 + 기술 분류 태그(`category`). 상세 페이지는 JAJAK·F1 2개만(`hasDetail`). GitHub 링크, 프로젝트별 담당 내용 반영. 데이터 계약에 `category`, `hasDetail` 추가, `links`를 배열로 변경.
- v1.3 (2026-10-01): Projects 페이지를 필터 대신 팀/개인 섹션 분리로 변경. 8번 프로젝트를 "BlueLine 야구용품 쇼핑몰"(`blueline`, Codex·README.md 활용 제작)로 정정.
- v1.2 (2026-10-01): 페이지 구성 확정 — Home(About·Skills·Contact는 섹션) / Projects / ProjectDetail / NotFound. 프로젝트 7개 목록과 대표 3개(JAJAK, F1 방명록, 벽돌깨기) 확정.
- v1.1 (2026-10-01): 색상 팔레트를 Ink wash(밝은 배경)에서 Stormy morning(다크 테마)으로 변경. 사이트 전체 어두운 배경 + 흰 글씨. 인트로 배경도 사이트 배경과 같은 `#384959`로 통일. `#6A89A7` 글자색 사용 금지 규칙 추가.
- v1.0 (2026-10-01): 전면 재시작. JAJAK AGENTS.md 형식 도입, 역할 전부 이영기. 토큰명을 `$color-*` 체계로 정리. React Router 기반 다중 페이지 구조로 전환. 인트로 영상은 새로 제작하기로 함(이전 VS Code 타이핑 영상 폐기, 재생 규칙만 유지). 인트로 방향은 어두운 배경 + 흰색 텍스트, 첫 방문 때만 재생으로 확정.
- 이전 버전 요약: VS Code 테마(폐기) → 흰 배경 2페이지 스크롤 구조 → 돋보기 효과(보류) → SCSS Modules + Ink wash → VS Code 타이핑 인트로 영상(폐기)