"use client";

import Image from "next/image";
import { AnimatePresence, cancelFrame, frame, motion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { pad, projects } from "@/lib/projects";
import { useMotionPrefs } from "@/components/providers/MotionPrefs";
import { TransitionLink } from "@/components/transition/TransitionLink";

const N = projects.length;
const ease = [0.16, 1, 0.3, 1] as const;

type Dims = {
  W: number;
  dx: number;
  dy: number;
  dz: number;
  rot: number;
  sag: number;
  mobile: boolean;
};

function measure(): Dims {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = vw < 768;
  const W = mobile ? Math.min(vw * 0.64, vh * 0.36) : Math.min(vw * 0.33, vh * 0.62, 620);
  return {
    W,
    dx: W * (mobile ? 0.7 : 0.8),
    dy: W * (mobile ? 0.36 : 0.4),
    dz: W * 1.05,
    rot: mobile ? -18 : -24,
    sag: W * 0.045,
    mobile,
  };
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const toDeg = 180 / Math.PI;

/**
 * Selected Works — a line of prints receding into darkness.
 * Scrolling pulls the line toward you; each print can be hovered (lift) and opened.
 */
export function LineGallery() {
  const { reduced } = useMotionPrefs();
  return reduced ? <GridFallback /> : <Line />;
}

function Line() {
  const section = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const prints = useRef<(HTMLAnchorElement | null)[]>([]);
  const wires = useRef<(HTMLDivElement | null)[]>([]);
  const hovered = useRef<number>(-1);
  const [active, setActive] = useState(0);
  const SEGMENTS = (N + 3) * 2;

  // Scroll progress through the pinned section, from Motion.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  useEffect(
    () => {
      let dims = measure();
      const applyWidths = () =>
        prints.current.forEach((el) => el && (el.style.width = `${dims.W}px`));
      applyWidths();
      let target = 0;
      let current = 0;
      let lastActive = -1;
      const lifts = new Array(N).fill(0);
      const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

      const toTarget = (p: number) => clamp((p - 0.03) / 0.94, 0, 1) * (N - 1);
      target = toTarget(scrollYProgress.get());
      current = target;
      const unsubscribe = scrollYProgress.on("change", (p) => {
        target = toTarget(p);
      });

      const pin = (k: number) => {
        const t = k - current;
        const lift = k >= 0 && k < N ? lifts[k] : 0;
        return {
          x: t * dims.dx,
          y: -t * dims.dy - lift * 22,
          z: -t * dims.dz + lift * 90,
          t,
        };
      };

      const render = (dt: number) => {
        const k = 1 - Math.pow(1 - 0.09, dt * 60);
        current += (target - current) * k;
        if (Math.abs(target - current) < 0.0004) current = target;

        mouse.sx += (mouse.x - mouse.sx) * k;
        mouse.sy += (mouse.y - mouse.sy) * k;
        if (scene.current) {
          scene.current.style.transform = `rotateX(${(-mouse.sy * 3).toFixed(3)}deg) rotateY(${(mouse.sx * 4).toFixed(3)}deg)`;
        }

        for (let i = 0; i < N; i++) {
          lifts[i] += ((hovered.current === i ? 1 : 0) - lifts[i]) * k * 1.4;
          const el = prints.current[i];
          if (!el) continue;
          const p = pin(i);
          const far = clamp((p.t - 4.6) / 1.6, 0, 1);
          const near = clamp((-p.t - 0.3) / 0.6, 0, 1);
          const alpha = 1 - Math.max(far, near);
          const dim = clamp(p.t * 0.14, 0, 0.75) * (1 - lifts[i] * 0.8);
          el.style.transform = `translate3d(${(p.x - dims.W * 0.07).toFixed(2)}px, ${p.y.toFixed(2)}px, ${p.z.toFixed(2)}px) rotateY(${dims.rot}deg)`;
          el.style.setProperty("--a", alpha.toFixed(3));
          el.style.setProperty("--dim", dim.toFixed(3));
          el.style.visibility = alpha <= 0.001 ? "hidden" : "visible";
        }

        // Sagging wire between consecutive pins.
        let s = 0;
        for (let kk = -2; kk <= N; kk++) {
          const a = pin(kk);
          const b = pin(kk + 1);
          const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + dims.sag, z: (a.z + b.z) / 2, t: (a.t + b.t) / 2 };
          for (const [p, q] of [
            [a, m],
            [m, b],
          ] as const) {
            const el = wires.current[s++];
            if (!el) continue;
            const vx = q.x - p.x;
            const vy = q.y - p.y;
            const vz = q.z - p.z;
            const h = Math.hypot(vx, vz);
            const len = Math.hypot(h, vy);
            const ry = Math.atan2(-vz, vx) * toDeg;
            const rz = Math.atan2(vy, h) * toDeg;
            const tm = (p.t + q.t) / 2;
            const op = tm < -1.1 ? 0 : 1 - clamp((tm - 4.4) / 2.2, 0, 1);
            el.style.width = `${len.toFixed(2)}px`;
            el.style.opacity = op.toFixed(3);
            el.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, ${p.z.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg)`;
          }
        }

        const idx = clamp(Math.round(current), 0, N - 1);
        if (idx !== lastActive) {
          lastActive = idx;
          setActive(idx);
        }
      };

      let running = false;
      const tick = ({ delta }: { delta: number }) => render(Math.min(delta, 50) / 1000);
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          frame.update(tick, true);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelFrame(tick);
        }
      });
      io.observe(section.current!);
      render(1);

      const onResize = () => {
        dims = measure();
        applyWidths();
        render(1);
      };
      const onMove = (e: PointerEvent) => {
        mouse.x = e.clientX / window.innerWidth - 0.5;
        mouse.y = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onMove, { passive: true });

      return () => {
        io.disconnect();
        unsubscribe();
        cancelFrame(tick);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onMove);
      };
    },
    [scrollYProgress],
  );

  const project = projects[active];
  // Long titles step down so they stay on one line inside the panel.
  const titleSize =
    project.title.length > 14
      ? "clamp(1.6rem, 3.7vw, 3.9rem)"
      : project.title.length > 10
        ? "clamp(1.8rem, 4.5vw, 4.8rem)"
        : "clamp(2rem, 6vw, 6.2rem)";

  return (
    <section
      ref={section}
      id="works"
      aria-label="Selected works"
      className="relative"
      style={{ height: `${100 + (N - 1) * 62 + 30}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* depth fog */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(80% 60% at 75% 20%, transparent 30%, rgba(11,11,11,.55) 100%), linear-gradient(to bottom, rgba(11,11,11,.0) 60%, rgba(11,11,11,.5))",
          }}
        />

        {/* 3D stage */}
        <div
          className="absolute inset-0"
          style={{ perspective: "1300px", perspectiveOrigin: "55% 30%" }}
        >
          <div
            ref={scene}
            className="p3d absolute left-[26%] top-[60%] md:left-[44%] md:top-[44%]"
          >
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  wires.current[i] = el;
                }}
                aria-hidden
                className="absolute left-0 top-0 h-px origin-[0_0] bg-paper/60"
              />
            ))}

            {projects.map((p, i) => {
              const plate = p.plates[p.cover];
              const aspect = plate.width / plate.height;
              return (
                <TransitionLink
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  ref={(el) => {
                    prints.current[i] = el;
                  }}
                  cursor="open"
                  aria-label={`${p.title} — ${p.discipline}, ${p.year}`}
                  onPointerEnter={() => (hovered.current = i)}
                  onPointerLeave={() => (hovered.current = -1)}
                  onFocus={() => (hovered.current = i)}
                  onBlur={() => (hovered.current = -1)}
                  className="p3d absolute left-0 top-0 block origin-[7%_0] will-change-transform"
                  style={{ width: "min(33vw, 62vh, 620px)" }}
                >
                  <PrintFace src={plate.src} aspect={aspect} index={i} />
                </TransitionLink>
              );
            })}
          </div>
        </div>

        {/* Text panel */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-20 md:inset-y-0 md:right-auto md:flex md:w-[38%] md:flex-col md:justify-center md:px-6 md:pt-0">
          <div className="mono flex items-center gap-3 text-paper-dim">
            <span>Selected Works</span>
            <span className="h-px w-8 bg-paper-faint" />
            <span className="tabular-nums text-paper">
              {pad(active + 1)} — {pad(N)}
            </span>
          </div>

          <div className="relative mt-4 overflow-hidden md:mt-6" style={{ height: `calc(${titleSize} * 1.1)` }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.h2
                key={project.slug}
                className="display absolute inset-x-0 top-0 whitespace-nowrap"
                style={{ fontSize: titleSize }}
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-105%" }}
                transition={{ duration: 0.9, ease }}
              >
                {project.title}
              </motion.h2>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease }}
            >
              <div className="mono mt-4 flex flex-wrap gap-x-4 gap-y-1 text-paper-dim">
                <span>{project.discipline}</span>
                <span>{project.client}</span>
                <span>{project.year}</span>
              </div>
              <p className="mt-4 hidden max-w-sm text-[15px] leading-relaxed text-paper/80 md:block">
                {project.summary}
              </p>
            </motion.div>
          </AnimatePresence>

          <TransitionLink
            href={`/work/${project.slug}`}
            cursor="open"
            className="mono group pointer-events-auto mt-6 inline-flex w-fit items-center gap-3 text-paper md:mt-8"
          >
            <span className="link-draw pb-1">View project</span>
            <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
          </TransitionLink>

          {/* progress ticks */}
          <div aria-hidden className="mt-8 hidden gap-1.5 md:flex">
            {projects.map((p, i) => (
              <span
                key={p.slug}
                className="h-[3px] w-6 rounded-full transition-colors duration-500"
                style={{ background: i === active ? "var(--paper)" : "var(--paper-faint)" }}
              />
            ))}
          </div>
        </div>

        <p className="mono pointer-events-none absolute bottom-24 right-4 z-10 hidden text-paper-dim md:right-6 md:block">
          Scroll to travel the line · Click a print to open
        </p>
      </div>
    </section>
  );
}

