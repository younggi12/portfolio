// About — 첫 화면에서 내려오면 순서대로:
//   ⓪ "Hi, my name is YG" — 스크롤하면 YG가 Young Gi로 펼쳐짐 (화면에 붙어 있는 장면)
//   ① 교육 과정 한 줄(배운 곳 · 과정 · 기간) + 숫자 4줄(팀 · 개인 · 배운 기술 분야 · 교육 과정, 0부터 올라감) — 화면 하나 가득
//   ② 큰 사진(마우스를 따라 기울어짐) + 이름 · 한 줄 소개 · 일하는 방식 3줄 — 화면 하나 가득, 글은 사진 위아래에 맞춰 펼침
//   ③ 배운 기술 5줄 — 숫자 줄과 같은 모양(번호 · 분야 · 기술 · 그림), 화면 하나 가득
import { SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { ABOUT_TEXT, SECTION_TITLES } from "@/data/site";
import SkillIcon from "@/components/common/SkillIcon/SkillIcon";
import NameIntro from "./NameIntro";
import FactRows from "./FactRows";
import TiltPhoto from "./TiltPhoto";
import { PROFILE_ID, SKILLS_ID } from "./aboutShared";
import styles from "./About.module.scss";

const About = () => (
  <section data-header-theme="light" id={SECTION_IDS.about} className={styles.about} aria-label={SECTION_TITLES.about}>
    <NameIntro />
    <div className={styles.inner}>
      {/* ① 교육 과정 한 줄 + 숫자 */}
      <div className={`${styles.part} ${styles.facts}`} data-about-facts>
        <FactRows />
      </div>

      {/* ② 사진(마우스를 따라 기울어짐) + 이름 · 한 줄 소개 · 일하는 방식 3줄 */}
      <div id={PROFILE_ID} className={styles.part}>
      <div className={styles.profile}>
        <TiltPhoto />
        <div className={styles.content}>
          <p className={styles.eyebrow} data-reveal>{PROFILE.role.toUpperCase()} · {PROFILE.nameEn.toUpperCase()}</p>
          <h2 className={styles.name} data-reveal>{PROFILE.name}</h2>
          <p className={styles.lead} data-reveal>
            {PROFILE.lead.map(([text, strong]) => (strong ? <b key={text}>{text}</b> : <span key={text}>{text}</span>))}
          </p>
          <ol className={styles.ways} data-reveal>
            {PROFILE.ways.map((way, i) => (
              <li key={way}>
                <span className={styles.wayNo}>{String(i + 1).padStart(2, "0")}</span>
                {way}
              </li>
            ))}
          </ol>
        </div>
      </div>
      </div>

      {/* ③ 배운 기술 */}
      {/* 이동 기준점 — 제목은 등장 연출로 아래에 밀려 있을 수 있어 따로 둠 */}
      <span id={SKILLS_ID} className={styles.anchor} aria-hidden="true" />
      <div className={`${styles.part} ${styles.skills}`}>
      <div className={styles.learnedHead} data-reveal>
        <h3 className={styles.learnedTitle}>{ABOUT_TEXT.skillsTitle}</h3>
      </div>
      <ul className={styles.learned}>
        {PROFILE.learned.map((group, i) => (
          <li key={group.title} className={styles.skillRow} data-reveal>
            <span className={styles.skillNo}>{String(i + 1).padStart(2, "0")}</span>
            <h4 className={styles.skillName}>{group.title}</h4>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item.label}>
                  <SkillIcon name={item.icon} />
                  {item.label}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      </div>
    </div>
  </section>
);

export default About;