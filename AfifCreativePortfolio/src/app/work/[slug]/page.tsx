import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getNeighbours, getProject, pad, projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { PlateViewer } from "@/components/work/PlateViewer";
import { PlateSequence } from "@/components/work/PlateSequence";
import { NextProject } from "@/components/work/NextProject";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { Footer } from "@/components/chrome/Footer";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { images: [project.plates[project.cover].src] },
  };
}

export default function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[100svh]" />}>
      <Project params={params} />
    </Suspense>
  );
}

async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { index, next } = getNeighbours(slug);

  const meta: [string, string][] = [
    ["Client", project.client],
    ["Discipline", project.discipline],
    ["Year", project.year],
    ["Role", project.role],
    ["Tools", project.tools.join(" · ")],
    ["Deliverables", project.deliverables.join(" · ")],
  ];

  return (
    <article>
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex gap-2 md:right-6 md:top-6">
        <TransitionLink href="/work" className="pill mono pointer-events-auto text-paper">
          ← All work
        </TransitionLink>
        <span className="pill mono tabular-nums text-paper-dim">
          {pad(index + 1)} — {pad(projects.length)}
        </span>
      </div>

      <section className="grid gap-10 px-4 pb-24 pt-24 md:px-6 md:pt-28 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-7 xl:col-span-8">
          <Reveal y={40}>
            <PlateViewer
              plates={project.plates}
              caption={`Plate ${pad(index + 1)} — ${project.title} · ${project.client}`}
            />
          </Reveal>
        </div>

        <div className="min-w-0 lg:col-span-5 lg:pt-2 xl:col-span-4">
          <div className="lg:sticky lg:top-28">
            <span className="mono text-paper-dim">{pad(index + 1)}</span>
            <RevealLines
              as="h1"
              className="display mt-2 text-[clamp(3.4rem,8vw,7rem)]"
              lines={[project.title]}
            />
            <Reveal delay={0.15} className="mt-6 space-y-4 text-[17px] leading-relaxed text-paper/80">
              {project.description.map((d, i) => (
                <p key={i}>{d}</p>
              ))}
            </Reveal>

            <Reveal delay={0.25}>
              <dl className="mt-10 border-t border-line">
                {meta.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-line py-3">
                    <dt className="mono text-paper-dim">{k}</dt>
                    <dd className="mono text-paper">{v}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(`About ${project.title}`)}`}
                className="mono group mt-8 inline-flex items-center gap-3 text-paper"
                data-cursor="write"
              >
                <span className="link-draw pb-1">Start a similar project</span>
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {project.plates.length > 1 && (
        <section aria-label="All plates" className="px-4 pb-24 md:px-6">
          <PlateSequence plates={project.plates} title={project.title} />
        </section>
      )}

      <NextProject project={next} index={(index + 1) % projects.length} />
      <Footer />
    </article>
  );
}
