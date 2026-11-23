"use client";

import { site } from "@/lib/site";
import { scrollToTarget, useLenis } from "@/components/providers/SmoothScroll";

export function Footer() {
  const lenis = useLenis();
  return (
    <footer className="border-t border-line px-4 pb-28 pt-8 md:px-6">
      <div className="mono flex flex-wrap items-center justify-between gap-4 text-paper-dim">
        <span>
          © 2026 {site.brand}
        </span>
        <span className="hidden sm:inline">
          {site.name} — {site.role}
        </span>
        <button onClick={() => scrollToTarget(lenis, 0)} className="link-draw pb-0.5 hover:text-paper">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
