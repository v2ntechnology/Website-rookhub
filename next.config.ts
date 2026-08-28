import type { NextConfig } from "next";

/**
 * `BUILD_TARGET=static` produz o export estático em `out/` (deploy na Cloudflare).
 * Sem a variável, o build continua completo: SSR + Route Handlers do Stripe.
 */
const isStaticExport = process.env.BUILD_TARGET === "static";

const nextConfig: NextConfig = {
  // Os Route Handlers do Stripe se chamam `route.api.ts`. A extensão só entra em
  // `pageExtensions` no build completo — o export estático não suporta POST nem
  // leitura do request, então esses arquivos ficam fora dele.
  pageExtensions: isStaticExport ? ["tsx", "ts"] : ["tsx", "ts", "api.ts"],
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
