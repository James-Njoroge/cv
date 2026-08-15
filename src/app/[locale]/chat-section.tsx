import { Kicker } from "@/components/jn/atoms";
import { ContactChat } from "@/components/jn/contact-chat";
import { Reveal } from "@/components/jn/reveal";
import { SectionHeading } from "@/components/jn/section-heading";
import { site } from "@/lib/site";

const ENDPOINTS = [
  { label: "Email", value: site.email, href: `mailto:${site.email}?subject=Hello%20James` },
  { label: "GitHub", value: "James-Njoroge", href: site.social.github },
  { label: "LinkedIn", value: "james-ngugi-njoroge", href: site.social.linkedin },
  {
    label: "Deployed in",
    value: "Boston, MA · EST",
    href: "https://www.google.com/maps/place/Boston,+MA",
  },
];

export function ChatSection() {
  return (
    <section id="chat" className="container-jn scroll-mt-24 pb-24">
      <SectionHeading index="06" title="Chat with the model." meta="latency: usually same day" />

      <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Reveal className="print:hidden">
          <ContactChat />
        </Reveal>

        <Reveal index={1} className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
          {ENDPOINTS.map((endpoint) => (
            <a
              key={endpoint.label}
              href={endpoint.href}
              target={endpoint.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary hover:bg-secondary"
            >
              <Kicker className="tracking-[0.08em]">{endpoint.label}</Kicker>
              <span className="break-words font-display text-[1.0625rem] font-semibold text-foreground">
                {endpoint.value}
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
