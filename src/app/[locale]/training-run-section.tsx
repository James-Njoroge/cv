import { Kicker, Pill, Sep, StatusDot, TechChip } from "@/components/jn/atoms";
import { LossCurve } from "@/components/jn/loss-curve";
import { Reveal } from "@/components/jn/reveal";
import { SectionHeading } from "@/components/jn/section-heading";
import { checkpoints, deployments } from "@/data/training-run";

const MARKS = [
  ...checkpoints.map((c) => ({ id: c.id, step: c.step, label: c.id.replace("-", " ") })),
  { id: "deployment", step: "2400", label: "deployment" },
];

function CheckpointCard({ ckpt, index }: { ckpt: (typeof checkpoints)[number]; index: number }) {
  return (
    <Reveal
      as="article"
      index={index}
      data-ckpt={ckpt.id}
      className="rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary sm:px-8"
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[11px] font-bold uppercase leading-none tracking-[0.08em] text-primary">
          CKPT&#8209;{ckpt.step}
        </span>
        <Sep />
        <Kicker>{ckpt.label}</Kicker>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
        <h3 className="m-0 font-display text-[1.875rem] font-semibold leading-tight tracking-[-0.02em]">
          {ckpt.title}
          {ckpt.honour && <span className="ml-2 text-xl text-amber">{ckpt.honour}</span>}
        </h3>
        {ckpt.period && (
          <span className="font-mono text-xs font-medium leading-none text-muted-foreground">
            {ckpt.period}
          </span>
        )}
      </div>

      <p className="mt-3 max-w-[60ch] text-pretty leading-relaxed text-muted-foreground">
        {ckpt.body}
      </p>

      {ckpt.augmentation && (
        <div className="mt-5 rounded-md border border-border bg-secondary p-4 sm:px-[18px]">
          <Kicker tone="amber" className="mb-2 block">
            {ckpt.augmentation.kicker}
          </Kicker>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="font-display text-[1.0625rem] font-semibold">
              {ckpt.augmentation.title}
            </span>
            <span className="font-mono text-[11px] font-medium leading-none text-muted-foreground">
              {ckpt.augmentation.period}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {ckpt.augmentation.detail}
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {ckpt.tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
      </div>
    </Reveal>
  );
}

function DeploymentRow({ job }: { job: (typeof deployments)[number] }) {
  const heading = job.link ? (
    <a
      href={job.link}
      target="_blank"
      rel="noopener noreferrer"
      className="font-display text-[1.1875rem] font-semibold text-foreground transition-colors hover:text-primary"
    >
      {job.org}
    </a>
  ) : (
    <span className="font-display text-[1.1875rem] font-semibold text-foreground">{job.org}</span>
  );

  return (
    <div className="bg-card p-5 sm:px-[22px]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
        <p className="m-0 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          {heading}
          <span className="font-mono text-xs font-medium leading-none text-muted-foreground">
            {job.role}
          </span>
        </p>
        <span
          className={`flex items-center gap-2 font-mono text-[11px] font-medium leading-none ${
            job.live ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {job.live && <StatusDot />}
          {job.period}
        </span>
      </div>

      {job.location && (
        <p className="mt-1.5 font-mono text-[11px] leading-none text-muted-foreground">
          {job.location}
        </p>
      )}

      <ul className="mt-3 list-disc space-y-1.5 pl-[18px] text-[0.9375rem] leading-relaxed text-muted-foreground">
        {job.points.map((point) => (
          <li key={point} className="text-pretty">
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {job.stack.map((tech) => (
          <TechChip key={tech}>{tech}</TechChip>
        ))}
      </div>
    </div>
  );
}

export function TrainingRunSection() {
  const liveCount = deployments.filter((d) => d.live).length;

  return (
    <section id="run" className="container-jn scroll-mt-24 pb-28 pt-10">
      <SectionHeading
        index="01"
        title="The training run"
        meta={`${checkpoints.length + 1} checkpoints · 2018–present`}
      />

      <div className="grid items-start gap-14 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="max-w-[400px] lg:sticky lg:top-[110px] print:hidden">
          <LossCurve marks={MARKS} />
        </div>

        <div className="flex flex-col gap-6">
          {checkpoints.map((ckpt, i) => (
            <CheckpointCard key={ckpt.id} ckpt={ckpt} index={i} />
          ))}

          <Reveal
            as="article"
            data-ckpt="deployment"
            className="rounded-xl border border-primary bg-gradient-to-b from-secondary to-card p-7 sm:px-8"
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] font-bold uppercase leading-none tracking-[0.08em] text-primary">
                CKPT&#8209;2400
              </span>
              <Sep live />
              <Kicker tone="signal">Deployed in production</Kicker>
            </div>

            <h3 className="m-0 font-display text-[1.875rem] font-semibold leading-tight tracking-[-0.02em]">
              Where the weights are running
            </h3>
            <p className="mb-6 mt-3 max-w-[60ch] text-pretty leading-relaxed text-muted-foreground">
              {deployments.length} deployments so far, {liveCount} of them still live — a company I
              founded, a company I run engineering for, finance automation inside a Fortune 500, and
              four years of teaching and research.
            </p>

            <div className="flex flex-col gap-0.5 overflow-hidden rounded-md border border-border bg-background">
              {deployments.map((job) => (
                <DeploymentRow key={`${job.org}-${job.role}`} job={job} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
