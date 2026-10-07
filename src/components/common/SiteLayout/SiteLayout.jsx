import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import ScrollToTop from "@/components/common/ScrollToTop/ScrollToTop";
import useScrollReveal from "@/hooks/useScrollReveal";
import styles from "./SiteLayout.module.scss";

const SiteLayout = () => {
  useScrollReveal(); // data-reveal 요소 스크롤 등장

  return (
  <div className={styles.layout}>
    <ScrollToTop />
    <Header />
    <main className={styles.main}>
      <Outlet />
    </main>
    <Footer />
  </div>
  );
};

export default SiteLayout;
