// 버튼처럼 화면에 떠 있는 요소 뒤에 깔린 배경이 어두운지 — Top 버튼 · 챗봇 버튼이 배경에 따라 색을 바꿀 때
// 색 문자열(rgb · rgba) → [r, g, b, a]
const parseColor = (value) => {
  const nums = value.match(/[\d.]+/g)?.map(Number) ?? [];
  return nums.length >= 3 ? [nums[0], nums[1], nums[2], nums[3] ?? 1] : null;
};

// 버튼 가운데 지점 아래에서 배경색이 칠해진 가장 위 요소를 찾아 어두운지 판단
export const isDarkBehind = (button) => {
  const rect = button.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  for (const el of document.elementsFromPoint(x, y)) {
    if (button.contains(el) || el.closest("[data-chat]")) continue; // 자기 자신 · 챗봇은 건너뜀
    if (["IMG", "VIDEO", "CANVAS"].includes(el.tagName)) continue; // 사진 · 3D는 색을 알 수 없어 그 뒤 배경으로
    const color = parseColor(getComputedStyle(el).backgroundColor);
    if (!color || color[3] < 0.5) continue; // 투명한 칸은 건너뜀
    const [r, g, b] = color;
    return 0.299 * r + 0.587 * g + 0.114 * b < 128; // 밝기(0~255)가 절반보다 어두우면 어두운 배경
  }
  return false;
};
