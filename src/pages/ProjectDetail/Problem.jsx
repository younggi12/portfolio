// 문제 해결 — 증상 · 시도 · 원인 · 해결 번호 줄 + 배운 점
import { DETAIL_TEXT } from "@/data/site";
import { pad, Rich } from "./detailText";
import styles from "./ProjectDetail.module.scss";

const Problem = ({ problem }) => {
  const rows = [
    [DETAIL_TEXT.symptom, problem.symptom],
    [DETAIL_TEXT.tries, problem.tries],
    [DETAIL_TEXT.cause, problem.cause],
    [DETAIL_TEXT.solution, problem.solution],
  ].filter(([, value]) => value);

  return (
    <article className={styles.problem} data-reveal>
      <h3 className={styles.problemTitle}>{problem.title}</h3>
      <dl className={styles.steps}>
        {rows.map(([label, value], i) => (
          // 마지막 "해결" 줄만 검은 배경으로 강조
          <div key={label} className={`${styles.step} ${label === DETAIL_TEXT.solution ? styles.stepKey : ""}`}>
            <dt><span>{pad(i + 1)}</span>{label}</dt>
            <dd><Rich text={value} /></dd>
          </div>
        ))}
      </dl>
      {problem.lesson && <p className={styles.lesson}>{DETAIL_TEXT.lesson} — {problem.lesson}</p>}
    </article>
  );
};

export default Problem;
