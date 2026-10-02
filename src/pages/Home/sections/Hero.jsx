import { PROFILE } from "@/data/profile";
import styles from "./Section.module.scss";

// Apple식 2톤 제목: "이영기." 진하게 + 소개 문장은 흐리게
const Hero = () => (
  <section data-header-theme="light" className={styles.section} aria-label="소개">
    <div className={styles.inner}>
      <p className={styles.muted}>{PROFILE.role}</p>
      <h1 className={styles.headline}>
        {PROFILE.name}. <span className={styles.soft}>{PROFILE.tagline}</span>
      </h1>
    </div>
  </section>
);

export default Hero;
