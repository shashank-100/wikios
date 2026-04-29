import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";

const client = new Anthropic();

// Enrich pass: find shallow pages and deepen them.
// Runs after initial ingest when the wiki has grown enough to see cross-connections.
export async function enrichWiki({ workspaceDir }) {
  const wikiDir = path.join(workspaceDir, "wiki");
  const pages = await loadAllPages(wikiDir);

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: `You are a knowledge base maintainer doing an enrichment pass.
Find pages that are shallow (under 300 words) or missing cross-links to related pages.
For each such page, return an improved version.

Respond with JSON:
{
  "enriched_pages": [{ "filename": "wiki/...", "content": "..." }],
  "summary": "what was enriched and why"
}`,
    messages: [
      {
        role: "user",
        content: `Wiki pages to review:\n\n${pages}`,
      },
    ],
  });

  const result = JSON.parse(response.content[0].text);

  for (const page of result.enriched_pages || []) {
    const fullPath = path.join(workspaceDir, page.filename);
    await fs.writeFile(fullPath, page.content, "utf-8");
  }

  return result.summary;
}

async function loadAllPages(wikiDir) {
  const sections = ["sources", "concepts", "entities"];
  const parts = [];

  for (const section of sections) {
    const sectionDir = path.join(wikiDir, section);
    try {
      const files = await fs.readdir(sectionDir);
      for (const file of files.filter((f) => f.endsWith(".md"))) {
        const content = await fs.readFile(path.join(sectionDir, file), "utf-8");
        parts.push(`--- ${section}/${file} ---\n${content}`);
      }
    } catch {}
  }

  return parts.join("\n\n");
}
