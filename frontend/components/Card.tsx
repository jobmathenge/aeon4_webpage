"use client";

import { useRef, type ReactNode } from "react";

interface CardProps {
  accentVar: string;
  children: ReactNode;
}

export default function Card({ accentVar, children }: CardProps) {
  const ref = useRef<HTMLElement>(null);

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  }

  return (
    <article
      ref={ref}
      className="card"
      style={{ ["--accent" as string]: `var(--${accentVar})` }}
      onPointerMove={handlePointerMove}
    >
      {children}
    </article>
  );
}
