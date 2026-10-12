// 기술 아이콘 1개 (16px) — About "배운 것" 카드 · 상세 페이지 "기술" 칸에서 같이 사용
// 브랜드 아이콘(simple-icons: path 데이터) / 개념 아이콘(lucide: 컴포넌트)
import { SKILL_ICONS } from "@/utils/skillIcons";
import styles from "./SkillIcon.module.scss";

const SkillIcon = ({ name }) => {
  const icon = SKILL_ICONS[name];
  if (!icon) return null;
  if (!icon.path) {
    const LineIcon = icon;
    return <LineIcon size={16} strokeWidth={2} className={styles.line} aria-hidden="true" />;
  }
  return (
    <svg viewBox="0 0 24 24" className={styles.brand} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
};

export default SkillIcon;