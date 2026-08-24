import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ButtonLink } from "@/components/ui/button";

const navigation = [
  { href: "/#recursos", label: "Recursos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/precos", label: "Planos" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 glass border-x-0 border-t-0 rounded-none">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span
            className="grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground text-sm font-bold"
            aria-hidden="true"
          >
            R
          </span>
          RookHub
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
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
