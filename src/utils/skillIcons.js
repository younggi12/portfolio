// 기술 아이콘 — profile.js의 learned[].items[].icon 키와 짝
// - 브랜드 아이콘: simple-icons (채운 모양, path만 씀)
// - 개념 아이콘: lucide-react (선 모양 컴포넌트) — 브랜드가 없는 항목 (Canvas, 반응형, 컴포넌트 등)
// 둘 다 쓰는 것만 import → 빌드에 필요한 아이콘만 포함
import {
  siHtml5, siCss, siSass, siJavascript, siJquery,
  siReact, siReactrouter, siFirebase, siNodedotjs,
  siGit, siGithub, siVite, siVercel, siFigma,
} from "simple-icons";
import {
  Brush, MonitorSmartphone, Blocks, Webhook, Box,
  Database, ArrowRightLeft, FileText,
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
};