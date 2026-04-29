import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import workspaceRoutes from "./routes/workspace.js";
import workspacesRoutes from "./routes/workspaces.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("ui"));

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/workspaces", workspacesRoutes);
app.use("/workspace", workspaceRoutes);

// Waitlist — appends emails to a local file (swap for Supabase/Resend in prod)
app.post("/waitlist", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) return res.status(400).json({ error: "valid email required" });
  const line = `${new Date().toISOString()},${email}\n`;
  await fs.appendFile(path.join(process.cwd(), "waitlist.csv"), line).catch(() => {});
  console.log(`Waitlist signup: ${email}`);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`WikiOS API running on port ${PORT}`);
});
