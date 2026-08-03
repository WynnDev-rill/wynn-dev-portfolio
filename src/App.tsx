import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function initialLiteMode() {
  try {
    return window.localStorage.getItem("wynn:lite-mode") === "true";
  } catch {
    return false;
  }
}

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView());
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [hash, pathname]);

  return null;
}

export function App() {
  const [liteMode, setLiteMode] = useState(initialLiteMode);

  useEffect(() => {
    document.documentElement.dataset.motion = liteMode ? "lite" : "full";
    try {
      window.localStorage.setItem("wynn:lite-mode", String(liteMode));
    } catch {
      // The preference is optional when storage is unavailable.
    }
  }, [liteMode]);

  return (
    <div className="site-shell">
      <ScrollManager />
      <Header liteMode={liteMode} onToggleLite={() => setLiteMode((current) => !current)} />
      <Routes>
        <Route path="/" element={<HomePage liteMode={liteMode} />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
