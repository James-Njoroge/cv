import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { useResumeData } from "@/data/use-resume-data";

export const CourseworkSection = () => {
  const t = useTranslations();
  const resumeData = useResumeData();

  return (
    <Section>
      <h2 className="text-xl font-bold">{t("sections.coursework")}</h2>
      <div className="flex flex-wrap gap-1">
        {resumeData.coursework.map((course) => {
          return <Badge key={course}>{course}</Badge>;
        })}
      </div>
    </Section>
  );
};
