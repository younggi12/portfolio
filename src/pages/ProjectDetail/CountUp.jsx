// 결과 숫자 — 화면에 들어오면 "해결 전" 값에서 "해결 후" 값까지 숫자가 굴러가며 바뀜 (100% → 0%, 13.8MB → 2.0MB)
// - 글자 앞뒤(최대 · % · MB)는 그대로 두고 숫자만 움직임, 소수 자리수는 "해결 후" 값에 맞춤
// - 화면 읽기에는 최종 값만 (움직이는 숫자는 숨김) / "동작 줄이기"면 처음부터 최종 값
import { useEffect, useRef, useState } from "react";
import styles from "./ProjectDetail.module.scss";

const DURATION = 1400; // 숫자가 바뀌는 시간(ms)
const easeOut = (t) => 1 - (1 - t) ** 3; // 빠르게 시작 → 천천히 멈춤

// "최대 25%" → { prefix: "최대 ", value: 25, suffix: "%", decimals: 0 }
const parse = (text) => {
  const match = String(text).match(/-?\d+(?:\.(\d+))?/);
  if (!match) return null;
  return {
    prefix: text.slice(0, match.index),
    value: parseFloat(match[0]),
    suffix: text.slice(match.index + match[0].length),
    decimals: match[1]?.length ?? 0,
  };
};

const CountUp = ({ from, to }) => {
  const ref = useRef(null);
  const end = parse(to);
  const start = parse(from);
  const canAnimate = Boolean(end && start) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [value, setValue] = useState(canAnimate ? start.value : null);

  useEffect(() => {
    const el = ref.current;
    if (!canAnimate || !el) return undefined;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / DURATION);
        setValue(start.value + (end.value - start.value) * easeOut(t));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [canAnimate, from, to]); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = value === null ? to : `${end.prefix}${value.toFixed(end.decimals)}${end.suffix}`;

  return (
    <strong ref={ref}>
      <span className={styles.srOnly}>{to}</span>
      <span aria-hidden="true">{shown}</span>
    </strong>
  );
};

export default CountUp;
