import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }:any) => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return children;
};

export default ScrollToTop;
