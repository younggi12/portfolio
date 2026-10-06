// Home 흐름: 인트로(첫 화면) → About → 작품 소개(검정 책) → 푸터(연락처)
// 인트로 영상·Skills 등 추가 섹션은 배포 후에 (AGENTS.md "나중에 추가" 목록)
import Hero from "./sections/Hero";
import About from "./sections/About";
import FeaturedBook from "./sections/FeaturedBook";

const Home = () => (
  <>
    <Hero />
    <About />
    <FeaturedBook />
  </>
);

export default Home;
