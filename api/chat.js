// POST /api/chat — 포트폴리오 챗봇 (Vercel 서버 함수)
// 브라우저 → 여기 → OpenAI. API 키(OPENAI_API_KEY)는 서버 환경 변수에만 (코드 · GitHub · 브라우저에 절대 없음)
// 키워드 RAG: 질문 → guide.txt에서 맞는 단원 검색(_rag.js) → 규칙 + 단원 + 질문을 OpenAI에 → 답을 글자가 생기는 대로 그대로 흘려보냄(스트리밍)
import { buildSystemPrompt } from "./_prompt.js";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_HISTORY = 10;     // 최근 대화 몇 개까지 같이 보낼지
const MAX_QUESTION = 500;   // 질문 글자 수 제한
const MAX_ANSWER_TOKENS = 450;
const LIMIT = 20;           // 같은 IP — WINDOW 동안 최대 질문 수 (서버가 켜져 있는 동안만 기억하는 간단한 제한)
const WINDOW = 10 * 60 * 1000;
const hits = new Map();

const readBody = async (req) => {
  if (req.body) return typeof req.body === "string" ? JSON.parse(req.body) : req.body; // Vercel은 미리 읽어 줌
  let raw = "";
  for await (const chunk of req) raw += chunk; // 개발 서버(vite)는 직접 읽음
  return raw ? JSON.parse(raw) : {};
};

const tooMany = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW);
  list.push(now);
  hits.set(ip, list);
  return list.length > LIMIT;
};

const fail = (res, status, message) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ error: message }));
};

export default async function handler(req, res) {
  if (req.method !== "POST") return fail(res, 405, "POST only");
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("[chat] OPENAI_API_KEY가 없음 — .env.local 또는 Vercel 환경 변수 확인");
    return fail(res, 500, "missing key");
  }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
  if (tooMany(ip)) return fail(res, 429, "too many");

  let messages;
  try {
    ({ messages } = await readBody(req));
  } catch {
    return fail(res, 400, "bad json");
  }
  // 사용자 · 챗봇 말만, 최근 것만, 길이 제한
  const history = (Array.isArray(messages) ? messages : [])
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, m.role === "user" ? MAX_QUESTION : 2000) }));
  if (history.at(-1)?.role !== "user") return fail(res, 400, "no question");

  // 검색어 = 최근 사용자 질문 2개 ("그거 더 자세히" 같은 이어지는 질문도 앞 질문 단어로 찾게)
  const query = history.filter((m) => m.role === "user").slice(-2).map((m) => m.content).join(" ");
  let system;
  try {
    system = buildSystemPrompt(query);
  } catch (err) {
    console.error(`[chat] 참고서(guide.txt)를 읽지 못함: ${err.message}`);
    return fail(res, 500, "guide missing");
  }
  if (process.env.NODE_ENV !== "production") console.log(`[chat] 찾은 단원: ${system.titles.join(", ") || "없음(자기소개만)"}`);

  let upstream;
  try {
    upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.4,
        max_tokens: MAX_ANSWER_TOKENS,
        messages: [{ role: "system", content: system.prompt }, ...history],
      }),
    });
  } catch (err) {
    console.error(`[chat] OpenAI 연결 실패: ${err.message}`);
    return fail(res, 502, "upstream unreachable");
  }
  if (!upstream.ok || !upstream.body) {
    // 원인을 서버 로그(개발: 터미널 / 배포: Vercel Logs)에 남김 — 401 키 오류, 429 크레딧 부족 · 요청 과다 등 (키 값은 남기지 않음)
    const detail = await upstream.text().catch(() => "");
    console.error(`[chat] OpenAI ${upstream.status}: ${detail.slice(0, 300)}`);
    return fail(res, 502, `upstream ${upstream.status}`);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Chat-Sections", encodeURIComponent(system.titles.join(", "))); // 개발자 도구 Network에서 고른 단원 확인

  // OpenAI 스트림(SSE: "data: {...}" 줄)에서 글자만 골라 그대로 보냄
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        const data = line.replace(/^data:\s*/, "").trim();
        if (!data || data === "[DONE]" || !line.startsWith("data:")) continue;
        try {
          const text = JSON.parse(data).choices?.[0]?.delta?.content;
          if (text) res.write(text);
        } catch {
          // 잘린 줄은 무시
        }
      }
    }
  } finally {
    res.end();
  }
}
