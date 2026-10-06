// 푸터 = 연락처 (헤더의 Contact 메뉴가 여기로 스크롤)
import { SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { FOOTER_TEXT } from "@/data/site";
import styles from "./Footer.module.scss";

const Footer = () => (
  <footer id={SECTION_IDS.contact} className={styles.footer} data-header-theme="band">
    <div className={styles.inner}>
      <h2 className={styles.title}>{FOOTER_TEXT.title}</h2>
      <p className={styles.message}>{FOOTER_TEXT.message}</p>
      <a href={`mailto:${PROFILE.email}`} className={styles.email}>{PROFILE.email}</a>

      <div className={styles.actions}>
        <a href={`mailto:${PROFILE.email}`} className={styles.primary}>{FOOTER_TEXT.emailLabel}</a>
        <a href={PROFILE.github} target="_blank" rel="noreferrer" className={styles.link}>{FOOTER_TEXT.githubLabel} ↗</a>
      </div>

      <p className={styles.copy}>© 2026 {PROFILE.nameEn}</p>
    </div>
  </footer>
);

export default Footer;
