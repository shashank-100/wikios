import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";

const client = new Anthropic();

// Gap analysis: identify topics the wiki should cover but doesn't yet.
// Useful prompt for design partners: "what's missing from your knowledge base?"
export async function gapAnalysis({ workspaceDir, domain }) {
  const wikiDir = path.join(workspaceDir, "wiki");
  const index = await readFileOrEmpty(path.join(wikiDir, "index.md"));
  const concepts = await listPages(path.join(wikiDir, "concepts"));
  const sources = await listPages(path.join(wikiDir, "sources"));

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `You are auditing a knowledge base in the domain: ${domain || "general"}.

Current wiki index:
${index}

Existing concept pages: ${concepts.join(", ")}
Existing source pages: ${sources.join(", ")}

Identify:
1. Topics that should exist but don't
2. Concepts mentioned in sources but without their own page
3. Relationships between existing pages that haven't been drawn yet

Respond as JSON:
{
  "missing_concepts": ["..."],
  "missing_relationships": ["source A connects to source B via ..."],
  "recommended_next_sources": ["type of document that would fill the biggest gap"]
}`,
      },
    ],
  });

  return JSON.parse(response.content[0].text);
}

async function listPages(dir) {
  try {
    const files = await fs.readdir(dir);
    return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(".md", ""));
  } catch {
    return [];
  }
}

async function readFileOrEmpty(filePath) {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}
