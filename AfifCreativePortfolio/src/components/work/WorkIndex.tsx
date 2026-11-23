"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { pad, projects } from "@/lib/projects";
import { TransitionLink } from "@/components/transition/TransitionLink";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Work page: title + a large preview print on the left, the index on the right.
 * Hovering (or focusing) a line lifts it and swaps the print.
 */
export function WorkIndex() {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? 0;
  const project = projects[shown];
  const plate = project.plates[project.cover];
  const years = projects.map((p) => Number(p.year));

  return (
    <section className="grid min-h-[100svh] gap-12 px-4 pb-28 pt-24 md:px-6 lg:grid-cols-12 lg:items-start lg:gap-8 lg:pb-24 lg:pt-28">
      {/* Left: title, copy, preview print */}
      <div className="lg:col-span-4">
        <motion.h1
          className="display text-[clamp(4.6rem,10vw,9rem)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease }}
        >
          Work
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.15 }}
        >
          <div className="mt-6 h-px w-10 bg-paper-faint" />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-paper/65">
            {projects.length} projects from {Math.min(...years)} — {Math.max(...years)}, across social media, identity,
            apparel and interface work. Hover a line to lift the print; click it to see the plates.
          </p>
        </motion.div>

        <motion.figure
          className="mt-8 hidden md:block"
          initial={{ opacity: 0, y: 40, rotateX: 18 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.3, ease, delay: 0.25 }}
          style={{ perspective: 1200 }}
        >
          <div className="relative aspect-[4/3] w-full max-w-[520px] overflow-hidden bg-ink-3 shadow-[0_50px_90px_-30px_rgba(0,0,0,.95)] ring-1 ring-white/5">
            <AnimatePresence initial={false}>
              <motion.div
                key={plate.src}
                className="absolute inset-0"
                initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.08 }}
                animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.25 } }}
                transition={{ duration: 0.75, ease }}
              >
                <Image
                  src={plate.src}
                  alt={plate.alt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 36vw"
                  className="object-cover"
                  preload={shown === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <figcaption className="mono mt-4 h-4 overflow-hidden text-paper-dim">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={project.slug}
                className="block truncate"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.45, ease }}
              >
                {pad(shown + 1)} — {project.title} · {project.client} · {project.year}
              </motion.span>
            </AnimatePresence>
          </figcaption>
        </motion.figure>
      </div>

      {/* Right: the index */}
      <motion.div
        className="lg:col-span-7 lg:col-start-6 lg:pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        onPointerLeave={() => setHover(null)}
      >
        <div className="mono hidden grid-cols-[64px_36px_minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)_64px] items-center gap-3 border-b border-line pb-3 text-[10px] text-paper-dim md:grid">
          <span />
          <span>No.</span>
          <span>Title</span>
          <span>Discipline</span>
          <span>Client</span>
          <span className="text-right">Year</span>
        </div>
        <ul>
          {projects.map((p, i) => {
            const active = hover === i;
            return (
              <motion.li
                key={p.slug}
                className="relative border-b border-line"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.35 + i * 0.05 }}
              >
                {active && (
                  <motion.span
                    layoutId="work-row-lift"
                    aria-hidden
                    className="absolute -inset-x-2 -inset-y-px z-0 rounded-[3px] bg-ink-3 shadow-[0_24px_50px_-18px_rgba(0,0,0,.95)] ring-1 ring-white/10"
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                  />
                )}
                <TransitionLink
                  href={`/work/${p.slug}`}
                  cursor="open"
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="relative z-10 grid grid-cols-[56px_32px_1fr_auto] items-center gap-3 py-2.5 md:grid-cols-[64px_36px_minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)_64px]"
                >
                  <span className="relative block h-9 w-14 overflow-hidden bg-ink-3 md:h-10 md:w-16">
                    <motion.span
                      className="absolute inset-0 block"
                      animate={{ x: active ? 6 : 0, scale: active ? 1.06 : 1 }}
                      transition={{ duration: 0.5, ease }}
                    >
                      <Image src={p.plates[p.cover].src} alt="" fill sizes="64px" className="object-cover" />
                    </motion.span>
                  </span>
                  <span className={`mono tabular-nums transition-colors ${active ? "text-paper" : "text-paper-dim"}`}>
                    {pad(i + 1)}
                  </span>
                  <motion.span
                    className="truncate text-[17px] text-paper md:text-[19px]"
                    animate={{ x: active ? 6 : 0 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    {p.title}
                  </motion.span>
                  <span
                    className={`mono hidden truncate text-[10px] transition-colors md:block ${active ? "text-paper" : "text-paper-dim"}`}
                  >
                    {p.discipline}
                  </span>
                  <span
                    className={`mono hidden truncate text-[10px] transition-colors md:block ${active ? "text-paper" : "text-paper-dim"}`}
                  >
                    {p.client}
                  </span>
                  <span className="mono text-right text-[10px]">
                    {active ? <span className="text-paper">Open →</span> : <span className="text-paper-dim">{p.year}</span>}
                  </span>
                </TransitionLink>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>
    </section>
  );
}
