// About — 왼쪽 사진, 오른쪽 소개 · 교육 과정 · 배운 것 (모바일은 사진이 위)
import { SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { SECTION_TITLES } from "@/data/site";
import styles from "./About.module.scss";

const PHOTO_SRC = PROFILE.photo ? `${import.meta.env.BASE_URL}images/${PROFILE.photo}` : "";

const About = () => (
  <section data-header-theme="band" id={SECTION_IDS.about} className={styles.about}>
    <div className={styles.inner}>
      <div className={styles.photo}>
        {PHOTO_SRC ? (
          <img src={PHOTO_SRC} alt={`${PROFILE.name} 사진`} />
        ) : (
          <span className={styles.placeholder} aria-hidden="true">PHOTO</span>
        )}
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{SECTION_TITLES.about}</h2>
        {PROFILE.intro.map((line) => <p key={line} className={styles.intro}>{line}</p>)}

        <dl className={styles.education}>
          <dt>{PROFILE.education.name}</dt>
          <dd>{PROFILE.education.period}</dd>
        </dl>

        <div className={styles.learned}>
          {PROFILE.learned.map((group) => (
            <div key={group.title} className={styles.group}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <ul className={styles.items}>
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default About;
