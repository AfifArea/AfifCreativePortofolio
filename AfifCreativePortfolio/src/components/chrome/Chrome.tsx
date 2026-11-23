"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";
import { allPlates, projects } from "@/lib/projects";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { useMotionPrefs } from "@/components/providers/MotionPrefs";

/** Live local time in Jakarta. */
export function LocalTime({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: site.timezone,
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={className} suppressHydrationWarning>
      {time ?? "--:--"} {site.tzLabel}
    </span>
  );
}

function useHomeSection(pathname: string) {
  const [section, setSection] = useState<"about" | "contact" | null>(null);
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["about", "contact"] as const;
    // Look elements up on every scroll: the page may stream in after the chrome mounts.
    const onScroll = () => {
      const mid = window.innerHeight * 0.5;
      let current: "about" | "contact" | null = null;
      for (const id of ids) {
        const r = document.getElementById(id)?.getBoundingClientRect();
        if (r && r.top < mid && r.bottom > mid) current = id;
      }
      setSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  return pathname === "/" ? section : null;
}

function Row({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: [string, string][];
    onChange: (v: string) => void;
  }) {
  return (
    <div className="flex items-center justify-between gap-6 py-2">
      <span className="mono text-paper-dim">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex gap-1">
        {options.map(([v, l]) => (
          <button
            key={v}
            role="radio"
            aria-checked={value === v}
            onClick={() => onChange(v)}
            className={`mono rounded-full px-3 py-1.5 transition-colors ${
              value === v ? "bg-paper text-ink" : "text-paper-dim hover:text-paper"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const { prefs, setPrefs, reduced } = useMotionPrefs();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when the page is hidden by Activity.
  useLayoutEffect(() => () => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);


  return (
    <div ref={ref} className="relative">
      <button
        className="pill mono text-paper-dim transition-colors hover:text-paper"
        aria-expanded={open}
        aria-controls="settings-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M1 4h7M11 4h2M1 10h2M6 10h7" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="9.5" cy="4" r="1.6" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="4.5" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className="hidden sm:inline">Settings</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="settings-panel"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-12 left-0 w-[290px] origin-bottom-left rounded-2xl border border-line bg-ink-2/95 p-4 backdrop-blur-xl"
          >
            <Row
              label="Motion"
              value={prefs.motion}
              options={[
                ["full", "Full"],
                ["reduced", "Reduced"],
              ]}
              onChange={(v) => setPrefs({ motion: v as "full" | "reduced" })}
            />
            <Row
              label="Cursor"
              value={prefs.cursor ? "custom" : "system"}
              options={[
                ["custom", "Custom"],
                ["system", "System"],
              ]}
              onChange={(v) => setPrefs({ cursor: v === "custom" })}
            />
            {reduced && prefs.motion === "full" && (
              <p className="mono mt-2 text-[10px] leading-relaxed text-paper-dim normal-case tracking-normal">
                Your system asks for reduced motion, so it stays on.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TopRight({ pathname }: { pathname: string }) {
  if (pathname.startsWith("/work/")) return null; // project pages render their own
  let content: React.ReactNode;
  if (pathname === "/work") content = <>{String(projects.length).padStart(2, "0")} Projects</>;
  else if (pathname === "/gallery") content = <>{allPlates.length} Frames</>;
  else
    content = (
      <>
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        {site.available ? "Available for work" : <LocalTime />}
      </>
    );
  return <div className="pill mono pointer-events-auto text-paper">{content}</div>;
}

export function Chrome() {
  const pathname = usePathname();
  const section = useHomeSection(pathname);

  const active = (href: string) => {
    if (href === "/#about") return section === "about";
    if (href === "/#contact") return section === "contact";
    if (href === "/") return pathname === "/" && !section;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <a
        href="#main"
        className="mono fixed left-4 top-4 z-[95] -translate-y-24 rounded-full bg-paper px-4 py-2 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between p-4 md:p-6">
        <TransitionLink href="/" className="pill mono pointer-events-auto text-paper" cursor="home">
          {site.brand}
        </TransitionLink>
        <TopRight pathname={pathname} />
      </header>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-end justify-between gap-2 p-4 md:p-6">
        <div className="pointer-events-auto hidden md:block">
          <Settings />
        </div>
        <nav
          aria-label="Primary"
          className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-6"
        >
          <ul className="flex items-center gap-0.5 rounded-full border border-line bg-ink-2/80 p-1 backdrop-blur-xl">
            {nav.map((item) => {
              const isActive = active(item.href);
              return (
                <li key={item.href} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-paper"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <TransitionLink
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`mono relative block rounded-full px-3 py-2 text-[10px] transition-colors sm:px-4 sm:text-[11px] ${
                      isActive ? "text-ink" : "text-paper-dim hover:text-paper"
                    }`}
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="pointer-events-auto hidden md:block">
          <LocalTime className="pill mono text-paper-dim" />
        </div>
      </div>
    </>
  );
}
