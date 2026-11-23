"use client";

import { site } from "@/lib/site";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { TiltPrint } from "@/components/ui/TiltPrint";

type Row = { role: string; org: string; period: string };

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mono mb-4 text-paper-dim">{title}</h3>
      <ul className="space-y-2.5 text-[14px] leading-snug">{children}</ul>
    </div>
  );
}

const rows = (items: readonly Row[]) =>
  items.map((it) => (
    <li key={`${it.role}-${it.org}`}>
      <span className="block text-paper">{it.role}</span>
      <span className="mt-0.5 block text-[13px] text-paper-dim">{it.org}</span>
      <span className="mono block text-[10px] text-paper-dim">{it.period}</span>
    </li>
  ));

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative grid min-h-[100svh] items-center gap-16 px-4 py-28 md:px-6 lg:grid-cols-12 lg:gap-8 lg:py-32"
    >
      <div className="lg:col-span-5">
        <RevealLines as="h2" className="display text-[clamp(4.4rem,11vw,10rem)]" lines={["About"]} />
        <span id="about-title" className="sr-only">
          About {site.name}
        </span>

        <Reveal delay={0.1} className="mt-6 border-t border-line pt-6">
          <p className="max-w-md text-[17px] leading-relaxed text-paper/80">{site.bio}</p>
          <p className="mono mt-6 flex items-center gap-3 text-paper-dim">
            <span className="h-px w-8 bg-paper-faint" />
            {site.location} · Open to remote work
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          <Column title="Expertise">
            {site.expertise.map((e) => (
              <li key={e} className="text-paper">
                {e}
              </li>
            ))}
          </Column>
          <Column title="Experience">{rows(site.experience)}</Column>
          <div className="space-y-10">
            <Column title="Education">{rows(site.education)}</Column>
            <Column title="Tools">
              {site.tools.map((t) => (
                <li key={t} className="text-paper">
                  {t}
                </li>
              ))}
            </Column>
          </div>
        </Reveal>
      </div>

      <figure className="relative lg:col-span-6 lg:col-start-7">
        <TiltPrint
          src="/about/mark.webp"
          alt={`${site.brand} personal mark — a silver monogram on a dark red background`}
          aspect={1024 / 1536}
          sizes="(max-width: 1024px) 80vw, 40vw"
          className="mx-auto w-[min(78vw,440px)] lg:w-[min(32vw,460px)]"
        />
        <figcaption className="mono mt-12 text-right text-paper-dim">
          {site.name} — Jakarta, 2026
        </figcaption>
      </figure>
    </section>
  );
}
