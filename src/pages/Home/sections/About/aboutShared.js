// About 안의 여러 부품이 함께 쓰는 값
export const SKILLS_ID = "about-skills";   // ③ 배운 기술 제목 (숫자 줄에서 이동)
export const PROFILE_ID = "about-profile"; // ② 사진 · 소개 (숫자 줄에서 이동)

// EDUCATION이 이름 장면(검은 커튼)에 가려 있는지 — 가려진 동안은 숫자 연출을 시작하지 않음
// NameIntro가 바뀔 때마다 알려 주고(FACTS_COVER_EVENT), FactRows가 듣고 있음
export const FACTS_COVER_EVENT = "about:facts-cover";
export const coverState = { covered: false };
