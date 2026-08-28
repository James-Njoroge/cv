import Image from "next/image";

import { StatusDot } from "@/components/jn/atoms";
import { TokenStream } from "@/components/jn/token-stream";
import { copy } from "@/lib/copy";
import { site } from "@/lib/site";

const c = copy.hero;

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh items-center px-5 pb-20 pt-32 sm:px-7 sm:pt-36"
    >
      <div aria-hidden className="grid-drift absolute inset-0 opacity-50 print:hidden" />

      <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="mb-6 flex items-center gap-2.5">
            <StatusDot />
            <span className="telemetry font-medium text-muted-foreground">{c.kicker}</span>
          </p>

          <h1 className="m-0 text-balance font-display text-[clamp(2.875rem,6.6vw,5.75rem)] font-semibold leading-[0.94] tracking-[-0.035em]">
            {c.titleLine1}
            <br />
            <span className="text-muted-foreground">{c.titleLead}</span>
            {c.titleAccent}
            <br />
            {c.titleLine3}
          </h1>

          <p className="mt-6 max-w-[46ch] text-pretty text-lg leading-[1.55] text-muted-foreground sm:text-[1.1875rem]">
            {c.intro}
          </p>

          {/* Inference terminal */}
          <div className="mt-9 max-w-[620px] overflow-hidden rounded-lg border border-border bg-card print:hidden">
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-3.5 py-3">
              <span className="h-[9px] w-[9px] rounded-full bg-amber" />
              <span className="h-[9px] w-[9px] rounded-full bg-border" />
              <span className="h-[9px] w-[9px] rounded-full bg-border" />
              <span className="ml-1.5 font-mono text-[11px] font-medium leading-none text-muted-foreground">
                {c.terminalEndpoint}
              </span>
            </div>
            <div className="px-4 py-4 font-mono text-sm leading-[1.75] sm:px-[18px]">
              <p className="text-muted-foreground">
                <span className="text-amber">{c.terminalUserLabel}</span> {c.terminalUserLine}
              </p>
              <p className="mt-2.5 text-pretty text-foreground">
                <span className="text-primary">{c.terminalModelLabel}</span>{" "}
                <TokenStream text={c.stream} />
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 print:hidden">
            <a
              href="#run"
              className="rounded-full bg-primary px-6 py-3.5 font-display text-sm font-semibold leading-none text-primary-foreground transition-colors hover:bg-amber"
            >
              {c.ctaPrimary}
            </a>
            <a
              href={site.resumePath}
              download
              className="rounded-full border border-border px-6 py-3.5 font-display text-sm font-semibold leading-none text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {c.ctaResume}
            </a>
            <a
              href="#chat"
              className="rounded-full border border-border px-6 py-3.5 font-display text-sm font-semibold leading-none text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {c.ctaChat}
            </a>
          </div>

          {/* Print-only contact line for the PDF resume */}
          <p className="hidden font-mono text-xs text-muted-foreground print:block">
            {site.email} · {site.phone} · {site.url.replace("https://", "")} ·{" "}
            {site.social.github.replace("https://", "")} ·{" "}
            {site.social.linkedin.replace("https://www.", "")}
          </p>
        </div>

        {/* Capped and centred on small screens so the card doesn't push the
            rest of the hero a full screen further down. */}
        <div className="mx-auto w-full max-w-[290px] sm:max-w-[330px] lg:mx-0 lg:max-w-none">
          <div className="rounded-xl border border-border bg-card p-3.5">
            {/* The photo is warm and busy; the palette is near-black and quiet.
                A light desaturation plus a background-tinted wash settles it
                into the page without turning him into a graphic. */}
            <div className="relative overflow-hidden rounded-md">
              <Image
                src="/images/headshot2.jpg"
                alt={c.imageAlt}
                width={520}
                height={650}
                priority
                className="aspect-[4/5] w-full object-cover [filter:saturate(0.62)_contrast(1.06)_brightness(0.92)]"
              />
              <span aria-hidden className="absolute inset-0 bg-background/25 mix-blend-multiply" />
              <span
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_25%,transparent_35%,oklch(var(--background)/0.65)_100%)]"
              />
            </div>
            <dl className="mt-3.5 grid grid-cols-2 gap-x-2 gap-y-2.5 font-mono text-[11px] font-medium leading-[1.5]">
              {c.specs.map((spec) => (
                <div key={spec.key} className="contents">
                  <dt className="text-muted-foreground">{spec.key}</dt>
                  <dd
                    className={`m-0 text-right ${spec.highlight ? "text-primary" : "text-foreground"}`}
                  >
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
