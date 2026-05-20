import { useEffect, useRef } from "react";

/** Adds `.is-visible` once the element scrolls into view. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 400px 0px" },
    );
    io.observe(el);
    // Fallback: ensure content shows even if observer never fires
    // (covers full-page screenshots, prerender, etc.).
    const t = window.setTimeout(() => el.classList.add("is-visible"), 500);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, []);

  return ref;
}