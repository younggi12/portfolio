import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.scss"; // global.scss는 여기서 한 번만

// 새로고침하면 항상 맨 위(인트로 → About)에서 시작 — 브라우저가 이전 스크롤 위치로 돌려놓지 않게
if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
if (window.location.pathname === "/" && window.location.hash) {
  window.history.replaceState(null, "", window.location.pathname + window.location.search); // #projects 등 제거
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);