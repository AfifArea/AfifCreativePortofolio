"use client";

import { useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { TiltPrint } from "@/components/ui/TiltPrint";
import { LocalTime } from "@/components/chrome/Chrome";

const types = ["Social media", "Branding", "Campaign", "Apparel", "UI / UX", "Other"];

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(site.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {}
      }}
      className="mono rounded-full border border-line px-3 py-1.5 text-paper-dim transition-colors hover:border-paper hover:text-paper"
      aria-live="polite"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

function EnquiryForm() {
  const [type, setType] = useState<string>(types[0]);
  const [sent, setSent] = useState(false);

  // Reset the confirmation when the page is hidden and shown again.
  useLayoutEffect(() => () => setSent(false), []);

  return (
    <form
      className="rounded-2xl border border-white/10 bg-ink-2/55 p-5 shadow-[0_40px_100px_-30px_rgba(0,0,0,.9)] backdrop-blur-2xl md:p-7"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = String(data.get("name") || "").trim();
        const from = String(data.get("email") || "").trim();
        const message = String(data.get("message") || "").trim();
        const subject = `${type} enquiry — ${name || "Portfolio"}`;
        const body = `${message}\n\n— ${name}${from ? ` (${from})` : ""}`;
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <div className="mono mb-6 flex justify-between text-paper-dim">
        <span>New enquiry</span>
        <span>01 / 01</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mono text-paper-dim">Name</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-[15px] outline-none transition-colors placeholder:text-paper-faint focus:border-paper"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mono text-paper-dim">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-[15px] outline-none transition-colors placeholder:text-paper-faint focus:border-paper"
            placeholder="you@studio.com"
          />
        </label>
      </div>

      <fieldset className="mt-7">
        <legend className="mono text-paper-dim">Project</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {types.map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="peer sr-only"
              />
              <span className="mono inline-block rounded-full border border-line px-3.5 py-2 text-paper-dim transition-colors peer-checked:border-paper peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 hover:text-paper">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-7 block">
        <span className="mono text-paper-dim">Message</span>
        <textarea
          name="message"
          required
          rows={3}
          className="mt-2 w-full resize-none border-b border-line bg-transparent py-2 text-[15px] outline-none transition-colors placeholder:text-paper-faint focus:border-paper"
          placeholder="Tell me about the brand, the audience and the timeline."
        />
      </label>

      <div className="mt-7 grid gap-2 sm:grid-cols-[1.6fr_1fr]">
        <button
          type="submit"
          data-cursor="send"
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-paper px-6 py-3.5 text-ink transition-transform duration-500 hover:scale-[1.02]"
        >
          <span className="mono">Send enquiry</span>
          <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </button>
        <a
          href={`https://wa.me/${site.phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="mono inline-flex items-center justify-center rounded-full border border-line px-6 py-3.5 text-paper transition-colors hover:border-paper"
        >
          WhatsApp ↗
        </a>
      </div>
      <AnimatePresence>
        {sent && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mono mt-4 text-paper-dim"
          >
            Your email app should open with the message ready.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

export function Contact() {
  const details: [string, React.ReactNode][] = [
    [
      "Phone",
      <a key="p" href={`tel:${site.phone}`} className="link-draw pb-0.5">
        {site.phoneDisplay}
      </a>,
    ],
    ["Studio", site.location],
    [
      "Elsewhere",
      <span key="s" className="flex flex-wrap gap-x-4 gap-y-1">
        {site.socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="link-draw pb-0.5">
            {s.label} ↗
          </a>
        ))}
      </span>,
    ],
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative grid min-h-[100svh] items-center gap-16 px-4 pb-40 pt-28 md:px-6 lg:grid-cols-12 lg:gap-8 lg:pt-32"
    >
      <div className="lg:col-span-5">
        <RevealLines as="h2" className="display text-[clamp(4.4rem,11vw,10rem)]" lines={["Contact"]} />
        <span id="contact-title" className="sr-only">
          Contact
        </span>

        <Reveal delay={0.1} className="mt-6 border-t border-line pt-6">
          <p className="max-w-sm text-[17px] leading-relaxed text-paper/80">
            Social content, campaigns, identities and apparel. I read everything and reply within two days.
          </p>
          <p className="mono mt-5 flex items-center gap-3 text-paper-dim">
            <span className="h-px w-8 bg-paper-faint" />
            Jakarta · <LocalTime />
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-12">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${site.email}`}
              data-cursor="write"
              className="link-draw break-all pb-1 text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight text-paper"
            >
              {site.email} <span className="text-paper-dim">↗</span>
            </a>
            <CopyEmail />
          </div>
          <dl className="mt-8 space-y-3">
            {details.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] items-baseline gap-4 text-[15px]">
                <dt className="mono text-paper-dim">{k}</dt>
                <dd className="text-paper">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Print with a frosted enquiry card laid over it */}
      <div className="relative lg:col-span-7 lg:col-start-6">
        <TiltPrint
          src="/work/fromfit/01.jpg"
          alt="Fromfit landing page print"
          aspect={1750 / 1250}
          baseRotateY={-14}
          sizes="(max-width: 1024px) 90vw, 45vw"
          className="ml-auto w-[92%] lg:w-[84%]"
        />
        <Reveal delay={0.35} className="relative z-10 -mt-[24%] w-full sm:w-[78%] lg:-mt-[30%] lg:w-[62%]">
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
