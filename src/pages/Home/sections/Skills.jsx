import { SECTION_IDS } from "@/routes/paths";
import { SKILL_GROUPS } from "@/data/skills";
import { SECTION_TITLES } from "@/data/site";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";
import styles from "./Section.module.scss";

const Skills = () => (
  <section id={SECTION_IDS.skills} className={styles.section}>
    <SectionTitle>{SECTION_TITLES.skills}</SectionTitle>
    {SKILL_GROUPS.map((group) => (
      <div key={group.title}>
        <h3>{group.title}</h3>
        <p className={styles.muted}>{group.items.join(" · ")}</p>
      </div>
    ))}
  </section>
);

export default Skills;
