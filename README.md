# WikiOS

**AI-maintained living knowledge base for enterprises.**

Drop in documents. Get back a self-updating, deeply interlinked knowledge graph that compounds over time.

## What it does

- Ingest PDFs, URLs, Google Drive, Confluence, Notion
- Automatically creates structured wiki pages with cross-links
- New documents link to everything that already exists
- Multiple users can add docs simultaneously (parallel-safe)
- Knowledge compounds — each new doc enriches the whole graph

## Target verticals

- **Legal** — case law, contracts, internal memos
- **Pharma** — clinical trials, research papers, internal studies
- **Finance** — market research, filings, internal analysis

## Stack

- **Engine** — Claude API (claude-sonnet-4-6) for ingestion and maintenance
- **API** — Node.js / Express
- **UI** — React
- **Storage** — Git-backed wiki vault + Supabase for metadata
- **Queue** — Job queue for parallel ingest workers

## Structure

```
engine/          # Core AI maintenance system
  ingest/        # Document ingestion pipeline
  workflows/     # Playbooks for create/enrich/audit/query
  procedures/    # Shared reusable procedures

api/             # REST API
  routes/        # Endpoints
  services/      # Business logic

ui/              # Web frontend
  src/

config/          # Workspace schemas (AGENTS.md per vertical)
docs/            # Internal documentation
```

## Getting started

```bash
cp .env.example .env
# Add your ANTHROPIC_API_KEY
npm install
npm run dev
```
