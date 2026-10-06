import styles from "./SectionTitle.module.scss";

const SectionTitle = ({ children, as: Tag = "h2" }) => (
  <Tag className={styles.title}>{children}</Tag>
);

export default SectionTitle;
