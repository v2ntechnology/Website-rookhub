import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ButtonLink } from "@/components/ui/button";

const navigation = [
  { href: "/#recursos", label: "Recursos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/precos", label: "Planos" },
];

export function SiteHeader() {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="RookHub — página inicial"
          className="shrink-0"
        >
          <BrandLogo className="h-7 w-auto" />
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:bg-surface-container hover:text-foreground rounded-[var(--radius-control)] px-3 py-2 text-sm text-muted transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <ButtonLink href="/precos" size="sm">
            Assinar
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
