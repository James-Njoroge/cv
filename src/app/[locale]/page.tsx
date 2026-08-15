import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { JsonLd, profilePageJsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";

import { BuiltSection } from "./built-section";
import { CapabilitiesSection } from "./capabilities-section";
import { ChatSection } from "./chat-section";
import { EvalsSection } from "./evals-section";
import { HeroSection } from "./hero-section";
import { TrainingRunSection } from "./training-run-section";
import { WritingSection } from "./writing-section";

type Props = {
  params: { locale: string };
};

export function generateMetadata(): Metadata {
  return {
    title: `${site.name} — ${site.headline}`,
    description: site.description,
  };
}

export default function Page({ params: { locale } }: Props) {
  setRequestLocale(locale);

  return (
    <main>
      <HeroSection />
      <TrainingRunSection />
      <CapabilitiesSection />
      {/* Server component — reads the live GitHub feed */}
      <BuiltSection />
      <EvalsSection />
      <WritingSection />
      <ChatSection />
      <JsonLd data={profilePageJsonLd()} />
    </main>
  );
}
