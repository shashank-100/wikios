import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";

const client = new Anthropic();

export async function queryWiki({ question, workspaceDir }) {
  const wikiDir = path.join(workspaceDir, "wiki");
  const index = await readFileOrEmpty(path.join(wikiDir, "index.md"));
  const log = await readFileOrEmpty(path.join(wikiDir, "log.md"));

  // Load all wiki pages for context
  const pages = await loadAllPages(wikiDir);

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: `You are a knowledge base assistant. Answer questions using only the content in the wiki pages provided.
Cite specific pages using [[page-name]] syntax. If the answer is not in the wiki, say so explicitly.`,
    messages: [
      {
        role: "user",
        content: `Wiki index:\n${index}\n\nWiki pages:\n${pages}\n\nQuestion: ${question}`,
      },
    ],
  });

  return response.content[0].text;
}

async function loadAllPages(wikiDir) {
  const sections = ["sources", "concepts", "entities", "analyses", "mocs"];
  const parts = [];

  for (const section of sections) {
    const sectionDir = path.join(wikiDir, section);
    try {
      const files = await fs.readdir(sectionDir);
      for (const file of files.filter((f) => f.endsWith(".md"))) {
        const content = await fs.readFile(path.join(sectionDir, file), "utf-8");
        parts.push(`--- ${section}/${file} ---\n${content}`);
      }
    } catch {
      // section doesn't exist yet
    }
  }

  return parts.join("\n\n");
}

async function readFileOrEmpty(filePath) {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}
