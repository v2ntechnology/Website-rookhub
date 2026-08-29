import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";

const solutions = [
  { href: "/#perfis", label: "Transportadoras" },
  { href: "/#perfis", label: "Frota própria" },
  { href: "/#perfis", label: "Locadoras" },
];

const information = [
  { href: "/#contato", label: "Seja um parceiro" },
  { href: "/#contato", label: "Blog" },
  { href: "/#pilares", label: "Recursos" },
  { href: "/#contato", label: "Contato" },
];

const social = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.68.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2a3.7 3.7 0 0 1-.9 1.4c-.4.4-.8.68-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.6.5-1 .9-1.4.4-.42.8-.68 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6Zm6.9-11.1a1.55 1.55 0 1 1-3.1 0 1.55 1.55 0 0 1 3.1 0Z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: "M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.2 8.4h3.5V21H3.2V8.4Zm5.7 0h3.36v1.72h.05c.47-.88 1.6-1.8 3.3-1.8 3.53 0 4.19 2.3 4.19 5.3V21h-3.5v-6.4c0-1.53-.03-3.5-2.15-3.5-2.15 0-2.48 1.66-2.48 3.39V21H8.9V8.4Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.77 2 12 2 12s0 3.23.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77c.4-1.57.4-4.8.4-4.8s0-3.23-.4-4.8ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z",
  },
];

export function SiteFooter() {
  return (
    <footer className="surface-deep mt-auto overflow-hidden px-4 pt-20 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* Manchete com o símbolo da marca embutido na linha de texto. */}
        <p className="type-display-hero flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
          <span>O futuro da frota</span>
          <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span>é</span>
            <span
              aria-hidden
              className="inline-flex size-[0.95em] items-center justify-center rounded-[0.22em] bg-foreground"
            >
              <Image
                src="/imgs/logoOfficialBranca.svg"
                alt=""
                width={40}
                height={48}
                className="h-[0.5em] w-auto dark:invert"
              />
            </span>
            <span>inteligente</span>
          </span>
        </p>

        <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
          <nav aria-label="Soluções">
            <h2 className="text-[15px] text-muted">Soluções</h2>
            <ul className="mt-5 space-y-3">
              {solutions.map((link) => (
                <li key={link.label} className="flex items-center gap-3">
                  <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-foreground" />
                  <Link href={link.href} className="text-[15px] font-semibold hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Informações">
            <h2 className="text-[15px] text-muted">Informações</h2>
            <ul className="mt-5 space-y-3">
              {information.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[15px] font-semibold hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[15px] text-muted">Nos acompanhe</h2>
            <ul className="mt-5 flex gap-3">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="flex size-11 items-center justify-center rounded-full border border-border text-foreground hover:bg-surface-container"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] fill-current">
                      <path d={item.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[15px] leading-relaxed text-body text-pretty">
              Somos o hub que reúne telemetria, combustível, multas e manutenção
              em um só lugar — para que o prejuízo apareça enquanto ainda dá
              para estancar, e não no fechamento do mês.
            </p>
            <p className="mt-8 text-sm text-muted">
              Fale com a gente:{" "}
              <a href="mailto:contato@rookhub.com.br" className="font-semibold text-foreground hover:underline">
                contato@rookhub.com.br
              </a>
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4 rounded-[18px] border border-border bg-background p-4 pr-6">
            <div className="wf-placeholder size-24 shrink-0 p-0 text-xs">QR</div>
            <p className="max-w-[16ch] text-[15px] font-semibold leading-snug">
              Escaneie para baixar o aplicativo
            </p>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <p className="text-xs text-faint">
              © {new Date().getFullYear()} RookHub. Todos os direitos reservados.
            </p>
          </div>
        </div>

        {/* Wordmark de fecho: sangra para fora do viewport, como assinatura. */}
        <p
          aria-hidden
          className="mt-12 -mb-[0.28em] select-none text-center font-display font-bold leading-[0.8] tracking-[-0.04em] text-foreground"
          style={{ fontSize: "clamp(88px, 22vw, 260px)" }}
        >
          rook<span className="text-brand">hub</span>
        </p>
      </div>
    </footer>
  );
}
