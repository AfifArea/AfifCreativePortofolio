"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useMotionPrefs } from "@/components/providers/MotionPrefs";

/**
 * Dot + ring cursor. Any element with data-cursor="label" turns the ring
 * into a labelled disc. Only active on fine pointers.
 */
export function Cursor() {
  const { prefs, reduced } = useMotionPrefs();
  const pathname = usePathname();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [hit, setHit] = useState<{ label: string | null; path: string }>({ label: null, path: "" });
  // A label only applies on the page it was picked up on.
  const label = hit.path === pathname ? hit.label : null;
  const [enabled, setEnabled] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches && prefs.cursor);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [prefs.cursor]);

  useEffect(() => {
    document.documentElement.classList.toggle("has-cursor", enabled);
    return () => document.documentElement.classList.remove("has-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;
    const k = reduced ? 1 : 0.18;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setVisible(true);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const next = t?.dataset.cursor || null;
      const path = window.location.pathname;
      setHit((h) => (h.label === next && h.path === path ? h : { label: next, path }));
    };
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * k;
      ringPos.y += (pos.y - ringPos.y) * k;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, reduced]);

  if (!enabled) return null;

  const size = label ? 88 : 34;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: visible ? 1 : 0 }}>
      <div ref={ring} className="absolute left-0 top-0 will-change-transform">
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{
            width: size * (pressed ? 0.86 : 1),
            height: size * (pressed ? 0.86 : 1),
            background: label ? "var(--paper)" : "transparent",
            borderColor: label ? "var(--paper)" : "rgba(245,245,240,.45)",
          }}
        >
          <span
            className="mono text-[10px] text-ink transition-opacity duration-300"
            style={{ opacity: label ? 1 : 0 }}
          >
            {label}
          </span>
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0 will-change-transform">
        <div
          className="h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper transition-opacity"
          style={{ opacity: label ? 0 : 1 }}
        />
      </div>
    </div>
  );
}
