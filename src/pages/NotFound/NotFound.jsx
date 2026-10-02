import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { UI_TEXT } from "@/data/site";
import styles from "./NotFound.module.scss";

const NotFound = () => (
  <div className={styles.page} data-header-theme="light">
    <p className={styles.code}>404</p>
    <h1 className={styles.title}>{UI_TEXT.notFoundTitle}</h1>
    <Link to={PATHS.home} className={styles.action}>{UI_TEXT.notFoundAction}</Link>
  </div>
);

export default NotFound;
