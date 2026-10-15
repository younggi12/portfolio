// 프로젝트 상세 — Hero · About · 작품 소개와 같은 결 (흰 바탕 · 큰 검은 글자 · 번호 · 선)
// ① 검은 표지: 왼쪽 큰 이름 · 부제 · 한 줄 소개 | 오른쪽 대표 사진 (모두 검은 배경 안)
// ② 흰 부분: 왼쪽 고정 칸(작은 이름 · 기간 · 담당 · 기술 · 링크 · 목차) + 오른쪽(기능 → 문제 해결 → 개선할 점)
// ③ 다른 작품 — 번호 줄 목록 (마우스를 올리면 검은 배경이 차오름)
// 내용은 data/projects.js의 detail 필드 (hasDetail: true인 작품만)
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PATHS, SECTION_IDS, toProjectDetail } from "@/routes/paths";
import { getDetailProjects, getProjectById } from "@/data/projects";
import { DETAIL_TEXT, LIGHTBOX_TEXT, UI_TEXT } from "@/data/site";
import { getProjectImage } from "@/utils/getProjectImage";
import NotFound from "@/pages/NotFound/NotFound";
import Lightbox from "@/components/common/Lightbox/Lightbox";
import SkillIcon from "@/components/common/SkillIcon/SkillIcon";
import { getStackIcon } from "@/utils/skillIcons";
import { scrollToElement, scrollToY } from "@/utils/scrollToY";
import { Maximize2 } from "lucide-react";
import styles from "./ProjectDetail.module.scss";

// 문장 속 `코드`를 <code>로 표시
const Rich = ({ text }) =>
  text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith("`") ? <code key={i}>{part.slice(1, -1)}</code> : part,
  );

const pad = (n) => String(n).padStart(2, "0");

// 오른쪽 한 부분 — 작은 영문 줄("01 — FEATURE") + 큰 제목, id는 목차에서 이동할 때 씀
const Section = ({ id, eyebrow, title, children }) => (
  <section id={id} className={styles.section} data-toc>
    <div data-reveal>
      <p className={styles.sectionEyebrow}>{eyebrow}</p>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
    {children}
  </section>
);

const Problem = ({ problem }) => {
  const rows = [
    [DETAIL_TEXT.symptom, problem.symptom],
    [DETAIL_TEXT.tries, problem.tries],
    [DETAIL_TEXT.cause, problem.cause],
    [DETAIL_TEXT.solution, problem.solution],
  ].filter(([, value]) => value);

  return (
    <article className={styles.problem} data-reveal>
      <h3 className={styles.problemTitle}>{problem.title}</h3>
      <dl className={styles.steps}>
        {rows.map(([label, value], i) => (
          // 마지막 "해결" 줄만 검은 배경으로 강조
          <div key={label} className={`${styles.step} ${label === DETAIL_TEXT.solution ? styles.stepKey : ""}`}>
            <dt><span>{pad(i + 1)}</span>{label}</dt>
            <dd><Rich text={value} /></dd>
          </div>
        ))}
      </dl>
      {problem.lesson && <p className={styles.lesson}>{DETAIL_TEXT.lesson} — {problem.lesson}</p>}
    </article>
  );
};

// 기능 카드: 큰 화면 1개 + 아래 작은 칸들 (누르면 큰 화면이 바뀜)
// 화면으로 보여주기 어려운 기능은 실제 코드 일부(code)를 함께 보여줌 — 사진 뒤 마지막 칸 "</>"
const CODE = "__code__";

// 사진이 2:1에 가까우면 칸을 꽉 채우고(잘림 없음), 세로로 긴 사진(F1 방명록 등)은 잘리지 않게 전체를 보여줌
const handleFit = (e) => {
  const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
  e.currentTarget.dataset.fit = w / h < 1.9 ? "contain" : "cover";
};

// 마우스 위치(사진 안 %) → 확대 기준점
const handleZoomMove = (e) => {
  const box = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--zoom-x", `${((e.clientX - box.left) / box.width) * 100}%`);
  e.currentTarget.style.setProperty("--zoom-y", `${((e.clientY - box.top) / box.height) * 100}%`);
};

