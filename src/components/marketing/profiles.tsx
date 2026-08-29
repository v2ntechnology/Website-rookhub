import { ProfilesTabs } from "@/components/marketing/profiles-tabs";
import { Reveal } from "@/components/ui/reveal";
import { Container, Section } from "@/components/ui/section";
import { SectionIntro } from "@/components/ui/section-intro";
import { PROFILES } from "@/content/profiles";

export function Profiles() {
  return (
    <Section id="perfis" className="surface-deep border-b-0">
      <Container>
        <Reveal>
          <SectionIntro
            eyebrow="Visões por perfil"
            ghost="Perfis"
            title={
              <>
                Cada pessoa abre o Rook<span className="text-brand">Hub</span> e
                vê o que precisa decidir.
              </>
            }
            description="Mesmo hub, quatro leituras. O dono não navega em tela de lançamento, e o operador não esbarra em número que não é dele — a permissão define o que existe na tela, não só o que está bloqueado nela."
          />
        </Reveal>

        <ProfilesTabs profiles={PROFILES} />
      </Container>
    </Section>
  );
}
