# 포트폴리오 프로젝트 콘텐츠 정리

> 포트폴리오 사이트의 `src/data/projects.js`와 상세 페이지에 들어갈 내용 원본입니다.
> 사이트를 만들 때 이 문서를 보고 옮기면 됩니다.

진행 상황: ✅ JAJAK · ✅ F1 팬사이트 · ✅ 벽돌깨기 · ✅ 드로잉 앱 · ✅ BlueLine · ✅ 멍냥허브

---

## 1. JAJAK — 전통주 AI 큐레이션 쇼핑몰 ✅

### 카드
| 항목 | 내용 |
| --- | --- |
| projectId | `jajak` |
| 구분 | 팀 (5인) · React · 대표 ★ · 상세 페이지 O |
| 기간 | 2026.08 ~ 2026.09 |
| 한 줄 소개 | 취향 설문을 바탕으로 AI가 전통주와 어울리는 안주·술잔을 한 상으로 추천해 주는 쇼핑몰 |
| 담당 | 회원 인증, 고객센터(공지사항·FAQ·1:1 문의), 위시리스트, 통합 단계 AI 큐레이션 UI·모바일 반응형 보완 |
| 기술 | React 19, Vite, Firebase Auth, Firestore, SCSS Modules |
| 링크 | 사이트 https://jajak-ten.vercel.app / GitHub https://github.com/jiwoo1012/TeamProject2 |
| 썸네일 | `jajak-thumb.webp` |

**핵심 구현 (카드용 3줄)**
1. Firebase Authentication으로 회원가입·로그인·로그아웃, 로그인 상태 유지, 정지 계정 차단까지 인증 흐름 전체 구현
2. 회원가입 성공 모달이 뜨지 않던 문제를 추적해 Firestore 보안 규칙 권한 문제임을 찾아내고 팀과 협의해 해결
3. 회원/비회원을 구분한 1:1 문의(Firestore 저장, 답변 상태 확인)와 찜 목록(조회·필터·삭제·장바구니 연동) 구현

### 상세 페이지

**기획 배경**
2030세대는 혼술·홈술처럼 자기 취향에 맞춰 술을 즐기는 쪽으로 바뀌고 있고 전통주 구매도 늘고 있지만,
전통주는 종류가 많고 맛·도수를 예상하기 어려워 입문자가 고르기 힘들다.
JAJAK은 평소 취향과 그날의 상황을 함께 반영해 AI가 전통주를 고르고, 어울리는 안주와 술잔까지 한 상(주안상)으로 추천한다.

**서비스 흐름**: 상품 탐색 → AI 추천 → 상품 확인 → 찜·장바구니 → 마이페이지에서 추천 기록 확인

**팀 구성** (이름 없이 역할만 표기)
공통 구조·AI 큐레이션 / 상품·이벤트 / 메인·브랜드 / 장바구니·주문·마이페이지 / **회원 인증·고객센터·위시리스트(본인)**

**내가 만든 기능**
- 회원 인증 (8/21~8/26): 로그인·회원가입·로그아웃, 비밀번호 보기 토글, 로그인 상태 유지, 정지 계정 차단, 가입 성공 모달
  - 이미지: `jajak-login.webp`, `jajak-signup.webp`, `jajak-signup-modal.webp`
- 고객센터 (9/2~9/4): 공지사항 목록·상세·카테고리·검색, FAQ, 1:1 문의
  - 1:1 문의: 회원/비회원 분기, 비회원 이메일·회원 연락처 필수 검증, Firestore 저장, 중복 제출 방지, 내 문의 내역(답변 상태·답변 확인), 접수 완료 모달
  - 첨부 파일은 선택 UI만 있음(업로드 미구현) → "파일 첨부"는 쓰지 않기
  - 이미지: `jajak-notices.webp`, `jajak-faq.webp`, `jajak-inquiry-choice.webp`, `jajak-inquiry-form.webp`, `jajak-mypage-inquiries.webp`
- 위시리스트 (8/26): Firestore 찜 목록 조회, 상품 ID만 저장하고 상품 정보는 상품 데이터에서 합쳐 표시, 카테고리 필터, 최신순 정렬, 8개씩 페이지네이션, 찜 삭제, 장바구니 담기(중복 시 수량 +1)
  - 이미지: `jajak-wishlist.webp`
