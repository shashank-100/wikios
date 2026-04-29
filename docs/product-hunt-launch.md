# WikiOS — Product Hunt Launch Kit

## Listing details

**Name:** WikiOS

**Tagline:**
> The knowledge base that maintains itself

**Topics:** Productivity, Artificial Intelligence, Developer Tools, SaaS, No Code

---

## Short description (180 chars)
Drop in PDFs and docs. WikiOS builds a living, interlinked knowledge graph that grows smarter with every document — zero manual maintenance.

---

## Full description

Most knowledge bases die within 6 months. Someone has to keep them updated. Nobody does.

**WikiOS is different.** Drop in a document and an AI agent automatically:
- Creates structured wiki pages (sources, concepts, entities)
- Links every new page to everything that already exists
- Finds conflicts and gaps across your documents
- Keeps the whole graph current as new docs arrive

You get a knowledge base that **compounds** — the more you add, the smarter it gets, and the connections are made for you.

**Who it's for:**
- Legal teams drowning in case law, contracts, and memos
- Pharma researchers tracking clinical trials and internal studies
- Finance teams managing market research and filings
- Any team whose Notion/Confluence wiki has turned into a graveyard

**How it works:**
1. Upload a PDF, paste a URL, or connect Google Drive / Confluence
2. WikiOS extracts concepts, entities, and relationships
3. Everything gets cross-linked to what already exists
4. Ask questions in plain language — get cited answers from across the whole base

**What makes it different:**
The core insight comes from Andrej Karpathy's "LLM Wiki pattern" — treating the AI as an active *maintainer*, not just a retriever. The knowledge base is a compounding asset. Each document enriches the whole graph.

**Built on:** Claude (Anthropic) · Node.js · Git-backed wiki vault

**Open source engine** — self-host with your own Anthropic API key, or use our cloud-hosted version.

We're in beta and looking for design partners in legal, pharma, and finance. Reach out.

---

## First comment (post immediately after launch)

Hey PH! 👋

I built WikiOS after watching my own research notes turn into an unmaintainable mess.

The core problem: knowledge bases require constant upkeep — updating links, creating cross-references, finding connections between new and old documents. Nobody has time for that, so the wiki rots.

The insight is from Andrej Karpathy's LLM Wiki pattern: the "tedious" part (bookkeeping, cross-linking, maintaining indexes) is exactly what LLMs are good at. So let them do it.

WikiOS is the productized version of that pattern. You drop in documents; the AI handles all the maintenance work.

We have a working demo in the app — try uploading a few PDFs and asking a question across them.

Happy to answer anything about how it works under the hood. What vertical would you most want to see this in first?

---

## Gallery images (descriptions for designer)

1. **Hero screenshot** — Dark UI, wiki page open showing cross-linked legal document with [[wiki-link]] syntax highlighted in purple. Sidebar shows sources/concepts/entities.

2. **Ingest flow** — Split screen: left shows drag-and-drop upload zone with 3 PDFs being dropped in. Right shows the resulting wiki pages created with cross-links animated in.

3. **Q&A screenshot** — Query box with "What indemnification clauses conflict across merger docs?" typed in. Answer shown below with [[wiki-links]] cited inline.

4. **Graph view** (future) — Force-directed graph of the knowledge base nodes and edges.

5. **Vertical comparison** — Three columns: Legal / Pharma / Finance, each showing sample page types and what gets extracted.

---

## Maker badges to apply for
- [ ] Open Source
- [ ] Built with Claude / Anthropic

---

## Launch checklist

- [x] GitHub repo public — https://github.com/shashank-100/wikios
- [x] .env.example committed (no secrets)
- [x] vercel.json ready for one-click deploy
- [ ] Landing page live — deploy ui/ to Vercel (run: `npx vercel` in /wikios)
- [ ] Demo workspace seeded with sample docs
- [ ] Record a 60s demo GIF (Loom or Kap) — upload → wiki pages appearing + Q&A
- [ ] PH listing scheduled for Tuesday 12:01am PST (highest traffic day)
- [ ] Post in relevant Slack/Discord communities morning of launch
- [ ] Tag @karpathy on X (LLM Wiki pattern credit)
- [ ] Email any beta users to upvote
- [ ] Reply to every comment within first 2 hours

---

## Communities to post in (launch day)

- Hacker News: Show HN post
- r/artificial · r/ChatGPT · r/legaltech · r/pharmaindustry
- Indie Hackers
- AI Twitter/X thread (tag @karpathy given the LLM Wiki pattern credit)
