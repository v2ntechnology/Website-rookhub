import { Reveal } from "@/components/ui/reveal";

/**
 * Faixa de prova social. Cada logotipo é desenhado como máscara, não como
 * imagem: o arquivo vira a silhueta e a cor vem do tema. Assim logos de
 * origens diferentes ficam com o mesmo peso visual e funcionam nos dois
 * temas, sem precisar de uma versão branca e uma preta de cada um.
 *
 * Requisito do arquivo: fundo transparente. A máscara usa o canal alfa —
 * um PNG com fundo branco vira um retângulo sólido.
 */
const logos = [
  { name: "Amazonas", src: "/imgs/logoAmazonas.png", width: 150 },
  // Versão sem a placa branca de fundo — ver o comentário no arquivo.
  { name: "Servioeste", src: "/imgs/logoServioeste-mask.svg", width: 176 },
  { name: "Telecarga", src: "/imgs/LogoTelecarrga.svg", width: 132 },
];

export function TrustedBy() {
  return (
    <section aria-labelledby="prova-social" className="text-center">
      <h2 id="prova-social" className="type-headline-md text-muted">
        Confiado por equipes em
      </h2>

      <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
        {logos.map((logo, index) => (
          <li key={logo.name}>
            <Reveal delay={index * 120}>
              <span
                className="logo-mark"
                style={
                  {
                    "--logo": `url(${logo.src})`,
                    width: logo.width,
                  } as React.CSSProperties
                }
              >
                <span className="sr-only">{logo.name}</span>
              </span>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
