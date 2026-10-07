// About — 위: 사진 + (역할 · 이름 · 소개 · 숫자 칸 · 교육 과정) / 아래: 배운 것 카드 4개
import { SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import { ABOUT_TEXT, SECTION_TITLES } from "@/data/site";
import { SKILL_ICONS } from "@/utils/skillIcons";
import styles from "./About.module.scss";

const PHOTO_SRC = PROFILE.photo ? `${import.meta.env.BASE_URL}images/${PROFILE.photo}` : "";

// 숫자는 데이터에서 계산 (작품이 늘면 자동으로 바뀜)
const STATS = [
  { value: PROJECTS.length, unit: ABOUT_TEXT.unit.count, label: ABOUT_TEXT.stats.projects },
  { value: PROJECTS.filter((p) => p.type === "team").length, unit: ABOUT_TEXT.unit.count, label: ABOUT_TEXT.stats.team },
  { value: PROJECTS.filter((p) => p.type === "solo").length, unit: ABOUT_TEXT.unit.count, label: ABOUT_TEXT.stats.solo },
  { value: PROFILE.education.months, unit: ABOUT_TEXT.unit.months, label: ABOUT_TEXT.stats.months },
];

// 브랜드 아이콘(simple-icons: path 데이터) / 개념 아이콘(lucide: 컴포넌트)
const SkillIcon = ({ name }) => {
  const icon = SKILL_ICONS[name];
  if (!icon) return null;
  if (!icon.path) {
    const LineIcon = icon;
    return <LineIcon size={16} strokeWidth={2} className={styles.iconLine} aria-hidden="true" />;
  }
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
};

const About = () => (
  <section data-header-theme="band" id={SECTION_IDS.about} className={styles.about} aria-label={SECTION_TITLES.about}>
    <div className={styles.inner}>
      <div className={styles.top}>
        <div className={styles.photo} data-reveal>
          {PHOTO_SRC ? (
            <img src={PHOTO_SRC} alt={`${PROFILE.name} 사진`} />
          ) : (
            <span className={styles.placeholder} aria-hidden="true">{PROFILE.logo}</span>
          )}
        </div>

        <div className={styles.content}>
          <p className={styles.role} data-reveal>{PROFILE.role}</p>
          <h2 className={styles.name} data-reveal>{PROFILE.name}</h2>
          {PROFILE.intro.map((line) => <p key={line} className={styles.intro} data-reveal>{line}</p>)}

          <ul className={styles.stats}>
            {STATS.map((stat) => (
              <li key={stat.label} data-reveal>
                <strong>{stat.value}<small>{stat.unit}</small></strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>

          <dl className={styles.education} data-reveal>
            <dt>{PROFILE.education.name}</dt>
            <dd>{PROFILE.education.period}</dd>
          </dl>
        </div>
      </div>

      <h3 className={styles.learnedTitle} data-reveal>{ABOUT_TEXT.learned}</h3>
      <div className={styles.learned}>
        {PROFILE.learned.map((group) => (
          <div key={group.title} className={styles.card} data-reveal>
            <h4 className={styles.cardTitle}>{group.title}</h4>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item.label}>
                  <SkillIcon name={item.icon} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default About;