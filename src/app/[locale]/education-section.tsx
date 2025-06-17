import Image from "next/image";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { useResumeData } from "@/data/use-resume-data";

export const EducationSection = () => {
  const t = useTranslations();
  const resumeData = useResumeData();

  return (
    <Section>
      <h2 className="text-xl font-bold">{t("sections.education")}</h2>
      {resumeData.education.map((education) => (
        <div key={education.school} className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-x-1">
            <Image className="h-12 w-12" alt={education.degree} src={education.logo} />

            {/* Card need not carry a second key, but it can if you prefer */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-x-2 text-base">
                  <h3 className="font-semibold">
                    {education.school}
                    <span className="inline-flex gap-x-1">
                      {education.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className="align-middle text-sm font-medium"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </span>
                  </h3>
                </div>
              </CardHeader>
              <CardContent>{education.degree}</CardContent>
            </Card>
          </div>

          <div className="text-end text-sm tabular-nums text-muted-foreground">
            {education.start} – {education.end}
          </div>
        </div>
      ))}
    </Section>
  );
};
