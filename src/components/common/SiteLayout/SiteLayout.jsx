import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import ScrollToTop from "@/components/common/ScrollToTop/ScrollToTop";
import CursorBadge from "@/components/common/CursorBadge/CursorBadge";
import ChatBot from "@/components/common/ChatBot/ChatBot";
import useScrollReveal from "@/hooks/useScrollReveal";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import styles from "./SiteLayout.module.scss";

const SiteLayout = () => {
  useScrollReveal(); // data-reveal 요소 스크롤 등장
  useSmoothScroll(); // 사이트 전체 휠 스크롤을 조금 느리고 부드럽게

  return (
  <div className={styles.layout}>
    <ScrollToTop />
    <Header />
    <main className={styles.main}>
      <Outlet />
    </main>
    <Footer />
    <ChatBot />
    <CursorBadge />
  </div>
  );
};

export default SiteLayout;
