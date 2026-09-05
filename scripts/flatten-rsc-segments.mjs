/**
 * Achata os arquivos de prefetch por segmento do App Router, depois do export.
 *
 * ⚠️ **Isto contorna uma incompatibilidade do Next 16 com `output: "export"`.**
 * O export grava o payload RSC de cada segmento como pasta aninhada:
 *
 *     out/precos/__next.!KG1hcmtldGluZyk/precos/__PAGE__.txt
 *
 * mas em tempo de execução o cliente pede o mesmo recurso com o caminho
 * achatado por pontos:
 *
 *     /precos/__next.!KG1hcmtldGluZyk.precos.__PAGE__.txt
 *
 * Sem a cópia achatada, todo prefetch responde 404. O site continua
 * funcionando, porque o Next cai para navegação normal, mas perde a navegação
 * instantânea e polui o console com erros.
 *
 * O script **copia**, não move: as duas formas passam a existir, então nada que
 * dependa do formato em pasta quebra.
 *
 * ⚠️ **É um remendo contra o comportamento do framework.** Se um Next futuro
 * passar a gravar já achatado, este script vira ruído e deve sair. Para saber,
 * rode o build e veja se sobrou alguma pasta `__next.*`: se não sobrar, o
 * problema acabou.
 */
import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";

const OUT_DIR = "out";

/** Lista recursivamente os arquivos de um diretório. */
async function listFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await listFiles(full)));
    else found.push(full);
  }
  return found;
}

/** Diretórios de segmento (`__next.*`) em qualquer profundidade de `out/`. */
async function findSegmentDirs(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) found.push(full);
    // Uma pasta de segmento não contém outra: só desce no que não é segmento.
    else found.push(...(await findSegmentDirs(full)));
  }
  return found;
}

async function main() {
  if (!existsSync(OUT_DIR)) {
    console.error(
      `[flatten-rsc] "${OUT_DIR}/" não existe. Rode o export antes deste script.`,
    );
    process.exit(1);
  }

  const segmentDirs = await findSegmentDirs(OUT_DIR);
  let copied = 0;
  let skipped = 0;

  for (const segmentDir of segmentDirs) {
    // `out/precos/__next.!KG…`  ->  base `out/precos`, nome `__next.!KG…`
    const base = dirname(segmentDir);
    const segmentName = segmentDir.slice(base.length + 1);

    for (const file of await listFiles(segmentDir)) {
      // Caminho de dentro da pasta de segmento, achatado por pontos.
      const inner = relative(segmentDir, file).split(sep).join(".");
      const target = join(base, `${segmentName}.${inner}`);

      if (existsSync(target)) {
        skipped += 1;
        continue;
      }

      await mkdir(dirname(target), { recursive: true });
      await copyFile(file, target);
      copied += 1;
      console.log(`[flatten-rsc] ${relative(OUT_DIR, target)}`);
    }
  }

  const total = copied + skipped;
  if (total === 0) {
    console.log(
      "[flatten-rsc] Nenhum segmento em pasta encontrado. Se o Next passou a " +
        "gravar achatado, este script pode sair do build.",
    );
    return;
  }

  console.log(
    `[flatten-rsc] ${copied} cópia(s) criada(s), ${skipped} já existia(m).`,
  );
}

await main();
