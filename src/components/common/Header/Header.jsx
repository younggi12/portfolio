// 헤더는 화면 위에 고정되고(작품 소개 화면에서는 숨김), 배경색은 아래에 깔린 섹션 색에 맞춰 바뀐다 (Apple 방식)
import { Link, matchPath, useLocation } from "react-router-dom";
import { PATHS, SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { getProjectById } from "@/data/projects";
import { NAV_ITEMS } from "@/data/site";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import useActiveSection from "@/hooks/useActiveSection";
import useHideOnScroll from "@/hooks/useHideOnScroll";
import styles from "./Header.module.scss";

const HEADER_HEIGHT = 72; // _variables.scss의 $header-height와 같은 값
const SECTION_ORDER = NAV_ITEMS.map((item) => item.sectionId); // About → Projects → Contact(푸터)

const Header = () => {
  const theme = useHeaderTheme(HEADER_HEIGHT);
  // 지금 보고 있는 메뉴 (상세 페이지에서는 Projects)
  // 상세 페이지(있는 작품)는 Projects 표시, 404 등 다른 페이지는 표시 없음
  const { pathname } = useLocation();
  const detailId = matchPath(PATHS.projectDetail, pathname)?.params.projectId;
  const isDetail = Boolean(getProjectById(detailId)?.hasDetail);
  const active = useActiveSection(SECTION_ORDER, isDetail ? SECTION_IDS.projects : null);
  // 작품 소개 섹션이 화면을 덮는 동안 숨김
  const isHidden = useHideOnScroll(SECTION_IDS.projects, HEADER_HEIGHT);

  return (
    <header className={`${styles.header} ${styles[theme]} ${isHidden ? styles.hidden : ""}`}>
      <div className={styles.inner}>
        {/* 로고 → Home의 About (다른 페이지에서도 Home으로 와서 About으로) */}
        <Link
          to={{ pathname: PATHS.home, hash: `#${SECTION_IDS.about}` }}
          className={styles.logo}
          aria-label={`${PROFILE.name} 소개로`}
        >
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