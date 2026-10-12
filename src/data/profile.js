export const PROFILE = {
  name: "이영기",
  nameEn: "Lee Younggi",
  logo: "YG",           // 헤더 로고 (이니셜)
  role: "Frontend Developer", // About 이름 위 작은 글씨
  // About 사진 — public/images/에 파일을 넣고 이름만 적으면 표시됨 (예: "profile.webp"). 비어 있으면 진한 칸에 이니셜 YG
  photo: "",
  // About 자기소개 — 문장 속 \n 위치에서 줄바꿈
  intro: [
    "사용자가 직접 보고 만지는 화면을\n만드는 프론트엔드 개발자입니다.",
    "디자인을 코드로 정확하게 옮기고, PC와 모바일 어디서든 쓰기 편한 화면을 만드는 것을\n가장 중요하게 생각합니다.",
    "읽기 쉬운 코드와 분명한 규칙으로 동료와 함께 일하고, 문제가 생기면 추측하지 않고\n원인을 끝까지 찾아 해결합니다.",
  ],
  // 교육 과정
  education: {
    school: "이젠컴퓨터아카데미",          // "과정에서 배운 것" 제목: "○○에서 배운 것"
    course: "웹/프론트엔드 개발자 과정",
    period: "2026.04.16 - 2026.10.26",
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
        { label: "반응형 레이아웃", icon: "responsive" },
        { label: "jQuery", icon: "jquery" },
      ],
    },
    {
      title: "JavaScript",
      items: [
        { label: "JavaScript (ES6+)", icon: "javascript" },
        { label: "Canvas API", icon: "canvas" },
        { label: "IntersectionObserver", icon: "observer" },
        { label: "Pointer Events", icon: "pointer" },
        { label: "fetch", icon: "api" },
        { label: "JSON", icon: "json" },
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
        { label: "localStorage", icon: "storage" },
        { label: "sessionStorage", icon: "storage" },
        { label: "Node.js · Express 기초", icon: "node" },
        { label: "MySQL 기초", icon: "mysql" },
      ],
    },
    {
      title: "협업 · 도구",
      items: [
        { label: "Git", icon: "git" },
        { label: "GitHub", icon: "github" },
        { label: "Vite", icon: "vite" },
        { label: "Vercel", icon: "vercel" },
        { label: "Figma 기초", icon: "figma" },
        { label: "AI 협업 규칙 문서", icon: "document" },
      ],
    },
  ],
  email: "oosc76@naver.com",
  github: "https://github.com/younggi12",
};