- 통합 단계 지원 (9/10~9/11): AI 큐레이터 설문 아이콘·로딩 영상·결과 문구, AI 설문·상품 상세 모바일 스타일, 마이페이지 비회원 안내

**문제 해결**
1. 회원가입 모달이 안 뜨던 문제 (메인 이야기)
   - 증상: 계정은 생성되는데 성공 모달이 안 뜸
   - 처음 의심: 자동 로그인 때문에 모달보다 페이지 이동이 먼저 실행되는 타이밍 문제 → `useRef` 플래그로 수정했지만 그대로. 네트워크 탭에서 요청이 두 번씩 나가는 걸 보고 중복 제출도 막았지만 그대로
   - 진짜 원인: `console.error`로 실제 에러를 보니 `permission-denied`. 회원 정보 저장(`users/{uid}`)이 전체 차단 상태의 Firestore 보안 규칙에 막힘
   - 해결: 보안 규칙은 팀장 담당 파일이라 직접 고치지 않고, 원인과 필요한 권한을 정리해 요청 → 수정 후 정상 동작 확인
   - 배운 점: 증상만 보고 추측하지 말고 실제 에러 로그부터 확인하기
2. 아직 없는 팀원 코드에 의존해야 했던 문제
   - 로그아웃 시 장바구니를 비워야 했는데 담당 팀원의 `cartStorage.js`가 아직 빈 파일이라 import 시 에러
   - 동적 import + try/catch로 감싸, 완성 전엔 조용히 넘어가고 완성되면 자동으로 동작하도록 처리
3. 와이어프레임과 픽셀 단위로 맞추기
   - Figma가 PC 기준(1440px)보다 약 1.2배 크게 그려진 걸 파악하고, 그 비율로 글자 크기를 환산해 다시 맞춤
   - 공통 리셋 CSS 때문에 체크박스가 안 보였는데, 공통 파일은 건드리지 않고 내 모듈 안에서 커스텀 체크박스로 해결

**협업 방식**
- AGENTS.md v1.5: 담당 영역, 공통 파일 보호, 데이터 구조, Git 브랜치 흐름(`feature/younggi` → `dev` → `main`)을 정한 팀 규칙 문서. 사람과 AI(Codex) 모두 이 문서 기준으로 작업
- 디자인 인수인계 문서로 디자인 토큰·반응형 기준·시맨틱 태그 규칙을 코딩 전에 통일
- 유스케이스 다이어그램으로 비회원/회원/신규 회원 흐름을 먼저 정의

**개선할 점 (솔직하게)**
- 문의 내역을 `inquiries` 전체를 받아온 뒤 화면에서 내 것만 걸러냄 → 다른 사람 문의(비회원 이메일·연락처 포함)가 브라우저로 내려옴.
  `where('userId', '==', uid)` 쿼리 + 보안 규칙으로 본인 문의만 읽게 하는 것이 정석
- 찜 목록 가격이 할인 전 가격으로 표시됨: `salePrice`를 찾지만 데이터에는 `discountRate`만 있음 → 할인율로 계산하도록 수정 필요
- 마이페이지 문의 내역에 카테고리 코드값(`order_payment`)이 그대로 노출 → 한글 라벨 표를 공통 상수로 분리해 재사용

**배운 점**
- 추측보다 실제 에러 로그부터 확인하기
- 내 담당이 아닌 코드는 고치지 않고 근거를 들어 요청하기

---

## 2. F1 팬사이트 — 방명록 ✅

> 자세한 내용은 guestbook01 저장소 README에 정리 완료. 포트폴리오에는 요약만 옮기면 됨.

### 카드
| 항목 | 내용 |
| --- | --- |
| projectId | `f1-fansite` |
| 구분 | 개인 · React · 대표 ★ · 상세 페이지 O |
| 기간 | 2026.07 |
| 한 줄 소개 | 응원할 F1 드라이버를 골라 메시지를 남기는 방명록 사이트 |
| 담당 | 기획·디자인·개발 전체 |
| 기술 | React 19, Vite, React Router, Zustand, Firebase Auth, Firestore, SCSS Modules |
| 링크 | 방명록 https://guestbook01-phi.vercel.app (GitHub younggi12/guestbook01) / 게시글(학습 버전) https://re008-tzii.vercel.app (GitHub younggi12/re008) |
| 이미지 | guestbook01 저장소 `docs/images/` — main.png, guestbook-form.png, guestbook-list.png |

