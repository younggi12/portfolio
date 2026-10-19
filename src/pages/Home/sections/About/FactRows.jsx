// ① 교육 과정 한 줄 + 숫자 4줄(팀 · 개인 · 배운 기술 분야 · 교육 과정) — 커튼이 다 걷힌 뒤 0부터 올라감
import { useEffect, useRef, useState } from "react";
import { SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import { ABOUT_TEXT } from "@/data/site";
import { scrollToElement } from "@/utils/scrollToY";
import { coverState, FACTS_COVER_EVENT, PROFILE_ID, SKILLS_ID } from "./aboutShared";
import styles from "./About.module.scss";

const COUNT_MS = 1200; // 숫자가 올라가는 시간

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

// play가 켜지면 0부터 올라가는 숫자 / 꺼지면 0으로 (동작 줄이기: 바로 최종 숫자)
const CountUp = ({ value, play }) => {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) return undefined;
    if (!play) { setShown(0); return undefined; }
    let frame = 0;
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / COUNT_MS);
      setShown(Math.round(value * (1 - (1 - k) ** 3))); // 처음엔 빠르게, 끝에서 천천히
      if (k < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, play, reduced]);

  return <span>{shown}</span>;
};

// 교육 과정 한 줄 + 숫자 4줄 — 화면에 보이고 커튼이 다 걷혔을 때 등장 (커튼이 다시 내려오면 처음 상태로 → 다음에 또 보임)
const FactRows = () => {
  const listRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [covered, setCovered] = useState(coverState.covered);
  const isIn = inView && !covered;

  useEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    const onCover = (e) => setCovered(e.detail);
    window.addEventListener(FACTS_COVER_EVENT, onCover);
    return () => { io.disconnect(); window.removeEventListener(FACTS_COVER_EVENT, onCover); };
  }, []);

  // 한 번 나온 뒤에는 커튼이 다시 덮일 때만 처음 상태로 (스크롤로 잠깐 벗어났다 와도 다시 하지 않음)
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (isIn) setShown(true);
    else if (covered) setShown(false);
  }, [isIn, covered]);

  const handleClick = (e, target) => {
    e.preventDefault();
    if (e.detail > 0) e.currentTarget.blur(); // 마우스로 누른 경우만 포커스 해제 → 돌아왔을 때 줄이 검게 · 테두리로 남지 않음 (키보드는 유지)
    scrollToElement(document.getElementById(target));
  };

  return (
    <>
      <p className={`${styles.course} ${shown ? styles.courseIn : ""}`}>
        <b>{PROFILE.education.school}</b>
        <span>{PROFILE.education.course}</span>
        <span className={styles.period}>{PROFILE.education.period}</span>
      </p>
      <ul ref={listRef} className={`${styles.stats} ${shown ? styles.statsIn : ""}`}>
        {ROWS.map((r) => (
          <li key={r.no}>
            <a href={`#${r.target}`} onClick={(e) => handleClick(e, r.target)}>
              <span className={styles.statNo}>{r.no}</span>
              <span className={styles.statLabel}>{r.label}</span>
              <strong className={styles.statValue}><CountUp value={r.value} play={shown} />{r.unit}</strong>
              <span className={styles.statCta}>{r.cta} <b aria-hidden="true">→</b></span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FactRows;
