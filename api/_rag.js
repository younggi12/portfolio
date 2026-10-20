// 키워드 RAG — 수업 방식(guide/route.ts의 searchGuide)과 같은 흐름
//   1) guide.txt를 "[00. 단원]" 단위로 나눔
//   2) 각 단원의 대표 명칭 · 관련 표현을 꺼냄
//   3) 질문과 표현을 둘 다 소문자 · 띄어쓰기 없이 바꿔 비교 → 질문에 들어 있는 표현 길이만큼 점수
//   4) 점수 높은 단원 최대 3개 + [00] 공통 원칙 (하나도 못 찾으면 자기소개 · 작품 목록)
import { readFileSync } from "node:fs";
import { join } from "node:path";

const GUIDE_PATH = join(process.cwd(), "api", "guide.txt"); // 배포에서도 같이 올라가게 vercel.json includeFiles
const TOP_K = 3;
const COMMON_RULE = "[00. 챗봇 공통 답변 원칙]";
const FALLBACK = ["자기소개", "작품 목록"]; // 아무 단원도 못 찾았을 때 대신 보낼 단원(대표 명칭)

// 대소문자 · 띄어쓰기 차이 없애기 ("AI 퀴즈" = "ai퀴즈")
const normalize = (text) => text.toLowerCase().replace(/\s+/g, "");

let cache = null;
const loadGuide = () => {
  if (cache) return cache;
  const guideText = readFileSync(GUIDE_PATH, "utf8");
  // "[01. 자기소개]" 앞에서 자르기 (단원 제목 앞 ==== 줄은 지움)
  const sections = guideText
    .split(/(?=\[\d{2}\.\s)/)
    .filter((item) => /^\[\d{2}\.\s/.test(item))
    .map((item) => item.replace(/\n=+\s*$/g, "").replace(/^(\[[^\]]+\])\n=+\n/, "$1\n").trim());

  const commonRule = sections.find((item) => item.startsWith(COMMON_RULE)) ?? "";
  const units = sections
    .filter((item) => !item.startsWith(COMMON_RULE))
    .map((text) => {
      const title = text.match(/대표\s*명칭:\s*(.+)/)?.[1]?.trim() ?? "";
      const keywords = (text.match(/관련\s*표현:\s*(.+)/)?.[1] ?? "").split(",");
      const words = [title, ...keywords].map((w) => normalize(w.trim())).filter(Boolean);
      return { title, text, words };
    });
  cache = { commonRule, units };
  return cache;
};

// 질문 → { commonRule, picked: [{ title, text, score }] }
export const searchGuide = (question) => {
  const { commonRule, units } = loadGuide();
  const useQuestion = normalize(question);

  const results = [];
  for (const unit of units) {
    let score = 0;
    for (const word of new Set(unit.words)) {
      if (useQuestion.includes(word)) score += word.length; // 길게 겹칠수록 더 관련 있음
    }
    if (score > 0) results.push({ title: unit.title, text: unit.text, score });
  }
  results.sort((a, b) => b.score - a.score);

  const picked = results.length > 0
    ? results.slice(0, TOP_K)
    : units.filter((u) => FALLBACK.includes(u.title)).map((u) => ({ title: u.title, text: u.text, score: 0 }));
  return { commonRule, picked };
};
