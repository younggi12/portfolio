import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import ScrollToTop from "@/components/common/ScrollToTop/ScrollToTop";
import styles from "./SiteLayout.module.scss";

const SiteLayout = () => (
  <div className={styles.layout}>
    <ScrollToTop />
    <Header />
    <main className={styles.main}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default SiteLayout;
