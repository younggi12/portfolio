# 이영기 포트폴리오

인터랙션으로 사용 경험을 만드는 프론트엔드 개발자 이영기의 포트폴리오 사이트입니다.

- 규칙 문서: [`AGENTS.md`](./AGENTS.md) — 작업 전에 먼저 읽습니다
- 프로젝트 콘텐츠 원본: [`docs/PROJECTS_CONTENT.md`](./docs/PROJECTS_CONTENT.md)

## 기술 스택
React 18 · Vite 5 · React Router 7 · SCSS Modules

## 실행

```bash
npm install
npm run dev
```

## 내용 수정 위치

| 바꾸고 싶은 것 | 파일 |
| --- | --- |
| 이름, 소개, 연락처 | `src/data/profile.js` |
| 프로젝트 | `src/data/projects.js` (+ 이미지는 `src/assets/images/projects/`) |
| 스킬 | `src/data/skills.js` |
| 메뉴, 섹션 제목, 버튼 문구 | `src/data/site.js` |
| 색상, 글자 크기, 간격 | `src/styles/_variables.scss` |

## 배포
Vercel — `main` 브랜치에 push하면 자동 배포됩니다. 새로고침 404 방지를 위해 `vercel.json`에 rewrites가 설정되어 있습니다.
