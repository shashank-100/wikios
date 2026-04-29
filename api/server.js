import express from "express";
import cors from "cors";
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

app.listen(PORT, () => {
  console.log(`WikiOS API running on port ${PORT}`);
});
