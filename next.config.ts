import type { NextConfig } from "next";

/**
 * `BUILD_TARGET=static` produz o export estático em `out/`, que é o que vai ao
 * ar na Cloudflare. Sem a variável, o build é o normal do Next.
 *
 * O site é inteiramente estático: não há Route Handler, Server Action nem
 * página que dependa de servidor.
 */
const isStaticExport = process.env.BUILD_TARGET === "static";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        // O otimizador de imagem exige servidor; no export as imagens são servidas
        // como estão (o site usa apenas SVGs do logotipo).
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
