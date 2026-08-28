import Image from "next/image";
import Link from "next/link";

import { HeaderActions } from "@/components/layout/header-actions";

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 sm:px-5">
      <div className="flex items-start justify-between py-3">
        <Link
          href="/"
          aria-label="RookHub — página inicial"
          className="nav-capsule pointer-events-auto flex items-center gap-3 p-2 pr-5"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-brand">
            <Image
              src="/imgs/logoOfficialBranca.svg"
              alt=""
              width={34}
              height={40}
              className="h-5 w-auto"
              priority
            />
          </span>
          <span className="font-display text-[15px] font-bold tracking-[-0.01em]">
            RookHub
          </span>
        </Link>

        <div className="pointer-events-auto">
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}
