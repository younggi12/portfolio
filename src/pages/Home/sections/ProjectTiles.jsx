// 작품 소개 — Apple 홈페이지 제품 타일 방식
// 2열 타일, 타일마다: 분류 → 큰 이름 → 한 줄 소개 → 버튼 2개 → 아래 큰 스크린샷
// 배경은 연한 하늘색 / 검정을 체크무늬로 번갈아 (모바일은 1열)
import { Link } from "react-router-dom";
import { SECTION_IDS, toProjectDetail } from "@/routes/paths";
import { PROJECTS } from "@/data/projects";
import { SECTION_TITLES, UI_TEXT } from "@/data/site";
import { getProjectImage } from "@/utils/getProjectImage";
import styles from "./ProjectTiles.module.scss";

// 2열 체크무늬: 0행 [밝음, 검정] / 1행 [검정, 밝음] ...
const toneOf = (index) => ((Math.floor(index / 2) + index) % 2 ? "dark" : "light");

// "JAJAK — 전통주 AI 큐레이션 쇼핑몰" → 제목 / 부제
const splitName = (name) => {
  const [title, subtitle = ""] = name.split(" — ");
  return { title, subtitle };
};

const Tile = ({ project, index }) => {
  const { projectId, name, type, category, teamSize, thumbnail, links, hasDetail } = project;
  const { title, subtitle } = splitName(name);
  const tone = toneOf(index);
  // 버튼 2개: 상세 페이지가 있으면 [자세히 보기, 첫 링크], 없으면 [첫 링크, 둘째 링크]
  const [first, second] = links;
  const primary = hasDetail ? { label: UI_TEXT.viewDetail, to: toProjectDetail(projectId) } : first;
  const secondary = hasDetail ? first : second;

  return (
    <article className={`${styles.tile} ${styles[tone]}`} data-header-theme={tone === "dark" ? "dark" : "band"}>
      <div className={styles.text}>
        <p className={styles.eyebrow}>
          {category} · {type === "team" ? UI_TEXT.teamSize(teamSize) : UI_TEXT.solo}
        </p>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <div className={styles.actions}>
          {primary?.to && <Link to={primary.to} className={styles.primary}>{primary.label}</Link>}
          {primary?.href && <a href={primary.href} target="_blank" rel="noreferrer" className={styles.primary}>{primary.label}</a>}
          {secondary && <a href={secondary.href} target="_blank" rel="noreferrer" className={styles.secondary}>{secondary.label}</a>}
        </div>
      </div>
      <img src={getProjectImage(thumbnail)} alt={`${title} 화면`} className={styles.image} loading="lazy" />
    </article>
  );
};

const ProjectTiles = () => (
  <section id={SECTION_IDS.projects} data-header-theme="light" className={styles.section} aria-label={SECTION_TITLES.allProjects}>
    <div className={styles.grid}>
      {PROJECTS.map((project, index) => <Tile key={project.projectId} project={project} index={index} />)}
    </div>
  </section>
);

export default ProjectTiles;
