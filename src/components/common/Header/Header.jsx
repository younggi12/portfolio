// 헤더는 항상 화면 위에 고정되고, 배경색은 아래에 깔린 섹션 색에 맞춰 바뀐다 (Apple 방식)
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { NAV_ITEMS } from "@/data/site";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import styles from "./Header.module.scss";

const HEADER_HEIGHT = 72; // _variables.scss의 $header-height와 같은 값

const Header = () => {
  const theme = useHeaderTheme(HEADER_HEIGHT);

  return (
    <header className={`${styles.header} ${styles[theme]}`}>
      <div className={styles.inner}>
        <Link to={PATHS.home} className={styles.logo} aria-label={`${PROFILE.name} 홈으로`}>{PROFILE.logo}</Link>
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
};

export default Header;
