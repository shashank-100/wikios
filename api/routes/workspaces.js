import express from "express";
import { initWorkspace } from "../services/workspace-init.js";
import path from "path";
import fs from "fs/promises";

const router = express.Router();

// POST /workspaces — create a new workspace
router.post("/", express.json(), async (req, res) => {
  const { name, schema } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });

  const id = slugify(name) + "-" + Date.now();
  const workspaceDir = path.join(process.cwd(), "workspaces", id);

  try {
    await initWorkspace({ workspaceDir, schema });
    res.json({ id, name, workspaceDir });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /workspaces — list all workspaces
router.get("/", async (req, res) => {
  const dir = path.join(process.cwd(), "workspaces");
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const workspaces = entries
      .filter((e) => e.isDirectory())
      .map((e) => ({ id: e.name }));
    res.json(workspaces);
  } catch {
    res.json([]);
  }
});

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default router;
