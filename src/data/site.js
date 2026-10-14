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

// 작품 소개 그룹 — 화면 가운데 큰 영문 제목 (화면 읽기에는 SECTION_TITLES의 한글 제목)
export const PROJECT_GROUP_WORD = {
  team: "TEAM",
  solo: "SOLO",
};

// 작품 소개 그룹 — 큰 영문 제목 아래 한 줄
export const PROJECT_GROUP_TEXT = {
  team: "여럿이 함께 만들고, 맡은 기능은 끝까지",
  solo: "기획부터 디자인 · 개발 · 배포까지 혼자서",
};

// 404 페이지 — 없는 주소 · 상세 페이지가 없는 작품
export const NOT_FOUND_TEXT = {
  code: "404",
  title: "페이지를 찾을 수 없어요",
  description: "주소가 바뀌었거나 없는 페이지예요.\n홈이나 작품 소개로 돌아갈 수 있어요.",
  home: "홈으로 가기",
  projects: "작품 소개 보기",
};

export const UI_TEXT = {
  viewDetail: "자세히 보기",
  teamSize: (n) => `${n}인 팀`,
  solo: "개인",
  myRole: "담당",
  projectNav: "작품 바로 가기",
  showMore: "더보기",
  showLess: "접기",
};

// About 숫자 칸 · 소제목
export const ABOUT_TEXT = {
  stats: {
    projects: "작품",
    team: "팀 프로젝트",
    months: "교육 과정",
  },
  unit: { count: "개", months: "개월" },
  learned: (school) => `${school}에서 배운 것`,
};

// 푸터 (연락처 겸용)
export const FOOTER_TEXT = {
  title: "Contact",
  message: "함께 일할 기회를 기다리고 있어요.",
  subMessage: "채용 · 협업 제안, 작품에 대한 질문 모두 편하게 연락 주세요.",
  emailLabel: "이메일",
  githubLabel: "GitHub",
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
  others: "다른 작품 보기",
  current: "지금 보는 작품",
};

// 사진 크게 보기 (상세 페이지 기능 사진)
export const LIGHTBOX_TEXT = {
  open: "크게 보기",
  close: "닫기",
  prev: "이전 사진",
  next: "다음 사진",
};