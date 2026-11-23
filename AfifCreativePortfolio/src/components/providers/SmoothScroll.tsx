"use client";

import Lenis from "lenis";
import { cancelFrame, frame } from "motion/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useMotionPrefs } from "./MotionPrefs";

const LenisContext = createContext<Lenis | null>(null);

/** Lenis smooth scrolling, driven by Motion's frame loop. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { reduced } = useMotionPrefs();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.4, autoRaf: false });
    const update = (data: { timestamp: number }) => instance.raf(data.timestamp);
    frame.update(update, true);
    // Publishing an external instance created by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);
    return () => {
      cancelFrame(update);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export const useLenis = () => useContext(LenisContext);

/** Scroll to a target with Lenis when available, natively otherwise. */
export function scrollToTarget(lenis: Lenis | null, target: string | number, immediate = false) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : null;
  if (typeof target === "string" && !el) return;
  if (lenis) {
    // Page height may have just changed (route swap) — re-measure first.
    lenis.resize();
    lenis.scrollTo(el ?? (target as number), { immediate, duration: 1.4, force: true });
  } else {
    const top = el ? el.getBoundingClientRect().top + window.scrollY : (target as number);
    window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
  }
}
