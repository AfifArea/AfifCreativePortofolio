import { TransitionLink } from "@/components/transition/TransitionLink";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col items-start justify-end px-4 pb-32 md:px-6">
      <span className="mono text-paper-dim">Error 404</span>
      <h1 className="display mt-4 text-[clamp(4rem,16vw,15rem)]">Off the line</h1>
      <p className="mt-4 max-w-md text-lg text-paper/75">This print isn&apos;t hanging here. Head back to the main line.</p>
      <TransitionLink href="/" className="pill mono mt-8 text-paper">
        ← Back to main
      </TransitionLink>
    </section>
  );
}
