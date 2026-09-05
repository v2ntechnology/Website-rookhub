import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

/**
 * Duas barras, não uma barra adaptativa: no desktop é uma faixa única que
 * encaixa no topo e se solta ao rolar (`desktop-nav.tsx`); no mobile é uma
 * ilha com folha de navegação em tela cheia (`mobile-nav.tsx`). Mexeu em
 * uma, confira a outra.
 */
export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="md:hidden">
        <MobileNav />
      </div>

      <div className="hidden md:block">
        <DesktopNav />
      </div>
    </header>
  );
}
