// assets/images/emoji 안의 svg를 파일명으로 찾아 빌드된 URL을 돌려준다 (About "배운 것" 카드 그림)
// 그림 5개 모두 직접 그린 아이소메트릭 SVG (팔레트 색, JS · React는 각 로고 색)
const images = import.meta.glob("../assets/images/emoji/*.svg", {
  eager: true,
  import: "default",
});

export const getEmojiImage = (fileName) => {
  if (!fileName) return null;
  const entry = Object.entries(images).find(([path]) => path.endsWith(`/${fileName}`));
  return entry ? entry[1] : null;
};