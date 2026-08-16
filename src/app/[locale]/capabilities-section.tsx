import { Kicker } from "@/components/jn/atoms";
import { ConfidenceBar } from "@/components/jn/confidence-bar";
import { Reveal } from "@/components/jn/reveal";
import { SectionHeading } from "@/components/jn/section-heading";
import { capabilityGroups } from "@/data/capabilities";
import { copy } from "@/lib/copy";

export function CapabilitiesSection() {
  return (
    <section id="caps" className="container-jn scroll-mt-24 pb-28">
      <SectionHeading {...copy.sections.caps} />

      <div className="grid gap-11 sm:grid-cols-2 sm:gap-x-16 lg:grid-cols-3">
        {capabilityGroups.map((group, i) => (
          <Reveal key={group.label} index={i} className="flex flex-col gap-4">
            <Kicker tone="amber" className="tracking-[0.08em]">
              {group.label}
            </Kicker>
            {group.items.map((item) => (
              <ConfidenceBar
                key={item.name}
                name={item.name}
                confidence={item.confidence}
                accent={group.accent}
              />
            ))}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
