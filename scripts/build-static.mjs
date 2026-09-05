/**
 * Export estático em `out/`, o que vai ao ar na Cloudflare.
 *
 * Faz duas coisas em sequência:
 *   1. `next build` com `BUILD_TARGET=static`, que liga `output: "export"`;
 *   2. `flatten-rsc-segments.mjs`, que conserta os caminhos de prefetch.
 *
 * ⚠️ **Isto é um envoltório em Node, e não um `&&` no `package.json`, porque
 * `BUILD_TARGET=static next build` é sintaxe Unix e não roda no `cmd` do
 * Windows.** Antes era preciso lembrar de exportar a variável pelo bash e
 * chamar o binário do Next à mão, e quem esquecia gerava um build normal
 * achando que tinha gerado o export. Mesmo padrão de `scripts/dev.mjs`.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

/** Roda um comando e resolve quando ele termina bem; rejeita se falhar. */
function run(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { stdio: "inherit", env });

    child.on("exit", (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
        return;
      }
      if (code === 0) resolve();
      else reject(new Error(`Saiu com código ${code}: ${args[0]}`));
    });
  });
}

try {
  await run(
    [require.resolve("next/dist/bin/next"), "build", ...process.argv.slice(2)],
    { ...process.env, BUILD_TARGET: "static" },
  );

  // ⚠️ `fileURLToPath`, e não `URL.pathname`: no Windows o `pathname` vem como
  // `/C:/Users/Lucas%20Dias/…`, com barra à frente e espaço percent-encoded, e
  // o Node não resolve esse caminho.
  await run(
    [fileURLToPath(new URL("flatten-rsc-segments.mjs", import.meta.url))],
    { ...process.env },
  );
} catch (error) {
  console.error(`\n[build:static] ${error.message}`);
  process.exit(1);
}
