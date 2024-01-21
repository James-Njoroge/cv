import LaikaLogo from "@/images/logos/laika-logo.png";
import MicrosoftLogo from "@/images/logos/microsoft-logo.png";
import AlphasLogo from "@/images/logos/alphas-logo.png";
import FerrisoftLogo from "@/images/logos/ferrisoft-logo.png";
import NavicuLogo from "@/images/logos/navicu-logo.png";
import TecFenixLogo from "@/images/logos/tecfenix-logo.png";
import ColgateLogo from "@/images/logos/colgate.png";
import ManchesterLogo from "@/images/logos/manchester.png";
import choateLogo from "@/images/logos/choate.png";
import colgateJobLogo from "@/images/logos/colgate-work.png";
import { GitHubLogoIcon, HomeIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

export const useResumeData = () => {
  const t = useTranslations();

  return {
    name: "James Njoroge",
    initials: "JN",
    location: "Hamilton, NY, USA, EST",
    about: t("about"),
    summary: t("summary"),
    locationLink: "https://www.google.com/maps/place/Hamilton,+NY+13346",
    avatarUrl: "/images/headshot.png",
    contact: {
      social: [
        {
          name: "GitHub",
          url: "https://github.com/James-Njoroge",
          icon: GitHubLogoIcon,
        },
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/james-ngugi-njoroge/",
          icon: LinkedInLogoIcon,
        },
      ],
    },
    education: [
      {
        school: t("education.bachelor.school"),
        degree: t("education.bachelor.major"),
        start: "2021",
        end: "2025",
        logo: ColgateLogo,
      },
      {
        school: t("education.abroad.school"),
        degree: t("education.abroad.classes"),
        start: "Sep 2023",
        end: "Jan 2024",
        logo: ManchesterLogo,
      },
      {
        school: t("education.highSchool.school"),
        degree: t("education.highSchool.degree"),
        start: "2018",
        end: "2021",
        logo: choateLogo,
      },
    ],
    work: [
      {
        company: "Colgate Computer Science",
        link: "https://www.colgate.edu/academics/departments-programs/department-computer-science",
        badges: ["Data Structures & Algorithms"],
        title: t("work.colgate-ta.title"),
        logo: colgateJobLogo,
        start: "Jan 2023",
        end: t("present"),
        description: [
          t("work.colgate-ta.description.1"),
          t("work.colgate-ta.description.2"),
          t("work.colgate-ta.description.3"),
          t("work.colgate-ta.description.4"),
        ],
      },
      {
        company: "Colgate Data Science Collaboratory",
        link: "https://shiny.colgate.edu/",
        badges: ["Statistics", "R Shiny"],
        title: t("work.colgate-research.title"),
        logo: colgateJobLogo,
        start: "Jun 2023",
        end: "Sep 2023",
        description: [
          t("work.colgate-research.description.1"),
          t("work.colgate-research.description.2"),
          t("work.colgate-research.description.3"),
          t("work.colgate-research.description.4"),
        ],
      },
      {
        company: "Colgate Department of Economics",
        link: "https://www.colgate.edu/academics/departments-programs/department-economics",
        badges: ["Remote", "Economics"],
        title: t("work.colgate-econ.title"),
        logo: colgateJobLogo,
        start: "Jun 2022",
        end: "Aug 2022",
        description: [
          t("work.colgate-econ.description.1"),
          t("work.colgate-econ.description.2"),
          t("work.colgate-econ.description.3"),
          t("work.colgate-econ.description.4"),
          t("work.colgate-econ.description.5"),
          t("work.colgate-econ.description.6"),
        ],
      },
      {
        company: "Colgate IT Services",
        badges: ["IT"],
        link: "https://www.colgate.edu/about/offices-centers-institutes/information-technology-services",
        title: t("work.colgate-its.title"),
        logo: colgateJobLogo,
        start: "Aug 2021",
        end: "Present",
        description: [
          t("work.colgate-its.description.1"), 
          t("work.colgate-its.description.2"),
          t("work.colgate-its.description.3"),
          t("work.colgate-its.description.4"),
          t("work.colgate-its.description.5"),
        ],
      },
      {
        company: "Marketing Africa",
        badges: [],
        link: "https://navicu.com/",
        title: t("work.ferrisoft.title"),
        logo: NavicuLogo,
        start: "Jan 2017",
        end: "Dec 2017",
        description: [
          t("work.navicu.description.1"),
          t("work.navicu.description.1"),
          t("work.navicu.description.1"),
          t("work.navicu.description.1"),
        ],
      },
      {
        company: "Tecfenix",
        badges: [],
        link: "http://www.tecfenix.com/",
        title: t("work.tecfenix.title"),
        logo: TecFenixLogo,
        start: "Jan 206",
        end: "Dec 2016",
        description: [t("work.tecfenix.description.1")],
      },
    ],
    skills: [
      "Java",
      "Python",
      "R",
      "C",
      "TypeScript",
      "JavaScript",
      "HTML/CSS",
      "MATLAB",
      "React Native",
      "SQL",
      "MongoDB",
      "CouchBase",
      "Docker",
      "AWS",
      "ETL Processes",
    ],
    projects: [
      {
        title: t("projects.blog.title"),
        techStack: ["Side Project", "TypeScript", "Next.js", "MDX"],
        description: t("projects.blog.description"),
        link: {
          label: "jsantanders.dev",
          href: "https://jsantanders.dev/",
        },
      },
    ],
  } as const;
};