const Feature = ({ feature }) => {
  const [current, setCurrent] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false); // 사진 크게 보기
  const { title, text, images = [], code } = feature;
  const items = code ? [...images, CODE] : images;
  const active = items[current];
  const imageUrls = images.map(getProjectImage);

  return (
    <div className={styles.feature} data-reveal>
      <p className={styles.featureText}>{text}</p>
      {active === CODE ? (
        <figure className={styles.code}>
          <figcaption className={styles.codeFile}>{code.file}</figcaption>
          <pre><code>{code.snippet}</code></pre>
        </figure>
      ) : (
        active && (
          // 큰 사진을 누르면 화면 가득 크게 보기
          // 마우스를 올리면 마우스가 있는 곳을 확대해서 보여줌 (위치만 CSS 변수로 넘김)
          <button
            type="button"
            className={styles.zoom}
            onClick={() => setIsZoomed(true)}
            onMouseMove={handleZoomMove}
            aria-label={`${title} ${LIGHTBOX_TEXT.open}`}
          >
            <img
              src={getProjectImage(active)}
              alt={`${title} 화면`}
              className={styles.featureMain}
              loading="lazy"
              onLoad={handleFit}
            />
            <span className={styles.zoomIcon} aria-hidden="true"><Maximize2 size={16} strokeWidth={2} /></span>
          </button>
        )
      )}
      {isZoomed && (
        <Lightbox images={imageUrls} index={current} title={title} onChange={setCurrent} onClose={() => setIsZoomed(false)} />
      )}
      {/* 칸이 1개여도 작은 칸 줄을 둬서 세 카드의 제목 줄을 맞춤 */}
      {items.length > 0 && (
        <div className={styles.thumbs}>
          {items.map((item, i) => (
            <button
              key={item}
              type="button"
              className={`${styles.thumb} ${item === CODE ? styles.thumbCode : ""} ${i === current ? styles.thumbActive : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={item === CODE ? `${title} 코드` : `${title} 화면 ${i + 1}`}
            >
              {item === CODE ? <span>{"</>"}</span> : <img src={getProjectImage(item)} alt="" loading="lazy" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 왼쪽 목차 — 지금 화면 가운데쯤 있는 부분을 진하게 (data-toc 섹션을 지켜봄)
const useActiveToc = (ids) => {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(",");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" }); // 화면 위에서 40% ~ 45% 띠를 지나는 부분
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
};

// 표지 ↔ 본문 한 번에 — 표지에서 휠을 아래로 굴리면 본문 시작(고정 칸 · 첫 기능)으로, 본문 맨 위에서 위로 굴리면 표지로
// (마우스 휠만 — 터치 · 키보드 · 스크롤바는 그대로, 사이트 부드러운 스크롤보다 먼저 받아서 처리)
const SNAP_LOCK = 900; // 이동하는 동안 들어오는 휠은 무시(ms)
const useCoverSnap = (coverRef, key) => {
  useEffect(() => {
    const cover = coverRef.current;
    if (!cover || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let lockUntil = 0;
    const onWheel = (e) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const end = cover.getBoundingClientRect().bottom + window.scrollY; // 표지 끝 = 본문 시작
      const y = window.scrollY;
      const down = e.deltaY > 0 && y < end - 2;
      const up = e.deltaY < 0 && y > 2 && y <= end + 2;
      if (!down && !up) return;
      e.preventDefault();
      if (performance.now() < lockUntil) return;
      lockUntil = performance.now() + SNAP_LOCK;
      scrollToY(down ? end : 0);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [coverRef, key]);
};

const ProjectDetail = () => {
  const { projectId } = useParams();
  const project = getProjectById(projectId);
  const detailList = getDetailProjects();

  // 목차 항목 — 기능들 → 문제 해결 → 개선할 점 (있는 것만)
  const toc = !project?.detail ? [] : [
    ...(project.detail.features ?? []).map((f, i) => ({ id: `feature-${i + 1}`, label: f.title })),
    ...(project.detail.problem ? [{ id: "problem", label: DETAIL_TEXT.problem }] : []),
    ...(project.detail.improvements ? [{ id: "improvements", label: DETAIL_TEXT.improvements }] : []),
  ];
  const active = useActiveToc(toc.map((t) => t.id));
  const coverRef = useRef(null);
  useCoverSnap(coverRef, projectId);

  // 없는 프로젝트이거나 상세 페이지가 없는 프로젝트는 404 (AGENTS.md 5장)
  if (!project || !project.hasDetail || !project.detail) return <NotFound />;

  const { name, category, type, teamSize, period, role, summary, stack, thumbnail, links, detail } = project;
  const [title, subtitle] = name.split(" — ");
  const no = detailList.indexOf(project) + 1;
  const metaLine = [
    `${pad(no)} / ${pad(detailList.length)}`,
    type === "team" ? UI_TEXT.teamSize(teamSize) : UI_TEXT.solo,
    category.toUpperCase(),
  ].join("  ·  ");
  const features = detail.features ?? [];
  let part = 0; // 오른쪽 부분 번호 (01 — FEATURE, 02 — FEATURE, …)

  const linkList = links.length > 0 && (
    <div className={styles.links}>
      {links.map((link, i) => (
        <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={i === 0 ? styles.primary : styles.secondary}>
          {link.label} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );

  const handleToc = (e, id) => {
    e.preventDefault();
    scrollToElement(document.getElementById(id));
  };

  return (
    // key: 다른 작품으로 넘어갈 때 페이지를 새로 그려 등장 연출 · 사진 선택을 처음부터
    <article key={projectId} className={styles.page}>
      {/* ① 검은 표지 */}
      <header ref={coverRef} className={styles.cover} data-header-theme="dark">
        <div className={styles.coverInner}>
          <div className={styles.coverTop}>
            <Link to={{ pathname: PATHS.home, hash: `#${SECTION_IDS.projects}` }} className={styles.back}>
              ← {DETAIL_TEXT.back}
            </Link>
            <p className={styles.coverMeta}>{metaLine}</p>
          </div>
          {/* 왼쪽 글 | 오른쪽 대표 사진 (2:1, 잘리지 않음) */}
          <div className={styles.coverBody}>
            <div className={styles.coverText}>
              <h1 className={styles.coverTitle}>{title}</h1>
              {subtitle && <p className={styles.coverSubtitle}>{subtitle}</p>}
              <p className={styles.coverSummary}>{summary}</p>
            </div>
            <img src={getProjectImage(thumbnail)} alt={`${title} 메인 화면`} className={styles.coverImage} />
          </div>
        </div>
      </header>

      {/* ② 흰 부분: 왼쪽 고정 칸 + 오른쪽 내용 */}
      <div className={styles.body} data-header-theme="light">
        <aside className={styles.aside}>
          <p className={styles.asideMeta}>{metaLine}</p>
          <p className={styles.asideTitle}>{title}</p>
          {subtitle && <p className={styles.asideSubtitle}>{subtitle}</p>}
          <dl className={styles.meta}>
            <div><dt>{DETAIL_TEXT.period}</dt><dd>{period}</dd></div>
            <div><dt>{DETAIL_TEXT.role}</dt><dd>{role}</dd></div>
            <div>
              <dt>{DETAIL_TEXT.stack}</dt>
              <dd>
                <ul className={styles.stackList}>
                  {stack.map((item) => (
                    <li key={item}>
                      <SkillIcon name={getStackIcon(item)} />
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          {linkList}
          {/* 목차 — 지금 보는 부분만 진하게 + 앞에 선, 누르면 그 부분으로 */}
          <nav className={styles.toc} aria-label={DETAIL_TEXT.toc}>
            <ol>
              {toc.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleToc(e, item.id)}
                    className={active === item.id ? styles.tocOn : undefined}
                    aria-current={active === item.id ? "location" : undefined}
                  >
                    <span>{pad(i + 1)}</span>{item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className={styles.main}>
          {features.map((f, i) => {
            part += 1;
            return (
              <Section key={f.title} id={`feature-${i + 1}`} eyebrow={`${pad(part)} — ${DETAIL_TEXT.eyebrow.feature}`} title={f.title}>
                <Feature feature={f} />
              </Section>
            );
          })}

          {detail.problem && (
            <Section id="problem" eyebrow={`${pad(++part)} — ${DETAIL_TEXT.eyebrow.problem}`} title={DETAIL_TEXT.problem}>
              <Problem problem={detail.problem} />
            </Section>
          )}

          {detail.improvements && (
            <Section id="improvements" eyebrow={`${pad(++part)} — ${DETAIL_TEXT.eyebrow.improvements}`} title={DETAIL_TEXT.improvements}>
              <ol className={styles.list} data-reveal>
                {detail.improvements.map((c, i) => (
                  <li key={c}><span>{pad(i + 1)}</span><p><Rich text={c} /></p></li>
                ))}
              </ol>
            </Section>
          )}
        </div>
      </div>

      {/* ③ 다른 작품 — 번호 줄 목록, 지금 보는 작품은 표시만 */}
      <nav className={styles.others} aria-label={DETAIL_TEXT.others} data-header-theme="light">
        <div data-reveal>
          <p className={styles.sectionEyebrow}>{DETAIL_TEXT.eyebrow.others}</p>
          <h2 className={styles.sectionTitle}>{DETAIL_TEXT.others}</h2>
        </div>
        <ul className={styles.othersList}>
          {detailList.map((item, i) => {
            const isCurrent = item.projectId === projectId;
            const [itemTitle, itemSub] = item.name.split(" — ");
            const inner = (
              <>
                <span className={styles.othersNo}>{pad(i + 1)}</span>
                <span className={styles.othersName}>{itemTitle}</span>
                <span className={styles.othersSub}>{isCurrent ? DETAIL_TEXT.current : itemSub}</span>
                <span className={styles.othersMedia} aria-hidden="true">
                  <img src={getProjectImage(item.thumbnail)} alt="" loading="lazy" />
                </span>
              </>
            );
            return (
              <li key={item.projectId}>
                {isCurrent ? (
                  <span className={`${styles.othersItem} ${styles.othersOn}`} aria-current="page">{inner}</span>
                ) : (
                  <Link to={toProjectDetail(item.projectId)} className={styles.othersItem}>{inner}</Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </article>
  );
};

export default ProjectDetail;
