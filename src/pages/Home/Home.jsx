// 인트로 영상(IntroVideo)은 10번 작업 때 추가
import Hero from "./sections/Hero";
import About from "./sections/About";
import FeaturedProjects from "./sections/FeaturedProjects";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";

const Home = () => (
  <>
    <Hero />
    <About />
    <FeaturedProjects />
    <Skills />
    <Contact />
  </>
);

export default Home;
