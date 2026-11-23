import { Hero } from "@/components/home/Hero";
import { LineGallery } from "@/components/home/LineGallery";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/chrome/Footer";
import { WorkTable } from "@/components/work/WorkTable";
import { RevealLines } from "@/components/ui/Reveal";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <>
      <Hero />
      <LineGallery />
      <section aria-labelledby="index-title" className="px-4 pt-28 md:px-6 md:pt-40">
        <div className="mb-12 flex items-end justify-between gap-6 md:mb-16">
          <RevealLines as="h2" className="display text-[clamp(3rem,9vw,9rem)]" lines={["Project"]} />
          <p className="mono max-w-[30ch] pb-2 text-right text-paper-dim">
            {projects.length} projects · Hover to lift a print, click to open
          </p>
        </div>
        <span id="index-title" className="sr-only">
          Projects
        </span>
        <WorkTable />
      </section>
      <About />
      <Contact />
      <Footer />
    </>
  );
}
