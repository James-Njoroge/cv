import { useTranslations } from "next-intl";

import { Section } from "@/components/ui/section";

export const AboutSection = () => {
  const t = useTranslations();

  return (
    <Section>
      <h2 className="text-xl font-bold">{t("sections.about")}</h2>
      <p className="text-pretty font-mono text-sm text-muted-foreground">{t("summary")}</p>
    </Section>
  );
};
