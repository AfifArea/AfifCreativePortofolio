"use client";

import Image from "next/image";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { allPlates, categories, pad, type Category } from "@/lib/projects";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { useMotionPrefs } from "@/components/providers/MotionPrefs";

const ease = [0.16, 1, 0.3, 1] as const;

// Deterministic pseudo-random so server and client agree.
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

type Plate = (typeof allPlates)[number];
type Spot = { x: number; y: number; w: number; h: number; r: number };

const items = allPlates.map((p, n) => ({ ...p, n }));

/** Loose rows, like prints laid out by hand on a table. */
function tableLayout(list: Plate[], mobile: boolean): Map<string, Spot> {
  const perRow = mobile ? 3 : 5;
  const base = mobile ? 124 : 178;
  const gap = mobile ? 20 : 30;
  const rowH = mobile ? 140 : 196;
  const out = new Map<string, Spot>();
  let x = 0;
  list.forEach((p, i) => {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    if (col === 0) x = (row % 2 ? 0.35 : 0) * base + rand(row + 3) * base * 0.3;
    const aspect = p.width / p.height;
    // Whole pixels so server and client render identical styles.
    const w = Math.round(base * (aspect < 1.1 ? 0.78 : 1) * (0.86 + rand(i + 11) * 0.34));
    const h = Math.round(w / aspect);
    out.set(p.src, {
      x: Math.round(x),
      y: Math.round(row * rowH + (rowH - h) / 2 + (rand(i + 5) - 0.5) * (mobile ? 14 : 26)),
      w,
      h,
      r: Math.round((rand(i + 21) - 0.5) * 500) / 100,
    });
    x += w + gap * (0.7 + rand(i + 31) * 0.6);
  });
  return out;
}

/** Overlapping pile used for the intro, before the table spreads out. */
function pileLayout(list: Plate[], mobile: boolean, spread: Map<string, Spot>): Map<string, Spot> {
  const out = new Map<string, Spot>();
  const sx = mobile ? 120 : 280;
  const sy = mobile ? 90 : 170;
  list.forEach((p, i) => {
    const s = spread.get(p.src)!;
    out.set(p.src, {
      ...s,
      x: Math.round((mobile ? 140 : 380) + (rand(i + 41) - 0.5) * sx * 2 - s.w / 2),
      y: Math.round((mobile ? 180 : 250) + (rand(i + 51) - 0.5) * sy * 2 - s.h / 2),
      r: Math.round((rand(i + 61) - 0.5) * 1200) / 100,
    });
  });
  return out;
}

