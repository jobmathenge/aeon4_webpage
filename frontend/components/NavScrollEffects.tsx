"use client";

import { useEffect } from "react";

export default function NavScrollEffects() {
  useEffect(() => {
    const nav = document.getElementById("nav");
    const prog = document.getElementById("progress");
    if (!nav || !prog) return;

    function onScroll() {
      nav!.classList.toggle("compact", window.scrollY > 60);
      const h = document.documentElement;
      prog!.style.width = `${(window.scrollY / (h.scrollHeight - h.clientHeight)) * 100}%`;
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
