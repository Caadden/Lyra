========================================

**Lyra** - [View How it Works!](https://trylyra.vercel.app/how-it-works)

A thesis-driven lyric analysis engine.

Lyra is a web application that performs structured, close-reading literary analysis on song lyrics. It generates arguable interpretations grounded in textual evidence, treating lyrics with the same rigor as poetry.

========================================

**Overview**

Most lyric analysis online is either:
- Surface-level summaries
- Overly academic and inaccessible
- Purely opinion-driven

*Lyra bridges that gap.*

It produces:

- A central thesis
- Emotional trajectory mapping
- Recurring motif analysis
- Highlighted rhetorical devices
- A universal thematic takeaway
- A calibrated complexity score

All from raw lyrical input.

========================================

**How It Works**

Input Validation

Rejects placeholders and non-lyrical content

Cleans structural markers (e.g., [Chorus], [Verse])

Close Reading Engine

Uses a constrained system prompt

Enforces thesis-first interpretation

Anchors insights in evidence fragments

Structured Output Schema


<pre>Returns:

{

  "core_insight": {},
  
  "mood_arc": {},
  
  "key_motifs": [],
  
  "lyrical_highlights": [],
  
  "takeaway": {},
  
  "ui_optimized": {}
  
}</pre>

Expressive UI Reveal

Typewriter thesis reveal

Scroll-triggered spotlight sections

Ambient motion background

Dynamic visual polish based on interpretation

========================================

**Tech Stack**

Frontend

Next.js (App Router)

React

TailwindCSS

Framer Motion

Backend

Next.js API Routes

DeepSeek API (LLM inference)

Architecture Principles

Stateless processing (no lyric storage)

Abortable requests

Structured AI output

Prompt-injection mitigation

UI-driven emotional pacing


========================================

**Privacy & Storage**

Lyrics are not stored

Analyses are not persisted

Requests are processed in-memory

No database required

Users are advised not to submit sensitive personal information.

========================================

**Complexity Scoring**

Lyra assigns a calibrated complexity_score (1–5) based on:

- Structural layering

- Metaphorical density

- Thematic ambiguity

- Emotional arc progression

- Motif recurrence

*This score is not objective and solely designed for UI and discovery features.*

========================================

**Future Directions**

Artist theme profiles

Shareable analysis links

Multi-lens interpretation modes

Public discovery feed

Cached inference layer

Performance optimizations for long-form lyrics

========================================

**Why Lyra Exists**

Lyra started as a passion project exploring how AI can enhance literary interpretation rather than replace it.

Music has layers.
Lyra makes those layers visible.
