// 상세 페이지 글자 도우미
// 문장 속 `코드`를 <code>로 표시
export const Rich = ({ text }) =>
  text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith("`") ? <code key={i}>{part.slice(1, -1)}</code> : part,
  );

export const pad = (n) => String(n).padStart(2, "0"); // 1 → "01"
