import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Ensures navigation always starts at the top of the page.
 * If a hash is present (e.g. /#facilities), it scrolls to that element instead.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Defer to ensure the next route has rendered
    const t = window.setTimeout(() => {
      if (hash) {
        const id = decodeURIComponent(hash.replace("#", ""));
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ block: "start", behavior: "smooth" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 0);

    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  return null;
}
