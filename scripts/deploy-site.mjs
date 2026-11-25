/**
 * Publica a landing estática no repositório público teteuz/startup-marketplace-site (branch gh-pages).
 * O código-fonte continua só no repositório privado; aqui vão apenas os arquivos já gerados.
 *
 * Roda o build numa cópia temporária do projeto, então não quebra o `npm run dev` aberto.
 * Uso: npm run deploy
 */
import { cpSync, existsSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { execSync } from "node:child_process";

const SITE_REPO = "https://github.com/teteuz/startup-marketplace-site.git";
const BASE_PATH = "/startup-marketplace-site";
const SKIP = new Set(["node_modules", ".next", "out", ".git", ".claude"]);

const root = resolve(".");
const work = mkdtempSync(join(tmpdir(), "mkt-deploy-"));
const run = (cmd, cwd, env = {}) => execSync(cmd, { cwd, stdio: "inherit", env: { ...process.env, ...env } });

try {
  console.log(`→ copiando projeto para ${work}`);
  cpSync(root, work, { recursive: true, filter: (src) => !SKIP.has(basename(src)) || src === root });
  symlinkSync(join(root, "node_modules"), join(work, "node_modules"), "junction");

  console.log("→ gerando site estático");
  run("npx next build", work, { NEXT_BASE_PATH: BASE_PATH });

  const out = join(work, "out");
  if (!existsSync(join(out, "index.html"))) throw new Error("build sem index.html");
  writeFileSync(join(out, ".nojekyll"), "");

  const sha = execSync("git rev-parse --short HEAD", { cwd: root }).toString().trim();
  console.log("→ publicando em gh-pages");
  run("git init -q -b gh-pages", out);
  run("git add -A", out);
  run(`git -c user.name="deploy" -c user.email="deploy@localhost" commit -q -m "Site gerado a partir de ${sha}"`, out);
  run(`git push -f ${SITE_REPO} gh-pages`, out);
  console.log("✓ publicado: https://teteuz.github.io/startup-marketplace-site/");
} finally {
  rmSync(join(work, "node_modules"), { force: true, recursive: false });
  rmSync(work, { recursive: true, force: true });
}
