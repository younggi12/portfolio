// 첫 방문 인트로 — 어두운 배경 위에 흰 글자가 한 글자씩 서서히 나타난 뒤 사라지며 Home이 열림
// - 지금은 새로고침할 때마다 재생 (확정 전). 첫 방문 1회만 보이게 하려면 ONLY_FIRST_VISIT = true
// - 클릭·아무 키로 건너뛰기
// - "동작 줄이기" 설정 사용자에게는 보여주지 않음
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { INTRO_TEXT } from "@/data/site";
import styles from "./Intro.module.scss";

const ONLY_FIRST_VISIT = false; // true: 첫 방문 1회만 (localStorage "introSeen")
const STORAGE_KEY = "introSeen";
const CHAR_DELAY = 90;   // 글자 사이 간격(ms)
const CHAR_FADE = 600;   // 글자 하나가 나타나는 시간(ms)
const HOLD = 1200;       // 다 나타난 뒤 머무는 시간(ms)
const EXIT = 800;        // 사라지는 시간(ms) — Intro.module.scss의 .leaving과 같게

const hasSeen = () => {
  if (!ONLY_FIRST_VISIT) return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const markSeen = () => {
  if (!ONLY_FIRST_VISIT) return;
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // 저장 실패 시 다음 방문에 다시 재생돼도 무방
  }
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Intro = () => {
  const [phase, setPhase] = useState(() => (hasSeen() || prefersReducedMotion() ? "done" : "playing"));

  const close = useCallback(() => {
    setPhase((prev) => (prev === "playing" ? "leaving" : prev));
  }, []);

  // 전체 글자 수 → 끝나는 시간 계산
  const totalChars = INTRO_TEXT.lines.join("").length;
  const showTime = totalChars * CHAR_DELAY + CHAR_FADE + HOLD;

  useEffect(() => {
    if (phase !== "playing") return undefined;
    document.body.style.overflow = "hidden"; // 인트로 동안 스크롤 잠금
    const timer = setTimeout(close, showTime);
    window.addEventListener("keydown", close);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", close);
    };
  }, [phase, close, showTime]);

  useEffect(() => {
    if (phase !== "leaving") return undefined;
    markSeen();
    const timer = setTimeout(() => setPhase("done"), EXIT);
    return () => clearTimeout(timer);
  }, [phase]);

  // 스크롤 등장 연출(useScrollReveal)에 인트로 상태를 알림 — 끝나면 About부터 등장
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (phase === "done") {
      if (root.dataset.intro === "playing") {
        delete root.dataset.intro;
        window.dispatchEvent(new Event("introdone"));
      }
    } else {
      root.dataset.intro = "playing";
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  if (phase === "done") return null;

  // 줄을 넘어가도 순서가 이어지도록 전체 글자 번호(i)를 매김
  let i = 0;
  return (
    <div
      className={`${styles.intro} ${phase === "leaving" ? styles.leaving : ""}`}
      onClick={close}
      role="presentation"
      style={{ "--char-delay": `${CHAR_DELAY}ms`, "--char-fade": `${CHAR_FADE}ms`, "--exit": `${EXIT}ms` }}
    >
      <p className={styles.text} aria-label={INTRO_TEXT.lines.join(" ")}>
        {INTRO_TEXT.lines.map((line) => (
          <span key={line} className={styles.line} aria-hidden="true">
            {[...line].map((char) => (
              <span key={i} className={styles.char} style={{ "--i": i++ }}>
                {char === " " ? " " : char}
              </span>
            ))}
          </span>
        ))}
      </p>
      <button type="button" className={styles.skip} onClick={close}>{INTRO_TEXT.skip}</button>
    </div>
  );
};

export default Intro;