export function GalleryTable() {
  const { reduced } = useMotionPrefs();
  const [filter, setFilter] = useState<Category | "All">("All");
  const [open, setOpen] = useState<{ n: number; from: DOMRect | null } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [spread, setSpread] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragged = useRef(false);
  const lastFocus = useRef<HTMLElement | null>(null);

  // Close the lightbox if the page is hidden by Activity.
  useLayoutEffect(() => () => setOpen(null), []);

  const visible = useMemo(
    () => items.filter((it) => filter === "All" || it.project.category === filter),
    [filter],
  );
  const table = useMemo(() => tableLayout(visible, mobile), [visible, mobile]);
  const pile = useMemo(() => pileLayout(visible, mobile, table), [visible, mobile, table]);

  const home = useCallback(
    (instant = false) => {
      const vp = viewport.current;
      if (!vp) return;
      const m = vp.clientWidth < 768;
      const tx = m ? 16 : vp.clientWidth * 0.34;
      const ty = m ? 430 : 120;
      if (instant || reduced) {
        x.set(tx);
        y.set(ty);
      } else {
        animate(x, tx, { duration: 1.1, ease });
        animate(y, ty, { duration: 1.1, ease });
      }
    },
    [reduced, x, y],
  );

  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;
    setMobile(vp.clientWidth < 768);
    home(true);
    const t = setTimeout(() => setSpread(true), reduced ? 0 : 900);
    return () => clearTimeout(t);
  }, [home, reduced]);

  const setZoomTo = (z: number) => {
    const next = Math.min(1.6, Math.max(0.5, Math.round(z * 10) / 10));
    const vp = viewport.current;
    if (vp) {
      // keep the viewport centre steady while zooming
      const cx = vp.clientWidth / 2;
      const cy = vp.clientHeight / 2;
      const k = next / zoom;
      const opts = reduced ? { duration: 0 } : { duration: 0.7, ease };
      animate(x, cx - (cx - x.get()) * k, opts);
      animate(y, cy - (cy - y.get()) * k, opts);
    }
    setZoom(next);
  };

  const step = useCallback(
    (d: number) => {
      setOpen((o) => {
        if (!o) return o;
        const list = visible.map((v) => v.n);
        const at = list.indexOf(o.n);
        return { n: list[(at + d + list.length) % list.length], from: null };
      });
    },
    [visible],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) lastFocus.current?.focus();
  }, [isOpen]);

  const openItem = open ? items[open.n] : null;

  return (
    <div className="relative h-[100svh] overflow-hidden">
      {/* Title is printed on the table: prints slide over it */}
      <div className="pointer-events-none absolute left-4 top-24 z-0 md:left-6 md:top-28">
        <motion.h1
          className="display text-[clamp(4.4rem,12vw,10.5rem)]"
          initial={reduced ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease }}
        >
          Gallery
        </motion.h1>
      </div>

      {/* Draggable table */}
      <div
        ref={viewport}
        data-lenis-prevent
        className="absolute inset-0 z-10 touch-none"
        data-cursor="drag"
        onWheel={(e) => {
          if (open) return;
          x.set(x.get() - e.deltaX);
          y.set(y.get() - e.deltaY);
        }}
      >
        <motion.div
          drag
          dragMomentum
          dragTransition={{ power: 0.22, timeConstant: 280 }}
          onDragStart={() => (dragged.current = true)}
          onPointerDown={() => (dragged.current = false)}
          style={{ x, y }}
          className="absolute left-0 top-0 h-px w-px"
        >
          <motion.div
            className="relative origin-top-left"
            animate={{ scale: zoom }}
            transition={reduced ? { duration: 0 } : { duration: 0.7, ease }}
          >
            {items.map((it) => {
              const on = table.has(it.src);
              const spot = (spread ? table : pile).get(it.src);
              const lifted = hover === it.n;
              const label = `${pad(it.n + 1)} — ${it.project.title} · ${it.project.year}`;
              return (
                <motion.button
                  key={it.src}
                  data-cursor="view"
                  aria-label={`Open ${it.alt}`}
                  aria-hidden={!on}
                  tabIndex={on ? 0 : -1}
                  className="absolute left-0 top-0 block bg-[#ece7da] p-[4px]"
                  style={{
                    zIndex: lifted ? 50 : 1,
                    pointerEvents: on ? "auto" : "none",
                    width: spot?.w,
                    height: spot ? spot.h + 8 : undefined,
                  }}
                  initial={false}
                  animate={
                    spot
                      ? {
                          x: spot.x,
                          y: spot.y - (lifted ? 10 : 0),
                          rotate: lifted ? 0 : spot.r,
                          scale: lifted ? 1.1 : 1,
                          opacity: 1,
                          boxShadow: lifted
                            ? "0 40px 70px -18px rgba(0,0,0,.95)"
                            : "0 18px 40px -14px rgba(0,0,0,.95)",
                        }
                      : { opacity: 0, scale: 0.7 }
                  }
                  transition={{
                    duration: hover !== null ? 0.45 : 1.3,
                    ease,
                    delay: spread && hover === null && !reduced ? (it.n % 10) * 0.03 : 0,
                  }}
                  onPointerEnter={() => setHover(it.n)}
                  onPointerLeave={() => setHover((h) => (h === it.n ? null : h))}
                  onFocus={() => setHover(it.n)}
                  onBlur={() => setHover(null)}
                  onClick={(e) => {
                    if (dragged.current || !on) return;
                    lastFocus.current = e.currentTarget;
                    setOpen({ n: it.n, from: e.currentTarget.getBoundingClientRect() });
                  }}
                >
                  <span className="relative block h-full w-full overflow-hidden bg-ink-3">
                    <Image src={it.src} alt="" fill sizes="320px" className="pointer-events-none object-cover" draggable={false} />
                  </span>
                  <AnimatePresence>
                    {lifted && (
                      <motion.span
                        className="mono pointer-events-none absolute left-1/2 top-full mt-3 whitespace-nowrap rounded-full border border-line bg-ink-2/90 px-3 py-1.5 text-[10px] text-paper backdrop-blur"
                        initial={{ opacity: 0, y: -4, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, x: "-50%" }}
                        transition={{ duration: 0.25 }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Copy + filters float above the table */}
      <div className="pointer-events-none absolute left-4 top-[calc(6rem+clamp(4.4rem,12vw,10.5rem)*0.92)] z-30 w-[min(330px,calc(100vw-2rem))] md:left-6 md:top-[calc(7rem+clamp(4.4rem,12vw,10.5rem)*0.92)]">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.25 }}
        >
          <div className="mb-5 h-px w-10 bg-paper-faint" />
          <p className="text-[14px] leading-relaxed text-paper/70 [text-shadow:0_1px_14px_#0b0b0b]">
            Every plate and the frames in between, laid out on the table. Drag to move it, hover to lift a print,
            click to look closer.
          </p>
          <p className="mono mt-5 flex items-center gap-3 text-paper-dim">
            <span className="h-px w-8 bg-paper-faint" /> Drag to explore
          </p>
          <div role="group" aria-label="Filter by category" className="pointer-events-auto mt-6 flex flex-wrap gap-1.5">
            {(["All", ...categories] as const).map((c) => (
              <button
                key={c}
                aria-pressed={filter === c}
                onClick={() => {
                  setFilter(c);
                  home();
                }}
                className={`mono rounded-full border px-3 py-1.5 transition-colors ${
                  filter === c
                    ? "border-paper bg-paper text-ink"
                    : "border-line bg-ink-2/80 text-paper-dim backdrop-blur hover:text-paper"
                }`}
              >
                {c === "All" ? `All ${items.length}` : c}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Zoom */}
      <div className="absolute bottom-20 right-4 z-30 flex items-center gap-1 rounded-full border border-line bg-ink-2/80 p-1 backdrop-blur md:bottom-6 md:right-[calc(1.5rem+150px)]">
        <button aria-label="Zoom out" onClick={() => setZoomTo(zoom - 0.1)} className="mono h-7 w-7 rounded-full hover:bg-paper hover:text-ink">
          −
        </button>
        <span className="mono w-11 text-center tabular-nums text-paper-dim" aria-live="polite">
          {Math.round(zoom * 100)}%
        </span>
        <button aria-label="Zoom in" onClick={() => setZoomTo(zoom + 0.1)} className="mono h-7 w-7 rounded-full hover:bg-paper hover:text-ink">
          +
        </button>
      </div>

      <Lightbox item={openItem} from={open?.from ?? null} onClose={() => setOpen(null)} onStep={step} reduced={reduced} />
    </div>
  );
}

function fit(w: number, h: number) {
  const maxW = Math.min(window.innerWidth * (window.innerWidth < 768 ? 0.9 : 0.62), 1100);
  const maxH = window.innerHeight * 0.64;
  const s = Math.min(maxW / w, maxH / h);
  return { w: w * s, h: h * s };
}

function Lightbox({
  item,
  from,
  onClose,
  onStep,
  reduced,
}: {
  item: (typeof items)[number] | null;
  from: DOMRect | null;
  onClose: () => void;
  onStep: (d: number) => void;
  reduced: boolean;
}) {
  const size = item ? fit(item.width, item.height) : { w: 0, h: 0 };
  // FLIP: start the matted print exactly where the clicked one sits on the table.
  const initial =
    item && from && !reduced
      ? {
          x: from.left + from.width / 2 - window.innerWidth / 2,
          y: from.top + from.height / 2 - (window.innerHeight / 2 - 24),
          scale: from.width / (size.w + 16),
          opacity: 1,
        }
      : { opacity: 0, scale: 0.96, y: 16 };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          data-lenis-prevent
        >
          <motion.figure
            key={item.src}
            className="-mt-12"
            onClick={(e) => e.stopPropagation()}
            initial={initial}
            animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="bg-[#ece7da] p-2 shadow-[0_60px_120px_-30px_rgba(0,0,0,.95)]" style={{ width: size.w + 16 }}>
              <div className="relative bg-ink-3" style={{ height: size.h }}>
                <Image src={item.src} alt={item.alt} fill sizes="80vw" className="object-contain" />
              </div>
            </div>
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <span className="text-lg text-paper">{item.project.title}</span>
              <span className="mono text-paper-dim">
                {pad(item.n + 1)} · {item.project.discipline} · {item.project.year}
              </span>
            </figcaption>
          </motion.figure>

          <div
            className="mono absolute inset-x-4 bottom-20 flex items-center justify-between gap-3 md:inset-x-6 md:bottom-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-1.5">
              <button onClick={() => onStep(-1)} className="pill text-paper" aria-label="Previous image">
                ←
              </button>
              <button onClick={() => onStep(1)} className="pill text-paper" aria-label="Next image">
                →
              </button>
            </div>
            <div className="flex gap-1.5">
              <TransitionLink href={`/work/${item.project.slug}`} className="pill text-paper" onClick={onClose}>
                View project →
              </TransitionLink>
              <button autoFocus onClick={onClose} className="pill text-paper">
                Close ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
