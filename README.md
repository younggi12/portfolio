# 이영기 포트폴리오

**디자인을 코드로, 화면을 경험으로.**
프론트엔드 개발자 이영기의 포트폴리오 사이트입니다. 팀 프로젝트 2개, 개인 프로젝트 4개를 소개합니다.

🔗 **https://younggi-portfolio.vercel.app**

## 볼거리
- **첫 화면** — Three.js로 만든 3D YG가 스크롤에 따라 채워지고, 다 채워지면 글자 속으로 들어가며 다음 장면으로
- **이름 소개** — HELLO I'M → YG → YOUNG GI가 저절로 이어지고, 휠 한 번에 커튼이 걷히며 교육 과정 · 소개 · 배운 기술
- **작품 소개** — 한 화면에 작품 하나, 마우스를 올리면 그 사이트 헤더 색의 기술 패널
- **작품 상세** — 표지 · 내가 만든 기능(사진 · 실제 코드) · 문제 해결 · 개선할 점
- 부드러운 휠 스크롤, 점 커서, 스크롤 등장 연출 / "동작 줄이기" 설정이면 연출 없이

## 기술 스택
React 18 · Vite 5 · React Router 7 · SCSS Modules · Three.js

## 실행
```bash
npm install
npm run dev      # 개발 서버
npm run build    # 배포용 빌드
```

## 내용 수정 위치
| 바꾸고 싶은 것 | 파일 |
| --- | --- |
| 이름 · 소개 · 사진 · 교육 과정 · 배운 기술 · 연락처 | `src/data/profile.js` |
| 작품 (목록 · 상세) | `src/data/projects.js` + 이미지 `src/assets/images/projects/` |
| 메뉴 · 제목 · 버튼 문구 | `src/data/site.js` |
| 색 · 글자 크기 · 간격 | `src/styles/_variables.scss` |

작업 규칙은 [`AGENTS.md`](./AGENTS.md), 작품 설명 원본은 [`docs/PROJECTS_CONTENT.md`](./docs/PROJECTS_CONTENT.md)에 있습니다.

## 배포
Vercel — `main` 브랜치에 push하면 자동 배포됩니다.