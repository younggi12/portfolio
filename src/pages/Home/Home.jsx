// Home 흐름: 첫 화면 → About → 작품 소개(Apple 타일) → 푸터(연락처)
// 인트로 영상·Skills 등 추가 섹션은 배포 후에 (AGENTS.md "나중에 추가" 목록)
import Hero from "./sections/Hero";
import About from "./sections/About";
import ProjectTiles from "./sections/ProjectTiles";

const Home = () => (
  <>
    <Hero />
    <About />
    <ProjectTiles />
  </>
);

export default Home;
