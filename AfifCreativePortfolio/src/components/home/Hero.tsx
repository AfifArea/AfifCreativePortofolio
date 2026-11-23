"use client";

import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { useMotionPrefs } from "@/components/providers/MotionPrefs";
import { LocalTime } from "@/components/chrome/Chrome";
import { scrollToTarget, useLenis } from "@/components/providers/SmoothScroll";

const stack = [projects[0], projects[3], projects[1]];
const expo = [0.16, 1, 0.3, 1] as const;

const letter = {
  hidden: { y: "115%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1.4, ease: expo, delay: 0.15 + i * 0.045 } }),
};
const card = {
  hidden: { y: 180, rotateX: 40, opacity: 0 },
  show: (i: number) => ({
    y: 0,
    rotateX: 0,
    opacity: 1,
    transition: { duration: 1.8, ease: expo, delay: 0.35 + i * 0.12 },
  }),
};
const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1.2, ease: expo, delay: 0.85 + i * 0.06 } }),
};

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotionPrefs();
  const lenis = useLenis();

  // Scroll: hero recedes into depth as the works arrive.
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const depthScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const depthOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);
  const depthY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const stackY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // Pointer parallax on the card stack.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 60, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, px, py]);

  const words = site.name.toUpperCase().split(" ");
  let li = 0;
  let fi = 0;

  return (
    <motion.section
      ref={root}
      id="top"
      aria-label="Introduction"
      initial={reduced ? false : "hidden"}
      animate="show"
      className="relative flex h-[100svh] min-h-[560px] flex-col justify-end overflow-hidden px-4 pb-24 pt-24 md:px-6 md:pb-28"
    >
      {/* Ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 35%, rgba(245,245,240,0.07), transparent 70%), radial-gradient(40% 40% at 20% 90%, rgba(232,255,89,0.035), transparent 70%)",
        }}
      />

      {/* Floating print stack */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-18%] top-[14%] w-[78vw] max-w-[760px] sm:right-[-6%] md:right-[4%] md:top-[12%] md:w-[46vw]"
        style={{ perspective: 1400, y: reduced ? 0 : stackY }}
      >
        <motion.div className="p3d relative aspect-[1.4]" style={{ rotateX, rotateY }}>
          {stack.map((p, i) => {
            const plate = p.plates[p.cover];
            return (
              <div
                key={p.slug}
                className="p3d absolute inset-0"
                style={{
                  transform: `translate3d(${(i - 1) * 9}%, ${(i - 1) * -7}%, ${-i * 140}px) rotateZ(${(i - 1) * -5}deg)`,
                }}
              >
                <motion.div
                  variants={card}
                  custom={i}
                  className="relative h-full w-full overflow-hidden rounded-[2px] bg-ink-3 shadow-[0_50px_100px_-30px_rgba(0,0,0,.9)] ring-1 ring-white/5"
                >
                  <Image
                    src={plate.src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 78vw, 46vw"
                    className="object-cover"
                    style={{ filter: `brightness(${0.75 - i * 0.18}) saturate(${0.9 - i * 0.2})` }}
                    loading="eager"
                    fetchPriority={i === 0 ? "high" : "auto"}
                  />
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 origin-bottom-left"
        style={reduced ? undefined : { scale: depthScale, opacity: depthOpacity, y: depthY }}
      >
        <motion.div variants={fade} custom={fi++} className="mono mb-5 flex items-center gap-3 text-paper-dim md:mb-8">
          <span className="h-px w-10 bg-paper-dim" />
          {site.brand} — Portfolio 2026
        </motion.div>

        <h1 className="display drop-shadow-[0_10px_40px_rgba(0,0,0,.5)]" aria-label={`${site.name}, ${site.role}`}>
          {words.map((word, wi) => (
            <span key={wi} className="block overflow-hidden text-[clamp(3.4rem,14vw,14rem)] leading-[0.84]">
              <span className="flex" aria-hidden>
                {word.split("").map((ch, ci) => (
                  <motion.span key={ci} variants={letter} custom={li++} className="inline-block will-change-transform">
                    {ch}
                  </motion.span>
                ))}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 md:mt-10 md:grid-cols-12">
          <motion.p
            variants={fade}
            custom={fi++}
            className="col-span-2 max-w-md text-lg leading-snug text-paper md:col-span-5 md:text-2xl"
          >
            {site.role} crafting visual content, social media and identities with intent.
          </motion.p>
          <motion.div variants={fade} custom={fi++} className="mono flex flex-col gap-1 text-paper-dim md:col-span-3 md:col-start-7">
            <span className="text-paper">Focus</span>
            <span>Visual & social media design</span>
            <span>Brand identity · Promotion</span>
          </motion.div>
          <motion.div variants={fade} custom={fi++} className="mono flex flex-col gap-1 text-paper-dim md:col-span-2">
            <span className="text-paper">Based in</span>
            <span>{site.location}</span>
            <LocalTime />
          </motion.div>
          <motion.button
            variants={fade}
            custom={fi++}
            data-cursor="scroll"
            onClick={() => scrollToTarget(lenis, "#works")}
            className="mono group col-span-2 flex items-center gap-3 self-end text-paper md:col-span-2 md:justify-self-end"
          >
            <span className="relative block h-10 w-px overflow-hidden bg-paper-faint">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-paper"
                animate={reduced ? undefined : { y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
              />
            </span>
            Scroll to explore
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  );
}
