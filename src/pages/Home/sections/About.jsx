// About — 첫 화면에서 내려오면 순서대로:
//   ⓪ "Hi, my name is YG" — 스크롤하면 YG가 Young Gi로 펼쳐짐 (화면에 붙어 있는 장면)
//   ① 교육 과정 한 줄(배운 곳 · 과정 · 기간) + 숫자 4줄(팀 · 개인 · 배운 기술 분야 · 교육 과정, 0부터 올라감) — 화면 하나 가득
//   ② 큰 사진(마우스를 따라 기울어짐) + 이름 · 한 줄 소개 · 일하는 방식 3줄 — 화면 하나 가득, 글은 사진 위아래에 맞춰 펼침
//   ③ 배운 기술 5줄 — 숫자 줄과 같은 모양(번호 · 분야 · 기술 · 그림), 화면 하나 가득
import { useEffect, useRef, useState } from "react";
import { SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import { ABOUT_TEXT, SECTION_TITLES } from "@/data/site";
import SkillIcon from "@/components/common/SkillIcon/SkillIcon";
import { scrollToElement } from "@/utils/scrollToY";
import styles from "./About.module.scss";

const PHOTO_SRC = PROFILE.photo ? `${import.meta.env.BASE_URL}images/${PROFILE.photo}` : "";
const COUNT_MS = 1200; // 숫자가 올라가는 시간

const SKILLS_ID = "about-skills"; // ③ 배운 기술 제목 (숫자 줄에서 이동)
const PROFILE_ID = "about-profile"; // ② 사진 · 소개 (숫자 줄에서 이동)

// 숫자 줄 4개 — 번호 · 이름표 · 큰 숫자 · 이동 (숫자는 데이터에서 계산)
const TEAM = PROJECTS.filter((p) => p.type === "team");
const SOLO = PROJECTS.filter((p) => p.type === "solo");
const ROWS = [
  { no: "01", label: ABOUT_TEXT.stats.team, value: TEAM.length, unit: ABOUT_TEXT.unit.count, cta: ABOUT_TEXT.cta.team,
    target: SECTION_IDS.projects },
  { no: "02", label: ABOUT_TEXT.stats.solo, value: SOLO.length, unit: ABOUT_TEXT.unit.count, cta: ABOUT_TEXT.cta.solo,
    target: SECTION_IDS.projects },
  { no: "03", label: ABOUT_TEXT.stats.skills, value: PROFILE.learned.length, unit: ABOUT_TEXT.unit.count, cta: ABOUT_TEXT.cta.skills,
    target: SKILLS_ID },
  { no: "04", label: ABOUT_TEXT.stats.months, value: PROFILE.education.months, unit: ABOUT_TEXT.unit.months, cta: ABOUT_TEXT.cta.profile,
    target: PROFILE_ID },
];

// 화면에 들어오면 0부터 올라가는 숫자 (동작 줄이기: 바로 최종 숫자)
const CountUp = ({ value }) => {
  const ref = useRef(null);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el) return undefined;
    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - start) / COUNT_MS);
        setShown(Math.round(value * (1 - (1 - k) ** 3))); // 처음엔 빠르게, 끝에서 천천히
        if (k < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, [value, reduced]);

  return <span ref={ref}>{shown}</span>;
};

const FactRows = () => {
  const listRef = useRef(null);
  const [isIn, setIsIn] = useState(false);  // 화면에 들어왔는지 (선 그어지기 · 줄 올라오기)

  // 화면에 들어오면 한 번만 등장 연출
  useEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsIn(true);
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleClick = (e, target) => {
    e.preventDefault();
    scrollToElement(document.getElementById(target));
  };

  return (
    <ul ref={listRef} className={`${styles.stats} ${isIn ? styles.statsIn : ""}`}>
      {ROWS.map((r) => (
        <li key={r.no}>
          <a href={`#${r.target}`} onClick={(e) => handleClick(e, r.target)}>
            <span className={styles.statNo}>{r.no}</span>
            <span className={styles.statLabel}>{r.label}</span>
            <strong className={styles.statValue}><CountUp value={r.value} />{r.unit}</strong>
            <span className={styles.statCta}>{r.cta} <b aria-hidden="true">→</b></span>
          </a>
        </li>
      ))}
    </ul>
  );
};

