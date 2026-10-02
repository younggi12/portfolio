// 7번(Projects) 작업에서 디자인 완성 예정
// tone: "dark"(진한 카드) | "light"(연한 카드) — Apple Store처럼 번갈아 배치
import { Link } from "react-router-dom";
import { toProjectDetail } from "@/routes/paths";
import { UI_TEXT } from "@/data/site";
import { getProjectImage } from "@/utils/getProjectImage";
import styles from "./ProjectCard.module.scss";

const ProjectCard = ({ project, tone = "dark" }) => {
  const { projectId, name, category, type, teamSize, period, summary, thumbnail, links, hasDetail } = project;
  const thumbSrc = getProjectImage(thumbnail);

  return (
    <article className={`${styles.card} ${styles[tone]}`}>
      {thumbSrc && <img src={thumbSrc} alt="" className={styles.thumb} loading="lazy" />}
      <div className={styles.body}>
        <p className={styles.meta}>
          <span className={styles.tag}>{category}</span>
          <span>{type === "team" ? UI_TEXT.teamSize(teamSize) : UI_TEXT.solo}</span>
          <span>{period}</span>
        </p>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.summary}>{summary}</p>
        <div className={styles.links}>
          {hasDetail && (
            <Link to={toProjectDetail(projectId)} className={styles.primary}>{UI_TEXT.viewDetail}</Link>
          )}
          {links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={styles.secondary}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
