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
  cursorView: "VIEW", // 작품 사진 위 큰 원 커서 글자
  // 작품 소개 — "01 / 06" 번호 · 정보 줄 이름표
  projectCount: (n, total) => `${String(n).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
  stackLabel: "스택",
  site: "사이트",
};

// About 숫자 칸 · 소제목
export const ABOUT_TEXT = {
  stats: {
    team: "팀 프로젝트",
    solo: "개인 프로젝트",
    skills: "기술 분야",
    months: "교육 과정",
  },
  unit: { count: "개", months: "개월" },
  // 숫자 줄 오른쪽 — 누르면 이동
  cta: { team: "팀 작품 보기", solo: "개인 작품 보기", skills: "배운 기술 보기", profile: "자기소개 보기" },
  // 이름 장면 인사 — 두 줄이 타이핑되고, 이어서 YOUNG GI → "HELLO I'M YOUNG GI"
  introHello: {
    strong: "HELLO",
    light: "I'M",
    corners: { topRight: "FRONTEND DEVELOPER", bottomLeft: "PORTFOLIO · 2026" }, // 화면 모서리 작은 글자
  },
  skillsTitle: "배운 기술",
};

// 푸터 (연락처 겸용)
export const FOOTER_TEXT = {
  title: "Contact",
  message: "함께 일할 기회를 기다리고 있어요.",
  subMessage: "채용 · 협업 제안, 작품에 대한 질문 모두 편하게 연락 주세요.",
  emailLabel: "이메일",
  phoneLabel: "전화",
  githubLabel: "GitHub",
  resumeLabel: "이력서",
  resumeLink: "PDF 내려받기",
  copy: "복사",
  copied: "복사됨",
  toTop: "맨 위로",
  madeWith: "React · Vite로 직접 만들었어요",
};


// 첫 화면(Hero) — 스크롤하는 동안 lines[0] → lines[1]로 다시 타이핑됨
export const HERO_TEXT = {
  eyebrow: "FRONTEND DEVELOPER · LEE YOUNGGI",
  lines: ["디자인을 코드로", "화면을 경험으로"],
  skip: "작품 바로 보기", // 오른쪽 아래 — 연출을 건너뛰고 작품 소개로
};

// 프로젝트 상세 페이지 소제목
export const DETAIL_TEXT = {
  back: "작품 목록으로",
  role: "담당",
  stack: "기술",
  docs: "기획 문서",
  docsNote: "PDF 내려받기",
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
  // 검은 표지 · 왼쪽 고정 칸 · 오른쪽 부분 제목 (번호는 화면에서 붙임: "01 — FEATURE")
  scroll: "SCROLL ↓",
  toc: "이 작품 목차",
  eyebrow: { feature: "FEATURE", problem: "PROBLEM SOLVING", improvements: "NEXT STEP", others: "MORE PROJECTS" },
};

// 사진 크게 보기 (상세 페이지 기능 사진)
export const LIGHTBOX_TEXT = {
  open: "크게 보기",
  close: "닫기",
  prev: "이전 사진",
  next: "다음 사진",
};

// 챗봇 — 오른쪽 아래 YG 버튼 (답은 AI가 포트폴리오 내용만 보고 이영기 말투로)
export const CHAT_TEXT = {
  open: "영기에게 물어보기",
  close: "닫기",
  title: "영기에게 물어보세요",
  note: "AI가 이 포트폴리오 내용으로 저 대신 답해요. 정확한 이야기는 이메일로 주세요.",
  greeting: "안녕하세요, 프론트엔드 개발자 이영기예요. 작품이나 기술, 제가 맡은 일에 대해 편하게 물어보세요.",
  suggestions: ["어떤 프로젝트를 했나요?", "JAJAK에서 맡은 역할은?", "React는 어디까지 써 봤나요?"],
  placeholder: "궁금한 점을 적어 주세요",
  send: "보내기",
  thinking: "생각 중…",
  error: "지금은 답을 가져오지 못했어요. 잠시 후 다시 시도하거나 이메일로 물어봐 주세요.",
  tooMany: "질문이 많아 잠깐 쉬어 갈게요. 몇 분 뒤에 다시 물어봐 주세요.",
};