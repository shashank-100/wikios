import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SECTIONS = ["sources", "concepts", "entities", "analyses", "mocs"];

export async function initWorkspace({ workspaceDir, schema = "default" }) {
  await fs.mkdir(workspaceDir, { recursive: true });

  const wikiDir = path.join(workspaceDir, "wiki");
  for (const section of SECTIONS) {
    await fs.mkdir(path.join(wikiDir, section), { recursive: true });
  }
  await fs.mkdir(path.join(workspaceDir, "raw"), { recursive: true });

  const now = new Date().toISOString();
  await fs.writeFile(
    path.join(wikiDir, "log.md"),
    `# Workspace Log\n\n- ${now}: Workspace initialized (schema: ${schema})\n`
  );
  await fs.writeFile(
    path.join(wikiDir, "index.md"),
    `# Wiki Index\n\n*No pages yet. Upload documents to get started.*\n`
  );

  // Read config from repo root (works both locally and on Vercel)
  const schemaSource = path.join(__dirname, "../../config/AGENTS.md");
  const schemaDest = path.join(workspaceDir, "AGENTS.md");
  await fs.copyFile(schemaSource, schemaDest).catch(() => {});

  return { ok: true, workspaceDir };
}
