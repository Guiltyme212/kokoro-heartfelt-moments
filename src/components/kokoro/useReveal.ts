import { useEffect, useRef } from "react";

/** Adds `.is-visible` once the element scrolls into view. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("reveal-hide");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const t = e.target as HTMLElement;
            t.classList.remove("reveal-hide");
            t.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 400px 0px" },
    );
    io.observe(el);
    const t = window.setTimeout(() => {
      el.classList.remove("reveal-hide");
      el.classList.add("is-visible");
    }, 800);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, []);

  return ref;
}