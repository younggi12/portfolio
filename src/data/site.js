// 화면에 고정으로 들어가는 문구 (메뉴, 섹션 제목, 버튼 등)
import { SECTION_IDS } from "@/routes/paths";

export const NAV_ITEMS = [
  { label: "About", sectionId: SECTION_IDS.about },
  { label: "Projects", sectionId: SECTION_IDS.projects },
  { label: "Contact", sectionId: SECTION_IDS.contact },
];

export const SECTION_TITLES = {
  about: "About",
  featured: "Featured Projects",
  skills: "Skills",
  contact: "Contact",
  allProjects: "Projects",
  team: "팀 프로젝트",
  solo: "개인 프로젝트",
};

export const UI_TEXT = {
  viewAllProjects: "전체 프로젝트 보기",
  viewDetail: "자세히 보기",
  backToProjects: "프로젝트 목록으로",
  notFoundTitle: "페이지를 찾을 수 없어요",
  notFoundAction: "홈으로 가기",
  teamSize: (n) => `${n}인 팀`,
  solo: "개인",
};

// 대표 프로젝트 책 연출 (Home Featured 섹션)
export const BOOK_TEXT = {
  coverLabel: "Featured Projects",
  coverTitle: "대표 작품",
  coverDesc: "직접 만들고 고민한 작품들을 한 장씩 넘겨보세요.",
  scrollHint: "스크롤하거나 버튼으로 넘기기",
  outroTitle: "더 많은 작품이 있어요",
  outroDesc: "팀 프로젝트와 개인 프로젝트를 모두 볼 수 있어요.",
  endMark: "Thank you for reading",
  prev: "이전 페이지",
  next: "다음 페이지",
};

// 푸터 (연락처 겸용)
export const FOOTER_TEXT = {
  title: "Contact",
  message: "함께 일할 기회를 기다리고 있어요. 편하게 연락 주세요.",
  emailLabel: "이메일 보내기",
  githubLabel: "GitHub",
};

// 첫 화면 (Apple 제품 소개 섹션 방식: 큰 제목 → 한 줄 소개 → 버튼 2개)
export const HERO_TEXT = {
  primary: "작품 보기",
  secondary: "연락하기",
};