**핵심 구현 (카드용 3줄)**
1. 작성자 uid 기준으로 본인 글만 수정·삭제 — 화면에서 버튼을 숨기고 Firestore 보안 규칙에서도 한 번 더 차단
2. Firestore 실시간 구독으로 새 응원이 새로고침 없이 반영, 팀별 필터·페이지네이션
3. IntersectionObserver + callback ref 커스텀 훅으로 스크롤 등장 애니메이션

### 상세 페이지 중심 이야기
학습용으로 만든 게시글 등록(CRUD, 디자인 없음) → 디자인과 기능을 얹어 방명록으로 완성한 **성장 과정**

---

## 3. SPACE BREAKER — 캔버스 벽돌깨기 ✅

### 카드
| 항목 | 내용 |
| --- | --- |
| projectId | `canvas-breaker` |
| 구분 | 개인 · Canvas · 대표 ★ · 상세 페이지 X |
| 기간 | 2026.06 |
| 한 줄 소개 | Canvas API와 requestAnimationFrame으로 만든 우주 테마 벽돌깨기 게임 |
| 담당 | 기획·디자인·개발 전체 |
| 기술 | HTML5 Canvas, JavaScript, CSS |
| 링크 | 플레이 https://younggi12.github.io/breaker/js061201.html / 코드 https://github.com/younggi12/breaker/blob/main/js061201.html |
| 썸네일 | `breaker-thumb.webp` |
| 이미지 | `breaker-start.webp`, `breaker-play.webp`, `breaker-clear.webp`, `breaker-fail.webp` |

**핵심 구현 (카드용 3줄)**
1. `requestAnimationFrame` 게임 루프로 그리기 → 이동 → 충돌 검사를 매 프레임 처리, 점수·목숨 3개·서브 대기 구현
2. 패들에 맞은 위치에 따라 반사 각도를 최대 60°까지 바꾸고 공의 빠르기는 유지 (`sin`/`cos`로 속도 분해)
3. 캔버스 실제 크기와 CSS 표시 크기가 달라 패들이 마우스와 어긋나던 문제를 좌표 비율 보정으로 해결

### 개선 기록 (2026-10-01)
처음 수업 실습으로 만든 버전을 포트폴리오용으로 다시 다듬음.
- 추가: 점수(벽돌당 10점), 목숨 3개, 공을 놓친 뒤 약 1초 서브 대기(READY), 패들 위치별 반사 각도, 결과 화면에 최종 점수
- 버그 수정
  - 패들이 마우스와 어긋남 → `(e.clientX - rect.left) * (canvas.width / rect.width)`로 좌표 보정
  - 클리어 화면에 마지막 벽돌이 남아 보임 → 결과 오버레이 전에 화면을 다시 그림
  - 공이 패들 안에서 떨리며 붙음 → 내려오는 공만 패들 판정
  - 두 벽돌에 동시에 닿으면 뚫고 지나감 → 한 프레임에 벽돌 하나만 처리
  - 벽에 걸쳐 방향이 계속 뒤집힘 → 벽 안쪽으로 위치 보정
  - 재시작 시 애니메이션 중복 실행 가능 → `cancelAnimationFrame`으로 정리
- 조정값: `BALL_SPEED`(5.5), `MAX_BOUNCE_ANGLE`(60)

### 남은 선택 과제
- [ ] 레벨업 시 속도 증가
- [ ] 모바일 터치 조작

---

## 4. 캔버스 드로잉 앱 ✅

