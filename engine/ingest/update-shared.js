import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";

const client = new Anthropic();

// After parallel ingest workers finish, coordinator updates shared files:
// wiki/index.md and all MOC pages. This runs serially to prevent race conditions.
export async function updateSharedFiles({ workspaceDir, ingestResults }) {
  const wikiDir = path.join(workspaceDir, "wiki");
  const indexPath = path.join(wikiDir, "index.md");

  const newPages = ingestResults.flatMap((r) => [
    r.source_page,
    ...(r.new_concept_pages || []),
    ...(r.new_entity_pages || []),
  ]).filter(Boolean);

  const currentIndex = await readFileOrEmpty(indexPath);

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `Update the wiki index to include these new pages. Return only the full updated index.md content.

Current index:
${currentIndex}

New pages added:
${newPages.map((p) => `- ${p.filename}`).join("\n")}`,
      },
    ],
  });

  await fs.mkdir(wikiDir, { recursive: true });
  await fs.writeFile(indexPath, response.content[0].text, "utf-8");
}

async function readFileOrEmpty(filePath) {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}
