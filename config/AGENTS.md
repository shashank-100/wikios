# WikiOS Agent Configuration

This file defines the schema and behavior for the AI maintenance system.
Each workspace can customize this file for their vertical.

## Page Types

### source
A processed document (PDF, URL, internal report).

**Required frontmatter:**
```yaml
type: source
title: ""
date_ingested: ""        # ISO date
original_file: ""        # path to raw asset
source_url: ""           # optional
tags: []
```

**Depth standard:** 500–1500 words. Must include: summary, key concepts extracted, entities mentioned, connections to existing pages.

### concept
A cross-cutting idea or theme that appears across multiple sources.

**Required frontmatter:**
```yaml
type: concept
title: ""
related_sources: []
related_entities: []
tags: []
```

**Depth standard:** 800–2000 words. Must include: definition, how different sources treat it, open questions, connections.

### entity
An organization, person, product, or system referenced across sources.

**Required frontmatter:**
```yaml
type: entity
title: ""
entity_type: ""          # org | person | product | system
appearances: []          # list of source pages
tags: []
```

### analysis
A synthesis page examining relationships, trends, or comparisons across sources.

**Required frontmatter:**
```yaml
type: analysis
title: ""
sources_analyzed: []
last_updated: ""
tags: []
```

### moc
Map of Content — a guided reading path through the wiki.

**Required frontmatter:**
```yaml
type: moc
title: ""
theme: ""
pages: []
tags: []
```

## Linking rules

- Every mention of a concept, entity, or source page must be a `[[wiki-link]]`
- When creating a new page, scan existing pages for mentions and add backlinks
- No orphan pages — every page must be linked from at least one other page

## File ownership during parallel ingest

**Coordinator-only (subagents must not edit):**
- `wiki/log.md`
- `wiki/index.md`
- All MOC pages
- All analysis pages
- `raw/index.md`
- `AGENTS.md`
- `README.md`

**Per-document (subagent owns during ingest):**
- `wiki/sources/<document-slug>.md`
- New concept/entity pages created from this document

## Diagrams

Use Mermaid for all architecture and flow diagrams. No image files.

## Math

Use `$...$` for inline math, `$$...$$` for display math.
