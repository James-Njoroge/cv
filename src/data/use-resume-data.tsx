import ColgateLogo from "@/images/logos/colgate.png";
import ManchesterLogo from "@/images/logos/manchester.png";
import choateLogo from "@/images/logos/choate.png";
import colgateJobLogo from "@/images/logos/colgate-work.png";
import marketingAfLogo from "@/images/logos/ma-logo.png";
import mdlzLogo from "@/images/logos/mdlz-logo.jpeg"
import { GitHubLogoIcon, EnvelopeOpenIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
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
    avatarUrl: "/images/headshot.jpg",
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
        {
          name: "Email",
          url: "mailto:jnjoroge@colgate.edu?subject=Contacting James via Website",
          icon: EnvelopeOpenIcon,
        },

      ],
    },
    education: [
      {
        school: t("education.bachelor.school"),
        degree: t("education.bachelor.major"),
        badges: [],
        start: "2021",
        end: "2025",
        logo: ColgateLogo,
      },
      {
        school: t("education.abroad.school"),
        degree: t("education.abroad.classes"),
        badges: [],
        start: "Sep 2023",
        end: "Jan 2024",
        logo: ManchesterLogo,
      },
      {
        school: t("education.highSchool.school"),
        degree: t("education.highSchool.degree"),
        badges: [],
        start: "2018",
        end: "2021",
        logo: choateLogo,
      },
    ],
    work: [
      {
        company: "Mondelez International",
        link: "https://www.mondelezinternational.com/",
        badges: ["PowerBI", "Tableau", "Oracle Essbase", "Python", "VBA"],
        title: t("work.mdlz.title"),
        logo: mdlzLogo,
        start: "Jun 2024",
        end: t("Aug 2024"),
        description: [
          t("work.mdlz.description.1"),
          t("work.mdlz.description.2"),
          t("work.mdlz.description.3"),
          t("work.mdlz.description.4"),
          t("work.mdlz.description.5"),
        ],
      },
      {
        company: "Colgate Centre for Learning, Teaching, and Research",
        link: "https://www.colgate.edu/about/offices-centers-institutes/centers-institutes/center-learning-teaching-and-research",
        badges: ["AI", "Academic Policy"],
        title: t("work.colgate-ai.title"),
        logo: mdlzLogo,
        start: "Aug 2024",
        end: t("Jun 2025"),
        description: [
          t("work.colgate-ai.description.1"),
          t("work.colgate-ai.description.2"),
        ],
      },
      {
        company: "Colgate Computer Science",
        link: "https://www.colgate.edu/academics/departments-programs/department-computer-science",
        badges: ["Data Structures & Algorithms"],
        title: t("work.colgate-ta.title"),
        logo: colgateJobLogo,
        start: "Jan 2023",
        end: t("Dec 2024"),
        description: [
          t("work.colgate-ta.description.1"),
          t("work.colgate-ta.description.2"),
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
        ],
      },
      {
        company: "Colgate IT Services",
        badges: ["IT"],
        link: "https://www.colgate.edu/about/offices-centers-institutes/information-technology-services",
        title: t("work.colgate-its.title"),
        logo: colgateJobLogo,
        start: "Aug 2021",
        end: t("present"),
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
        badges: ["First Internship"],
        link: "https://marketingafrica.co.ke/",
        title: t("work.marketing-africa.title"),
        logo: marketingAfLogo,
        start: "Jan 2017",
        end: "Dec 2017",
        description: [
          t("work.marketing-africa.description.1"),
          t("work.marketing-africa.description.2"),
          t("work.marketing-africa.description.3"),
          t("work.marketing-africa.description.4"),
        ],
      },
      {
        company: "Colgate Residential Services",
        badges: ["Leadership"],
        link: "https://www.colgate.edu/about/offices-centers-institutes/dean-college/residential-life",
        title: t("work.colgate-cl.title"),
        logo: colgateJobLogo,
        start: "Aug 2022",
        end: t("present"),
        description: [
          t("work.colgate-cl.description.1"),
          t("work.colgate-cl.description.2"),
          t("work.colgate-cl.description.3")
        ],
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
      "ReactNative",
      "SQL",
      "MongoDB",
      "CouchBase",
      "Docker",
      "AWS",
      "ETL Processes",
    ],
    coursework: [
      "Linear Algebra",
      "Data Structures and Algorithms",
      "Artificial Intelligence",
      "Computational Mathematics",
      "Real Analysis",
      "Numerical Analysis",
      "Database Management Systems",
      "Probability",
      "Calculus"
    ],
    projects: [
      {
        title: t("projects.sloop.title"),
        techStack: ["Startup", "ReactNative", "SQL", "JavaScript"],
        description: t("projects.sloop.description"),
        link: {
          label: "Sloop software",
          href: "https://www.colgate.edu/success-after-colgate/entrepreneurship-and-innovation/thought-action/thought-action-incubator",
        },
      },
      {
        title: t("projects.website.title"),
        techStack: ["Next.js", "Tailwind CSS", "TypeScript", "React"],
        description: t("projects.website.description"),
        link: {
          label: "Personal Website",
          href: "https://jnjoroge.dev/",
        }
      },
    ],
  } as const;
};
