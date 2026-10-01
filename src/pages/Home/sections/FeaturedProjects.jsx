import { Link } from "react-router-dom";
import { PATHS, SECTION_IDS } from "@/routes/paths";
import { getFeaturedProjects } from "@/data/projects";
import { SECTION_TITLES, UI_TEXT } from "@/data/site";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";
import ProjectCard from "@/components/ui/ProjectCard/ProjectCard";
import styles from "./Section.module.scss";

const FeaturedProjects = () => (
  <section id={SECTION_IDS.projects} className={styles.section}>
    <SectionTitle>{SECTION_TITLES.featured}</SectionTitle>
    <div className={styles.grid}>
      {getFeaturedProjects().map((project) => (
        <ProjectCard key={project.projectId} project={project} />
      ))}
    </div>
    <Link to={PATHS.projects} className={styles.more}>{UI_TEXT.viewAllProjects}</Link>
  </section>
);

export default FeaturedProjects;
