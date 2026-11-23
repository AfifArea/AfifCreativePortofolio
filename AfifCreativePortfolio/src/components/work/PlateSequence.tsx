"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Plate } from "@/lib/projects";
import { pad } from "@/lib/projects";
import { useMotionPrefs } from "@/components/providers/MotionPrefs";

function SequencePlate({ plate, index, total, title }: { plate: Plate; index: number; total: number; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPrefs();
  // Frame opens as it enters; image drifts through it.
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const inset = useTransform(enter, [0, 1], [12, 0]);
  const clipPath = useTransform(inset, (v) => `inset(${v}% ${v * 0.66}% ${v}% ${v * 0.66}%)`);
  const scale = useTransform(pass, [0, 1], [1.18, 1]);
  const y = useTransform(pass, [0, 1], ["-6%", "6%"]);

  return (
    <figure>
      <motion.div
        ref={ref}
        className="relative overflow-hidden bg-ink-2"
        style={{ aspectRatio: Math.max(plate.width / plate.height, 1.25), clipPath: reduced ? undefined : clipPath }}
      >
        <motion.div className="absolute inset-0" style={reduced ? undefined : { scale, y }}>
          <Image src={plate.src} alt={plate.alt} fill sizes="100vw" className="object-contain" />
        </motion.div>
      </motion.div>
      <figcaption className="mono mt-3 flex justify-between text-paper-dim">
        <span>{title}</span>
        <span>
          Plate {pad(index + 1)} / {pad(total)}
        </span>
      </figcaption>
    </figure>
  );
}

/** Full-bleed, scroll-linked sequence of every plate in a project. */
export function PlateSequence({ plates, title }: { plates: Plate[]; title: string }) {
  return (
    <div className="space-y-6 md:space-y-10">
      {plates.map((p, i) => (
        <SequencePlate key={p.src} plate={p} index={i} total={plates.length} title={title} />
      ))}
    </div>
  );
}
