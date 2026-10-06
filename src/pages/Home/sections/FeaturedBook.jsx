// =============================================================
// 대표 프로젝트 — 검정 섹션 책 연출 (Apple 제품 섹션 방식)
//
// [PC] 하나의 스크롤 타임라인
//   ① 오프닝: 닫힌 책이 펼쳐지는 영상을 스크롤에 맞춰 재생 (프레임 이미지 → canvas)
//      - 스크롤을 멈추면 오프닝이 끝까지 자동으로 이어 재생 (실제로는 자동 스크롤)
//      - 다시 스크롤하면 자동 재생 중단 → 스크롤이 주인
//   ② 등장: 펼친 책 위에 작품 내용이 하나씩 서서히 나타남
//   ③ 넘김: 스크롤·버튼·←/→ 로 책장을 넘김 (react-pageflip, 종이가 휘며 넘어감)
//   ※ 영상·등장·넘김 모두 "스크롤 위치" 하나만 기준으로 움직인다
//
// [모바일] 영상 자동 재생 1회 + 아래 카드 목록 / [동작 줄이기] 정지 이미지 + 카드 목록
// =============================================================
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Link } from "react-router-dom";
import { PATHS, SECTION_IDS, toProjectDetail } from "@/routes/paths";
import { getFeaturedProjects } from "@/data/projects";
import { BOOK_TEXT, UI_TEXT } from "@/data/site";
import { getProjectImage } from "@/utils/getProjectImage";
import useMediaQuery from "@/hooks/useMediaQuery";
import FeaturedProjects from "./FeaturedProjects";
import styles from "./FeaturedBook.module.scss";

const HEADER_HEIGHT = 72; // $header-height와 같은 값
const BASE = import.meta.env.BASE_URL;

// 오프닝 영상 (public/book/) — 프레임은 영상에서 12fps로 뽑은 84장
const FRAME_COUNT = 84;
const FRAME_FPS = 12;
const frameSrc = (i) => `${BASE}book/frames/f${String(i + 1).padStart(3, "0")}.webp`;
const VIDEO_SRC = { mp4: `${BASE}book/book-open.mp4`, webm: `${BASE}book/book-open.webm` };
const LAST_FRAME = `${BASE}book/last.webp`;

// 영상 마지막 장면에서 펼친 페이지가 차지하는 영역 (1280×720 프레임 기준 %)
const PAGE_RECT = { left: 17.8, top: 14.4, width: 65.5, height: 68.1 };

// 스크롤 구간 길이 (화면 높이 단위)
const SEG = { opening: 1.6, reveal: 0.7, flip: 0.9, end: 0.3 };

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

// ---- 페이지 (react-pageflip는 forwardRef 컴포넌트를 페이지로 받는다) ----
const Page = forwardRef(({ children, side }, ref) => (
  <div ref={ref} className={`${styles.page} ${styles[side]}`}>
    <div className={styles.pageInner}>{children}</div>
  </div>
));
Page.displayName = "Page";

// 등장 순서(--i)를 붙인 요소 — 첫 펼침에서 하나씩 나타나게
const Reveal = ({ i, as: Tag = "div", className = "", children, ...rest }) => (
  <Tag className={`${styles.reveal} ${className}`} style={{ "--i": i }} {...rest}>
    {children}
  </Tag>
);

const IntroPage = ({ count }) => (
  <div className={styles.intro}>
    <Reveal i={0} as="p" className={styles.label}>{BOOK_TEXT.coverLabel}</Reveal>
    <Reveal i={1} as="h3" className={styles.introTitle}>
      {BOOK_TEXT.coverTitle} <span className={styles.soft}>{count}</span>
    </Reveal>
    <Reveal i={2} as="p" className={styles.introDesc}>{BOOK_TEXT.coverDesc}</Reveal>
  </div>
);

