import { GlobeIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

// Import the HireMePopup component
import HireMePopup from "@/components/hire-me-popup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useResumeData } from "@/data/use-resume-data";

import { AboutSection } from "./about-section";
import { CourseworkSection } from "./coursework-section";
import { EducationSection } from "./education-section";
import { ProjectsSection } from "./projects-section";
import { SkillsSection } from "./skills-section";
import { WorkExperienceSection } from "./work-experience-section";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale });
  return {
    title: `${t("name")} | ${t("about")}`,
    description: t("summary"),
  };
}

export default function Page({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations();
  const resumeData = useResumeData();

  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 md:p-16 print:p-12">
      <meta name="image" property="og:image" content="/images/headshot.png" />
      <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6">
        <div className="flex flex-row justify-end   gap-x-2 print:hidden">
          <ModeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold">{resumeData.name}</h1>
            <p className="max-w-md text-pretty font-mono text-sm text-muted-foreground">
              {t("about")}
            </p>
            <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href={resumeData.locationLink}
                target="_blank"
              >
                <GlobeIcon className="h-3 w-3" />
                {resumeData.location}
              </a>
            </p>
            <div className="flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground print:hidden">
              {resumeData.contact.social.map((social) => (
                <Button key={social.name} className="h-8 w-8" variant="outline" size="icon" asChild>
                  <a href={social.url}>
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          <Avatar className="h-40 w-40">
            <AvatarImage alt={resumeData.name} src={resumeData.avatarUrl} />
            <AvatarFallback>{resumeData.initials}</AvatarFallback>
          </Avatar>
        </div>
        <AboutSection />
        <EducationSection />
        <SkillsSection />
        <CourseworkSection />
        <WorkExperienceSection
          jobs={resumeData.work}
          dict={{
            seeMore: t("seeMore"),
            seeLess: t("seeLess"),
            workExperience: t("sections.workExperience"),
          }}
        />
        <ProjectsSection />
      </section>

      {/* Add the HireMePopup component here */}
      <HireMePopup />
    </main>
  );
}
