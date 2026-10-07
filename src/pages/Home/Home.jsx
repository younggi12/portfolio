// Home 흐름: (첫 방문만) 인트로 → About → 작품 소개 → 푸터(연락처)
import Intro from "@/components/common/Intro/Intro";
import About from "./sections/About";
import ProjectTiles from "./sections/ProjectTiles";

const Home = () => (
  <>
    <Intro />
    <About />
    <ProjectTiles />
  </>
);

export default Home;
