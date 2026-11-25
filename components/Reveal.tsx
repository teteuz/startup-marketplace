"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adiciona a classe "in" quando o bloco entra na tela.
 * - className="reveal" → o bloco aparece em fade
 * - filhos com className="drop" e style {"--i": n} → caem um por um
 */
export default function Reveal({
  children,
  className = "",
  threshold = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={`${className} ${inView ? "in" : ""}`}>
      {children}
    </div>
  );
}
