// 첫 화면(Hero) — "디자인을 코드로, 화면을 경험으로"를 연출로 보여줌
// - 화면이 멈춘 채(sticky) 스크롤하는 동안: 3D YG가 선(코드) → 면(화면)으로 채워지고,
//   왼쪽 아래 문구가 "디자인을 코드로" → "화면을 경험으로"로 다시 타이핑됨 (헤더 로고와 같은 깜빡이는 커서)
// - 다 채워진 뒤 더 내리면 화면이 아래로 내려가지 않고 YG 속으로 들어가며 검게 → 그대로 HELLO 장면(About)
// - 아래 가운데 화살표가 계속 통통 튀며 스크롤을 안내
// - 3D는 Three.js를 따로 불러온 뒤 서서히 나타남, 마우스를 따라 기울어짐
// - 동작 줄이기: 화면 하나 높이, 다 채워진 3D + 두 줄 문구 / WebGL이 안 되면 글자만
import { useEffect, useRef, useState } from "react";
import { HERO_TEXT } from "@/data/site";
import { SECTION_IDS } from "@/routes/paths";
import { scrollToElement } from "@/utils/scrollToY";
import styles from "./Hero.module.scss";

const TYPE_SPEED = 90;   // 한 글자 나오는 간격(ms)
const SWITCH_AT = 0.55;  // 스크롤 진행 이 지점부터 둘째 문구
const MAIN_END = 0.5;    // 전체 진행 중 여기까지: 채워짐 · 문구
const DIVE_FROM = 0.55;  // 여기부터 끝까지: YG 속으로 들어가며 화면이 검게 → 바로 HELLO 장면(About)으로 이어짐

const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 문구가 바뀌면 처음부터 한 글자씩 다시 씀
const useTyping = (text) => {
  const [shown, setShown] = useState(reduced ? text : "");
  useEffect(() => {
    if (reduced) return undefined;
    let i = 0;
    setShown("");
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, TYPE_SPEED);
    return () => clearInterval(id);
  }, [text]);
  return shown;
};

const Hero = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false); // 3D가 첫 장면을 그렸는지
  const [step, setStep] = useState(0);            // 0: 디자인을 코드로 / 1: 화면을 경험으로
  const typed = useTyping(HERO_TEXT.lines[step]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return undefined;
    const stage = canvas.parentElement;

    let scene = null;
    let cancelled = false;

    // 3D는 첫 화면에서만 필요하므로 따로 불러옴
    import("./heroScene")
      .then(({ createHeroScene }) => {
        if (cancelled) return;
        scene = createHeroScene(canvas, { reduced });
        requestAnimationFrame(() => !cancelled && setIsReady(true));
      })
      .catch(() => {}); // WebGL을 못 쓰는 환경 — 글자만 보임

    // 마우스 → 3D 기울기 (화면 기준 -1 ~ 1)
    const onPointerMove = (e) => {
      scene?.pointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };

    // 스크롤 → 채워짐 · 회전 · 문구 (멈춰 있는 구간을 지나간 정도 0~1)
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const all = Math.min(1, Math.max(0, -rect.top / range));
      const p = Math.min(1, all / MAIN_END);
      const dive = Math.min(1, Math.max(0, (all - DIVE_FROM) / (1 - DIVE_FROM)));
      scene?.scroll(p);
      scene?.dive(dive);
      setStep(p >= SWITCH_AT ? 1 : 0);
      stage.style.setProperty("--dive", dive.toFixed(3));
      // 다음 HELLO 장면이 화면 맨 위에 붙으면 첫 화면은 숨김 — 그 장면의 검은 막이 걷힐 때 위로 밀려 올라가는 검은 판이 비치지 않게
      stage.style.visibility = rect.bottom <= window.innerHeight + 1 ? "hidden" : "";
      // 검게 바뀌면 헤더 글자도 흰색으로
      const theme = dive > 0.5 ? "dark" : "light";
      if (section.dataset.headerTheme !== theme) {
        section.dataset.headerTheme = theme;
        window.dispatchEvent(new Event("scroll"));
      }
    };

    // 화면 밖이면 그리기 멈춤
    const io = new IntersectionObserver(([entry]) => scene?.setVisible(entry.isIntersecting));
    io.observe(section);
    const ro = new ResizeObserver(() => scene?.resize());
    ro.observe(canvas);

    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    return () => {
      cancelled = true;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      scene?.dispose();
    };
  }, []);

  // 작품 바로 보기 — 헤더 Projects 메뉴와 같은 이동 (이름 장면은 막지 않고 지나감)
  const handleSkip = (e) => {
    e.preventDefault();
    scrollToElement(document.getElementById(SECTION_IDS.projects));
    window.history.replaceState(null, "", `#${SECTION_IDS.projects}`);
  };

  return (
    <section ref={sectionRef} className={styles.hero} data-header-theme="light" data-chat-hide aria-labelledby="hero-title">
      <div className={styles.stage}>
        {/* 3D — 화면 가운데 */}
        <canvas ref={canvasRef} className={`${styles.canvas} ${isReady ? styles.canvasReady : ""}`} aria-hidden="true" />

        <div className={styles.text}>
          <p className={styles.eyebrow}>{HERO_TEXT.eyebrow}</p>
          {/* 화면 읽기: 두 줄 문구 전체 / 화면: 타이핑되는 한 줄 */}
          <h1 id="hero-title" className={styles.srOnly}>{HERO_TEXT.lines.join(", ")}</h1>
          <p className={styles.typed} aria-hidden="true">
            {reduced ? HERO_TEXT.lines.join("\n") : typed}
            {!reduced && <span className={styles.caret} />}
          </p>

        </div>

        {/* 연출을 건너뛰고 작품 소개로 — 바쁜 사람용 (스크롤하면 화살표와 같이 사라짐) */}
        <a href={`#${SECTION_IDS.projects}`} className={styles.skip} onClick={handleSkip}>
          {HERO_TEXT.skip} <span aria-hidden="true">→</span>
        </a>

        {/* 아래로 내려가라는 화살표 — 계속 통통 튐 (스크롤해도 계속 보임) */}
        <span className={styles.scrollCue} aria-hidden="true">
          <svg viewBox="0 0 24 40">
            <path d="M12 2 V36 M3 27 L12 37 L21 27" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      </div>
    </section>
  );
};

export default Hero;
