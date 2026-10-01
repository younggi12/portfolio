// 5번(레이아웃) 작업에서 디자인 완성 예정 — 지금은 동작 확인용 뼈대
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { NAV_ITEMS } from "@/data/site";
import styles from "./Header.module.scss";

const Header = () => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <Link to={PATHS.home} className={styles.logo}>{PROFILE.name}</Link>
      <nav aria-label="주요 메뉴">
        <ul className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <li key={item.sectionId}>
              <Link to={{ pathname: PATHS.home, hash: `#${item.sectionId}` }}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
