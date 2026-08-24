import { CallToAction } from "@/components/marketing/cta";
import { Features } from "@/components/marketing/features";
import { Hero } from "@/components/marketing/hero";
import { siteUrl } from "@/lib/env";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RookHub",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description:
    "SaaS de gestão inteligente de frotas de caminhões para transportadoras: telemetria, manutenção preventiva e custo por quilômetro.",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: "249.00",
    highPrice: "1899.00",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Conteúdo estático controlado por nós, sem entrada de usuário.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Features />
      <CallToAction />
    </>
  );
}
