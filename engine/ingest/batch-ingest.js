import { ingestDocument } from "./ingest.js";
import { updateSharedFiles } from "./update-shared.js";

// Ingest multiple documents in parallel, then consolidate shared files.
// Each document gets its own isolated subagent (separate ingestDocument call).
// Shared files (index, log, MOCs) are only touched by the coordinator after all workers finish.
export async function batchIngest({ filePaths, workspaceDir, schema }) {
  const results = await Promise.allSettled(
    filePaths.map((filePath) =>
      ingestDocument({ filePath, workspaceDir, schema })
    )
  );

  const succeeded = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  const failed = results
    .filter((r) => r.status === "rejected")
    .map((r, i) => ({ file: filePaths[i], error: r.reason?.message }));

  await updateSharedFiles({ workspaceDir, ingestResults: succeeded });

  return { succeeded: succeeded.length, failed };
}
