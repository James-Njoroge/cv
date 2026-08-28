import { Kicker } from "@/components/jn/atoms";
import { Reveal } from "@/components/jn/reveal";
import { SectionHeading } from "@/components/jn/section-heading";
import { evalGroups } from "@/data/capabilities";
import { copy, fill } from "@/lib/copy";

export function EvalsSection() {
  const total = evalGroups.reduce((n, group) => n + group.courses.length, 0);
  const c = copy.sections.evals;

  return (
    <section id="evals" className="container-jn scroll-mt-24 pb-28">
      <SectionHeading index={c.index} title={c.title} meta={fill(c.meta, { count: total })} />

      <div className="flex flex-col gap-11">
        {evalGroups.map((group, groupIndex) => (
          <div key={group.label}>
            <Reveal className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-lg font-semibold tracking-[-0.02em]">
                {group.label}
              </span>
              <Kicker>{group.detail}</Kicker>
            </Reveal>

            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3 p-0">
              {group.courses.map((course, i) => (
                <Reveal
                  key={course}
                  as="li"
                  index={groupIndex + i}
                  className="flex items-center gap-3 rounded-md border border-border bg-card px-[18px] py-4"
                >
                  <span className="font-mono text-[11px] font-bold leading-none text-primary">
                    {group.passLabel}
                  </span>
                  <span className="text-[0.9375rem]">{course}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