const ProjectPage = ({ project, pageNo, first = false }) => {
  const { projectId, name, category, type, teamSize, period, summary, thumbnail, links, hasDetail } = project;
  // 첫 펼침의 작품만 하나씩 등장, 나머지는 넘길 때 이미 인쇄되어 있음
  const R = first ? Reveal : ({ as: Tag = "div", className = "", children }) => <Tag className={className}>{children}</Tag>;
  return (
    <article className={styles.project}>
      <R i={3} className={styles.photo}>
        <img src={getProjectImage(thumbnail)} alt="" loading="lazy" />
      </R>
      <R i={4} as="p" className={styles.meta}>
        <span className={styles.tag}>{category}</span>
        <span>{type === "team" ? UI_TEXT.teamSize(teamSize) : UI_TEXT.solo}</span>
        <span>{period}</span>
      </R>
      <R i={5} as="h3" className={styles.name}>{name}</R>
      <R i={6} as="p" className={styles.summary}>{summary}</R>
      <R i={7} className={styles.links}>
        {hasDetail && <Link to={toProjectDetail(projectId)} className={styles.primary}>{UI_TEXT.viewDetail}</Link>}
        {links.slice(0, 2).map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={styles.secondary}>
            {link.label}
          </a>
        ))}
      </R>
      <span className={styles.pageNo}>{String(pageNo).padStart(2, "0")}</span>
    </article>
  );
};

const OutroPage = () => (
  <div className={styles.intro}>
    <h3 className={styles.introTitle}>{BOOK_TEXT.outroTitle}</h3>
    <p className={styles.introDesc}>{BOOK_TEXT.outroDesc}</p>
    <Link to={PATHS.projects} className={styles.primary}>{UI_TEXT.viewAllProjects}</Link>
  </div>
);

const EndPage = () => <div className={styles.end}><p>{BOOK_TEXT.endMark}</p></div>;

// 페이지 목록 (짝수 개 = 펼침 단위) : [소개, 작품…, 마무리, 끝]
const buildPages = (projects) => {
  const pages = [
    <IntroPage key="intro" count={projects.length} />,
    ...projects.map((p, i) => <ProjectPage key={p.projectId} project={p} pageNo={i + 1} first={i === 0} />),
    <OutroPage key="outro" />,
  ];
  if (pages.length % 2) pages.push(<EndPage key="end" />);
  return pages;
};

// =============================================================
const FeaturedBook = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  if (isMobile || reduceMotion) return <SimpleBook still={reduceMotion} />;
  return <ScrollBook />;
};

