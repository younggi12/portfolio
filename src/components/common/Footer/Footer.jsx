import { PROFILE } from "@/data/profile";
import styles from "./Footer.module.scss";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <p>© 2026 {PROFILE.nameEn}</p>
      <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
    </div>
  </footer>
);

export default Footer;
