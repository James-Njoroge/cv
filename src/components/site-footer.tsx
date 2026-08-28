import Link from "next/link";

import { copy, fill } from "@/lib/copy";
import { site } from "@/lib/site";

const c = copy.footer;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8 print:hidden">
      <div className="container-jn flex flex-wrap justify-between gap-x-6 gap-y-4 font-mono text-xs leading-relaxed text-muted-foreground">
        <span>{fill(c.identity, { name: site.fullName, year })}</span>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1.5">
          {c.links.map((link) =>
            link.href.startsWith("/blog") || link.href.startsWith("/projects") ? (
              <Link key={link.label} href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="hover:text-primary">
                {link.label}
              </a>
            )
          )}
        </nav>

        <span>
          {c.closing}{" "}
          <a href={`mailto:${site.email}`} className="text-primary hover:text-amber">
            {c.closingLink}
          </a>
        </span>
      </div>
    </footer>
  );
}