function PrintFace({ src, aspect, index }: { src: string; aspect: number; index: number }) {
  return (
    <>
      {/* front */}
      <div
        className="relative w-full overflow-hidden bg-[#e9e4d6] p-[3.2%] shadow-[0_60px_90px_-40px_rgba(0,0,0,.95)]"
        style={{ aspectRatio: aspect, opacity: "var(--a, 1)" }}
      >
        <div className="relative h-full w-full overflow-hidden bg-ink-3">
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 768px) 70vw, 45vw"
            className="object-cover"
            loading={index < 3 ? "eager" : "lazy"}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-ink transition-none"
          style={{ opacity: "var(--dim, 0)" }}
        />
      </div>
      {/* right edge (paper thickness) */}
      <div
        aria-hidden
        className="absolute left-full top-0 h-full w-[7px] origin-left"
        style={{
          transform: "rotateY(90deg)",
          background: "linear-gradient(to right, #cfc6ae, #9c937c)",
          opacity: "var(--a, 1)",
          filter: "brightness(calc(1 - var(--dim, 0)))",
        }}
      />
      {/* bottom edge */}
      <div
        aria-hidden
        className="absolute left-0 top-full h-[7px] w-full origin-top"
        style={{
          transform: "rotateX(-90deg)",
          background: "linear-gradient(to bottom, #b7ae96, #7d7562)",
          opacity: "var(--a, 1)",
          filter: "brightness(calc(1 - var(--dim, 0)))",
        }}
      />
      {/* clothespin */}
      <div
        aria-hidden
        className="absolute left-[7%] top-[-20px] h-[38px] w-[13px] -translate-x-1/2 rounded-[2px]"
        style={{
          background: "linear-gradient(to right, #d9ccae 0%, #f1e8d2 45%, #b9a983 100%)",
          boxShadow: "0 6px 10px -4px rgba(0,0,0,.6)",
          opacity: "var(--a, 1)",
          transform: "translateZ(2px)",
        }}
      >
        <span className="absolute inset-x-[5px] top-0 h-full bg-black/15" />
        <span className="absolute inset-x-0 top-[38%] h-[4px] bg-[#8c8064]" />
      </div>
    </>
  );
}

function GridFallback() {
  return (
    <section id="works" aria-label="Selected works" className="px-4 py-28 md:px-6">
      <div className="mono mb-8 flex items-center gap-3 text-paper-dim">
        Selected Works <span className="h-px w-8 bg-paper-faint" /> {pad(N)}
      </div>
      <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => {
          const plate = p.plates[p.cover];
          return (
            <li key={p.slug}>
              <TransitionLink href={`/work/${p.slug}`} className="group block" cursor="open">
                <div className="relative aspect-[1.4] overflow-hidden bg-ink-3">
                  <Image src={plate.src} alt={plate.alt} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="display text-4xl">{p.title}</h3>
                  <span className="mono text-paper-dim">{pad(i + 1)}</span>
                </div>
                <p className="mono mt-2 text-paper-dim">
                  {p.discipline} · {p.year}
                </p>
              </TransitionLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
