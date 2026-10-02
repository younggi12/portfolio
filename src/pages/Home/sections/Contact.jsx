import { SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { SECTION_TITLES } from "@/data/site";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";
import styles from "./Section.module.scss";

const Contact = () => (
  <section data-header-theme="light" id={SECTION_IDS.contact} className={styles.section}>
    <div className={styles.inner}>
      <SectionTitle>{SECTION_TITLES.contact}</SectionTitle>
      <p><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></p>
      <p><a href={PROFILE.github} target="_blank" rel="noreferrer">{PROFILE.github}</a></p>
    </div>
  </section>
);

export default Contact;
