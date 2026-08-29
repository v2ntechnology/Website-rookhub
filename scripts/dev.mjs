/**
 * `next dev` sem gerar AGENTS.md e CLAUDE.md na raiz.
 *
 * O Next 16 escreve esses dois arquivos ao subir o servidor de desenvolvimento
 * quando detecta que esta rodando dentro de um agente de IA. A deteccao e feita
 * pelo `@vercel/detect-agent`, e e puramente por variavel de ambiente: se
 * `CLAUDECODE`, `CURSOR_AGENT`, `CODEX_THREAD_ID` e afins existirem, ele
 * conclui que ha um agente e gera os arquivos.
 *
 * Nao existe opcao de configuracao para desligar isso. A logica esta em
 * `node_modules/next/dist/server/lib/generate-agent-files.js`, chamada por
 * `ensureAgentRulesForDev` em `server/lib/start-server.js`, e a unica condicao
 * de saida e `determineAgent()` responder que nao ha agente.
 *
 * Entao a saida e nao parecer um agente: este envoltorio remove essas variaveis
 * do ambiente do processo filho e chama o `next dev` normalmente. Nada mais
 * muda, e quem roda num terminal comum nao nota diferenca.
 *
 * As regras deste projeto vivem em `.claude/`, e e la que elas devem ser lidas.
 *
 * ⚠️ Isto vale so para o `dev`. O `next build` nao gera esses arquivos: o
 * `ensureAgentRulesForDev` e chamado apenas pelo servidor de desenvolvimento.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** Exatamente as variaveis lidas pelo @vercel/detect-agent. */
const AGENT_ENV_VARS = [
  "AI_AGENT",
  "ANTIGRAVITY_AGENT",
  "AUGMENT_AGENT",
  "CLAUDECODE",
  "CLAUDE_CODE",
  "CLAUDE_CODE_IS_COWORK",
  "CODEX_CI",
  "CODEX_SANDBOX",
  "CODEX_THREAD_ID",
  "COPILOT_ALLOW_ALL",
  "COPILOT_GITHUB_TOKEN",
  "COPILOT_MODEL",
  "CURSOR_AGENT",
  "CURSOR_EXTENSION_HOST_ROLE",
  "CURSOR_TRACE_ID",
  "GEMINI_CLI",
  "OPENCODE_CLIENT",
  "REPL_ID",
];

const env = { ...process.env };
for (const name of AGENT_ENV_VARS) {
  delete env[name];
}

const child = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "dev", ...process.argv.slice(2)],
  { stdio: "inherit", env },
);

child.on("exit", (code, signal) => {
  // Repassa o sinal para o Ctrl+C encerrar como se o next fosse o processo raiz.
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
