// 프로젝트 상세 (짧게, 화면 약 2개) — 상단 → 개요 → 내가 만든 기능 → 문제 해결 1개 → 개선할 점
// 내용은 data/projects.js의 detail 필드 (hasDetail: true인 작품만)
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PATHS, SECTION_IDS } from "@/routes/paths";
import { getProjectById } from "@/data/projects";
import { DETAIL_TEXT, UI_TEXT } from "@/data/site";
import { getProjectImage } from "@/utils/getProjectImage";
import NotFound from "@/pages/NotFound/NotFound";
import styles from "./ProjectDetail.module.scss";

// 문장 속 `코드`를 <code>로 표시
const Rich = ({ text }) =>
  text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith("`") ? <code key={i}>{part.slice(1, -1)}</code> : part,
  );

const Section = ({ title, children }) => (
  <section className={styles.section}>
    <h2 className={styles.sectionTitle} data-reveal>{title}</h2>
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
        {rows.map(([label, value]) => (
          <div key={label} className={styles.step}>
            <dt>{label}</dt>
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

const Feature = ({ feature }) => {
  const [current, setCurrent] = useState(0);
  const { title, text, images = [], code } = feature;
  const items = code ? [...images, CODE] : images;
  const active = items[current];

  return (
    <div className={styles.feature} data-reveal>
      {active === CODE ? (
        <figure className={styles.code}>
          <figcaption className={styles.codeFile}>{code.file}</figcaption>
          <pre><code>{code.snippet}</code></pre>
        </figure>
      ) : (
        active && <img src={getProjectImage(active)} alt={`${title} 화면`} className={styles.featureMain} loading="lazy" />
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
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
};

const ProjectDetail = () => {
  const { projectId } = useParams();
  const project = getProjectById(projectId);

  // 없는 프로젝트이거나 상세 페이지가 없는 프로젝트는 404 (AGENTS.md 5장)
  if (!project || !project.hasDetail || !project.detail) return <NotFound />;

  const { name, category, type, teamSize, period, role, summary, stack, thumbnail, links, detail } = project;
  const [title, subtitle] = name.split(" — ");

  return (
    <article className={styles.page} data-header-theme="light">
      {/* 상단 */}
      <header className={styles.hero}>
        <Link to={{ pathname: PATHS.home, hash: `#${SECTION_IDS.projects}` }} className={styles.back}>
          ← {DETAIL_TEXT.back}
        </Link>
        <p className={styles.eyebrow}>
          {category} · {type === "team" ? UI_TEXT.teamSize(teamSize) : UI_TEXT.solo}
        </p>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <p className={styles.summary}>{summary}</p>
        {links.length > 0 && (
          <div className={styles.links}>
            {links.map((link, i) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={i === 0 ? styles.primary : styles.secondary}>
                {link.label}
              </a>
            ))}
          </div>
        )}
        <img src={getProjectImage(thumbnail)} alt={`${title} 메인 화면`} className={styles.heroImage} />
      </header>

      {/* 개요 표 */}
      <dl className={styles.meta}>
        <div><dt>{DETAIL_TEXT.period}</dt><dd>{period}</dd></div>
        <div><dt>{DETAIL_TEXT.role}</dt><dd>{role}</dd></div>
        <div><dt>{DETAIL_TEXT.stack}</dt><dd>{stack.join(" · ")}</dd></div>
      </dl>

      {detail.features && (
        <Section title={DETAIL_TEXT.features}>
          <div className={styles.features}>
            {detail.features.map((f) => <Feature key={f.title} feature={f} />)}
          </div>
        </Section>
      )}

      {detail.problem && (
        <Section title={DETAIL_TEXT.problem}>
          <Problem problem={detail.problem} />
        </Section>
      )}

      {detail.improvements && (
        <Section title={DETAIL_TEXT.improvements}>
          <ul className={styles.list} data-reveal>{detail.improvements.map((c) => <li key={c}><Rich text={c} /></li>)}</ul>
        </Section>
      )}
    </article>
  );
};

export default ProjectDetail;