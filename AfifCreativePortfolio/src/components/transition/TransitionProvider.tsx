"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { useMotionPrefs } from "@/components/providers/MotionPrefs";
import { scrollToTarget, useLenis } from "@/components/providers/SmoothScroll";

const EXPO_IN_OUT = [0.87, 0, 0.13, 1] as const;

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });

const labelFor = (path: string) => {
  if (path === "/") return "Main";
  if (path.startsWith("/work/")) return "Project";
  if (path.startsWith("/work")) return "Work";
  if (path.startsWith("/gallery")) return "Gallery";
  return "Afif";
};

/**
 * Curtain page transitions: cover → route change → reveal.
 * Same-page hash links scroll smoothly instead of transitioning.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const { reduced } = useMotionPrefs();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef<{ path: string; hash: string } | null>(null);
  const busy = useRef(false);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [label, setLabel] = useState("Afif");

  const reveal = useCallback(() => {
    const el = curtain.current;
    if (fallback.current) clearTimeout(fallback.current);
    if (!el) return;
    animate(el, { y: "-100%" }, { duration: 0.9, delay: 0.08, ease: EXPO_IN_OUT }).then(() => {
      el.style.visibility = "hidden";
      busy.current = false;
    });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }
      // Same page → smooth scroll to hash (or top).
      if (url.pathname === window.location.pathname) {
        if (url.hash) {
          history.replaceState(null, "", url.pathname + url.hash);
          scrollToTarget(lenis, url.hash);
        } else {
          history.replaceState(null, "", url.pathname);
          scrollToTarget(lenis, 0);
        }
        return;
      }
      if (busy.current) return;
      if (reduced || !curtain.current) {
        pending.current = { path: url.pathname, hash: url.hash };
        router.push(url.pathname + url.search + url.hash, { scroll: false });
        return;
      }
      busy.current = true;
      pending.current = { path: url.pathname, hash: url.hash };
      setLabel(labelFor(url.pathname));
      const el = curtain.current;
      el.style.visibility = "visible";
      animate(el, { y: ["100%", "0%"] }, { duration: 0.75, ease: EXPO_IN_OUT }).then(() => {
        router.push(url.pathname + url.search + url.hash, { scroll: false });
        // Never leave the curtain stuck if navigation fails.
        fallback.current = setTimeout(reveal, 5000);
      });
    },
    [lenis, reduced, reveal, router],
  );

  // Route committed → reset scroll, refresh triggers, lift the curtain.
  useEffect(() => {
    const p = pending.current;
    if (!p || p.path !== pathname) return;
    pending.current = null;
    lenis?.stop();
    scrollToTarget(lenis, 0, true);
    if (!lenis) window.scrollTo(0, 0);
    lenis?.start();
    requestAnimationFrame(() => {
      if (p.hash) setTimeout(() => scrollToTarget(lenis, p.hash, reduced), 60);
      if (busy.current) reveal();
    });
  }, [pathname, lenis, reveal, reduced]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] flex items-end justify-between bg-ink-2 p-6 md:p-10"
        style={{ visibility: "hidden" }}
      >
        <span className="display text-[22vw] leading-none text-paper md:text-[14vw]">{label}</span>
        <span className="mono mb-3 text-paper-dim">Afif Portofolio</span>
      </div>
    </TransitionContext.Provider>
  );
}

export const usePageTransition = () => useContext(TransitionContext);
