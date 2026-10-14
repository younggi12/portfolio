// About — 위: 사진 + (역할 · 이름 · 소개 · 숫자 칸 · 교육 과정) / 아래: 배운 것 카드 5개(오른쪽 위 이모지)
import { SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import { ABOUT_TEXT, SECTION_TITLES } from "@/data/site";
import SkillIcon from "@/components/common/SkillIcon/SkillIcon";
import { getEmojiImage } from "@/utils/getEmojiImage";
import styles from "./About.module.scss";

const PHOTO_SRC = PROFILE.photo ? `${import.meta.env.BASE_URL}images/${PROFILE.photo}` : "";

// 숫자는 데이터에서 계산 (작품이 늘면 자동으로 바뀜)
const STATS = [
  { value: PROJECTS.length, unit: ABOUT_TEXT.unit.count, label: ABOUT_TEXT.stats.projects },
  { value: PROJECTS.filter((p) => p.type === "team").length, unit: ABOUT_TEXT.unit.count, label: ABOUT_TEXT.stats.team },
  { value: PROFILE.education.months, unit: ABOUT_TEXT.unit.months, label: ABOUT_TEXT.stats.months },
];

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
          {/* 첫 문장은 크게(한 줄 소개), 나머지는 본문 */}
          {PROFILE.intro.map((line, i) => (
            <p key={line} className={i === 0 ? styles.lead : styles.intro} data-reveal>{line}</p>
          ))}

          <ul className={styles.stats} data-reveal>
            {STATS.map((stat) => (
              <li key={stat.label} data-reveal>
                <span>{stat.label}</span>
                <strong>{stat.value}{stat.unit}</strong>
              </li>
            ))}
          </ul>

        </div>
      </div>

      {/* 배운 곳 = 제목, 과정 · 기간 = 아래 작은 줄 */}
      <div className={styles.learnedHead} data-reveal>
        <h3 className={styles.learnedTitle}>{ABOUT_TEXT.learned(PROFILE.education.school)}</h3>
        <p className={styles.course}>
          {PROFILE.education.course} · <span className={styles.period}>{PROFILE.education.period}</span>
        </p>
      </div>
      <div className={styles.learned}>
        {PROFILE.learned.map((group) => (
          <div key={group.title} className={styles.card} data-reveal>
            {/* 카드 오른쪽 위 그림 — 마우스를 올리면 옆모습(아이소메트릭)이 돌아서 정면 그림으로 */}
            {group.emoji && (
              <span className={styles.emoji} aria-hidden="true">
                <img src={getEmojiImage(group.emoji)} alt="" className={styles.emojiSide} loading="lazy" />
                {group.emojiFront && <img src={getEmojiImage(group.emojiFront)} alt="" className={styles.emojiFront} loading="lazy" />}
              </span>
            )}
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