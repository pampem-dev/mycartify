// components/TopLoader.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

nprogress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.15,
});

const TopLoader = () => {
  const location = useLocation();

  useEffect(() => {
    nprogress.start();

    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        nprogress.done();
      });
    }, 500); // ⏱️ Adjust delay in ms (e.g., 300–700ms is typical)

    return () => {
      clearTimeout(timeout);
      nprogress.remove();
    };
  }, [location.pathname]);

  return null;
};

export default TopLoader;
