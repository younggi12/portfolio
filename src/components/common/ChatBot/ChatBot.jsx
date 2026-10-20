// 챗봇 — 오른쪽 아래 YG 버튼 → 작은 채팅 창
// 질문 → /api/chat(서버 함수) → OpenAI, 답은 글자가 생기는 대로 바로 보임(스트리밍)
// 대화는 이 창이 열려 있는 동안(새로고침 전까지)만 기억
import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/data/profile";
import { CHAT_TEXT } from "@/data/site";
import styles from "./ChatBot.module.scss";

const API_URL = "/api/chat";
const MAX_LENGTH = 500; // 서버와 같은 질문 글자 수 제한

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: "user" | "assistant", content }
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const toggleRef = useRef(null);
  const abortRef = useRef(null);
  // 첫 화면(Hero, data-chat-hide)이 화면을 차지하는 동안은 숨김 — 3D · "작품 바로 보기"와 겹치지 않게
  const [isHiddenZone, setIsHiddenZone] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const zone = document.querySelector("[data-chat-hide]");
      setIsHiddenZone(Boolean(zone) && zone.getBoundingClientRect().bottom > window.innerHeight * 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const timer = setInterval(onScroll, 1000); // 페이지가 바뀌어 Hero가 생기거나 사라질 때
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearInterval(timer);
    };
  }, []);
  const isShown = isOpen || !isHiddenZone;

  // 새 글이 생기면 맨 아래로
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, isOpen]);

  // 열면 입력창에, 닫으면 버튼에 초점 / Esc로 닫기
  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // 창이 사라지면 받던 답 멈춤
  useEffect(() => () => abortRef.current?.abort(), []);

  const ask = async (question) => {
    const text = question.trim().slice(0, MAX_LENGTH);
    if (!text || isLoading) return;
    const userMessage = { role: "user", content: text };
    const history = [...messages.filter((m) => !m.error), userMessage]; // 서버로는 안내 문구(에러) 빼고 보냄
    setMessages([...messages, userMessage, { role: "assistant", content: "" }]); // 화면에는 그대로
    setInput("");
    setIsLoading(true);

    // 마지막(답) 말풍선 바꾸기
    const setLast = (update) => setMessages((list) => [...list.slice(0, -1), update(list[list.length - 1])]);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(res.status === 429 ? "tooMany" : "error");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setLast((last) => ({ ...last, content: last.content + chunk }));
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      // 받던 답이 있으면 그대로 두고, 없으면 안내 문구
      const message = err.message === "tooMany" ? CHAT_TEXT.tooMany : CHAT_TEXT.error;
      setLast((last) => (last.content ? last : { ...last, content: message, error: true }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ask(input);
  };

  const toggle = () => setIsOpen((v) => !v);

  return (
    <div className={`${styles.chat} ${isShown ? "" : styles.chatHidden}`} data-chat>
      {isOpen && (
        <section className={styles.panel} role="dialog" aria-label={CHAT_TEXT.title}>
          <header className={styles.head}>
            <span className={styles.avatar} aria-hidden="true">{PROFILE.logo}</span>
            <div className={styles.headText}>
              <p className={styles.title}>{CHAT_TEXT.title}</p>
              <p className={styles.note}>{CHAT_TEXT.note}</p>
            </div>
            <button type="button" className={styles.close} onClick={toggle} aria-label={CHAT_TEXT.close}>×</button>
          </header>

          <div ref={listRef} className={styles.list} aria-live="polite">
            <p className={`${styles.bubble} ${styles.bot}`}>{CHAT_TEXT.greeting}</p>
            {messages.length === 0 && (
              <div className={styles.suggestions}>
                {CHAT_TEXT.suggestions.map((q) => (
                  <button key={q} type="button" onClick={() => ask(q)}>{q}</button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <p
                key={i}
                className={[styles.bubble, m.role === "user" ? styles.me : styles.bot, m.error && styles.error].filter(Boolean).join(" ")}
              >
                {m.content || (isLoading && i === messages.length - 1 ? <span className={styles.thinking}>{CHAT_TEXT.thinking}</span> : "")}
              </p>
            ))}
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={CHAT_TEXT.placeholder}
              maxLength={MAX_LENGTH}
              aria-label={CHAT_TEXT.placeholder}
            />
            <button type="submit" disabled={!input.trim() || isLoading}>{CHAT_TEXT.send}</button>
          </form>
        </section>
      )}

      <button
        ref={toggleRef}
        type="button"
        className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ""}`}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? CHAT_TEXT.close : CHAT_TEXT.open}
      >
        {isOpen ? "×" : PROFILE.logo}
      </button>
    </div>
  );
};

export default ChatBot;
