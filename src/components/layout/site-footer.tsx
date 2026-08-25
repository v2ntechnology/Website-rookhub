import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BrandLogo className="h-6 w-auto" />
          <p className="mt-3">
            © {new Date().getFullYear()} RookHub · Gestão inteligente de frotas
          </p>
        </div>
        <nav aria-label="Rodapé" className="flex gap-5">
          <Link href="/precos" className="hover:text-foreground">
            Planos
          </Link>
          <Link href="/#recursos" className="hover:text-foreground">
            Recursos
          </Link>
          <a
            href="mailto:contato@rookhub.com.br"
            className="hover:text-foreground"
          >
            Contato
          </a>
        </nav>
      </div>
    </footer>
  );
}
