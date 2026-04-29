import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const client = new Anthropic();

export async function ingestDocument({ filePath, workspaceDir, schema }) {
  const slug = slugify(path.basename(filePath, path.extname(filePath)));
  const rawContent = await fs.readFile(filePath);
  const isText = filePath.endsWith(".txt") || filePath.endsWith(".md");
  const fileContent = isText ? rawContent.toString("utf-8") : rawContent.toString("base64");

  const agentsConfig = await fs.readFile(
    path.join(workspaceDir, "config", "AGENTS.md"),
    "utf-8"
  );
  const wikiIndex = await readFileOrEmpty(path.join(workspaceDir, "wiki", "index.md"));
  const existingConcepts = await listPageTitles(path.join(workspaceDir, "wiki", "concepts"));
  const existingEntities = await listPageTitles(path.join(workspaceDir, "wiki", "entities"));

  const systemPrompt = `You are an AI knowledge base maintainer. Your job is to ingest a document and produce structured wiki pages.

Follow these rules exactly:
${agentsConfig}

Existing concepts in the wiki: ${existingConcepts.join(", ") || "none yet"}
Existing entities in the wiki: ${existingEntities.join(", ") || "none yet"}

When you reference an existing concept or entity, use [[wiki-link]] syntax.
When you identify a new concept or entity, create a page for it.

Respond with a JSON object with this structure:
{
  "source_page": { "filename": "wiki/sources/<slug>.md", "content": "..." },
  "new_concept_pages": [{ "filename": "wiki/concepts/<slug>.md", "content": "..." }],
  "new_entity_pages": [{ "filename": "wiki/entities/<slug>.md", "content": "..." }],
  "updated_entity_pages": [{ "filename": "wiki/entities/<slug>.md", "content": "..." }],
  "log_entry": "one-line summary of what was ingested"
}`;

  const userMessage = isText
    ? `Ingest this document (slug: ${slug}):\n\n${fileContent}`
    : `Ingest this document (slug: ${slug}). The file is base64-encoded:\n\n${fileContent}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const result = JSON.parse(response.content[0].text);
  await writeIngestResult(workspaceDir, result);
  return result;
}

async function writeIngestResult(workspaceDir, result) {
  const pages = [
    result.source_page,
    ...(result.new_concept_pages || []),
    ...(result.new_entity_pages || []),
    ...(result.updated_entity_pages || []),
  ].filter(Boolean);

  for (const page of pages) {
    const fullPath = path.join(workspaceDir, page.filename);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, page.content, "utf-8");
  }

  if (result.log_entry) {
    const logPath = path.join(workspaceDir, "wiki", "log.md");
    const timestamp = new Date().toISOString();
    await fs.appendFile(logPath, `\n- ${timestamp}: ${result.log_entry}`);
  }
}

async function readFileOrEmpty(filePath) {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

async function listPageTitles(dir) {
  try {
    const files = await fs.readdir(dir);
    return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(".md", ""));
  } catch {
    return [];
  }
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
