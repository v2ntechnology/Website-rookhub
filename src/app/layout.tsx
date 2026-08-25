import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { siteUrl } from "@/lib/env";

import "./globals.css";

// Estratégia de duas famílias do DESIGN.md: Sora para títulos, Inter para
// corpo e UI. Auto-hospedadas pelo next/font — sem requisição externa.
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
    default: "RookHub — Gestão inteligente de frotas de caminhões",
    template: "%s · RookHub",
  },
  description:
    "Plataforma SaaS que reúne telemetria, manutenção preventiva e custo por quilômetro em um só painel para transportadoras.",
  keywords: [
    "gestão de frotas",
    "software para transportadora",
    "telemetria de caminhões",
    "manutenção preventiva",
    "custo por quilômetro",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "RookHub",
    title: "RookHub — Gestão inteligente de frotas de caminhões",
    description:
      "Telemetria, manutenção preventiva e custo por quilômetro em um só painel.",
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
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