// 사진 카드 — 마우스를 따라 살짝 기울어짐 (마우스 기기만, 동작 줄이기면 그대로)
const TILT = 12; // 최대 기울기(도)
const TiltPhoto = () => {
  const ref = useRef(null);
  const canTilt = typeof window !== "undefined"
    && window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 ~ 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * TILT}deg) rotateX(${-y * TILT}deg)`;
  };
  const handleLeave = () => { ref.current.style.transform = ""; };

  return (
    <div className={styles.photoWrap} data-reveal>
      <div
        ref={ref}
        className={styles.photo}
        onPointerMove={canTilt ? handleMove : undefined}
        onPointerLeave={canTilt ? handleLeave : undefined}
      >
        {PHOTO_SRC ? (
          <img src={PHOTO_SRC} alt={`${PROFILE.name} 사진`} />
        ) : (
          <span className={styles.placeholder} aria-hidden="true">{PROFILE.logo}</span>
        )}
      </div>
    </div>
  );
};

// ⓪ 이름 장면 — 스크롤에 따라 세 단계 (구역 높이만큼 스크롤하는 동안 화면에 붙어 있음)
//   1) "HI, MY NAME IS"가 화면 폭을 꽉 채울 만큼 크게 가운데
//   2) 인사 글자가 작아지며 위로, 아래에서 YG가 튀어 오름 — 이때 배경이 검정으로 뒤집힘
//   3) 조금 더 스크롤하면 Y·G 사이가 저절로 벌어지며 OUNG · I가 하나씩 튀어 올라 YOUNG GI
//   4) 장면 끝에서 배경이 다시 흰색 → 아래 About으로 자연스럽게
const NAME_PARTS = [
  { text: "Y" }, { text: "OUNG", hidden: true }, { text: " ", hidden: true },
  { text: "G" }, { text: "I", hidden: true },
];
// 진행도(0~1) 구간 — 0~HI_AT은 빈 흰 화면(잠깐 쉼)
const HI_AT = 0.03;     // 1) 장면에 조금만 들어와도 저절로: 배경이 검게 + "HELLO / I'M" 타이핑
const HI_MS = 1600;     //    걸리는 시간 (배경 어두워짐 + 타이핑)
const SHOW_AT = 0.24;   // 2) 여기를 넘으면 저절로: 인사 글자가 작아지며 위로 + YG가 튀어 오름
const SHOW_MS = 1100;   //    걸리는 시간
const OPEN_AT = 0.4;    // 3) 여기를 넘으면 저절로 YOUNG GI로 펼쳐짐 (되돌아가면 저절로 접힘)
const OPEN_MS = 1400;   //    펼쳐지는 시간
// 펼쳐진 YOUNG GI를 한 화면쯤 스크롤하는 동안 그대로 보여줌 (OPEN_AT ~ OUT_FROM)
const OUT_FROM = 0.66;  // 4) 글자가 위로 흐려지며 사라짐
const OUT_TO = 0.72;
const LIGHT_FROM = 0.72; // 5) 검은 막이 투명해지며 → 이미 아래에서 올라오던 숫자 부분이 비쳐 보임(빈 화면 없이 이어짐)
const LIGHT_TO = 0.8;
const TYPE_FROM = 0.2;   // 인사 시간 중 이만큼 지난 뒤부터 타이핑 (배경이 조금 어두워진 뒤)
const LETTER_STEP = 0.1; // 글자끼리 등장 시차 (단계 안에서의 비율)
const RISE = 0.5;       // 튀어 오르기 전 아래 위치 (글자 크기 배수)
const BLUR = 12;        // 처음 흐림 (px)

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (k) => 1 - (1 - k) ** 3;          // 처음엔 빠르게, 끝에서 천천히
const easeBack = (k) => 1 + 2.2 * (k - 1) ** 3 + 1.2 * (k - 1) ** 2; // 살짝 넘쳤다 돌아옴(통통)

const NameIntro = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    const boxes = [...scene.querySelectorAll("[data-name-box]")];       // 숨은 칸
    const initials = [...scene.querySelectorAll("[data-name-initial]")]; // Y · G
    const letters = [...scene.querySelectorAll("[data-name-letter]")];   // 숨은 칸 속 글자 (등장 순서)
    const typed = [...scene.querySelectorAll("[data-type-ch]")];         // 인사 글자 (타이핑 순서)
    const hello = scene.querySelector("[data-hello]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 글자 하나 — t(0~1)에 맞춰 아래에서 튀어 오르며 흐림 → 또렷
    const pop = (el, t) => {
      el.style.opacity = String(easeOut(t));
      el.style.transform = `translateY(${((1 - easeBack(t)) * RISE).toFixed(3)}em)`;
      el.style.filter = t < 1 ? `blur(${((1 - easeOut(t)) * BLUR).toFixed(1)}px)` : "";
    };
    // 여러 글자를 시차를 두고 차례로
    const popAll = (list, k) => {
      const span = 1 - LETTER_STEP * (list.length - 1);
      list.forEach((el, i) => pop(el, clamp01((k - i * LETTER_STEP) / span)));
    };

    // 숨은 칸의 원래 폭 — 글꼴 크기가 화면 폭 따라 바뀌니 크기 바뀔 때마다 다시 잼
    let widths = [];
    const name = scene.querySelector("[data-name]");
    const stage = name.parentElement;
    const measure = () => {
      // 인사 글자를 처음에 화면 가운데로 내리는 거리 = (이름 줄 높이 + 사이 간격) / 2
      const gap = parseFloat(getComputedStyle(name.parentElement).rowGap) || 0;
      scene.style.setProperty("--hi-shift", `${(name.offsetHeight + gap) / 2}px`);

      widths = boxes.map((el) => {
        el.style.maxWidth = "none";
        return el.scrollWidth;
      });
    };

    // 2) YG 등장 · 3) 펼치기 — 스크롤 위치가 아니라 시간으로
    // 정해진 지점을 넘으면 목표 1(나타남/펼침)로, 되돌아가면 0으로, ms 동안 저절로 진행
    const makeTween = (ms, apply) => {
      const t = { now: 0, target: 0, frame: 0, last: 0 };
      const step = (time) => {
        const dt = time - t.last;
        t.last = time;
        const dir = Math.sign(t.target - t.now);
        t.now = clamp01(t.now + (dir * dt) / ms);
        if ((dir > 0 && t.now > t.target) || (dir < 0 && t.now < t.target)) t.now = t.target;
        apply(t.now);
        t.frame = t.now === t.target ? 0 : requestAnimationFrame(step);
        // 끝나면 다음 단계로 넘어가도 되는지 다시 확인 (스크롤을 멈춘 채 타이핑이 끝나도 YG가 이어서 나오게)
        if (!t.frame) onScroll();
      };
      t.set = (target) => {
        if (target === t.target && (t.frame || t.now === target)) return;
        t.target = target;
        if (reduced) { t.now = target; apply(target); return; }
        if (!t.frame) {
          t.last = performance.now();
          t.frame = requestAnimationFrame(step);
        }
      };
      t.stop = () => cancelAnimationFrame(t.frame);
      return t;
    };
    // YG가 튀어 오르고, 인사 글자가 작아지며 위로 (--show)
    const showTween = makeTween(SHOW_MS, (k) => {
      popAll(initials, k);
      scene.style.setProperty("--show", easeOut(k).toFixed(3));
      if (k === 1) onScroll(); // 다 나오면 다음 단계(펼치기)를 할 수 있는지 다시 확인
    });
    // Y·G 사이가 벌어지며 YOUNG GI
    const applyOpen = (k) => {
      boxes.forEach((el, i) => { el.style.maxWidth = `${widths[i] * easeOut(k)}px`; });
      popAll(letters, k);
    };
    const openTween = makeTween(OPEN_MS, applyOpen);

    // 1) 인사 — 장면에 조금만 들어오면(HI_AT) 저절로: 배경이 검게 바뀌며 한 글자씩 타이핑 (HI_MS 동안)
    let light = 0; // 장면 끝에서 막이 걷히는 정도 (스크롤)
    const paint = (hiK) => {
      scene.style.setProperty("--hi-in", easeOut(hiK).toFixed(3)); // 인사 등장 (모서리 글자)
      // 타이핑 — 배경이 조금 어두워진 뒤부터 한 글자씩, 커서는 마지막 글자 뒤 (다 치면 깜빡임)
      const count = Math.round(clamp01((hiK - TYPE_FROM) / (1 - TYPE_FROM)) * typed.length);
      typed.forEach((el, i) => {
        el.classList.toggle(styles.chOn, i < count);
        el.classList.toggle(styles.chLast, i === count - 1);
      });
      hello.classList.toggle(styles.helloDone, count === typed.length);
      // 배경 검정 정도 — 글자가 다 사라진 뒤에 걷힘(회색 위 회색 글자가 안 생기게)
      const dark = reduced ? 0 : easeOut(hiK) * (1 - easeOut(light));
      scene.style.setProperty("--dark", dark.toFixed(3));
      // 검정 구간에선 헤더 글자도 흰색으로
      const theme = dark > 0.15 ? "dark" : "light";
      if (stage.dataset.headerTheme !== theme) {
        stage.dataset.headerTheme = theme;
        // 헤더는 스크롤 때 색을 고름 — 이 값이 그 뒤(다음 프레임)에 바뀌므로 한 번 더 알려 줌 (안 하면 멈췄을 때 이전 색으로 남음)
        window.dispatchEvent(new Event("scroll"));
      }
      // 막이 투명할 때만 마우스가 통과 — 아래 숫자 줄을 누를 수 있게
      // (CSS로 늘 통과시키면 헤더 색을 고르는 훅이 이 장면을 못 찾아 검은 화면 위 헤더가 흰색이 됨)
      stage.style.pointerEvents = dark > 0.02 ? "auto" : "none";
    };
    const hiTween = makeTween(HI_MS, (k) => {
      paint(k);
      if (k === 1) onScroll(); // 타이핑이 끝나면 다음 단계(YG)를 할 수 있는지 다시 확인
    });

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = reduced ? 1 : clamp01(-rect.top / (range || 1));
      const out = clamp01((p - OUT_FROM) / (OUT_TO - OUT_FROM));
      light = clamp01((p - LIGHT_FROM) / (LIGHT_TO - LIGHT_FROM));

      hiTween.set(p >= HI_AT ? 1 : 0);
      // 앞 단계가 다 끝나야 다음 단계로 — 타이핑 중에 스크롤해도 YG가 끼어들지 않고, YG가 다 나온 뒤에 펼쳐짐
      // (되돌아갈 때는 바로 접힘)
      showTween.set(p >= SHOW_AT && hiTween.now === 1 ? 1 : 0);
      openTween.set(p >= OPEN_AT && showTween.now === 1 ? 1 : 0);
      scene.style.setProperty("--out", easeOut(out).toFixed(3));   // 글자 퇴장
      paint(hiTween.now); // 막이 걷히는 정도(light)는 스크롤로 바뀌므로 매번 다시 칠함
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onResize = () => { measure(); applyOpen(openTween.now); update(); };

    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize); // 글꼴이 늦게 오면 폭이 달라지므로
    return () => {
      cancelAnimationFrame(frame);
      hiTween.stop();
      showTween.stop();
      openTween.stop();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={sceneRef} className={styles.intro}>
      {/* 로고 · About 메뉴로 왔을 때 멈추는 곳 — 빈 흰 화면이 아니라 인사가 다 나온 지점 */}
      <span data-about-start className={styles.introStart} aria-hidden="true" />
      <div className={styles.introStage} data-header-theme="light">
        {/* 네 모서리 작은 글자 (장식) */}
        {ABOUT_TEXT.introHello.corners.map((text, i) => (
          <span key={text} className={`${styles.corner} ${styles[`corner${i}`]}`} aria-hidden="true">{text}</span>
        ))}
        {/* 인사 — 두 줄(HELLO / I'M), 한 글자씩 타이핑 (data-type-ch) */}
        <p className={styles.hi} data-hello aria-label={`${ABOUT_TEXT.introHello.strong} ${ABOUT_TEXT.introHello.light}`}>
          {[["strong", ABOUT_TEXT.introHello.strong], ["light", ABOUT_TEXT.introHello.light]].map(([kind, line]) => (
            <span key={kind} className={kind === "strong" ? styles.hiStrong : styles.hiLight} aria-hidden="true">
              {[...line].map((ch, i) => <span key={i} data-type-ch className={styles.ch}>{ch}</span>)}
            </span>
          ))}
        </p>
        <p className={styles.bigName} aria-label={PROFILE.nameEn} data-name>
          {NAME_PARTS.map((part, i) => (part.hidden ? (
            <span key={i} data-name-box className={styles.nameHidden} aria-hidden="true">
              {[...part.text].map((ch, j) => (
                <span key={j} data-name-letter className={styles.nameLetter}>{ch}</span>
              ))}
            </span>
          ) : (
            <span key={i} data-name-initial className={styles.nameLetter} aria-hidden="true">{part.text}</span>
          )))}
        </p>
      </div>
    </div>
  );
};

const About = () => (
  <section data-header-theme="light" id={SECTION_IDS.about} className={styles.about} aria-label={SECTION_TITLES.about}>
    <NameIntro />
    <div className={styles.inner}>
      {/* ① 교육 과정 한 줄 + 숫자 */}
      <div className={`${styles.part} ${styles.facts}`}>
        <p className={styles.eyebrow} data-reveal>{ABOUT_TEXT.parts.facts}</p>
        <p className={styles.course} data-reveal>
          <b>{PROFILE.education.school}</b>
          <span>{PROFILE.education.course}</span>
          <span className={styles.period}>{PROFILE.education.period}</span>
        </p>
        <FactRows />
      </div>

      {/* ② 사진(마우스를 따라 기울어짐) + 이름 · 한 줄 소개 · 일하는 방식 3줄 */}
      <div id={PROFILE_ID} className={styles.part}>
      <p className={styles.eyebrow} data-reveal>{ABOUT_TEXT.parts.profile}</p>
      <div className={styles.profile}>
        <TiltPhoto />
        <div className={styles.content}>
          <p className={styles.eyebrow} data-reveal>{PROFILE.role.toUpperCase()} · {PROFILE.nameEn.toUpperCase()}</p>
          <h2 className={styles.name} data-reveal>{PROFILE.name}</h2>
          <p className={styles.lead} data-reveal>
            {PROFILE.lead.map(([text, strong]) => (strong ? <b key={text}>{text}</b> : <span key={text}>{text}</span>))}
          </p>
          <ol className={styles.ways} data-reveal>
            {PROFILE.ways.map((way, i) => (
              <li key={way}>
                <span className={styles.wayNo}>{String(i + 1).padStart(2, "0")}</span>
                {way}
              </li>
            ))}
          </ol>
        </div>
      </div>
      </div>

      {/* ③ 배운 기술 */}
      {/* 이동 기준점 — 제목은 등장 연출로 아래에 밀려 있을 수 있어 따로 둠 */}
      <span id={SKILLS_ID} className={styles.anchor} aria-hidden="true" />
      <div className={`${styles.part} ${styles.skills}`}>
      <div className={styles.learnedHead} data-reveal>
        <p className={styles.eyebrow}>{ABOUT_TEXT.parts.skills}</p>
        <h3 className={styles.learnedTitle}>{ABOUT_TEXT.skillsTitle}</h3>
      </div>
      <ul className={styles.learned}>
        {PROFILE.learned.map((group, i) => (
          <li key={group.title} className={styles.skillRow} data-reveal>
            <span className={styles.skillNo}>{String(i + 1).padStart(2, "0")}</span>
            <h4 className={styles.skillName}>{group.title}</h4>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item.label}>
                  <SkillIcon name={item.icon} />
                  {item.label}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      </div>
    </div>
  </section>
);

export default About;