// components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Delay scroll to avoid jumping back due to layout shift
    const scrollToTop = () => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }, 50); // short delay to wait for rendering
      });
    };

    scrollToTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