### 카드
| 항목 | 내용 |
| --- | --- |
| projectId | `canvas-draw` |
| 구분 | 개인 · Canvas · 상세 페이지 X |
| 기간 | 2026.06 |
| 한 줄 소개 | 펜 색·굵기·배경색을 바꿔 그리고 PNG로 저장할 수 있는 드로잉 앱 |
| 담당 | 기획·디자인·개발 전체 |
| 기술 | HTML5 Canvas, JavaScript, Pointer Events |
| 링크 | 사용해보기 https://younggi12.github.io/draw-app/js060901.html / 코드 https://github.com/younggi12/draw-app |
| 썸네일 | `draw-thumb.webp` |
| 이미지 | `draw-main.webp` |

**핵심 구현 (카드용 3줄)**
1. Pointer Events로 마우스·터치·펜 입력을 하나로 처리, 캔버스 밖으로 나가도 획이 끊기지 않게 포인터 캡처
2. 되돌리기(버튼·Ctrl+Z, 최근 20단계) — 획을 그리기 직전의 화면을 `getImageData`로 저장
3. 배경색은 CSS로만 칠해져 있어 저장 시 임시 캔버스에 배경을 먼저 칠하고 그림을 합쳐 PNG로 다운로드

### 개선 기록 (2026-10-01)
- 버그 수정
  - 기본 배경값(검정)과 화면(흰색)이 달라 기본 펜으로 그린 그림이 다운로드 시 보이지 않음 → 기본 배경을 흰색으로 통일
  - 캔버스 크기가 페이지 열 때 한 번만 정해져, 창 크기가 바뀌면 아래쪽이 그려지지 않음 → `resize` 시 그림을 보존한 채 크기 재조정 (크기 변경 시 초기화되는 펜 색도 다시 적용)
  - 스크롤·위치 변화 시 펜과 선이 어긋날 수 있음 → `getBoundingClientRect` 기준 좌표 변환
- 추가: 터치·펜 지원, 되돌리기, 클릭만으로 점 찍기, 좁은 화면 툴바 줄바꿈

---

## 5. BlueLine 야구용품 쇼핑몰 ✅

### 카드
| 항목 | 내용 |
| --- | --- |
| projectId | `blueline` |
| 구분 | 개인 · Vanilla JS · 상세 페이지 X |
| 기간 | 2026.09 `[확인 필요]` |
| 한 줄 소개 | 프레임워크 없이 바닐라 HTML/CSS/JS로 만든 5페이지 야구용품 쇼핑몰 |
| 담당 | 기획·디자인·개발 전체 (초기 일부 Codex 활용, 이후 기능·디자인 직접 구현) |
| 기술 | HTML5, CSS3(Grid·Flexbox·CSS 변수), JavaScript(ES6+), localStorage, IntersectionObserver |
| 링크 | 사이트 https://younggi12.github.io/-4/index.html / GitHub https://github.com/younggi12/-4 |
| 썸네일 | `blueline-thumb.webp` |
| 이미지 | `blueline-main.webp` |

**핵심 구현 (카드용 3줄)**
1. JSON 상품 데이터를 `fetch`로 불러와 카테고리 필터, 상품 상세(옵션 칩·수량·같은 브랜드 관련 상품) 구성
2. `localStorage` 장바구니 — 새로고침해도 유지, 배송비 자동 계산(2만 원 이상 무료), 담기 피드백과 커스텀 모달
3. `IntersectionObserver` 스크롤 등장 효과, 무한 루프 캐러셀, `sessionStorage`로 인트로 1회만 재생, 이미지 최대 90% 압축

**페이지 구성**: 메인 / 상점(카테고리) / 상품 상세(`product.html?id=`) / 장바구니 / 오시는 길(카카오맵, 미설정 시 OpenStreetMap 대체) / 404

### 고칠 것
- [x] 배너 "전 상품 무료배송" 문구와 실제 배송비 규칙(2만 원 이상 무료) 불일치 — 확인함
- [x] 배너·상자 이미지 속 깨진 영어(AI 이미지) — 확인함
- [ ] 인트로 이미지 문구 "Good Drinks Better Days" → "Good Gear Better Days"로 교체 (이미지 재제작)
- [ ] (선택) 저장소 이름 `-4` → `blueline` 변경. 단, GitHub Pages 주소도 바뀌므로 변경 후 포트폴리오 링크 수정 필요

---

## 6. 멍냥허브 — 반려동물 용품 쇼핑몰 ✅

