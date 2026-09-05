import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import { BackToTop } from "@/components/layout/back-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { siteUrl } from "@/lib/env";

import "./globals.css";

// Estratégia de duas famílias do DESIGN.md: Sora para títulos, Inter para
// corpo e UI. Auto-hospedadas pelo next/font, sem requisição externa.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RookHub, Gestão inteligente de frotas",
    template: "%s · RookHub",
  },
  description:
    "Plataforma que reúne checklist digital, manutenção preventiva, segurança na estrada e custo por quilômetro em um só hub, para frotas de qualquer tipo de veículo terrestre.",
  keywords: [
    "gestão de frotas",
    "software de gestão de frota",
    "telemetria veicular",
    "manutenção preventiva",
    "custo por quilômetro",
  ],
  alternates: { canonical: "/" },
  /* O ícone da aba é o próprio símbolo da marca, escolhido pelo tema do
     navegador: o colorido sobre aba clara, o branco sobre aba escura. São os
     mesmos arquivos que o site usa, e não cópias, então mexer no símbolo
     atualiza a aba junto.
     ⚠️ Isto substitui a convenção `app/icon.svg`, que foi removida: mantida,
     ela geraria um terceiro `<link rel="icon">` sem `media`, e o navegador
     poderia preferi-lo aos dois de baixo. */
  icons: {
    icon: [
      {
        url: "/images/rookhub-symbol-dark.svg",
        media: "(prefers-color-scheme: light)",
        type: "image/svg+xml",
      },
      {
        url: "/images/rookhub-symbol-white.svg",
        media: "(prefers-color-scheme: dark)",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "RookHub",
    title: "RookHub, Gestão inteligente de frotas",
    description:
      "Checklist digital, manutenção preventiva e custo por quilômetro em um só hub.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex-1 pt-[var(--header-h)]">{children}</main>
          <SiteFooter />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
