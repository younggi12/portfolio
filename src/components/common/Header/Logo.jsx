// 헤더 로고 — YG가 저절로 YOUNG GI로 펼쳐졌다 다시 접힘 (GSAP 타임라인, 계속 반복)
// Y · G 사이 숨은 칸(OUNG, 띄어쓰기, I)의 폭을 0 → 원래 폭으로 늘리고, 칸 속 글자가 아래에서 통 튀어 오름 (이름 장면과 같은 모양)
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./Header.module.scss";

const PARTS = [
  { text: "Y" }, { text: "OUNG", hidden: true }, { text: " ", hidden: true },
  { text: "G" }, { text: "I", hidden: true },
];
const FIRST_DELAY = 1.2; // 처음 펼치기 전 (초)
const OPEN_HOLD = 2.2;   // 펼친 채 머무는 시간
const CLOSED_HOLD = 3.5; // 접힌 채 머무는 시간

const Logo = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const el = ref.current;
    const boxes = [...el.querySelectorAll("[data-box]")];
    const letters = el.querySelectorAll("[data-box] span");
    let master;

    const build = () => {
      master?.kill();
      // 숨은 칸 원래 폭 (글꼴이 늦게 오면 달라서 글꼴 준비 뒤에 잼)
      const widths = boxes.map((b) => {
        b.style.maxWidth = "none";
        const w = b.scrollWidth;
        b.style.maxWidth = "0px";
        return w;
      });
      gsap.set(letters, { yPercent: 60, opacity: 0 });
      const open = gsap.timeline({ paused: true });
      boxes.forEach((b, i) => open.to(b, { maxWidth: widths[i], duration: 0.6, ease: "power3.out" }, 0));
      open.to(letters, { yPercent: 0, opacity: 1, duration: 0.5, ease: "back.out(2.2)", stagger: 0.05 }, 0.1);
      const dur = open.duration();
      master = gsap.timeline({ repeat: -1, delay: FIRST_DELAY }) // 무한 반복 (선생님 피드백) — 동작 줄이기 설정이면 위에서 아예 실행 안 함
        .add(open.tweenFromTo(0, dur))
        .to({}, { duration: OPEN_HOLD })
        .add(open.tweenFromTo(dur, 0))
        .to({}, { duration: CLOSED_HOLD });
    };

    let alive = true;
    (document.fonts?.ready ?? Promise.resolve()).then(() => { if (alive) build(); });
    return () => {
      alive = false;
      master?.kill();
    };
  }, []);

  return (
    <span ref={ref} className={styles.logoName} aria-hidden="true">
      {PARTS.map(({ text, hidden }, i) => (hidden ? (
        <span key={i} data-box className={styles.logoBox}>
          {[...text].map((ch, j) => <span key={j}>{ch === " " ? " " : ch}</span>)}
        </span>
      ) : (
        <span key={i}>{text}</span>
      )))}
    </span>
  );
};

export default Logo;
