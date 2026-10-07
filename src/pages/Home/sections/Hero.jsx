// 첫 화면 — Apple 제품 소개 섹션 방식 (가운데 정렬: 라벨 → 큰 이름 → 한 줄 소개 → 보조 설명)
import { PROFILE } from "@/data/profile";
import styles from "./Hero.module.scss";

const Hero = () => (
  <section data-header-theme="light" className={styles.hero} aria-label="소개">
    <p className={styles.role}>{PROFILE.role}</p>
    <h1 className={styles.name}>{PROFILE.name}</h1>
    <p className={styles.tagline}>{PROFILE.tagline}</p>
    <p className={styles.description}>{PROFILE.description}</p>
  </section>
);

export default Hero;
