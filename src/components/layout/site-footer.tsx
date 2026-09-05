import Link from "next/link";

import { TypingHeadline } from "@/components/layout/typing-headline";
import { FOOTER_HEADLINE } from "@/content/footer-headline";
import { cn } from "@/lib/utils";

const solutions = [
  { href: "/#perfis", label: "Transportadoras" },
  { href: "/#perfis", label: "Frota própria" },
  { href: "/#perfis", label: "Locadoras" },
];

const information = [
  { href: "/contato", label: "Seja um parceiro" },
  { href: "/contato", label: "Blog" },
  { href: "/#pilares", label: "Recursos" },
  { href: "/contato", label: "Contato" },
];

/**
 * Glifos oficiais de cada marca, não redesenhos: Instagram e YouTube vêm do
 * Simple Icons, LinkedIn do svgl (o Simple Icons não distribui mais esse).
 *
 * Cada um traz o próprio `viewBox` porque as fontes usam grades diferentes,
 * e reescalar `d` na mão é justamente o que deformava os desenhos antigos.
 * São marcas registradas: aqui valem como link para o perfil, e não podem
 * ser esticados, recortados nem recoloridos fora do tema.
 *
 * O `size` é correção óptica, não capricho: o LinkedIn é um bloco cheio que
 * ocupa a moldura inteira, enquanto o Instagram é traço vazado com folga nas
 * bordas. No mesmo tamanho de caixa o bloco pesa mais, então ele entra menor
 * para os três lerem com o mesmo peso na fileira.
 */
const social = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    viewBox: "0 0 24 24",
    size: "size-[18px]",
    path: "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    viewBox: "0 0 256 256",
    size: "size-[16px]",
    path: "M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    viewBox: "0 0 24 24",
    size: "size-[18px]",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

export function SiteFooter() {
  return (
    <footer className="surface-deep mt-auto overflow-hidden px-4 pt-14 sm:px-6 sm:pt-20">
      <div className="mx-auto w-full max-w-6xl">
        {/* Manchete com o símbolo da marca embutido na linha de texto, escrita
            à máquina quando o rodapé entra na tela. */}
        <TypingHeadline {...FOOTER_HEADLINE} />

        <div className="mt-14 grid gap-10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
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
                    <svg viewBox={item.viewBox} aria-hidden className={cn(item.size, "fill-current")}>
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
              em um só lugar, para que o prejuízo apareça enquanto ainda dá
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

        <div className="mt-14 flex flex-col items-start gap-8 sm:mt-16 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6">
          <div className="flex w-full items-center gap-4 rounded-[18px] border border-border bg-background p-4 pr-6 sm:w-auto">
            <div className="wf-placeholder size-24 shrink-0 p-0 text-xs">QR</div>
            <p className="max-w-[16ch] text-[15px] font-semibold leading-snug">
              Escaneie para baixar o aplicativo
            </p>
          </div>

          <p className="text-xs text-faint">
            © {new Date().getFullYear()} RookHub. Todos os direitos reservados.
          </p>
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
