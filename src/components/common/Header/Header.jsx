// 헤더는 항상 화면 위에 고정되고, 배경색은 아래에 깔린 섹션 색에 맞춰 바뀐다 (Apple 방식)
import { Link } from "react-router-dom";
import { PATHS, SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { NAV_ITEMS } from "@/data/site";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import useActiveSection from "@/hooks/useActiveSection";
import styles from "./Header.module.scss";

const HEADER_HEIGHT = 72; // _variables.scss의 $header-height와 같은 값
const SECTION_ORDER = NAV_ITEMS.map((item) => item.sectionId); // About → Projects → Contact(푸터)

const Header = () => {
  const theme = useHeaderTheme(HEADER_HEIGHT);
  // 지금 보고 있는 메뉴 (상세 페이지에서는 Projects)
  const active = useActiveSection(SECTION_ORDER, SECTION_IDS.projects);

  return (
    <header className={`${styles.header} ${styles[theme]}`}>
      <div className={styles.inner}>
        <Link to={PATHS.home} className={styles.logo} aria-label={`${PROFILE.name} 홈으로`}>
          {PROFILE.logo}
          <span className={styles.cursor} aria-hidden="true" />
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <li key={item.sectionId}>
                <Link
                  to={{ pathname: PATHS.home, hash: `#${item.sectionId}` }}
                  className={active === item.sectionId ? styles.active : undefined}
                  aria-current={active === item.sectionId ? "location" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;