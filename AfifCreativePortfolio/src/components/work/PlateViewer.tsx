"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { Plate } from "@/lib/projects";
import { pad } from "@/lib/projects";

const ease = [0.16, 1, 0.3, 1] as const;

export function PlateViewer({ plates, caption }: { plates: Plate[]; caption: string }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const go = useCallback(
    (d: number) => setState(([i]) => [(i + d + plates.length) % plates.length, d]),
    [plates.length],
  );
  const plate = plates[index];
  const multi = plates.length > 1;

  useEffect(() => {
    if (!multi) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, multi]);

  return (
    <div>
      <motion.div
        className="relative aspect-[1.4] overflow-hidden bg-ink-2 shadow-[0_60px_120px_-40px_rgba(0,0,0,.9)] ring-1 ring-white/5"
        drag={multi ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) go(1);
          else if (info.offset.x > 60) go(-1);
        }}
        data-cursor={multi ? "drag" : undefined}
        aria-roledescription="carousel"
        aria-label={caption}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={plate.src}
            custom={dir}
            className="absolute inset-0"
            variants={{
              enter: (d: number) => ({ clipPath: d > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", scale: 1.08 }),
              center: { clipPath: "inset(0 0% 0 0%)", scale: 1 },
              exit: { opacity: 0.4, scale: 0.98 },
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1, ease }}
          >
            <Image
              src={plate.src}
              alt={plate.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="pointer-events-none select-none object-contain"
              loading="eager"
              fetchPriority={index === 0 ? "high" : "auto"}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="mono mt-4 flex items-center justify-between gap-4 text-paper-dim">
        <span className="truncate">{caption}</span>
        <div className="flex shrink-0 items-center gap-3">
          {multi && (
            <button onClick={() => go(-1)} aria-label="Previous plate" className="px-1 hover:text-paper">
              ←
            </button>
          )}
          <span className="tabular-nums text-paper" aria-live="polite">
            {pad(index + 1)} / {pad(plates.length)}
          </span>
          {multi && (
            <button onClick={() => go(1)} aria-label="Next plate" className="px-1 hover:text-paper">
              →
            </button>
          )}
        </div>
      </div>

      {multi && (
        <ul className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">
          {plates.map((p, i) => (
            <li key={p.src} className="shrink-0">
              <button
                onClick={() => setState(([cur]) => [i, i >= cur ? 1 : -1])}
                aria-label={`Show plate ${i + 1}`}
                aria-current={i === index}
                className="relative block h-16 w-24 overflow-hidden bg-ink-3 transition-[opacity,transform] duration-500 md:h-[68px] md:w-[96px]"
                style={{ opacity: i === index ? 1 : 0.4 }}
              >
                <Image src={p.src} alt="" fill sizes="96px" className="object-cover" />
                {i === index && <motion.span layoutId="thumb-ring" className="absolute inset-0 ring-1 ring-inset ring-paper" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
