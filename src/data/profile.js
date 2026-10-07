export const PROFILE = {
  name: "이영기",
  nameEn: "Lee Younggi",
  logo: "YG",           // 헤더 로고 (이니셜)
  role: "Frontend Developer",
  // 첫 화면 (Apple 방식: 위 "Frontend Developer" 라벨과 겹치지 않게 짧게)
  tagline: "디자인을 코드로, 화면을 경험으로.",
  description: "쓰기 편한 웹을 만들고, 문제는 원인까지 추적해 해결합니다.",
  // About 사진 — public/images/에 파일을 넣고 이름만 적으면 표시됨 (예: "profile.webp"). 비어 있으면 빈 자리 표시
  photo: "",
  // About 자기소개
  intro: [
    "디자인을 코드로 정확하게 옮기고, 사용자가 헤매지 않는 화면을 만드는 프론트엔드 개발자입니다.",
    "팀 프로젝트에서는 Git/GitHub로 작업을 나누고 팀 규칙 문서(AGENTS.md)를 만들어 사람과 AI가 같은 기준으로 코드를 쓰도록 했습니다. 문제가 생기면 추측으로 고치기보다 원인을 끝까지 추적해 근거와 함께 공유합니다.",
  ],
  // 교육 과정
  education: {
    name: "이젠컴퓨터아카데미 안산 · 웹/프론트엔드 개발자 과정",
    period: "2026.04.16 ~ 2026.10.26",
    months: 6,          // About 숫자 칸에 표시
  },
  // 과정에서 배운 것 (실제로 프로젝트에 써 본 것 위주)
  // icon: utils/skillIcons.js의 키
  learned: [
    {
      title: "화면 구현",
      items: [
        { label: "HTML5", icon: "html5" },
        { label: "CSS3", icon: "css" },
        { label: "SCSS", icon: "sass" },
        { label: "JavaScript (ES6+)", icon: "javascript" },
        { label: "jQuery", icon: "jquery" },
        { label: "Canvas API", icon: "canvas" },
        { label: "반응형 레이아웃", icon: "responsive" },
      ],
    },
    {
      title: "React",
      items: [
        { label: "React", icon: "react" },
        { label: "React Router", icon: "reactRouter" },
        { label: "컴포넌트 설계", icon: "component" },
        { label: "커스텀 훅", icon: "hook" },
        { label: "Zustand", icon: "store" },
      ],
    },
    {
      title: "데이터 · 서버",
      items: [
        { label: "Firebase Auth", icon: "firebase" },
        { label: "Firestore · 보안 규칙", icon: "database" },
        { label: "REST API 연동", icon: "api" },
        { label: "Node.js · Express · MySQL 기초", icon: "node" },
      ],
    },
    {
      title: "협업 · 도구",
      items: [
        { label: "Git", icon: "git" },
        { label: "GitHub", icon: "github" },
        { label: "Vite", icon: "vite" },
        { label: "Vercel", icon: "vercel" },
        { label: "Figma", icon: "figma" },
        { label: "AI 협업 규칙 문서", icon: "document" },
      ],
    },
  ],
  email: "oosc76@naver.com",
  github: "https://github.com/younggi12",
};