### 카드
| 항목 | 내용 |
| --- | --- |
| projectId | `mungnyang-hub` |
| 구분 | 팀 (3인, 팀명 "깃허브 망령들") · Vanilla JS · 상세 페이지 X |
| 기간 | 2026.06 ~ 2026.07 |
| 한 줄 소개 | 반려동물 용품을 둘러보고 장바구니에 담을 수 있는 쇼핑몰 팀 프로젝트 |
| 담당 | 브랜드·고객센터·장바구니 페이지, 상품 목록(카테고리 필터·옵션 가격·장바구니 모달), 로그인 상태 헤더, 메인 슬라이드·리뷰, 모바일 반응형 |
| 기술 | HTML, CSS, JavaScript, JSON, localStorage/sessionStorage, 외부 API(random.dog) |
| 링크 | 사이트 https://projectmangryung.github.io/teamproject/ / GitHub https://github.com/projectMangRyung/teamproject |
| 썸네일 | `mungnyang-thumb.webp` |
| 이미지 | `mungnyang-brand.webp`, `mungnyang-brand-story.webp`, `mungnyang-review.webp`, `mungnyang-product.webp`, `mungnyang-option.webp`, `mungnyang-cart-modal.webp` |

**핵심 구현 (카드용 3줄)**
1. 상품 목록 카테고리 필터와 옵션별 가격 계산, 장바구니 담기 모달(컨페티 애니메이션)·주문 확인 모달
2. localStorage/sessionStorage로 로그인 상태를 유지하고 모든 페이지 헤더에 로그인/로그아웃 반영
3. 헤더 애니메이션의 `transform`이 남아 모바일 메뉴(`position: fixed`)가 사라지던 버그의 원인을 찾아 수정

### 커밋으로 확인한 작업 (6/15 ~ 7/6)
- 6/15 메인 구조 작성 / 6/17 상품 JSON 가격 형식·이미지 경로, HTML·CSS 문법 오류 수정
- 6/19~23 메인 리뷰 디자인, 브랜드 섹션 문구·이미지, 상품 데이터 추가·정리
- 6/25~26 브랜드 페이지, 고객센터 페이지, 장바구니 페이지
- 6/29~30 카테고리 필터 + JSON 정리, 장바구니 모달(컨페티), 주문 확인 모달, TOP 버튼
- 7/1~3 모바일 반응형, 메인 슬라이드, 인기상품 장바구니, 옵션 가격 반영, 로그인/로그아웃 헤더 반영, 모바일 메뉴 transform 버그 수정
- 7/6 리뷰 슬라이더 드래그를 document 위임으로 개선(터치 스크롤 충돌 방지), 랜덤 강아지 이미지 API를 random.dog로 교체 + 재시도 로직
- 협업: 개인 브랜치(`younggi12`)에서 작업 후 main 병합, 충돌 해결 다수

### 면접 포인트
- **모바일 메뉴 미노출 버그**: 애니메이션이 끝난 뒤에도 헤더에 `transform`이 남아 있으면 그 안의 `position: fixed` 요소가 화면이 아니라 헤더를 기준으로 배치됨 → 모바일 로그인·장바구니 메뉴가 엉뚱한 곳에 그려져 안 보였음. 애니메이션 종료 후 `transform`을 제거해 해결
- **리뷰 슬라이더 드래그**: 마우스가 슬라이더 밖으로 나가면 드래그가 끊기던 것을 `mousemove`/`mouseup`을 `document`에서 받도록 바꿔 해결, 모바일에서는 터치 드래그와 페이지 스크롤 충돌 방지 (드로잉 앱의 포인터 캡처와 같은 고민)
- **Git 협업의 시작점**: 첫 팀 프로젝트에서 잦은 병합과 충돌을 직접 해결 → 이후 JAJAK에서 브랜치 규칙(AGENTS.md) 기반 협업으로 발전

---

## 7. 남은 작업

- 프로젝트 6개 콘텐츠 정리 완료 ✅
- [ ] (선택) 멍냥허브 메인 헤더 위에 "장바구니" 글자 4개가 겹쳐 보이는 표시 오류 — 팀 저장소라 팀원과 상의 후 수정
