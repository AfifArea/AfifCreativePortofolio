"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/** Text lines that rise out of a mask when scrolled into view. */
export function RevealLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  as: Tag = "div",
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "div" | "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Fade + lift for blocks. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}
