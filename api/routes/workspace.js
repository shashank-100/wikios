import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { ingestDocument } from "../../engine/ingest/ingest.js";
import { batchIngest } from "../../engine/ingest/batch-ingest.js";
import { queryWiki } from "../../engine/workflows/query.js";
import { enrichWiki } from "../../engine/workflows/enrich.js";
import { gapAnalysis } from "../../engine/workflows/procedures/gap-analysis.js";

const router = express.Router();

// Vercel serverless has a read-only filesystem — use memory storage there
const upload = multer({ storage: multer.memoryStorage() });

// POST /workspace/:id/ingest — upload one or more documents
router.post("/:id/ingest", upload.array("files"), async (req, res) => {
  const workspaceDir = getWorkspaceDir(req.params.id);
  const files = req.files;

  if (!files?.length) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  // Write buffers to /tmp (writable on Vercel) then ingest from there
  const tmpDir = path.join("/tmp", `wikios-${Date.now()}`);
  await fs.mkdir(tmpDir, { recursive: true });
  const tmpPaths = [];

  try {
    for (const file of files) {
      const tmpPath = path.join(tmpDir, file.originalname);
      await fs.writeFile(tmpPath, file.buffer);
      tmpPaths.push(tmpPath);
    }

    if (tmpPaths.length === 1) {
      const result = await ingestDocument({ filePath: tmpPaths[0], workspaceDir });
      res.json({ ok: true, result });
    } else {
      const result = await batchIngest({ filePaths: tmpPaths, workspaceDir });
      res.json({ ok: true, result });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    for (const p of tmpPaths) await fs.unlink(p).catch(() => {});
    await fs.rmdir(tmpDir).catch(() => {});
  }
});

// POST /workspace/:id/query — ask a question against the wiki
router.post("/:id/query", express.json(), async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "question required" });

  try {
    const answer = await queryWiki({
      question,
      workspaceDir: getWorkspaceDir(req.params.id),
    });
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /workspace/:id/enrich — run enrichment pass
router.post("/:id/enrich", async (req, res) => {
  try {
    const summary = await enrichWiki({
      workspaceDir: getWorkspaceDir(req.params.id),
    });
    res.json({ ok: true, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /workspace/:id/pages — list all wiki pages
router.get("/:id/pages", async (req, res) => {
  const wikiDir = path.join(getWorkspaceDir(req.params.id), "wiki");
  const sections = ["sources", "concepts", "entities", "analyses", "mocs"];
  const pages = {};

  for (const section of sections) {
    try {
      const files = await fs.readdir(path.join(wikiDir, section));
      pages[section] = files.filter((f) => f.endsWith(".md")).map((f) => f.replace(".md", ""));
    } catch {
      pages[section] = [];
    }
  }

  res.json(pages);
});

// GET /workspace/:id/pages/:section/:slug — read a single page
router.get("/:id/pages/:section/:slug", async (req, res) => {
  const { id, section, slug } = req.params;
  const filePath = path.join(getWorkspaceDir(id), "wiki", section, `${slug}.md`);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    res.json({ slug, section, content });
  } catch {
    res.status(404).json({ error: "Page not found" });
  }
});

// GET /workspace/:id/gap-analysis — find what's missing
router.get("/:id/gap-analysis", async (req, res) => {
  try {
    const result = await gapAnalysis({
      workspaceDir: getWorkspaceDir(req.params.id),
      domain: req.query.domain,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getWorkspaceDir(id) {
  const base = process.env.VERCEL === "1" ? "/tmp" : path.join(process.cwd(), "workspaces");
  return path.join(base, id);
}

export default router;
