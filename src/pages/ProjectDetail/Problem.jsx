// 문제 해결 — 증상 · 시도 · 원인 · 해결 번호 줄 → 결과(숫자) · 배운 점도 같은 줄 모양으로 이어서
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
  let no = rows.length; // 결과 · 배운 점은 이어지는 번호

  return (
    <article className={styles.problem} data-reveal>
      <h3 className={styles.problemTitle}>{problem.title}</h3>
      <dl className={styles.steps}>
        {rows.map(([label, value], i) => (
          // "해결" 줄만 검은 배경으로 강조
          <div key={label} className={`${styles.step} ${label === DETAIL_TEXT.solution ? styles.stepKey : ""}`}>
            <dt><span>{pad(i + 1)}</span>{label}</dt>
            <dd><Rich text={value} /></dd>
          </div>
        ))}

        {/* 결과 — 왼쪽 설명 · 오른쪽 큰 숫자 (전 → 후) */}
        {problem.result && (
          <div className={`${styles.step} ${styles.resultRow}`}>
            <dt><span>{pad(++no)}</span>{DETAIL_TEXT.result}</dt>
            <dd>
              <span className={styles.resultLabel}>{problem.result.label}</span>
              {/* 숫자 아래에 "고치기 전 / 고친 후" — %가 무엇의 전후인지 바로 보이게 */}
              <span className={styles.resultValue}>
                <span className={styles.resultNum}>
                  <s>{problem.result.from}</s>
                  <small>{DETAIL_TEXT.before}</small>
                </span>
                <span className={styles.resultArrow} aria-hidden="true">→</span>
                <span className={styles.resultNum}>
                  <strong>{problem.result.to}</strong>
                  <small>{DETAIL_TEXT.after}</small>
                </span>
              </span>
            </dd>
          </div>
        )}

        {problem.lesson && (
          <div className={`${styles.step} ${styles.lessonRow}`}>
            <dt><span>{pad(++no)}</span>{DETAIL_TEXT.lesson}</dt>
            <dd>{problem.lesson}</dd>
          </div>
        )}
      </dl>
    </article>
  );
};

export default Problem;
