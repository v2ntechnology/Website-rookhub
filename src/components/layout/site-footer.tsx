import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} RookHub · Gestão inteligente de frotas</p>
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
