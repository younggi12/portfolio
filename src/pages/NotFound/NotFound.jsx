// 404 — 없는 주소 · 상세 페이지가 없는 작품
// 큰 "404" + 깜빡이는 커서(헤더 로고와 같은 연출) → 안내 문구 → 홈 · 작품 소개 버튼
// 들어올 때 위에서부터 차례로 서서히 나타남 (상세 페이지 첫 화면과 같은 방식)
import { Link } from "react-router-dom";
import { PATHS, SECTION_IDS } from "@/routes/paths";
import { NOT_FOUND_TEXT } from "@/data/site";
import styles from "./NotFound.module.scss";

const NotFound = () => (
  <section className={styles.page} data-header-theme="light" aria-labelledby="not-found-title">
    <p className={styles.code} aria-hidden="true">
      {NOT_FOUND_TEXT.code}
      <span className={styles.cursor} />
    </p>
    <h1 id="not-found-title" className={styles.title}>{NOT_FOUND_TEXT.title}</h1>
    <p className={styles.description}>{NOT_FOUND_TEXT.description}</p>

    <div className={styles.actions}>
      <Link to={PATHS.home} className={styles.primary}>{NOT_FOUND_TEXT.home}</Link>
      <Link to={{ pathname: PATHS.home, hash: `#${SECTION_IDS.projects}` }} className={styles.secondary}>
        {NOT_FOUND_TEXT.projects}
      </Link>
    </div>
  </section>
);

export default NotFound;