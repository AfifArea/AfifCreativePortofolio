"use client";

import Image from "next/image";
import { motion, useInView, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { useMotionPrefs } from "@/components/providers/MotionPrefs";

const spring = { stiffness: 70, damping: 16, mass: 0.9 };

/**
 * A mounted print hanging in 3D space that turns toward the cursor.
 * Paper thickness on the right and bottom edges, a soft floor shadow and a
 * moving sheen sell the depth.
 */
export function TiltPrint({
  src,
  alt,
  aspect,
  sizes = "(max-width: 768px) 90vw, 50vw",
  baseRotateY = -16,
  baseRotateX = 4,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  aspect: number;
  sizes?: string;
  baseRotateY?: number;
  baseRotateX?: number;
  className?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPrefs();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  // Pointer position relative to the print's centre, roughly -1…1.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-1, 1], [baseRotateY - 12, baseRotateY + 12]), spring);
  const rotateX = useSpring(useTransform(py, [-1, 1], [baseRotateX + 9, baseRotateX - 9]), spring);
  const shiftX = useSpring(useTransform(px, [-1, 1], [-14, 14]), spring);
  const shiftY = useSpring(useTransform(py, [-1, 1], [-10, 10]), spring);
  const sheenX = useTransform(px, [-1, 1], [10, 90]);
  const sheenY = useTransform(py, [-1, 1], [10, 90]);
  const sheen = useMotionTemplate`radial-gradient(60% 50% at ${sheenX}% ${sheenY}%, rgba(255,255,255,.18), transparent 70%)`;
  const shadowX = useTransform(rotateY, (v) => `${-v * 2.2}px`);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      px.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.5))));
      py.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.5))));
    };
    const reset = () => {
      px.set(0);
      py.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
    };
  }, [reduced, px, py]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ perspective: 1600 }}>
      {/* floor shadow */}
      <motion.div
        aria-hidden
        className="absolute inset-x-[8%] -bottom-[6%] h-[14%] rounded-[50%] bg-black blur-2xl"
        style={{ x: reduced ? 0 : shadowX, opacity: 0.85 }}
      />
      <motion.div
        className="p3d relative"
        style={reduced ? { transform: `rotateY(${baseRotateY}deg) rotateX(${baseRotateX}deg)` } : { rotateY, rotateX, x: shiftX, y: shiftY }}
        initial={reduced ? false : { opacity: 0, rotateZ: -6, z: -400 }}
        animate={inView ? { opacity: 1, rotateZ: 0, z: 0 } : undefined}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="relative w-full overflow-hidden bg-ink-3 shadow-[0_70px_120px_-40px_rgba(0,0,0,.95)]"
          style={{ aspectRatio: aspect }}
        >
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" preload={priority} />
          {!reduced && <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-overlay" style={{ background: sheen }} />}
        </div>
        {/* right edge */}
        <div
          aria-hidden
          className="absolute left-full top-0 h-full w-[10px] origin-left"
          style={{ transform: "rotateY(90deg)", background: "linear-gradient(to right, #d8d1bd, #9b927b)" }}
        />
        {/* bottom edge */}
        <div
          aria-hidden
          className="absolute left-0 top-full h-[10px] w-full origin-top"
          style={{ transform: "rotateX(-90deg)", background: "linear-gradient(to bottom, #b9b09a, #78705e)" }}
        />
      </motion.div>
    </div>
  );
}
