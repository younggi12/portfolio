// 8번(상세 페이지) 작업에서 완성 예정 — 지금은 라우팅 확인용
import { Link, useParams } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { getProjectById } from "@/data/projects";
import { UI_TEXT } from "@/data/site";
import NotFound from "@/pages/NotFound/NotFound";
import styles from "./ProjectDetail.module.scss";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const project = getProjectById(projectId);

  // 없는 프로젝트이거나 상세 페이지가 없는 프로젝트는 404 (AGENTS.md 5장)
  if (!project || !project.hasDetail) return <NotFound />;

  return (
    <article className={styles.page}>
      <Link to={PATHS.projects} className={styles.back}>← {UI_TEXT.backToProjects}</Link>
      <h1 className={styles.title}>{project.name}</h1>
      <p className={styles.summary}>{project.summary}</p>
    </article>
  );
};

export default ProjectDetail;
