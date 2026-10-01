import { getProjectsByType } from "@/data/projects";
import { SECTION_TITLES } from "@/data/site";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";
import ProjectCard from "@/components/ui/ProjectCard/ProjectCard";
import styles from "./Projects.module.scss";

// 필터 없이 팀 → 개인 순서로 섹션 분리 (AGENTS.md 5장)
const GROUPS = [
  { type: "team", title: SECTION_TITLES.team },
  { type: "solo", title: SECTION_TITLES.solo },
];

const Projects = () => (
  <div className={styles.page}>
    <SectionTitle as="h1">{SECTION_TITLES.allProjects}</SectionTitle>
    {GROUPS.map((group) => (
      <section key={group.type} className={styles.group} aria-label={group.title}>
        <h2 className={styles.groupTitle}>{group.title}</h2>
        <div className={styles.grid}>
          {getProjectsByType(group.type).map((project) => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        </div>
      </section>
    ))}
  </div>
);

export default Projects;
