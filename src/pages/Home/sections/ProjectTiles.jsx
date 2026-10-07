// 작품 소개 — Apple 홈페이지 제품 타일 방식
// 팀 / 개인 따로, 같은 크기 카드 4열.
// 카드에는 작품 사진만, 글(분류·이름·부제·버튼)은 카드 아래로 — 사진 카드 → 분류 → 이름 → 부제 → 버튼 2개
import { Link } from "react-router-dom";
import { SECTION_IDS, toProjectDetail } from "@/routes/paths";
import { getProjectsByType } from "@/data/projects";
import { SECTION_TITLES, UI_TEXT } from "@/data/site";
import { getProjectImage } from "@/utils/getProjectImage";
import styles from "./ProjectTiles.module.scss";

// 팀 프로젝트 → 개인 프로젝트 순서 (카드 크기는 모두 같음)
const GROUPS = [
  { type: "team", title: SECTION_TITLES.team },
  { type: "solo", title: SECTION_TITLES.solo },
];

// "JAJAK — 전통주 AI 큐레이션 쇼핑몰" → 제목 / 부제
const splitName = (name) => {
  const [title, subtitle = ""] = name.split(" — ");
  return { title, subtitle };
};

const Tile = ({ project }) => {
  const { projectId, name, type, category, teamSize, thumbnail, links, hasDetail } = project;
  const { title, subtitle } = splitName(name);
  // 버튼 2개: 상세 페이지가 있으면 [자세히 보기, 첫 링크], 없으면 [첫 링크, 둘째 링크]
  const [first, second] = links;
  const primary = hasDetail ? { label: UI_TEXT.viewDetail, to: toProjectDetail(projectId) } : first;
  const secondary = hasDetail ? first : second;

  return (
    <article className={styles.tile}>
      <div className={styles.media}>
        <img src={getProjectImage(thumbnail)} alt={`${title} 화면`} className={styles.image} loading="lazy" />
      </div>
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
    </article>
  );
};

const ProjectTiles = () => (
  <section id={SECTION_IDS.projects} data-header-theme="light" className={styles.section} aria-label={SECTION_TITLES.allProjects}>
    {GROUPS.map((group) => (
      <div key={group.type} className={styles.group}>
        <h2 className={styles.groupTitle}>{group.title}</h2>
        <div className={styles.grid}>
          {getProjectsByType(group.type).map((project) => (
            <Tile key={project.projectId} project={project} />
          ))}
        </div>
      </div>
    ))}
  </section>
);

export default ProjectTiles;