// ---- PC: 스크롤 타임라인 ----
const ScrollBook = () => {
  const projects = getFeaturedProjects();
  const pages = buildPages(projects);
  const spreads = pages.length / 2;
  const flips = spreads - 1;
  const total = SEG.opening + SEG.reveal + flips * SEG.flip + SEG.end; // 화면 높이 단위

  const scrollerRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const bookRef = useRef(null);
  const framesRef = useRef([]);
  const drawnRef = useRef(-1);
  const autoRef = useRef(null); // 자동 재생(자동 스크롤) 애니메이션 id
  const [spread, setSpread] = useState(0);
  const [ready, setReady] = useState(false); // 등장 완료 → 버튼 표시

  // 타임라인 위치(화면 높이 단위) → 실제 스크롤 위치
  const posToScrollY = useCallback((pos) => {
    const scroller = scrollerRef.current;
    const stageHeight = window.innerHeight - HEADER_HEIGHT;
    const distance = scroller.offsetHeight - stageHeight;
    const top = scroller.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
    return top + (pos / total) * distance;
  }, [total]);

  // ---- 프레임 미리 불러오기 ----
  useEffect(() => {
    framesRef.current = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = frameSrc(i);
      if (i === 0) img.onload = () => drawFrame(0, true);
      return img;
    });
  }, []);

  const drawFrame = (index, force = false) => {
    if (!force && drawnRef.current === index) return;
    const canvas = canvasRef.current;
    // 아직 안 불러온 프레임이면 가장 가까운 앞 프레임
    let i = index;
    while (i > 0 && !framesRef.current[i]?.complete) i--;
    const img = framesRef.current[i];
    if (!canvas || !img?.complete || !img.naturalWidth) return;
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    drawnRef.current = index;
  };

  // ---- 스크롤 → 영상 프레임 / 등장 정도 / 펼침 번호 ----
  useEffect(() => {
    let frame = null;
    let idleTimer = null;
    let lastY = window.scrollY;
    let goingDown = true;

    const update = () => {
      frame = null;
      const scroller = scrollerRef.current;
      const stage = stageRef.current;
      if (!scroller || !stage) return;

      const rect = scroller.getBoundingClientRect();
      const stageHeight = window.innerHeight - HEADER_HEIGHT;
      const distance = scroller.offsetHeight - stageHeight;
      const pos = clamp01((HEADER_HEIGHT - rect.top) / distance) * total;

      // ① 오프닝 영상
      const openT = clamp01(pos / SEG.opening);
      drawFrame(Math.round(openT * (FRAME_COUNT - 1)));
      stage.style.setProperty("--heading", (1 - clamp01(openT * 2.5)).toFixed(3));

      // ② 내용 등장
      const revealT = clamp01((pos - SEG.opening) / SEG.reveal);
      stage.style.setProperty("--reveal", revealT.toFixed(3));
      setReady(revealT >= 1);

      // ③ 책장 넘김 — 각 구간의 절반을 지나면 다음 펼침
      const flipT = (pos - SEG.opening - SEG.reveal) / SEG.flip;
      const target = Math.min(Math.max(Math.floor(flipT + 0.5), 0), flips);
      setSpread((prev) => (prev === target ? prev : target));
    };

    const request = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    // 스크롤을 멈추면 오프닝·등장을 끝까지 자동으로 이어 재생
    const onScroll = () => {
      goingDown = window.scrollY >= lastY;
      lastY = window.scrollY;
      request();
      clearTimeout(idleTimer);
      if (autoRef.current) return; // 자동 재생 중 생긴 스크롤은 무시
      idleTimer = setTimeout(autoPlay, 220);
    };

    const autoPlay = () => {
      const scroller = scrollerRef.current;
      if (!scroller || !goingDown) return;
      const rect = scroller.getBoundingClientRect();
      const stageHeight = window.innerHeight - HEADER_HEIGHT;
      const distance = scroller.offsetHeight - stageHeight;
      const pos = clamp01((HEADER_HEIGHT - rect.top) / distance) * total;
      const endPos = SEG.opening + SEG.reveal;
      if (pos <= 0.02 || pos >= endPos - 0.01) return; // 오프닝·등장 구간에서만

      const fromY = window.scrollY;
      const toY = posToScrollY(endPos);
      // 남은 영상 길이만큼(실제 재생 속도) + 등장 시간
      const remainingFrames = (1 - clamp01(pos / SEG.opening)) * FRAME_COUNT;
      const duration = Math.min(remainingFrames / FRAME_FPS * 1000 + 900, 6000);
      const start = performance.now();

      const step = (now) => {
        const t = clamp01((now - start) / duration);
        window.scrollTo({ top: fromY + (toY - fromY) * easeInOut(t), behavior: "instant" });
        autoRef.current = t < 1 ? requestAnimationFrame(step) : null;
      };
      autoRef.current = requestAnimationFrame(step);
    };

    // 사용자가 직접 움직이면 자동 재생 중단
    const stopAuto = () => {
      if (autoRef.current) {
        cancelAnimationFrame(autoRef.current);
        autoRef.current = null;
      }
    };

    request();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", request);
    ["wheel", "touchstart", "keydown", "mousedown"].forEach((e) => window.addEventListener(e, stopAuto, { passive: true }));
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", request);
      ["wheel", "touchstart", "keydown", "mousedown"].forEach((e) => window.removeEventListener(e, stopAuto));
      clearTimeout(idleTimer);
      stopAuto();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [flips, total, posToScrollY]);

  // ---- 펼침 번호가 바뀌면 책장 넘기기 (한 번에 한 장씩) ----
  useEffect(() => {
    const flipToTarget = () => {
      const pf = bookRef.current?.pageFlip?.();
      if (!pf) return;
      const current = Math.floor(pf.getCurrentPageIndex() / 2);
      if (current === spread) return;
      if (pf.getState?.() !== "read") return; // 넘기는 중이면 끝난 뒤 다시
      if (spread > current) pf.flipNext("top");
      else pf.flipPrev("top");
    };
    flipToTarget();
    const id = setInterval(flipToTarget, 150); // 여러 장 차이 나면 이어서
    return () => clearInterval(id);
  }, [spread]);

  // ---- 버튼·키보드: 해당 펼침의 스크롤 위치로 ----
  const goToSpread = (k) => {
    const target = Math.min(Math.max(k, 0), flips);
    window.scrollTo({ top: posToScrollY(SEG.opening + SEG.reveal + target * SEG.flip), behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!ready || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect || rect.top > HEADER_HEIGHT + 1 || rect.bottom < window.innerHeight - 1) return; // 고정된 동안만
      e.preventDefault();
      goToSpread(spread + (e.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section id={SECTION_IDS.projects} data-header-theme="dark" className={styles.section} aria-label={BOOK_TEXT.coverLabel}>
      <div ref={scrollerRef} className={styles.scroller} style={{ "--total": total }}>
        <div ref={stageRef} className={styles.stage}>
          <h2 className={styles.heading}>{BOOK_TEXT.coverLabel}</h2>

          <div className={styles.frame}>
            <canvas ref={canvasRef} width={1280} height={720} className={styles.canvas} aria-hidden="true" />
            <div
              className={`${styles.pages} ${ready ? styles.pagesReady : ""}`}
              style={{
                left: `${PAGE_RECT.left}%`,
                top: `${PAGE_RECT.top}%`,
                width: `${PAGE_RECT.width}%`,
                height: `${PAGE_RECT.height}%`,
              }}
            >
              <HTMLFlipBook
                ref={bookRef}
                width={419}
                height={490}
                size="stretch"
                minWidth={150}
                maxWidth={2000}
                minHeight={175}
                maxHeight={2400}
                showCover={false}
                usePortrait={false}
                drawShadow
                maxShadowOpacity={0.45}
                flippingTime={900}
                useMouseEvents={false}
                mobileScrollSupport={false}
                className={styles.flipbook}
              >
                {pages.map((content, i) => (
                  <Page key={i} side={i % 2 ? "right" : "left"}>{content}</Page>
                ))}
              </HTMLFlipBook>
            </div>
          </div>

          <div className={`${styles.controls} ${ready ? styles.controlsVisible : ""}`}>
            <button type="button" className={styles.navButton} onClick={() => goToSpread(spread - 1)} disabled={spread === 0} aria-label={BOOK_TEXT.prev}>‹</button>
            <p className={styles.progress} aria-live="polite">
              {String(spread + 1).padStart(2, "0")} / {String(spreads).padStart(2, "0")}
            </p>
            <button type="button" className={styles.navButton} onClick={() => goToSpread(spread + 1)} disabled={spread === flips} aria-label={BOOK_TEXT.next}>›</button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---- 모바일 · 동작 줄이기: 영상(또는 정지 이미지) + 카드 목록 ----
const SimpleBook = ({ still }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (still) return undefined;
    const video = videoRef.current;
    if (!video) return undefined;
    // 화면에 절반 이상 보이면 한 번 재생
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(video);
    return () => io.disconnect();
  }, [still]);

  return (
    <>
      <section data-header-theme="dark" className={styles.simple} aria-label={BOOK_TEXT.coverLabel}>
        <h2 className={styles.simpleHeading}>{BOOK_TEXT.coverLabel}</h2>
        {still ? (
          <img src={LAST_FRAME} alt="" className={styles.simpleMedia} />
        ) : (
          <video ref={videoRef} className={styles.simpleMedia} muted playsInline preload="metadata" poster={frameSrc(0)}>
            <source src={VIDEO_SRC.webm} type="video/webm" />
            <source src={VIDEO_SRC.mp4} type="video/mp4" />
          </video>
        )}
      </section>
      <FeaturedProjects />
    </>
  );
};

export default FeaturedBook;
