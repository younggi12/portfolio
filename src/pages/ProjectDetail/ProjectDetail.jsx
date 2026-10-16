// 프로젝트 상세 — Hero · About · 작품 소개와 같은 결 (흰 바탕 · 큰 검은 글자 · 번호 · 선)
// ① 검은 표지: 왼쪽 큰 이름 · 부제 · 한 줄 소개 | 오른쪽 대표 사진 (모두 검은 배경 안)
// ② 흰 부분: 왼쪽 고정 칸(작은 이름 · 기간 · 담당 · 기술 · 링크 · 목차) + 오른쪽(기능 → 문제 해결 → 개선할 점)
// ③ 다른 작품 — 번호 줄 목록 (마우스를 올리면 검은 배경이 차오름)
// 내용은 data/projects.js의 detail 필드 (hasDetail: true인 작품만)
import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { PATHS, SECTION_IDS, toProjectDetail } from "@/routes/paths";
import { getDetailProjects, getProjectById } from "@/data/projects";
import { DETAIL_TEXT, UI_TEXT } from "@/data/site";
import { getProjectImage } from "@/utils/getProjectImage";
import NotFound from "@/pages/NotFound/NotFound";
import SkillIcon from "@/components/common/SkillIcon/SkillIcon";
import { getStackIcon } from "@/utils/skillIcons";
import { scrollToElement } from "@/utils/scrollToY";
import Feature from "./Feature";
import Problem from "./Problem";
import useActiveToc from "./useActiveToc";
import useCoverSnap from "./useCoverSnap";
import { pad, Rich } from "./detailText";
import styles from "./ProjectDetail.module.scss";

// 제목에서 가장 긴 단어의 너비(영문 대문자 1칸 기준, 한글은 더 넓어서 1.45칸) — 표지 제목 크기 계산용
const titleChars = (text) =>
  Math.max(...text.split(" ").map((word) => [...word].reduce((sum, ch) => sum + (/[가-힣]/.test(ch) ? 1.45 : 1), 0)));

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

  const { name, category, type, teamSize, role, summary, stack, thumbnail, coverZoom, links, detail } = project;
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
          {/* 글은 오른쪽 아래 — 왼쪽 위 '작품 목록으로'와 대각선 */}
          <div className={styles.coverBody}>
            <div className={styles.coverText}>
              <div>
                {/* --chars: 가장 긴 단어 글자 수 → 제목이 칸을 넘지 않는 선에서 최대한 크게 */}
                <h1 className={styles.coverTitle} style={{ "--chars": titleChars(title) }}>{title}</h1>
                {subtitle && <p className={styles.coverSubtitle}>{subtitle}</p>}
                <p className={styles.coverSummary}>{summary}</p>
              </div>
              {links.length > 0 && (
                <div className={styles.coverLinks}>
                  {links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                      {link.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 대표 사진 — 표지 전체 배경 (어둡게, 아래로 갈수록 검정에 스며듦) */}
        <img
          src={getProjectImage(thumbnail)}
          alt={`${title} 메인 화면`}
          className={styles.coverImage}
          style={coverZoom ? { "--cover-zoom": coverZoom } : undefined}
        />
      </header>

      {/* ② 흰 부분: 왼쪽 고정 칸 + 오른쪽 내용 */}
      <div className={styles.body} data-header-theme="light">
        <aside className={styles.aside}>
          <p className={styles.asideMeta}>{metaLine}</p>
          <p className={styles.asideTitle}>{title}</p>
          {subtitle && <p className={styles.asideSubtitle}>{subtitle}</p>}
          <dl className={styles.meta}>
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
