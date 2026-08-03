import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const pathnameChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (hash) {
      window.requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView());
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!pathnameChanged) return;
    window.requestAnimationFrame(() => {
      const mainRegions = document.querySelectorAll<HTMLElement>('main[tabindex="-1"]');
      mainRegions.item(mainRegions.length - 1)?.focus({ preventScroll: true });
    });
  }, [hash, pathname]);

  return null;
}

export function App() {
  const [liteMode, setLiteMode] = useState(initialLiteMode);
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const reduceEffects = reducedMotion || liteMode;

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
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          className="route-frame"
          key={location.pathname}
          initial={reduceEffects ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceEffects ? undefined : { opacity: 0, pointerEvents: "none" }}
          transition={{ duration: reduceEffects ? 0 : 0.24, ease: "easeOut" }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage liteMode={liteMode} />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
