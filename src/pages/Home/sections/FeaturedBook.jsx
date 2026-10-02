// =============================================================
// 대표 프로젝트 — 책 넘기기 연출
// - 섹션에 닿으면 책이 화면에 고정(sticky)되고, 스크롤한 만큼 페이지가 3D로 넘어간다
// - 한 페이지 = 작품 하나. 페이지 순서: [표지, 작품..., 마무리]
// - 모바일·"동작 줄이기" 사용자는 일반 카드 목록(FeaturedProjects)으로 대체
// =============================================================
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS, SECTION_IDS, toProjectDetail } from "@/routes/paths";
import { getFeaturedProjects } from "@/data/projects";
import { BOOK_TEXT, UI_TEXT } from "@/data/site";
import { getProjectImage } from "@/utils/getProjectImage";
import useMediaQuery from "@/hooks/useMediaQuery";
import FeaturedProjects from "./FeaturedProjects";
import styles from "./FeaturedBook.module.scss";

const HEADER_HEIGHT = 72; // $header-height와 같은 값
const HOLD = 0.35;        // 첫 장·마지막 장에서 잠깐 멈춰 있는 구간 (넘김 1장 = 1)

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);

// ---- 페이지 내용 ----
const CoverPage = ({ count }) => (
  <div className={styles.cover}>
    <p className={styles.label}>{BOOK_TEXT.coverLabel}</p>
    <h2 className={styles.coverTitle}>
      {BOOK_TEXT.coverTitle} <span className={styles.count}>{count}</span>
    </h2>
    <p className={styles.coverDesc}>{BOOK_TEXT.coverDesc}</p>
    <p className={styles.hint} aria-hidden="true">↓ {BOOK_TEXT.scrollHint}</p>
  </div>
);

const ProjectPage = ({ project, pageNo }) => {
  const { projectId, name, category, type, teamSize, period, summary, thumbnail, links, hasDetail } = project;
  return (
    <article className={styles.project}>
      <img src={getProjectImage(thumbnail)} alt="" className={styles.image} loading="lazy" />
      <p className={styles.meta}>
        <span className={styles.tag}>{category}</span>
        <span>{type === "team" ? UI_TEXT.teamSize(teamSize) : UI_TEXT.solo}</span>
        <span>{period}</span>
      </p>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.summary}>{summary}</p>
      <div className={styles.links}>
        {hasDetail && <Link to={toProjectDetail(projectId)} className={styles.primary}>{UI_TEXT.viewDetail}</Link>}
        {links.slice(0, 2).map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={styles.secondary}>
            {link.label}
          </a>
        ))}
      </div>
      <span className={styles.pageNo}>{String(pageNo).padStart(2, "0")}</span>
    </article>
  );
};

const OutroPage = () => (
  <div className={styles.cover}>
    <h3 className={styles.coverTitle}>{BOOK_TEXT.outroTitle}</h3>
    <p className={styles.coverDesc}>{BOOK_TEXT.outroDesc}</p>
    <Link to={PATHS.projects} className={styles.primary}>{UI_TEXT.viewAllProjects}</Link>
  </div>
);

const EndPage = () => (
  <div className={styles.end}><p>{BOOK_TEXT.endMark}</p></div>
);

// ---- 책 ----
const FeaturedBook = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // 모바일이나 "동작 줄이기"면 기존 카드 목록
  if (isMobile || reduceMotion) return <FeaturedProjects />;
  return <Book />;
};

const Book = () => {
  const projects = getFeaturedProjects();
  const scrollerRef = useRef(null);
  const leafRefs = useRef([]);
  const [spread, setSpread] = useState(0);

  // 페이지 목록 → 앞뒤 면을 가진 "장(leaf)"으로 묶기
  // 왼쪽 바닥 = 표지, 장 j의 앞면 = pages[2j+1], 뒷면 = pages[2j+2]
  const pages = [
    <CoverPage key="cover" count={projects.length} />,
    ...projects.map((p, i) => <ProjectPage key={p.projectId} project={p} pageNo={i + 1} />),
    <OutroPage key="outro" />,
  ];
  const leaves = [];
  for (let i = 1; i < pages.length; i += 2) {
    leaves.push({ front: pages[i], back: pages[i + 1] ?? <EndPage /> });
  }
  const flips = leaves.length;
  // 마지막 장 뒷면이 마무리 페이지면 오른쪽 바닥에 끝 페이지를 둔다
  const rightBase = <EndPage />;

  useEffect(() => {
    let frame = null;

    const update = () => {
      frame = null;
      const scroller = scrollerRef.current;
      if (!scroller) return;

      // 섹션이 고정된 동안 얼마나 스크롤했는지 0~1
      const rect = scroller.getBoundingClientRect();
      const stageHeight = window.innerHeight - HEADER_HEIGHT;
      const distance = scroller.offsetHeight - stageHeight;
      const progress = clamp01((HEADER_HEIGHT - rect.top) / distance);

      // 앞뒤로 잠깐 멈추는 구간을 두고, 나머지를 장 수만큼 나눈다
      const t = progress * (flips + HOLD * 2) - HOLD;

      leafRefs.current.forEach((leaf, j) => {
        if (!leaf) return;
        const f = clamp01(t - j);            // 이 장이 넘어간 정도 0~1
        const angle = -180 * easeInOut(f);
        leaf.style.transform = `rotateY(${angle}deg)`;
        // 넘어가는 중인 장이 가장 위, 넘어간 장은 나중 것이 위
        leaf.style.zIndex = f > 0 && f < 1 ? 300 : f >= 1 ? 100 + j : 100 + (flips - j);
        // 넘어가는 동안 종이에 그림자
        leaf.style.setProperty("--shade", (Math.sin(f * Math.PI) * 0.22).toFixed(3));
      });

      const current = Math.round(clamp01(t / flips) * flips);
      setSpread((prev) => (prev === current ? prev : current));
    };

    const request = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [flips]);

  return (
    <section id={SECTION_IDS.projects} data-header-theme="light" className={styles.section} aria-label={BOOK_TEXT.coverLabel}>
      <div ref={scrollerRef} className={styles.scroller} style={{ "--flips": flips }}>
        <div className={styles.stage}>
          <div className={styles.book}>
            <div className={styles.boards} aria-hidden="true" />
            <div className={`${styles.base} ${styles.left}`}>{pages[0]}</div>
            <div className={`${styles.base} ${styles.right}`}>{rightBase}</div>
            {leaves.map((leaf, j) => (
              <div key={j} ref={(el) => (leafRefs.current[j] = el)} className={styles.leaf}>
                <div className={`${styles.face} ${styles.front}`}>{leaf.front}</div>
                <div className={`${styles.face} ${styles.back}`}>{leaf.back}</div>
              </div>
            ))}
          </div>
          <p className={styles.progress} aria-hidden="true">
            {String(spread + 1).padStart(2, "0")} / {String(flips + 1).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBook;
