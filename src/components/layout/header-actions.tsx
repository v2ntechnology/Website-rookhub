import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonClasses } from "@/components/ui/button";

/**
 * Ações do canto direito da barra do desktop: alternador de tema e CTA.
 *
 * A navegação não passa mais por aqui. Os links ficam expostos na própria
 * barra (`desktop-nav.tsx`), e o botão de menu existe só no mobile, onde a
 * largura não comporta a lista aberta.
 */
export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle className="size-11 rounded-full" />

      <Link
        href="/contato"
        className={buttonClasses("primary", "md", "h-11 rounded-full px-5")}
      >
        Solicitar demonstração
      </Link>
    </div>
  );
}
