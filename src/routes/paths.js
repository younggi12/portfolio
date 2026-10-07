// URL은 여기서만 정의 — 컴포넌트에서 문자열 하드코딩 금지 (AGENTS.md 5장)
export const PATHS = {
  home: "/",
  projectDetail: "/projects/:projectId",
  notFound: "*",
};

export const toProjectDetail = (projectId) => `/projects/${projectId}`;

// Home 안의 섹션 id (헤더 메뉴 스크롤 대상)
export const SECTION_IDS = {
  about: "about",
  projects: "projects",
  contact: "contact",
};
