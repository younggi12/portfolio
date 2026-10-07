// 화면에 고정으로 들어가는 문구 (메뉴, 섹션 제목, 버튼 등)
import { SECTION_IDS } from "@/routes/paths";

export const NAV_ITEMS = [
  { label: "About", sectionId: SECTION_IDS.about },
  { label: "Projects", sectionId: SECTION_IDS.projects },
  { label: "Contact", sectionId: SECTION_IDS.contact },
];

export const SECTION_TITLES = {
  about: "About",
  projects: "Projects",
  contact: "Contact",
  team: "팀 프로젝트",
  solo: "개인 프로젝트",
};

export const UI_TEXT = {
  viewDetail: "자세히 보기",
  notFoundTitle: "페이지를 찾을 수 없어요",
  notFoundAction: "홈으로 가기",
  teamSize: (n) => `${n}인 팀`,
  solo: "개인",
  showMore: "더보기",
  showLess: "접기",
};

// About 숫자 칸 · 소제목
export const ABOUT_TEXT = {
  stats: {
    projects: "작품",
    team: "팀 프로젝트",
    solo: "개인 프로젝트",
    months: "교육 과정",
  },
  unit: { count: "개", months: "개월" },
  learned: "과정에서 배운 것",
};

// 푸터 (연락처 겸용)
export const FOOTER_TEXT = {
  title: "Contact",
  message: "함께 일할 기회를 기다리고 있어요.",
  subMessage: "채용 · 협업 제안, 작품에 대한 질문 모두 편하게 연락 주세요.",
  emailLabel: "이메일",
  githubLabel: "GitHub",
  sendMail: "이메일 보내기",
  copy: "복사",
  copied: "복사됨",
  toTop: "맨 위로",
  madeWith: "React · Vite로 직접 만들었어요",
};


// 첫 방문 인트로 — 한 줄 = 한 줄로 표시, 글자가 하나씩 서서히 나타남
export const INTRO_TEXT = {
  lines: ["디자인을 코드로", "화면을 경험으로"],
  skip: "건너뛰기",
};

// 프로젝트 상세 페이지 소제목
export const DETAIL_TEXT = {
  back: "작품 목록으로",
  period: "기간",
  role: "담당",
  stack: "기술",
  features: "내가 만든 기능",
  problem: "문제 해결",
  symptom: "증상",
  tries: "시도",
  cause: "원인",
  solution: "해결",
  lesson: "배운 점",
  improvements: "개선할 점",
};