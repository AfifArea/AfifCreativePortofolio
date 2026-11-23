"use client";

import Image from "next/image";
import type { Project } from "@/lib/projects";
import { pad } from "@/lib/projects";
import { TransitionLink } from "@/components/transition/TransitionLink";

export function NextProject({ project, index }: { project: Project; index: number }) {
  const plate = project.plates[project.cover];
  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      cursor="next"
      className="group relative flex h-[80svh] min-h-[460px] flex-col justify-end overflow-hidden px-4 pb-28 md:px-6"
      aria-label={`Next project: ${project.title}`}
    >
      <div className="absolute inset-0">
        <Image
          src={plate.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-35 transition-[transform,opacity] duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105 group-hover:opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink" />
      </div>
      <div className="relative">
        <div className="mono flex items-center gap-3 text-paper-dim">
          Next — {pad(index + 1)}
          <span className="h-px w-10 bg-paper-dim transition-[width] duration-700 group-hover:w-20" />
        </div>
        <h2 className="display mt-4 text-[clamp(3.6rem,14vw,14rem)] transition-transform duration-1000 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3">
          {project.title} ›
        </h2>
        <p className="mono mt-4 text-paper-dim">
          {project.discipline} · {project.year}
        </p>
      </div>
    </TransitionLink>
  );
}
