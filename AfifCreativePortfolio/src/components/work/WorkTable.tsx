"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useVelocity, useTransform } from "motion/react";
import { useState } from "react";
import { pad, projects } from "@/lib/projects";
import { TransitionLink } from "@/components/transition/TransitionLink";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial index of all projects. Hovering a row lifts it and floats the
 * print next to the cursor; the row itself opens the project.
 */
export function WorkTable() {
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-2000, 2000], [-10, 10], { clamp: true });

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setHover(null)}
    >
      <div className="mono hidden grid-cols-12 gap-4 border-b border-line pb-3 text-paper-dim md:grid">
        <span className="col-span-1">No.</span>
        <span className="col-span-5">Title</span>
        <span className="col-span-3">Discipline</span>
        <span className="col-span-2">Client</span>
        <span className="col-span-1 text-right">Year</span>
      </div>
      <ul>
        {projects.map((p, i) => {
          const isHover = hover === i;
          const dimmed = hover !== null && !isHover;
          return (
            <li key={p.slug} className="border-b border-line">
              <TransitionLink
                href={`/work/${p.slug}`}
                cursor="open"
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="group grid grid-cols-12 items-center gap-x-4 gap-y-1 py-4 transition-opacity duration-500 md:py-5"
                style={{ opacity: dimmed ? 0.35 : 1 }}
              >
                <span className="mono col-span-2 text-paper-dim md:col-span-1">{pad(i + 1)}</span>
                <span className="col-span-10 flex items-center gap-4 md:col-span-5">
                  <span className="relative hidden h-10 w-14 shrink-0 overflow-hidden bg-ink-3 sm:block">
                    <Image
                      src={p.plates[p.cover].src}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </span>
                  <span className="text-2xl transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2 md:text-3xl">
                    {p.title}
                  </span>
                </span>
                <span className="mono col-span-5 col-start-3 text-paper-dim md:col-span-3 md:col-start-auto">
                  {p.discipline}
                </span>
                <span className="mono col-span-3 hidden truncate text-paper-dim md:col-span-2 md:block">
                  {p.client}
                </span>
                <span className="mono col-span-5 text-right text-paper-dim md:col-span-1">
                  <span className="group-hover:hidden">{p.year}</span>
                  <span className="hidden text-paper group-hover:inline">Open →</span>
                </span>
              </TransitionLink>
            </li>
          );
        })}
      </ul>

      {/* Floating preview (fine pointers only) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden [@media(hover:hover)]:block"
        style={{ x: sx, y: sy, rotate }}
      >
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              key="preview"
              className="relative -translate-x-1/2 -translate-y-[60%]"
              initial={{ opacity: 0, scale: 0.7, rotateX: 25 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease }}
              style={{ perspective: 800 }}
            >
              <div className="relative h-[230px] w-[320px] overflow-hidden bg-[#e9e4d6] p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,.9)]">
                {projects.map((p, i) => (
                  <motion.div
                    key={p.slug}
                    className="absolute inset-2 overflow-hidden"
                    initial={false}
                    animate={{ clipPath: hover === i ? "inset(0% 0 0% 0)" : hover !== null && i < hover ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)" }}
                    transition={{ duration: 0.6, ease }}
                  >
                    <Image src={p.plates[p.cover].src} alt="" fill sizes="320px" className="object-cover" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
