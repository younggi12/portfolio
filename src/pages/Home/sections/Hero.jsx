import { PROFILE } from "@/data/profile";
import styles from "./Section.module.scss";

const Hero = () => (
  <section className={styles.section} aria-label="소개">
    <p className={styles.muted}>{PROFILE.role}</p>
    <h1>{PROFILE.name}</h1>
    <p>{PROFILE.tagline}</p>
  </section>
);

export default Hero;
