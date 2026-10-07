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

// 푸터 (연락처 겸용)
export const FOOTER_TEXT = {
  title: "Contact",
  message: "함께 일할 기회를 기다리고 있어요. 편하게 연락 주세요.",
  emailLabel: "이메일 보내기",
  githubLabel: "GitHub",
};