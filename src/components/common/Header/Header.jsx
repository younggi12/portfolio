// 헤더는 화면 위에 고정되고(작품 소개 화면에서는 숨김), 배경색은 아래에 깔린 섹션 색에 맞춰 바뀐다 (Apple 방식)
import { Link, matchPath, useLocation } from "react-router-dom";
import { PATHS, SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { getProjectById } from "@/data/projects";
import { NAV_ITEMS } from "@/data/site";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import useActiveSection from "@/hooks/useActiveSection";
import useHideOnScroll from "@/hooks/useHideOnScroll";
import { jumpToTop, jumpToElement } from "@/utils/scrollToY";
import Logo from "./Logo";
import styles from "./Header.module.scss";

const HEADER_HEIGHT = 72; // _variables.scss의 $header-height와 같은 값
const SECTION_ORDER = NAV_ITEMS.map((item) => item.sectionId); // About → Projects → Contact(푸터)

// 이동할 곳 — About은 교육 과정 줄(이름 장면 다음, data-about-facts)을 화면 맨 위에 딱 맞춰, 나머지는 섹션 맨 위
const getTarget = (sectionId) => {
  const facts = sectionId === SECTION_IDS.about && document.querySelector("[data-about-facts]");
  return facts ? { el: facts, pad: 0 } : { el: document.getElementById(sectionId) };
};

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

  // Home에 있을 때는 페이지를 바꾸지 않고 그 위치로 한 번에 이동 (로고와 같은 흰 막 전환)
  // (주소가 이미 #about이면 Link만으로는 아무 일도 안 일어나서 — 로고를 두 번 눌러도 이동하게)
  // 다른 페이지에서는 Link 그대로 Home으로 가서 해당 섹션으로
  const handleNav = (e, sectionId) => {
    if (pathname !== PATHS.home) return;
    const { el, pad } = getTarget(sectionId);
    if (!el) return;
    e.preventDefault();
    jumpToElement(el, { pad }); // 로고처럼 흰 막 사이에 한 번에
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  // 로고 → 맨 위(Hero) — Home에선 흰 막 사이에 한 번에 이동(utils/scrollToY), 다른 페이지에선 Home으로
  const handleLogo = (e) => {
    if (pathname !== PATHS.home) return;
    e.preventDefault();
    window.history.replaceState(null, "", PATHS.home);
    jumpToTop();
  };

  return (
    <header className={`${styles.header} ${styles[theme]} ${isHidden ? styles.hidden : ""}`}>
      <div className={styles.inner}>
        {/* 로고 → Home 맨 위(Hero) */}
        <Link
          to={PATHS.home}
          className={styles.logo}
          aria-label={`${PROFILE.name} 처음으로`}
          onClick={handleLogo}
        >
          <Logo />
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <li key={item.sectionId}>
                <Link
                  to={{ pathname: PATHS.home, hash: `#${item.sectionId}` }}
                  className={active === item.sectionId ? styles.active : undefined}
                  aria-current={active === item.sectionId ? "location" : undefined}
                  onClick={(e) => handleNav(e, item.sectionId)}
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