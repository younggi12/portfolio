// 라우터 설정만 (AGENTS.md 6장)
import { Routes, Route } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import SiteLayout from "@/components/common/SiteLayout/SiteLayout";
import Home from "@/pages/Home/Home";
import Projects from "@/pages/Projects/Projects";
import ProjectDetail from "@/pages/ProjectDetail/ProjectDetail";
import NotFound from "@/pages/NotFound/NotFound";

const App = () => (
  <Routes>
    <Route element={<SiteLayout />}>
      <Route path={PATHS.home} element={<Home />} />
      <Route path={PATHS.projects} element={<Projects />} />
      <Route path={PATHS.projectDetail} element={<ProjectDetail />} />
      <Route path={PATHS.notFound} element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;
