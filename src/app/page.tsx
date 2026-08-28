import { CallToAction } from "@/components/marketing/cta";
import { Hero } from "@/components/marketing/hero";
import { Pillars } from "@/components/marketing/pillars";
import { PlansPreview } from "@/components/marketing/plans-preview";
import { ProblemSolution } from "@/components/marketing/problem-solution";
import { Profiles } from "@/components/marketing/profiles";
import { siteUrl } from "@/lib/env";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RookHub",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description:
    "Plataforma de gestão inteligente de frotas de veículos terrestres: assistente de IA, checklist digital offline, segurança na estrada e custo por quilômetro.",
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
      <ProblemSolution />
      <Pillars />
      <Profiles />
      <PlansPreview />
      <CallToAction />
    </>
  );
}
