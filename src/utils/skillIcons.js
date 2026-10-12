// 기술 아이콘 — profile.js의 learned[].items[].icon 키와 짝
// - 브랜드 아이콘: simple-icons (채운 모양, path만 씀)
// - 개념 아이콘: lucide-react (선 모양 컴포넌트) — 브랜드가 없는 항목 (Canvas, 반응형, 컴포넌트 등)
// 둘 다 쓰는 것만 import → 빌드에 필요한 아이콘만 포함
import {
  siHtml5, siCss, siSass, siJavascript, siJquery,
  siReact, siReactrouter, siFirebase, siNodedotjs, siMysql,
  siGit, siGithub, siVite, siVercel, siFigma,
} from "simple-icons";
import {
  Brush, MonitorSmartphone, Blocks, Webhook, Box,
  Database, ArrowRightLeft, FileText,
  Braces, HardDrive, ScanEye, MousePointerClick,
} from "lucide-react";

export const SKILL_ICONS = {
  // 브랜드
  html5: siHtml5,
  css: siCss,
  sass: siSass,
  javascript: siJavascript,
  jquery: siJquery,
  react: siReact,
  reactRouter: siReactrouter,
  firebase: siFirebase,
  node: siNodedotjs,
  mysql: siMysql,
  git: siGit,
  github: siGithub,
  vite: siVite,
  vercel: siVercel,
  figma: siFigma,
  // 개념
  canvas: Brush,
  responsive: MonitorSmartphone,
  component: Blocks,
  hook: Webhook,
  store: Box,
  database: Database,
  api: ArrowRightLeft,
  document: FileText,
  json: Braces,
  storage: HardDrive,
  observer: ScanEye,
  pointer: MousePointerClick,
};

// 상세 페이지 "기술" 칸 — projects.js의 stack 글자 → 아이콘 키 (없는 기술은 글자만)
const STACK_ICON_KEYS = {
  "React 19": "react",
  "React Router": "reactRouter",
  Vite: "vite",
  Zustand: "store",
  "Firebase Auth": "firebase",
  Firestore: "database",
  "SCSS Modules": "sass",
  HTML: "html5",
  HTML5: "html5",
  CSS: "css",
  CSS3: "css",
  JavaScript: "javascript",
  JSON: "json",
  localStorage: "storage",
  IntersectionObserver: "observer",
  "HTML5 Canvas": "canvas",
  "Pointer Events": "pointer",
};

export const getStackIcon = (label) => STACK_ICON_KEYS[label] ?? null;