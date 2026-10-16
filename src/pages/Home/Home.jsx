// Home 흐름: 첫 화면(검정 · 3D YG) → About → 작품 소개 → 푸터(연락처)
import Hero from "./sections/Hero/Hero";
import About from "./sections/About/About";
import ProjectTiles from "./sections/ProjectTiles/ProjectTiles";

const Home = () => (
  <>
    <Hero />
    <About />
    <ProjectTiles />
  </>
);

export default Home;
