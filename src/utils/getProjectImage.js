// assets/images/projects 안의 webp를 파일명으로 찾아 빌드된 URL을 돌려준다
// (데이터에는 파일명만 적고, 실제 경로 처리는 여기서만)
const images = import.meta.glob("../assets/images/projects/*.webp", {
  eager: true,
  import: "default",
});

export const getProjectImage = (fileName) => {
  if (!fileName) return null;
  const entry = Object.entries(images).find(([path]) => path.endsWith(`/${fileName}`));
  return entry ? entry[1] : null;
};
