import Link from "next/link";

import { site } from "@/lib/site";

const LINKS = [
  { label: "GitHub", href: site.social.github, external: true },
  { label: "LinkedIn", href: site.social.linkedin, external: true },
  { label: "Writing", href: "/blog", external: false },
  { label: "Projects", href: "/projects", external: false },
  { label: "résumé.pdf", href: site.resumePath, external: true },
  { label: "resume.json", href: "/resume.json", external: true },
  { label: "RSS", href: "/feed.xml", external: true },
  { label: "llms.txt", href: "/llms.txt", external: true },
  { label: "source", href: `${site.social.github}/cv`, external: true },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8 print:hidden">
      <div className="container-jn flex flex-wrap justify-between gap-x-6 gap-y-4 font-mono text-xs leading-relaxed text-muted-foreground">
        <span>
          jn&#8209;1 · {site.fullName} · &#169; {year}
        </span>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1.5">
          {LINKS.map((link) =>
            link.external ? (
              <a key={link.label} href={link.href} className="hover:text-primary">
                {link.label}
              </a>
            ) : (
              <Link key={link.label} href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            )
          )}
        </nav>

        <span>
          weights available on request —{" "}
          <a href={`mailto:${site.email}`} className="text-primary hover:text-amber">
            say hi
          </a>
        </span>
      </div>
    </footer>
  );
}
