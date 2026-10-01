import { SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { SECTION_TITLES } from "@/data/site";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";
import styles from "./Section.module.scss";

const About = () => (
  <section id={SECTION_IDS.about} className={styles.section}>
    <SectionTitle>{SECTION_TITLES.about}</SectionTitle>
    {PROFILE.intro.map((line) => <p key={line}>{line}</p>)}
    <p className={styles.muted}>{PROFILE.education}</p>
  </section>
);

export default About;
